import React, { useMemo } from 'react';
import moment from 'moment';
import { Typography, Card, Button, Form, Row, Col, Input } from 'antd';
import { Export } from '@/components/Icons';
import DatePicker from '@/components/CustomDatePicker';
import Statistical from './components/Statistical';
import { LineChart, GroupedChart } from '@/components/Chart';
import styles from './styles.less';
import { requestExportLocalStatistic, requestLocalStatistic } from '@/services/call-center';
import PageLoading from '@/components/PageLoading';
import { mappingGroupChartData, mappingLineChartData } from './function';
import { isDisable } from './function';
import SelectDateTime from '@/components/SelectDateTime';

const dateFormat = 'YYYY-MM-DD';

function InternalAdmin(props) {
  const { user } = props;
  const { wsId, tokenGateway } = user;

  const [dataLineChart, setDataLineChart] = React.useState([]);
  const [dataGroupChart, setDataGroupChart] = React.useState([]);
  const headers = React.useMemo(() => {
    return {
      Authorization: tokenGateway,
    };
  }, [tokenGateway]);

  const [filters, setFilters] = React.useState({
    typeChart: 'HOURS',
    startDate: moment().startOf('day').format(dateFormat),
    endDate: moment().format(dateFormat),
    agentName: '',
    dateDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'days'),
    monthDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'months'),
  });

  const [responseData, setResponseData] = React.useState();

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
  const handleClickExport = () => {
    requestExportLocalStatistic(headers, { ...filters, subId: wsId });
  };

  React.useEffect(() => {
    requestLocalStatistic(headers, filters).then((response) => {
      if (response?.code == 200) {
        const data = response?.response;
        setResponseData(data);
        setDataGroupChart(mappingGroupChartData(data.chartCallLocal));
        setDataLineChart(mappingLineChartData(data.chartTimeCallLocal));
      }
    });
  }, [filters]);

  const handleChangeTime = React.useCallback(
    (e) => {
      setFilters({ ...filters, typeChart: e });
    },
    [filters],
  );

  if (!responseData) {
    return <PageLoading />;
  }

  return (
    <Card>
      <Row gutter={[0, 48]}>
        <Col span={24}>
          {/** Title with form */}
          <Row gutter={[0, 24]} justify="space-between">
            <Col xs={24} sm={24} md={24} lg={8}>
              <Typography.Title level={5}>Thống kê cuộc gọi nội bộ</Typography.Title>
            </Col>
            <Col xs={24} sm={24} md={24} lg={16}>
              <Form layout="inline" className={styles.form}>
                <Form.Item noStyle>
                  <Form.Item>
                    <Input placeholder="Nhập tên agent" onChange={handleAgentChange} />
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
            {/** Dunute chart with table */}
            <Col span={24}>
              <Statistical
                chart={{
                  width: 300,
                  height: 300,
                  color: ['#FF4D4F', '#428DFF'],
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
                      value: responseData?.numberInformation?.totalFailureCall || 0,
                    },
                    {
                      type: 'Cuộc gọi thành công',
                      value: responseData?.numberInformation?.totalSuccessCall || 0,
                    },
                  ],
                }}
                table={{
                  rowClassName: (record) => {
                    return record['type-call'] === 'Cuộc gọi thành công' ? styles.blue : styles.red;
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
                      'call-amount': responseData.numberInformation.totalSuccessCall || 0,
                      percentage: responseData.numberInformation.rateSuccessCall,
                    },
                    {
                      'type-call': 'Cuộc gọi thất bại',
                      'call-amount': responseData.numberInformation.totalFailureCall,
                      percentage: responseData.numberInformation.rateFailureCall,
                    },
                  ],
                }}
                overview={[
                  {
                    title: 'Tổng thời gian gọi nội bộ',
                    time: moment
                      .utc(responseData.numberInformation.totalTimeSuccess * 1000)
                      .format('HH:mm:ss'),
                  },
                  {
                    title: 'Thời gian gọi trung bình',
                    time: responseData.numberInformation.totalAvgTimeSuccessCall || '00:00:00',
                  },
                ]}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          {/** Title with form */}
          <Row gutter={[0, 24]} justify="space-between">
            <Col xs={24} sm={24} md={24} lg={8}>
              <Typography.Title level={5}>Số lượng cuộc gọi nội bộ</Typography.Title>
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
            {/** Barchart */}{' '}
            <Col span={24}>
              <GroupedChart
                height={500}
                data={dataGroupChart}
                color={({ stackField }) => {
                  if (stackField === 'cuộc gọi thất bại') {
                    return '#EE414A';
                  }
                  return '#428DFF';
                }}
                legend={{
                  visible: true,
                  position: 'top',
                  formatter: (text) => {
                    return text;
                  },
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[0, 24]}>
            {/** Title */}
            <Col span={24}>
              <Typography.Title level={5}>Thời gian gọi nội bộ</Typography.Title>
            </Col>
            {/** Linechart */}
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

export default InternalAdmin;
