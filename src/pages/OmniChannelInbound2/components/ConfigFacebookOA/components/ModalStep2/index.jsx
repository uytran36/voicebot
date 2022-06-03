import React, { useEffect, useState, useRef } from 'react';
import PT from 'prop-types';
import {
  Row,
  Col,
  Typography,
  Button,
  Checkbox,
  Form,
  Input,
  Image,
  message,
  Card,
  Divider,
  Empty,
} from 'antd';
import './style.less';

const { Title, Paragraph } = Typography;

ModalStep2.propTypes = {
  clickContinue: PT.func.isRequired,
  clickCancel: PT.func.isRequired,
};

function ModalStep2(props) {
  const { clickCancel, clickContinue } = props;

  return (
    <div className="body-wrapper-2">
      <div className="gray normal-text">
        Trong bước tiếp theo, bạn sẽ xác định xem OnCX có thể làm gì với Trang mà bạn đã chọn.
      </div>
      <div className="body">
        <div className="item-wrapper">
          <span>Tất cả Trang (3)</span>
          <Checkbox />
        </div>
        <div className="item-wrapper">
          <div className="item-info">
            <div className="black text-item">SCC - SMART COMMAND CENTER</div>
            <div className="gray text-item">56189823128498127481280741</div>
          </div>
          <Checkbox />
        </div>
        <div className="item-wrapper">
          <div className="item-info">
            <div className="black text-item">SCC - SMART COMMAND CENTER</div>
            <div className="gray text-item">56189823128498127481280741</div>
          </div>
          <Checkbox />
        </div>
        <div className="item-wrapper">
          <div className="item-info">
            <div className="black text-item">SCC - SMART COMMAND CENTER</div>
            <div className="gray text-item">56189823128498127481280741</div>
          </div>
          <Checkbox />
        </div>
      </div>
      <div className="bot-wrapper">
        <div className="button-wrapper">
          <Button style={{ width: '100%' }} onClick={clickCancel}>Hủy</Button>
          <Button
            style={{ width: '100%', background: '#127ace' }}
            type="primary"
            onClick={clickContinue}
          >
            Tiếp
          </Button>
        </div>
        <div className="info-wrapper">
          <div className="gray smaller-text">
            <span className="blue">Chính sách quyền riêng tư</span> và{' '}
            <span className="blue">điều khoản</span> của OnCX
          </div>
          <div className="blue smaller-text">Trung tâm trợ giúp</div>
        </div>
      </div>
    </div>
  );
}

export default ModalStep2;
