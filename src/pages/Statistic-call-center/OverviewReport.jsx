import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import { Typography, Card, Select, Button, Row, Col, Form, Input, Radio } from 'antd';
import { connect, FormattedMessage } from 'umi';
import moment from 'moment';
import { Export } from '@/components/Icons';
import DatePicker from '@/components/CustomDatePicker';
import CustomStatistical from './components/Statistical';
import { StackedColumnChart, LineChart } from '@/components/Chart';
import { useFetchDataLineChart } from './Hooks/useFetchDataLineChart';
import { useFetchDataBarChart } from './Hooks/useFetchDataBarChart';
import { useFetchDataGeneral } from './Hooks/useFetchDataGeneral';
import { useFetchDataGroupChart } from './Hooks/useFetchDataGroupChart';
import { OverViewTableHeader } from './const';
import CustomDatePicker from '@/components/CustomDatePicker';
import styles from './styles.less';
import { debounce } from 'lodash';
import SelectDateTime from '@/components/SelectDateTime';
import { requestExportGeneralStatistic } from '@/services/call-center';
import { CALL_CENTER_MANAGEMENT, checkPermission } from '@/utils/permission';

OverviewReport.propTypes = {
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    tokenGateway: PT.string,
    wsId: PT.string,
  }).isRequired,
};

function OverviewReport(props) {
  const { user } = props;
  const { tokenGateway, currentUser, wsId } = user;

  const headers = useMemo(() => {
    return {
      Authorization: tokenGateway,
    };
  }, [tokenGateway]);

  const isAdmin = useMemo(() => {
    return checkPermission(currentUser?.permissions, CALL_CENTER_MANAGEMENT.accessAllCallReport);
  }, [currentUser?.permissions]);

  const [dataLineChart] = useFetchDataLineChart(/** function api define in here */);
  const [dataGroupChart] = useFetchDataGroupChart('' /** function api define in here */, {
    x: 'date',
    y: 'value',
    stackField: 'type',
  });

  // const [dateSelect, setDateSelect] = useState({
  //   startDate: moment().startOf('month'),
  //   endDate: moment().endOf('day'),
  // });
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

  // console.log({ paramsFilter });
  const [dataGeneral] = useFetchDataGeneral(headers, paramsFilter);

  // const {
  //   totalInboundCall,
  //   totalOutboundCall,
  //   totalLocalCall,
  //   totalCall,
  //   totalInboundTimeSuccess,
  //   totalOutboundTimeSuccess,
  //   totalLocalTimeSuccess,
  // } = dataGeneral?.numberInformation;

  const handleExportData = useCallback(() => {
    requestExportGeneralStatistic(headers, { ...paramsFilter, subId: wsId });
  }, [headers, paramsFilter, wsId]);

  const data = [
    { day: '1/1', data: 300, type: 'Cuộc gọi vào' },
    { day: '1/1', data: 400, type: 'Cuộc gọi ra' },
    { day: '1/1', data: 500, type: 'Cuộc gọi nội bộ' },
    { day: '2/1', data: 400, type: 'Cuộc gọi vào' },
    { day: '2/1', data: 800, type: 'Cuộc gọi ra' },
    { day: '2/1', data: 900, type: 'Cuộc gọi nội bộ' },
    { day: '3/1', data: 900, type: 'Cuộc gọi vào' },
    { day: '3/1', data: 800, type: 'Cuộc gọi ra' },
    { day: '3/1', data: 700, type: 'Cuộc gọi nội bộ' },
    { day: '4/1', data: 550, type: 'Cuộc gọi vào' },
    { day: '4/1', data: 1200, type: 'Cuộc gọi ra' },
    { day: '4/1', data: 900, type: 'Cuộc gọi nội bộ' },
    { day: '5/1', data: 350, type: 'Cuộc gọi vào' },
    { day: '5/1', data: 150, type: 'Cuộc gọi ra' },
    { day: '5/1', data: 270, type: 'Cuộc gọi nội bộ' },
    { day: '6/1', data: 650, type: 'Cuộc gọi vào' },
    { day: '6/1', data: 800, type: 'Cuộc gọi ra' },
    { day: '6/1', data: 1300, type: 'Cuộc gọi nội bộ' },
    { day: '7/1', data: 200, type: 'Cuộc gọi vào' },
    { day: '7/1', data: 400, type: 'Cuộc gọi ra' },
    { day: '7/1', data: 500, type: 'Cuộc gọi nội bộ' },
    { day: '8/1', data: 120, type: 'Cuộc gọi vào' },
    { day: '8/1', data: 460, type: 'Cuộc gọi ra' },
    { day: '8/1', data: 780, type: 'Cuộc gọi nội bộ' },
    { day: '9/1', data: 210, type: 'Cuộc gọi vào' },
    { day: '9/1', data: 1100, type: 'Cuộc gọi ra' },
    { day: '9/1', data: 170, type: 'Cuộc gọi nội bộ' },
    { day: '10/1', data: 1210, type: 'Cuộc gọi vào' },
    { day: '10/1', data: 1100, type: 'Cuộc gọi ra' },
    { day: '10/1', data: 200, type: 'Cuộc gọi nội bộ' },
  ];

  const data2 = [
    { day: '01/01/2021', value: 300, type: 'Cuộc gọi nội bộ' },
    { day: '01/01/2021', value: 400, type: 'Cuộc gọi ra' },
    { day: '01/01/2021', value: 500, type: 'Cuộc gọi vào' },
    { day: '02/01/2021', value: 400, type: 'Cuộc gọi nội bộ' },
    { day: '02/01/2021', value: 800, type: 'Cuộc gọi ra' },
    { day: '02/01/2021', value: 900, type: 'Cuộc gọi vào' },
    { day: '03/01/2021', value: 900, type: 'Cuộc gọi nội bộ' },
    { day: '03/01/2021', value: 800, type: 'Cuộc gọi ra' },
    { day: '03/01/2021', value: 700, type: 'Cuộc gọi vào' },
    { day: '04/01/2021', value: 550, type: 'Cuộc gọi nội bộ' },
    { day: '04/01/2021', value: 1200, type: 'Cuộc gọi ra' },
    { day: '04/01/2021', value: 900, type: 'Cuộc gọi vào' },
    { day: '05/01/2021', value: 350, type: 'Cuộc gọi nội bộ' },
    { day: '05/01/2021', value: 150, type: 'Cuộc gọi ra' },
    { day: '05/01/2021', value: 270, type: 'Cuộc gọi vào' },
    { day: '06/01/2021', value: 650, type: 'Cuộc gọi nội bộ' },
    { day: '06/01/2021', value: 800, type: 'Cuộc gọi ra' },
    { day: '06/01/2021', value: 1300, type: 'Cuộc gọi vào' },
    { day: '07/01/2021', value: 200, type: 'Cuộc gọi nội bộ' },
    { day: '07/01/2021', value: 400, type: 'Cuộc gọi ra' },
    { day: '07/01/2021', value: 500, type: 'Cuộc gọi vào' },
    { day: '08/01/2021', value: 120, type: 'Cuộc gọi nội bộ' },
    { day: '08/01/2021', value: 460, type: 'Cuộc gọi ra' },
    { day: '08/01/2021', value: 780, type: 'Cuộc gọi vào' },
    { day: '09/01/2021', value: 210, type: 'Cuộc gọi nội bộ' },
    { day: '09/01/2021', value: 1100, type: 'Cuộc gọi ra' },
    { day: '09/01/2021', value: 170, type: 'Cuộc gọi vào' },
    { day: '10/01/2021', value: 1210, type: 'Cuộc gọi nội bộ' },
    { day: '10/01/2021', value: 1100, type: 'Cuộc gọi ra' },
    { day: '10/01/2021', value: 200, type: 'Cuộc gọi vào' },
  ];

  const timeCallGeneral = [
    {
      day: '10/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '10/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '10/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '11/10/2021',
      data: 218,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '11/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '11/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '12/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '12/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '12/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '13/10/2021',
      data: 66,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '13/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '13/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '14/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '14/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '14/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '15/10/2021',
      data: 138,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '15/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '15/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '16/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '16/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '16/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '17/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '17/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '17/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '18/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '18/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '18/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '19/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '19/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '19/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '20/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '20/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '20/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '21/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '21/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '21/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '22/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '22/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '22/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '23/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '23/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '23/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '24/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '24/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '24/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '25/10/2021',
      data: 123,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '25/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '25/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '26/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '26/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '26/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '27/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '27/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '27/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '28/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '28/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '28/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '29/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '29/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '29/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
    {
      day: '30/10/2021',
      data: 0,
      type: 'Cuộc gọi nội bộ',
    },
    {
      day: '30/10/2021',
      data: 0,
      type: 'Cuộc gọi ra',
    },
    {
      day: '30/10/2021',
      data: 0,
      type: 'Cuộc gọi vào',
    },
  ];

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

  const dynamicTypeChart = [
    { id: 'HOURS', value: 'Giờ' },
    { id: 'DAYS', value: 'Ngày' },
    { id: 'MONTHS', value: 'Tháng' },
    { id: 'YEARS', value: 'Năm' },
  ];

  return (
    <Card>
      <Row style={{ marginBottom: '37px' }}>
        <Col span={4}>
          <Typography.Title level={5}>Thống kê tổng quan</Typography.Title>
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
                  placeholder="Nhập số khách hàng"
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
          <CustomStatistical
            chart={{
              width: 380,
              height: 300,
              color: ['#F6BB23', '#1EE0AC', '#6376FF'],
              statistic: {
                title: {
                  style: {
                    fontSize: '16px',
                  },
                  customHtml: () => 'Cuộc gọi',
                  offsetY:
                    dataGeneral?.numberInformation?.totalInboundCall +
                      dataGeneral?.numberInformation?.totalOutboundCall +
                      dataGeneral?.numberInformation?.totalLocalCall ===
                    0
                      ? 10
                      : 30,
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
                  value: dataGeneral?.numberInformation?.totalInboundCall,
                },
                {
                  type: 'Cuộc gọi ra',
                  value: dataGeneral?.numberInformation?.totalOutboundCall,
                },
                {
                  type: 'Cuộc gọi nội bộ',
                  value: dataGeneral?.numberInformation?.totalLocalCall,
                },
              ],
            }}
            table={{
              columns: OverViewTableHeader,
              rowClassName: (record) => {
                switch (record['type-call']) {
                  case 'Cuộc gọi vào':
                    return styles.yellow;
                  case 'Cuộc gọi ra':
                    return styles.green;
                  case 'Cuộc gọi nội bộ':
                    return styles.dark_blue;
                  default:
                    break;
                }
              },
              data: [
                {
                  'type-call': 'Cuộc gọi vào',
                  'call-amount': dataGeneral?.numberInformation?.totalInboundCall || 0,
                  percentage:
                    dataGeneral?.numberInformation?.totalInboundCall === 0 ||
                    !dataGeneral?.numberInformation?.totalInboundCall
                      ? 0
                      : (dataGeneral?.numberInformation?.totalInboundCall * 100) /
                        dataGeneral?.numberInformation?.totalCall,
                  duration:
                    dataGeneral?.numberInformation?.totalInboundTimeSuccess !== 0 &&
                    dataGeneral?.numberInformation?.totalInboundTimeSuccess,
                },
                {
                  'type-call': 'Cuộc gọi ra',
                  'call-amount': dataGeneral?.numberInformation?.totalOutboundCall || 0,
                  percentage:
                    dataGeneral?.numberInformation?.totalOutboundCall === 0 ||
                    !dataGeneral?.numberInformation?.totalOutboundCall
                      ? 0
                      : (dataGeneral?.numberInformation?.totalOutboundCall * 100) /
                        dataGeneral?.numberInformation?.totalCall,
                  duration:
                    dataGeneral?.numberInformation?.totalOutboundTimeSuccess !== 0 &&
                    dataGeneral?.numberInformation?.totalOutboundTimeSuccess,
                },
                {
                  'type-call': 'Cuộc gọi nội bộ',
                  'call-amount': dataGeneral?.numberInformation?.totalLocalCall || 0,
                  percentage:
                    dataGeneral?.numberInformation?.totalLocalCall === 0 ||
                    !dataGeneral?.numberInformation?.totalLocalCall
                      ? 0
                      : (dataGeneral?.numberInformation?.totalLocalCall * 100) /
                        dataGeneral?.numberInformation?.totalCall,
                  duration:
                    dataGeneral?.numberInformation?.totalLocalTimeSuccess !== 0 &&
                    dataGeneral?.numberInformation?.totalLocalTimeSuccess,
                },
              ],
            }}
            overview={[
              {
                time: dataGeneral?.numberInformation?.totalTimeSuccess
                  ? moment
                      .utc(dataGeneral?.numberInformation?.totalTimeSuccess * 1000)
                      .format('HH:mm:ss')
                  : '00:00:00',
                title: 'Tổng thời gian đàm thoại',
              },
              {
                time:
                  !dataGeneral?.numberInformation?.totalTimeSuccess ||
                  dataGeneral?.numberInformation?.totalTimeSuccess === 0
                    ? '00:00:00'
                    : moment
                        .utc(
                          (dataGeneral?.numberInformation?.totalTimeSuccess /
                            dataGeneral?.numberInformation?.totalCall) *
                            1000,
                        )
                        .format('HH:mm:ss'),
                title: 'Tổng thời gian đàm thoại TB',
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
                {/* <Radio.Group onChange={handleChangeTime}> */}
                {/* <Radio.Button value="HOURS" className={styles.buttonInActive}>
                    Giờ
                  </Radio.Button>
                  <Radio.Button value="DAYS" className={styles.buttonActive}>
                    Ngày
                  </Radio.Button>
                  <Radio.Button value="MONTHS" className={styles.buttonInActive}>
                    Tháng
                  </Radio.Button>
                  <Radio.Button value="YEARS" className={styles.buttonActive}>
                    Năm
                  </Radio.Button> */}
                {/* {dynamicTypeChart.map((item) => (
                    <Radio.Button
                      key={item.id}
                      value={item.id}
                      className={
                        paramsFilter.typeChart === item.id
                          ? styles.buttonActive
                          : styles.buttonInActive
                      }
                    >
                      {item.value}
                    </Radio.Button>
                  ))}
                </Radio.Group> */}
                {/* <Radio.Group value={paramsFilter.typeChart} onChange={handleChangeTime}>
                  <Radio.Button value="HOURS" disabled>Giờ</Radio.Button>
                  <Radio.Button value="DAYS">Ngày</Radio.Button>
                  <Radio.Button value="MONTHS">Tháng</Radio.Button>
                  <Radio.Button value="YEARS">Năm</Radio.Button>
                </Radio.Group> */}
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
          color={['#6376ff', '#1ee0ac', '#f6bb23']}
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
                  style: { fill: '#f6bb23', r: 5 },
                },
              },
              {
                value: 'Cuộc gọi ra',
                name: 'Cuộc gọi ra',
                marker: {
                  symbol: 'square',
                  style: { fill: '#1ee0ac', r: 5 },
                },
              },
              {
                value: 'Cuộc gọi nội bộ',
                name: 'Cuộc gọi nội bộ',
                marker: {
                  symbol: 'square',
                  style: { fill: '#6376ff', r: 5 },
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
          color={['#6376ff', '#1ee0ac', '#f6bb23']}
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
                  style: { fill: '#f6bb23', r: 5 },
                },
              },
              {
                value: 'Cuộc gọi ra',
                name: 'Cuộc gọi ra',
                marker: {
                  symbol: 'square',
                  style: { fill: '#1ee0ac', r: 5 },
                },
              },
              {
                value: 'Cuộc gọi nội bộ',
                name: 'Cuộc gọi nội bộ',
                marker: {
                  symbol: 'square',
                  style: { fill: '#6376ff', r: 5 },
                },
              },
            ],
          }}
        />
      </Row>
    </Card>
  );
}

export default OverviewReport;
