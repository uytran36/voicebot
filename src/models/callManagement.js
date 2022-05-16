/* eslint-disable camelcase */
import {
  requestGetDetailCall,
  requestAddNoteToCalling,
  requestGetOmniContactListNormalizationFindInfo,
} from '@/services/call-center';

const ModalModel = {
  namespace: 'callManagement',
  state: {
    dataCallMonitor: [],
    dataCallInterface: {},
    isSupervisor: false,
    callId: '',
    dataCallDetail: {},
    answeringTime: '',
    ringingTime: '',
    numberCall: '',
    customerInfo: {},
    newCustomer: false,
    inbound: false,
  },
  effects: {
    // changle local state in redux
    *execution({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *saveDataCallInterface({ payload }, { put, select }) {
      const { data, action } = payload;
      const { ext } = yield select((state) => state.user);
      // console.log({ext, data})
      yield put({
        type: 'saveDataCallMonitor',
        payload,
      });
      // console.log(data.agent_id === ext)
      // console.log({action})
      if (action === 'CHANNEL_ANSWER' && data.agent_id === ext) {
        yield put({
          type: 'save',
          payload: {
            dataCallInterface: data,
          },
        });
        return null;
      }
      if (data.agent_id === ext && action === 'CHANNEL_HANGUP') {
        yield put({
          type: 'save',
          payload: {
            dataCallInterface: {},
          },
        });
      }
      return null;
    },

    *missedCall({ payload }, { put, select }) {
      const { callId, phone, direction } = payload;
      const { userId } = yield select((state) => state.user);
      console.log({ callId, phone, direction, agentId: userId });
    },

    *saveDataCallDetail({ payload, headers }, { put, select, call }) {
      const res = yield call(requestGetDetailCall, payload, headers);
      // console.log({ext, data})
      if (res?.success && res?.data?.length > 0) {
        yield put({
          type: 'save',
          payload: {
            dataCallDetail: res?.data[0],
          },
        });
      }
    },

    *addNoteToCalling({ payload, headers }, { select, call, put }) {
      const { callId } = yield select((state) => state?.callManagement);
      const { username } = yield select((state) => state?.user?.currentUser);
      const data = {
        ...payload,
        agent_username: username,
      };
      const res = yield call(requestAddNoteToCalling, { sip_call_id: callId }, data, headers);
      yield put({
        type: 'save',
        payload: {
          callId: '',
        },
      });
    },

    *getCustomerInfo({ payload, headers }, { select, call, put }) {
      const res = yield call(requestGetOmniContactListNormalizationFindInfo, headers, payload);
      if (res?.code === 200 && res?.response?.data?.id) {
        yield put({
          type: 'save',
          payload: {
            customerInfo: { sdt: payload, ...res.response.data },
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            newCustomer: true,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    /**
     * Save data call monitor
     * @param {Object} state - Current state
     * @param {Object} payload - Data calling
     */
    saveDataCallMonitor(state, { payload }) {
      const { data, action } = payload;
      // create
      // only inbound
      if (action === 'CHANNEL_CREATE' && data?.call_type === 'inbound') {
        return {
          ...state,
          dataCallMonitor: [...state.dataCallMonitor, { ...data }],
        };
      }
      // update
      if (action === 'CHANNEL_ANSWER' && data?.call_type === 'inbound') {
        const listDataCallMonitor = [...state.dataCallMonitor];
        const index = state.dataCallMonitor.findIndex((elm) => elm.session_id === data.session_id);
        // console.log(data)
        if (index >= 0) {
          listDataCallMonitor[index] = { ...listDataCallMonitor[index], ...data };
        }
        return {
          ...state,
          dataCallMonitor: listDataCallMonitor,
        };
      }
      // delete
      const dataCallMonitorFiltered = state.dataCallMonitor.filter(
        (elm) => elm.session_id !== data.session_id,
      );
      return {
        ...state,
        dataCallMonitor: dataCallMonitorFiltered,
      };
    },
  },
};
export default ModalModel;
