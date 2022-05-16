import React from 'react';
import PT from 'prop-types';
import { Form } from 'antd';

RenderRootForm.propTypes = {
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  onFinish: PT.func.isRequired,
}

function RenderRootForm({ children, onFinish, ...props }) {
  const [refForm] = Form.useForm();

  const onFinishForm = React.useCallback(values => {
    onFinish({
      ...values,
    })
    return null;
  }, [onFinish]);

  return (
    <Form form={refForm} layout='vertical' onFinish={onFinishForm} {...props}>
      {children}
    </Form>
  )
}

export default RenderRootForm