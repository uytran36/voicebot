const Model = {
  namespace: 'omnichannel',
  state: {
    isShowInfo: false,
    isShowForm: false,
    rowSelected: {},
  },
  effects: {
    // changle local state in redux
    *execution({ payload }, { call, put }) {
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
