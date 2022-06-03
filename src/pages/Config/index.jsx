import React, { useCallback, useEffect } from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'umi';
import { Card, Typography, Space, Button } from 'antd';
import Form from './Components/Form';
import styles from './styles.less';

Config.propTypes = {
  dispatch: PT.func.isRequired,
  voicebot: PT.shape({
    isOpenForm: PT.bool,
  }).isRequired,
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string
  }).isRequired,
};

function Config({
  dispatch,
  voicebot: {
    isOpenForm,
    sipProfile
  },
  user,
}) {
  const { userId, authToken, tokenGateway } = user
  const handleClickBtnAdd = useCallback(() => {
    dispatch({
      type: 'voicebot/execution',
      payload: {
        isOpenForm: true,
      }
    })
  }, [])
  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`
  }

  useEffect(() => {
    dispatch({
      type: 'voicebot/getSipProfile',
      headers
    })
  }, [dispatch])

  return (
    <Card className={styles.card}>
      {isOpenForm && (
        <Form user={user} sipProfile={sipProfile} />
      )}
      {!isOpenForm && (
        <Space direction="vertical">
          <Typography.Title>Voicebot</Typography.Title>
          <div>
            <Typography.Title><FormattedMessage id="pages.config.welcome" defaultMessage="Chào mừng bạn đến với Voicebot" /></Typography.Title>
            <div>
              <Button type='primary' className={styles.btn} onClick={handleClickBtnAdd}>
                <PlusOutlined />
                <Typography.Text style={{ color: '#fff' }}><FormattedMessage id="pages.config.add" defaultMessage="Thêm hồ sơ Voicebot" /></Typography.Text>
              </Button>
              <div className={styles.desc}>
                <Typography.Text style={{ color: '#000' }}><FormattedMessage id="pages.config.configure" defaultMessage="Hãy thiết lập hồ sơ Voicebot đầu tiên của bạn" /></Typography.Text>
              </div>
            </div>
          </div>
        </Space>
      )}
    </Card>
  );
}

export default connect(({ voicebot, user }) => ({ voicebot, user }))(Config);
