import React from 'react';
import PT from 'prop-types';
import {
  Row,
  Col,
  Typography,
  Button,
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Upload,
  Rate,
  Checkbox,
  Input,
  ConfigProvider,
  Avatar,
} from 'antd';
import style from './style.less';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';

function ExampleLiveChat() {
  return (
    <div className={style.bodyWrapper}>
      <div className={style.header}>
        <UserOutlined style={{ fontSize: '18px' }}/>
        <span>Hỗ trợ trực tuyến</span>
      </div>
      <div className={style.content}>
        <div className={style.time}><span>15:00</span></div>
        <div className={style.chat}>
          <div className={style.fromWrapper}>
            <div className={style.from}>
              <span>Chào mừng bạn đến với hệ thống SCC</span>
            </div>
          </div>
          <div className={style.toWrapper}>
            <div className={style.to}>
              <span>Xin chào, tôi cần thông tin về sản phẩm X</span>
            </div>
          </div>
        </div>
        <div className={style.chat}>
          <div className={style.fromWrapper}>
            <div className={style.from}>
              <span>Chào mừng bạn đến với hệ thống SCC</span>
            </div>
          </div>
          <div className={style.toWrapper}>
            <div className={style.to}>
              <span>Xin chào, tôi cần thông tin về sản phẩm X</span>
            </div>
          </div>
        </div>
        <div className={style.input}>
          <Input/>
        </div>
      </div>
    </div>
  );
}

export default ExampleLiveChat;
