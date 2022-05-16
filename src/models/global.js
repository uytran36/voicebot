import { changeNoticeStatus, queryNotices, requestCurrentUserInfo } from '@/services/user';

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    keyTabCallcenter: '',
    logCall: [],
  },
  effects: {
    *fetchNotices({ headers, params }, { call, put, select }) {
      const data = yield call(queryNotices, headers, params);
      if (data.msg === 'SUCCESS') {
        yield put({
          type: 'saveNotices',
          payload: data.response.notifications.notifications,
          offset: data.response.notifications.offset,
        });
      }
      // yield put({
      //   type: 'saveNotices',
      //   payload: data,
      // });
      const unreadCount = data?.response?.notifications.unread;
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          type: 'SET',
          number: unreadCount,
        },
      });
    },

    *newNotice({ payload }, { call, put, select }) {
      let notices = yield select((state) => state.global.notices);
      const newNotice = payload;
      notices = [newNotice, ...notices];
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'popUpNotice',
        payload: newNotice,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          type: 'INCREASE',
          number: 1,
        },
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select((state) => state.global.notices.length);
      // const unreadCount = yield select(
      //   (state) => state.global.notices.filter((item) => !item.read).length,
      // );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          // unreadCount,
        },
      });
    },

    *readAllNotice({ headers, body }, { put, select, call }) {
      const notices = yield select((state) =>
        state.global.notices.map((item) => {
          const notice = { ...item };
          if (notice.read == undefined || notice.read === false) {
            notice.read = true;
          }

          return notice;
        }),
      );
      //request read all

      yield call(changeNoticeStatus, headers, { list: [], ...body });

      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          type: 'SET',
          number: 0,
        },
      });
    },

    *changeNoticeReadState({ payload, headers, body }, { put, select, call }) {
      const notices = yield select((state) =>
        state.global.notices.map((item) => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      //request change read state
      yield call(changeNoticeStatus, headers, { list: notices, ...body });
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          type: 'DECREASE',
          number: 1,
        },
      });
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    popUpNotice(state, { payload }) {
      return {
        ...state,
        popUpNotice: payload,
      };
    },

    saveNotices(state, { payload, unread, offset }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
        unreadCount: unread,
        offset: offset,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item) => item.type !== payload),
      };
    },

    /**
     * @param {Object} state
     * @param {String} payload - state keytab
     */
    changeKeyTabCallcenter(state, { payload }) {
      return {
        ...state,
        keyTabCallcenter: payload,
      };
    },

    updateLogCall(state, { payload }) {
      return {
        ...state,
        logCall: [...state.logCall, payload],
      };
    },
  },
};
export default GlobalModel;
