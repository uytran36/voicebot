import { Tag } from 'antd';

export const statusCall = {
  NORMAL_CLEARING: 'Thành công',
  CALL_REJECTED: 'Bị từ chối',
  NO_USER_RESPONSE: 'Không đổ chuông',
  USER_BUSY: 'Máy bận',
  NO_ANSWER: 'Không bắt máy',
  INVALID_NUMBER_FORMAT: 'Sai số',
  SUBSCRIBER_ABSENT: 'Sai số',
  UNLOCATED_NUMBER: 'Ngoài vùng phủ sóng',
  NORMAL_TEMPORARY_FAILURE: 'Lỗi hệ thống',
  NETWORK_OUT_OF_ORDER: 'Lỗi hệ thống',
  INTERWORKING: 'Lỗi hệ thống',
  RECOVERY_ON_TIMER_EXPIRE: 'Lỗi hệ thống',
  BREAKCAPABILITY_NOTAUTH: 'Không xác thực nhà mạng',
  ORIGINATOR_CANCEL: 'Dừng cuộc gọi',
  BLIND_TRANSFER: 'Chuyển cuộc gọi',
  ATTENDED_TRANSFER: 'Chuyển có xác nhận',
  REDIRECTION_TO_NEW_DESTINATION: 'Chuyển hướng',
};

export const STATUS_CALL = {
  SUCCESS: 'Thành công',
  FAILURE: 'Thất bại khác',
  MISSED_CALL: 'Nhỡ trong hàng chờ',
  NO_ANSWER: 'Không trả lời',
  BUSY: 'Máy bận',
  REJECTED: 'Khách hàng từ chối',
  CANCELLED: 'Dừng cuộc gọi',
};

export const STATUS_MONITOR_INBOUND = {
  ACTIVE: 'Đã kết nối',
  RING_WAIT: 'Đang đỗ chuông',
  Answered: 'Đã kết nối',
  RINGING: 'Đang đỗ chuông',
};

export const STATUS_MONITOR_INBOUND_FILTER = {
  ACTIVE: 'Đã kết nối',
  RINGING: 'Đang đỗ chuông',
};

export const DIRECTION_CALL = {
  local: 'Nội bộ',
  inbound: 'Cuộc gọi vào',
  outbound: 'Cuộc gọi ra',
};

export const renderStatus = (status = '') => {
  const colorTag =
    status === 'NORMAL_CLEARING'
      ? 'geekblue'
      : status === 'CALL_REJECTED'
      ? 'red'
      : status === 'ORIGINATOR_CANCEL'
      ? ''
      : 'orange';
  return <Tag color={colorTag}>{statusCall[status] || 'Nguyên nhân khác'}</Tag>;
};

export const renderStatusCalling = (status = '') => {
  const colorTag =
    status === 'SUCCESS'
      ? 'geekblue'
      : status === 'FAILURE'
      ? 'red'
      : status === 'CANCELLED'
      ? ''
      : 'orange';
  return <Tag color={colorTag}>{STATUS_CALL[status] || 'Nguyên nhân khác'}</Tag>;
};
