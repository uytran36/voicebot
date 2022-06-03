export const openModal = (dispatch) => {
  dispatch({
    type: 'modal/showModal',
    payload: true,
  });
};

export const closeModal = (dispatch) => {
  dispatch({
    type: 'modal/showModal',
    payload: false,
  });
};

export const changeContentModal = (objElement, dispatch) => {
  dispatch({
    type: 'modal/changeElement',
    payload: objElement,
  });
};
