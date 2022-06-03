import React, { useState } from 'react';
import {
  MenuOutlined,
  FormOutlined,
  SendOutlined,
  UserAddOutlined,
  PauseOutlined,
  AudioMutedOutlined,
  BellOutlined,
  SettingOutlined,
  ExpandAltOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import KeyBoard from './Keyboard';
import History from './History';
import UserInfo from './UserInfo';
import style from './style.less';

const ModalAnswer = () => {
  const [ult, setUlt] = useState('');
  return (
    <div className={style.body}>
      <div className={style.bodyWrapper} style={{ display: ult === '' ? 'block' : 'flex' }}>
        <div className={style.contentWrapper}>
          <div className={style.extension}>
            <SettingOutlined style={{ fontSize: 19, color: '#fff' }} />
            <ExpandAltOutlined
              style={{ fontSize: 19, color: '#fff', marginLeft: 20 }}
              onClick={() => setUlt('')}
            />
          </div>
          <div className={style.body}>
            <img src="/Nguyen_Thu_Huong.png"></img>
            <div className={style.nameWrapper}>
              <h3>Nguyen Thu Huong</h3>
              <h4>00:15</h4>
            </div>
          </div>
          <div className={style.buttonWrapper}>
            <div className={style.left}>
              <div
                className={style.button}
                style={{ background: ult === 'history' ? '#fff' : '#a9a9a9' }}
                onClick={() => setUlt('history')}
              >
                <ClockCircleOutlined style={{ fontSize: 19, color: '#000' }} />
              </div>
              <div
                className={style.button}
                style={{ background: ult === 'keyboard' ? '#fff' : '#a9a9a9' }}
                onClick={() => setUlt('keyboard')}
              >
                <MenuOutlined style={{ fontSize: 19, color: '#000' }} />
              </div>
              <div
                className={style.button}
                style={{ background: ult === 'userInfo' ? '#fff' : '#a9a9a9' }}
                onClick={() => setUlt('userInfo')}
              >
                <FormOutlined style={{ fontSize: 19, color: '#000' }} />
              </div>
            </div>
            <div className={style.right}>
              <div className={style.button}>
                <SendOutlined style={{ fontSize: 19, color: '#000' }} />
              </div>
              <div className={style.button}>
                <UserAddOutlined style={{ fontSize: 19, color: '#000' }} />
              </div>
              <div className={style.button}>
                <PauseOutlined style={{ fontSize: 19, color: '#000' }} />
              </div>
              <div className={style.button}>
                <AudioMutedOutlined style={{ fontSize: 19, color: '#000' }} />
              </div>
              <div className={style.button} style={{ background: '#FF3459' }}>
                <BellOutlined style={{ fontSize: 19, color: '#fff' }} />
              </div>
            </div>
          </div>
        </div>
        {ult === 'keyboard' && <KeyBoard />}
        {ult === 'history' && <History />}
        {ult === 'userInfo' && <UserInfo />}
      </div>
    </div>
  );
};

export default ModalAnswer;
