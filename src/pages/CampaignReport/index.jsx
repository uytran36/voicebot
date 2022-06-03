import React, { useEffect, useState, useCallback, useRef } from 'react';
import { connect } from 'umi';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import PT from 'prop-types';
import Table from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Switch,
  Row,
  Col,
  Card,
  Button,
  Select,
  Typography,
  Popover,
  Calendar,
  notification,
  message,
  Tooltip,
} from 'antd';
import moment from 'moment';
import styles from './styles.less';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import {
  requestReportCampaignDaily,
  requestReportCampaignDetail,
  requestReportVoiceOutboundDays,
  requestReportCampaignDays,
  requestReportCampaignMonth,
  requestReportMonthOutbound
} from './service';
import { Filter } from '@/components/Icons';
import CheckWindowSize from '@/components/CheckWindownSize';

const { Option } = Select;

CampaignReport.propTypes = {
  user: PT.shape({
    tokenHub: PT.string,
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
  }).isRequired,
  settings: PT.shape({
    primaryColor: PT.string,
  }).isRequired,
};

function CampaignReport({
  user: { userId, authToken, tokenGateway, tokenHub },
  settings: { primaryColor },
}) {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFilterRateVisible, setisFilterRateVisible] = useState(false);
  const [currentDateRateLeft, setCurrentDateRateLeft] = useState(moment().endOf('day'));
  const [currentDateRateRight, setCurrentDateRateRight] = useState(moment().endOf('day'));

  const [isFilterFluctuateVisible, setisFilterFluctuateVisible] = useState(false);
  const [currentDateFluctuateLeft, setCurrentDateFluctuateLeft] = useState(moment().endOf('day'));
  const [currentDateFluctuateRight, setCurrentDateFluctuateRight] = useState(moment().endOf('day'));

  const [isFilterCampaignDetailVisible, setisFilterCampaignDetailVisible] = useState(false);
  const [currentDateCampaignDetailLeft, setCurrentDateCampaignDetailLeft] = useState(
    moment().endOf('day'),
  );
  const [currentDateCampaignDetailRight, setCurrentDateCampaignDetailRight] = useState(
    moment().endOf('day'),
  );
  const [dateReportDetail, setDateReportDetail] = useState({
    fromDate: moment().subtract(1, 'months').startOf('day').toJSON(),
    toDate: moment().endOf('day').endOf('day').toJSON()
  })

  const [statusDaily, setStatusDaily] = useState('ALL')
  const [statusDetail, setStatusDetail] = useState('ALL')

  const [reportMonth, setReportMonth] = useState({});
  const [filterReportMonth, setFilterReportMonth] = useState({
    month: moment().month() + 1,
    year: moment().year()
  })

  const [showTable, toggle] = useState(false);
  const [voiceOutboundReport, setVoiceOutboundReport] = useState({});
  const [voiceOutboundMonthReport, setVoiceOutboundMonthReport] = useState({})
  const [reportCampaignDaily, setReportCampaignDaily] = useState({});
  const [isActive, toggleActive] = useState('1');
  const [ratioReport, setRatioReport] = useState([]);
  const [totalCampaignDay, setTotalCampaignDay] = useState([]);
  const [titleRatioReport, setTitleRatioReport] = useState('Số chiến dịch');
  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`,
  };

  const actionRef = useRef();

  const handleClickSearch = () => {
    const fromDate = moment(currentDateRateLeft).add('7', 'hours').startOf('day').toJSON();
    const toDate = moment(currentDateRateRight).add('7', 'hours').endOf('day').toJSON();
    fetchReportCampaignDaily({
      status: statusDaily,
      token: tokenHub,
      fromDate,
      toDate,
    });
    setisFilterRateVisible(false);
  };

  const handleClickSearchDaysCampaign = () => {
    const fromDate = moment(currentDateFluctuateLeft).startOf('day').toJSON();
    const toDate = moment(currentDateFluctuateRight).endOf('day').toJSON();
    fetchReportCampaignDays({
      token: tokenHub,
      fromDate,
      toDate,
    });
    setisFilterFluctuateVisible(false);
  };

  const handleClickSearchDetailCampaign = async () => {
    const fromDate = moment(currentDateCampaignDetailLeft).startOf('day').toJSON();
    const toDate = moment(currentDateCampaignDetailRight).endOf('day').toJSON();
    setDateReportDetail({ fromDate, toDate})
    actionRef?.current?.reload();

    // const res = await requestReportCampaignDetail(headers, {
    //   status: statusDetail,
    //   token: tokenHub,
    //   fromDate,
    //   toDate,
    // });
    // if (res.success) {
    //   actionRef?.current?.reload();
    // }
    return setisFilterCampaignDetailVisible(false);
  };

  // thong ke theo ti le
  const fetchReportCampaignDaily = useCallback(async (_data) => {
    try {
      const res = await requestReportCampaignDaily(headers, _data);
      if (res.success) {
        if (Array.isArray(res.data)) {
          const dataCall = {
            campaign_pending: 0,
            campaign_running: 0,
            campaign_complete: 0,
            campaign_new: 0, // chưa chạy
            total_call_number: 0,
            total_call_customer: 0,
            total_call_established: 0,
            total_call_duration_sec: 0,
            total_call_duration_msec: 0,
            total_call_time_sec: 0,
            total_call_time_msec: 0,
            mean_call_time_sec: 0,
            mean_call_time_msec: 0,
            total_characters_t2s: 0,
            total_requests_t2s: 0,
            total_crr_duration_5s: 0,
            total_crr_duration_15s: 0,
            total_crr_duration_30s: 0,
            total_crr_duration_higher: 0,
          };
          res.data.map((item) => {
            if (item.campaign_status === 'PENDING') dataCall.campaign_running += 1;
            if (item.campaign_status === 'RUNNING') dataCall.campaign_running += 1;
            if (item.campaign_status === 'COMPLETED') dataCall.campaign_complete += 1;
            if (item.campaign_status === 'NEW') dataCall.campaign_new += 1;
            dataCall.total_call_number += item.total_call_number;
            dataCall.total_call_customer += item.total_call_customer;
            dataCall.total_call_established += item.total_call_established;
            dataCall.total_call_duration_sec += item.total_call_duration_sec;
            dataCall.total_call_duration_msec += item.total_call_duration_msec;
            dataCall.total_call_time_sec += item.total_call_time_sec;
            dataCall.total_call_time_msec += item.total_call_time_msec;
            dataCall.mean_call_time_sec += item.mean_call_time_sec;
            dataCall.mean_call_time_msec += item.mean_call_time_msec;
            dataCall.total_characters_t2s += item.total_characters_t2s;
            dataCall.total_requests_t2s += item.total_requests_t2s;
            dataCall.total_crr_duration_5s += item.total_crr_duration_5s;
            dataCall.total_crr_duration_15s += item.total_crr_duration_15s;
            dataCall.total_crr_duration_30s += item.total_crr_duration_30s;
            dataCall.total_crr_duration_higher += item.total_crr_duration_higher;
            return dataCall;
          });
          setReportCampaignDaily(dataCall);
        }
        return null;
      }
      throw new Error(res.error || 'Error...');
    } catch (err) {
      notification.error(err.toString());
      return null;
    }
  }, []);

  const queryReportMonthOutBound = useCallback(data => {
    if (!data?.date) {
      return null;
    }
    return requestReportMonthOutbound(headers, data).then((res) => {
      if (res?.success === true && Array.isArray(res.data)) {
        const result = res.data[0] || {}
        setVoiceOutboundMonthReport(result)
      }
    });
  }, [headers]);

  const fetchReportVoiceOutboundDays = useCallback(async (_data) => {
    try {
      const res = await requestReportVoiceOutboundDays(headers, _data);
      // const res = await requestReportCampaignDays(_data)
      if (res.success) {
        const dataCall = {
          date: [],
          arrTotalCallConnected: [],
          arrTotalCalled: [],
          arrTotalCharactersT2S: [],
          arrTotalRequestT2S: [],
          arrTotalTimeCalled: [],
          totalCallConnected: 0,
          totalCalled: 0,
          totalCharactersT2S: 0,
          totalRequestT2S: 0,
          totalTimeCalled: 0,
        };
        res.data.map((item) => {
          dataCall.totalCallConnected += item.totalCallConnected;
          dataCall.totalCalled += item.totalCalled;
          dataCall.totalCharactersT2S += item.totalCharactersT2S;
          dataCall.totalRequestT2S += item.totalRequestT2S;
          dataCall.totalTimeCalled += item.totalTimeCalled;
          dataCall.date.push(moment(item.date).format('DD/MM/YYYY'));
          dataCall.arrTotalCallConnected.push(item.totalCallConnected);
          dataCall.arrTotalCalled.push(item.totalCalled);
          dataCall.arrTotalCharactersT2S.push(item.totalCharactersT2S);
          dataCall.arrTotalRequestT2S.push(item.totalRequestT2S);
          dataCall.arrTotalTimeCalled.push(item.totalTimeCalled);
          return dataCall;
        });
        // console.log({ result })
        // setRatioReport(dataCall.arrTotalCallConnected)
        return setVoiceOutboundReport(dataCall);
      }
      throw new Error(res.error || 'Error...');
    } catch (err) {
      console.log(err);
      notification.error(err.toString());
      return [];
    }
  }, []);

  const fetchReportCampaignDays = useCallback(async (_data) => {
    try {
      const res = await requestReportCampaignDays(headers, _data);
      if (res.success) {
        // dang de so chien dich la so khoi tao
        const dataCall = {
          date: [],
          arrTotalCampaign: [],
          arrTotalCall: [],
          arrTotalCustomer: [],
          arrTotalRequestT2S: [],
          arrTotalCharactersT2S: [],
        };
        res.data.map((item) => {
          dataCall.date.push(moment(item.date).format('DD/MM/YYYY'));
          dataCall.arrTotalCampaign.push(item.total_campaigns);
          dataCall.arrTotalCall.push(item.total_call);
          dataCall.arrTotalCustomer.push(item.total_customer);
          dataCall.arrTotalRequestT2S.push(item.total_requests_t2s);
          dataCall.arrTotalCharactersT2S.push(item.total_characters_t2s);
          return dataCall;
        });
        // console.log({dataCall})
        setRatioReport(dataCall.arrTotalCampaign);
        return setTotalCampaignDay(dataCall);
      }
      throw new Error(res.error || 'Error...');
    } catch (err) {
      console.log(err);
      notification.error(err.toString());
      return [];
    }
  }, []);

  // Thong ke theo thang
  const fetchReportCampaignMonth = useCallback(async (_data) => {
    try {
      const res = await requestReportCampaignMonth(headers, _data);
      if (res.success) {
        return setReportMonth(res.data);
      }
      throw new Error(res.error || 'Error...');
    } catch (err) {
      console.log(err);
      notification.error(err.toString());
      return [];
    }
  }, []);

  const renderValueRatio = (caseActive) => {
    toggleActive(caseActive);
    switch (caseActive) {
      case '1':
        setRatioReport(totalCampaignDay.arrTotalCampaign);
        setTitleRatioReport('Số chiến dịch');
        break;
      case '2':
        setRatioReport(totalCampaignDay.arrTotalCall);
        setTitleRatioReport('Số cuộc gọi');
        break;
      case '3':
        setRatioReport(totalCampaignDay.arrTotalCustomer);
        setTitleRatioReport('Số khách hàng');
        break;
      case '4':
        setRatioReport(totalCampaignDay.arrTotalRequestT2S);
        setTitleRatioReport('Số API yêu cầu');
        break;
      case '5':
        setRatioReport(totalCampaignDay.arrTotalCharactersT2S);
        setTitleRatioReport('Số ký tự');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // if (tokenHub) {
    //   fetchVoiceOutboundReport({
    //     date: moment().toJSON(),
    //     token: tokenHub,
    //   });
    // }
    const fromDate = moment().subtract('1', 'month').startOf('day').toJSON();
    const toDate = moment().endOf('day').toJSON();
    const fromDateYear = moment().startOf('year').toJSON();
    const token = tokenHub;
    fetchReportCampaignDaily({
      status: statusDaily,
      token,
      fromDate: fromDateYear,
      toDate,
    });
    // fetchReportVoiceOutboundDays({
    //   token,
    //   fromDate,
    //   toDate,
    // });
    fetchReportCampaignDays({
      token,
      fromDate,
      toDate,
    });
    fetchReportCampaignMonth({
      token,
      date: toDate,
    });
    queryReportMonthOutBound({
      token,
      date: toDate,
    })
  }, []);

  const showTotal = (total, range) => {
    return ` ${range[0]}-${range[1]} or ${total} items`;
  };

  const disabledDateLeft = (currentDate) => {
    return currentDate && currentDate < moment().endOf('day');
  };

  const disabledDateRight = (currentDate, currentDateLeft) => {
    return currentDate && currentDate < currentDateLeft;
  };

  const onChangeDateLeft = (date, currentDateRight, setCurrentDateLeft, setCurrentDateRight) => {
    setCurrentDateLeft(date);
    if (currentDateRight < date) {
      setCurrentDateRight(date);
    }
  };

  const handleChangeStatus = (e, typeReport) => {
    if (typeReport === 'ratio') return setStatusDaily(e)
    if (typeReport === 'detail') return setStatusDetail(e)
  }

  const customHeader = ({ value, type, onChange, onTypeChange}, left, typeReport) => {
    const start = 0;
    const end = 12;
    const monthOptions = [];
    const current = value.clone();
    const localeData = value.localeData();
    const months = [];
    for (let i = 0; i < 12; i += 1) {
      current.month(i);
      months.push(localeData.monthsShort(current));
    }

    for (let index = start; index < end; index += 1) {
      monthOptions.push(
        <Select.Option className="month-item" key={`${index}`}>
          {months[index]}
        </Select.Option>,
      );
    }
    const month = value.month();

    const year = value.year();
    const options = [];
    for (let i = year - 10; i < year + 10; i += 1) {
      options.push(
        <Select.Option key={i} value={i} className="year-item">
          {i}
        </Select.Option>,
      );
    }

    return (
      <div style={{ padding: 8, textAlign: left ? 'right' : 'left' }}>
        <Typography.Text>
          {' '}
          {left ? 'Từ : ' + value.format('DD/MM/YYYY') : 'Đến : ' + value.format('DD/MM/YYYY')}
        </Typography.Text>
        <Row gutter={8}>
          <Col span={8}>
            {left ? (
              <Select
                size="small"
                dropdownMatchSelectWidth={false}
                className="my-year-select"
                defaultValue={'ALL'}
                onSelect={(e) => handleChangeStatus(e, typeReport)}
              >
                <Option value="ALL">Tất cả</Option>
                <Option value="RUNNING">Đang chạy</Option>
                <Option value="SCHEDULED">Chưa chạy</Option>
                <Option value="COMPLETED">Hoàn thành</Option>
                <Option value="PENDING">Tạm dừng</Option>
              </Select>
            ) : null}
          </Col>
          <Col span={8}>
            <Select
              size="small"
              dropdownMatchSelectWidth={false}
              className="my-year-select"
              onChange={(newYear) => {
                const now = value.clone().year(newYear);
                onChange(now);
              }}
              value={String(year)}
            >
              {options}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              size="small"
              dropdownMatchSelectWidth={false}
              value={String(month)}
              onChange={(selectedMonth) => {
                const newValue = value.clone();
                newValue.month(parseInt(selectedMonth, 10));
                onChange(newValue);
              }}
            >
              {monthOptions}
            </Select>
          </Col>
        </Row>
      </div>
    );
  };

  const renderCaret = (number) =>
    number < 0 ? (
      <>
        <CaretDownOutlined style={{ color: 'red' }} />{' '}
      </>
    ) : (
      <CaretUpOutlined />
    );

  const onSelectMonth = month => {
    const date = moment(`${filterReportMonth.year}-${month}-02`).toJSON()
    setFilterReportMonth({
      ...filterReportMonth,
      month
    })
    fetchReportCampaignMonth({ token: tokenHub, date })
  }

  const onSelectYear = year => {
    const date = moment(`${year}-${filterReportMonth.month}-02`).toJSON()
    setFilterReportMonth({
      ...filterReportMonth,
      year
    })
    fetchReportCampaignMonth({ token: tokenHub, date })
  }

  const size = CheckWindowSize();
  console.log(size);

  return (
    <PageContainer>
      <Card bodyStyle={{ padding: '24px 12px 24px 12px' }}>
        <Row gutter={[0, 36]}>
          <Col span={24} className={styles.title}>
            <Typography.Title className={styles.title__text} level={3}>
              Thống kê tổng quát
            </Typography.Title>
          </Col>
          <Col span={20} offset={2}>
            <Bar
              height={120}
              data={{
                datasets: [
                  {
                    label: 'Tổng số thời gian gọi',
                    backgroundColor: '#636F83',
                    borderWidth: 1,
                    maxBarThickness: 50,
                    data: [voiceOutboundMonthReport.totalTimeCalledPercent],
                  },
                  {
                    label: 'Số cuộc gọi đã thực hiện',
                    backgroundColor: '#1169B0',
                    borderWidth: 1,
                    maxBarThickness: 50,
                    data: [voiceOutboundMonthReport.totalCalledPercent],
                  },
                  {
                    label: 'Số cuộc gọi đã bắt máy',
                    backgroundColor: '#2EB85C',
                    borderWidth: 1,
                    maxBarThickness: 50,
                    data: [voiceOutboundMonthReport.totalCallConnectedPercent],
                  },
                  {
                    label: 'Tổng số API yêu cầu',
                    backgroundColor: '#E55353',
                    borderWidth: 1,
                    maxBarThickness: 50,
                    data: [voiceOutboundMonthReport.totalRequestT2SPercent],
                  },
                  {
                    label: 'Tổng số ký tự',
                    backgroundColor: '#C98900',
                    borderWidth: 1,
                    maxBarThickness: 50,
                    data: [voiceOutboundMonthReport.totalCharactersT2SPercent],
                  },
                ],
              }}
              options={{
                responsive: true,
                // layout: {
                //   padding: {
                //     bottom: 20,
                //   },
                // },
                legend: {
                  position: 'bottom',
                },
                title: {
                  display: false,
                },
                animation: {
                  animateScale: true,
                  animateRotate: true,
                },
                tooltips: {
                  enabled: true,
                  callbacks: {
                    title: ({ ...rest }) => {
                      return '';
                    },
                  },
                },
                scales: {
                  yAxes: [
                    {
                      offset: true,
                      ticks: {
                        // max: barChartXmax,
                        min: 0,
                        // maxTicksLimit: 100,
                        fontStyle: 'bold',
                        fontColor: 'black',
                        callback: (value, index, values) => {
                          // console.log({ value, index, values });
                          // if (value % 25 === 0) {
                          //   if (value === 100) {
                          //     return value + '(%)';
                          //   }
                          //   return value;
                          // }
                          return value;
                        },
                      },
                    },
                  ],
                },
              }}
            />
          </Col>
          <Col span={24} className={styles.title}>
            <Typography.Title className={styles.title__text} level={3}>
              Thống kê theo tỉ lệ
            </Typography.Title>
            {/* SangTT comment filter */}
            {/* <Popover
              className={styles.popover}
              content={
                <div className={styles.popoverContent}>
                  <div className={styles.calendar}>
                    <Calendar
                      className={styles.calendarLeft}
                      fullscreen={false}
                      headerRender={({ value, type, onChange, onTypeChange }) =>
                        customHeader({ value, type, onChange, onTypeChange, }, true, 'ratio')
                      }
                      value={currentDateRateLeft}
                      onChange={(date) =>
                        onChangeDateLeft(
                          date,
                          currentDateRateRight,
                          setCurrentDateRateLeft,
                          setCurrentDateRateRight,
                        )
                      }
                    />
                    <Calendar
                      className={styles.calendarRight}
                      disabledDate={(currentDate) =>
                        disabledDateRight(currentDate, currentDateRateLeft)
                      }
                      fullscreen={false}
                      value={currentDateRateRight}
                      onChange={setCurrentDateRateRight}
                      headerRender={({ value, type, onChange, onTypeChange }) =>
                        customHeader({ value, type, onChange, onTypeChange }, false, 'wavering')
                      }
                    />
                  </div>
                  <Button onClick={handleClickSearch} className={styles.buttonSearch}>
                    Tìm kiếm
                  </Button>
                </div>
              }
              title=""
              placement="bottom"
              trigger="click"
              visible={isFilterRateVisible}
              onVisibleChange={setisFilterRateVisible}
            >
              <Button className={styles.buttonFilter}>
                Bộ lọc <Filter style={{ marginLeft: 5 }} />
              </Button>
            </Popover> */}
          </Col>
          <Col span={24} offset={2}>
            <Row>
              <Col span={size.width <= 986 ? 6 : 3 }>
                <Card className={styles.cardContent}>
                  <p style={{ color: '#636F83', fontWeight: 'bold' }}>
                    <span className={styles.title__card}>Tổng thời gian gọi</span>
                    <span>{reportCampaignDaily.total_call_duration_sec}</span>
                  </p>
                  <p style={{ color: '#1169B0', fontWeight: 'bold' }}>
                    <span className={styles.title__card}>Số cuộc gọi đã thực hiện</span>
                    <span>{reportCampaignDaily.total_call_number}</span>
                  </p>
                  <p style={{ color: '#2EB85C', fontWeight: 'bold' }}>
                    <span className={styles.title__card}>Số cuộc gọi đã bắt máy</span>
                    <span>{reportCampaignDaily.total_call_established}</span>
                  </p>
                  <p style={{ color: '#E55353', fontWeight: 'bold' }}>
                    <span className={styles.title__card}>Tổng số API yêu cầu</span>
                    <span>{reportCampaignDaily.total_requests_t2s}</span>
                  </p>
                  <p style={{ color: '#C98900', fontWeight: 'bold' }}>
                    <span className={styles.title__card}>Tổng số ký tự</span>
                    <span>{reportCampaignDaily.total_characters_t2s}</span>
                  </p>
                </Card>
              </Col>
              <Col span={size.width <= 986 ? 24 : 18}>
                <div className={styles.doughnutWrap}>
                  <div className={styles.doughnut}>
                    <Doughnut
                      height={320}
                      data={{
                        labels: ['Chưa chạy', 'Đang chạy', 'Đã hoàn thành', 'Tạm dừng'],
                        datasets: [
                          {
                            data: [
                              reportCampaignDaily.campaign_pending,
                              reportCampaignDaily.campaign_running,
                              reportCampaignDaily.campaign_complete,
                              reportCampaignDaily.campaign_new,
                            ],
                            backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        cutoutPercentage: 70,
                        legend: {
                          position: 'bottom',
                          labels: {
                            fontColor: '#1169B0',
                          },
                          align: 'center',
                        },
                        title: {
                          display: true,
                          text: `Tổng số chiến dịch (${reportCampaignDaily.campaign_pending +
                            reportCampaignDaily.campaign_running +
                            reportCampaignDaily.campaign_complete +
                            reportCampaignDaily.campaign_new
                            })`,
                          fontColor: 'black',
                        },
                        animation: {
                          animateScale: true,
                          animateRotate: true,
                        },
                        tooltips: {
                          enabled: true,
                        },
                      }}
                    />
                  </div>
                  <div className={styles.doughnut}>
                    <Doughnut
                      height={300}
                      data={{
                        labels: ['Thành công', 'Không thành công'],
                        datasets: [
                          {
                            data: [
                              reportCampaignDaily.total_call_established,
                              reportCampaignDaily.total_call_number -
                              reportCampaignDaily.total_call_established,
                            ],
                            backgroundColor: ['#36A2EB', '#FF6384'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        cutoutPercentage: 70,
                        legend: {
                          position: 'bottom',
                          labels: {
                            fontColor: '#1169B0',
                          },
                          align: 'center',
                        },
                        title: {
                          display: true,
                          text: 'Tổng số cuộc gọi',
                          fontColor: 'black',
                        },
                        animation: {
                          animateScale: true,
                          animateRotate: true,
                        },
                        tooltips: {
                          enabled: true,
                        },
                      }}
                    />
                  </div>
                  <div className={styles.doughnut}>
                    <Doughnut
                      height={320}
                      data={{
                        labels: ['Dưới 5s', 'Từ 5s - 15s', 'Từ 15s - 30s', 'Trên 30s'],
                        datasets: [
                          {
                            data: [
                              reportCampaignDaily.total_crr_duration_5s,
                              reportCampaignDaily.total_crr_duration_15s,
                              reportCampaignDaily.total_crr_duration_30s,
                              reportCampaignDaily.total_crr_duration_higher,
                            ],
                            backgroundColor: ['#36A2EB', '#FFCE56', '#8BBF49', '#e05f5f'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        cutoutPercentage: 70,

                        legend: {
                          position: 'bottom',
                        },
                        title: {
                          display: true,
                          text: 'Thời lượng nghe cuộc gọi',
                          fontColor: 'black',
                        },
                        animation: {
                          animateScale: true,
                          animateRotate: true,
                        },
                        tooltips: {
                          enabled: true,
                        },
                      }}
                    />
                  </div>
                  <div className={styles.doughnut}>
                    <Doughnut
                      height={300}
                      data={{
                        labels: ['Nhấc máy', 'Không nhấc máy'],
                        datasets: [
                          {
                            data: [
                              reportCampaignDaily.total_call_established,
                              reportCampaignDaily.total_call_customer -
                              reportCampaignDaily.total_call_established,
                            ],
                            backgroundColor: ['#36A2EB', '#FF6384'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        cutoutPercentage: 70,
                        legend: {
                          position: 'bottom',
                        },
                        title: {
                          display: true,
                          text: 'Tổng số khách hàng',
                          fontColor: 'black',
                        },
                        animation: {
                          animateScale: true,
                          animateRotate: true,
                        },
                        tooltips: {
                          enabled: true,
                        },
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={24} className={styles.title}>
            <Typography.Title className={styles.title__text} level={3}>
              Thống kê giao động
            </Typography.Title>
            <Popover
              className={styles.popover}
              content={
                <div className={styles.popoverContent}>
                  <div className={styles.calendar}>
                    <Calendar
                      className={styles.calendarLeft}
                      fullscreen={false}
                      headerRender={({ value, type, onChange, onTypeChange }) =>
                        customHeader({ value, type, onChange, onTypeChange }, true, 'wavering')
                      }
                      value={currentDateFluctuateLeft}
                      onChange={(date) =>
                        onChangeDateLeft(
                          date,
                          currentDateFluctuateRight,
                          setCurrentDateFluctuateLeft,
                          setCurrentDateFluctuateRight,
                        )
                      }
                    />
                    <Calendar
                      className={styles.calendarRight}
                      disabledDate={(currentDate) =>
                        disabledDateRight(currentDate, currentDateFluctuateLeft)
                      }
                      fullscreen={false}
                      headerRender={({ value, type, onChange, onTypeChange }) =>
                        customHeader({ value, type, onChange, onTypeChange }, false)
                      }
                      value={currentDateFluctuateRight}
                      onChange={setCurrentDateFluctuateRight}
                    />
                  </div>
                  <Button onClick={handleClickSearchDaysCampaign} className={styles.buttonSearch}>
                    Tìm kiếm
                  </Button>
                </div>
              }
              title=""
              placement="bottom"
              trigger="click"
              visible={isFilterFluctuateVisible}
              onVisibleChange={setisFilterFluctuateVisible}
            >
              <Button className={styles.buttonFilter}>
                Bộ lọc <Filter style={{ marginLeft: 5 }} />
              </Button>
            </Popover>
          </Col>
          <Col span={20} offset={2}>
            <Row gutter={[0, 16]}>
              <Col xs={24} md={4} lg={4} style={{ display: 'flex', flexDirection: 'column' }}>
                <Row gutter={[8, 8]}>
                  <Col xs={5} md={24}>
                    <span
                      onClick={() => renderValueRatio('1')}
                      style={
                        isActive === '1'
                          ? { color: primaryColor, fontWeight: 'bold' }
                          : { cursor: 'pointer' }
                      }
                    >
                      Số chiến dịch
                    </span>
                  </Col>
                  <Col xs={5} md={24}>
                    <span
                      onClick={() => renderValueRatio('2')}
                      style={
                        isActive === '2'
                          ? { color: primaryColor, fontWeight: 'bold', cursor: 'pointer' }
                          : { cursor: 'pointer' }
                      }
                    >
                      Số cuộc gọi
                    </span>
                  </Col>
                  <Col xs={5} md={24}>
                    <span
                      onClick={() => renderValueRatio('3')}
                      style={
                        isActive === '3'
                          ? { color: primaryColor, fontWeight: 'bold', cursor: 'pointer' }
                          : { cursor: 'pointer' }
                      }
                    >
                      Số khách hàng
                    </span>
                  </Col>
                  <Col xs={5} md={24}>
                    <span
                      onClick={() => renderValueRatio('4')}
                      style={
                        isActive === '4'
                          ? { color: primaryColor, fontWeight: 'bold', cursor: 'pointer' }
                          : { cursor: 'pointer' }
                      }
                    >
                      Số API yêu cầu
                    </span>
                  </Col>
                  <Col xs={4} md={24}>
                    <span
                      onClick={() => renderValueRatio('5')}
                      style={
                        isActive === '5'
                          ? { color: primaryColor, fontWeight: 'bold', cursor: 'pointer' }
                          : { cursor: 'pointer' }
                      }
                    >
                      Số ký tự
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={20} lg={20}>
                <Line
                  height={200}
                  width={200}
                  data={{
                    labels: totalCampaignDay.date,
                    datasets: [
                      {
                        label: titleRatioReport,
                        fill: false,
                        lineTension: 0,
                        backgroundColor: '#FFCE56',
                        borderColor: '#FFCE56',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: '#FFCE56',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: '#FFCE56',
                        pointHoverBorderColor: '#FFCE56',
                        pointHoverBorderWidth: 1,
                        pointRadius: 4,
                        pointHitRadius: 10,
                        // data:  [0, 0, 0, 1450, 0, 0, 0],
                        data: ratioReport,
                        borderWidth: 1,
                      },
                      // {
                      //   label: 'Tạm dừng',
                      //   fill: false,
                      //   lineTension: 0,
                      //   backgroundColor: '#C55681',
                      //   borderColor: '#C55681',
                      //   borderCapStyle: 'butt',
                      //   borderDash: [],
                      //   borderDashOffset: 0.0,
                      //   borderJoinStyle: 'miter',
                      //   pointBorderColor: '#fff',
                      //   pointBackgroundColor: '#C55681',
                      //   pointBorderWidth: 1,
                      //   pointHoverRadius: 5,
                      //   pointHoverBackgroundColor: '#FFCE56',
                      //   pointHoverBorderColor: '#FFCE56',
                      //   pointHoverBorderWidth: 2,
                      //   pointRadius: 7,
                      //   pointHitRadius: 10,
                      //   data: [0, 0, 0, 1450, 0, 0, 0],
                      //   borderWidth: 1,
                      // },
                      // {
                      //   label: 'Đang chạy',
                      //   fill: false,
                      //   lineTension: 0,
                      //   backgroundColor: '#2EB85C',
                      //   borderColor: '#2EB85C',
                      //   borderCapStyle: 'butt',
                      //   borderDash: [],
                      //   borderDashOffset: 0.0,
                      //   borderJoinStyle: 'miter',
                      //   pointBorderColor: '#fff',
                      //   pointBackgroundColor: '#2EB85C',
                      //   pointBorderWidth: 1,
                      //   pointHoverRadius: 5,
                      //   pointHoverBackgroundColor: '#2EB85C',
                      //   pointHoverBorderColor: '#2EB85C',
                      //   pointHoverBorderWidth: 2,
                      //   pointRadius: 7,
                      //   pointHitRadius: 10,
                      //   data: [0, 1450, 0, 0, 0, 0, 0],
                      //   borderWidth: 1,
                      // },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                      padding: {
                        bottom: 20,
                      },
                    },
                    legend: {
                      position: 'bottom',
                      fullWidth: true,
                      reverse: false,
                    },
                    // title: {
                    //   display: false,
                    // },
                    animation: {
                      animateScale: true,
                      animateRotate: true,
                    },
                    // tooltips: {
                    //   enabled: false,
                    // },
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            min: 0,
                            // maxTicksLimit: 10,
                            // fontStyle: 'bold',
                            // fontColor: 'black',
                            beginAtZero: true,
                            // callback: (value, index, values) => {
                            //   if (value % 400 === 0) return value
                            // },
                            stepSize: 100,
                          },
                        },
                      ],
                    },
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={24} className={styles.title}>
            <Typography.Title className={styles.title__text} level={3}>
              Thống kê theo tháng
            </Typography.Title>
            <Popover
              content={
                <div style={{ display: 'inline' }}>
                  <Typography.Text style={{ marginRight: 5 }}>Tháng</Typography.Text>
                  <Select defaultValue={filterReportMonth.month} size="small" style={{ width: '55px', marginRight: 5 }} onSelect={onSelectMonth}>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                    <Option value="4">4</Option>
                    <Option value="5">5</Option>
                    <Option value="6">6</Option>
                    <Option value="7">7</Option>
                    <Option value="8">8</Option>
                    <Option value="9">9</Option>
                    <Option value="10">10</Option>
                    <Option value="11">11</Option>
                    <Option value="12">12</Option>
                  </Select>
                  <Typography.Text style={{ marginRight: 5 }}>Năm</Typography.Text>
                  <Select
                    defaultValue={filterReportMonth.year}
                    size="small"
                    style={{ width: '75px', marginRight: 5 }}
                    onSelect={onSelectYear}
                  >
                    <Option value="2021">2021</Option>
                    <Option value="2022">2022</Option>
                    <Option value="2023">2023</Option>
                  </Select>
                </div>
              }
              title=""
              placement="bottom"
              trigger="click"
              visible={isFilterVisible}
              onVisibleChange={setIsFilterVisible}
            >
              <Button className={styles.buttonFilter}>
                Bộ lọc <Filter style={{ marginLeft: 5 }} />
              </Button>
            </Popover>
          </Col>
          <Col span={20} offset={2}>
            <Card
              className={styles.cardContent}
              title={`Tháng ${+filterReportMonth.month === 1 ? '12' : ('0' + (filterReportMonth.month - 1)).slice(-2)} - ${('0' + (filterReportMonth.month)).slice(-2)}/${filterReportMonth.year}`}
            // title={`Tháng`}
            >
              <Row gutter={[32, 0]}>
                <Col span={8} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography.Text className={styles.textBlue14}>
                    Tổng số khách hàng: {reportMonth.totalCallEstablished}
                    <Typography.Text className={styles.textGreen14}>
                      {renderCaret(reportMonth.totalCallEstablishedDiff)}
                      {reportMonth.totalCallEstablishedDiff}
                    </Typography.Text>
                  </Typography.Text>
                  <Typography.Text className={styles.textBlue14}>
                    Tổng số khách hàng đã gọi: {reportMonth.totalCallEstablished}
                    <Typography.Text className={styles.textGreen14}>
                      {renderCaret(reportMonth.totalCallEstablishedDiff)}
                      {reportMonth.totalCallEstablishedDiff}
                    </Typography.Text>
                  </Typography.Text>
                  <Typography.Text className={styles.textBlue14}>
                    Tổng số chiến dịch: {reportMonth.totalCampaign}
                    <Typography.Text className={styles.textGreen14}>
                      {renderCaret(reportMonth.totalCampaignDiff)}
                      {reportMonth.totalCampaignDiff}
                    </Typography.Text>
                  </Typography.Text>
                </Col>
                <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography.Text className={styles.textBlue14}>
                    Tổng số cuộc gọi: {reportMonth.totalCallNumber}
                    <Typography.Text className={styles.textGreen14}>
                      {renderCaret(reportMonth.totalCallNumberDiff)}
                      {reportMonth.totalCallNumberDiff}
                    </Typography.Text>
                  </Typography.Text>
                  <Typography.Text className={styles.textBlue14}>
                    Tổng số API yêu cầu: {reportMonth.totalRequestsT2S}
                    <Typography.Text className={styles.textGreen14}>
                      {renderCaret(reportMonth.totalRequestsT2SDiff)}
                      {reportMonth.totalRequestsT2SDiff}
                    </Typography.Text>
                  </Typography.Text>
                  <Typography.Text className={styles.textBlue14}>
                    Tổng số ký tự: {reportMonth.totalCharactersT2S}
                    <Typography.Text className={styles.textGreen14}>
                      {renderCaret(reportMonth.totalCharactersT2SDiff)}
                      {reportMonth.totalCharactersT2SDiff}
                    </Typography.Text>
                  </Typography.Text>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24} className={styles.title}>
            <Typography.Title className={styles.title__text} level={3}>
              Thống kê chiến dịch chi tiết
            </Typography.Title>
            <div>
              <Popover
                className={styles.popover}
                content={
                  <div className={styles.popoverContent}>
                    <div className={styles.calendar}>
                      <Calendar
                        className={styles.calendarLeft}
                        fullscreen={false}
                        headerRender={({ value, type, onChange, onTypeChange }) =>
                          customHeader({ value, type, onChange, onTypeChange }, true, 'detail')
                        }
                        value={currentDateCampaignDetailLeft}
                        onChange={(date) =>
                          onChangeDateLeft(
                            date,
                            currentDateCampaignDetailRight,
                            setCurrentDateCampaignDetailLeft,
                            setCurrentDateCampaignDetailRight,
                          )
                        }
                      />
                      <Calendar
                        className={styles.calendarRight}
                        disabledDate={(currentDate) =>
                          disabledDateRight(currentDate, currentDateCampaignDetailLeft)
                        }
                        fullscreen={false}
                        headerRender={({ value, type, onChange, onTypeChange }) =>
                          customHeader({ value, type, onChange, onTypeChange }, false)
                        }
                        value={currentDateCampaignDetailRight}
                        onChange={setCurrentDateCampaignDetailRight}
                      />
                    </div>
                    <Button
                      onClick={handleClickSearchDetailCampaign}
                      className={styles.buttonSearch}
                    >
                      Tìm kiếm
                    </Button>
                  </div>
                }
                title=""
                placement="bottom"
                trigger="click"
                visible={isFilterCampaignDetailVisible}
                onVisibleChange={setisFilterCampaignDetailVisible}
              >
                <Button className={styles.buttonFilter}>
                  Bộ lọc <Filter style={{ marginLeft: 5 }} />
                </Button>
              </Popover>
              <Tooltip title={showTable ? 'Hide Table' : 'Show Table'}>
                <Switch onClick={toggle} style={{ marginLeft: 8 }} />
              </Tooltip>
            </div>
          </Col>
          {showTable && (
            <Col span={20} offset={2}>
              <Card bordered bodyStyle={{ padding: 0 }}>
                <Table
                  // tableLayout={'auto'}
                  scroll={{ x: 1500 }}
                  // sticky
                  className={styles.tableContent}
                  rowClassName={styles.tableRow}
                  // pagination={{
                  //   current: 1,
                  //   pageSize: 10,
                  //   // showSizeChanger: false,
                  //   showTotal: false,
                  // }}
                  pagination={{
                    defaultPageSize: 10,
                    showTotal: false,
                    size: 'default',
                    // showSizeChanger: false,
                  }}
                  size="small"
                  search={false}
                  options={false}
                  columns={[
                    {
                      title: 'Mã chiến dịch',
                      dataIndex: 'campaignCode',
                      key: 'campaignCode',
                      className: styles.column,
                    },
                    {
                      title: 'Tên chiến dịch',
                      dataIndex: 'campaignName',
                      key: 'campaignName',
                      className: styles.column,
                    },
                    {
                      title: 'Tổng số khách hàng',
                      dataIndex: 'totalCustomer',
                      key: 'totalCustomer',
                      className: styles.column,
                      align: 'center',
                    },
                    {
                      title: 'Đã tiếp cận',
                      dataIndex: 'totalSuccessCall',
                      key: 'totalSuccessCall',
                      className: styles.column,
                      align: 'center',
                    },
                    {
                      title: 'Tổng số cuộc gọi',
                      dataIndex: 'totalCall',
                      key: 'totalCall',
                      className: styles.column,
                      align: 'center',
                    },
                    {
                      title: 'Tổng thời gian gọi',
                      dataIndex: 'totalCallTime',
                      key: 'totalCallTime',
                      className: styles.column,
                      align: 'center',
                    },
                    {
                      title: 'Thời lượng cuộc gọi trung bình',
                      dataIndex: 'averageCallTime',
                      key: 'averageCallTime',
                      className: styles.column,
                      align: 'center',
                      render: (text) => (text !== 0 ? text.toFixed(2) : text),
                    },
                    {
                      title: 'API yêu cầu',
                      dataIndex: 'totalRequestT2S',
                      key: 'totalRequestT2S',
                      className: styles.column,
                      align: 'center',
                    },
                    {
                      title: 'Ký tự',
                      dataIndex: 'totalCharacterT2S',
                      key: 'totalCharacterT2S',
                      className: styles.column,
                      align: 'center',
                    },
                    {
                      title: 'Trạng thái',
                      dataIndex: 'status',
                      key: 'status',
                      width: 100,
                      align: 'center',
                      className: styles.column,
                      render: (text, record, index) => {
                        if (record.status === 'RUNNING') {
                          return <span style={{ color: '#1169B0' }}>Đang chạy</span>;
                        }
                        if (record.status === 'COMPLETED') {
                          return <span style={{ color: '#5FC983' }}>Hoàn tất</span>;
                        }
                        if (record.status === 'PENDING') {
                          return <span style={{ color: '#F27227' }}>Tạm dừng</span>;
                        }
                      },
                    },
                  ]}
                  request={async () => {
                    try {
                      const res = await requestReportCampaignDetail(headers, {
                        status: statusDetail,
                        token: tokenHub,
                        fromDate: dateReportDetail.fromDate,
                        toDate: dateReportDetail.toDate,
                      });
                      if (res.success) {
                        return {
                          data: res.data,
                        };
                      }
                      throw new Error(res.error || 'ERROR!');
                    } catch (err) {
                      message.error(err.toString());
                      return {
                        data: [],
                      };
                    }
                  }}
                  actionRef={actionRef}
                />
              </Card>
            </Col>
          )}
        </Row>
      </Card>
    </PageContainer>
  );
}
export default connect(({ user, settings }) => ({ user, settings }))(CampaignReport);
