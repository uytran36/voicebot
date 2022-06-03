import React, { useCallback, useEffect, useState } from 'react';
import { connect, FormattedMessage, formatMessage } from 'umi';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Form,
  List,
  Card,
  Button,
  Select,
  Typography,
  DatePicker,
  Table,
  Row,
  Col,
  message,
} from 'antd';
import moment from 'moment';
import styles from './styles.less';
import { requestReportDayOutbound, requestReportMonthOutbound } from './service';

const { Option } = Select;
const { RangePicker } = DatePicker;

const dataTableCalling = [
  {
    key: 1,
    used: 0,
    remain: 0,
    pick: 108000,
    type: 'Cuộc gọi',
  },
];

const dataTableApi = [
  {
    key: 1,
    error: 0,
    used: 0,
    remain: 0,
    pick: 216000,
    type: 'Request',
  },
];

const dataTableTimeCall = [
  {
    key: 1,
    error: 0,
    used: 0,
    remain: 0,
    pick: 216000,
    type: 'Giây',
  },
];

const dataTableCharacter = [
  {
    key: 1,
    error: 0,
    used: 0,
    remain: 0,
    pick: 216000,
    type: 'Ký tự',
  },
];

const CountReport = ({ user }) => {
  const [count, setCount] = useState(1);
  const [dataChartCalling, setDataChartCalling] = useState({
    labels: [],
    dataConnect: [],
    dataNotConnect: [],
    titleMonth: '',
  });
  const [dataChartRequestT2S, setDataChartRequestT2S] = useState({
    labels: [],
    dataRequestT2S: [],
    titleMonth: '',
  });
  const [dataChartTimeCalled, setDataChartTimeCalled] = useState({
    labels: [],
    dataTimeCalled: [],
    titleMonth: '',
  });
  const [dataChartCharactersT2S, setDataChartCharactersT2S] = useState({
    labels: [],
    dataCharactersT2S: [],
    titleMonth: '',
  });
  const [rangeDate, setRangeDate] = useState({
    fromDate: moment().startOf('month'),
    toDate: moment(),
  });
  const [dataReportMonth, setDataReportMonth] = useState({});
  const { userId, authToken, tokenGateway, tokenHub } = user;
  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`,
  };

  useEffect(() => {
    queryReportMonthOutBound(moment().format('YYYY-MM-DDTHH:mm:ss.000Z'));
  }, []);

  const queryReportMonthOutBound = useCallback((date) => {
    if (!date) {
      return null;
    }
    return requestReportMonthOutbound(headers, {
      date,
      token: tokenHub,
    }).then((res) => {
      if (res?.success === true && Array.isArray(res.data)) {
        const result = res.data[0] || {}
        setDataReportMonth(result);
        dataTableCalling[0].pick = result.totalCalledThreshold
        dataTableApi[0].pick = result.totalRequestT2SThreshold
        dataTableTimeCall[0].pick = result.totalTimeCalledThreshold
        dataTableCharacter[0].pick = result.totalCharactersT2SThreshold
      }
    });
  }, [headers, tokenHub]);

  const handleDataCall = useCallback(data => {
    const labels = [];
    const dataConnect = [];
    const dataNotConnect = [];
    let used = 0;
    data.forEach((element) => {
      labels.push(moment(element.date).format('DD-MM-YYYY'));
      dataConnect.push(element.totalCallConnected);
      dataNotConnect.push(element.totalCalled - element.totalCallConnected);
      used += element.totalCalled;
    })
    const titleMonth = `Tháng ${moment(rangeDate.toDate).month() + 1}/${moment(
      rangeDate.toDate,
    ).year()}`;
    dataTableCalling[0].used = used;
    dataTableCalling[0].remain = dataTableCalling[0].pick - used;
    setDataChartCalling({
      labels,
      dataConnect,
      dataNotConnect,
      titleMonth,
    });
  }, [rangeDate])

  const handleDataRequest = useCallback(data => {
    const labels = [];
    const dataRequestT2S = [];
    let usedRequest = 0;
    data.forEach((element) => {
      labels.push(moment(element.date).format('DD-MM-YYYY'));
      dataRequestT2S.push(element.totalRequestT2S);
      usedRequest += element.totalRequestT2S;
    })
    dataTableApi[0].used = usedRequest;
    dataTableApi[0].remain = dataTableApi[0].pick - usedRequest;
    const titleMonth = `Tháng ${moment(rangeDate.toDate).month() + 1}/${moment(
      rangeDate.toDate,
    ).year()}`;
    setDataChartRequestT2S({ labels, dataRequestT2S, titleMonth });
  }, [rangeDate])

  const handleDataTimeCall = useCallback(data => {
    const labels = [];
    const dataTimeCalled = [];
    let usedTimeCall = 0;
    data.forEach((element) => {
      labels.push(moment(element.date).format('DD-MM-YYYY'));
      dataTimeCalled.push(element.totalTimeCalled);
      usedTimeCall += element.totalTimeCalled;
    })
    dataTableTimeCall[0].used = usedTimeCall;
    dataTableTimeCall[0].remain = dataTableTimeCall[0].pick - usedTimeCall;
    const titleMonth = `Tháng ${moment(rangeDate.toDate).month() + 1}/${moment(
      rangeDate.toDate,
    ).year()}`;
    setDataChartTimeCalled({ labels, dataTimeCalled, titleMonth });
  }, [rangeDate])

  const handleDataCharacter = useCallback(data => {
    const labels = [];
    const dataCharactersT2S = [];
    let usedCharacters = 0;
    data.forEach((element) => {
      labels.push(moment(element.date).format('DD-MM-YYYY'));
      dataCharactersT2S.push(element.totalCharactersT2S);
      usedCharacters += element.totalCharactersT2S;
    })
    dataTableCharacter[0].used = usedCharacters;
    dataTableCharacter[0].remain = dataTableCharacter[0].pick - usedCharacters;
    const titleMonth = `Tháng ${moment(rangeDate.toDate).month() + 1}/${moment(
      rangeDate.toDate,
    ).year()}`;
    setDataChartCharactersT2S({ labels, dataCharactersT2S, titleMonth });
  }, [rangeDate])

  console.log(dataChartCharactersT2S)


  const queryReportDayOutBound = useCallback(async (dates, titleNumber) => {
    const res = await requestReportDayOutbound(headers, { ...dates, token: tokenHub })
    if (res?.success === true && Array.isArray(res.data)) {
      switch (titleNumber) {
        case 2:
          return handleDataCall(res.data)
        case 3:
          return handleDataRequest(res.data)
        case 4:
          return handleDataTimeCall(res.data)
        case 5:
          return handleDataCharacter(res.data)
        default:
          break;
      }
    }
  }, [headers, tokenHub, handleDataCall, handleDataRequest, handleDataTimeCall, handleDataCharacter]);

  const onSelectDay = (day) => {
    switch (day) {
      case 3:
        setRangeDate({
          fromDate: moment().subtract(2, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
          toDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
        });
        break;
      case 7:
        setRangeDate({
          fromDate: moment().subtract(6, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
          toDate: moment().endOf('day').format('YYYY-MM-DDTHH:mm:ss.000Z'),
        });
        break;
      default:
        break;
    }
  };

  const handleClickTitle = (titleNumber) => {
    setCount(titleNumber);
    if ([1].includes(titleNumber)) {
      return queryReportMonthOutBound(moment().format('YYYY-MM-DDTHH:mm:ss.000Z'));
    }
    return queryReportDayOutBound(rangeDate, titleNumber);
  };

  const handleDatePickerOnChange = useCallback((date) => {
    if (date) {
      queryReportMonthOutBound(moment(date).format('YYYY-MM-DDTHH:mm:ss.000Z'));
      return null;
    }
    setDataReportMonth({});
  }, [queryReportMonthOutBound]);

  const handleRangePickerOnChange = useCallback((dates, titleNumber) => {
    if (dates) {
      const [fromDate, toDate] = dates;
      queryReportDayOutBound({
        fromDate: moment(fromDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
        toDate: moment(toDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
      }, titleNumber);
      return null;
    }
    setDataChartCalling({
      labels: [],
      dataConnect: [],
      dataNotConnect: [],
      titleMonth: '',
    });
    setDataChartRequestT2S({
      labels: [],
      dataRequestT2S: [],
      dataNotRequestT2S: [],
      titleMonth: '',
    })
  }, [queryReportDayOutBound]);

  const BarChar = (labels, datasets) => {
    return (
      <Bar
        width={1200}
        height={500}
        data={{
          labels,
          datasets,
        }}
        options={{
          responsive: true,
          layout: {
            padding: {
              bottom: 20,
            },
          },
          legend: {
            position: 'top',
          },
          // title: {
          //   display: true,
          //   text: 'Chart',
          // },
          animation: {
            animateScale: true,
            animateRotate: true,
          },
          scales: {
            yAxes: [
              {
                stacked: true,
                ticks: {
                  // Include a dollar sign in the ticks
                  callback: (value, index, values) => {
                    return value;
                  },
                },
              },
            ],
            xAxes: [
              {
                stacked: true,
                // gridLines: {
                //   offsetGridLines: true
                // }
              },
            ],
          },
        }}
      />
    )
  }

  return (
    <Card>
      <Row className={styles.container} gutter={[24, 8]}>
        <Col span={6} className={styles.left}>
          <Typography.Title level={3} style={{ color: '#1a90ff', cursor: 'pointer' }}>
            <FormattedMessage id="pages.count-report.title" defaultMessage="Bộ đếm" />
          </Typography.Title>
          <Typography.Title
            level={4}
            style={{ cursor: 'pointer', color: count === 1 ? '#2F7CBA' : '#bdbcbc' }}
            onClick={() => handleClickTitle(1)}
          >
            1. <FormattedMessage id="pages.count-report.content1" defaultMessage="Tổng quan" />
          </Typography.Title>
          <Typography.Title
            level={4}
            style={{ cursor: 'pointer', color: count === 2 ? '#2F7CBA' : '#bdbcbc' }}
            onClick={() => handleClickTitle(2)}
          >
            2.{' '}
            <FormattedMessage id="pages.count-report.content2" defaultMessage="Số lượng cuộc gọi" />
          </Typography.Title>
          <Typography.Title
            level={4}
            style={{ cursor: 'pointer', color: count === 3 ? '#2F7CBA' : '#bdbcbc' }}
            onClick={() => handleClickTitle(3)}
          >
            3.{' '}
            <FormattedMessage
              id="pages.count-report.content3"
              defaultMessage="Số lượng dịch vụ bên thứ ba"
            />
          </Typography.Title>
          <Typography.Title
            level={4}
            style={{ cursor: 'pointer', color: count === 4 ? '#2F7CBA' : '#bdbcbc' }}
            onClick={() => handleClickTitle(4)}
          >
            4. <FormattedMessage id="pages.count-report.content4" defaultMessage="Thời gian gọi" />
          </Typography.Title>
          <Typography.Title
            level={4}
            style={{ cursor: 'pointer', color: count === 5 ? '#2F7CBA' : '#bdbcbc' }}
            onClick={() => handleClickTitle(5)}
          >
            5.{' '}
            <FormattedMessage
              id="pages.count-report.content5"
              defaultMessage="Số lượng kí tự dịch vụ bên thứ ba"
            />
          </Typography.Title>
        </Col>
        <Col span={18} className={styles.wrapper}>
          <div className={styles.content}>
            {count === 1 && (
              <>
                <div style={{ textAlign: 'center' }}>
                  <DatePicker
                    defaultValue={moment()}
                    picker="month"
                    onChange={handleDatePickerOnChange}
                  />
                </div>
                <div className={styles.doughnutWrap}>
                  <div className={styles.doughnut}>
                    <Doughnut
                      height={250}
                      data={{
                        labels: [
                          formatMessage({ id: 'pages.count-report.success.call' }),
                          'Số cuộc gọi còn lại',
                        ],
                        datasets: [
                          {
                            data: [
                              dataReportMonth.totalCalled,
                              dataReportMonth.totalCalledThreshold - dataReportMonth.totalCalled,
                            ],
                            backgroundColor: ['#2E75B6'],
                            hoverBackgroundColor: ['#2E75B6'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        cutoutPercentage: 70,
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: 50,
                          },
                        },
                        title: {
                          display: true,
                          text: formatMessage({ id: 'pages.count-report.content2' }),
                        },
                        animation: {
                          animateScale: true,
                          animateRotate: true,
                        },
                        circumference: Math.PI,
                        rotation: -Math.PI,
                        // tooltips: {
                        //   enabled: false,
                        // },
                      }}
                    />
                  </div>
                  <div className={styles.doughnut}>
                    <Doughnut
                      height={250}
                      data={{
                        labels: [
                          formatMessage({ id: 'pages.count-report.success.call' }),
                          'Số kết nối còn lại',
                        ],
                        datasets: [
                          {
                            data: [
                              dataReportMonth.totalCallConnected,
                              dataReportMonth.totalCalledThreshold -
                              dataReportMonth.totalCallConnected,
                            ],
                            backgroundColor: ['#2E75B6'],
                            hoverBackgroundColor: ['#2E75B6'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        cutoutPercentage: 70,
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: 50,
                          },
                        },
                        title: {
                          display: true,
                          text: formatMessage({ id: 'pages.count-report.connected.call' }),
                        },
                        animation: {
                          animateScale: true,
                          animateRotate: true,
                        },
                        circumference: Math.PI,
                        rotation: -Math.PI,
                        // tooltips: {
                        //   enabled: false,
                        // },
                      }}
                    />
                  </div>
                  <div className={styles.doughnut}>
                    <Doughnut
                      height={250}
                      data={{
                        labels: ['Số request đã dùng', 'Số request còn lại'],
                        datasets: [
                          {
                            data: [
                              dataReportMonth.totalRequestT2S,
                              dataReportMonth.totalRequestT2SThreshold -
                              dataReportMonth.totalRequestT2S,
                            ],
                            backgroundColor: ['#2E75B6'],
                            hoverBackgroundColor: ['#2E75B6'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        cutoutPercentage: 70,
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: 50,
                          },
                        },
                        title: {
                          display: true,
                          text: 'API request',
                        },
                        animation: {
                          animateScale: true,
                          animateRotate: true,
                        },
                        circumference: Math.PI,
                        rotation: -Math.PI,
                        // tooltips: {
                        //   enabled: false,
                        // },
                      }}
                    />
                  </div>
                  <div className={styles.doughnut}>
                    <Doughnut
                      height={250}
                      data={{
                        labels: ['Thời lượng đã dùng', 'Thời lượng còn lại'],
                        datasets: [
                          {
                            data: [
                              dataReportMonth.totalTimeCalled,
                              dataReportMonth.totalTimeCalledThreshold -
                              dataReportMonth.totalTimeCalled,
                            ],
                            backgroundColor: ['#2E75B6'],
                            hoverBackgroundColor: ['#2E75B6'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        cutoutPercentage: 70,
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: 50,
                          },
                        },
                        title: {
                          display: true,
                          text: formatMessage({ id: 'pages.count-report.call.time' }),
                        },
                        animation: {
                          animateScale: true,
                          animateRotate: true,
                        },
                        circumference: Math.PI,
                        rotation: -Math.PI,
                        // tooltips: {
                        //   enabled: false,
                        // },
                      }}
                    />
                  </div>
                  <div className={styles.doughnut}>
                    <Doughnut
                      height={250}
                      data={{
                        labels: ['Số ký tự đã dùng', 'Số ký tự còn lại'],
                        datasets: [
                          {
                            data: [
                              dataReportMonth.totalCharactersT2S,
                              dataReportMonth.totalCharactersT2SThreshold -
                              dataReportMonth.totalCharactersT2S,
                            ],
                            backgroundColor: ['#2E75B6'],
                            hoverBackgroundColor: ['#2E75B6'],
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        cutoutPercentage: 70,
                        legend: {
                          position: 'bottom',
                          labels: {
                            boxWidth: 50,
                          },
                        },
                        title: {
                          display: true,
                          text: formatMessage({ id: 'pages.count-report.content5' }),
                        },
                        animation: {
                          animateScale: true,
                          animateRotate: true,
                        },
                        circumference: Math.PI,
                        rotation: -Math.PI,
                        // tooltips: {
                        //   enabled: false,
                        // },
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            {count === 2 && (
              <>
                <Typography.Title level={3} style={{ color: '#1a90ff' }}>
                  <FormattedMessage
                    id="pages.count-report.content2"
                    defaultMessage="Số lượng cuộc gọi"
                  />
                </Typography.Title>
                <div style={{ textAlign: 'center' }}>
                  <DatePicker.RangePicker
                    onChange={(date) => handleRangePickerOnChange(date, 2)}
                    defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
                  />
                </div>
                <div className={styles.child}>
                  {BarChar(dataChartCalling.labels, [
                    {
                      label: formatMessage({ id: 'pages.count-report.connect' }),
                      backgroundColor: '#36A2EB',
                      borderWidth: 1,
                      maxBarThickness: 50,
                      data: dataChartCalling.dataConnect,
                    },
                    {
                      label: formatMessage({ id: 'pages.count-report.disconnect' }),
                      backgroundColor: '#FF6384',
                      borderWidth: 1,
                      maxBarThickness: 50,
                      data: dataChartCalling.dataNotConnect,
                    },
                  ])}
                  <Typography.Title level={3} style={{ color: '#1a90ff' }}>
                    <FormattedMessage
                      id="pages.count-report.flow"
                      defaultMessage="Lưu lượng còn lại trong tháng"
                    />
                  </Typography.Title>
                  <Table
                    size="small"
                    scroll={{ x: 20 }}
                    columns={[
                      {
                        title: dataChartCalling.titleMonth,
                        dataIndex: 'key',
                        key: 'key',
                        render: (text) => 'Tổng số lượng cuộc gọi',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.used"
                            defaultMessage="Đã sử dụng"
                          />
                        ),
                        dataIndex: 'used',
                        key: 'used',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.remain"
                            defaultMessage="Còn lại"
                          />
                        ),
                        dataIndex: 'remain',
                        key: 'remain',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.threshold"
                            defaultMessage="Ngưỡng"
                          />
                        ),
                        dataIndex: 'pick',
                        key: 'pick',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage id="pages.count-report.unit" defaultMessage="Đơn vị" />
                        ),
                        dataIndex: 'type',
                        key: 'type',
                      },
                    ]}
                    dataSource={dataTableCalling}
                    pagination={false}
                  />
                </div>
              </>
            )}
            {count === 3 && (
              <>
                <div className={styles.child}>
                  <Typography.Title level={3} style={{ color: '#1a90ff' }}>
                    <FormattedMessage
                      id="pages.count-report.content3"
                      defaultMessage="Số lượng dịch vụ bên thứ ba"
                    />
                  </Typography.Title>
                  <div style={{ textAlign: 'center' }}>
                    <DatePicker.RangePicker
                      onChange={(date) => handleRangePickerOnChange(date, 3)}
                      defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
                    />
                  </div>
                  {BarChar(dataChartRequestT2S.labels, [
                    {
                      label: formatMessage({ id: 'pages.count-report.connect' }),
                      backgroundColor: '#36A2EB',
                      borderWidth: 1,
                      maxBarThickness: 50,
                      data: dataChartRequestT2S.dataRequestT2S,
                    }
                  ])}
                  <Table
                    size="small"
                    scroll={{ x: 20 }}
                    columns={[
                      {
                        title: dataChartRequestT2S.titleMonth,
                        dataIndex: 'key',
                        key: 'key',
                        render: (text) => 'API request',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.used"
                            defaultMessage="Đã sử dụng"
                          />
                        ),
                        dataIndex: 'used',
                        key: 'used',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.remain"
                            defaultMessage="Còn lại"
                          />
                        ),
                        dataIndex: 'remain',
                        key: 'remain',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.threshold"
                            defaultMessage="Ngưỡng"
                          />
                        ),
                        dataIndex: 'pick',
                        key: 'pick',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage id="pages.count-report.unit" defaultMessage="Đơn vị" />
                        ),
                        dataIndex: 'type',
                        key: 'type',
                      },
                    ]}
                    dataSource={dataTableApi}
                    pagination={false}
                  />
                </div>
              </>
            )}
            {count === 4 && (
              <>
                <div className={styles.child}>
                  <Typography.Title level={3} style={{ color: '#1a90ff' }}>
                    <FormattedMessage
                      id="pages.count-report.content4"
                      defaultMessage="Thời gian gọi"
                    />
                  </Typography.Title>
                  <div style={{ textAlign: 'center' }}>
                    <DatePicker.RangePicker
                      onChange={(date) => handleRangePickerOnChange(date, 4)}
                      defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
                    />
                  </div>
                  {BarChar(dataChartTimeCalled.labels, [
                    {
                      label: formatMessage({ id: 'pages.count-report.used' }),
                      backgroundColor: '#36A2EB',
                      borderWidth: 1,
                      maxBarThickness: 50,
                      data: dataChartTimeCalled.dataTimeCalled,
                    }
                  ])}
                  <Table
                    size="small"
                    scroll={{ x: 20 }}
                    columns={[
                      {
                        title: dataChartTimeCalled.titleMonth,
                        dataIndex: 'key',
                        key: 'key',
                        render: (text) => 'API request',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.used"
                            defaultMessage="Đã sử dụng"
                          />
                        ),
                        dataIndex: 'used',
                        key: 'used',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.remain"
                            defaultMessage="Còn lại"
                          />
                        ),
                        dataIndex: 'remain',
                        key: 'remain',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.threshold"
                            defaultMessage="Ngưỡng"
                          />
                        ),
                        dataIndex: 'pick',
                        key: 'pick',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage id="pages.count-report.unit" defaultMessage="Đơn vị" />
                        ),
                        dataIndex: 'type',
                        key: 'type',
                      },
                    ]}
                    dataSource={dataTableTimeCall}
                    pagination={false}
                  />
                </div>
              </>
            )}
            {count === 5 && (
              <>
                <div className={styles.child}>
                  <Typography.Title level={3} style={{ color: '#1a90ff' }}>
                    <FormattedMessage
                      id="pages.count-report.content5"
                      defaultMessage="Số ký tự dịch vụ bên thứ ba"
                    />
                  </Typography.Title>
                  <div style={{ textAlign: 'center' }}>
                    <DatePicker.RangePicker
                      onChange={(date) => handleRangePickerOnChange(date, 5)}
                      defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
                    />
                  </div>
                  {BarChar(dataChartCharactersT2S.labels, [
                    {
                      label: formatMessage({ id: 'pages.count-report.used' }),
                      backgroundColor: '#36A2EB',
                      borderWidth: 1,
                      maxBarThickness: 50,
                      data: dataChartCharactersT2S.dataCharactersT2S,
                    }
                  ])}
                  <Table
                    size="small"
                    scroll={{ x: 20 }}
                    columns={[
                      {
                        title: dataChartCharactersT2S.titleMonth,
                        dataIndex: 'key',
                        key: 'key',
                        render: (text) => 'Số ký tự',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.used"
                            defaultMessage="Đã sử dụng"
                          />
                        ),
                        dataIndex: 'used',
                        key: 'used',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.remain"
                            defaultMessage="Còn lại"
                          />
                        ),
                        dataIndex: 'remain',
                        key: 'remain',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage
                            id="pages.count-report.threshold"
                            defaultMessage="Ngưỡng"
                          />
                        ),
                        dataIndex: 'pick',
                        key: 'pick',
                        align: 'center',
                      },
                      {
                        title: (
                          <FormattedMessage id="pages.count-report.unit" defaultMessage="Đơn vị" />
                        ),
                        dataIndex: 'type',
                        key: 'type',
                      },
                    ]}
                    dataSource={dataTableCharacter}
                    pagination={false}
                  />
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );
};
export default connect(({ user }) => ({ user }))(CountReport);
