const ModalModel = {
  namespace: 'modal',
  state: {
    isOpen: false,
    element: {
      content: null,
      footer: null,
      title: '',
      width: 640,
      bodyStyle: {},
      closable: false,
    },
  },
  effects: {
    *showModal({ payload }, { put }) {
      yield put({
        type: 'showModalReducer',
        payload,
      });
    },
    *changeElement({ payload }, { put }) {
      yield put({
        type: 'updateElement',
        payload,
      });
    },
  },
  reducers: {
    showModalReducer(state, action) {
      return { ...state, isOpen: action.payload };
    },
    updateElement(state, action) {
      const { element } = state;
      delete element.bodyStyle;
      return { ...state, isOpen: true, element: { ...state.element, ...action.payload } };
    },
  },
};
export default ModalModel;
