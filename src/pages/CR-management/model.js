
const Model = {
  namespace: 'crm',
  state: {
    tabActive: 'cus'
  },
  effects: {
    // changle local state in redux
    *execution({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
