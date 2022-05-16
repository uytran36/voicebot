const Model = {
  namespace: 'audio',
  state: {
    playing: false,
  },
  effects: {
    // changle local state in redux
    *updateState({ payload }, { put }) {
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
