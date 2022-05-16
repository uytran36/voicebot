import React, { useEffect } from 'react';
import { Form } from 'antd';
import PT from 'prop-types';

const layout = {
  labelCol: { xs: { span: 24 }, sm: { span: 7 }, md: { span: 8 }, lg: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 12 }, md: { span: 12 }, lg: { span: 12 } },
};

RootForm.propTypes = {
  children: PT.oneOfType([PT.node, PT.arrayOf(PT.node)]).isRequired,
  onFinish: PT.func.isRequired,
  initialValues: PT.instanceOf(Object).isRequired,
  campaign2: PT.shape({
    campaignName: PT.string,
    voiceSelect: PT.string,
  }).isRequired,
};

function RootForm({ children, onFinish, initialValues }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (children && initialValues) {
      form.resetFields();
    }
  }, [form, children, initialValues]);

  return (
    <Form {...layout} form={form} onFinish={onFinish} initialValues={initialValues}>
      {children}
    </Form>
  );
}

export default RootForm;
