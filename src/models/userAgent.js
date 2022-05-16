import { message } from 'antd';
import { requestGetStatusAgent, requestUpdateStatusAgent } from '@/services/userAgent';

const UserAgentModel = {
  namespace: 'userAgent',
  state: {
    status: '',
  },
  effects: {
    *fetchAgentStatus({ headers, payload }, { call, put }) {
      const res = yield call(requestGetStatusAgent, headers, payload);
      if (res?.code === 200 && res?.response?.status) {
        yield put({
          type: 'saveState',
          payload: {
            status: res.response.status,
          },
        });
      }
    },
    *updateAgentStatus({ headers, payload }, { call }) {
      const res = yield call(requestUpdateStatusAgent, headers, payload);
      if (res?.code === 200) {
        return message.success('Update status thành công');
      }
      return message.error('Update status thất bại');
    },

    //update agent status without api
    *updateAgentStatusWithoutApi({ payload }, { put }) {
      yield put({
        type: 'saveState',
        payload,
      });
    },

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
  },
};
export default UserAgentModel;
