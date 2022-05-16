import React, { memo } from 'react';
import { Row, Col, Button } from 'antd';
import { HangUp } from '@/components/Icons';
import { CloseOutlined } from '@ant-design/icons';
import style from './style.less';

function ModalCallMiss({ toggleAgentCallMiss, toggleRecall }) {
  return (
    <div className={style['close-modal-wrapper']}>
      <Row>
        <Col span={3}>
          <HangUp />
        </Col>
        <Col span={20}>
          <div className={style['name']}>Nguyễn Thu Hương</div>
          <div className={style['phone-number']}>0961234567</div>
          <div className={style['name-campaign']}>Chiến dịch 1</div>
          <div className={style['time-call']}>Vừa xong</div>
          <Button
            type="primary"
            onClick={() => {
              toggleAgentCallMiss(false);
              toggleRecall(true);
            }}
          >
            Gọi lại
          </Button>
        </Col>
        <Col span={1}>
          <CloseOutlined style={{ cursor: 'pointer' }} onClick={() => toggleAgentCallMiss(false)} />
        </Col>
      </Row>
    </div>
  );
}

export default memo(ModalCallMiss);
