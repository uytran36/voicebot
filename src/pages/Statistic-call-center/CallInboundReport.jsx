import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PT from 'prop-types';
import { Typography, Card, Select, Button, Row, Col, Form, Input } from 'antd';
import { Export } from '@/components/Icons';
import moment from 'moment';
import DatePicker from '@/components/CustomDatePicker';
import Statistical from './components/Statistical';
import { StackedColumnChart, LineChart } from '@/components/Chart';
import { useFetchDataLineChart } from './Hooks/useFetchDataLineChart';
import { useFetchDataBarChart } from './Hooks/useFetchDataBarChart';
import { useFetchDataGroupChart } from './Hooks/useFetchDataGroupChart';
import { useFetchDataInboundCall } from './Hooks/useFetchDataInboundCall';
import { CallInboundTableHeader } from './const';
import CustomDatePicker from '@/components/CustomDatePicker';
import styles from './styles.less';
import SelectDateTime from '@/components/SelectDateTime';
import { requestExportInboundCallStatistic } from '@/services/call-center';
import { debounce } from 'lodash';
import { checkPermission, CALL_CENTER_MANAGEMENT } from '@/utils/permission';

CallInboundReport.propTypes = {
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    tokenGateway: PT.string,
    wsId: PT.string,
  }).isRequired,
};

function CallInboundReport(props) {
  const { user } = props;
  const { tokenGateway, currentUser, wsId } = user;
  const [dataLineChart] = useFetchDataLineChart(/** function api define in here */);
  const [dataGroupChart] = useFetchDataGroupChart('' /** function api define in here */, {
    x: 'date',
    y: 'value',
    stackField: 'type',
  });
  const [dateSelect, setDateSelect] = useState({});

  const headers = useMemo(() => {
    return {
      Authorization: tokenGateway,
    };
  }, [tokenGateway]);

  const isAdmin = useMemo(() => {
    return checkPermission(currentUser?.permissions, CALL_CENTER_MANAGEMENT.accessAllCallReport);
  }, [currentUser?.permissions]);

  const [dataBarChart] = useFetchDataBarChart('' /** function api define in here */);

  const dateFormat = 'YYYY-MM-DD';

  const [paramsFilter, setParamsFilter] = useState({
    agentName: '',
    startDate: moment().startOf('day').format(dateFormat),
    endDate: moment().endOf('day').format(dateFormat),
    hotline: '',
    phoneCustomer: '',
    queueNum: '',
    typeChart: 'HOURS',
    dateDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'days'),
    monthDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'months'),
  });

  const [dataInbound] = useFetchDataInboundCall(headers, paramsFilter);
  const data = [
    { day: '1/1', data: 400, type: 'Cuộc gọi bị nhỡ' },
    { day: '1/1', data: 300, type: 'Cuộc gọi trả lời' },
    { day: '2/1', data: 800, type: 'Cuộc gọi bị nhỡ' },
    { day: '2/1', data: 400, type: 'Cuộc gọi trả lời' },
    { day: '3/1', data: 800, type: 'Cuộc gọi bị nhỡ' },
    { day: '3/1', data: 900, type: 'Cuộc gọi trả lời' },
    { day: '4/1', data: 1200, type: 'Cuộc gọi bị nhỡ' },
    { day: '4/1', data: 550, type: 'Cuộc gọi trả lời' },
    { day: '5/1', data: 150, type: 'Cuộc gọi bị nhỡ' },
    { day: '5/1', data: 350, type: 'Cuộc gọi trả lời' },
    { day: '6/1', data: 800, type: 'Cuộc gọi bị nhỡ' },
    { day: '6/1', data: 650, type: 'Cuộc gọi trả lời' },
    { day: '7/1', data: 400, type: 'Cuộc gọi bị nhỡ' },
    { day: '7/1', data: 200, type: 'Cuộc gọi trả lời' },
    { day: '8/1', data: 460, type: 'Cuộc gọi bị nhỡ' },
    { day: '8/1', data: 120, type: 'Cuộc gọi trả lời' },
    { day: '9/1', data: 1100, type: 'Cuộc gọi bị nhỡ' },
    { day: '9/1', data: 210, type: 'Cuộc gọi trả lời' },
    { day: '10/1', data: 1100, type: 'Cuộc gọi bị nhỡ' },
    { day: '10/1', data: 1210, type: 'Cuộc gọi trả lời' },
  ];

  const data2 = [
    { day: '1/1', value: 500, type: 'Cuộc gọi vào' },
    { day: '2/1', value: 900, type: 'Cuộc gọi vào' },
    { day: '3/1', value: 700, type: 'Cuộc gọi vào' },
    { day: '4/1', value: 900, type: 'Cuộc gọi vào' },
    { day: '5/1', value: 270, type: 'Cuộc gọi vào' },
    { day: '6/1', value: 1300, type: 'Cuộc gọi vào' },
    { day: '7/1', value: 500, type: 'Cuộc gọi vào' },
    { day: '8/1', value: 780, type: 'Cuộc gọi vào' },
    { day: '9/1', value: 170, type: 'Cuộc gọi vào' },
    { day: '10/01', value: 200, type: 'Cuộc gọi vào' },
  ];

  const handleChangeTime = useCallback(
    (e) => {
      setParamsFilter({ ...paramsFilter, typeChart: e });
    },
    [paramsFilter],
  );

  const handleChangeInput = useCallback(
    (e, key) => {
      return setParamsFilter({ ...paramsFilter, [key]: e.target.value });
    },
    [paramsFilter],
  );

  const handleExportData = useCallback(() => {
    return requestExportInboundCallStatistic(headers, { ...paramsFilter, subId: wsId });
  }, [paramsFilter, headers, wsId]);

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

  return (
    <Card>
      <Row style={{ marginBottom: '37px' }}>
        <Col span={4}>
          <Typography.Title level={5}>Thống kê cuộc gọi vào</Typography.Title>
        </Col>
        <Col span={20}>
          <Form layout="inline" style={{ float: 'right' }}>
            <Form.Item noStyle>
              {isAdmin && (
                <Form.Item>
                  <Input
                    placeholder="Nhập hàng chờ"
                    onChange={debounce((e) => handleChangeInput(e, 'queueNum'), 500)}
                  />
                </Form.Item>
              )}
              {/* <Form.Item>
                <Select options={[]} placeholder="Hotline" />
              </Form.Item> */}
              {isAdmin && (
                <Form.Item>
                  <Input
                    placeholder="Nhập tên agent"
                    onChange={debounce((e) => handleChangeInput(e, 'agentName'), 500)}
                  />
                </Form.Item>
              )}
              <Form.Item>
                <Input
                  placeholder="Số khách hàng"
                  onChange={debounce((e) => handleChangeInput(e, 'phoneCustomer'), 500)}
                />
              </Form.Item>
              <Form.Item>
                <DatePicker
                  format={dateFormat}
                  value={[
                    moment(paramsFilter.startDate, dateFormat),
                    moment(paramsFilter.endDate, dateFormat),
                  ]}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  onChange={(value) => handleChangeDatePicker(value)}
                />
              </Form.Item>
              <Form.Item style={{ marginRight: '0px' }}>
                <Button
                  style={{ backgroundColor: '#127ACE', color: '#FFFFFF' }}
                  icon={<Export />}
                  onClick={handleExportData}
                >
                  Export
                </Button>
              </Form.Item>
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row style={{ marginBottom: '37px' }}>
        <Col span={24}>
          <Statistical
            chart={{
              width: 380,
              height: 300,
              color: ['#07C2DE', '#EE414A'],
              statistic: {
                title: {
                  style: {
                    fontSize: '16px',
                  },
                  customHtml: () => 'Cuộc gọi',
                  offsetY: 30,
                  // },
                },
                content: {
                  style: {
                    color: '#127ace',
                    fontWeight: 400,
                  },
                  offsetY: -30,
                },
              },
              data: [
                {
                  type: 'Cuộc gọi trả lời',
                  value: dataInbound?.numberInformation?.totalSuccessCall,
                },
                {
                  type: 'Cuộc gọi thất bại',
                  value: dataInbound?.numberInformation?.totalMissedCall,
                },
              ],
            }}
            table={{
              expandable: {
                rowExpandable: (record) => record.collapse && Array.isArray(record.collapse),
                rowExpandRender: (col, record, index) => record[col],
              },
              rowClassName: (record) => {
                return record['type-call'] === 'Cuộc gọi trả lời' ? styles.sky_blue : styles.red;
              },
              columns: CallInboundTableHeader,
              data: [
                {
                  'type-call': 'Cuộc gọi trả lời',
                  'call-amount': dataInbound?.numberInformation?.totalSuccessCall,
                  percentage: dataInbound?.numberInformation?.rateSuccessCall,
                },
                {
                  'type-call': 'Cuộc gọi thất bại',
                  'call-amount': dataInbound?.numberInformation?.totalMissedCall,
                  percentage: dataInbound?.numberInformation?.rateMissingCall,
                  collapse: [
                    {
                      'type-call': 'Nhỡ trong hàng chờ',
                      'call-amount': dataInbound?.numberInformation?.totalMissedCall.toString(),
                      percentage: `${dataInbound?.numberInformation?.rateMissingCall
                        .toFixed(2)
                        .toString()}%`,
                    },
                    {
                      'type-call': 'Máy bận',
                      'call-amount': dataInbound?.numberInformation?.totalMissedCall.toString(),
                      percentage: `${dataInbound?.numberInformation?.rateMissingCall
                        .toFixed(2)
                        .toString()}%`,
                    },
                    {
                      'type-call': 'Cuộc gọi bị từ chối',
                      'call-amount': dataInbound?.numberInformation?.totalRejectedCall.toString(),
                      percentage: `${dataInbound?.numberInformation?.rateRejectedCall
                        .toFixed(2)
                        .toString()}%`,
                    },
                    {
                      'type-call': 'Thất bại khác',
                      'call-amount': dataInbound?.numberInformation?.totalFailureCall.toString(),
                      percentage: `${dataInbound?.numberInformation?.rateFailureCall
                        .toFixed(2)
                        .toString()}%`,
                    },
                  ],
                },
              ],
            }}
            overview={[
              {
                time: dataInbound?.numberInformation?.totalTimeSuccess
                  ? moment
                      .utc(dataInbound?.numberInformation?.totalTimeSuccess * 1000)
                      .format('HH:mm:ss')
                  : '00:00:00',
                title: 'Tổng thời gian trả lời',
              },
              {
                time: dataInbound?.numberInformation?.totalAvgTimeSuccessCall || '00:00:00',
                title: 'Thời gian trả lời trung bình',
              },
            ]}
          />
        </Col>
      </Row>
      <Row>
        <Col span={4}>
          <Typography.Title level={5}>Số lượng cuộc gọi vào</Typography.Title>
        </Col>
        <Col span={20} style={{ paddingBottom: '20px' }}>
          <Form layout="inline" style={{ float: 'right' }}>
            <Form.Item noStyle>
              <Form.Item label="Hiển thị dữ liệu:">
                <SelectDateTime
                  startDate={paramsFilter.startDate}
                  endDate={paramsFilter.endDate}
                  callback={handleChangeTime}
                  selectedValue={paramsFilter.typeChart}
                  dateDiff={paramsFilter.dateDiff}
                  monthDiff={paramsFilter.monthDiff}
                />
              </Form.Item>
            </Form.Item>
          </Form>
        </Col>
        {/* <Col span={24}>
          <Form layout="inline" style={{ float: 'right' }}>
            <Form.Item noStyle>
              <Form.Item>
                <Select
                  disabled // có api sẽ bỏ disable
                  options={[
                    {
                      value: 'Trạng thái cuộc gọi',
                      label: 'Trạng thái cuộc gọi',
                    },
                  ]}
                  placeholder="Trạng thái cuộc gọi"
                />
              </Form.Item>
            </Form.Item>
          </Form>
        </Col> */}
      </Row>
      <Row style={{ marginBottom: '35px' }}>
        <StackedColumnChart
          data={dataInbound.numberCallInbound || []}
          color={['#EE414A', '#07C2DE']}
          xField="day"
          yField="data"
          // title={{
          //   visible: true,
          //   text: 'Số lượng cuộc gọi',
          //   style: {
          //     textAlign: 'top-left',
          //     fontWeight: 'bold',
          //     fontFamily: 'Roboto',
          //     fontSize: 16,
          //     color: 'rgba(0, 0, 0, 0.85)',
          //   },
          // }}
          legend={{
            visible: true,
            custom: true,
            allowAllCanceled: true,
            position: 'top-center',
            items: [
              {
                value: 'Cuộc gọi thành công',
                name: 'Cuộc gọi thành công',
                marker: {
                  symbol: 'square',
                  style: { fill: '#07C2DE', r: 5 },
                },
              },
              {
                value: 'Cuộc gọi thất bại',
                name: 'Cuộc gọi thất bại',
                marker: {
                  symbol: 'square',
                  style: { fill: '#EE414A', r: 5 },
                },
              },
            ],
          }}
        />
      </Row>
      <Row style={{ marginBottom: '30px' }}>
        <Col span={4}>
          <Typography.Title level={5}>Thời gian gọi vào</Typography.Title>
        </Col>
      </Row>
      <Row>
        <LineChart
          data={dataInbound.timeCallInbound || []}
          seriesField="type"
          xField="day"
          yField="data"
          color={['#f6bb23']}
          legend={{
            visible: false,
          }}
        />
      </Row>
    </Card>
  );
}

export default CallInboundReport;
