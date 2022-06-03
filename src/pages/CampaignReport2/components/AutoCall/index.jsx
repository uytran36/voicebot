import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  Input,
  Space,
  Typography,
  message,
  Button,
  Tabs,
  Steps,
  DatePicker,
  notification,
  Tag,
} from 'antd';
import { DownloadOutlined, InfoCircleFilled, PieChartFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import styles from './styles.less';
import { connect } from 'umi';
import PT from 'prop-types';

import {
  requestReportCampaignDaily,
  requestReportCampaignDetail,
  requestReportVoiceOutboundDays,
  requestReportCampaignDays,
  requestReportCampaignMonth,
  requestReportMonthOutbound,
} from './service';
import General from './components/General';
import CampaignInfoDetail from './components/CampaignInfoDetail';
import NoDataPermission from '@/components/NoDataPermission';
import moment from 'moment';
import Table from '@ant-design/pro-table';
import { REPORT_MANAGEMENT, checkPermission, VoiceBot } from '@/utils/permission';
import CustomDatePicker from '@/components/CustomDatePicker';

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

CampaignReport2.propTypes = {
  user: PT.shape({
    tokenHub: PT.string,
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
    currentUser: PT.instanceOf(Object),
  }).isRequired,
};

function CampaignReport2(props) {
  const {
    user: { userId, authToken, tokenGateway, tokenHub, currentUser },
  } = props;
  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`,
  };
  const actionRef = useRef();
  const [reportCampaignDaily, setReportCampaignDaily] = useState({});
  const [ratioReport, setRatioReport] = useState([]);
  const [totalCampaignDay, setTotalCampaignDay] = useState([]);
  const [callDurationDataChart, setCallDurationDataChart] = useState([]);
  const [statusDaily, setStatusDaily] = useState('ALL');
  const [statusDetail, setStatusDetail] = useState('ALL');
  const [state, setState] = useState(1);
  const [dateReportDetail, setDateReportDetail] = useState({
    fromDate: moment().subtract(1, 'months').startOf('day'),
    toDate: moment().endOf('day').endOf('day'),
  });
  const [rangeDate, setRangeDate] = useState({
    fromDate: moment().subtract('1', 'month').startOf('day'),
    toDate: moment().endOf('day'),
  });
  const [rangeDateDays, setRangeDateDays] = useState({
    fromDate: moment().subtract('1', 'month').startOf('day'),
    toDate: moment().endOf('day'),
  });
  const [viewReportCampaign, setViewReportCampaign] = useState(false);
  const [tabActive, setTabActive] = useState('Chiến dịch');

  useEffect(() => {
    if (checkPermission(currentUser?.permissions, REPORT_MANAGEMENT.accessAutoCallReport)) {
      const fromDate = moment().subtract('1', 'month').startOf('day').toJSON();
      const toDate = moment().endOf('day').toJSON();
      const fromDateYear = moment().startOf('year').toJSON();
      const token = tokenHub;
      fetchReportCampaignDaily({
        status: statusDaily,
        token,
        fromDate,
        toDate,
      });
      fetchReportCampaignDays({
        token,
        fromDate,
        toDate,
      });
      setViewReportCampaign(true);
      // fetchReportCampaignMonth({
      //   token,
      //   date: toDate,
      // });
      // queryReportMonthOutBound({
      //   token,
      //   date: toDate,
      // });
    }
  }, []);

  // thong ke theo ti le
  const fetchReportCampaignDaily = useCallback(async (_data) => {
    try {
      const res = await requestReportCampaignDaily(headers, _data);
      if (res.success) {
        if (Array.isArray(res.data)) {
          const dataCall = {
            // tổng quan - tổng số chiến dịch
            campaign_pending: 10,
            campaign_running: 10,
            campaign_complete: 10,
            campaign_scheduled: 10000, //chưa chạy

            total_call_number: 0, // tổng quan - số cuộc gọi đã thực hiện
            total_call_customer: 0,
            total_call_established: 0, // tổng quan - khách hàng đã gọi
            total_call_duration_sec: 0,
            total_call_duration_msec: 0,
            total_call_time_sec: 0, // tổng quan - tổng thời gian thoại
            total_call_time_msec: 0,
            mean_call_time_sec: 0,
            mean_call_time_msec: 0,
            total_characters_t2s: 0, // tổng quan - số kí tự T2S
            total_requests_t2s: 0, // tổng quan - API đã yêu cầu
            total_crr_duration_5s: 0,
            total_crr_duration_15s: 0,
            total_crr_duration_30s: 0,
            total_crr_duration_higher: 0,
          };
          const dataCallDuration = [];
          res.data.map((item) => {
            if (item.campaign_status === 'PENDING') dataCall.pending += 1;
            if (item.campaign_status === 'RUNNING') dataCall.campaign_running += 1;
            if (item.campaign_status === 'COMPLETED') dataCall.campaign_complete += 1;
            if (item.campaign_status === 'SCHEDULED') dataCall.campaign_scheduled += 1;
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
            dataCallDuration.push(
              {
                type: 'Trên 30s',
                campaign: item.campaign_name,
                data: item.total_crr_duration_higher,
              },
              {
                type: '15s-30s',
                campaign: item.campaign_name,
                data: item.total_crr_duration_30s,
              },
              {
                type: '5s-15s',
                campaign: item.campaign_name,
                data: item.total_crr_duration_15s,
              },
              {
                type: 'Dưới 15s',
                campaign: item.campaign_name,
                data: item.total_crr_duration_5s,
              },
            );
            return dataCall;
          });
          setCallDurationDataChart(dataCallDuration);
          setReportCampaignDaily(dataCall);
        }
        return null;
      }
      throw new Error(res.error || 'Error...');
    } catch (err) {
      // notification.error(err.toString());
      return null;
    }
  }, []);

  const fetchReportCampaignDays = useCallback(async (_data) => {
    try {
      const res = await requestReportCampaignDays(headers, _data);
      if (res.success) {
        // dang de so chien dich la so khoi tao
        const dataCall = {
          date: [],
          // arrTotalCampaign: [],
          // arrTotalCall: [],
          // arrTotalCustomer: [],
          // arrTotalRequestT2S: [],
          // arrTotalCharactersT2S: [],

          arrCampaignRatio: [],
          arrCallingRatio: [],
          arrCustomerRatio: [],
          arrRequestRatio: [],
          arrCharacterBar: [],
        };
        res.data.map((item) => {
          // dataCall.date.push(moment(item.date).format('DD/MM'));
          // dataCall.arrTotalCampaign.push(item.total_campaigns);
          // dataCall.arrTotalCall.push(item.total_call);
          // dataCall.arrTotalCustomer.push(item.total_customer);
          // dataCall.arrTotalRequestT2S.push(item.total_requests_t2s);
          // dataCall.arrTotalCharactersT2S.push(item.total_characters_t2s);
          const day = moment(item.date).format('DD/MM');
          const campaignRunning = {
            day,
            status: 'Đang chạy',
            data: item.total_campaign.running,
          };
          const campaignScheduled = {
            day,
            status: 'Chưa chạy',
            data: item.total_campaign.scheduled,
          };
          const campaignPending = {
            day,
            status: 'Tạm dừng',
            data: item.total_campaign.pending,
          };
          const campaignCompleted = {
            day,
            status: 'Hoàn thành',
            data: item.total_campaign.completed,
          };
          const campaignCallSuccess = {
            day,
            status: 'Thành công',
            data: item.total_established,
          };
          const campaignCallFail = {
            day,
            status: 'Không thành công',
            data: item.total_call - item.total_established,
          };
          const campaignCustomerSuccess = {
            day,
            status: 'Đã tiếp cận',
            data: item.total_established,
          };
          const campaignCustomerFail = {
            day,
            status: 'Chưa tiếp cận',
            data: item.total_customer - item.total_established,
          };
          const campaignCharacter = {
            day,
            data: item.total_characters_t2s,
          };
          const campaignRequest = {
            day,
            data: item.total_requests_t2s,
          };

          dataCall.arrCampaignRatio = [
            ...dataCall.arrCampaignRatio,
            campaignRunning,
            campaignScheduled,
            campaignPending,
            campaignCompleted,
          ];
          dataCall.arrCallingRatio = [
            ...dataCall.arrCallingRatio,
            campaignCallSuccess,
            campaignCallFail,
          ];
          dataCall.arrCustomerRatio = [
            ...dataCall.arrCustomerRatio,
            campaignCustomerSuccess,
            campaignCustomerFail,
          ];
          dataCall.arrCharacterBar = [...dataCall.arrCharacterBar, campaignCharacter];
          dataCall.arrRequestRatio = [...dataCall.arrRequestRatio, campaignRequest];
          return dataCall;
        });
        // console.log({dataCall})
        return setRatioReport(dataCall);
        // return setTotalCampaignDay(dataCall);
      }
      throw new Error(res.error || 'Error...');
    } catch (err) {
      console.log(err);
      // notification.error(err.toString());
      return [];
    }
  }, []);

  const onChangeDateReportDetail = useCallback((date) => {
    if (date) {
      const fromDate = moment(date[0]).startOf('day');
      const toDate = moment(date[1]).endOf('day');
      setDateReportDetail({ fromDate, toDate });
    }
  }, []);

  const CardLayout = ({ title, icon, suffix, children }) => {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.prefix}>
            <div className={styles.icon}>{icon}</div>
            <div className={styles.title}>
              <span>{title}</span>
            </div>
          </div>
          <div className={styles.suffix}>{suffix}</div>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    );
  };

  const handleChangeRangePickerDaily = useCallback(
    (dates) => {
      if (checkPermission(currentUser?.permissions, VoiceBot?.viewReportCampaign)) {
        const [fromDate, toDate] = dates;
        const token = tokenHub;
        setRangeDate({
          fromDate: moment(fromDate),
          toDate: moment(toDate),
        });
        fetchReportCampaignDaily({
          status: statusDaily,
          token,
          fromDate: moment(fromDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
          toDate: moment(toDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
        });
        // fetchReportCampaignDays({
        //   token,
        //   fromDate: moment(fromDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
        //   toDate: moment(toDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
        // })
        return null;
      }
    },
    [fetchReportCampaignDaily],
  );

  const onChangeTab = (key) => {
    setTabActive(key);
  };

  //custom data picker
  const dateFormat = 'YYYY-MM-DD';
  const [paramsFilter, setParamsFilter] = useState({
    startDate: moment().startOf('day').format(dateFormat),
    endDate: moment().startOf('day').format(dateFormat),
    typeChart: 'HOURS',
    dateDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'days'),
    monthDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'months'),
  });

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

  const handleChangeTime = useCallback(
    (e) => {
      setParamsFilter({ ...paramsFilter, typeChart: e });
    },
    [paramsFilter],
  );

  const mockData = [
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 1',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      createdDate: new Date().toISOString(),
      status: 'PENDING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 2',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'RUNNING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 3',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'RUNNING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 4',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'COMPLETED',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 5',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'SCHEDULED',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 6',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'PENDING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 7',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'RUNNING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 8',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'RUNNING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 9',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'COMPLETED',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 10',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'SCHEDULED',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 11',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'COMPLETED',
    },
  ];

  return (
    <>
      {viewReportCampaign === true ? (
        <>
          <CardLayout
            title="Tổng quan"
            icon={<PieChartFilled style={{ color: '#526eff' }} />}
            suffix={
              <>
                {/* <RangePicker
                onChange={(date) => handleChangeRangePickerDaily(date)}
                defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
              /> */}
                <CustomDatePicker
                  format={dateFormat}
                  value={[
                    moment(paramsFilter.startDate, dateFormat),
                    moment(paramsFilter.endDate, dateFormat),
                  ]}
                  placeholder={['Từ ngày', 'Đến ngày']}
                  onChange={handleChangeDatePicker}
                />
              </>
            }
          >
            <General
              callDurationDataChart={callDurationDataChart}
              rangeDateDays={rangeDateDays}
              setRangeDateDays={setRangeDateDays}
              fetchReportCampaignDays={fetchReportCampaignDays}
              // fetchReportCampaignDaily={fetchReportCampaignDaily}
              token={tokenHub}
              reportCampaignDaily={reportCampaignDaily}
              ratioReport={ratioReport}
              tabActive={tabActive}
              onChangeTab={onChangeTab}
              //custom time
              handleChangeTime={handleChangeTime}
              paramsFilter={paramsFilter}
            />
          </CardLayout>
          <CardLayout
            title="Thông tin chiến dịch chi tiết"
            icon={<InfoCircleFilled style={{ color: '#526eff' }} />}
            suffix={
              <Space size={15}>
                {/* <RangePicker
                  onChange={onChangeDateReportDetail}
                  defaultValue={[dateReportDetail.fromDate, dateReportDetail.toDate]}
                /> */}
                <Button
                  style={{ background: '#127ace', color: '#fff' }}
                  icon={<DownloadOutlined style={{ color: '#fff' }} />}
                >
                  Tải xuống (excel)
                </Button>
              </Space>
            }
          >
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
                  title: '#',
                  className: styles.column,
                  render: (_, record, id) => <span>{id + 1}</span>,
                },
                {
                  title: 'Tên chiến dịch',
                  dataIndex: 'campaignName',
                  key: 'campaignName',
                  width: 150,
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
                  title: 'Tổng số cuộc gọi',
                  dataIndex: 'totalCall',
                  key: 'totalCall',
                  className: styles.column,
                  align: 'center',
                },
                {
                  title: 'Cuộc gọi thành công',
                  dataIndex: 'totalSuccessCall',
                  key: 'totalSuccessCall',
                  className: styles.column,
                  align: 'center',
                },
                {
                  title: 'Cuộc gọi không thành công',
                  dataIndex: 'totalUnSuccessCall',
                  key: 'totalUnSuccessCall',
                  className: styles.column,
                  align: 'center',
                },
                {
                  title: 'Cuộc gọi lỗi',
                  dataIndex: 'totalErrCall',
                  key: 'totalErrCall',
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
                  title: 'Ngày tạo',
                  dataIndex: 'createdDate',
                  key: 'createdDate',
                  className: styles.column,
                  align: 'center',
                  render: (text) =>
                    (text.length > 0 && moment(text).format('DD-MM-YYYY HH:mm:ss')) || '-',
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
                      return <Tag color="green">Đang chạy</Tag>;
                    }
                    if (record.status === 'COMPLETED') {
                      return <Tag color="blue">Hoàn Thành</Tag>;
                    }
                    if (record.status === 'PENDING') {
                      return <Tag color="orange">Tạm dừng</Tag>;
                    }
                    if (record.status === 'SCHEDULED') {
                      return <Tag color="default">Chưa chạy</Tag>;
                    }
                    return <Tag color="default">{record.status}</Tag>;
                  },
                },
              ]}
              request={async () => {
                try {
                  const res = await requestReportCampaignDetail(headers, {
                    status: statusDetail,
                    token: tokenHub,
                    fromDate: dateReportDetail.fromDate.toJSON(),
                    toDate: dateReportDetail.toDate.toJSON(),
                  });
                  if (res.success) {
                    return {
                      data: res.data,
                    };
                  }
                  throw new Error(res.error || 'ERROR!');
                } catch (err) {
                  // message.error(err.toString());
                  return {
                    data: /* []  */ mockData, //mock data,
                  };
                }
              }}
              actionRef={actionRef}
            />
          </CardLayout>{' '}
        </>
      ) : (
        <NoDataPermission />
      )}
    </>
  );
}

export default connect(({ user }) => ({ user }))(CampaignReport2);
