import React, { useState, useEffect, useMemo } from 'react';
import styles from './SettingNotifyList.less';
import { Switch, message } from 'antd';
import { connect } from 'umi';
import PT from 'prop-types';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import {
  requestGetNotificationSettings,
  requestUpdateNotificationSettings,
} from '@/services/notification';

SettingNotifyList.propTypes = {
  user: PT.shape({
    tokenGateway: PT.string,
  }).isRequired,
};

function SettingNotifyList(props) {
  const {
    user: { tokenGateway },
  } = props;
  const headers = useMemo(() => {
    return {
      Authorization: `${tokenGateway}`,
    };
  }, [tokenGateway]);

  const [callNotify, setCallNotify] = useState(false);
  const [newMsgNotify, setNewMsgNotify] = useState(false);
  const [campaignNotify, setCampaignNotify] = useState(false);
  const [accountNotify, setAccountNotify] = useState(false);
  const [systemCfgNotify, setSystemCfgNotify] = useState(false);
  const onSwitchAll = (e) => {
    if (e === true) {
      setCallNotify(true);
      setNewMsgNotify(true);
      setCampaignNotify(true);
      setAccountNotify(true);
      setSystemCfgNotify(true);
    } else {
      setCallNotify(false);
      setNewMsgNotify(false);
      setCampaignNotify(false);
      setAccountNotify(false);
      setSystemCfgNotify(false);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await requestGetNotificationSettings(headers);
        if (res.code === 200) {
          const setting = res.response.settings;
          setCallNotify(setting.call);
          setNewMsgNotify(setting.chat);
          setCampaignNotify(setting.campaign);
          setAccountNotify(setting.account);
          setSystemCfgNotify(setting.config);
        }
      } catch (err) {
        message.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const settingData = {
          on:
            !callNotify && !newMsgNotify && !campaignNotify && !accountNotify && !systemCfgNotify
              ? false
              : true,
          call: callNotify,
          chat: newMsgNotify,
          campaign: campaignNotify,
          account: accountNotify,
          config: systemCfgNotify,
        };
        await requestUpdateNotificationSettings(settingData, headers);
      } catch (err) {
        message.error(err);
      }
    })();
  }, [callNotify, newMsgNotify, campaignNotify, accountNotify, systemCfgNotify, headers]);
  return (
    <div className={styles.container}>
      <div className={styles.checkAll}>
        <p>Nhận thông báo</p>
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          onChange={onSwitchAll}
          checked={callNotify || newMsgNotify || campaignNotify || accountNotify || systemCfgNotify}
        />
      </div>
      <div className={styles.switch}>
        <p>Thông báo cuộc gọi</p>
        <Switch checked={callNotify} onChange={setCallNotify} />
      </div>
      <div className={styles.switch}>
        <p>Thông báo tin nhắn mới</p>
        <Switch checked={newMsgNotify} onChange={setNewMsgNotify} />
      </div>
      <div className={styles.switch}>
        <p>Thông báo chiến dịch</p>
        <Switch checked={campaignNotify} onChange={setCampaignNotify} />
      </div>
      <div className={styles.switch}>
        <p>Thông báo tài khoản</p>
        <Switch checked={accountNotify} onChange={setAccountNotify} />
      </div>
      <div className={styles.switch}>
        <p>Thông báo cấu hình hệ thống</p>
        <Switch checked={systemCfgNotify} onChange={setSystemCfgNotify} />
      </div>
    </div>
  );
}

export default connect(({ user }) => ({ user }))(SettingNotifyList);
