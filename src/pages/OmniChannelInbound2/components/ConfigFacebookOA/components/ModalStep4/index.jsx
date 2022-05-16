import React, { useEffect, useState, useRef } from 'react';
import PT from 'prop-types';
import {
  Row,
  Col,
  Typography,
  Button,
  Switch,
  Form,
  Input,
  Image,
  message,
  Card,
  Divider,
  Empty,
} from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';
import './style.less';

const { Title, Paragraph } = Typography;

ModalStep4.propTypes = {
  clickFinish: PT.func.isRequired,
};

function ModalStep4(props) {
  const { clickFinish } = props;

  return (
    <div className="body-wrapper-4">
      <div className="gray normal-text">
        Bạn có thể cập nhật những gì OnCX được làm trong phần Cài đặt tiện ích tích hợp cho doanh
        nghiệp trên ứng dụng Facebook.
      </div>
      <Button
        style={{ width: '100%', background: '#127ace' }}
        type="primary"
        onClick={clickFinish}
      >
        Hoàn thành
      </Button>
    </div>
  );
}

export default ModalStep4;
