import React, { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react';
import { Input, Form, Typography, message, Button, Tabs, Steps, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, PieChartFilled, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import styles from './styles.less';
import PT from 'prop-types';

import ChartCampaign from './ChartCampaign';
// import CheckWindowSize from '@/components/CheckWindownSize';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
TweenOne.plugins.push(Children);

General.propTypes = {
  reportCampaignDaily: PT.instanceOf(Object).isRequired,
  callDurationDataChart: PT.instanceOf(Object).isRequired,
  ratioReport: PT.shape({
    arrCallingRatio: PT.instanceOf(Array),
    arrCampaignRatio: PT.instanceOf(Array),
    arrCharacterBar: PT.instanceOf(Array),
    arrCustomerRatio: PT.instanceOf(Array),
    arrRequestRatio: PT.instanceOf(Array),
    date: PT.instanceOf(Object),
  }).isRequired,
  rangeDateDays: PT.shape({
    fromDate: PT.any,
    toDate: PT.any,
  }).isRequired,
  setRangeDateDays: PT.func.isRequired,
  fetchReportCampaignDays: PT.func.isRequired,
  fetchReportCampaignDaily: PT.func.isRequired,
  token: PT.any.isRequired,
  tabActive: PT.string.isRequired,
  onChangeTab: PT.func.isRequired,
};

function General(props) {
  const {
    callDurationDataChart,
    reportCampaignDaily,
    ratioReport,
    fetchReportCampaignDays,
    // fetchReportCampaignDaily,
    token,
    rangeDateDays,
    setRangeDateDays,
    tabActive,
    onChangeTab,
  } = props;
  // const size = CheckWindowSize();

  const StatisticLayout = ({ title, number, unit, state }) => {
    return (
      <div
        style={{ backgroundColor: "#EBF5FD" }}
        className={styles.statistic}
      // style={size.width >= 1410 ? { width: '15.5%' } : { width: '20rem' }}
      >
        <div className={styles.statisticInfo}>
          <div className={styles.title}>
            <span>{title}</span>
          </div>
          <div className={styles.data}>
            <TweenOne
              className={styles.count}
              animation={{
                Children: {
                  value: typeof number === 'number' ? number : 0,
                  floatLength: 0,
                  formatMoney: true,
                },
                duration: 1000,
              }}
            >
              0
            </TweenOne>
            <span style={{ marginLeft: 3, marginRight: 3 }}>{unit}</span>
            {state ? <span style={{ color: "#1CAF61", marginLeft: "auto" }}>
              <ArrowUpOutlined style={{ color: "#1CAF61" }} />
              {Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
            </span> : <span style={{ color: "#FF4D4E", marginLeft: "auto" }}>
              <ArrowDownOutlined style={{ color: "#FF4D4E" }} />
              {Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
            </span>}

          </div>
        </div>
      </div>
    );
  };
  const totalCampaign =
    reportCampaignDaily.campaign_complete +
    reportCampaignDaily.campaign_scheduled +
    reportCampaignDaily.campaign_pending +
    reportCampaignDaily.campaign_running;
  const statistic = [
    {
      title: 'Tổng số Chiến dịch',
      number: Number.isNaN(totalCampaign) ? 0 : totalCampaign,
      unit: 'chiến dịch',
    },
    {
      title: 'Tổng số cuộc gọi',
      number: reportCampaignDaily.total_call_number,
      unit: 'cuộc',
    },
    {
      title: 'Tổng thời gian thoại',
      number: reportCampaignDaily.total_call_time_sec,
      unit: 'giây',
    },
    {
      title: 'Tổng khách hàng',
      number: reportCampaignDaily.total_call_established,
      unit: 'khách hàng',
    },
    {
      title: 'API đã yêu cầu',
      number: reportCampaignDaily.total_requests_t2s,
      unit: 'API',
    },
    {
      title: 'Số ký tự T2S',
      number: reportCampaignDaily.total_characters_t2s,
      unit: 'ký tự',
    },
  ];


  const ChartLayout = ({ children }) => <div className={styles.chartWrapper}>{children}</div>;

  const renderChartCampaign = useCallback(() => {
    const typeReport = [
      {
        title: 'Chiến dịch',
        donutData: [
          {
            type: 'Đang chạy',
            value: 32,
          },
          {
            type: 'Tạm dừng',
            value: 24,
          },
          {
            type: 'Chưa chạy',
            value: 9,
          },
          {
            type: 'Hoàn thành',
            value: 15,
          },
        ],
        donutColor: ['#23C865', '#FF9B2F', '#BFBFBF', '#4E71FF'],
        ratioData: ratioReport.arrCampaignRatio,
        lineColor: ['#23C865', '#BFBFBF', '#FF9B2F', '#4F71FF'],
        lineTitle: [
          {
            name: 'Đang chạy',
            value: 'Đang chạy',
            color: '#23C865',
          },
          {
            name: 'Chưa chạy',
            value: 'Chưa chạy',
            color: '#BFBFBF',
          },
          {
            name: 'Tạm dừng',
            value: 'Tạm dừng',
            color: '#FF9B2F',
          },
          {
            name: 'Hoàn thành',
            value: 'Hoàn thành',
            color: '#4F71FF',
          },
        ],
        type: 'line',
      },
      {
        title: 'Khách hàng',
        donutData: [
          {
            type: 'Đã tiếp cận',
            value: 78,
          },
          {
            type: 'Chưa tiếp cận',
            value: 48,
          },
        ],
        donutColor: ['#438CFF', '#BFBFBF'],
        ratioData: ratioReport.arrCampaignRatio,
        lineColor: ['#438CFF', '#BFBFBF'],
        lineTitle: [
          {
            name: 'Đã tiếp cận',
            value: 'Đang chạy',
            color: '#438CFF',
          },
          {
            name: 'Chưa tiếp cận',
            value: 'Chưa chạy',
            color: '#BFBFBF',
          },

        ],
        type: 'line',
      },
      {
        title: 'Cuộc gọi',
        donutData: [
          {
            type: 'Thành công',
            value: 150,
          },
          {
            type: 'Không thành công',
            value: 20,
          },
          {
            type: 'Lỗi',
            value: 30
          },
        ],
        donutColor: ['#438CFF', '#FF9B2F', '#EE4149'],
        ratioData: ratioReport.arrCampaignRatio,
        lineColor: ['#438CFF', '#FF9B2F', '#EE4149'],
        lineTitle: [
          {
            name: 'Lỗi',
            value: 'Lỗi',
            color: '#EE4149',
          },
          {
            name: 'Không thành công',
            value: 'Không thành công',
            color: '#FF9B2F',
          },
          {
            name: 'Thành công',
            value: 'Thành công',
            color: '#438CFF',
          },
        ],
        type: 'line',
      },
      {
        title: 'phút',
        donutData: [
          {
            type: 'Dưới 5s',
            value: 1392,
          },
          {
            type: '5s-15s',
            value: 1217,
          },
          {
            type: '15s-30s',
            value: 347,
          },
          {
            type: 'Trên 30s',
            value: 522,
          },
        ],
        donutColor: ['#25DD9A', '#45CEED', '#408CFF', '#6360FF'],
        ratioData: ratioReport.arrCampaignRatio,
        lineColor: ['#25DD9A', '#45CEED', '#408CFF', '#6360FF'],
        lineTitle: [
          {
            name: 'Dưới 5s',
            value: 'Dưới 5s',
            color: '#25DD9A',
          },
          {
            name: '5s-15s',
            value: '5s-15s',
            color: '#45CEED',
          },
          {
            name: '15s-30s',
            value: '15s-30s',
            color: '#408CFF',
          },
          {
            name: 'Trên 30s',
            value: 'Trên 30s',
            color: '#6360FF',
          },
        ],
        type: 'line',
      },
    ];
    return typeReport.map((item) => (
      <ChartLayout>
        <ChartCampaign
          donutData={item.donutData}
          ratioReport={item.ratioData}
          donutColor={item.donutColor}
          title={item.title}
          lineColor={item.lineColor}
          lineTitle={item.lineTitle}
          type={item.type}
          barColor={item.barColor}
        />
      </ChartLayout>
    ));
  }, []);

  const handleChangeRangePickerDays = useCallback(
    (dates) => {
      if (dates) {
        const [fromDate, toDate] = dates;
        setRangeDateDays({
          fromDate: moment(fromDate),
          toDate: moment(toDate),
        });
        fetchReportCampaignDays({
          token,
          fromDate: moment(fromDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
          toDate: moment(toDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
        });
        // fetchReportCampaignDaily({
        //   status: 'ALL',
        //   token,
        //   fromDate: moment(fromDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
        //   toDate: moment(toDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
        // })
        return null;
      }
    },
    [fetchReportCampaignDays],
  );

  return (
    <>
      <div className={styles.statisticWrapper}>
        {statistic.map((x, id) => (
          <StatisticLayout key={id} title={x.title} number={x.number} unit={x.unit} state={Math.random() < 0.5} />
        ))}
      </div>
      <div className={styles.statisticWrapper2}>
        {renderChartCampaign()}
      </div>
    </>
  );
}

export default React.memo(General);
