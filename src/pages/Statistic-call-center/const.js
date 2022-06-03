// import Timer from '@/components/Timer';
import moment from 'moment';
import Timer from 'react-compound-timer';

export const OverViewTableHeader = [
  {
    title: 'Loại cuộc gọi',
    dataIndex: 'type-call',
    key: 'type-call',
  },
  {
    title: 'Số lượng cuộc gọi',
    dataIndex: 'call-amount',
    key: 'call-amount',
    align: 'center',
    isSum: true,
    render: (text) => {
      return <span style={{ textAlign: 'center', margin: 0 }}>{text}</span>;
    },
  },
  {
    title: 'Tỷ lệ cuộc gọi',
    dataIndex: 'percentage',
    key: 'percentage',
    align: 'center',
    isSum: true,
    isPercent: true,
    render: (text) => {
      return <span style={{ textAlign: 'center', margin: 0 }}>{text?.toFixed(2)}%</span>;
    },
  },
  {
    title: 'Thời gian',
    dataIndex: 'duration',
    key: 'duration',
    align: 'center',
    isSum: true,
    isTimeMinute: true,
    render: (text, record) => {
      if (text !== '-' && Number.isInteger(+text)) {
        return moment.utc(text * 1000).format('HH:mm:ss');
      }
      return '-';
    },
  },
];

export const CallInboundTableHeader = [
  {
    title: 'Loại cuộc gọi',
    dataIndex: 'type-call',
    key: 'type-call',
  },
  {
    title: 'Số lượng cuộc gọi',
    dataIndex: 'call-amount',
    key: 'call-amount',
    align: 'center',
    isSum: true,
    render: (text) => {
      return <span style={{ textAlign: 'center', margin: 0 }}>{text}</span>;
    },
  },
  {
    title: 'Tỷ lệ',
    dataIndex: 'percentage',
    key: 'percentage',
    isSum: true,
    isPercent: true,
    align: 'center',
    render: (text) => {
      return <span style={{ textAlign: 'center', margin: 0 }}>{(+text)?.toFixed(2)}%</span>;
    },
  },
];
