import { Avatar, List, notification } from 'antd';
import React from 'react';
import styles from './NoticeList.less';
import {
  MessageOutlined,
  PhoneOutlined,
  SoundOutlined,
  UserOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { HangUp } from '@/components/Icons';
import moment from 'moment';

const SUBTYPE = {
  SYS_ADD_ROLE: 'SYS_ADD_ROLE',
  SYS_DELETE_ROLE: 'SYS_DELETE_ROLE',
  SYS_PINFO_UPDATED: 'SYS_PINFO_UPDATED',
  SYS_PASSWORD_UPDATED: 'SYS_PASSWORD_UPDATED',
  SYS_MODULE_ADD_ACCESS: 'SYS_MODULE_ADD_ACCESS',
  SYS_MODULE_DELETE_ACCESS: 'SYS_MODULE_DELETE_ACCESS',
  CALL_MISSED: 'CALL_MISSED',
  CALL_ME_ACCEPTED_FW: 'CALL_ME_ACCEPTED_FW',
  CALL_ME_DENIED_FW: 'CALL_ME_DENIED_FW',
  CALL_ACCPET_FW: 'CALL_ACCPET_FW',
  CALL_DENIED_FW: 'CALL_DENIED_FW',
  CALL_ENQUEUE: 'CALL_ENQUEUE',
  CALL_DEQUEUE: 'CALL_DEQUEUE',
  CALL_CFG_PROXYGATEWAY: 'CALL_CFG_PROXYGATEWAY',
  CHAT_NEW_MSG: 'CHAT_NEW_MSG',
  CHAT_NEW_CONVO: 'CHAT_NEW_CONVO',
  CHAT_AGENT_CONVO: 'CHAT_AGENT_CONVO',
  CHAT_FW: 'CHAT_FW',
  CHAT_ACCEPTED_FW: 'CHAT_ACCEPTED_FW',
  CHAT_DENIED_FW: 'CHAT_DENIED_FW',
  CHAT_CFG_DELETE_ACCESS: 'CHAT_CFG_DELETE_ACCESS',
  CHAT_CFG_ADD_ACCESS: 'CHAT_CFG_ADD_ACCESS',
  VOICE_BEGIN: 'VOICE_BEGIN',
  VOICE_COMPLETE: 'VOICE_COMPLETE',
  MISSED_CALL: 'MISSED_CALL',
};
export const NoticeIcon = ({ type, subtype, read }) => {
  if (type === 'SYS') {
    return (
      <Avatar
        className={styles.avatar}
        icon={<UserOutlined />}
        style={{ color: 'white', backgroundColor: '#FFA800' }}
      />
    );
  }
  if (type === 'MISSED') {
    return (
      <>
        <span className={!read ? styles.dot : styles.invisible}></span>
        <Avatar className={styles.avatar} icon={<HangUp />} />
      </>
    );
  }
  if (type === 'VOICE') {
    return (
      <Avatar
        className={styles.avatar}
        icon={<SoundOutlined />}
        style={{ color: 'white', backgroundColor: '#FFA800' }}
      />
    );
  }
  if (type === 'CHAT') {
    if (subtype === SUBTYPE.CHAT_DENIED_FW)
      return (
        <Avatar
          className={styles.avatar}
          icon={<CloseOutlined />}
          style={{ color: 'white', backgroundColor: '#FF4D4F' }}
        />
      );
    if (subtype === SUBTYPE.CHAT_ACCEPTED_FW)
      return (
        <Avatar
          className={styles.avatar}
          icon={<CheckOutlined />}
          style={{ color: 'white', backgroundColor: '#1EAF61' }}
        />
      );
    return (
      <Avatar
        className={styles.avatar}
        icon={<MessageOutlined />}
        style={{ color: 'white', backgroundColor: '#1179CD' }}
      />
    );
  }
  return (
    <Avatar
      className={styles.avatar}
      icon={<PhoneOutlined />}
      style={{ color: 'white', backgroundColor: '#FFA800' }}
    />
  );
};
export const NoticeMessage = ({ subtype, messageData }) => {
  if (subtype === SUBTYPE.MISSED_CALL) {
    const { client, campaign } = messageData;
    if (client && campaign)
      return (
        <span>
          Bạn vừa có một cuộc gọi nhỡ từ khách hàng <strong>{client}</strong> trong chiến dịch{' '}
          <strong>{campaign}</strong>
        </span>
      );
  }
  if (subtype === SUBTYPE.CHAT_NEW_MSG) {
    const { count, customer } = messageData;
    if (count && customer)
      return (
        <span>
          Bạn nhận được {count} tin nhắn mới từ <strong>{customer}</strong>
        </span>
      );
    if (customer) {
      return (
        <span>
          Bạn có tin nhắn mới từ <strong>{customer}</strong>
        </span>
      );
    }
    if (count) {
      return <span>Bạn có {count} tin nhắn mới</span>;
    }
  }
  if (subtype === SUBTYPE.CHAT_ACCEPTED_FW) {
    const { channel, from } = messageData;
    if (channel && from)
      return (
        <span>
          <strong>{from}</strong> đã chấp nhận cuộc hội thoại trên kênh <strong>{channel}</strong>{' '}
          được chuyển tiếp từ bạn
        </span>
      );
  }
  if (subtype === SUBTYPE.CHAT_NEW_CONVO) {
    const { channel, count } = messageData;
    if (channel && count)
      return (
        <span>
          Bạn có {count} cuộc hội thoại mới từ <strong>{channel}</strong>
        </span>
      );
    if (channel)
      return (
        <span>
          Bạn có cuộc hội thoại mới từ <strong>{channel}</strong>
        </span>
      );
    if (count) return <span>Bạn có {count} cuộc hội thoại mới</span>;
  }
  if (subtype === SUBTYPE.CHAT_DENIED_FW) {
    const { from, channel } = messageData;
    if (from)
      return (
        <span>
          <strong>{from}</strong> đã từ chối cuộc hội thoại trên kênh <strong>{channel}</strong>{' '}
          được chuyển tiếp từ bạn
        </span>
      );
  }
  if (subtype === SUBTYPE.CHAT_FW) {
    const { from } = messageData;
    return (
      <span>
        Bạn có một tin nhắn chuyển tiếp từ <strong>{from}</strong>
      </span>
    );
  }
  if (subtype === SUBTYPE.CHAT_CFG_ADD_ACCESS) {
    return 'Bạn đã được thêm quyền access';
  }
  return <div>nothinghere</div>;
};
export const openPopUp = ({ handlePopUpClick, popUpNotice }) => {
  const leftIcon = <NoticeIcon type={popUpNotice.type} subtype={popUpNotice.subtype} />;
  const handleClick = () => {
    handlePopUpClick(popUpNotice);
    notification.close(popUpNotice.id);
  };
  notification.open({
    onClick: handleClick,
    closeIcon: <CloseOutlined onClick={handleClick} />,
    key: popUpNotice.id,
    message: (
      <List.Item.Meta
        className={styles.meta}
        avatar={leftIcon}
        style={{ cursor: 'pointer' }}
        title={
          <div className={styles.title}>
            {popUpNotice.title}
            <div className={styles.extra}>{popUpNotice.extra}</div>
          </div>
        }
        description={
          <div>
            <div className={styles.description}>
              <NoticeMessage subtype={popUpNotice.subtype} messageData={popUpNotice.messageData} />
            </div>
            <div
              className={styles.datetime}
              style={{ color: '#45A3EF', marginTop: '10px', fontSize: '12px' }}
            >
              {moment(popUpNotice.timestamp).fromNow() === 'vài giây trước' ||
              moment(popUpNotice.timestamp).diff(moment()) > 0
                ? 'Vừa xong'
                : moment(popUpNotice.timestamp).fromNow()}
            </div>
          </div>
        }
      />
    ),
  });
};
