import { renderStatus, renderStatusCalling } from '@/constants/call-center';
import { Tag, Tooltip, Typography } from 'antd';
import moment from 'moment';
import Timer from 'react-compound-timer';
import { CallInboundIcon, CallOutboundIcon } from '@/components/Icons';

const { Paragraph, Text } = Typography;

export const tagName = {
  all: 'all',
  chat: 'chat',
  call: 'call',
  campaign: 'campaign',
};

export const sourceHistory = {
  zalo: 'ZALO',
  facebook: 'FACEBOOK',
  livechat: 'LIVECHAT',
  callcenter: 'Call Center',
};

export const allInteractiveTableHeader = [
  {
    title: 'STT',
    render: (_, __, key) => `${key + 1}`,
    key: 'customer_id',
    width: 100,
  },
  {
    title: 'Kênh tiếp nhận',
    dataIndex: 'source',
    key: 'source',
    width: 100,
  },
  {
    title: 'Thời gian',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 100,
    render: (text) => (moment(text).isValid() ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '-'),
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
    width: 100,
    render: (text) => {
      if (text !== '-') {
        return (
          <Text style={{ width: 100 }} ellipsis={{ tooltip: text }}>
            {text}
          </Text>
        );
      }
      return '-';
    },
  },
];

export const chatTableHeader = [
  {
    title: 'Kênh chat',
    dataIndex: 'source',
    key: 'source',
    width: 100,
  },
  {
    title: 'ID',
    dataIndex: 'roomId',
    key: 'roomId',
    width: 100,
  },
  {
    title: 'Agent tiếp nhận',
    dataIndex: 'agent_name',
    key: 'agent_name',
    width: 100,
  },
  // {
  //   title: 'Rating',
  //   dataIndex: 'test2',
  // },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
    width: 100,
    render: (text) => {
      if (text !== '-') {
        return (
          <Text style={{ width: 100 }} ellipsis={{ tooltip: text }}>
            {text}
          </Text>
        );
      }
      return '-';
    },
  },
];

export const callCenterTableHeader = [
  // {
  //   title: 'Agent tiếp nhận',
  //   dataIndex: 'destination_number',
  //   key: 'destination_number',
  //   width: 100,
  // },
  {
    title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Hướng cuộc gọi</span>,
    dataIndex: 'callType',
    align: 'center',
    width: 100,
    render: (text) =>
      text === 'outbound' ? (
        <>
          <CallOutboundIcon /> Gọi ra{' '}
        </>
      ) : text === 'local' ? (
        'Nội bộ'
      ) : (
        <>
          <CallInboundIcon /> Gọi vào{' '}
        </>
      ),
  },
  {
    title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Số gọi đi</span>,
    dataIndex: 'caller_id_number',
    align: 'left',
    width: 100,
  },
  {
    title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Tên người gọi</span>,
    dataIndex: 'caller_name',
    align: 'left',
    width: 100,
  },
  {
    title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Số máy nhận</span>,
    dataIndex: 'destination_number',
    align: 'left',
    width: 100,
  },
  {
    title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Tên người nhận</span>,
    dataIndex: 'destination_name',
    align: 'left',
    width: 100,
  },
  {
    title: 'Thời gian bắt đầu',
    dataIndex: 'start_stamp',
    key: 'start_stamp',
    width: 100,
    render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss'),
  },
  {
    title: 'Thời lượng gọi',
    dataIndex: 'duration',
    key: 'duration',
    width: 100,
    render: (text, record) => {
      if (text !== '-') {
        return (
          <Timer
            startImmediately={false}
            initialTime={text * 1000}
            formatValue={(value) => `${value < 10 ? `0${value}` : value}`}
          >
            {() => {
              return (
                <>
                  <span>
                    <Timer.Hours
                      formatValue={(value) => `${value < 10 ? `0${value} : ` : `${value} : `} `}
                    />
                  </span>
                  <span>
                    <Timer.Minutes
                      formatValue={(value) => `${value < 10 ? `0${value} : ` : `${value} : `} `}
                    />
                  </span>
                  <span>
                    <Timer.Seconds />
                  </span>
                </>
              );
            }}
          </Timer>
        );
      }
    },
  },
  {
    title: 'Kết quả cuộc gọi',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    render: (text) => renderStatusCalling(text),
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    width: 100,
    render: (text, record) => {
      if (record?.CallQueueHistory?.note?.length > 0) {
        return (
          <Text
            style={{ width: 100 }}
            ellipsis={{ tooltip: record?.CallQueueHistory?.note[0]?.text }}
          >
            {record?.CallQueueHistory?.note[0]?.text}
          </Text>
        );
      }

      return '-';
    },
  },
];

export const campaignTableHeader = [
  {
    title: 'Chiến dịch',
    dataIndex: 'test2',
    key: 'test2',
  },
  {
    title: 'Mã cuộc gọi',
    dataIndex: 'test2',
    key: 'test2',
  },
  {
    title: 'Thời gian bắt đầu',
    dataIndex: 'test2',
    key: 'test2',
  },
  {
    title: 'Thời lượng',
    dataIndex: 'test2',
    key: 'test2',
  },
  {
    title: 'Kết quả cuộc gọi',
    dataIndex: 'test2',
    key: 'test2',
    render: (text) => <Tag color="#2F54EB">{text}</Tag>,
  },
];
