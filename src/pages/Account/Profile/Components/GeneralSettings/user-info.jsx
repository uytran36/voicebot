import React from 'react';
import { Form, Input } from 'antd';

function UserInfomation() {
  return (
    <React.Fragment>
      <Form.Item name="username" label="Tên tài khoản">
        <Input disabled />
      </Form.Item>
      <Form.Item name="id" label="Mã nhân viên">
        <Input disabled />
      </Form.Item>
      <Form.Item name="createdAt" label="Ngày khởi tạo">
        <Input disabled />
      </Form.Item>
      <Form.Item name="roles" label="Vai trò">
        <Input disabled />
      </Form.Item>
      <Form.Item name="ipPhone" label="Số máy nhánh">
        <Input disabled />
      </Form.Item>
    </React.Fragment>
  )
}

export default UserInfomation
