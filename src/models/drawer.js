const ModalModel = {
  namespace: 'drawer',
  state: {
    isOpen: false,
    content: null,
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
export default ModalModel;