// import { message } from 'antd';
// import { FormattedMessage, Redirect } from 'umi';
// import { requestCurrentUserInfo, requestGetLicense } from '@/services/user';
// import { setAuthority } from '@/utils/authority';
// import { decrypt } from '@/utils/encode';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    userId: '',
    tokenGateway: '',
    ext: '',
    license: null,
    licenseModule: [],
    wsId: '',
  },
  effects: {
    // *fetchCurrent({ payload, history }, { call, put }) {
    //   const resLicense = yield call(requestGetLicense);
    //   if (resLicense && resLicense.status === 'OK') {
    //     const localLicense = localStorage.getItem('validate');
    //     const accessToken = localStorage.getItem('id');
    //     const decryptLocalLicense = JSON.parse(decrypt(localLicense, accessToken));
    //     // neu co license
    //     const licenseObject = resLicense?.payload?.data?.data?.licenseObject;
    //     if (decryptLocalLicense !== JSON.stringify(licenseObject)) {
    //       setAuthority(licenseObject?.length > 0 ? licenseObject : ['mainpage'], accessToken);
    //       // window.location.reload();
    //       yield put({
    //         type: 'saveState',
    //         payload: {
    //           license: true,
    //           licenseModule: resLicense?.payload?.data?.data?.licenseModule || [],
    //         },
    //       });
    //     }
    //     const res = yield call(requestCurrentUserInfo, payload);
    //     if (Object.keys(res).length > 0) {
    //       if (res.username) {
    //         message.success(`🎉 🎉 🎉  Xin chào ${res.username}`);
    //       }
    //       yield put({
    //         type: 'saveState',
    //         payload: {
    //           currentUser: res,
    //           ext: res?.ipPhone,
    //           userId: localStorage.getItem('userId'),
    //           tokenHub: localStorage.getItem('tokenHub'),
    //           tokenGateway: localStorage.getItem('tokenGateway'),
    //           authToken: localStorage.getItem('authToken'),
    //         },
    //       });
    //     }
    //   } else {
    //     yield put({
    //       type: 'saveState',
    //       payload: {
    //         license: false,
    //       },
    //     });
    //   }
    // },

    *save({ payload }, { put }) {
      yield put({
        type: 'saveState',
        payload,
      });
    },
  },
  reducers: {
    saveState(state, { payload }) {
      return { ...state, ...payload };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      const { payload } = action;
      const { type, number } = payload;
      let count = state.currentUser.unreadCount || 0;
      switch (type) {
        case 'SET':
          count = number;
          break;
        case 'DECREASE':
          count -= number;
          break;
        default:
          count += number;
          break;
      }
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: count,
        },
      };

      // return {
      //   ...state,
      //   currentUser: {
      //     ...state.currentUser,
      //     notifyCount: action.payload.totalCount,
      //     unreadCount: action.payload.unreadCount ?? state.currentUser.unreadCount - 1,
      //   },
      // };
    },
  },
};
export default UserModel;
