import React, { useState, useCallback, useRef, useEffect } from 'react';
import PT from 'prop-types';
import Table from '@ant-design/pro-table';
import uniq from 'lodash/uniq';
import {
  PlusOutlined,
  // EditOutlined,
  // DeleteOutlined,
  // PlayCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi';
import { Form, Input, Button, Select, Tag, Popconfirm, Row, Col, message } from 'antd';
import functions from './functions';
import styles from './styles.less';
import FormAddNewCampaign from '../Form/addNewCampaign';
import {
  PhoneFilled,
  DeleteFilled,
  PlaySquareFilled,
  EditFilled,
  DeleteOutlined,
  PauseOutlined,
  PlaySquareOutlined,
} from '@ant-design/icons';
import { Edit, Delete, Play, Phone, Search, Pause } from '@/components/Icons';
import { checkPermission, VoiceBot } from '@/utils/permission';

RenderTable.propTypes = {
  onClickStep: PT.func.isRequired,
  dispatch: PT.func.isRequired,
  getRecord: PT.func.isRequired,
  updateCampaign: PT.func.isRequired,
  deleteCampaign: PT.func.isRequired,
  handleOnClickCallDemo: PT.func.isRequired,
  user: PT.shape({
    username: PT.string,
    permissions: PT.instanceOf(Array).isRequired
  }).isRequired,
  headers: PT.instanceOf(Object).isRequired,
};

const formatDateTime = 'DD/MM/YYYY HH:mm';
const formatDate = 'DD/MM/YYYY';

// const renderStyleStatus = (status) => {
//   switch (status) {
//     case 'INPROGRESS':
//       return 'blue';
//     case 'PENDING':
//       return 'orange';
//     case 'COMPLETED':
//       return 'green';
//     default:
//       return 'geekblue';
//   }
// };
const renderStyleStatus = (status) => {
  switch (status) {
    case 'PENDING':
      // return '#F6803B';
      return (
        <span style={{ color: '#F6803B', fontWeight: 'bold' }}>
          <FormattedMessage id="pages.campaign-management.status.pending" />
        </span>
      );
    case 'COMPLETED':
      // return '#16B14B';
      return (
        <span style={{ color: '#16B14B', fontWeight: 'bold' }}>
          <FormattedMessage id="pages.campaign-management.status.completed" />
        </span>
      );
    case 'RUNNING':
      // return '#001444';
      return (
        <span style={{ color: '#001444', fontWeight: 'bold' }}>
          <FormattedMessage id="pages.campaign-management.status.running" />
        </span>
      );
    default:
      // return '#313541';
      return (
        <span style={{ color: '#313541', fontWeight: 'bold' }}>
          <FormattedMessage id="pages.campaign-management.status.schedule" />
        </span>
      );
  }
};

function RenderTable({
  onClickStep,
  dispatch,
  getRecord,
  updateCampaign,
  deleteCampaign,
  user,
  handleOnClickCallDemo,
  headers,
}) {
  const [valueSearch, setValueSearch] = useState('');
  const [status, setStatus] = useState('');
  const [listStatus, setListStatus] = useState(['all']);
  const [listRecord, setListRecord] = useState([]);
  const actionRef = useRef();

  // useEffect(() => {
  //   setInterval(() => {
  //     if (actionRef?.current) {
  //       actionRef?.current?.reload();
  //     }
  //   }, 5000);
  // }, [])

  // hàm xử lý logic/ component sẽ được định nghĩa dưới đây
  // const handleOpenForm = useCallback(
  //   (record, cb) => {
  //     return (
  //       <FormAddNewCampaign getValues={cb}>
  //         <div
  //           style={{
  //             marginTop: 8,
  //             marginRight: 16,
  //             display: 'flex',
  //             justifyContent: 'flex-end',
  //             alignItems: 'center',
  //           }}
  //         >
  //           <Button
  //             onClick={() => {
  //               handleChangeStateModal(false);
  //             }}
  //           >
  //             { <FormattedMessage id="pages.campaign-management.exit" /> }
  //           </Button>
  //           <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
  //           { <FormattedMessage id="pages.campaign-management.save" /> }
  //           </Button>
  //         </div>
  //       </FormAddNewCampaign>
  //     );
  //   },
  //   [handleChangeStateModal],
  // );

  // hàm sự kiện sẽ được định nghĩa dưới đây
  const handleOnClickToAddNew = useCallback(() => {
    dispatch({
      type: 'campaign/execution',
      payload: {
        openForm: true,
      },
    });
    // handleChangeStateModal(true);
    // dispatch({
    //   type: 'campaign/execution',
    //   payload: {
    //     initialValues: {},
    //   },
    // });
    // handleChangeElementModal({
    //   title: formatMessage({ id: 'pages.campaign-management.create.campaign' }),
    //   bodyStyle: {
    //     padding: '12px 24px 16px 24px',
    //   },
    //   content: handleOpenForm({}, async (values) => {
    //     setNameCampaign(values.name);
    //     handleChangeStateModal(false);
    //     onClickStep(1);
    //     toggleForm(true);
    //   }),
    //   footer: {
    //     footer: null,
    //     onCancel: () => handleChangeStateModal(false),
    //   },
    // });
  }, [dispatch]);

  // handle edit, view report
  const handleOnClickToEdit = useCallback(
    (record, step) => {
      dispatch({
        type: 'campaign/fetchListCampaigns',
        payload: record._id,
        headers,
      });
      dispatch({
        type: 'campaign/execution',
        payload: {
          openForm: true,
        },
      });
      onClickStep(step, 'custom');
    },
    [dispatch, onClickStep],
  );

  // ~~ others ~~
  const columns = [
    {
      // title: <FormattedMessage id="pages.campaign-management.numericalOrder" />,
      dataIndex: 'index',
      valueType: 'index',
      align: 'center',
      // render: (_, record,) => listRecord.indexOf(record) + 1,
    },
    {
      title: <FormattedMessage id="pages.campaign-management.name" />,
      dataIndex: ['campaignStrategies', 'st_name'],
      align: 'left',
      render: (text, record) => (
        <span
          className={styles.nameCampaign}
          onClick={() => {
            getRecord({ id: record.omniContactListBase });
            handleOnClickToEdit(record, 5);
          }}
        >
          {text}
        </span>
      ),
    },
    // {
    //   title: <FormattedMessage id="pages.campaign-management.id" />,
    //   dataIndex: 'campaign_id',
    //   align: 'center',
    // },
    // ma chien dich + ten chien dich chua co trong res api
    {
      title: <FormattedMessage id="pages.campaign-management.start.time" />,
      dataIndex: ['campaignStrategies', 'st_begin'],
      align: 'center',
      render: (text) => (text !== '-' ? moment(text).subtract(7, 'hours').format(formatDate) : ''),
    },
    {
      title: <FormattedMessage id="pages.campaign-management.finish.time" />,
      dataIndex: ['campaignStrategies', 'st_end'],
      align: 'center',
      render: (text) => (text !== '-' ? moment(text).subtract(7, 'hours').format(formatDate) : ''),
    },
    {
      title: <FormattedMessage id="pages.campaign-management.creator" />,
      dataIndex: 'createby',
      align: 'center',
    },
    {
      title: <FormattedMessage id="pages.campaign-management.created.time" />,
      dataIndex: ['campaignStrategies', 'createtime'],
      align: 'center',
      render: (text) => moment(text).format(formatDateTime),
    },
    {
      title: <FormattedMessage id="pages.campaign-management.status" />,
      dataIndex: 'runner_status',
      align: 'center',
      // render: (text) => <Tag color={renderStyleStatus(text)}>{text}</Tag>,
      // render: (text) => <span style={{ 'color': renderStyleStatus(text), 'fontWeight': 'bold' }}>{text}</span>,
      render: (text) => renderStyleStatus(text),
    },
    {
      title: <FormattedMessage id="pages.campaign-management.action" />,
      align: 'center',
      render: (_, record) => {
        return (
          <div className={styles.renderIcon}>
            {/* <Phone onClick={() => handleOnClickCallDemo(record?._id)} /> */}
            <PhoneFilled
              style={{ color: '#16B14B' }}
              onClick={() => handleOnClickCallDemo(record?._id)}
            />
            {/* <Edit
              onClick={() => {
                getRecord({ id: record.omniContactListBase });
                handleOnClickToEdit(record);
              }}
            /> */}
            <EditFilled
              hidden={checkPermission(user?.permissions, VoiceBot.configVoicebot)}
              style={{ color: '#C6BE07' }}
              onClick={() => {
                getRecord({ id: record.omniContactListBase });
                handleOnClickToEdit(record, 3);
              }}
            />
            <Popconfirm
              title={<FormattedMessage id="pages.campaign-management.status.message" />}
              onConfirm={async () => {
                const data = {
                  runner_status: ['RUNNING', 'SCHEDULED'].includes(record.runner_status)
                    ? 'PENDING'
                    : 'SCHEDULED',
                  updateby: user?.username || 'unknown',
                };
                const res = await updateCampaign(data, record._id);
                if (res?.success) {
                  message.success('Update status thành công.');
                  actionRef.current.reload();
                }
              }}
              okText={<FormattedMessage id="pages.campaign-management.confirm.yes" />}
              cancelText={<FormattedMessage id="pages.campaign-management.confirm.no" />}
            >
              {['running', 'scheduled'].includes(record.runner_status.toLowerCase()) ? (
                // <Pause />
                <PauseOutlined style={{ color: '#F27227' }} />
              ) : (
                // <Play />
                <PlaySquareOutlined style={{ color: '#3E85BF' }} />
              )}
            </Popconfirm>
            <Popconfirm
              title={<FormattedMessage id="pages.campaign-management.delete.message" />}
              onConfirm={async () => {
                const res = await deleteCampaign(record._id);
                if (res.success) {
                  actionRef.current.reload();
                }
              }}
              okText={<FormattedMessage id="pages.campaign-management.confirm.yes" />}
              cancelText={<FormattedMessage id="pages.campaign-management.confirm.no" />}
            >
              {/* <Delete /> */}
              <DeleteOutlined style={{ color: '#CC0025' }} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const statusFilterCampaign = {
    all: <FormattedMessage id="pages.campaign-management.status.all" />,
    running: <FormattedMessage id="pages.campaign-management.status.running" />,
    pending: <FormattedMessage id="pages.campaign-management.status.pending" />,
    completed: <FormattedMessage id="pages.campaign-management.status.completed" />,
    scheduled: <FormattedMessage id="pages.campaign-management.status.schedule" />,
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.content}>
          <Button>{<FormattedMessage id="pages.campaign-management.campaign" />}</Button>
          <Button>{<FormattedMessage id="pages.campaign-management.scenario" />}</Button>
        </div>
        <div className={styles.content}>
          <Select
            defaultValue="all"
            style={{ width: '100px' }}
            onChange={(value) => setStatus(value)}
          >
            {listStatus.map((elm) => {
              return (
                <Select.Option key={elm} value={elm}>
                  {statusFilterCampaign[elm.toLocaleLowerCase()]}
                </Select.Option>
              );
            })}
          </Select>
          <Button onClick={handleOnClickToAddNew}>
            <PlusOutlined />
            <span>{<FormattedMessage id="pages.campaign-management.add" />}</span>
          </Button>
        </div>
      </div>
      <Table
        rowKey={() => Math.random().toString(36).substring(7)}
        columns={columns}
        options={false}
        search={false}
        // pagination={{
        //   defaultPageSize: 10,
        //   showTotal: false,
        //   size: 'default',
        //   // showSizeChanger: false,
        // }}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
          size: 'default',
          // showSizeChanger: false,
        }}
        size="small"
        scroll={{ x: true }}
        params={{ search: valueSearch, status }}
        request={async ({ search }) => {
          const result = await functions.fetchListCampaign(headers);
          setListStatus(uniq(['all', ...result.map((elm) => elm.runner_status.toLowerCase())]));
          setListRecord(result);
          return {
            data: result.filter((elm) => {
              if (search) {
                return elm?.campaignStrategies?.st_name?.includes(search);
              }
              if (status.length > 0 && !status?.includes('all')) {
                return elm?.runner_status?.toLowerCase() === status.toLowerCase();
              }
              return elm;
            }),
          };
        }}
        actionRef={actionRef}
        headerTitle={
          <div className={styles.searchWrapper}>
            <div className={styles.search}>
              <Form onFinish={(values) => setValueSearch(values.search)} layout="inline">
                <Form.Item name="search">
                  <Input
                    allowClear
                    onChange={(e) => e.target.value.length === 0 && setValueSearch('')}
                  />
                </Form.Item>
                <Button
                  style={{
                    background: '#0D99B8',
                    textAlign: 'center',
                    color: '#fff',
                  }}
                  htmlType="submit"
                >
                  <Search width={11} height={11} style={{ marginRight: 7 }} />
                  <span>{<FormattedMessage id="pages.campaign-management.search" />}</span>
                </Button>
              </Form>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default RenderTable;
