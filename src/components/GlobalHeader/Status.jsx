import React from 'react';
import { Select } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone, ClockCircleTwoTone } from '@ant-design/icons';
import PT from 'prop-types';
import styles from './index.less';
import { useEffect } from 'react';

Status.propTypes = {
  userAgentModel: PT.instanceOf(Object).isRequired,
  updateAgentStatus: PT.func.isRequired,
};

function Status(props) {
  const { userAgentModel, updateAgentStatus } = props;
  const status = [
    {
      value: 'Available',
      name: 'Available',
      icon: <CheckCircleTwoTone className={styles.icon} twoToneColor="#1EAF61" />,
    },
    {
      name: 'Busy',
      value: 'Logged Out',
      icon: <CloseCircleTwoTone className={styles.icon} twoToneColor="#FF4D4F" />,
    },
    {
      name: 'Break time',
      value: 'On Break',
      icon: <ClockCircleTwoTone className={styles.icon} twoToneColor="#FF4D4F" />,
    },
  ];

  return (
    userAgentModel.status && (
      <Select
        bordered={false}
        className={styles['status-container']}
        value={userAgentModel.status}
        onSelect={(e) => updateAgentStatus(e)}
      >
        {status.map((elm, index) => (
          <Select.Option key={index} value={elm.value} dropdownMatchSelectWidth={false}>
            <div className={styles['select-dropdown']}>
              {elm.icon}
              {elm.name}
            </div>
          </Select.Option>
        ))}
      </Select>
    )
  );
}

export default Status;
