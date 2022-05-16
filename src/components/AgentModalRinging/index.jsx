import React, { memo, useEffect } from 'react';
import PT from 'prop-types';
import { PhoneFilled } from '@ant-design/icons';
import { Tooltip, Button } from 'antd';
import styles from './style.less';
import IncomingPhone from '../Icons/incoming-phone';
import DeclineButton from '../DeclineButton';
import avatarCall from '@/assets/avatar_incoming_call.png';

ModalRinging.propTypes = {
  answer: PT.func.isRequired,
  decline: PT.func.isRequired,
  transfer: PT.func.isRequired,
  numberCalling: PT.string.isRequired,
  infoCustomer: PT.instanceOf(Object).isRequired,
};

function ModalRinging({
  type,
  answer,
  decline,
  numberCalling,
  infoCustomer,
  toggleAgentCallMiss,
}) {
  useEffect(() => {
    if (type === 'ringing') {
      const intervalId = setInterval(() => {
        //assign interval to a variable to clear it.
        decline();
        toggleAgentCallMiss(true);
      }, 5000);

      return () => clearInterval(intervalId); //This is important
    }
  }, []);

  return (
    <div className={styles['calling-container']}>
      <div className={styles['header-calling-container']}>
        <div className={styles['header-calling-container-title']}>
          <IncomingPhone style={{ color: '#000' }} />
          <span>Đang gọi đến</span>
        </div>
      </div>
      <div className={styles['content-calling-container']}>
        {/* Calling infomation */}
        <div className={styles['call-info-container']}>
          <div className={styles['circle-avatar']}>
            <img src={avatarCall} alt="" />
          </div>
          <div className={styles['call-info']}>
            {/* <p>{Object.keys(infoCustomer).length ? infoCustomer.name : 'Unknow'}</p> */}
            <p>{Object.keys(infoCustomer).length ? infoCustomer.name : 'Nguyễn Thu Hương'}</p>
            <p>{numberCalling || '0961 234 567'}</p>
            <p>{'Chiến dịch 1'}</p>
          </div>
        </div>
        {/* Calling action */}
        <div className={styles['call-action-container']}>
          {type === 'ringing' && (
            <Tooltip title="Answer">
              <Button
                size="large"
                type="circle"
                // loading={isPickupPhone}
                className={`${styles.callFeature} ${styles.phone}`}
                onClick={answer}
                icon={<PhoneFilled className={styles.bell} />}
              />
            </Tooltip>
          )}
          <DeclineButton size="large" title="Decline" onClick={decline} />
        </div>
      </div>
    </div>
  );
}

export default memo(ModalRinging);
