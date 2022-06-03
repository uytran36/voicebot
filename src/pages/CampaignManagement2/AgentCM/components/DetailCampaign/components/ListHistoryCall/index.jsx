import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Input, Typography, DatePicker, Tag, Form } from 'antd';
import { SearchOutlined, PieChartFilled } from '@ant-design/icons';
import styles from './styles.less';
import { connect } from 'umi';
import PT from 'prop-types';
import styled from 'styled-components';
import {
  requestReportCampaignDaily,
  requestReportCampaignDetail,
  requestReportCampaignDays,
} from './service';
import NoDataPermission from '@/components/NoDataPermission';
import moment from 'moment';
import Table from '@ant-design/pro-table';
import { REPORT_MANAGEMENT, checkPermission, VoiceBot } from '@/utils/permission';
import CustomDatePicker from '@/components/CustomDatePicker';
import SelectMultiple from '@/components/SelectMultiple';

const { RangePicker } = DatePicker;
const { Title } = Typography;

ListHistoryCall.propTypes = {
  user: PT.shape({
    tokenHub: PT.string,
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
    currentUser: PT.instanceOf(Object),
  }).isRequired,
};

const StyleTable = styled(Table)`
  .ant-card-body {
    padding: 0px 24px !important;
  }
  .ant-pro-table-list-toolbar-container {
    padding: 24px 0px;
  }
  .ant-form-item {
    display: block;
  }
  .ant-pro-table-list-toolbar-right {
    margin-top: auto;
  }
`;

function ListHistoryCall(props) {
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
      callType: 'Voicebot',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'ignored',
      note: 'Khác...',
    },
    {
      campaignCode: Math.random(),
      callType: 'Gọi lại',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'missed',
      note: 'Khác...',
    },
    {
      campaignCode: Math.random(),
      callType: 'Voicebot',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'success',
      note: 'Khác...',
    },
    {
      campaignCode: Math.random(),
      callType: 'Voicebot',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'no_response',
      note: 'Khác...',
    },
    {
      campaignCode: Math.random(),
      callType: 'Voicebot',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'busy',
      note: 'Khác...',
    },
    {
      campaignCode: Math.random(),
      callType: 'Voicebot',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'other_failure',
      note: 'Khác...',
    },
    {
      campaignCode: Math.random(),
      callType: 'Voicebot',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'busy',
      note: 'Khác...',
    },
    {
      campaignCode: Math.random(),
      callType: 'Voicebot',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'ignored',
      note: 'Khác...',
    },
    {
      campaignCode: Math.random(),
      callType: 'Voicebot',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'success',
      note: 'Khác...',
    },
    {
      campaignCode: Math.random(),
      callType: 'Gọi lại',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'ignored',
      note: 'Khác...',
    },
    {
      campaignCode: Math.random(),
      callType: 'Voicebot',
      clientName: 'Nguyễn Văn Nam',
      phoneNum: '0167057430',
      outboundNum: '19001891',
      startTime: '12/05/2022 19:31',
      duration: '00:00',
      result: 'ignored',
      note: 'Khác...',
    },
  ];

  return (
    <>
      {true ? (
        <StyleTable
          headerTitle={
            <Form style={{ marginBottom: '0px', display: 'flex', gap: '10px' }}>
              <Form.Item
                style={{ marginBottom: '0px' }}
                name="role_name"
                label={<span>Trạng thái</span>}
              >
                <SelectMultiple
                  list={/* rolesFilter */ []}
                  //callback={handleOkRole}
                  style={{ width: 150 }}
                />
              </Form.Item>

              <Form.Item
                style={{ marginBottom: '0px' }}
                name="department"
                label={<span>Thời gian</span>}
              >
                <RangePicker
                  onChange={(e) => onSelectSumaryReport(e, detailCampaign.campaign_id)}
                />
              </Form.Item>
            </Form>
          }
          //search form
          toolBarRender={() => [
            <Input
              style={{
                width: 200,
              }}
              key="search"
              placeholder="Nhập từ khóa"
              prefix={<SearchOutlined />}
              allowClear
              /* onChange={(e) => {
      if (e.target.value.length === 0) {
        handleInputOnChange('');
      }
    }}
    onPressEnter={(e) => handleInputOnChange(e.target.value)} */
            />,
          ]}
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
              title: 'Loại cuộc gọi',
              dataIndex: 'callType',
              key: 'callType',
              width: 150,
              className: styles.column,
            },
            {
              title: 'Tên khách hàng',
              dataIndex: 'clientName',
              key: 'clientName',
              className: styles.column,
              align: 'center',
            },

            {
              title: 'Số điện thoại',
              dataIndex: 'phoneNum',
              key: 'phoneNum',
              className: styles.column,
              align: 'center',
            },
            {
              title: 'Đầu số gọi ra',
              dataIndex: 'outboundNum',
              key: 'outboundNum',
              className: styles.column,
              align: 'center',
            },
            {
              title: 'Thời gian bắt đầu',
              dataIndex: 'startTime',
              key: 'startTime',
              className: styles.column,
              align: 'center',
              render: (text) =>
                (text.length > 0 && moment(text).format('DD/MM/YYYY HH:mm:ss')) || '-',
            },
            {
              title: 'Thời lượng gọi',
              dataIndex: 'duration',
              key: 'duration',
              className: styles.column,
              align: 'center',
            },
            {
              title: 'Kết quả',
              dataIndex: 'result',
              key: 'result',
              width: 100,
              align: 'center',
              className: styles.column,
              render: (text, record, index) => {
                if (record.result === 'ignored') {
                  return <Tag color="red">Bị bỏ qua</Tag>;
                }
                if (record.result === 'missed') {
                  return <Tag color="red">Cuộc gọi nhỡ</Tag>;
                }
                if (record.result === 'success') {
                  return <Tag color="blue">Thành công</Tag>;
                }
                if (record.result === 'no_response') {
                  return <Tag color="orange">Không trả lời</Tag>;
                }
                if (record.result === 'busy') {
                  return <Tag color="orange">Máy bận</Tag>;
                }
                return <Tag color="red">Thất bại khác</Tag>;
              },
            },
            {
              title: 'Ghi chú',
              dataIndex: 'note',
              key: 'note',
              className: styles.column,
              align: 'center',
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
      ) : (
        <NoDataPermission />
      )}
    </>
  );
}

export default connect(({ user }) => ({ user }))(ListHistoryCall);