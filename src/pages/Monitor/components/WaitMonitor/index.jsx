import React from 'react';
import AdvanceTable from './AdvanceTable';
import Table from '@ant-design/pro-table';
import { CloseOutlined, LeftOutlined } from '@ant-design/icons';
import { Card, Col, Row, Tag, Typography } from 'antd';
import { ForwardSvg, ListeningSvg, PhoneSvg } from '../../svg';
import { useFetchQueueOverview } from './hooks/useFetchQueueOverview';
import { useFetchQueueDetail } from './hooks/useFetchQueueDetail';
import styles from './styles.less';
import moment from 'moment';
import PropTypes from 'prop-types';

const AgentColumnShapes = [
  {
    title: '#',
    align: 'left',
    render: (text, record, idx) => {
      return idx + 1;
    },
  },
  {
    title: 'Tên agent',
    dataIndex: 'username',
    align: 'left',
  },
  {
    title: 'Số máy nhánh',
    dataIndex: 'hotline',
    align: 'center',
  },
  {
    title: 'Thời gian thay đổi trạng thái',
    dataIndex: 'lastStatusChange',
    align: 'center',
    render: (text) => {
      return moment(text * 1000).format('DD/MM/YYYY HH:mm:ss');
    },
  },
  {
    title: 'Trạng thái agent',
    dataIndex: 'status',
    align: 'center',
    render: (text) => {
      switch (text) {
        case 'Available':
          return <Tag color="#1EAF61">Sẵn sàng</Tag>;
        case 'On Break':
          return <Tag color="#fa8c16">Đang nghỉ trưa</Tag>;
        case 'Logged Out':
          return <Tag>Không sẵn sàng</Tag>;
        default:
          break;
      }
    },
  },
  {
    title: 'Trạng thái cuộc gọi',
    dataIndex: 'state',
    align: 'center',
    render: (text) => {
      switch (text) {
        case 'Waiting':
          return <Tag color="#399dee">Đang rảnh</Tag>;
        case 'Receiving':
          return <Tag color="#1eaf61">Đang đổ chuông</Tag>;
        case 'In a queue call':
          return <Tag>Đã kết nối</Tag>;
        default:
          break;
      }
    },
  },
  {
    title: 'Số cuộc gọi nhỡ',
    dataIndex: 'noAnswerCount',
    align: 'center',
  },
  {
    title: 'Số cuộc trả lời',
    dataIndex: 'callsAnswered',
    align: 'center',
  },
];

const CallColumnShapes = [
  {
    title: '#',
    render: (text, record, idx) => {
      return idx + 1;
    },
  },
  {
    title: 'Tên khách',
    dataIndex: 'cidName',
  },
  {
    title: 'SĐT khách',
    dataIndex: 'cidNumber',
  },
  {
    title: 'Tên agent',
    dataIndex: 'username',
  },
  {
    title: 'Số nhánh',
    dataIndex: 'contact',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'state',
    align: 'center',
    render: (text) => {
      switch (text) {
        case 'Trying':
          return <Tag color="#1eaf61">Đang đỗ chuông</Tag>;
        case 'Abandoned':
          return <Tag color="#FA8C16">Abandoned</Tag>;
        case 'Answered':
          return <Tag>Đã kết nối</Tag>;
        default:
          break;
      }
    },
  },
  {
    title: 'Thời lượng',
    dataIndex: 'timeLast',
  },
  {
    title: 'Hành động',
    render: (text, record) => {
      if (record.callState === 'Trying') {
        return (
          <div style={{ display: 'flex', gap: '5px' }}>
            <div
              className={styles.icon}
              style={{
                background: record.callActions.first ? '#1eaf61' : '#4eaa79',
              }}
            >
              <PhoneSvg />
            </div>
            <div
              className={styles.icon}
              style={{
                background: record.callActions.second ? '#127ace' : '#88bce7',
              }}
            >
              <ForwardSvg />
            </div>
            <div
              className={styles.icon}
              style={{
                background: record.callActions.third ? '#ff4d4f' : '#fa6466',
              }}
            >
              <CloseOutlined style={{ color: 'white' }} />
            </div>
          </div>
        );
      }
      return (
        <div style={{ display: 'flex', gap: '5px' }}>
          <div
            className={styles.icon}
            style={{
              background: record.callActions.first ? '#127ace' : '#88bce7',
            }}
          >
            <ListeningSvg />
          </div>
          <div
            className={styles.icon}
            style={{
              background: record.callActions.second ? '#127ace' : '#88bce7',
            }}
          >
            <ForwardSvg />
          </div>
          <div
            className={styles.icon}
            style={{
              background: record.callActions.third ? '#ff4d4f' : '#fa6466',
            }}
          >
            <CloseOutlined style={{ color: 'white' }} />
          </div>
        </div>
      );
    },
  },
];

function WaitReport(props) {
  const { user } = props;
  const headers = {
    'X-Auth-Token': user.authToken,
    'X-User-Id': user.userId,
    Authorization: `${user.tokenGateway}`,
  };
  const [isDetailView, setDetailView] = React.useState(false);
  const [queueInfo, setQueueInfo] = React.useState(null);
  const [queueParams, setQueueParams] = React.useState({ query: 'all' });
  const [queues, overviewLoading] = useFetchQueueOverview(headers, queueParams);
  const [queueDetail, detailLoading] = useFetchQueueDetail(headers, undefined, queueInfo?.id);

  const handleSearch = (value) => {
    setQueueParams({ ...queueParams, query: value });
  };

  if (isDetailView) {
    return (
      <Card>
        <Row
          gutter={[5, 5]}
          style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', marginTop: '15px' }}
        >
          <Col onClick={() => setDetailView(false)} style={{ cursor: 'pointer' }}>
            <LeftOutlined />
          </Col>
          <Col>
            <Typography.Title level={5}>
              Hàng chờ:
              <span style={{ color: '#127ace' }}> {queueInfo.name}</span>
            </Typography.Title>
          </Col>
        </Row>
        <p
          style={{
            background: '#BDDEF9',
            color: 'black',
            textAlign: 'center',
            margin: '0',
            padding: '4px 16px',
          }}
        >
          Agent
        </p>
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
          dataSource={queueDetail.agents}
          columns={AgentColumnShapes}
          loading={detailLoading}
        />
        <p
          style={{
            background: '#BDDEF9',
            color: 'black',
            textAlign: 'center',
            margin: '15px 0 0 0',
            padding: '4px 16px',
          }}
        >
          Cuộc gọi vào
        </p>
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
          dataSource={queueDetail.calls}
          rowClassName={(record) => record.callState == 1 && 'light-green'}
          columns={CallColumnShapes}
          loading={detailLoading}
        />
      </Card>
    );
  }
  return (
    <Card>
      <AdvanceTable
        dataSource={queues}
        setDetailView={setDetailView}
        setQueueInfo={setQueueInfo}
        loading={overviewLoading}
        handleSearch={handleSearch}
      />
    </Card>
  );
}

WaitReport.propTypes = {
  user: PropTypes.shape({
    tokenHub: PropTypes.string,
    userId: PropTypes.string,
    authToken: PropTypes.string,
    tokenGateway: PropTypes.string,
  }).isRequired,
};

export default WaitReport;
