import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import { Typography, Card, Select, Button, Row, Col, Form, Input, Radio } from 'antd';
import { connect, FormattedMessage } from 'umi';
import moment from 'moment';
import { Export } from '@/components/Icons';
import DatePicker from '@/components/CustomDatePicker';
import CustomStatistical from './components/Statistical';
import { StackedColumnChart, LineChart } from '@/components/Chart';
import { OverViewTableHeader } from './const';
import styles from './styles.less';
import SelectDateTime from '@/components/SelectDateTime';
import { requestExportGeneralStatistic, requestExportLocalStatistic } from '@/services/call-center';
import { useFetchDataInternalAgent } from './Hooks/useFetchDataInternalAgent';
const CollumnShape = [
  {
    title: 'Loại cuộc gọi',
    dataIndex: 'type-call',
    key: 'type-call',
  },
  {
    title: 'Số lượng cuộc gọi',
    dataIndex: 'call-amount',
    key: 'call-amount',
    align: 'center',
    isSum: true,
    render: (text) => {
      return <span style={{ textAlign: 'center', margin: 0 }}>{text}</span>;
    },
  },
  {
    title: 'Thời gian gọi',
    dataIndex: 'call-time',
    key: 'call-time',
    align: 'center',
    isSum: true,
    isTimeMinute: true,
    render: (text, record) => {
      if (text !== '-' && Number.isInteger(+text)) {
        return moment.utc(text * 1000).format('HH:mm:ss');
      }
      return '-';
    },
  },
  {
    title: 'Thời gian trung bình',
    dataIndex: 'average-call-time',
    key: 'average-call-time',
    align: 'center',
    isSum: true,
    isTimeMinute: true,
    render: (text, record) => {
      if (text !== '-') {
        return moment.utc(text * 1000).format('HH:mm:ss');
      }
      return '-';
    },
  },
];

InternalAgent.propTypes = {
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    tokenGateway: PT.string,
    wsId: PT.string,
  }).isRequired,
};

function InternalAgent(props) {
  const { user } = props;
  const { tokenGateway, wsId } = user;

  const headers = useMemo(() => {
    return {
      Authorization: tokenGateway,
    };
  }, [tokenGateway]);

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

  const [dataGeneral] = useFetchDataInternalAgent(headers, paramsFilter);

  const handleExportData = useCallback(() => {
    requestExportLocalStatistic(headers, { ...paramsFilter, subId: wsId });
  }, [headers, paramsFilter, wsId]);

  const handleChangeTime = useCallback(
    (e) => {
      setParamsFilter({ ...paramsFilter, typeChart: e });
    },
    [paramsFilter],
  );

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

  const handleChangeInput = useCallback(
    (e, key) => {
      return setParamsFilter({ ...paramsFilter, [key]: e.target.value });
    },
    [paramsFilter],
  );

  return (
    <Card>
      <Row style={{ marginBottom: '37px' }}>
        <Col span={4}>
          <Typography.Title level={5}>Thống kê cuộc gọi nội bộ</Typography.Title>
        </Col>
        <Col span={20}>
          <Form layout="inline" style={{ float: 'right' }}>
            <Form.Item noStyle>
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
          <CustomStatistical
            chart={{
              width: 380,
              height: 300,
              color: ['#127ace', '#9d52e8'],
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
                  type: 'Cuộc gọi vào',
                  value: dataGeneral?.numberInformation?.totalIncomeCall,
                },
                {
                  type: 'Cuộc gọi ra',
                  value: dataGeneral?.numberInformation?.totalOutcomeCall,
                },
              ],
            }}
            table={{
              columns: CollumnShape,
              rowClassName: (record) => {
                switch (record['type-call']) {
                  case 'Cuộc gọi vào':
                    return styles.blue;
                  case 'Cuộc gọi ra':
                    return styles.purple;
                  default:
                    break;
                }
              },
              data: [
                {
                  'type-call': 'Cuộc gọi vào',
                  'call-amount': dataGeneral?.numberInformation?.totalIncomeCall || 0,
                  'call-time': dataGeneral?.numberInformation?.totalTimeIncomeCall || 0,
                  'average-call-time': dataGeneral?.numberInformation?.totalAvgTimeIncomeCall || 0,
                },
                {
                  'type-call': 'Cuộc gọi ra',
                  'call-amount': dataGeneral?.numberInformation?.totalOutcomeCall || 0,
                  'call-time': dataGeneral?.numberInformation?.totalOutcomeCall || 0,
                  'average-call-time': dataGeneral?.numberInformation?.totalAvgTimeOutcomeCall || 0,
                },
              ],
            }}
            overview={[
              {
                time: dataGeneral?.totalTime
                  ? moment.utc(dataGeneral?.totalTime * 1000).format('HH:mm:ss')
                  : '00:00:00',
                title: 'Tổng thời gian gọi nội bộ',
              },
              {
                time: dataGeneral?.avgTime
                  ? moment.utc(dataGeneral?.avgTime * 1000).format('HH:mm:ss')
                  : '00:00:00',
                title: 'Thời gian gọi trung bình',
              },
            ]}
          />
        </Col>
      </Row>
      <Row style={{ marginBottom: '37px' }}>
        <Col span={4}>
          <Typography.Title level={5}>Số lượng cuộc gọi</Typography.Title>
        </Col>
        <Col span={20}>
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
      </Row>
      <Row style={{ marginBottom: '35px' }}>
        <StackedColumnChart
          data={dataGeneral?.numberCallGeneral || []}
          color={['#127ace', '#9d52e8']}
          xField="day"
          yField="data"
          title={{
            visible: false,
            text: 'Số lượng cuộc gọi',
            style: {
              textAlign: 'top-left',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
              fontSize: 16,
              color: 'rgba(0, 0, 0, 0.85)',
            },
          }}
          legend={{
            visible: true,
            custom: true,
            allowAllCanceled: true,
            position: 'top-center',
            items: [
              {
                value: 'Cuộc gọi vào',
                name: 'Cuộc gọi vào',
                marker: {
                  symbol: 'square',
                  style: { fill: '#127ace', r: 5 },
                },
              },
              {
                value: 'Cuộc gọi ra',
                name: 'Cuộc gọi ra',
                marker: {
                  symbol: 'square',
                  style: { fill: '#9d52e8', r: 5 },
                },
              },
            ],
          }}
        />
      </Row>
      <Row>
        <LineChart
          data={dataGeneral?.timeCallGeneral || []}
          seriesField="type"
          xField="day"
          yField="data"
          color={['#127ace', '#9d52e8']}
          title={{
            visible: true,
            text: 'Thời gian gọi',
            style: {
              textAlign: 'top-left',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
              fontSize: 16,
              color: 'rgba(0, 0, 0, 0.85)',
            },
          }}
          legend={{
            position: 'top',
            custom: true,
            allowAllCanceled: true,
            items: [
              {
                value: 'Cuộc gọi vào',
                name: 'Cuộc gọi vào',
                marker: {
                  symbol: 'square',
                  style: { fill: '#127ace', r: 5 },
                },
              },
              {
                value: 'Cuộc gọi ra',
                name: 'Cuộc gọi ra',
                marker: {
                  symbol: 'square',
                  style: { fill: '#9d52e8', r: 5 },
                },
              },
            ],
          }}
        />
      </Row>
    </Card>
  );
}

export default InternalAgent;
