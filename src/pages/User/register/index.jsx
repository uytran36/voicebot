import React from 'react';
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Divider } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import PT from 'prop-types';
import styles from './index.less';
// import logo from '../../../assets/logo.svg';

const RegisterMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

RegisterMessage.propTypes = {
  content: PT.string.isRequired,
};

Register.propTypes = {
  submitting: PT.bool,
  dispatch: PT.func.isRequired,
};

Register.defaultProps = {
  submitting: false,
};

function Register(props) {
  const {  submitting } = props;
  const intl = useIntl();

  const handleSubmit = (values) => {
    const { dispatch } = props;
    return console.log({values})
  };

  return (
    <div className={styles.main}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <img
            alt="logo"
            className={styles.logo}
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/FTEL_Logo.svg/1280px-FTEL_Logo.svg.png"
          />
          <Col span={7}>
            <Divider className={styles.divider} />
          </Col>
        </div>
        <ProForm
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig: {
              submitText: 'Register',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              loading: submitting,
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
          <>
            <ProFormText
              name="first_name"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.first_name.placeholder',
                defaultMessage: 'Enter your first name',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.first_name.required"
                      defaultMessage="Enter your first name!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText
              name="last_name"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.last_name.placeholder',
                defaultMessage: 'Enter last username',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.last_name.required"
                      defaultMessage="Enter your last name!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={styles.prefixIcon} />
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.email.placeholder',
                defaultMessage: 'Enter your email',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.email.required"
                      defaultMessage="Enter your email!"
                    />
                  ),
                },
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.password.placeholder',
                defaultMessage: 'Enter your password',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.password.required"
                      defaultMessage="Please input a password!"
                    />
                  ),
                },
              ]}
            />
            <ProFormText.Password
              name="password2"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.password2.placeholder',
                defaultMessage: 'Confirm password',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.password2.required"
                      defaultMessage="Please input a password!"
                    />
                  ),
                },
              ]}
            />
          </>
          {status === 'error' && !submitting && (
            <RegisterMessage
              content={intl.formatMessage({
                id: 'pages.register.accountLogin.errorMessage',
                defaultMessage: 'Account or password error',
              })}
            />
          )}
        </ProForm>
      </Card>
    </div>
  );
}

export default connect()(Register);
