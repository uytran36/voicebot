/* eslint-disable react/jsx-key */
import Table from '@ant-design/pro-table';
import React, { useCallback, useState, useContext, useEffect } from 'react';
import { FormattedMessage, formatMessage } from 'umi';
import { Card, message, Input, notification, Typography, Modal } from 'antd';
import PT from 'prop-types';
import styles from './styles.less';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import {
  ForwardSvg,
  IncomingCallSvg,
  InternalCallSvg,
  ListeningSvg,
  OutgoingCallSvg,
  PhoneSvg,
} from '../../svg';
import { CallModal, CallForwardModal, ListenModal } from './Modal';
import { StateSessionContext, UserAgentContext } from '@/layouts/BasicLayoutContext';
import { NoteContext, NoteUpdateContext } from '@/contexts/note.context';
import {
  STATUS_MONITOR_INBOUND,
  STATUS_MONITOR_INBOUND_FILTER,
  DIRECTION_CALL,
} from '@/constants/call-center';
import PhoneModal from './PhoneModal';
import { requestMonitorCallInbound, requestGetListExtensions } from '@/services/call-center';
import { requestCancelCall, requestTransferCall } from '@/services/call-center';
import SelectMultiple from '@/components/SelectMultiple';
import { SessionState } from 'sip.js';
import { debounce } from 'lodash';

const callDirection = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Cuộc gọi vào', value: 'incoming' },
  { label: 'Cuộc gọi ra', value: 'outcoming' },
  { label: 'Cuộc gọi nội bộ', value: 'internal' },
];

const stateSelect = [
  {
    label: 'Tất cả',
    value: 'all',
  },
  { label: 'Đang đỗ chuông', value: 'ringing' },
  { label: 'Đã kết nối', value: 'connected' },
];

const timeFilter = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Dưới 1 phút', value: 1 },
  { label: '1 đến 5 phút', value: 2 },
  { label: '5 đến 10 phút', value: 3 },
  { label: '10 đến 30 phút', value: 4 },
  { label: 'trên 30 phút', value: 5 },
];

const data = [
  {
    id: '7a71c525-de55-4fd1-b234-bbf3a6184d83',
    direction: 'inbound',
    callNumber: '0938697503',
    callName: 'Pham Ba Phuc',
    recipientNumber: '101',
    recipientName: 'admin1',
    callStartTime: '08:53:44',
    callPickupTime: null,
    status: 'RINGING',
    time: '2021-11-19T01:53:44.000+00:00',
  },
  {
    id: 'e81ff48e-d01c-46d6-beeb-7dcdc05d154f',
    direction: 'inbound',
    callNumber: '0938697503',
    callName: 'Pham Ba Phuc',
    recipientNumber: '103',
    recipientName: 'admin',
    callStartTime: '08:53:44',
    callPickupTime: null,
    status: 'ACTIVE',
    time: '2021-11-19T01:53:44.000+00:00',
  },
  {
    id: '020ee3af-68d5-4ffa-9f52-aaec3428b00e',
    direction: 'inbound',
    callNumber: '0938697503',
    callName: 'Pham Ba Phuc',
    recipientNumber: '102',
    recipientName: 'test123142345',
    callStartTime: '08:53:44',
    callPickupTime: null,
    status: 'ACTIVE',
    time: '2021-11-19T01:53:44.000+00:00',
  },
];

export const logData = [
  { time: '15:00:00', message: 'Initializing' },
  { time: '15:00:00', message: 'Offering' },
  { time: '15:00:00', message: 'ANI: 0123821371' },
  { time: '15:00:00', message: 'DNIS: 1800012382' },
  { time: '15:00:00', message: 'Call answer' },
  { time: '15:00:00', message: 'Enter workgroup' },
  { time: '15:00:00', message: 'Call answer' },
  { time: '15:00:00', message: 'DNIS: 1238247234' },
  { time: '15:00:00', message: 'Initializing' },
];

export const forwardData = [
  {
    name: 'test 1',
    number: '109',
  },
  { name: 'test 2', number: '103' },
];

function CallReport(props) {
  const { headers, dataCallMonitor, tabKey, dispatch } = props;
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callModalInfo, setCallModalInfo] = useState();
  const [callForwardOpen, setCallForwardOpen] = useState(false);
  const [callForwardInfo, setCallForwardInfo] = useState();
  const [listenModalOpen, setListenModalOpen] = useState(false);
  const [listenModalInfo, setListenModalInfo] = useState();
  const [phoneModal, setPhoneModal] = useState(false);
  const [rowSelected, toggleRow] = useState({});
  const [filterCall, setFilterCall] = useState({
    status: '',
    direction: '',
    query: '',
  });
  const stateSession = useContext(StateSessionContext);
  const {
    handleHangup,
    handleCall,
    handleSendDTMF,
    handleHold,
    handleUnhold,
    handleMute,
    handleUnmute,
    handleTransfer,
    handleDecline,
    isHold,
    isMute,
  } = useContext(UserAgentContext);
  const valueNotes = useContext(NoteContext);

  // useEffect(() => {
  //   if (stateSession === SessionState.Terminated || stateSession === SessionState.Terminated) {
  //     setPhoneModal(false);
  //   }
  // }, [stateSession]);

  useEffect(() => {
    if (stateSession === SessionState.Terminated || stateSession === SessionState.Terminated) {
      phoneModal && setPhoneModal(false);
      callModalOpen && setCallModalOpen(false);
    }
  }, [stateSession]);

  const handleCallForwardOPen = (callInfo) => {
    setCallForwardInfo(callInfo);
    setCallForwardOpen(true);
  };

  const handleCallModelOpen = (record) => {
    if (!checkConnected(record.status)) {
      dispatch({
        type: 'global/changeKeyTabCallcenter',
        payload: 'callInterface',
      });
      dispatch({
        type: 'callManagement/getCustomerInfo',
        payload: record?.callNumber,
      });
      dispatch({
        type: 'callManagement/execution',
        payload: {
          numberCall: record?.callNumber,
        },
      });
      toggleRow(record);
      handleCall(`**`, {
        extraHeaders: [
          `X-intercept_ext: ${
            record?.direction === 'inbound' ? record?.recipientNumber : record?.callNumber
          }`,
        ],
      });
    }
    setCallModalInfo(record);
    setCallModalOpen(true);
  };

  const handleListenModalOpen = (callInfo) => {
    setListenModalInfo(callInfo);
    setListenModalOpen(true);
  };

  const checkConnected = useCallback((status) => ['ACTIVE', 'Answered'].includes(status), []);

  /**
   * handle eavesdrop
   * @param {Object} record
   * @return {void}
   */
  const handleEavesdrop = useCallback(
    (record) => () => {
      if (checkConnected(record.status)) {
        dispatch({
          type: 'global/changeKeyTabCallcenter',
          payload: 'callInterface',
        });
        toggleRow(record);
        handleCall(`*34`, {
          extraHeaders: [
            `X-eavesdrop: ${
              record?.direction === 'inbound' ? record?.recipientNumber : record?.callNumber
            }`,
          ],
        });

        setPhoneModal(true);
      }
    },
    [handleCall],
  );

  const handleCancelCall = useCallback(
    (record) => async () => {
      const res = await requestCancelCall(record.id, headers);
      if (res.code === 200) {
        notification.success({
          message: formatMessage({ id: 'pages.call-center.monitor.cancel-call.success' }),
        });
      } else {
        notification.warning({
          message: formatMessage({ id: 'pages.call-center.monitor.cancel-call.fail' }),
          description: res.response.message,
        });
      }
    },
    [headers],
  );

  const handleTransferCall = useCallback(
    async (record, ipPhone) => {
      const res = await requestTransferCall(
        {
          id: record.id,
          direction: 'local',
          phone: ipPhone,
        },
        headers,
      );
      if (res.code === 200) {
        setListenModalOpen(false);
        notification.success({
          message: formatMessage({ id: 'pages.call-center.monitor.transfer-call.success' }),
        });
      } else {
        notification.warning({
          message: formatMessage({ id: 'pages.call-center.monitor.transfer-call.fail' }),
          description: res.response.message,
        });
      }
    },
    [headers],
  );
  /**
   * handle pickup call
   * @param {Object} record
   * @return {void}
   */
  const handlePickupCall = useCallback(
    (record) => () => {
      if (!checkConnected(record.status)) {
        // dispatch({
        //   type: 'global/changeKeyTabCallcenter',
        //   payload: 'callInterface',
        // });
        toggleRow(record);
        handleCall(`**`, {
          extraHeaders: [
            `X-intercept_ext: ${
              record?.direction === 'inbound' ? record?.recipientNumber : record?.callNumber
            }`,
          ],
        });
      }
    },
    [handleCall],
  );

  const fetchListCallInbound = useCallback(async () => {
    try {
      const params = {
        // ext: agent.length > 0 ? JSON.stringify(agent) : '',
        status:
          filterCall?.status?.length > 2 && filterCall?.status?.length < 14
            ? filterCall.status
            : 'all',
        direction:
          filterCall?.direction?.length > 2 && filterCall?.direction?.length < 22
            ? filterCall.direction
            : 'all',
        query: filterCall?.query?.length > 0 ? filterCall?.query : 'all',
      };
      const res = await requestMonitorCallInbound(headers, params);
      if (res?.code === 200 && res?.response?.data) {
        return dispatch({
          type: 'callManagement/save',
          payload: {
            dataCallMonitor: res.response.data,
            // dataCallMonitor: res.response.data,
          },
        });
      }
      throw new Error('Can not fetch data');
      return null;
    } catch (err) {
      console.error(err);
      return [];
    }
  }, [filterCall, headers, dispatch]);

  const handleCancelModal = useCallback(() => {
    // dispatch({
    //   type: 'global/changeKeyTabCallcenter',
    //   payload: 'callMonitor',
    // });
    handleHangup();
    setPhoneModal(false);
  }, [handleHangup]);

  useEffect(() => {
    if (tabKey === 'callObserve') {
      fetchListCallInbound();
      const interval = setInterval(() => {
        tabKey === 'callObserve' && fetchListCallInbound();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [filterCall.direction, filterCall.status, fetchListCallInbound, tabKey]);

  const handleOkDirection = (direction) => {
    return setFilterCall({ ...filterCall, direction: direction.join() });
  };

  const handleOkStatus = (status) => {
    return setFilterCall({ ...filterCall, status: status.join() });
  };

  const handleChangeInput = (e) => {
    return setFilterCall({ ...filterCall, query: e.target.value });
  };

  return (
    <Card>
      <Table
        search={false}
        options={false}
        tableAlertOptionRender={null}
        size="small"
        cardProps={{
          bodyStyle: { background: 'white', paddingTop: 0 },
        }}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
          size: 'default',
          hideOnSinglePage: true,
        }}
        dataSource={dataCallMonitor}
        headerTitle={<Typography.Title level={5}>Danh sách cuộc gọi</Typography.Title>}
        toolBarRender={() => [
          // <Select placeholder="Hướng cuộc gọi" allowClear options={callDirection} />,
          <SelectMultiple list={DIRECTION_CALL} callback={handleOkDirection} />,
          // <Select
          //   placeholder="Trạng thái"
          //   dropdownMatchSelectWidth={false}
          //   allowClear
          //   options={stateSelect}
          // />,
          <SelectMultiple
            placeholder="Trạng thái"
            list={STATUS_MONITOR_INBOUND_FILTER}
            callback={handleOkStatus}
          />,
          // <Select
          //   placeholder="Thời lượng"
          //   allowClear
          //   options={timeFilter}
          //   dropdownMatchSelectWidth={false}
          // />,
          <Input
            key="search"
            placeholder="Nhập từ khóa"
            prefix={<SearchOutlined />}
            allowClear
            // onChange={(e) => {
            //   if (e.target.value.length === 0) {
            //     handleInputOnChange('');
            //   }
            // }}
            // onPressEnter={(e) => handleInputOnChange(e.target.value)}
            onChange={debounce((e) => handleChangeInput(e), 500)}
            onPressEnter={(e) => handleInputOnChange(e.target.value)}
          />,
        ]}
        columns={[
          {
            title: (
              <b>
                <FormattedMessage
                  defaultMessage="Call Direction"
                  id="pages.call-observe.call-direction"
                />
              </b>
            ),
            dataIndex: 'direction',
            align: 'left',
            render: (text, record) => {
              return (
                <div className={styles.colName}>
                  <div>
                    <span>
                      {text === 'inbound' ? (
                        <IncomingCallSvg />
                      ) : text === 'outbound' ? (
                        <OutgoingCallSvg />
                      ) : (
                        <InternalCallSvg />
                      )}
                    </span>
                    <span style={{ marginLeft: '5px' }}>
                      {text === 'inbound'
                        ? 'Gọi vào'
                        : text === 'outbound'
                        ? 'Gọi ra'
                        : 'Gọi nội bộ'}
                    </span>
                  </div>
                </div>
              );
            },
          },
          {
            title: (
              <b>
                <FormattedMessage defaultMessage="Số máy gọi" id="pages.call-observe.call-number" />
              </b>
            ),
            dataIndex: 'callNumber',
            align: 'left',
            sorter: true,
            // width: 80,
          },
          {
            title: (
              <b>
                <FormattedMessage defaultMessage="Name" id="pages.call-observe.call-name" />
              </b>
            ),
            dataIndex: 'callName',
            align: 'left',
            // width: 100,
            sorter: true,
          },
          {
            title: (
              <b>
                <FormattedMessage
                  defaultMessage="Số máy nhận"
                  id="pages.call-observe.receiver-number"
                />
              </b>
            ),
            dataIndex: 'recipientNumber',
            align: 'left',
            // width: 200,
          },
          {
            title: <b>Tên người nhân</b>,
            dataIndex: 'recipientName',
            align: 'left',
            // width: 80,
          },
          {
            title: (
              <b>
                <FormattedMessage
                  defaultMessage="Thời gian bắt đầu"
                  id="pages.call-observe.start-time"
                />
              </b>
            ),
            dataIndex: 'callStartTime',
            align: 'center',
            // width: 80,
          },
          {
            title: (
              <b>
                <FormattedMessage defaultMessage="Trạng thái" id="pages.call-observe.state" />
              </b>
            ),
            dataIndex: 'status',
            align: 'center',
            width: '130px',
            render: (text) => {
              const isConnected = checkConnected(text);
              return (
                <div
                  style={{
                    background: isConnected ? '#F5F5F5' : '#1EAF61',
                    color: isConnected ? 'black' : 'white',
                    fontSize: '12px',
                    padding: '2px',
                  }}
                >
                  {STATUS_MONITOR_INBOUND[text]}
                </div>
              );
            },
          },
          // {
          //   title: (
          //     <b>
          //       <FormattedMessage defaultMessage="THời lương" id="pages.call-observe.time-last" />
          //     </b>
          //   ),
          //   dataIndex: 'timeLast',
          //   align: 'center',
          // },
          {
            title: (
              <b>
                <FormattedMessage defaultMessage="Hành động" id="pages.call-observe.action" />
              </b>
            ),
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            render: (_, record) => {
              const isConnected = checkConnected(record.status);
              return (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    className={styles.icon}
                    style={{
                      background: isConnected ? '#127ACE' : '#1EAF61',
                    }}
                    onClick={
                      isConnected ? handleEavesdrop(record) : () => handleCallModelOpen(record)
                    }
                    // onClick={() => handleListenModalOpen(record)}
                  >
                    {isConnected ? <ListeningSvg /> : <PhoneSvg />}
                  </div>
                  <div
                    className={`${styles.icon} ${!isConnected && styles.disable}`}
                    style={{
                      background: isConnected ? '#127ACE' : '#88bce7',
                    }}
                  >
                    <ForwardSvg onClick={() => handleCallForwardOPen(record)} />
                    {/* <ForwardSvg onClick={handleEavesdrop(record)} /> */}
                  </div>
                  <div
                    className={`${styles.icon} ${!isConnected && styles.disable}`}
                    style={{
                      background: '#FF4D4F',
                    }}
                    onClick={handleCancelCall(record)}
                  >
                    <CloseOutlined style={{ color: 'white' }} />
                  </div>
                </div>
              );
            },
          },
        ]}
        scroll={{ x: 1500 }}
      />
      <Modal
        title={<span style={{ fontSize: 18, fontWeight: 600 }}>Tương tác cuộc gọi</span>}
        width={700}
        footer={null}
        visible={phoneModal}
        onCancel={handleCancelModal}
      >
        <PhoneModal
          handleSendDTMF={handleSendDTMF}
          stateSession={stateSession}
          rowSelected={rowSelected}
        />
      </Modal>
      <CallModal
        visible={callModalOpen}
        setVisible={setCallModalOpen}
        info={callModalInfo}
        valueNotes={valueNotes}
        stateSession={stateSession}
        handleHold={handleHold}
        handleUnhold={handleUnhold}
        handleMute={handleMute}
        handleUnmute={handleUnmute}
        handleTransfer={handleTransfer}
        handleDecline={handleDecline}
        handleHangup={handleHangup}
        isHold={isHold}
        isMute={isMute}
      />
      <CallForwardModal
        visible={callForwardOpen}
        setVisible={setCallForwardOpen}
        onTransfer={handleTransferCall}
        info={callForwardInfo}
        headers={headers}
      />
      <ListenModal
        visible={listenModalOpen}
        setVisible={setListenModalOpen}
        info={listenModalInfo}
      />
    </Card>
  );
}

CallModal.propTypes = {
  visible: PT.bool,
  setVisible: PT.func,
  info: PT.object,
};

ListenModal.propTypes = {
  visible: PT.bool.isRequired,
  setVisible: PT.func.isRequired,
  info: PT.object.isRequired,
};

export default React.memo(CallReport);
