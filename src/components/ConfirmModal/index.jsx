import React from 'react';
import { history } from 'umi';
import PT from 'prop-types';
import { Empty, Button } from 'antd';
import {InfoCircleOutlined} from '@ant-design/icons';
import styles from './styles.less';

function ConfirmModal(props) {
  const {onConfirm, onCancel, description} = props;
  return (
    <div className={styles.deleteModalWrapper}>
      <div className={styles.warning}>
        <InfoCircleOutlined style={{ color: '#faad14' }} />
        <span>{description}</span>
      </div>
      <div className={styles.footer}>
        <Button onClick={onCancel} className={styles.noButton}>
          Không
        </Button>
        <Button
          onClick={onConfirm}
          className={styles.yesButton}
        >
          Có
        </Button>
      </div>
    </div>
  );
}

export default ConfirmModal;
