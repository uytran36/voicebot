import React, { useEffect, useRef, useState } from 'react';
import PT from 'prop-types';
import { Row, Col, Typography, Button, Form, Input, message } from 'antd';
import { requestAddLicense } from '@/services/user';
import styles from './styles.less';

const { Title, Paragraph } = Typography;

ActiveLicense.propTypes = {
  headers: PT.instanceOf(Object).isRequired,
  dispatch: PT.func.isRequired,
};

function ActiveLicense(props) {
  const [form] = Form.useForm();
  const { headers, dispatch } = props;

  const layoutInput = {
    labelCol: {
      xxl: { span: 4, offset: 0 },
      xl: { span: 5, offset: 0 },
      lg: { span: 6, offset: 0 },
      md: { span: 7, offset: 0 },
      sm: { span: 8, offset: 0 },
      // xs: { span: 24, offset: 0 },
    },
    wrapperCol: {
      xxl: { span: 20, offset: 0 },
      xl: { span: 19, offset: 0 },
      lg: { span: 18, offset: 0 },
      md: { span: 17, offset: 0 },
      sm: { span: 16, offset: 0 },
      // xs: { span: 24, offset: 5 },
    },
  };

  const onFinish = async (values) => {
    // return console.log(values)
    requestAddLicense(headers, values).then((res) => {
      if (res?.status === 'OK') {
        // setTimeout(() => {
        //   dispatch({
        //     type: 'login/logout',
        //   });
        // }, 3000);
        message.success('Kích hoạt license thành công!!!');
        return setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
      return message.error('Kích hoạt license thất bại');
    });
  };

  return (
    <div className={styles.formWrapper}>
      <Title level={2} style={{ fontWeight: 'bolder' }}>
        Kích hoạt License Key
      </Title>
      <div className={styles.form}>
        <Form form={form} onFinish={onFinish}>
          {/* <Col span={11}> */}
          <Form.Item
            name="license_access"
            label="License Access"
            labelAlign="right"
            {...layoutInput}
            rules={[
              {
                required: true,
                message: `This field is required.`,
              },
            ]}
          >
            <Input placeholder="example" />
          </Form.Item>
          <Form.Item
            name="license_access_key"
            label="License Access Key"
            labelAlign="right"
            {...layoutInput}
            rules={[
              {
                required: true,
                message: `This field is required.`,
              },
            ]}
          >
            <Input placeholder="example" />
          </Form.Item>
          <Form.Item
            name="license_context_key"
            label="License Context Key"
            labelAlign="right"
            {...layoutInput}
            rules={[
              {
                required: true,
                message: `This field is required.`,
              },
            ]}
          >
            <Input placeholder="example" />
          </Form.Item>
          <Form.Item
            name="license_key"
            label="License Key"
            labelAlign="right"
            {...layoutInput}
            rules={[
              {
                required: true,
                message: `This field is required.`,
              },
            ]}
          >
            <Input placeholder="example" />
          </Form.Item>
          <Form.Item
            {...layoutInput}
            label={<span></span>}
            colon={false}
            style={{ textAlign: 'left' }}
          >
            <Button style={{ background: '#127ace', color: '#fff' }} htmlType="submit">
              Kích hoạt License
            </Button>
          </Form.Item>
          {/* </Col> */}
        </Form>
      </div>
    </div>
  );
}

export default ActiveLicense;
