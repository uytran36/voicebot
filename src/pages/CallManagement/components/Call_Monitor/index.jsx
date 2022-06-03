import React, { useState, useCallback, memo, useEffect, useContext } from 'react';
import PT from 'prop-types';
import Table from '@ant-design/pro-table';
import { SessionState } from 'sip.js';
import { Form, Select, Tag, Row, Col, Modal, Button } from 'antd';
// import { PhoneFilled, CloseOutlined } from '@ant-design/icons';
import PhoneModal from './components/PhoneModal';
import { HeadPhone } from '@/components/Icons';
import styles from './styles.less';
import moment from 'moment';
import { requestListPbxCallQueue, requestCallCenterQueue } from '../../service';
import { StateSessionContext, UserAgentContext } from '@/layouts/BasicLayoutContext';
import { requestMonitorCallInbound, requestGetListExtensions } from '@/services/call-center';
import Timer from '@/components/Timer';
import SelectMultiple from '@/components/SelectMultiple';
import { STATUS_MONITOR_INBOUND, STATUS_MONITOR_INBOUND_FILTER } from '@/constants/call-center';

const { Option } = Select;

CallMonitor.propTypes = {
  // userAgent: PT.shape({
  //   handleCall: PT.func,
  //   handleHangup: PT.func,
  //   handleSendDTMF: PT.func,
  //   isOutgoing: PT.bool,
  // }).isRequired,
  // stateSession: PT.string.isRequired,
  dispatch: PT.func.isRequired,
  dataCallMonitor: PT.instanceOf(Array).isRequired,
  headers: PT.instanceOf(Object).isRequired,
  keyTabCallcenter: PT.string.isRequired,
};

function CallMonitor({
  // userAgent: { handleCall, handleHangup, handleSendDTMF },
  // stateSession,
  dispatch,
  dataCallMonitor,
  headers,
  keyTabCallcenter,
}) {
  const stateSession = useContext(StateSessionContext);
  const { handleHangup, handleCall, handleSendDTMF } = useContext(UserAgentContext);
  const [phoneModal, setPhoneModal] = useState(false);
  const [rowSelected, toggleRow] = useState({});
  const [queueCall, setQueueCall] = useState([]);
  const [queueSelected, setQueueSelected] = useState('all');
  const [agentByQueue, setAgentByQueue] = useState([]);
  const [filter, setFilter] = useState({
    listQueue: [],
    queueSelected: 'all',
    listAgent: [],
    agentSelected: 'Tất cả',
    listStatus: [
      {
        key: 'all',
        name: 'Tất cả',
      },
      {
        key: 'CHANNEL_CREATED',
        name: 'Đang đổ chuông',
      },
      {
        key: 'CHANNEL_ANSWER',
        name: 'Đã kết nối',
      },
    ],
    statusSelected: 'all',
  });
  const [agentInbound, setAgentIbound] = useState([]);
  const [extensions, setExtensions] = useState({});
  const [filterCall, setFilterCall] = useState({
    status: '',
  });

  const getListExtension = useCallback(async () => {
    try {
      const res = await requestGetListExtensions(headers);

      if (res?.success && res?.data.length > 0) {
        const result = Object.assign(
          {},
          ...res?.data.map(
            (item) => item?.extension && { [item.extension]: `Agent ${item.extension}` },
          ),
        );
        return setExtensions(result);
      }
      return null;
    } catch (error) {
      return console.error(`getListExtension: ${error}`);
    }
  }, [headers]);

  /**
   * handle eavesdrop
   * @param {Object} record
   * @return {void}
   */
  const handleEavesdrop = useCallback(
    (record) => () => {
      if (record.status === 'ACTIVE' || record.status === 'Answered') {
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

  const handleCancelModal = useCallback(() => {
    dispatch({
      type: 'global/changeKeyTabCallcenter',
      payload: 'callMonitor',
    });
    handleHangup();
    setPhoneModal(false);
  }, [handleHangup]);

  const fetchListCallInbound = useCallback(
    async (status, agent) => {
      try {
        const params = {
          // ext: agent.length > 0 ? JSON.stringify(agent) : '',
          direction: 'ALL',
          status:
            filterCall?.status?.length > 2 && filterCall?.status?.length < 14
              ? filterCall.status
              : 'ALL',
        };
        const res = await requestMonitorCallInbound(headers, params);
        if (res?.code === 200 && res?.response?.data) {
          dispatch({
            type: 'callManagement/save',
            payload: {
              dataCallMonitor: res.response.data.filter((item) => item?.direction === 'inbound'),
              // dataCallMonitor: res.response.data,
            },
          });
          return null;
        }
        throw new Error('Can not fetch data');
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    [dispatch, headers, filterCall],
  );

  const fetchListQueue = useCallback(async () => {
    try {
      const res = await requestCallCenterQueue(headers, {
        sort: { xml_cdr_uuid: 1 },
        page: 1,
        limit: 1000,
      });
      if (res.success) {
        // return setQueueCall([{ queue_extension: 'all', queue_name: 'Tất cả' }, ...res.data]);
        return setFilter({
          ...filter,
          listQueue: [{ queue_extension: 'all', queue_name: 'Tất cả' }, ...res.data],
        });
      }
      throw new Error('Can not fetch data');
    } catch (err) {
      console.error(err);
      return [];
    }
  }, [dispatch, headers]);

  useEffect(() => {
    if (stateSession === SessionState.Terminated || stateSession === SessionState.Terminated) {
      setPhoneModal(false);
    }
  }, [stateSession]);

  useEffect(() => {
    // fetchListQueue();
    getListExtension();
  }, []);

  useEffect(() => {
    fetchListCallInbound();
    const interval = setInterval(() => {
      keyTabCallcenter === 'callMonitor' && fetchListCallInbound();
    }, 3000);
    return () => clearInterval(interval);
  }, [filterCall.status, keyTabCallcenter]);

  // const columns = [
  //   {
  //     title: '#',
  //     render: (_, record, id) => <span>{id + 1}</span>,
  //     width: 40,
  //   },
  //   {
  //     title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Số nhánh</span>,
  //     dataIndex: 'ext',
  //     align: 'center',
  //     width: 100,
  //   },
  //   {
  //     title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Tên Agent</span>,
  //     dataIndex: 'agentName',
  //     align: 'center',
  //     width: 100,
  //   },
  //   {
  //     title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>SĐT khách</span>,
  //     dataIndex: 'customerPhone',
  //     align: 'center',
  //     width: 120,
  //   },
  //   {
  //     title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Tên khách</span>,
  //     dataIndex: 'customerName',
  //     align: 'center',
  //     width: 120,
  //   },
  //   {
  //     title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Trạng thái</span>,
  //     dataIndex: 'status',
  //     align: 'center',
  //     width: 90,
  //     render: (text) => (
  //       <Tag color={['ACTIVE', 'Answered'].includes(text) ? 'default' : '#1eaf61'}>
  //         {STATUS_MONITOR_INBOUND[text]}
  //       </Tag>
  //     ),
  //   },
  //   // {
  //   //   title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Queue</span>,
  //   //   dataIndex: 'queue_name',
  //   //   align: 'center',
  //   //   width: 90,
  //   //   render: (text, record) => <span>{text}</span>,
  //   // },
  //   {
  //     title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Thời lượng</span>,
  //     dataIndex: 'time',
  //     align: 'center',
  //     width: 90,
  //     render: (text) => {
  //       const timeFormat = moment(text).format('YYYY-MM-DD HH:mm:ss');
  //       const timeParse = moment(text, 'YYYY-MM-DD HH:mm:ss').isValid();
  //       const time = timeParse
  //         ? Math.round(moment().diff(moment(text).add(7, 'hours'), 'millisecond') / 1000)
  //         : moment().diff(moment(timeFormat), 'millisecond') / 1000;
  //       return <Timer duration={time} props={{ startImmediately: true }} />;
  //     },
  //   },
  //   {
  //     title: (
  //       <span style={{ color: '#1A1A1A', fontWeight: 'bold', background: '#fff' }}>Hành động</span>
  //     ),
  //     dataIndex: 'action',
  //     align: 'center',
  //     width: 120,
  //     fixed: 'right',
  //     render: (_, record) => {
  //       const isDisable =
  //         !Object.keys(extensions).includes(record.ext) ||
  //         (record.status !== 'ACTIVE' && record.status !== 'Answered');
  //       return (
  //         <div className={styles.callFeatureWrapper}>
  //           <Button
  //             shape="circle"
  //             // disabled={record.event_name !== 'CHANNEL_ANSWER'}
  //             className={`${styles.callFeature} ${styles['head-phone']} ${
  //               isDisable && styles.disable
  //             }`}
  //             onClick={handleEavesdrop(record)}
  //             icon={<HeadPhone style={{ color: '#fff', fontSize: 14 }} />}
  //           />
  //           {/* <div className={`${styles.callFeature} ${styles.forward}`}>
  //             <Forward style={{ color: '#fff', fontSize: 14 }} />
  //           </div> */}
  //           {/* <div className={`${styles.callFeature} ${styles.hangup}`}>
  //             <PhoneFilled style={{ color: '#fff', fontSize: 14 }} />
  //           </div> */}
  //         </div>
  //       );
  //       // if (record.event_name === 'CHANNEL_ANSWER') {

  //       // }
  //       // return (
  //       //   <div className={styles.callFeatureWrapper}>
  //       //     {/* <div
  //       //       className={`${styles.callFeature} ${styles.phone}`}
  //       //       onClick={() => setPhoneModal(true)}
  //       //     >
  //       //       <PhoneFilled style={{ color: '#fff', fontSize: 14 }} />
  //       //     </div> */}
  //       //     {/* <div className={`${styles.callFeature} ${styles.close}`}>
  //       //       <CloseOutlined style={{ color: '#fff', fontSize: 14, fontWeight: 800 }} />
  //       //     </div> */}
  //       //   </div>
  //       // );
  //     },
  //   },
  // ];

  const columns = [
    {
      title: '#',
      render: (_, record, id) => <span>{id + 1}</span>,
      width: 40,
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Số nhánh</span>,
      dataIndex: 'recipientNumber',
      align: 'center',
      width: 100,
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Tên Agent</span>,
      dataIndex: 'recipientName',
      align: 'center',
      width: 100,
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>SĐT khách</span>,
      dataIndex: 'callNumber',
      align: 'center',
      width: 120,
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Tên khách</span>,
      dataIndex: 'callName',
      align: 'center',
      width: 120,
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Trạng thái</span>,
      dataIndex: 'status',
      align: 'center',
      width: 90,
      render: (text) => (
        <Tag color={['ACTIVE', 'Answered'].includes(text) ? 'default' : '#1eaf61'}>
          {STATUS_MONITOR_INBOUND[text]}
        </Tag>
      ),
    },
    // {
    //   title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Queue</span>,
    //   dataIndex: 'queue_name',
    //   align: 'center',
    //   width: 90,
    //   render: (text, record) => <span>{text}</span>,
    // },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Thời lượng</span>,
      dataIndex: 'time',
      align: 'center',
      width: 90,
      render: (text) => {
        // const timeFormat = moment(text).format('YYYY-MM-DD HH:mm:ss');
        // const timeParse = moment(text, 'YYYY-MM-DD HH:mm:ss').isValid();
        // const time = timeParse
        //   ? Math.round(moment().diff(moment(text).add(7, 'hours'), 'millisecond') / 1000)
        //   : moment().diff(moment(timeFormat), 'millisecond') / 1000;
        const time = moment().diff(moment(text), 'millisecond') / 1000;
        return <Timer duration={time} props={{ startImmediately: true }} />;
      },
    },
    {
      title: (
        <span style={{ color: '#1A1A1A', fontWeight: 'bold', background: '#fff' }}>Hành động</span>
      ),
      dataIndex: 'action',
      align: 'center',
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        const isDisable =
          !Object.keys(extensions).includes(record?.recipientNumber) ||
          (record.status !== 'ACTIVE' && record.status !== 'Answered');
        return (
          <div className={styles.callFeatureWrapper}>
            <Button
              shape="circle"
              // disabled={record.event_name !== 'CHANNEL_ANSWER'}
              className={`${styles.callFeature} ${styles['head-phone']} ${
                isDisable && styles.disable
              }`}
              onClick={handleEavesdrop(record)}
              icon={<HeadPhone style={{ color: '#fff', fontSize: 14 }} />}
            />
            {/* <div className={`${styles.callFeature} ${styles.forward}`}>
              <Forward style={{ color: '#fff', fontSize: 14 }} />
            </div> */}
            {/* <div className={`${styles.callFeature} ${styles.hangup}`}>
              <PhoneFilled style={{ color: '#fff', fontSize: 14 }} />
            </div> */}
          </div>
        );
        // if (record.event_name === 'CHANNEL_ANSWER') {

        // }
        // return (
        //   <div className={styles.callFeatureWrapper}>
        //     {/* <div
        //       className={`${styles.callFeature} ${styles.phone}`}
        //       onClick={() => setPhoneModal(true)}
        //     >
        //       <PhoneFilled style={{ color: '#fff', fontSize: 14 }} />
        //     </div> */}
        //     {/* <div className={`${styles.callFeature} ${styles.close}`}>
        //       <CloseOutlined style={{ color: '#fff', fontSize: 14, fontWeight: 800 }} />
        //     </div> */}
        //   </div>
        // );
      },
    },
  ];

  const onSelectQueue = async (e) => {
    // console.log(e);
    // console.log(queueCall);
    const queue = queueCall.find((item) => item.queue_extension === e).agent_id || [];
    setQueueSelected(e);
    setAgentByQueue(queue);
  };

  const onSelect = useCallback(
    async (e, typeSelect) => {
      if (typeSelect === 'queueSelected') {
        const listAgent =
          filter.listQueue.find((item) => item.queue_extension === e).agent_id || [];
        return setFilter({
          ...filter,
          [typeSelect]: e,
          listAgent: [{ agent_id: 'Tất cả' }, ...listAgent],
        });
      }
    },
    [filter],
  );

  const queue = [
    {
      label: '800',
      value: '800',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },
    {
      label: '4',
      value: '4',
    },
  ];

  const handleOkStatus = (status) => {
    return setFilterCall({ ...filterCall, status: status.join() });
  };

  const handleOkAgent = (agent) => {
    setAgentIbound(agent);
  };

  return (
    <div className={styles.container}>
      <Form className={styles.formWrapper}>
        <Row gutter={[24, 12]}>
          {/* <Col>
            <Form.Item label="Queue">
              <Select
                defaultValue="all"
                style={{ width: '12rem' }}
                onChange={(e) => onSelect(e, 'queueSelected')}
              >
                {filter.listQueue.map((item) => (
                  <Option value={item.queue_extension} key={item.queue_extension}>
                    {item.queue_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}
          {/* <Col>
            <Form.Item label="Hướng cuộc gọi">
              <SelectMultiple list={extensions} callback={handleOkStatus} />
            </Form.Item>
          </Col> */}
          <Col>
            <Form.Item label="Trạng thái">
              {/* {filter.listStatus.map((item) => (
                  <Option value={item.key} key={item.key}>
                    {item.name}
                  </Option>
                ))} */}
              <SelectMultiple list={STATUS_MONITOR_INBOUND_FILTER} callback={handleOkStatus} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        size="small"
        rowKey={(record) => record.session_id}
        columns={columns}
        pagination={false}
        search={false}
        options={false}
        scroll={{ x: 992, y: '45vh' }}
        dataSource={dataCallMonitor}
        // rowClassName={(record) => {
        //   if (record.event_name === 'CHANNEL_CREATE') return styles.ringing;
        //   if (record.event_name === 'CHANNEL_ANSWER') return styles.connected;
        //   return styles.abandon;
        // }}
        rowClassName={(record) => {
          if (record.status === 'RING_WAIT') return styles.ringing;
          if (record.status === 'ACTIVE') return styles.connected;
          if (record.status === 'Answered') return styles.connected;
          if (record.status === 'RINGING') return styles.ringing;
          return styles.abandon;
        }}
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
    </div>
  );
}

export default memo(CallMonitor);
