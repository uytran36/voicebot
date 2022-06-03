import React from 'react';
import { Modal } from 'antd';
import { ModalContext } from '@/contexts/modal.context';

// use for context
export const RenderModal = () => {
  const context = React.useContext(ModalContext);
  
  return (
    <Modal
      {...context.modalProps}
      bodyStyle={{ padding: '16px 0', ...context.modalProps.bodyStyle }}
      destroyOnClose
      visible={context.visible}
    >
      {context.modalProps.content}
    </Modal>
  )
}
