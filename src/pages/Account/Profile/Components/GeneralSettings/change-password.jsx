import React from 'react';
import { Form, Input, Typography } from 'antd';
import styles from './styles.less';
import PasswordField from '@/components/PasswordField';

function ChangePassword() {
  return (
    <React.Fragment>
      <Form.Item
        className={styles['general-setting__input']}
        name="old-pass"
        label="Mật khẩu hiện tại"
        rules={[{
          required: true,
          message: 'Mật khẩu không được để trống'
        }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="Mật khẩu mới"
        className={styles['general-setting__input']}
      >
        <PasswordField style={{ marginBottom: 0 }} name="new-pass-1" />
        <Form.Item noStyle>
          <div className={styles['general-setting__input-note']}>
            <Typography.Text>Độ dài mật khẩu từ 8-32 ký tự. Mật khẩu nên bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt để tăng bảo mật</Typography.Text>
          </div>
        </Form.Item>
      </Form.Item>
      <Form.Item
        className={styles['general-setting__input']}
        name="new-pass-2"
        label="Xác nhận mật khẩu"
        rules={[{
          required: true,
          message: 'Mật khẩu không được để trống'
        }, ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('new-pass-1') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Mật khẩu không khớp'));
          },
        })]}

      >
        <Input.Password />
      </Form.Item>
    </React.Fragment>
  )
}

export default ChangePassword
