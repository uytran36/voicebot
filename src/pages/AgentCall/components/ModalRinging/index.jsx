import React, { useState } from 'react';
import { Button, Row, Col } from 'antd';
import { PhoneOutlined, PauseOutlined, ExpandAltOutlined } from '@ant-design/icons'
import style from './style.less';

const ModalRinging = ({ handleClickCall }) => {
  return (
    <div className={style.body}>
      <div className={style.contentWrapper}>
        <div className={style.extension}><ExpandAltOutlined style={{ fontSize: 19, color: '#fff' }}/></div>
        <img src="/Nguyen_Thu_Huong.png"></img>
        <div className={style.nameWrapper}>
          <h3>Nguyen Thu Huong</h3>
          <h4>(HuongNT256)</h4>
        </div>
        <div className={style.buttonWrapper}>
          <div className={style.accept}>
            <div className={style.button} onClick={handleClickCall}><PhoneOutlined className={style.bell} style={{ fontSize: 19, color: '#fff' }}/></div>
            <h3>Trả lời</h3>
          </div>
          <div className={style.decline}>
            <div className={style.button}><PauseOutlined style={{ fontSize: 19, color: '#fff' }}/></div>
            <h3>Từ chối</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRinging;
