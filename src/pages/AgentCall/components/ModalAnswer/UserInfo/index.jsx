import React from 'react';
import { Form, Input, Button } from 'antd';
import { MenuOutlined, PhoneFilled } from '@ant-design/icons';
import style from './style.less';

const UserInfo = () => {
  return (
    <div className={style.body}>
      <div className={style.bodyWrapper}>
        <div className={style.header}>
          <span>Thông tin khách hàng</span>
        </div>
        <div className={style.formWrapper}>
          <Form className={style.form}>
            <Form.Item label={<span>Tên khách hàng</span>}>
              <Input style={{ background: 'transparent', color: '#fff', marginBottom: '10px' }} defaultValue="Nguyen Thu Huong" />
            </Form.Item>
            <Form.Item label={<span>Số điện thoại</span>}>
              <Input style={{ background: 'transparent', color: '#fff', marginBottom: '10px' }} defaultValue="+84 123 456 321"/>
            </Form.Item>
            <Form.Item label={<span>Email</span>}>
              <Input style={{ background: 'transparent', color: '#fff', marginBottom: '10px' }} defaultValue="minhpd@fpt.com.vn"/>
            </Form.Item>
            <Form.Item label={<span>Địa chỉ</span>}>
              <Input style={{ background: 'transparent', color: '#fff', marginBottom: '10px' }} defaultValue="FTEL.HN"/>
            </Form.Item>
            <Form.Item label={<span>Ghi chú</span>}>
              <Input.TextArea
                style={{ background: 'transparent', color: '#fff', marginBottom: '10px' }}
              />
            </Form.Item>
          </Form>
        </div>
        <div className={style.save}>
          <Button style={{ height: 'auto', background: '#0086F1', border: 'none' }}>
            <span>Lưu</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
