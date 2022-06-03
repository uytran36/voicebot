import moment from 'moment';
import Timer from '@/components/Timer';
import { renderStatus, renderStatusCalling } from '@/constants/call-center';
import { Typography } from 'antd';
import { CallInboundIcon, CallOutboundIcon } from '@/components/Icons';

const { Text } = Typography;

export const CallHistoryTableHeader = [
  {
    title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Hướng cuộc gọi</span>,
    dataIndex: 'direction',
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
    // render: (text, record) => (record.direction !== 'local' ? text : '-'),
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
    // render: (text, record) => (record.direction !== 'local' ? text : '-'),
  },
  {
    title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Thời gian bắt đầu</span>,
    dataIndex: 'start_stamp',
    align: 'left',
    render: (text) => moment(text).format('DD-MM-YYYY HH:mm:ss'),
    width: 100,
  },
  {
    title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Thời lượng đàm thoại</span>,
    dataIndex: 'duration',
    align: 'left',
    width: 100,
    render: (text, record) => {
      if (text !== '-' && Number.isInteger(+text)) {
        return <Timer duration={text}></Timer>;
      }
      return '-';
    },
  },
  {
    title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Kết quả</span>,
    dataIndex: 'status',
    align: 'left',
    width: 100,
    render: (text) => renderStatusCalling(text),
  },
  {
    title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Ghi chú</span>,
    dataIndex: 'note',
    align: 'left',
    ellipsis: true,
    width: 100,
    render: (text) => (
      <Text style={{ width: 100 }} ellipsis={{ tooltip: text }}>
        {text}
      </Text>
    ),
  },
];
