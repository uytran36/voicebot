import { Tag } from 'antd';
import PT from 'prop-types';
import React, { useMemo } from 'react';
import { connect, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import Diapad from './Diapad';
import Status from './Status';
import NoticeIconView from './NoticeIconView';
import { CALL_CENTER_MANAGEMENT, checkPermission } from '@/utils/permission';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight = (props) => {
  const {
    theme,
    layout,
    call,
    isShowPhoneCall,
    userAgentModel,
    updateAgentStatus,
    handleSendDTMF,
    callManagement,
    permissions,
  } = props;
  let className = styles.right;

  const isNumberPad = useMemo(() => {
    return checkPermission(permissions, CALL_CENTER_MANAGEMENT.numberPad);
  }, [permissions]);
  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        onSearch={(value) => {
          console.log('input', value);
        }}
      />
      {isNumberPad && (
        <Status userAgentModel={userAgentModel} updateAgentStatus={updateAgentStatus} />
      )}
      {isNumberPad && (
        <Diapad
          call={call}
          isShowPhoneCall={isShowPhoneCall}
          handleSendDTMF={handleSendDTMF}
          callManagement={callManagement}
        />
      )}
      <NoticeIconView />
      <Avatar menu />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      {/* <SelectLang className={styles.action} /> */}
    </div>
  );
};

GlobalHeaderRight.propTypes = {
  theme: PT.string.isRequired,
  layout: PT.string.isRequired,
  call: PT.func.isRequired,
  isShowPhoneCall: PT.bool.isRequired,
  userAgentModel: PT.instanceOf(Object).isRequired,
  updateAgentStatus: PT.func.isRequired,
  handleSendDTMF: PT.func.isRequired,
  callManagement: PT.instanceOf(Object).isRequired,
  permissions: PT.array.isRequired,
};

export default connect(({ settings, user }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  permissions: user.currentUser.permissions,
}))(GlobalHeaderRight);
