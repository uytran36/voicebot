import React, { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react';
import { Input, Form, Typography, message, Button, Tabs, Steps, DatePicker, Row } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import styles from './styles.less';
import PT from 'prop-types';
import SelectDateTime from '@/components/SelectDateTime';
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
    paramsFilter,
    handleChangeTime,
  } = props;
  // const size = CheckWindowSize();

  const StatisticLayout = ({ title, number, unit, state }) => {
    return (
      <div
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
            <span>{unit}</span>

            {state ? (
              <span style={{ color: '#1CAF61', marginLeft: 'auto' }}>
                <ArrowUpOutlined style={{ color: '#1CAF61' }} />
                {Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
              </span>
            ) : (
              <span style={{ color: '#FF4D4E', marginLeft: 'auto' }}>
                <ArrowDownOutlined style={{ color: '#FF4D4E' }} />
                {Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };
  const totalCampaign =
    reportCampaignDaily.campaign_complete +
    reportCampaignDaily.campaign_scheduled +
    reportCampaignDaily.campaign_pending +
    reportCampaignDaily.campaign_runnings;

  const statistic = [
    {
      title: 'Tổng số Chiến dịch',
      number: Number.isNaN(totalCampaign) ? 0 : totalCampaign,
      unit: 'campaign',
    },
    {
      title: 'Cuộc gọi đã thực hiện',
      number: reportCampaignDaily.total_call_number,
      unit: 'cuộc',
    },
    {
      title: 'Tổng thời gian thoại',
      number: reportCampaignDaily.total_call_time_sec,
      unit: 'giây',
    },
    {
      title: 'Khách hàng đã gọi',
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

  //mock data chiến dịch
  const donutDataCampaign = [
    {
      type: 'Đang chạy',
      value: 45,
    },
    {
      type: 'Đang tạm dừng',
      value: 30,
    },
    {
      type: 'Chưa chạy',
      value: 15,
    },
    {
      type: 'Hoàn thành',
      value: 10,
    },
  ];

  const lineDataCampaign = [
    {
      day: '31/7',
      status: 'Đang chạy',
      campaign: 610,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '31/7',
      status: 'Đang tạm dừng',
      campaign: 510,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '31/7',
      status: 'Chưa chạy',
      campaign: 210,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '31/7',
      status: 'Hoàn thành',
      campaign: 200,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '2/8',
      status: 'Đang chạy',
      campaign: 180,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '2/8',
      status: 'Đang tạm dừng',
      campaign: 398,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '2/8',
      status: 'Chưa chạy',
      campaign: 190,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '2/8',
      status: 'Hoàn thành',
      campaign: 10,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '4/8',
      status: 'Đang chạy',
      campaign: 1000,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '4/8',
      status: 'Đang tạm dừng',
      campaign: 553,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '4/8',
      status: 'Chưa chạy',
      campaign: 319,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '4/8',
      status: 'Hoàn thành',
      campaign: 703,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '6/8',
      status: 'Đang chạy',
      campaign: 111,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '6/8',
      status: 'Đang tạm dừng',
      campaign: 50,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '6/8',
      status: 'Chưa chạy',
      campaign: 888,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '6/8',
      status: 'Hoàn thành',
      campaign: 934,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '8/8',
      status: 'Đang chạy',
      campaign: 805,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '8/8',
      status: 'Đang tạm dừng',
      campaign: 397,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '8/8',
      status: 'Chưa chạy',
      campaign: 278,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '8/8',
      status: 'Hoàn thành',
      campaign: 569,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '10/8',
      status: 'Đang chạy',
      campaign: 249,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '10/8',
      status: 'Đang tạm dừng',
      campaign: 777,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '10/8',
      status: 'Chưa chạy',
      campaign: 5,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '10/8',
      status: 'Hoàn thành',
      campaign: 167,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '12/8',
      status: 'Đang chạy',
      campaign: 130,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '12/8',
      status: 'Đang tạm dừng',
      campaign: 456,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '12/8',
      status: 'Chưa chạy',
      campaign: 70,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '12/8',
      status: 'Hoàn thành',
      campaign: 689,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '14/8',
      status: 'Đang chạy',
      campaign: 234,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '14/8',
      status: 'Đang tạm dừng',
      campaign: 280,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '14/8',
      status: 'Chưa chạy',
      campaign: 183,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '14/8',
      status: 'Hoàn thành',
      campaign: 123,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '16/8',
      status: 'Đang chạy',
      campaign: 789,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '16/8',
      status: 'Đang tạm dừng',
      campaign: 765,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '16/8',
      status: 'Chưa chạy',
      campaign: 19,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '16/8',
      status: 'Hoàn thành',
      campaign: 199,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '18/8',
      status: 'Đang chạy',
      campaign: 301,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '18/8',
      status: 'Đang tạm dừng',
      campaign: 506,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '18/8',
      status: 'Chưa chạy',
      campaign: 50,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      day: '18/8',
      status: 'Hoàn thành',
      campaign: 875,
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
  ];

  //mock data cuộc gọi

  const donutDataCall = [
    {
      type: 'Thành công',
      value: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      type: 'Không thành công',
      value: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      type: 'Lỗi',
      value: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
  ];

  const stackedDataCall = [
    //Theo thứ tự trong mảng không theo key
    {
      day: '1/1',
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
      type: 'Thành công',
    },
    {
      day: '1/1',
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
      type: 'Không thành công',
    },
    {
      day: '1/1',
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
      type: 'Lỗi',
    },

    {
      day: '2/1',
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
      type: 'Thành công',
    },
    {
      day: '2/1',
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
      type: 'Không thành công',
    },
    {
      day: '2/1',
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
      type: 'Lỗi',
    },

    {
      day: '3/1',
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
      type: 'Thành công',
    },
    {
      day: '3/1',
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
      type: 'Không thành công',
    },
    {
      day: '3/1',
      data: Math.floor(Math.random() * (1000 - 100)) + 100,
      type: 'Lỗi',
    },
  ];

  //mock data Thời lượng gọi
  const donutDataDurationCall = [
    {
      type: 'Dưới 5s',
      value: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      type: '5s-15s',
      value: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      type: '15s-30s',
      value: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      type: 'Trên 30s',
      value: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
  ];

  const StackBarDurationCall = [
    {
      type: 'Trên 30s',
      campaign: 'Chiến dịch 1',
      data: 3,
    },
    {
      type: '15s-30s',
      campaign: 'Chiến dịch 1',
      data: 4,
    },
    {
      type: '5s-15s',
      campaign: 'Chiến dịch 1',
      data: 5,
    },
    {
      type: 'Dưới 5s',
      campaign: 'Chiến dịch 1',
      data: 10,
    },
    {
      type: 'Trên 30s',
      campaign: 'Chiến dịch 2',
      data: 2,
    },
    {
      type: '15s-30s',
      campaign: 'Chiến dịch 2',
      data: 8,
    },
    {
      type: '5s-15s',
      campaign: 'Chiến dịch 2',
      data: 17,
    },
    {
      type: 'Dưới 5s',
      campaign: 'Chiến dịch 2',
      data: 12,
    },
    {
      type: 'Trên 30s',
      campaign: 'Chiến dịch 3',
      data: 29,
    },
    {
      type: '15s-30s',
      campaign: 'Chiến dịch 3',
      data: 20,
    },
    {
      type: '5s-15s',
      campaign: 'Chiến dịch 3',
      data: 15,
    },
    {
      type: 'Dưới 5s',
      campaign: 'Chiến dịch 3',
      data: 2,
    },
    {
      type: 'Trên 30s',
      campaign: 'Chiến dịch 4',
      data: 20,
    },
    {
      type: '15s-30s',
      campaign: 'Chiến dịch 4',
      data: 14,
    },
    {
      type: '5s-15s',
      campaign: 'Chiến dịch 4',
      data: 10,
    },
    {
      type: 'Dưới 5s',
      campaign: 'Chiến dịch 4',
      data: 6,
    },
  ];

  //mock Data custommer
  const donutDataCustomer = [
    {
      type: 'Đã tiếp cận',
      value: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
    {
      type: 'Chưa tiếp cận',
      value: Math.floor(Math.random() * (1000 - 100)) + 100,
    },
  ];

  const stackedDataCustomer = [
    {
      day: '1/1',
      data: 3,
      type: 'Đã tiếp cận',
    },
    {
      day: '1/1',
      data: 1,
      type: 'Chưa tiếp cận',
    },
    {
      day: '2/1',
      data: 4,
      type: 'Đã tiếp cận',
    },
    {
      day: '2/1',
      data: 2,
      type: 'Chưa tiếp cận',
    },
    {
      day: '3/1',
      data: 6,
      type: 'Đã tiếp cận',
    },
    {
      day: '3/1',
      data: 10,
      type: 'Chưa tiếp cận',
    },
    {
      day: '4/1',
      data: 8,
      type: 'Đã tiếp cận',
    },
    {
      day: '4/1',
      data: 8,
      type: 'Chưa tiếp cận',
    },
    {
      day: '5/1',
      data: 10,
      type: 'Đã tiếp cận',
    },
    {
      day: '5/1',
      data: 15,
      type: 'Chưa tiếp cận',
    },
    {
      day: '6/1',
      data: 5,
      type: 'Đã tiếp cận',
    },
    {
      day: '6/1',
      data: 13,
      type: 'Chưa tiếp cận',
    },
    {
      day: '7/1',
      data: 8,
      type: 'Đã tiếp cận',
    },
    {
      day: '7/1',
      data: 20,
      type: 'Chưa tiếp cận',
    },
    {
      day: '8/1',
      data: 8,
      type: 'Đã tiếp cận',
    },
    {
      day: '8/1',
      data: 10,
      type: 'Chưa tiếp cận',
    },
  ];

  //mock data API
  const stackedDataAPI = [
    {
      day: '1/1',
      data: 1,
      type: 'Đang sử dụng',
    },
    {
      day: '1/1',
      data: 3,
      type: 'Lỗi',
    },

    {
      day: '2/1',
      data: 2,
      type: 'Đang sử dụng',
    },
    {
      day: '2/1',
      data: 4,
      type: 'Lỗi',
    },

    {
      day: '3/1',
      data: 10,
      type: 'Đang sử dụng',
    },
    {
      day: '3/1',
      data: 6,
      type: 'Lỗi',
    },

    {
      day: '4/1',
      data: 8,
      type: 'Đang sử dụng',
    },
    {
      day: '4/1',
      data: 8,
      type: 'Lỗi',
    },

    {
      day: '5/1',
      data: 15,
      type: 'Đang sử dụng',
    },
    {
      day: '5/1',
      data: 10,
      type: 'Lỗi',
    },

    {
      day: '6/1',
      data: 13,
      type: 'Đang sử dụng',
    },
    {
      day: '6/1',
      data: 5,
      type: 'Lỗi',
    },

    {
      day: '7/1',
      data: 20,
      type: 'Đang sử dụng',
    },
    {
      day: '7/1',
      data: 8,
      type: 'Lỗi',
    },

    {
      day: '8/1',
      data: 10,
      type: 'Đang sử dụng',
    },
    {
      day: '8/1',
      data: 8,
      type: 'Lỗi',
    },
  ];

  //mock data Character
  const stackedDataCharacter = [
    {
      day: '1/1',
      data: 3,
      type: 'Ký tự đã sử dụng',
    },
    {
      day: '2/1',
      data: 4,
      type: 'Ký tự đã sử dụng',
    },
    {
      day: '3/1',
      data: 6,
      type: 'Ký tự đã sử dụng',
    },
    {
      day: '4/1',
      data: 8,
      type: 'Ký tự đã sử dụng',
    },
    {
      day: '5/1',
      data: 10,
      type: 'Ký tự đã sử dụng',
    },
    {
      day: '6/1',
      data: 5,
      type: 'Ký tự đã sử dụng',
    },
    {
      day: '7/1',
      data: 8,
      type: 'Ký tự đã sử dụng',
    },
    {
      day: '8/1',
      data: 8,
      type: 'Ký tự đã sử dụng',
    },
  ];

  const renderChartCampaign = useCallback(() => {
    const typeReport = [
      {
        title: 'Chiến dịch',
        donutData: [
          {
            type: 'Đang chạy',
            value: reportCampaignDaily.campaign_running || 1111, // mock data
          },
          {
            type: 'Tạm dừng',
            value: reportCampaignDaily.campaign_pending || 11111111, // mock data
          },
          {
            type: 'Chưa chạy',
            value: reportCampaignDaily.campaign_scheduled || 12145464, // mock data
          },
          {
            type: 'Hoàn thành',
            value: reportCampaignDaily.campaign_complete || 1211, // mock data
          },
        ],
        donutColor: ['#23C865', '#FF9B2F', '#BFBFBF', '#4F71FF'],
        donutData: donutDataCampaign,
        ratioData: lineDataCampaign,
        lineColor: ['#23C865', '#FF9B2F', '#BFBFBF', '#4F71FF'],
        type: 'line',
      },
      {
        title: 'Cuộc gọi',
        donutData: donutDataCall,
        donutColor: ['#4F71FF', '#FF9B2F', '#FF4D4F'],
        ratioData: stackedDataCall,
        barColor: ['#4F71FF', '#FF9B2F', '#FF4D4F'],
        lineTitle: [
          {
            name: 'Thành công',
            value: 'Succ',
            color: '#4F71FF',
          },
          {
            name: 'Không thành công',
            value: 'NotSucc',
            color: '#FF9B2F',
          },

          {
            name: 'Lỗi',
            value: 'Err',
            color: '#FF4D4F',
          },
        ],
        type: 'stackedColumn',
      },
      {
        title: 'Agent',
        donutData: donutDataCall,
        donutColor: ['#4F71FF', '#FF9B2F', '#FF4D4F'],
        ratioData: stackedDataCall,
        barColor: ['#4F71FF', '#FF9B2F', '#FF4D4F'],
        lineTitle: [
          {
            name: 'Nhận cuộc gọi',
            value: 'Succ',
            color: '#4F71FF',
          },
          {
            name: 'Gọi lại',
            value: 'NotSucc',
            color: '#FF9B2F',
          },

          {
            name: 'Bị bỏ qua',
            value: 'Err',
            color: '#FF4D4F',
          },
        ],
        type: 'stackedColumn',
      },
      {
        title: 'Thời lượng gọi',
        donutData: donutDataDurationCall,
        donutColor: ['#24DD9A', '#44CEEC', '#408CFF', '#6360FF'],
        ratioData: StackBarDurationCall,
        barColor: ['#24DD9A', '#44CEEC', '#408CFF', '#6360FF'],
        lineTitle: [
          {
            name: 'Dưới 5s',
            value: 'Dưới 5s',
            color: '#24DD9A',
          },
          {
            name: '5s-15s',
            value: '5s-15s',
            color: '#44CEEC',
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
        type: 'stackedBar',
      },
      {
        title: 'Khách hàng',
        donutData: donutDataCustomer,
        donutColor: ['#428DFF', '#BFBFBF'],
        ratioData: stackedDataCustomer,
        barColor: ['#428DFF', '#BFBFBF'],
        lineTitle: [
          {
            name: 'Đã tiếp cận',
            value: 'Đã tiếp cận',
            color: '#428DFF',
          },
          {
            name: 'Chưa tiếp cận',
            value: 'Chưa tiếp cận',
            color: '#BFBFBF',
          },
        ],
        type: 'stackedColumn',
      },
      {
        title: 'API',
        ratioData: stackedDataAPI,
        barColor: ['#07C2DE', '#FF4D4F'],
        lineTitle: [
          {
            name: 'Đang sử dụng',
            value: 'Đang sử dụng',
            color: '#07C2DE',
          },
          {
            name: 'Lỗi',
            value: 'Lỗi',
            color: '#FF4D4F',
          },
        ],
        type: 'stackedColumn',
      },
      {
        title: 'Ký tự',
        ratioData: stackedDataCharacter,
        barColor: ['#FFA000'],
        lineTitle: [
          {
            name: 'Ký tự đã sử dụng',
            value: 'Ký tự đã sử dụng',
            color: '#FFA000',
          },
        ],
        type: 'stackedColumn',
      },
    ];

    return typeReport.map((item) => (
      <TabPane tab={item.title} key={item.title}>
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
      </TabPane>
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

  const onChangeTabs = (key) => {
    onChangeTab(key);
  };

  // date filter

  return (
    <>
      <div className={styles.statisticWrapper}>
        {statistic.map((x, id) => (
          <StatisticLayout
            key={id}
            title={x.title}
            number={x.number}
            unit={x.unit}
            state={Math.random() < 0.5}
          />
        ))}
      </div>
      <Tabs
        style={{ margin: '2rem 0rem' }}
        tabBarExtraContent={
          <>
            {/* <RangePicker
            onChange={(date) => handleChangeRangePickerDays(date)}
            defaultValue={[rangeDateDays.fromDate, rangeDateDays.toDate]}
          /> */}
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
          </>
        }
        onChange={onChangeTabs}
        defaultActiveKey={tabActive}
      >
        {renderChartCampaign()}
      </Tabs>
    </>
  );
}

export default React.memo(General);
