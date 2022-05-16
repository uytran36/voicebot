import React from 'react';
import { Alert, message, Card } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import PT from 'prop-types';
import styles from './index.less';
// import debounce from 'lodash/debounce';
import { requestLogin, requestLogin2 } from '@/services/auth';
import { requestGetUserInfo } from '@/services/user-management';
import { get, set } from '@/utils/local-storage';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import api from '@/api';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

LoginMessage.propTypes = {
  content: PT.string.isRequired,
};

const onLogin = async ({ provider_token, email }) => {
  try {
    const res = await requestLogin2({ provider_token, email });
    if (res?.msg === 'Success') {
      return res.dt;
    }
    throw new Error('ERROR~');
  } catch (err) {
    return null;
  }
};

const getUserData = async (accessToken, userId) => {
  try {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const res = await requestGetUserInfo(headers);
    if (res?.msg === 'Success') {
      return res.dt;
    }
    throw new Error('ERROR~');
  } catch (err) {
    return null;
  }
};

Login.propTypes = {
  submitting: PT.bool,
  userLogin: PT.instanceOf(Object),
  dispatch: PT.func.isRequired,
  history: PT.shape({
    push: PT.func,
  }).isRequired,
};

Login.defaultProps = {
  submitting: false,
  userLogin: {},
};

function Login(props) {
  const intl = useIntl();

  const { dispatch, history } = props;
  // const { status, type: loginType } = userLogin;
  // const [type, setType] = useState('account');
  const [loginCounter, setLoginCounter] = React.useState(get('countLogin') || '0');
  const [status, setStatus] = React.useState({
    submitting: false,
    status: '',
  });

  const handleSubmit = async (values) => {
    setStatus({
      submitting: true,
      status: '',
    });

    if (api.ENV === 'local') {
      window.location = `${api.UMI_API_BASE_URL}/user/sso_login?redirect_uri=${
        api.REDIRECT_URI_PROTOCOL || 'https'
      }%3A%2F%2F${api.UMI_DOMAIN}%3A${api.PORT}%2Fmainpage`;
    } else {
      window.location = `https://login.microsoftonline.com/${api.TENANT_NAME}/oauth2/authorize?client_id=${api.CLIENT_ID}&response_type=code&response_mode=form_post&redirect_uri=${api.UMI_API_URL}&sso_reload=true&state=123`;
    }

    const user = await onLogin({
      provider_token: 'TokenFromProvider',
      // email: 'uytkg@fpt.com.vn',
      email: values.email,
    });

    /**
     * if login successful, we must request license and save all user infomation to redux
     * otherwise show error message and setLoginCounter + 1
     * */
    if (user) {
      console.log(user);
      const { is_new, access_token, refresh_token, user_id } = user;
      const userData = await getUserData(access_token, user_id);

      const payload = {
        // currentUser: userInfo.data.me,
        // ext: userInfo.data.me.ipPhone,
        // userId: userInfo.data.userId,
        // tokenGateway: `${type} ${tokenGateway}`,
        refreshToken: refresh_token,
        // licenseModule: [],
        // license: false,
      };
      dispatch({
        type: 'user/save',
        payload: { ...payload, userData: userData[0], is_new: is_new },
      });

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);

          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = '/';
          return null;
        }
      }
      history.push(redirect || '/');
      set('rid', refresh_token); // save refresh token to localstorage;
      set('access_token', access_token); // save tokenGateway token to localstorage;
      set('user_id', user_id);
      return null;
    }

    setStatus({
      status: 'error',
      submitting: false,
    });
    return null;
  };

  return (
    <div className={styles.main}>
      <Card className={styles.card}>
        <div className={styles.title}>
          <h2>Đăng nhập</h2>
        </div>
        <ProForm
          className={styles.loginForm}
          initialValues={{
            autoLogin: true,
          }}
          submitter={{
            searchConfig: {
              submitText: 'Đăng nhập',
            },
            render: (_, dom) => dom.pop(),
            submitButtonProps: {
              loading: status.submitting,
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
              label={<span className={styles.field}>Email</span>}
              name="email"
              fieldProps={{
                size: 'large',
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.email.placeholder',
                defaultMessage: 'Nhập email doanh nghiệp của bạn',
              })}
              rules={[
                { required: true, message: 'Bạn phải điền email doanh nghiệp!' },
                {
                  pattern: new RegExp('([a-z][a-z0-9_.]{1,32}@fpt[.]com[.]vn)'),
                  message: (
                    <FormattedMessage
                      id="pages.login.email.required"
                      defaultMessage="Bạn không thể đăng nhập bằng địa chỉ email này"
                    />
                  ),
                },
              ]}
            />
          </>
          {/* {status.status === 'error' && !status.submitting && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: 'Account or password error',
              })}
            />
          )} */}
        </ProForm>
      </Card>
    </div>
  );
}

export default connect()(Login);
