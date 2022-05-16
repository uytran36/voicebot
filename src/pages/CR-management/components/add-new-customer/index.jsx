import React, { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { Form, Input, Select, DatePicker, Row, Col } from 'antd';
import { genders } from './hardcode';
import { requestGetGroups } from '@/services/crm';
import moment from 'moment';

function AddNewCustomer() {
  const intl = useIntl();
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    requestGetGroups().then(res => {
      if (res?.msg === "SUCCESS") {
        setGroups(res.response.data);
        return null;
      }
      throw new Error('ERROR~');
    }).catch(err => {
      console.error(err);
    })
  }, [])

  return (
    <React.Fragment>
      <Form.Item
        label="Tên người dùng"
        name="name"
        rules={[
          {
            required: true,
            message: intl.formatMessage({
              id: 'form.select.search.required'
            }),
          },
        ]}
        validateTrigger={['onChange', 'onBlur']}
      >
        <Input />
      </Form.Item>
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item
            label="Số điện thoại"
            name="phones"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'form.select.search.required'
                }),
              },
            ]}
            validateTrigger={['onChange', 'onBlur']}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={10}>
        <Col span={8}>
          <Form.Item
            name="gender"
            label="Giới tính"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Select options={genders.map((gender) => ({ value: gender, label: gender }))} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="alias"
            label="Danh xưng"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <DatePicker style={{width: '100%'}} disabledDate={(current) => {
              return current && current > moment().endOf('day')
            }} />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="addresses" label="Địa chỉ">
        <Input />
      </Form.Item>
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item name="facebook" label="Facebook">
            <Input addonBefore="https://" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="zalo" label="ZaloID">
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label="Nhóm" name="groups">
        <Select 
          allowClear
          mode='multiple'
          options={groups.map(elm => ({label: elm.name, value: `${elm.id}-${elm.name}`}))}
        />
      </Form.Item>
      <Form.Item label="Ghi chú" name="description">
        <Input.TextArea />
      </Form.Item>
    </React.Fragment>
  );
}

export default AddNewCustomer;
