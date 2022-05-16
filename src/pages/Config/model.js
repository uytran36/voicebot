import { requestGetSipProfile } from './service'

const Model = {
  namespace: 'voicebot',
  state: {
    isOpenForm: false,
    sipProfile: []
  },
  effects: {
    // changle local state in redux
    *execution({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *getSipProfile({ headers }, {call, put}) {
      const res = yield call(requestGetSipProfile, headers);
      if (res) {
        yield put({
          type: 'save',
          payload: {
            sipProfile: res
          }
        })
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
