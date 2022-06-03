import React from 'react';
import PT from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';
import { Tooltip, Button, Popconfirm } from 'antd';
import styles from './styles.less';

/**
 * @param {String} title - Title tooltip
 * @param {Function} onClick - Handle click to button
 * @return {Component<DeclineButton>}
 */
const Decline = ({ title, onClick, ...props }) => (
  <Tooltip title={title}>
    <Popconfirm
      placement="bottomRight"
      title={
        <div style={{ width: '222px', height: '84px', paddingRight: '10px' }}>
          Cuộc gọi sẽ bị chuyển vào cuộc gọi từ chối và không thể gọi lại. Bạn có chắc chắn muốn từ
          chối cuộc gọi này?
        </div>
      }
      onConfirm={onClick}
      okType="danger primary"
      okText="Từ chối"
    >
      <Button
        shape="circle"
        // danger
        // type='primary'
        className={`${styles.button} ${styles.close}`}
        icon={<CloseOutlined style={{ color: '#fff' }} />}
        {...props}
      />
    </Popconfirm>
  </Tooltip>
);
Decline.propTypes = {
  title: PT.string.isRequired,
  onClick: PT.func.isRequired,
};

export default Decline;
