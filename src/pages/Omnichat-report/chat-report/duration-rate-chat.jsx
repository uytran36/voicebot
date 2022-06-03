import React, { useMemo, useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { Form, Row, Col, Typography, Button } from 'antd';
import CustomDatePicker from '@/components/CustomDatePicker';
import SelectDateTime from '@/components/SelectDateTime';
import { Export } from '@/components/Icons';
import { TableAdvance, constant } from '../components/Table';
import { LineChart } from '@/components/Chart';
import {
  requestGetResolveRatioReportChat,
  requestExportResolveRatioReportChat,
  requestDurationReportChat,
  requestExportDurationReportChat,
} from '@/services/chat';
import styles from '../styles.less';
import { checkPermission, OMNI_CHAT_INBOUND } from '@/utils/permission';

const startDay = moment().startOf('day');
const endDay = moment().endOf('day');

export default connect(({ user }) => ({ user }))(function DurationRateChat({ user }) {
  const headers = useMemo(
    () => ({
      // 'X-Auth-Token': user.authToken,
      // 'X-User-Id': user.userId,
      Authorization: `${user.tokenGateway}`,
    }),
    [user.tokenGateway],
  );
  const [reportFacebook, setReportFacebook] = useState(false);
  const [reportZalo, setReportZalo] = useState(false);
  const [reportLivechat, setReportLivechat] = useState(false);

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
  const [dataDurationReportChat, setDataDurationReportChat] = useState([]);
  const [dataRateChat, setDataRateChat] = useState([]);

  const [paramsFilterRateChart, setParamsFilterRateChart] = useState({
    startDate: moment().startOf('day').format(dateFormat),
    endDate: moment().startOf('day').format(dateFormat),
    typeChart: 'HOURS',
    dateDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'days'),
    monthDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'months'),
  });
  const dateFormat = 'YYYY-MM-DD';

  const [paramsFilterDurationChart, setParamsFilterDurationChart] = useState({
    startDate: moment().startOf('day').format(dateFormat),
    endDate: moment().startOf('day').format(dateFormat),
    typeChart: 'HOURS',
    dateDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'days'),
    monthDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'months'),
  });

  useEffect(() => {
    requestDurationReportChat(headers, {
      beginDate: paramsFilterDurationChart.startDate,
      closedDate: paramsFilterDurationChart.endDate,
      typeChart: paramsFilterDurationChart.typeChart,
      page: 0,
      limit: 1000,
    })
      .then((res) => {
        const result = [];
        if (res.code === 200) {
          res?.response.data.forEach((data) => {
            reportFacebook &&
              result.push({
                day: moment(data.date).format('YYYY-MM-DD'),
                data: data.listTimeType[0].totalTime,
                type: 'Messenger',
              });
            reportZalo &&
              result.push({
                day: moment(data.date).format('YYYY-MM-DD'),
                data: data.listTimeType[1].totalTime,
                type: data.listTimeType[1].id,
              });
            reportLivechat &&
              result.push({
                day: moment(data.date).format('YYYY-MM-DD'),
                data: data.listTimeType[2].totalTime,
                type: data.listTimeType[2].id,
              });
          });
          setDataDurationReportChat(result);
          return null;
        }
        throw new Error('ERROR~');
      })
      .catch((err) => {
        console.log(err);
        setDataDurationReportChat([]);
      });
  }, [paramsFilterDurationChart, headers, reportFacebook, reportLivechat, reportZalo]);

  // request data rate chart
  useEffect(() => {
    requestGetResolveRatioReportChat(headers, {
      beginDate: paramsFilterRateChart.startDate,
      closedDate: paramsFilterRateChart.endDate,
      typeChart: paramsFilterRateChart.typeChart,
      page: 0,
      limit: 1000,
    })
      .then((res) => {
        const result = [];
        if (res.code === 200) {
          console.log(res.response.resolvedRatio);
          res.response.resolvedRatio.data.forEach((data) => {
            reportFacebook &&
              result.push({
                day: moment(data.date).format('YYYY-MM-DD'),
                data: data.facebook,
                type: 'Messenger',
              });
            reportZalo &&
              result.push({
                day: moment(data.date).format('YYYY-MM-DD'),
                data: data.zalo,
                type: 'Zalo',
              });
            reportLivechat &&
              result.push({
                day: moment(data.date).format('YYYY-MM-DD'),
                data: data.livechat,
                type: 'Livechat',
              });
          });
          setDataRateChat(result);
          return null;
        } else throw new Error('ERROR~');
      })
      .catch((err) => {
        setDataDurationReportChat([]);
      });
  }, [paramsFilterRateChart, headers, reportFacebook, reportZalo, reportLivechat]);

  const handleExportDurationDataChat = useCallback(async () => {
    try {
      const res = await requestExportDurationReportChat(headers, {
        beginDate: paramsFilterDurationChart.startDate,
        closedDate: paramsFilterDurationChart.endDate,
        typeChart: paramsFilterDurationChart.typeChart,
        subId: user.wsId,
      });
      return null;
    } catch (err) {
      console.log(err);
    }
  }, [paramsFilterDurationChart]);

  const handleExportResolveRatioDataChat = useCallback(async () => {
    try {
      const res = await requestExportResolveRatioReportChat(headers, {
        beginDate: paramsFilterRateChart.startDate,
        closedDate: paramsFilterRateChart.endDate,
        typeChart: paramsFilterRateChart.typeChart,
        subId: user.wsId,
      });
      return null;
    } catch (err) {
      console.log(err);
    }
  }, [paramsFilterRateChart]);

  const handleChangeDatePickerDurationChart = useCallback(
    (value) => {
      if (value?.length > 0) {
        const startDate = moment(value[0]).format(dateFormat);
        const endDate = moment(value[1]).format(dateFormat);
        const dateDiff = moment(endDate).diff(moment(startDate), 'days');
        const monthDiff = moment(endDate).diff(moment(startDate), 'months');
        return setParamsFilterDurationChart({
          ...paramsFilterDurationChart,
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
    [paramsFilterDurationChart],
  );

  const handleChangeTimeDurationChart = useCallback(
    (e) => {
      setParamsFilterDurationChart({ ...paramsFilterDurationChart, typeChart: e });
    },
    [paramsFilterDurationChart],
  );

  const handleChangeDatePickerRateChart = useCallback(
    (value) => {
      if (value?.length > 0) {
        const startDate = moment(value[0]).format(dateFormat);
        const endDate = moment(value[1]).format(dateFormat);
        const dateDiff = moment(endDate).diff(moment(startDate), 'days');
        const monthDiff = moment(endDate).diff(moment(startDate), 'months');
        return setParamsFilterRateChart({
          ...paramsFilterRateChart,
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
    [paramsFilterRateChart],
  );

  const handleChangeTimeRateChart = useCallback(
    (e) => {
      setParamsFilterRateChart({ ...paramsFilterRateChart, typeChart: e });
    },
    [paramsFilterRateChart],
  );
  return (
    <Row justify="space-between" gutter={16}>
      {/** Duration chat */}
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <Row style={{ background: '#fafafa' }}>
          <Col span={24}>
            <Row justify="space-between" style={{ padding: '24px 16px 0 16px' }}>
              <Col span={12}>
                <Typography.Title level={5} style={{ paddingLeft: '10px' }}>
                  Thời lượng chat <span style={{ color: '#399DEE' }}>(phút)</span>
                </Typography.Title>
              </Col>
              <Col span={12} flex="inherit">
                <CustomDatePicker
                  disabled={false}
                  value={[
                    moment(paramsFilterDurationChart.startDate, dateFormat),
                    moment(paramsFilterDurationChart.endDate, dateFormat),
                  ]}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  onChange={handleChangeDatePickerDurationChart}
                />
              </Col>
            </Row>
          </Col>
          <Col span={24} style={{ marginTop: '10px' }}>
            <Row justify="center">
              <Form layout="inline">
                <Form.Item noStyle>
                  <SelectDateTime
                    startDate={paramsFilterDurationChart.startDate}
                    endDate={paramsFilterDurationChart.endDate}
                    callback={handleChangeTimeDurationChart}
                    selectedValue={paramsFilterDurationChart.typeChart}
                    dateDiff={paramsFilterDurationChart.dateDiff}
                    monthDiff={paramsFilterDurationChart.monthDiff}
                  />
                </Form.Item>
              </Form>
            </Row>
          </Col>
          <Col span={24}>
            <LineChart
              data={dataDurationReportChat}
              seriesField="type"
              xField="day"
              yField="data"
              color={['#f6bb23', '#1ee0ac', '#6376ff']}
              legend={{
                position: 'bottom',
                custom: true,
                allowAllCanceled: true,
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
              pagination={{
                showTotal: false,
                size: 'default',
                defaultPageSize: 10,
              }}
              cardProps={{
                bodyStyle: { background: '#FAFAFA', paddingTop: 0 },
              }}
              headerTitle={<Typography.Title level={5}>Chi tiết thời lượng chat</Typography.Title>}
              toolBarRender={() => [
                <Button
                  onClick={handleExportDurationDataChat}
                  key="export"
                  type="primary"
                  icon={<Export />}
                >
                  Export
                </Button>,
              ]}
              rowClassName={styles['row-record']}
              columns={constant.DetailDurationReportTableHeader.filter((item) => {
                let arr = [];
                !reportFacebook && arr.push('facebook');
                !reportZalo && arr.push('zalo');
                !reportLivechat && arr.push('livechat');
                return !arr.includes(item.key);
              })}
              params={{ paramsFilterDurationChart }}
              request={async ({ paramsFilterDurationChart, current, pageSize }) => {
                const params = {
                  beginDate: paramsFilterDurationChart.startDate,
                  closedDate: paramsFilterDurationChart.endDate,
                  typeChart: paramsFilterDurationChart.typeChart,
                  limit: pageSize,
                  page: current - 1,
                };
                try {
                  const res = await requestDurationReportChat(headers, params);
                  if (res.code === 200) {
                    const result = [];
                    res?.response.data.forEach((data) => {
                      result.push({
                        date: data.dateTime,
                        facebook: data.listTimeType[0].totalTime,
                        zalo: data.listTimeType[1].totalTime,
                        livechat: data.listTimeType[2].totalTime,
                        value: data.totalTime,
                      });
                    });
                    return {
                      data: result,
                      total: 10 * (res?.response.totalPage + 1),
                    };
                  }
                  throw new Error('ERROR~');
                } catch (err) {
                  console.error(err);
                  return {
                    data: [],
                    total: 0,
                  };
                }
              }}
            />
          </Col>
        </Row>
      </Col>

      {/** Rate chat */}
      <Col xs={24} sm={24} md={24} lg={24} xl={12}>
        <Row style={{ background: '#fafafa' }}>
          <Col span={24}>
            <Row justify="space-between" style={{ padding: '24px 16px 0 16px' }}>
              <Col span={12}>
                <Typography.Title level={5} style={{ paddingLeft: '10px' }}>
                  Tỷ lệ giải quyết <span style={{ color: '#399DEE' }}>(%)</span>
                </Typography.Title>
              </Col>
              <Col span={12} flex="inherit">
                <CustomDatePicker
                  disabled={false}
                  value={[
                    moment(paramsFilterRateChart.startDate, dateFormat),
                    moment(paramsFilterRateChart.endDate, dateFormat),
                  ]}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  onChange={handleChangeDatePickerRateChart}
                />
              </Col>
            </Row>
          </Col>
          <Col span={24} style={{ marginTop: '10px' }}>
            <Row justify="center">
              <Form layout="inline">
                <Form.Item noStyle>
                  <SelectDateTime
                    startDate={paramsFilterRateChart.startDate}
                    endDate={paramsFilterRateChart.endDate}
                    callback={handleChangeTimeRateChart}
                    selectedValue={paramsFilterRateChart.typeChart}
                    dateDiff={paramsFilterRateChart.dateDiff}
                    monthDiff={paramsFilterRateChart.monthDiff}
                  />
                </Form.Item>
              </Form>
            </Row>
          </Col>
          <Col span={24}>
            <LineChart
              data={dataRateChat}
              seriesField="type"
              xField="day"
              yField="data"
              color={['#f6bb23', '#1ee0ac', '#6376ff']}
              min={0}
              max={100}
              legend={{
                position: 'bottom',
                custom: true,
                allowAllCanceled: true,
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
              pagination={{
                showTotal: false,
                size: 'default',
                defaultPageSize: 10,
              }}
              cardProps={{
                bodyStyle: { background: '#FAFAFA', paddingTop: 0 },
              }}
              rowClassName={styles['row-record']}
              rowKey={(record) => record.session_id}
              columns={constant.ResolveReportTableHeader.filter((item) => {
                let arr = [];
                !reportFacebook && arr.push('facebook');
                !reportZalo && arr.push('zalo');
                !reportLivechat && arr.push('livechat');
                return !arr.includes(item.key);
              })}
              params={{ paramsFilterRateChart }}
              request={async ({ paramsFilterRateChart, current, pageSize }) => {
                const params = {
                  beginDate: paramsFilterRateChart.startDate,
                  closedDate: paramsFilterRateChart.endDate,
                  typeChart: paramsFilterRateChart.typeChart,
                  limit: pageSize,
                  page: current - 1,
                };
                try {
                  const res = await requestGetResolveRatioReportChat(headers, params);
                  const result = [];
                  if (res.code === 200) {
                    res.response.resolvedRatio.data.forEach((data) => {
                      result.push({
                        date: data.dateTime,
                        facebook: data.facebook,
                        zalo: data.zalo,
                        livechat: data.livechat,
                      });
                    });
                    return {
                      data: result,
                      total: 10 * (res.response.resolvedRatio.totalPage + 1),
                    };
                  }
                  throw new Error('ERROR~');
                } catch (err) {
                  console.error(err);
                  return {
                    data: [],
                    total: 0,
                  };
                }
              }}
              headerTitle={<Typography.Title level={5}>Chi tiết tỷ lệ giải quyết</Typography.Title>}
              toolBarRender={() => [
                <Button
                  onClick={handleExportResolveRatioDataChat}
                  key="export"
                  type="primary"
                  icon={<Export />}
                >
                  Export
                </Button>,
              ]}
              style={{
                width: 'auto',
                minWidth: 'unset !important',
              }}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
});
