import PT from 'prop-types';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Tabs } from 'antd';
import { PieChartFilled } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './styles.less';
import General from './components/General';
import TotalDialog from './components/TotalDialog';
import TotalDialogByChannel from './components/TotalDialogByChannel';
import AverageDurationDialog from './components/AverageDurationDialog';
import Agent from './components/Agent';
import CustomDatePicker from '@/components/CustomDatePicker';
import { requestDashboardChat } from '@/services/chat';
import moment from 'moment';
import { checkPermission, OMNI_CHAT_INBOUND } from '@/utils/permission';

const { TabPane } = Tabs;

const fetchReportHistoryChat = async (headers = {}, params = {}) => {
  try {
    const res = await requestDashboardChat(headers, params);
    if (res?.code === 200 && res?.response) {
      return res.response;
    }
    throw new Error(`fetchReportHistoryChat: ${res}`);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const milisecondToMinutes = (milisecond) => (milisecond / 60000).toFixed(1);

OmniChat.propTypes = {
  user: PT.shape({
    authToken: PT.string,
    userId: PT.string,
    tokenGateway: PT.string,
  }).isRequired,
};

const today = moment();

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

const Marker = ({ color }) => (
  <div style={{ width: 12, height: 12, backgroundColor: `${color}`, margin: '0 5px' }} />
);

function OmniChat({ user }) {
  const [dateSelect, setDateSelect] = useState([today, today]);
  const [dataReport, setDataReport] = useState({});
  const [typeAverage, setTypeAverage] = useState('conversation');
  const [dataReport2, setDataReport2] = useState({});
  const [statFacebook, setStatFacebook] = useState(false);
  const [statZalo, setStatZalo] = useState(false);
  const [statLivechat, setStatLivechat] = useState(false);
  const headers = useMemo(() => {
    return {
      Authorization: `Bearer ${user.tokenGateway}`,
    };
  }, [user.tokenGateway]);
  // useEffect(() => {
  //   handleDataChat();
  //   fetchReportHistoryChat(headers, {
  //     beginDate: dateSelect[0].format('YYYY-MM-DD'),
  //     closedDate: dateSelect[1].format('YYYY-MM-DD'),
  //   }).then((result) => {
  //     console.log({ result });
  //     const totalConversation = {
  //       zalo: 0,
  //       livechat: 0,
  //       messenger: 0,
  //     };
  //     const conversation_quantity = [];
  //     const connversation_time_average = [];
  //     const processing_time_average = [];
  //     const waiting_time_average = [];
  //     let averageProcessingTime = 0;
  //     let averageWaitingTime = 0;
  //     result.detail_channel.forEach((item) => {
  //       if (item?.channel === 'Livechat') {
  //         totalConversation.livechat += item.data;
  //       }
  //       if (item?.channel === 'Messenger') {
  //         totalConversation.messenger += item.data;
  //       }
  //       if (item?.channel === 'Zalo') {
  //         totalConversation.zalo += item.data;
  //       }
  //       if (item?.start) {
  //         const temp = [
  //           {
  //             day: item?.day,
  //             data: item?.start,
  //             type: 'Đang giải quyết',
  //           },
  //           {
  //             day: item?.day,
  //             data: item?.closed,
  //             type: 'Đã hoàn thành',
  //           },
  //         ];
  //         conversation_quantity.push(...temp);
  //       }
  //     });
  //     result.list_average_time.forEach((item) => {
  //       averageProcessingTime += item.average_waiting_time;
  //       averageWaitingTime += item.average_waiting_time;
  //       const conversation = [
  //         {
  //           day: item?.day,
  //           data: milisecondToMinutes(item?.average_conversation_livechat),
  //           channel: 'Livechat',
  //         },
  //         {
  //           day: item?.day,
  //           data: milisecondToMinutes(item?.average_conversation_messenger),
  //           channel: 'Messenger',
  //         },
  //         {
  //           day: item?.day,
  //           data: milisecondToMinutes(item?.average_conversation_zalo),
  //           channel: 'Zalo',
  //         },
  //       ];
  //       const processing = [
  //         {
  //           day: item?.day,
  //           data: milisecondToMinutes(item?.average_processing_livechat),
  //           channel: 'Livechat',
  //         },
  //         {
  //           day: item?.day,
  //           data: milisecondToMinutes(item?.average_processing_messenger),
  //           channel: 'Messenger',
  //         },
  //         {
  //           day: item?.day,
  //           data: milisecondToMinutes(item?.average_processing_zalo),
  //           channel: 'Zalo',
  //         },
  //       ];
  //       const waiting = [
  //         {
  //           day: item?.day,
  //           data: milisecondToMinutes(item?.average_waiting_livechat),
  //           channel: 'Livechat',
  //         },
  //         {
  //           day: item?.day,
  //           data: milisecondToMinutes(item?.average_waiting_messenger),
  //           channel: 'Messenger',
  //         },
  //         {
  //           day: item?.day,
  //           data: item?.average_waiting_zalo / 60000,
  //           channel: 'Zalo',
  //         },
  //       ];
  //       connversation_time_average.push(...conversation);
  //       processing_time_average.push(...processing);
  //       waiting_time_average.push(...waiting);
  //     });
  //     setDataReport({
  //       ...result,
  //       totalConversation,
  //       conversation_quantity,
  //       connversation_time_average,
  //       processing_time_average,
  //       waiting_time_average,
  //       averageProcessingTime: averageProcessingTime / 60000,
  //       averageWaitingTime: averageWaitingTime / 60000,
  //     });
  //   });
  // }, [dateSelect, headers]);

  useEffect(() => {
    fetchReportHistoryChat(headers, {
      beginDate: dateSelect[0].format('YYYY-MM-DD'),
      closedDate: dateSelect[1].format('YYYY-MM-DD'),
      typeChart: 'DAYS'
    }).then((result) => {
      handleDataChat(result);
    });
  }, [dateSelect, handleDataChat, statFacebook, statZalo, statLivechat]);
  useEffect(() => {
    setStatFacebook(
      checkPermission(
        user?.currentUser?.permissions,
        OMNI_CHAT_INBOUND.accessFacebookStatisticsReport,
      ),
    );
    setStatZalo(
      checkPermission(user?.currentUser?.permissions, OMNI_CHAT_INBOUND.accessZaloStatisticsReport),
    );
    setStatLivechat(
      checkPermission(
        user?.currentUser?.permissions,
        OMNI_CHAT_INBOUND.accessLivechatStatisticsReport,
      ),
    );
  }, [user?.currentUser?.permissions]);
  const onChangeAverage = useCallback(
    (key) => {
      setTypeAverage(key);
    },
    [setTypeAverage],
  );

  const handleDataChat = useCallback(
    (data) => {
      let listQuantityChat = [];
      let listQuantityConversation = [];
      let listConversationTimeAvg = [];
      let listProcessingTimeAvg = [];
      let listWaitingTimeAvg = [];
      data?.listResponseChart?.forEach((item) => {
        listQuantityChat = [
          ...listQuantityChat,
          {
            day: item.date,
            data: item.listQuantityChat.RESOLVED,
            type: 'Đã hoàn thành',
          },
          {
            day: item.date,
            data: item.listQuantityChat.PROCESSING,
            type: 'Đang giải quyết',
          },
        ];
        listQuantityConversation = [...listQuantityConversation];

        listConversationTimeAvg = [...listConversationTimeAvg];
        listProcessingTimeAvg = [...listProcessingTimeAvg];
        listWaitingTimeAvg = [...listWaitingTimeAvg];
        if (statFacebook) {
          listQuantityChat.push({
            day: item.date,
            data: item.listQuantityConservation.FACEBOOK,
            channel: 'Messenger',
          });
          listConversationTimeAvg.push({
            day: item.date,
            data: item.listQuantityChatAvg.TIMECHAT.FACEBOOK,
            channel: 'Messenger',
          });
          listProcessingTimeAvg.push({
            day: item.date,
            data: item.listQuantityChatAvg.TIMEAPPROVED.FACEBOOK,
            channel: 'Messenger',
          });
          listWaitingTimeAvg.push({
            day: item.date,
            data: item.listQuantityChatAvg.TIMEWAITING.FACEBOOK,
            channel: 'Messenger',
          });
        }
        if (statZalo) {
          listQuantityChat.push({
            day: item.date,
            data: item.listQuantityConservation.ZALO,
            channel: 'Zalo',
          });
          listConversationTimeAvg.push({
            day: item.date,
            data: item.listQuantityChatAvg.TIMECHAT.ZALO,
            channel: 'Zalo',
          });
          listProcessingTimeAvg.push({
            day: item.date,
            data: item.listQuantityChatAvg.TIMEAPPROVED.ZALO,
            channel: 'Zalo',
          });
          listWaitingTimeAvg.push({
            day: item.date,
            data: item.listQuantityChatAvg.TIMEWAITING.ZALO,
            channel: 'Zalo',
          });
        }
        if (statLivechat) {
          listQuantityChat.push({
            day: item.date,
            data: item.listQuantityConservation.LIVECHAT,
            channel: 'Livechat',
          });
          listConversationTimeAvg.push({
            day: item.date,
            data: item.listQuantityChatAvg.TIMECHAT.LIVECHAT,
            channel: 'Livechat',
          });
          listProcessingTimeAvg.push({
            day: item.date,
            data: item.listQuantityChatAvg.TIMEAPPROVED.LIVECHAT,
            channel: 'Livechat',
          });
          listWaitingTimeAvg.push({
            day: item.date,
            data: item.listQuantityChatAvg.TIMEWAITING.LIVECHAT,
            channel: 'Livechat',
          });
        }
      });
      setDataReport2({
        ...data,
        listQuantityChat,
        listQuantityConversation,
        listConversationTimeAvg,
        listProcessingTimeAvg,
        listWaitingTimeAvg,
      });
    },
    [statFacebook, statLivechat, statZalo],
  );
  return (
    <>
      <CardLayout
        title="Tổng quan"
        icon={<PieChartFilled style={{ color: '#526eff' }} />}
        suffix={
          <CustomDatePicker
            disabled={false}
            placeholder={['Từ ngày', 'Đến ngày']}
            defaultValue={dateSelect}
            onChange={(value) => {
              if (value?.length > 0) {
                return setDateSelect([value[0], value[1]]);
              }
              return setDateSelect({});
            }}
          />
        }
      >
        <General dataReport={dataReport2} />
      </CardLayout>
      {/* Số lượng hội thoại */}
      <div className={styles.container}>
        <div className={styles.chartWrapper}>
          <div className={styles.infoChart}>
            <span className={styles.title}>Số lượng hội thoại</span>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <Marker color="#428dff" />
                <span>Đang giải quyết</span>
              </div>
              <div className={styles.legendItem}>
                <Marker color="#bfbfbf" />
                <span>Đã hoàn thành</span>
              </div>
            </div>
          </div>
          {dataReport2?.listQuantityChat && <TotalDialog dataReport={dataReport2} />}
        </div>
      </div>
      {/* Số lượng hội thoại theo các kênh */}
      <div className={styles.container}>
        <div className={styles.chartWrapper}>
          {dataReport2?.listQuantityConversation && (
            <TotalDialogByChannel dataReport={dataReport2} statFacebook={statFacebook} statZalo={statZalo} statLivechat={statLivechat} />
          )}
        </div>
      </div>
      {/* Thời lượng hội thoại trung bình */}
      <div className={styles.container}>
        <div className={styles.chartWrapper}>
          <div className={styles.infoChart}>
            <span className={styles.title}>Thời lượng hội thoại trung bình</span>
            <Tabs onChange={onChangeAverage}>
              <TabPane tab="Thời gian hội thoại" key="conversation" />
              <TabPane tab="Thời gian chờ" key="waiting" />
              <TabPane tab="Thời gian xử lý" key="processing" />
            </Tabs>
          </div>
          {dataReport2?.listConversationTimeAvg && (
            <AverageDurationDialog dataReport={dataReport2} typeAverage={typeAverage} statFacebook={statFacebook} statZalo={statZalo} statLivechat={statLivechat} />
          )}
        </div>
      </div>
      {/* Số lượng agent và số lượng chat từng agent */}
      {/* <div className={styles.container}>
        <div className={styles.chartWrapper}> */}
      {/* <div className={styles.infoChart}>
            <span className={styles.title}>Thời lượng hội thoại trung bình</span>
            <Tabs>
              <TabPane tab="Thời gian hội thoại" key="1"></TabPane>
              <TabPane tab="Thời gian chờ" key="2"></TabPane>
              <TabPane tab="Thời gian xử lý" key="3"></TabPane>
            </Tabs>
          </div> */}
      {/* <Agent />
        </div>
      </div> */}
    </>
  );
}

export default connect(({ user }) => ({ user }))(OmniChat);
