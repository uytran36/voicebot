import React from 'react';
import { Button, Row, Col } from 'antd';
import { MenuOutlined, PhoneFilled } from '@ant-design/icons';
import style from './style.less';

const History = () => {
  return (
    <div className={style.body}>
      <div className={style.bodyWrapper}>
        <div className={style.header}>
          <span>Lịch sử tương tác</span>
        </div>
        <div className={style.historyWrapper}>
          <div className={style.history}>
            <div className={style.number}>
              <PhoneFilled style={{  fontSize: '20px', color: '#CEA100', marginRight: '10px' }} />
              <span>0988658519</span>
            </div>
            <div className={style.date}>
              <span>08/03/2021</span><br/>
              <span>11:00</span>
            </div>
          </div>
          <div className={style.history}>
            <div className={style.number}>
              <PhoneFilled style={{  fontSize: '20px', color: '#FF3459', marginRight: '10px' }} />
              <span style={{ color: '#FF3459' }}>0988658519</span>
            </div>
            <div className={style.date}>
              <span>08/03/2021</span><br/>
              <span>11:00</span>
            </div>
          </div>
          <div className={style.history}>
            <div className={style.number}>
              <PhoneFilled style={{  fontSize: '20px', color: '#FF3459', marginRight: '10px' }} />
              <span style={{ color: '#FF3459' }}>0988658519</span>
            </div>
            <div className={style.date}>
              <span>08/03/2021</span><br/>
              <span>11:00</span>
            </div>
          </div>
          <div className={style.history}>
            <div className={style.number}>
              <PhoneFilled style={{  fontSize: '20px', color: '#289945', marginRight: '10px' }} />
              <span>0988658519</span>
            </div>
            <div className={style.date}>
              <span>08/03/2021</span><br/>
              <span>11:00</span>
            </div>
          </div>
          <div className={style.history}>
            <div className={style.number}>
              <PhoneFilled style={{  fontSize: '20px', color: '#289945', marginRight: '10px' }} />
              <span>0988658519</span>
            </div>
            <div className={style.date}>
              <span>08/03/2021</span><br/>
              <span>11:00</span>
            </div>
          </div>
          <div className={style.history}>
            <div className={style.number}>
              <PhoneFilled style={{  fontSize: '20px', color: '#CEA100', marginRight: '10px' }} />
              <span>0988658519</span>
            </div>
            <div className={style.date}>
              <span>08/03/2021</span><br/>
              <span>11:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
