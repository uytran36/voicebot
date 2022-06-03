import React, { useEffect } from 'react';
import PT from 'prop-types';
import { Form } from 'antd';

RenderRootForm.propTypes = {
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  onFinish: PT.func.isRequired,
  initialValues: PT.instanceOf(Object),
}

RenderRootForm.defaultProps = {
  initialValues: {},
}

function RenderRootForm({ refForm, headers, children, onFinish, initialValues, ...props }) {

  const onFinishForm = React.useCallback(values => {
    onFinish({
      ...values
    });
    return null;
  }, [onFinish]);

  return (
    <Form form={refForm}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      initialValues={initialValues}
      onFinish={onFinishForm} {...props}>
      {children}
    </Form>
  )
}

export default RenderRootForm