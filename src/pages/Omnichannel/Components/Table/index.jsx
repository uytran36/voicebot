import React, { useRef, useCallback } from 'react';
import Table from '@ant-design/pro-table';
import PT from 'prop-types';
import moment from 'moment';
import { connect, FormattedMessage } from 'umi';
import { DeleteOutlined } from '@ant-design/icons';
import { requestGetLiveChat } from '../../services';
import styles from './styles.less';

RenderTable.propTypes = {
  dispatch: PT.func.isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string
  }).isRequired,
  omnichannel: PT.shape({
    rowSelected: PT.instanceOf(Object),
  }).isRequired,
}

function RenderTable({ dispatch, user: { userId, authToken }, omnichannel: { rowSelected } }) {
  const columns = [
    {
      title: <FormattedMessage defaultMessage="Name" id="pages.omnichannel.col.name" />,
      dataIndex: 'fname',
      align: 'center',
      width: 80,
      sorter: true,
    },
    {
      title: <FormattedMessage defaultMessage="Department" id="pages.omnichannel.col.department" />,
      dataIndex: '',
      align: 'center',
      width: 80,
      sorter: true,
    },
    {
      title: <FormattedMessage defaultMessage="Served By" id="pages.omnichannel.col.servedBy" />,
      dataIndex: 'servedBy[username]',
      align: 'center',
      width: 80,
      sorter: true,
      render: (_, record) => {
        return record?.servedBy?.username
      }
    },
    {
      title: <FormattedMessage defaultMessage="Started At" id="pages.omnichannel.col.startedAt" />,
      dataIndex: 'ts',
      align: 'center',
      width: 80,
      sorter: true,
      render: text => {
        return moment(text).format('MM/DD/YYYY HH:mm:ss')
      }
    },
    {
      title: (
        <FormattedMessage defaultMessage="Last Message" id="pages.omnichannel.col.lastMessage" />
      ),
      dataIndex: 'lastMessage[msg]',
      key: 'lastMessage[msg]',
      align: 'center',
      width: 80,
      sorter: true,
      render: (_, record) => {
        return moment(record?.lastMessage?.ts).format('MM/DD/YYYY HH:mm:ss')
      }
    },
    {
      title: <FormattedMessage defaultMessage="Status" id="pages.omnichannel.col.status" />,
      dataIndex: 'open',
      align: 'center',
      width: 80,
      sorter: true,
      render: text => {
        return (text && typeof text === 'boolean') ? 'Open' : 'Close'
      }
    },
    {
      title: <FormattedMessage defaultMessage="Remove" id="pages.omnichannel.col.remove" />,
      align: 'center',
      width: 80,
      render: (_, record) => {
        if(record?.open) {
          return false
        }
        return <DeleteOutlined onClick={() => {console.log('clicked')}} />
      }
    },
  ];

  // ref
  const actionRef = useRef();

  // evnet
  const onRowClick = useCallback((e, record) => {
    if(e.target.closest('.anticon')) {
      return null;
    }
    dispatch({
      type: 'omnichannel/execution',
      payload: {
        isShowInfo: true,
        rowSelected: record,
        isShowForm: false,
      }
    })
    return null;
  }, [])

  return (
    <Table
      scroll={{ x: true }}
      columns={columns}
      actionRef={actionRef}
      rowKey={record => record._id}
      // pagination={{
      //   defaultPageSize: 10,
      //   showTotal: false,
      // }}
      pagination={{
        defaultPageSize: 10,
        showTotal: false,
        size: 'default',
        // showSizeChanger: false,
      }}
      size="small"
      rowClassName={record => rowSelected._id === record._id && styles['row-selected']}
      request={async () => {
        const res = await requestGetLiveChat({
          userId,
          authToken,
        }, {
          // count: 25,
          sort: {"ts":-1}
        });
        if (res.success) {
          return {
            data: res.rooms,
            total: res.total
          }
        }
        return {
          data: [],
          total: 0
        }
      }}
      onRow={(record, rowIndex) => ({
        onClick: e => onRowClick(e, record)
      })}
    />
  );
}

export default connect(({ user, omnichannel }) => ({ user, omnichannel }))(RenderTable);
