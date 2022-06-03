import React from 'react';
import { Form, Input, Button } from 'antd';
import style from './style.less';

const UserInfo = () => {

  const handleSubmitForm = values => {
    console.log({values})
  }

  return (
    <div className={style['form-container']}>
      <p className={style['form-title']}>Ghi chú</p>
        <Form layout='vertical' className={style.form} onFinish={handleSubmitForm}>
          <Form.Item label={<span className={style['form-label']}>Tên khách hàng</span>}>
            <Input
              style={{ background: 'transparent', color: '#fff', marginBottom: '10px' }}
              defaultValue="Nguyen Thu Huong"
            />
          </Form.Item>
          <Form.Item label={<span className={style['form-label']}>Số điện thoại</span>}>
            <Input
              style={{ background: 'transparent', color: '#fff', marginBottom: '10px' }}
              defaultValue="+84 123 456 321"
            />
          </Form.Item>
          <Form.Item label={<span className={style['form-label']}>Email</span>}>
            <Input
              style={{ background: 'transparent', color: '#fff', marginBottom: '10px' }}
              defaultValue="minhpd@fpt.com.vn"
            />
          </Form.Item>
          <Form.Item label={<span className={style['form-label']}>Địa chỉ</span>}>
            <Input
              style={{ background: 'transparent', color: '#fff', marginBottom: '10px' }}
              defaultValue="FTEL.HN"
            />
          </Form.Item>
          <Form.Item label={<span className={style['form-label']}>Ghi chú</span>}>
            <Input.TextArea
              style={{ background: 'transparent', color: '#fff', marginBottom: '10px' }}
            />
          </Form.Item>
          <Form.Item style={{float: 'right'}}>
            <Button htmlType='submit' type='primary' >
              <span>Lưu ghi chú</span>
            </Button>
          </Form.Item>
        </Form>
    </div>
  );
};

export default UserInfo;
