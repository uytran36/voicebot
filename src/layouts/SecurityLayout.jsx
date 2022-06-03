import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { Redirect, connect } from 'umi';
import PT from 'prop-types';
import { stringify } from 'querystring';
import { requestGetLicense, getRoleUser, verifySSO } from '@/services/auth';
import ActiveLicense from '../pages/Mainpage/components/ActiveLicense';
import { setAuthority } from '@/utils/authority';
import { get } from '@/utils/local-storage';
//import { Modal } from '@/components/Modal';
import { Modal } from 'antd';
import FirstLoginPopUpBody from './components/ModalUpdateInfo';
import { requestGetUserInfo } from '@/services/user-management';
import { history } from 'umi';
import api from '../api';

const getCurrentUser = async (userId) => {
  try {
    let accessToken = get('access_token');
    const headers = { Authorization: `Bearer ${accessToken}` };
    if (accessToken !== null) {
      const res = await requestGetUserInfo(headers);
      let permissions;
      if (res.success) {
        permissions = await getRoleUser(headers);
      }

      if (res.success === true) {
        let permissonArray = [];
        permissions?.data?.forEach((e) => permissonArray.push(e?.permission));
        const userData = {
          ...res?.data[0],
          id: '6131c12466eaf19ca7a2daff',
          username: 'admin',
          permissions: [
            ...permissonArray,
            'resetPassword',
            'setupPermissionCallCenter',
            'setupPermissionOmniInbound',
            'setupPermissionVoicebotCampaign',
            'updatePermissionRole',
            'updateUser',
            'user-view',
            'viewPermission',
            'viewRoleAndPermission',
            'manageAndDecentralizeUsers',
            'viewUserProfile',
            'scc_callcenter_agent',
            'scc_callcenter_supervisor',
            'configCallCenter',
            'accessFacebook',
            'accessLiveChat',
            'accessZalo',
            'configChannelChat',
            'livechatFacebook',
            'viewDashboardOmniInbound',
            'viewReportOmniInbound',
            'livechatZalo',
          ],
          type: 'user',
          status: 'offline',
          active: true,
          updatedAt: '2021-10-07T02:14:57.507+00:00',
          roles: ['admin', 'livechat-agent'],
          name: 'admin',
          requirePasswordChange: false,
          statusText: '',
          lastLogin: '2021-01-31T15:49:45.534+00:00',
          statusConnection: 'offline',
          gender: 'Male',
          phone: '097888324',
          ipPhone: '102',
          extension: {
            extensionUuid: '78464382-d49a-44dd-99ec-604f2e494202',
            agentUuid: 'bcd3f54e-bfbe-488d-a9ee-ac9fcbb1253e',
            domainUuid: 'b0239f3e-2542-46d1-b779-19efd2b751fa',
            extension: '103',
            numberAlias: null,
            userContext: 'sccpbx.com',
            enabled: 'true',
            password: 'vo9EFsQ!6z',
          },
        };
        return userData;
      }
    }

    throw new Error('ERROR~');
  } catch (err) {
    return null;
  }
};

const getLicense = async (headers) => {
  try {
    const res = await requestGetLicense(headers);
    if (res?.status === 'OK') {
      return {
        modules: res?.payload?.data?.data?.licenseModule || null,
        object: res?.payload?.data?.data?.licenseObject || [],
      };
    }
    if (res?.detail.includes('add license')) {
      return {
        error: true,
        message: 'ADD_LICENSE',
      };
    }
    throw new Error('ERROR~');
  } catch (err) {
    return {
      error: true,
      message: 'ERROR~',
    };
  }
};

class SecurityLayout extends React.Component {
  static propTypes = {
    dispatch: PT.func.isRequired,
    currentUser: PT.instanceOf(Object).isRequired,
    loading: PT.bool,
    children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]),
    history: PT.instanceOf(Object).isRequired,
    userId: PT.string,
    tokenGateway: PT.string,
    license: PT.bool,
    isNew: PT.bool,
  };

  static defaultProps = {
    loading: false,
    children: <div />,
    userId: '',
    tokenGateway: '',
    license: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      isActiveLicense: 0,
    };
  }

  getAuth = () => {
    const { dispatch } = this.props;
    try {
      const auth2 = {
        userId: get('user_id'),
        accessToken: get('access_token'),
        refreshToken: get('rid'),
      };
      dispatch({
        type: 'user/save',
        payload: {
          tokenGateway: `Bearer ${auth2.accessToken}`,
        },
      });
      return auth2;
    } catch (err) {
      return null;
    }
  };

  getCurrentUser = async (headers) => {
    const { dispatch } = this.props;
    try {
      const user = await getCurrentUser(headers);
      if (user) {
        const { tokenGateway } = this.props;
        const _headers = {
          Authorization: `${tokenGateway}`,
        };
        /**
         * Do f5 redux sẽ bị reset nên lúc này phải lấy headers
         * từ bên ngoài truyền vào hàm để request.
         */
        const license = await getLicense(tokenGateway ? _headers : headers);
        return {
          user,
          license,
        };
      }
      throw new Error('ERROR~');
    } catch (err) {
      return {
        user: null,
        license: null,
      };
    }
  };

  async componentDidMount() {
    if (window.location.href.includes('code')) {
      const paramsString = history.location.search;
      const params = new URLSearchParams(paramsString);
      const code = params.get('code');
      const state = params.get('state');
      const session_state = params.get('session_state');

      let data;
      if (api.ENV === 'local') {
        data = {
          state,
          session_state,
          code,
          redirect_uri: `${api.UMI_API_URL}/mainpage`,
        };
      } else {
        data = {
          state,
          session_state,
          code,
          redirect_uri: `${api.UMI_API_URL}`,
        };
      }

      const response = await verifySSO(data);
      if (response?.success === true) {
        if (api.ENV === 'local') {
          window.localStorage.setItem('access_token', response?.data[0]?.access_token);
        } else {
          window.localStorage.setItem('access_token', response?.data[0]?.id_token);
        }
        window.localStorage.setItem('rid', response?.data[0]?.refresh_token);
        window.localStorage.setItem('user_id', response?.data[0]?.user_id);
      }
    }

    const { dispatch, currentUser, isNew } = this.props;
    if (!currentUser?.id) {
      const { userId } = this.getAuth();
      const { user, license } = await this.getCurrentUser(userId);

      if (!user && !license) {
        dispatch({
          type: 'user/save',
          payload: {
            currentUser: {},
            ext: '',
            userId: '',
            licenseModule: [],
            license: false,
          },
        });
        this.setState({
          isReady: true,
        });
        return;
      }
      if (license.error && license.message === 'ADD_LICENSE') {
        dispatch({
          type: 'user/save',
          payload: {
            currentUser: user,
            ext: user.ipPhone,
            userId: user.id,
            licenseModule: [],
            license: false,
          },
        });
        this.setState({
          isReady: true,
        });
        return;
      }
      if (user && license) {
        setAuthority(license.object);
        dispatch({
          type: 'user/save',
          payload: {
            currentUser: user,
            ext: user.ipPhone,
            userId: user.id,
            licenseModule: license.modules,
            license: !!license.modules,
          },
        });
        dispatch({
          type: 'rocketChat/getMeCompleted',
          payload: {
            data: user,
          },
        });
      }
    }
    this.setState({
      isReady: true,
      isVisible: isNew,
    });
  }

  handleCancel() {
    this.setState({ isVisible: false });
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser, dispatch, userId, tokenGateway, license } = this.props; // You can replace it to your authentication rule (such as check token exists)
    // You can replace it with your own login authentication rules (e.g token Does it exist)
    const isLogin = !!(currentUser && currentUser.id);
    const headers = {
      Authorization: tokenGateway,
    };
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }

    if (!license) {
      return <ActiveLicense headers={headers} dispatch={dispatch} />;
    }

    if (isReady) {
      return (
        <>
          {children}
          {this.state.isVisible && <FirstLoginPopUpBody />}
        </>
      );
    }

    //return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
  userId: user.userId,
  tokenGateway: user.tokenGateway,
  license: user.license,
  isNew: user.is_new,
}))(SecurityLayout);
