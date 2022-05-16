import React from 'react';
import PT from 'prop-types';
import { Row, Col, Typography, Form, Input } from 'antd';
import ProForm from '@ant-design/pro-form';
import PasswordField from '@/components/PasswordField';
import styles from './styles.less';

const dumb = () => { };

ChangePassword.propTypes = {
  cb: PT.func,
}

ChangePassword.defaultProps = {
  cb: dumb,
}

function ChangePassword({ cb }) {
  const handleSubmit = React.useCallback((values) => {
    console.log(values);
    cb();
  }, [cb])

  return (
    <Row
      gutter={[12, 12]}
      justify='center'
      align='center'
      flex-direction='column'
      className={styles.body}
    >
      <Col
        lg={{ span: 24 }}
        md={{ span: 24 }}
        sm={{ span: 24 }}
        xs={{ span: 24 }}
      >
        <Row gutter={[0, 16]} justify='center' style={{ alignItems: 'center', flexDirection: 'column' }}>
          <Col span={24}>
            <img alt="logo" className={styles.logo} src='/forgot-password2.png' />
          </Col>
          <Col span={24}>
            <div style={{
              textAlign: 'center'
            }}>
              <Typography.Title level={3}>
                Đặt lại mật khẩu
              </Typography.Title>
              <Typography.Text>
                Mã xác nhận đã được gửi tới địa chỉ email của bạn.
              </Typography.Text>
            </div>
          </Col>
        </Row>
      </Col>
      <Col
        lg={{ span: 24 }}
        md={{ span: 24 }}
        sm={{ span: 24 }}
        xs={{ span: 24 }}
        style={{ paddingTop: 20 }}
      >
        <ProForm
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig: {
              submitText: 'Đặt lại mật khẩu',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              // loading: status.submitting,
              htmlType: 'submit',
              size: 'large',
              style: {
                width: '100%',
              },
            },
          }}
          onFinish={(values) => {
            handleSubmit(values);
            return Promise.resolve();
          }}
        >
          <Form.Item
            className={styles['general-setting__input']}
            name="code"
            label="Mã xác nhận"
            rules={[{
              required: true,
              message: 'Mã xác nhận không được để trống'
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
              <Form.Item noStyle>
                <div className={styles['general-setting__input-note']}>
                  <Typography.Text>Độ dài mật khẩu từ 8-32 ký tự. Mật khẩu nên bao gồm chữ in hoa, chữ thường, số và ký tự đặc biệt để tăng bảo mật</Typography.Text>
                </div>
              </Form.Item>
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
          {/* {status.status === 'error' && !status.submitting && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: 'Account or password error',
              })}
            />
          )} */}
        </ProForm>
      </Col>
    </Row>
  )
}

export default ChangePassword;
