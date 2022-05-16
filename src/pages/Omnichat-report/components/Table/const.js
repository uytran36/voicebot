import { Tag, Typography, Avatar } from 'antd';
import styles from './styles.less';
import moment from 'moment';
import { round } from '@umijs/deps/compiled/lodash';
import api from '@/api';

const { Text } = Typography;

const dateTime = 'DD-MM-YYYY HH:mm:ss';

const caculatePercenter = (field, record) =>
  (parseInt(record[field], 10) /
    (parseInt(record.facebook, 10) + parseInt(record.zalo, 10) + parseInt(record.livechat, 10))) *
    100 || 0;

export const ChatReportTableHeader = [
  {
    title: '#',
    key: 'id',
    render: (_, __, key) => `${key + 1}`,
    width: 10,
  },
  {
    title: 'Thời gian',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Facebook',
    dataIndex: ['facebook'],
    key: 'facebook',
    align: 'center',
    render: (text, record) => {
      return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <div>{text}</div>
          <Tag color="orange">{`${caculatePercenter('facebook', record).toFixed(2)}%`}</Tag>
        </div>
      );
    },
  },
  {
    title: 'Zalo',
    dataIndex: ['zalo'],
    key: 'zalo',
    align: 'center',
    render: (text, record) => (
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div>{text}</div>
        <Tag color="cyan">{`${caculatePercenter('zalo', record).toFixed(2)}%`}</Tag>
      </div>
    ),
  },
  {
    title: 'LiveChat',
    dataIndex: ['livechat'],
    key: 'livechat',
    align: 'center',
    render: (text, record) => (
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <div>{text}</div>
        <Tag color="purple">{`${caculatePercenter('livechat', record).toFixed(2)}%`}</Tag>
      </div>
    ),
  },
  {
    title: 'Tổng',
    dataIndex: 'value',
    key: 'note',
    align: 'center',
  },
];

const roundDecimal = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const ResolveReportTableHeader = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    className: styles['light-blue'],
    fixed: 'left',
    render: (_, __, key) => `${key + 1}`,
    width: 10,
  },
  {
    title: 'Thời gian',
    dataIndex: 'date',
    key: 'date',
    fixed: 'left',
    className: styles['light-blue'],
    width: 80,
  },
  {
    title: 'Facebook',
    dataIndex: 'facebook',
    key: 'facebook',
    align: 'center',
    className: styles['light-orange'],
    render: (_, record) => <Tag color="orange">{`${record?.facebook}%`}</Tag>,
    width: 80,
  },
  {
    title: 'Zalo',
    dataIndex: 'zalo',
    key: 'zalo',
    align: 'center',
    className: styles['dark-candy'],
    render: (_, record) => <Tag color="cyan">{`${record?.zalo}%`}</Tag>,
    width: 80,
  },
  {
    title: 'LiveChat',
    dataIndex: 'livechat',
    key: 'livechat',
    align: 'center',
    className: styles['dark-purple'],
    render: (_, record) => <Tag color="purple">{`${record?.livechat}%`}</Tag>,
    width: 80,
  },
];

export const DetailDurationReportTableHeader = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    className: styles['light-blue'],
    render: (_, __, key) => `${key + 1}`,
    fixed: 'left',
    width: 10,
  },
  {
    title: 'Thời gian',
    dataIndex: 'date',
    key: 'date',
    className: styles['light-blue'],
    fixed: 'left',
    width: 80,
  },
  {
    title: 'Facebook',
    dataIndex: 'facebook',
    key: 'facebook',
    align: 'center',
    className: styles['light-orange'],
    width: 80,
  },
  {
    title: 'Zalo',
    dataIndex: 'zalo',
    key: 'zalo',
    align: 'center',
    className: styles['dark-candy'],
    width: 80,
  },
  {
    title: 'LiveChat',
    dataIndex: 'livechat',
    key: 'livechat',
    align: 'center',
    className: styles['dark-purple'],
    width: 80,
  },
  {
    title: 'Tổng',
    dataIndex: 'value',
    key: 'livechat',
    align: 'center',
    className: styles['light-blue'],
    width: 80,
    render: (text, record) => record.facebook + record.livechat + record.zalo,
  },
];

export const DetailChatReportTableHeader = [
  {
    title: '#',
    dataIndex: 'id',
    key: 'id',
    render: (_, __, key) => `${key + 1}`,
  },
  {
    title: 'ID hội thoại',
    dataIndex: 'roomId',
    key: 'roomId',
  },
  {
    title: 'Kênh chat',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Agent tiếp nhận',
    dataIndex: 'agentName',
    key: 'agentName',
  },
  {
    title: 'Thời gian bắt đầu',
    dataIndex: 'createdDate',
    key: 'createdDate',
    render: (text) => moment(text).isValid() && moment(text).format(dateTime),
  },
  {
    title: 'Thời gian kết thúc',
    dataIndex: 'closedDate',
    key: 'closedDate',
    render: (text) => moment(text).isValid() && moment(text).format(dateTime),
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
    render: (text) => (
      <Text style={{ width: 100 }} ellipsis={{ tooltip: text }}>
        {text}
      </Text>
    ),
  },
];

export const DetailConversationReportTableHeader = [
  {
    title: 'Người gửi',
    dataIndex: 'senderName',
    key: 'senderName',
  },
  {
    title: 'Nội dung',
    dataIndex: 'text',
    key: 'text',
    render: (text, record) => {
      if (
        record?.attachments &&
        record.attachments?.length > 0 &&
        record.attachments[0]?.payloadUrl
      ) {
        return <Avatar shape="square" size={64} src={`${record.attachments[0]?.payloadUrl}`} />;
      }
      return text;
    },
  },
  {
    title: 'Thời gian',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (text) => moment(text).isValid() && moment(text).format(dateTime),
  },
];

export const AgentHistoryTableHeader = [
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Họ và tên',
    align: 'left',
    width: 100,
    fixed: 'left',
    className: styles['light-blue'],
  },
  {
    key: 'phone',
    dataIndex: 'phone',
    title: 'Số điện thoại',
    align: 'left',
    width: 100,
    fixed: 'left',
    className: styles['light-blue'],
  },
  {
    key: 'fb',
    // dataIndex: 'facebook',
    title: 'Facebook',
    width: 140,
    className: styles['dark-orange'],
    children: [
      {
        key: 'received',
        dataIndex: 'fb_processing',
        title: 'Đã nhận',
        align: 'center',
        width: 70,
        className: styles['light-orange'],
      },
      {
        key: 'done',
        dataIndex: 'fb_resolve',
        title: 'Đã giải quyết',
        align: 'center',
        width: 70,
        className: styles['light-orange'],
        render: (text, record) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <div>{text}</div>
              <Tag color="orange">{`${record.fb_percent}%`}</Tag>
            </div>
          );
        },
      },
    ],
  },
  {
    key: 'zalo',
    // dataIndex: 'zalo',
    title: 'Zalo',
    width: 140,
    className: styles['dark-candy'],
    children: [
      {
        key: 'received',
        dataIndex: 'zalo_processing',
        title: 'Đã nhận',
        align: 'center',
        width: 70,
        className: styles['light-candy'],
      },
      {
        key: 'done',
        dataIndex: 'zalo_resolve',
        title: 'Đã giải quyết',
        align: 'center',
        width: 70,
        className: styles['light-candy'],
        render: (text, record) => (
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <div>{text}</div>
            <Tag color="cyan">{`${record.zalo_percent}%`}</Tag>
          </div>
        ),
      },
    ],
  },
  {
    key: 'livechat',
    // dataIndex: 'livechat',
    title: 'Livechat',
    width: 140,
    className: styles['dark-purple'],
    children: [
      {
        key: 'received',
        dataIndex: 'livechat_processing',
        title: 'Đã nhận',
        align: 'center',
        width: 70,
        className: styles['light-purple'],
      },
      {
        key: 'done',
        dataIndex: 'livechat_resolve',
        title: 'Đã giải quyết',
        align: 'center',
        width: 70,
        className: styles['light-purple'],
        render: (text, record) => (
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <div>{text}</div>
            <Tag color="purple">{`${record.livechat_percent}%`}</Tag>
          </div>
        ),
      },
    ],
  },
];
