import { Select, Typography } from 'antd';
import Table from '@ant-design/pro-table';
import { Input, Card } from 'antd';
import styles from './styles.less';
import React from 'react';
import PropTypes from 'prop-types';
import { SearchOutlined } from '@ant-design/icons';
import { useFetchTableData } from './hooks/useFetchTableData';
import { requestChangeAgentStatus } from '@/services/call-center';
const { Option } = Select;

const loginOptions = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Online', value: 'online' },
  { label: 'Offline', value: 'offline' },
];

const stateOptions = [
  {
    label: 'Tất cả',
    value: 'all',
  },
  { label: 'Đang rảnh', value: 'Waiting' },
  { label: 'Đang đỗ chuông', value: 'Receiving' },
  { label: 'Đã kết nối', value: 'In a queue call' },
];

const statusOptions = [
  {
    label: 'Tắt cả',
    value: 'all',
  },
  { label: 'Sẵn sàng', value: 'Available' },
  { label: 'Không sẵn sàng', value: 'Logged Out' },
  { label: 'Đang nghỉ trưa', value: 'On Break' },
];

const StatusSelect = (props) => {
  const { status, Uuid, headers } = props;
  const [state, setState] = React.useState(status);

  React.useEffect(() => {
    setState(status);
  }, [status]);
  const handleChange = (value) => {
    const request = async () => {
      const response = await requestChangeAgentStatus(headers, undefined, {
        status: value,
        agentUuid: Uuid,
      });
      if (response.msg === 'SUCCESS') {
        console.log('success');
        setState(value);
        return;
      }
      console.log('fail');
    };
    request();
  };
  return (
    <Select
      value={state}
      onChange={handleChange}
      style={{ width: '100%' }}
      className={state === 'Available' ? styles['Available'] : styles['Busy']}
    >
      <Option value="Available">Sẵn sàng</Option>
      <Option value="Logged Out">Không sẵn sàng</Option>
      <Option value="On Break">Nghỉ trưa </Option>
    </Select>
  );
};

const columnShapes = [
  {
    title: '#',
    render: (text, record, id) => <span>{id + 1}</span>,
    width: 40,
  },
  {
    title: <b>Tên agent</b>,
    dataIndex: 'username',
    align: 'left',
  },

  {
    title: <b>Số máy nhánh</b>,
    dataIndex: 'hotline',
    align: 'center',
  },
  {
    title: <b>Email</b>,
    dataIndex: 'email',
    align: 'left',
    // width: 200,
  },
  {
    title: <b>Số điện thoại</b>,
    dataIndex: 'phone',
    align: 'left',
    // width: 80,
  },
  {
    title: <b>Vai trò</b>,
    dataIndex: 'role',
    align: 'center',
  },
  {
    title: <b>Trạng thái đăng nhập</b>,
    dataIndex: 'login',
    align: 'center',
    width: '130px',
    render: (text) => {
      switch (text) {
        case 'online':
          return (
            <div style={{ color: '#1EAF61', position: 'relative' }}>
              <div className={styles.loginStateIcon} style={{ background: '#1EAF61' }} />
              Online
            </div>
          );
        default:
          return (
            <div style={{ color: 'black', position: 'relative' }}>
              <div className={styles.loginStateIcon} style={{ background: '#bfbfbf' }} />
              Offline
            </div>
          );
      }
    },
  },
  {
    title: <b>Trạng thái cuộc gọi</b>,
    dataIndex: 'state',
    align: 'center',
    width: '135px',
    render: (text) => {
      switch (text) {
        case 'Waiting':
          return (
            <div
              style={{
                background: '#399DEE',
                color: 'white',
                borderRadius: '2px',
                padding: '1px 8px',
                width: 'fit-content',
              }}
            >
              Đang rảnh
            </div>
          );
        case 'Receiving':
          return (
            <div
              style={{
                background: '#1EAF61',
                color: 'white',
                borderRadius: '2px',
                padding: '1px 8px',
                width: 'fit-content',
              }}
            >
              Đang đổ chuông
            </div>
          );
        case 'In a queue call':
          return (
            <div
              style={{
                background: '#F5F5F5',
                color: 'rgba(0, 0, 0, 0.85)',
                borderRadius: '2px',
                padding: '1px 8px',
                width: 'fit-content',
              }}
            >
              Đã kết nối
            </div>
          );
        default:
          break;
      }
    },
  },
  {
    title: <b>Trạng thái agent</b>,
    dataIndex: 'status',
    align: 'center',
    width: '160px',
    render: (text, record) => {
      return <StatusSelect status={text} Uuid={record.agentUuid} />;
    },
  },
];

function AgentReport({ user }) {
  const headers = {
    'X-Auth-Token': user.authToken,
    'X-User-Id': user.userId,
    Authorization: `${user.tokenGateway}`,
  };

  const [params, setParams] = React.useState({
    login: 'all',
    state: 'all',
    status: 'all',
    query: 'all',
  });
  const [tick, setTick] = React.useState(0);
  const [tableData, isLoading] = useFetchTableData(headers, params, tick);

  const handleLoginChange = (value) => {
    setParams({ ...params, login: value });
  };

  const handleStateChange = (value) => {
    setParams({ ...params, state: value });
  };

  const handleStatusChange = (value) => {
    setParams({ ...params, status: value });
  };
  const handleInputOnChange = (e) => {
    setParams({ ...params, query: e });
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick + 1);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [tick]);

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
        dataSource={tableData.map((data) => {
          return { ...data, headers: headers };
        })}
        headerTitle={<Typography.Title level={5}> Danh sách Agent</Typography.Title>}
        toolBarRender={() => [
          <Select
            placeholder="Trạng thái đăng nhâp"
            options={loginOptions}
            onChange={handleLoginChange}
            key="login"
          />,
          <Select
            placeholder="Trạng thái cuộc goi"
            dropdownMatchSelectWidth={false}
            options={stateOptions}
            onChange={handleStateChange}
            key="state"
          />,
          <Select
            placeholder="Trạng thái agent"
            allowClear
            options={statusOptions}
            dropdownMatchSelectWidth={false}
            onChange={handleStatusChange}
            key="status"
          />,

          <Input
            key="search"
            placeholder="Nhập từ khóa"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              if (e.target.value.length === 0) {
                handleInputOnChange('all');
              } else {
                handleInputOnChange(e.target.value);
              }
            }}
          />,
        ]}
        loading={isLoading}
        columns={columnShapes}
        scroll={{ x: 1300 }}
      />
    </Card>
  );
}

StatusSelect.propTypes = {
  status: PropTypes.string.isRequired,
  Uuid: PropTypes.string.isRequired,
};

AgentReport.propTypes = {
  user: PropTypes.shape({
    tokenHub: PropTypes.string,
    userId: PropTypes.string,
    authToken: PropTypes.string,
    tokenGateway: PropTypes.string,
  }).isRequired,
};

export default AgentReport;
