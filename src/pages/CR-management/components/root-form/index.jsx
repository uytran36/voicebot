import React, { useCallback } from 'react';
import { Form } from 'antd';
import PT from 'prop-types';

RootForm.propTypes = {
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  onFinish: PT.func.isRequired,
}

function RootForm({ children, onFinish, ...props}) {
  const handleFinish = useCallback(values => {
    onFinish(values)
  }, [onFinish])

  return (
    <Form onFinish={handleFinish} layout='vertical' {...props}>
      {children}
    </Form>
  )
}

export default RootForm;