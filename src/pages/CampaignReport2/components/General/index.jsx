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
  Divider,
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
import General from './components/Analytic';
import CampaignInfoDetail from './components/CampaignInfoDetail';
import NoDataPermission from '@/components/NoDataPermission';
import moment from 'moment';
import Table from '@ant-design/pro-table';
import { REPORT_MANAGEMENT, checkPermission, VoiceBot } from '@/utils/permission';

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
  const [tabActive, setTabActive] = useState('Chiến dịch');

  useEffect(() => {
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
    // fetchReportCampaignMonth({
    //   token,
    //   date: toDate,
    // });
    // queryReportMonthOutBound({
    //   token,
    //   date: toDate,
    // });

  }, []);

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
            campaign_scheduled: 0, // chưa chạy
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

  return (
    <>
      <CardLayout
        title="Thống kê"
        icon={<PieChartFilled style={{ color: '#526eff' }} />}
        suffix={
          <RangePicker
            onChange={(date) => handleChangeRangePickerDaily(date)}
            defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
          />
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
        />
      </CardLayout>
      <Divider />
      <CardLayout
        title="Thông tin chiến dịch chi tiết"
        icon={<InfoCircleFilled style={{ color: '#526eff' }} />}
        suffix={
          <Space size={15}>
            <Button type="primary" ><DownloadOutlined /> Tải xuống (excel)</Button>
          </Space>
        }
      >
        <CampaignInfoDetail />
      </CardLayout>
    </>
  );
}

export default connect(({ user }) => ({ user }))(CampaignReport2);
