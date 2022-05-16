import React from 'react';
import PT from 'prop-types';
import {  message, Tabs, Form, Button } from 'antd';
import styles from './styles.less';
// import { requestUpdateCurrentUser, requestUploadAvatar } from '../../service';
import UserInfo from './user-info';
import ChangePassword from './change-password';
import { requestChangePassword } from '@/services/auth';

const changePassword = async (data, headers = {}) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    const res = await requestChangePassword(data, headers);
    if (res.message === "SUCCESS") {
      hide();
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    message.warning('Không thể cập nhật mật khẩu');
    return false;
  }
}

GeneralSettings.propTypes = {
  currentUser: PT.instanceOf(Object).isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
};

function GeneralSettings(props) {
  const { headers, currentUser } = props;
  const [submitting, setSubmitting] = React.useState(false);
  
  const handleChangePassword = React.useCallback(async (values) => {
    setSubmitting(true);
    const result = await changePassword({
      "password": values['new-pass-1'],
      "passwordOld": values['old-pass']
    }, headers);
    setSubmitting(false);
    if (result) {
      message.success('Cập nhật mật khẩu thành công')
    }
  }, [headers]);

  return (
    <div className={styles.card}>
      <Tabs>
        <Tabs.TabPane key='infomation' tab='Thông tin tài khoản'>
          <Form initialValues={currentUser}
            labelCol={{ xs: 24, md: 8, lg: 8 }}
            wrapperCol={{ xs: 24, md: 16, lg: 14 }}
          >
            <UserInfo />
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane key='changePassword' tab='Thay mật khẩu'>
          <Form 
            initialValues={currentUser}
            labelCol={{ xs: 24, md: 8, lg: 8 }}
            wrapperCol={{ xs: 24, md: 16, lg: 14 }}
            onFinish={handleChangePassword}
          >
            <ChangePassword />
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button loading={submitting} type='primary' htmlType='submit'>Lưu thay đổi</Button>
            </div>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}

export default GeneralSettings;
