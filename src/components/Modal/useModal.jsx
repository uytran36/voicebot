import React from 'react';

export default (initialState) => {
    const [visible, toggleModal] = React.useState(initialState.isOpen);
    const [modalProps, setModalProps] = React.useState(initialState.modalProps);

    const setModalState = (isOpen, _modalProps = {}) => {
        toggleModal(isOpen)
        setModalProps(_modalProps)
    }

    return [{ visible, modalProps }, setModalState];
}