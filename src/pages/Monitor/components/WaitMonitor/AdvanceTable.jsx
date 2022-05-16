import React from 'react';
import Table from '@ant-design/pro-table';
import styles from './styles.less';
import PT from 'prop-types';
import { Input, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

AdvanceTable.propTypes = {
  dataSource: PT.any,
  setDetailView: PT.func,
  setQueueInfo: PT.func,
  handleSearch: PT.func,
};

const fakeDetailInfo = {
  agent: [
    {
      name: 'QuangDDT16',
      branchNumber: '18093',
      stateChangeTime: '523:55:41',
      agentState: 1,
      callState: 1,
      missedCall: 20,
      answeredCall: 20,
    },
    {
      name: 'QuangDDT16',
      branchNumber: '18093',
      stateChangeTime: '523:55:41',
      agentState: 1,
      callState: 0,
      missedCall: 20,
      answeredCall: 20,
    },
    {
      name: 'QuangDDT16',
      branchNumber: '18093',
      stateChangeTime: '523:55:41',
      agentState: 0,
      callState: 2,
      missedCall: 20,
      answeredCall: 20,
    },
    {
      name: 'QuangDDT16',
      branchNumber: '18093',
      stateChangeTime: '523:55:41',
      agentState: 3,
      callState: 2,
      missedCall: 20,
      answeredCall: 20,
    },
    {
      name: 'QuangDDT16',
      branchNumber: '18093',
      stateChangeTime: '523:55:41',
      agentState: 1,
      callState: 1,
      missedCall: 20,
      answeredCall: 20,
    },
    {
      name: 'QuangDDT16',
      branchNumber: '18093',
      stateChangeTime: '523:55:41',
      agentState: 1,
      callState: 2,
      missedCall: 20,
      answeredCall: 20,
    },
    {
      name: 'QuangDDT16',
      branchNumber: '18093',
      stateChangeTime: '523:55:41',
      agentState: 2,
      callState: 1,
      missedCall: 20,
      answeredCall: 20,
    },
  ],
  call: [
    {
      name: 'Nguyễn Văn Nam',
      phoneNumber: '0595709822',
      agentName: 'Nguyễn Văn Nam',
      branchNumber: '87224',
      callState: 1,
      timeLast: '00:00:00',
    },
    {
      name: 'Nguyễn Thiện Văn',
      phoneNumber: '0978914132',
      agentName: 'Nguyễn Thiện Văn',
      branchNumber: '87224',
      callState: 2,
      timeLast: '00:08:56',
    },
    {
      name: 'Nguyễn Thiện Văn',
      phoneNumber: '0978914132',
      agentName: 'Nguyễn Thiện Văn',
      branchNumber: '87224',
      callState: 2,
      timeLast: '00:08:56',
    },
    {
      name: 'Nguyễn Thiện Văn',
      phoneNumber: '0978914132',
      agentName: 'Nguyễn Thiện Văn',
      branchNumber: '87224',
      callState: 3,
      timeLast: '00:08:56',
    },
    {
      name: 'Nguyễn Thiện Văn',
      phoneNumber: '0978914132',
      agentName: 'Nguyễn Thiện Văn',
      branchNumber: '87224',
      callState: 1,
      timeLast: '00:08:56',
    },
    {
      name: 'Nguyễn Thiện Văn',
      phoneNumber: '0978914132',
      agentName: 'Nguyễn Thiện Văn',
      branchNumber: '87224',
      callState: 2,
      timeLast: '00:08:56',
    },
  ],
};

function AdvanceTable({ setDetailView, setQueueInfo, dataSource, handleSearch, ...rest }) {
  const handleSeeDetailClick = (info) => {
    setDetailView(true);
    setQueueInfo(info);
  };

  return (
    <Table
      dataSource={dataSource}
      search={false}
      options={false}
      scroll={{ x: 992 }}
      className={styles.table}
      cardProps={{
        bodyStyle: { padding: '5px 20px' },
      }}
      pagination={{
        showTotal: false,
        size: 'default',
      }}
      headerTitle={<Typography.Title level={5}>Danh sách hàng chờ</Typography.Title>}
      toolBarRender={() => [
        <Input
          key="search"
          placeholder="Nhập từ khóa"
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => {
            if (e.target.value.length === 0) {
              handleSearch('all');
            } else {
              handleSearch(e.target.value);
            }
          }}
        />,
      ]}
      columns={[
        {
          title: '#',
          align: 'left',
          className: styles['blue-light'],
          render: (text, record, idx) => {
            return idx + 1;
          },
        },
        {
          dataIndex: 'name',
          title: 'Hàng chờ',
          align: 'left',
          width: 200,
          className: styles['blue-light'],
          render: (text, record) => {
            return (
              <div style={{ cursor: 'pointer' }} onClick={() => handleSeeDetailClick(record)}>
                {text}
              </div>
            );
          },
        },
        {
          key: 'agent',
          title: 'Agent',
          align: 'center',
          className: styles['purple'],
          children: [
            {
              title: 'Tổng số',
              dataIndex: 'totalAgentCount',
              align: 'center',
              className: styles['light-purple'],
            },
            {
              title: 'Đang online',
              dataIndex: 'onlineAgentCount',
              align: 'center',
              className: styles['light-purple'],
            },
            {
              title: 'Đang rảnh',
              dataIndex: 'idleAgentCount',
              align: 'center',
              className: styles['light-purple'],
            },
          ],
        },
        {
          key: 'call',
          title: 'Cuộc gọi',
          align: 'center',
          className: styles['orange'],
          children: [
            {
              title: 'Đã kết nối',
              dataIndex: 'connectedCallCount',
              className: styles['light-orange'],
              align: 'center',
            },
            {
              title: 'Đang đỗ chuông',
              dataIndex: 'ringingCallCount',
              className: styles['light-orange'],
              align: 'center',
            },
          ],
        },
        {
          key: 'customer',
          title: 'Khách hàng',
          align: 'center',
          className: styles['mint'],
          children: [
            {
              title: 'Đang chờ',
              dataIndex: 'waitingCustomerCount',
              className: styles['light-mint'],
              align: 'center',
            },
            {
              title: 'Abandoned',
              dataIndex: 'abandonedCustomerCount',
              className: styles['light-mint'],
              align: 'center',
            },
          ],
        },
      ]}
      {...rest}
    />
  );
}

export default AdvanceTable;
