import { stringify } from 'querystring';
import { history } from 'umi';
// import { requestLogin } from '@/services/auth';
// import { requestGetLicense } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
// import { message } from 'antd';
import api from '../api';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
    type: 'account',
    counting: 0,
  },
  effects: {
    *execution({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },

    // *login({ payload }, { call, put }) {
    //   const res = yield call(requestLogin, payload);
    //   if (res.user && res.user.status === 'success') {
    //     const payloadUser = {
    //       ...res.user.data,
    //       tokenHub: res.tokenHub,
    //       tokenGateway: res.tokenGateway,
    //     };
    //     const resLicense = yield call(requestGetLicense, {
    //       Authorization: `Bearer ${res.tokenGateway}`,
    //     });
    //     // if (resLicense && resLicense.status === 'OK') {
    //     if (resLicense && resLicense.status === 'OK') {
    //       yield put({
    //         type: 'user/saveState',
    //         payload: {
    //           license: true,
    //           licenseModule: resLicense?.payload?.data?.data?.licenseModule || [],
    //         },
    //       });
    //     } else {
    //       yield put({
    //         type: 'user/saveState',
    //         payload: {
    //           license: false,
    //         },
    //       });
    //     }
    //     yield put({
    //       type: 'changeLoginStatus',
    //       payload: {
    //         ...payloadUser,
    //         licenseObject: resLicense?.payload?.data?.data?.licenseObject || [],
    //       },
    //     }); // Login successfully
    //     const urlParams = new URL(window.location.href);
    //     const params = getPageQuery();
    //     message.success(`🎉 🎉 🎉  Xin chào ${res?.user?.data?.me?.username}`);
    //     // message.success({
    //     //   content: (
    //     //     <span>
    //     //       🎉 🎉 🎉 <FormattedMessage id="pages.login.message.success" />{' '}
    //     //       {res?.user?.data?.me?.username}
    //     //     </span>
    //     //   ),
    //     // });
    //     yield put({
    //       type: 'user/save',
    //       payload: {
    //         currentUser: res.user.data.me,
    //         ext:
    //           res?.moreData?.length > 0 && res?.moreData[0]?.ipPhone
    //             ? res.moreData[0].ipPhone
    //             : null,
    //         userId: res.user.data.userId,
    //         authToken: res.user.data.authToken,
    //         tokenHub: res.tokenHub,
    //         tokenGateway: res.tokenGateway,
    //       },
    //     });
    //     let { redirect } = params;
    //     if (redirect) {
    //       const redirectUrlParams = new URL(redirect);
    //       if (redirectUrlParams.origin === urlParams.origin) {
    //         redirect = redirect.substr(urlParams.origin.length);

    //         if (redirect.match(/^\/.*#/)) {
    //           redirect = redirect.substr(redirect.indexOf('#') + 1);
    //         }
    //       } else {
    //         window.location.href = '/';
    //         return null;
    //       }
    //     }
    //     history.replace(redirect || '/');
    //     return null;

    //     // }
    //   }
    //   if (res?.error?.statusCode === 401) {
    //     const countLogin = +localStorage.getItem('countLogin') || 0;
    //     if (countLogin < 4) {
    //       yield put({
    //         type: 'save',
    //         payload: {
    //           counting: (countLogin + 1).toString(),
    //         },
    //       });
    //       localStorage.setItem('countLogin', countLogin + 1);
    //     }
    //   }
    //   yield put({
    //     type: 'save',
    //     payload: {
    //       status: 'error',
    //     },
    //   });
    //   return null;
    // },

    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      // if (res.success) {
      // delete all key
      Object.keys(localStorage).forEach((elm) => localStorage.removeItem(elm));
      yield put({
        type: 'user/save',
        payload: {
          currentUser: {},
          ext: '',
          userId: '',
          tokenGateway: '',
          refreshToken: '',
          licenseModule: [],
          license: false,
        },
      });
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
      // const res = yield call(requestLogout, data);
      if (api.ENV === 'local') {
        window.location = `${api.UMI_API_BASE_URL}/user/sso_logout?redirect_uri=${
          api.REDIRECT_URI_PROTOCOL || 'https'
        }%3A%2F%2F${api.UMI_DOMAIN}%3A${api.PORT}%2Fmainpage`;
      } else {
        `${api.UMI_API_BASE_URL}/user/sso_fpt_logout?redirect_uri=${api.UMI_API_URL}`;
      }
      
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      // setAuthority(payload.me.roles);
      setAuthority(payload.licenseObject, payload.userId);

      // lưu token vào storage sau khi login thành công
      localStorage.setItem('userId', payload.userId);
      localStorage.setItem('authToken', payload.authToken);
      localStorage.setItem('tokenHub', payload.tokenHub);
      localStorage.setItem('tokenGateway', payload.tokenGateway);
      return {
        ...state,
        status: 'success',
      };
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
