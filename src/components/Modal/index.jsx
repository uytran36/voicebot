import React from 'react';
import { Modal } from 'antd';
import PT from 'prop-types';
import { connect } from 'umi';
import styles from './styles.less';

ModalWrapper.propTypes = {
  modal: PT.shape({
    isOpen: PT.bool,
    element: PT.instanceOf(Object),
  }).isRequired,
  confirmLoading: PT.bool,
  onCancel: PT.func,
};

ModalWrapper.defaultProps = {
  confirmLoading: false,
  onCancel: () => {},
};

function ModalWrapper(props) {
  const {
    modal: {
      isOpen,
      element: { content, footer, title, width, bodyStyle, closable },
    },
    confirmLoading,
    onCancel,
  } = props;

  return (
    <Modal
      title={title}
      className={styles.standardListForm}
      width={width}
      bodyStyle={{ padding: '16px 0', ...bodyStyle }}
      destroyOnClose
      visible={isOpen}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      closable={closable}
      {...footer}
    >
      {content}
    </Modal>
  );
}

export const { confirm } = Modal;

export default connect(({ modal }) => ({ modal }))(ModalWrapper);
