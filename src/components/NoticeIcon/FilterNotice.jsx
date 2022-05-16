import React, { useState, useEffect } from 'react';
import styles from './FilterNotice.less';
import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
const defaultNotifyCheckList = ['CALL', 'CHAT', 'CAMPAIN', 'ACCOUNT', 'CONFIG'];
const defaultStatusCheckList = ['READ', 'UNREAD'];
const notifyPlainOptions = [
  'Cuộc gọi',
  'Tin nhắn mới',
  'Chiến dịch',
  'Tài khoản',
  'Cấu hình hệ thống',
];
const statusPlainOptions = ['Chưa đọc', 'Đã đọc'];

const notiMapping = [
  { label: 'Cuộc gọi', value: 'CALL' },
  { label: 'Tin nhắn mới', value: 'CHAT' },
  { label: 'Chiến dịch', value: 'CAMPAIN' },
  { label: 'Tài khoản', value: 'ACCOUNT' },
  { label: 'Cấu hình hệ thống', value: 'CONFIG' },
];

const readMapping = [
  { label: 'Chưa đọc', value: 'UNREAD' },
  { label: 'Đã đọc', value: 'READ' },
];

const mapping = (noti, read) => {
  let notiTypes = [];
  let readTypes = [];
  noti.forEach((item) => {
    notiTypes.push(Array.from(notiMapping).find((i) => i.label === item).value);
  });
  read.forEach((item) => {
    readTypes.push(Array.from(readMapping).find((i) => i.label === item).value);
  });
  return { notiTypes, readTypes };
};

const remapping = (noti, read) => {
  let notiTypes = [];
  let readTypes = [];
  noti.forEach((item) => {
    notiTypes.push(Array.from(notiMapping).find((i) => i.value === item).label);
  });
  read.forEach((item) => {
    readTypes.push(Array.from(readMapping).find((i) => i.value === item).label);
  });
  return { notiTypes, readTypes };
};

const FilterNotice = ({ callback, values }) => {
  const { notiTypes, readTypes } = remapping(values.notiTypes, values.readTypes);
  const [notifyIndeterminate, setNotifyIndeterminate] = useState(true);
  const [statusIndeterminate, setStatusIndeterminate] = useState(true);
  const [notifyCheckList, setNotifyCheckList] = useState(notiTypes);
  const [statusCheckList, setStatusCheckList] = useState(readTypes);
  const [checkAllNotify, setCheckAllNotify] = useState(false);
  const [checkAllStatus, setCheckAllStatus] = useState(false);

  const onChangeNotify = (list) => {
    setNotifyCheckList(list);
    setNotifyIndeterminate(!!list.length && list.length < notifyPlainOptions.length);
    setCheckAllNotify(list.length === notifyPlainOptions.length);
  };

  const onChangeStatus = (list) => {
    setStatusCheckList(list);
    setStatusIndeterminate(!!list.length && list.length < statusPlainOptions.length);
    setCheckAllStatus(list.length === statusPlainOptions.length);
  };

  const onCheckAllNotify = (e) => {
    setNotifyCheckList(e.target.checked ? notifyPlainOptions : []);
    setNotifyIndeterminate(false);
    setCheckAllNotify(e.target.checked);
  };

  const onCheckAllStatus = (e) => {
    setStatusCheckList(e.target.checked ? statusPlainOptions : []);
    setStatusIndeterminate(false);
    setCheckAllStatus(e.target.checked);
  };

  useEffect(() => {
    callback(mapping(notifyCheckList, statusCheckList));
  }, [notifyCheckList, statusCheckList]);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Tùy chọn</div>
      <div className={styles.subTitle}>Loại thông báo</div>
      <Checkbox
        className={styles.checkBox}
        indeterminate={notifyIndeterminate}
        onChange={onCheckAllNotify}
        checked={checkAllNotify}
      >
        Tất cả
      </Checkbox>
      <CheckboxGroup
        className={styles.checkBoxGroup}
        options={notifyPlainOptions}
        value={notifyCheckList}
        onChange={onChangeNotify}
      />
      <div className={styles.subTitle}>Trạng thái</div>

      <Checkbox
        className={styles.checkBox}
        indeterminate={statusIndeterminate}
        onChange={onCheckAllStatus}
        checked={checkAllStatus}
      >
        Tất cả
      </Checkbox>
      <CheckboxGroup
        className={styles.checkBoxGroup}
        options={statusPlainOptions}
        value={statusCheckList}
        onChange={onChangeStatus}
      />
    </div>
  );
};

export default React.memo(FilterNotice);
