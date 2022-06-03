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

ModalStep3.propTypes = {
  clickDone: PT.func.isRequired,
  clickBack: PT.func.isRequired,
  clickCancel: PT.func.isRequired,
};

function ModalStep3(props) {
  const { clickDone, clickBack, clickCancel } = props;

  return (
    <div className="body-wrapper-3">
      <div className="message-wrapper">
        <InfoCircleFilled className="icon-info" />
        <div className="gray normal-text">
          OnCX có thể không hoạt động đúng nếu bạn tắt các tùy chọn này.
        </div>
      </div>
      <div className="body">
        <div className="item-wrapper">
          <div className="item-info">
            <div className="black text-item">
              Truy cập quảng cáo Facebook của bạn và các số liệu thống kê liên quan
            </div>
            {/* <div className="gray text-item">56189823128498127481280741</div> */}
          </div>
          <Switch />
        </div>
        <div className="item-wrapper">
          <div className="item-info">
            <div className="black text-item">Nhập địa chỉ email của bạn</div>
            <div className="gray text-item">qquang51@gmail.com</div>
          </div>
          <Switch />
        </div>
        <div className="item-wrapper">
          <div className="item-info">
            <div className="black text-item">
              Truy cập vào trang cá nhân và bài viết từ tài khoản Instagram kết nối với Trang của
              bạn
            </div>
            <div className="gray text-item">Chưa chọn tài khoản Instagram Business</div>
          </div>
          <Switch />
        </div>
        <div className="item-wrapper">
          <div className="item-info">
            <div className="black text-item">
              Quản lý bình luận cho tài khoản Instagram kết nối với Trang của bạn
            </div>
            <div className="gray text-item">Chưa chọn tài khoản Instagram Business</div>
          </div>
          <Switch />
        </div>
      </div>
      <div className="bot-wrapper">
        <div className="button-wrapper">
          <Button onClick={clickCancel}>Hủy</Button>
          <div className="flex-button">
            <Button onClick={clickBack}>Quay lại</Button>
            <Button style={{ background: '#127ace' }} type="primary" onClick={clickDone}>
              Xong
            </Button>
          </div>
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

export default ModalStep3;
