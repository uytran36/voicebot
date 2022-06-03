import React, { useState } from 'react';
import { Select, Button } from 'antd';
import { CheckCircleTwoTone, CloseCircleTwoTone, ClockCircleTwoTone } from '@ant-design/icons';
import PT from 'prop-types';
import styles from './index.less';
import { useEffect } from 'react';
import { LogoutOutlined } from '@ant-design/icons';

function Status(props) {
  const [isConnectToCallSys, setIsConnectToCallSys] = useState(false);

  const status = [
    {
      value: 'Available',
      name: 'Sẵn sàng',
      icon: <CheckCircleTwoTone className={styles.icon} twoToneColor="#1EAF61" />,
    },
    {
      name: 'Không sẵn sàng',
      value: 'Logged Out',
      icon: <CloseCircleTwoTone className={styles.icon} twoToneColor="#FF4D4F" />,
    },
    // {
    //   name: 'Nghỉ trưa',
    //   value: 'On Break',
    //   icon: <ClockCircleTwoTone className={styles.icon} twoToneColor="#FF4D4F" />,
    // },
  ];

  return (
    <>
      {isConnectToCallSys ? (
        <Select
          bordered={false}
          className={styles['status-container']}
          style={{ width: '100%', minWidth: 150 }}
          defaultValue="Logged Out"
          //value={/* userAgentModel.status */ 'Logged Out'}
          onSelect={(e) => e === 'logout' && setIsConnectToCallSys(false)}
        >
          {status.map((elm, index) => (
            <Select.Option key={index} value={elm.value} dropdownMatchSelectWidth={false}>
              <div className={styles['select-dropdown']}>
                {elm.icon}
                {elm.name}
              </div>
            </Select.Option>
          ))}
          <Select.Option key="logout" value="logout" dropdownMatchSelectWidth={false}>
            <div className={styles['select-dropdown']}>
              <LogoutOutlined />
              Log out
            </div>
          </Select.Option>
        </Select>
      ) : (
        <Button
          className={styles['status-container']}
          style={{ width: '100%', minWidth: 150 }}
          onClick={() => {
            setIsConnectToCallSys(true);
          }}
        >
          Tham gia tổng đài
        </Button>
      )}
    </>
  );
}

export default Status;
