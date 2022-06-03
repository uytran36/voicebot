import React, { useMemo } from 'react';
import moment from 'moment';
import { Typography, Card, Input, Button, Form, Row, Col, Radio } from 'antd';
import { Export } from '@/components/Icons';
import DatePicker from '@/components/CustomDatePicker';
import { CustomStatistical } from './components/Statistical';
import { GroupedChart, LineChart, BarChart } from '@/components/Chart';
import styles from './styles.less';
import PageLoading from '@/components/PageLoading';
import { requestExportOutboundStatictis, requestOutboundStatictis } from '@/services/call-center';
import SelectDateTime from '@/components/SelectDateTime';
import {
  mappingBarChartData,
  mappingGroupChartData,
  mappingLineChartData,
  isDisable,
} from './function';
const dateFormat = 'YYYY-MM-DD';
import { checkPermission, CALL_CENTER_MANAGEMENT } from '@/utils/permission';


function ReportOutCalling(props) {
  const { user } = props;
  const { tokenGateway, wsId, currentUser } = user;

  const headers = React.useMemo(() => {
    return {
      Authorization: tokenGateway,
    };
  }, [tokenGateway]);

  const isAdmin = useMemo(() => {
    return checkPermission(currentUser?.permissions, CALL_CENTER_MANAGEMENT.accessAllCallReport);
  }, [currentUser?.permissions]);

  const [dataLineChart, setDataLineChart] = React.useState([]);
  const [dataGroupChart, setDataGroupChart] = React.useState([]);
  const [dataBarChart, setDataBarChart] = React.useState([]);

  const [filters, setFilters] = React.useState({
    typeChart: 'HOURS',
    startDate: moment().startOf('day').format(dateFormat),
    endDate: moment().format(dateFormat),
    agentName: '',
    dateDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'days'),
    monthDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'months'),
  });

  const [fetchData, setFetchReponse] = React.useState();

  const handleAgentChange = (e) => {
    console.log(e);
  };

  const handleChangeDatePicker = React.useCallback(
    (value) => {
      if (value?.length > 0) {
        const startDate = moment(value[0]).format(dateFormat);
        const endDate = moment(value[1]).format(dateFormat);
        const dateDiff = moment(endDate).diff(moment(startDate), 'days');
        const monthDiff = moment(endDate).diff(moment(startDate), 'months');
        return setFilters({
          ...filters,
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
    [filters],
  );
  const handleChangeTime = React.useCallback(
    (e) => {
      setFilters({ ...filters, typeChart: e });
    },
    [filters],
  );

  const dynamicTypeChart = [
    { id: 'HOURS', value: 'Giờ' },
    { id: 'DAYS', value: 'Ngày' },
    { id: 'MONTHS', value: 'Tháng' },
    { id: 'YEARS', value: 'Năm' },
  ];

  const handleClickExport = () => {
    requestExportOutboundStatictis({ username: 'admin' }, { ...filters, subId: wsId });
  };

  React.useEffect(() => {
    requestOutboundStatictis({ username: 'admin' }, filters).then((response) => {
      if (response?.code == 200) {
        const data = response.response;
        setFetchReponse(data);
        setDataGroupChart(mappingGroupChartData(data.chartCallOutbound));
        setDataLineChart(mappingLineChartData(data.chartTimeCallOutbound));
        setDataBarChart(mappingBarChartData(data.numberInformation));
      }
    });
  }, [filters]);

  if (!fetchData) {
    return <PageLoading />;
  }
  return (
    <Card>
      <Row gutter={[0, 48]}>
        <Col span={24}>
          {/** Title with form */}
          <Row gutter={[0, 24]} justify="space-between">
            <Col xs={24} sm={24} md={24} lg={6}>
              <Typography.Title level={5}>Thống kê cuộc gọi ra</Typography.Title>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18}>
              <Form layout="inline" className={styles.form}>
                <Form.Item noStyle>
                  {/* <Form.Item>
                    <Select options={[]} placeholder="Hotline" />
                  </Form.Item> */}
                  {isAdmin && (
                    <Form.Item>
                      <Input
                        options={[]}
                        placeholder="Nhập tên agent"
                        onChange={handleAgentChange}
                      />
                    </Form.Item>
                  )}
                  <Form.Item>
                    <Input options={[]} placeholder="Số khách hàng" />
                  </Form.Item>
                  <Form.Item>
                    <DatePicker
                      format={dateFormat}
                      onChange={(e) => handleChangeDatePicker(e)}
                      value={[
                        moment(filters.startDate, dateFormat),
                        moment(filters.endDate, dateFormat),
                      ]}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      style={{ backgroundColor: '#127ACE', color: '#FFFFFF' }}
                      icon={<Export />}
                      onClick={handleClickExport}
                    >
                      Export
                    </Button>
                  </Form.Item>
                </Form.Item>
              </Form>
            </Col>
            <Col span={24}>
              <CustomStatistical
                chart={{
                  width: 300,
                  height: 300,
                  color: ['#EE414A', '#07C2DE'],
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
                      type: 'Cuộc gọi thất bại',
                      value: fetchData?.numberInformation?.totalFailureCall,
                    },
                    {
                      type: 'Cuộc gọi thành công',
                      value: fetchData?.numberInformation?.totalSuccessCall,
                    },
                  ],
                }}
                table={{
                  expandable: {
                    rowExpandable: (record) => record.collapse && Array.isArray(record.collapse),
                    rowExpandRender: (col, record, index) => record[col],
                  },
                  rowClassName: (record) => {
                    return record['type-call'] === 'Cuộc gọi thành công'
                      ? styles.green
                      : styles.red;
                  },
                  columns: [
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
                      title: 'Tỷ lệ',
                      dataIndex: 'percentage',
                      key: 'percentage',
                      isSum: true,
                      isPercent: true,
                      align: 'center',
                      render: (text) => {
                        return <span style={{ textAlign: 'center', margin: 0 }}>{text}%</span>;
                      },
                    },
                  ],
                  data: [
                    {
                      'type-call': 'Cuộc gọi thành công',
                      'call-amount': fetchData.numberInformation.totalSuccessCall,
                      percentage: fetchData.numberInformation.rateSuccessCall.toFixed(2),
                    },
                    {
                      'type-call': 'Cuộc gọi thất bại',
                      'call-amount': fetchData.numberInformation.totalFailureCall,
                      percentage: fetchData.numberInformation.rateFailureCall.toFixed(2),
                      collapse: [
                        {
                          'type-call': 'Máy bận',
                          'call-amount': fetchData.numberInformation.totalBusyCall.toString(),
                          percentage: `${fetchData.numberInformation.rateBusyCall
                            .toFixed(2)
                            .toString()}%`,
                        },
                        {
                          'type-call': 'Cuộc gọi bị từ chối',
                          'call-amount': fetchData.numberInformation.totalRejectedCall.toString(),
                          percentage: `${fetchData.numberInformation.rateRejectedCall
                            .toFixed(2)
                            .toString()}%`,
                        },
                        {
                          'type-call': 'Không bắt máy',
                          'call-amount': fetchData.numberInformation.totalNoAnswerCall.toString(),
                          percentage: `${fetchData.numberInformation.rateNoAnswerCall
                            .toFixed(2)
                            .toString()}%`,
                        },
                        {
                          'type-call': 'Dừng cuộc gọi',
                          'call-amount': fetchData.numberInformation.totalCancelledCall.toString(),
                          percentage: `${fetchData.numberInformation.rateCancelledCall
                            .toFixed(2)
                            .toString()}%`,
                        },
                        {
                          'type-call': 'Thất bại khác',
                          'call-amount':
                            fetchData.numberInformation.totalOrtherFailureCall.toString(),
                          percentage: `${fetchData.numberInformation.rateOrtherFailureCall
                            .toFixed(2)
                            .toString()}%`,
                        },
                      ],
                    },
                  ],
                }}
                overview={[
                  {
                    title: 'Tổng thời gian gọi ra',
                    time: moment
                      .utc(fetchData.numberInformation.totalTimeSuccess * 1000)
                      .format('HH:mm:ss'),
                  },
                ]}
                transferCall={{
                  avg: fetchData.numberInformation.totalAvgTimeSuccessCall || '00:00:00',
                  total:
                    fetchData.numberInformation.totalTimeCall > 0
                      ? moment
                          .utc(fetchData.numberInformation.totalTimeCall * 1000)
                          .format('HH:mm:ss')
                      : '00:00:00',
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[0, 24]} justify="space-between">
            <Col xs={24} sm={24} md={24} lg={8}>
              <Typography.Title className={styles.title} level={4}>
                Số lượng cuộc gọi ra
              </Typography.Title>
            </Col>
            <Col xs={24} sm={24} md={24} lg={16}>
              <Col>
                <Form layout="inline" style={{ float: 'right' }}>
                  <Form.Item noStyle>
                    <Form.Item label="Hiển thị dữ liệu:">
                      <SelectDateTime
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        callback={handleChangeTime}
                        selectedValue={filters.typeChart}
                        dateDiff={filters.dateDiff}
                        monthDiff={filters.monthDiff}
                      />
                    </Form.Item>
                  </Form.Item>
                </Form>
              </Col>
            </Col>
            {/* <Col xs={24} sm={24} md={24} lg={24}>
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
            <Col span={24}>
              <GroupedChart
                data={dataGroupChart}
                color={({ stackField }) => {
                  if (stackField === 'cuộc gọi thất bại') {
                    return '#EE414A';
                  }
                  return '#1EE0AC';
                }}
                legend={{
                  visible: true,
                  position: 'top',
                  formatter: (text) => {
                    if (text === 'cuộc gọi thất bại') {
                      return 'Cuộc gọi thất bại';
                    }
                    return 'Cuộc gọi thành công';
                  },
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[0, 24]}>
            <Col span={24}>
              <Typography.Title className={styles.title} level={4}>
                Thống kê cuộc gọi thất bại
              </Typography.Title>
            </Col>
            <Col span={24}>
              <BarChart color={'#FF4D4F'} data={dataBarChart} xField={'value'} yField={'type'} />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <Typography.Title className={styles.title} level={4}>
                Thời gian gọi ra
              </Typography.Title>
            </Col>
            <Col span={24}>
              <LineChart
                data={dataLineChart}
                xField={'date'}
                yField={'value'}
                lineStyle={{
                  stroke: '#1EE0AC',
                }}
                point={{
                  style: {
                    stroke: '#1EE0AC',
                  },
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}

export default ReportOutCalling;
