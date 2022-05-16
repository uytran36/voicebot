import React, { useState, useMemo, useCallback, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Row, Col, Typography, Button, Form } from 'antd';
import CustomDatePicker from '@/components/CustomDatePicker';
import { StackedColumnChart } from '@/components/Chart';
import { Export } from '@/components/Icons';
import SelectDateTime from '@/components/SelectDateTime';
import { TableAdvance, constant } from '../components/Table';
import { requestReportChatDetail, requestExportReportChatDetail } from '@/services/chat';
import { checkPermission, OMNI_CHAT_INBOUND } from '@/utils/permission';

export default connect(({ user }) => ({ user }))(function NumberOfChat({ user }) {
  const headers = useMemo(
    () => ({
      // 'X-Auth-Token': user.authToken,
      // 'X-User-Id': user.userId,
      Authorization: `${user.tokenGateway}`,
    }),
    [user.authToken, user.tokenGateway, user.userId],
  );
  const dateFormat = 'YYYY-MM-DD';
  const [paramsTable, setParamsTable] = useState({});
  const [reportFacebook, setReportFacebook] = useState(false);
  const [reportZalo, setReportZalo] = useState(false);
  const [reportLivechat, setReportLivechat] = useState(false);
  const [paramsFilter, setParamsFilter] = useState({
    startDate: moment().startOf('day').format(dateFormat),
    endDate: moment().startOf('day').format(dateFormat),
    typeChart: 'HOURS',
    dateDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'days'),
    monthDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'months'),
  });

  const [dataReportChatDetail, setDataReportChatDetail] = useState([]);

  const handleExportDataChat = useCallback(async () => {
    try {
      const res = await requestExportReportChatDetail(headers, {
        beginDate: paramsFilter.startDate,
        closedDate: paramsFilter.endDate,
        typeChart: paramsFilter.typeChart,
        subId: user.wsId,
      });
      console.log(res);
      return null;
    } catch (err) {
      console.log(err);
    }
  }, [paramsFilter, headers]);

  useEffect(() => {
    setReportFacebook(
      checkPermission(user?.currentUser?.permissions, OMNI_CHAT_INBOUND.accessFacebookReport),
    );
    setReportZalo(
      checkPermission(user?.currentUser?.permissions, OMNI_CHAT_INBOUND.accessZaloReport),
    );
    setReportLivechat(
      checkPermission(user?.currentUser?.permissions, OMNI_CHAT_INBOUND.accessLivechatReport),
    );
  }, [user?.currentUser?.permissions]);
  useEffect(() => {
    requestReportChatDetail(headers, {
      beginDate: paramsFilter.startDate,
      closedDate: paramsFilter.endDate,
      typeChart: paramsFilter.typeChart,
      page: 0,
      limit: 1000,
    })
      .then((res) => {
        if (res.code === 200) {
          const result = [];
          console.log(reportZalo);
          res?.response.data.forEach((data) => {
            reportFacebook &&
              result.push({
                day: data.date,
                data: data.listQuantityDto[0].totalChat,
                type: 'Messenger',
              });
            reportZalo &&
              result.push({
                day: data.date,
                data: data.listQuantityDto[1].totalChat,
                type: data.listQuantityDto[1].id,
              });
            reportLivechat &&
              result.push({
                day: data.date,
                data: data.listQuantityDto[2].totalChat,
                type: data.listQuantityDto[2].id,
              });
          });
          setDataReportChatDetail(result);
          return null;
        }
        throw new Error('ERROR~');
      })
      .catch((err) => {
        setDataReportChatDetail([]);
      });
  }, [paramsFilter.endDate, paramsFilter.startDate, paramsFilter.typeChart, headers, reportFacebook, reportZalo, reportLivechat]);

  const handleChangeDatePicker = useCallback(
    (value) => {
      if (value?.length > 0) {
        const startDate = moment(value[0]).format(dateFormat);
        const endDate = moment(value[1]).format(dateFormat);
        const dateDiff = moment(endDate).diff(moment(startDate), 'days');
        const monthDiff = moment(endDate).diff(moment(startDate), 'months');
        return setParamsFilter({
          ...paramsFilter,
          startDate,
          endDate,
          dateDiff,
          monthDiff,
          typeChart:
            dateDiff === 0
              ? 'HOURS'
              : dateDiff > 0 && monthDiff < 1
              ? 'DAYS'
              : monthDiff < 12
              ? 'MONTHS'
              : 'YEARS',
        });
      }
      return null;
    },
    [paramsFilter],
  );

  const handleChangeTime = useCallback(
    (e) => {
      setParamsFilter({ ...paramsFilter, typeChart: e });
    },
    [paramsFilter],
  );

  return (
    <Row>
      <Col span={24}>
        <Row justify="space-between">
          <Col span={12}>
            <Typography.Title level={5}>Số lượng chat</Typography.Title>
          </Col>
          <Col span={12} flex="inherit">
            <CustomDatePicker
              format={dateFormat}
              value={[
                moment(paramsFilter.startDate, dateFormat),
                moment(paramsFilter.endDate, dateFormat),
              ]}
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={handleChangeDatePicker}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24} style={{ marginTop: '10px' }}>
        <Row justify="end">
          <Form layout="inline">
            <Form.Item noStyle>
              <Form.Item label="Hiển thị dữ liệu" />
              <SelectDateTime
                startDate={paramsFilter.startDate}
                endDate={paramsFilter.endDate}
                callback={handleChangeTime}
                selectedValue={paramsFilter.typeChart}
                dateDiff={paramsFilter.dateDiff}
                monthDiff={paramsFilter.monthDiff}
              />
            </Form.Item>
          </Form>
        </Row>
      </Col>
      <Col span={24}>
        <StackedColumnChart
          data={dataReportChatDetail}
          color={['#f6bb23', '#1ee0ac', '#6376ff']}
          xField="day"
          yField="data"
          legend={{
            visible: true,
            custom: true,
            allowAllCanceled: true,
            position: 'top-center',
            items: [
              {
                value: 'Messenger',
                name: 'Messenger',
                marker: {
                  symbol: 'square',
                  style: { fill: '#f6bb23', r: 5 },
                },
              },
              {
                value: 'Zalo',
                name: 'Zalo',
                marker: {
                  symbol: 'square',
                  style: { fill: '#1ee0ac', r: 5 },
                },
              },
              {
                value: 'Livechat',
                name: 'Livechat',
                marker: {
                  symbol: 'square',
                  style: { fill: '#6376ff', r: 5 },
                },
              },
            ].filter((item) => {
              let arr = [];
              reportFacebook && arr.push('Messenger');
              reportZalo && arr.push('Zalo');
              reportLivechat && arr.push('Livechat');
              return arr.includes(item.name);
            }),
          }}
        />
      </Col>
      <Col span={24}>
        <TableAdvance
          rowKey={(record) => record.session_id}
          columns={constant.ChatReportTableHeader.filter((item) => {
            let arr = [];
            !reportFacebook && arr.push('facebook');
            !reportZalo && arr.push('zalo');
            !reportLivechat && arr.push('livechat');
            return !arr.includes(item.key);
          })}
          pagination={{
            showTotal: false,
            size: 'default',
            defaultPageSize: 10,
          }}
          headerTitle={<Typography.Title level={5}>Chi tiết số lượng chat</Typography.Title>}
          toolBarRender={() => [
            <Button key="export" type="primary" icon={<Export />} onClick={handleExportDataChat}>
              Export
            </Button>,
          ]}
          params={{ paramsFilter }}
          request={async ({ current, pageSize, paramsFilter }) => {
            const params = {
              beginDate: paramsFilter.startDate,
              closedDate: paramsFilter.endDate,
              limit: pageSize,
              typeChart: paramsFilter.typeChart,
              page: current - 1,
            };
            setParamsTable({
              current,
              pageSize,
            });
            try {
              const res = await requestReportChatDetail(headers, params);
              if (res.code === 200) {
                const result = [];
                res?.response.data.forEach((data) => {
                  result.push({
                    date: data.dateTime,
                    facebook: data.listQuantityDto[0].totalChat,
                    zalo: data.listQuantityDto[1].totalChat,
                    livechat: data.listQuantityDto[2].totalChat,
                    value: data.totalAllChat,
                  });
                });
                return {
                  data: result,
                  total: 10 * (res?.response.totalPage + 1),
                };
              }
              throw new Error('ERROR~');
            } catch (err) {
              return {
                data: [],
                total: 0,
              };
            }
          }}
        />
      </Col>
    </Row>
  );
});
