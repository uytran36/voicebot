import React, { useEffect, useState, useRef } from 'react';
import PT from 'prop-types';
import {
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  Image,
  message,
  Card,
  Divider,
  Empty,
} from 'antd';
import './style.less';
// import FacebookLogin from 'react-facebook-login';

const { Title, Paragraph } = Typography;

ModalStep1.propTypes = {
  clickLogin: PT.func.isRequired,
  clickCancel: PT.func.isRequired,
};

function ModalStep1(props) {
  const { clickLogin, clickCancel } = props;
  return (
    <div className="body-wrapper-1">
      <div className="top-wrapper">
        <div className="gray normal-text">ONCX sẽ nhận được tên và ảnh đại diện của bạn.</div>
        <div className="gray normal-text">
          ONCX sẽ không thể đăng lên Facebook của bạn khi bạn chưa cho phép.
        </div>
        <div className="button-wrapper">
          <Button style={{ width: '100%', height: 30 }} onClick={clickCancel}>
            Hủy
          </Button>
          {/* <Button
            style={{ width: '100%', background: '#127ace' }}
            type="primary"
            onClick={clickLogin}
          >
            Đăng nhập dưới tên Quang Anh
          </Button> */}
          <div style={{ width: '100%', height: 30 }}>
            {/* <FacebookLogin
              appId="212228450857992"
              cssClass="fb-login-button"
              autoLoad={true}
              fields="name,email,picture"
              onClick={() => console.log('ok')}
              callback={(response) => console.log(response)}
            /> */}
          </div>
        </div>
        <div className="gray normal-text">
          Không phải Quang Anh?{' '}
          <span className="blue-bold left8">Đăng nhập bằng tài khoản khác</span>
        </div>
      </div>
      <div className="bot-wrapper">
        <div className="gray smaller-text">
          Bằng cách tiếp tục, OnCX sẽ nhận được quyền truy cập liên tục vào thông tin mà bạn chia
          sẻ. Đồng thời, Facebook sẽ ghi lại thời điểm OnCX truy cập vào thông tin đó.{' '}
          <span className="blue">Tìm hiểu thêm</span> về lực chọn chia sẻ này và các cài đặt mà bạn
          có.
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

export default ModalStep1;
