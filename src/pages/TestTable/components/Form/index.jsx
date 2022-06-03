import React, { useCallback } from 'react';
import { FormattedMessage } from 'umi';
import { Form, Input } from 'antd';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

function FormRole() {
  return (
    <Form {...layout}>
      <Form.Item
        name="name"
        label={
          <FormattedMessage
            defaultMessage="Role Name"
            id="pages.user-management.form.label.role-name"
          />
        }
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label={
          <FormattedMessage
            defaultMessage="Role Description"
            id="pages.user-management.form.label.role-description"
          />
        }
      >
        <Input.TextArea />
      </Form.Item>
    </Form>
  );
}

export default FormRole;
