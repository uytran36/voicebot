import React from 'react';
import PT from 'prop-types';
import { Row, Col, Typography } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import styles from './styles.less';

const dumb = () => {};

FormEmail.propTypes = {
  toggleSubmitEmail: PT.func,
}

FormEmail.defaultProps = {
  toggleSubmitEmail: dumb,
}

function FormEmail({ toggleSubmitEmail }) {
  const handleSubmit = React.useCallback((values) => {
    console.log(values);
    toggleSubmitEmail(true);
  }, [toggleSubmitEmail])

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
        <Row justify='center' style={{ alignItems: 'center', flexDirection: 'column' }}>
          <Col span={24}>
            <img alt="logo" className={styles.logo} src='/forgot-password.png' />
          </Col>
          <Col span={24}>
            <div style={{
              textAlign: 'center'
            }}>
              <Typography.Title level={3}>
                Bạn quên mật khẩu?
              </Typography.Title>
              <Typography.Text>
                Nhập email đã đăng ký tài khoản, chúng tôi sẽ giúp bạn lấy lại mật khẩu.
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
          style={{ maxWidth: '368px', margin: '0 auto'}}
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig: {
              submitText: 'Gửi',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              // loading: status.submitting,
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
          <ProFormText
            label={<span className={styles.field}>Email</span>}
            name="email"
            fieldProps={{
              size: 'large',
            }}
            validateTrigger={['onSubmit', 'onBlur']}
            rules={[
              {
                required: true,
                type: "email",
                message: 'Giá trị bạn vừa nhập không phải là email',
              },
            ]}
          />
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

export default FormEmail;
