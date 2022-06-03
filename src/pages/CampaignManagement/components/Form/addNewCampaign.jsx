import React, { useCallback, memo } from 'react';
import { formatMessage, connect, FormattedMessage } from 'umi';
import PT from 'prop-types';
import { Form, Input, Typography } from 'antd';

RenderForm.propTypes = {
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]),
  getValues: PT.func,
  initialValues: PT.string.isRequired,
  settings: PT.shape({ primaryColor: PT.string, }).isRequired,
  error: PT.instanceOf(Object).isRequired,
};

RenderForm.defaultProps = {
  children: <div />,
  getValues: () => {},
};

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 10 },
};

 function RenderForm({ children, getValues, initialValues, error, settings: {primaryColor } }) {
  const handleOnFinish = useCallback(
    (values) => {
      // hàm getValues có thể trả về giá trị để xử lý logic sau getValues
      getValues(values);
    },
    [getValues],
  );

  return (
    <Form
      onFinish={handleOnFinish}
      initialValues={{
        name: initialValues,
      }}
      layout="vertical"
      {...layout}
    >
      <Typography.Title style={{color: primaryColor || '#000'}} level={3}>{<FormattedMessage id="pages.campaign-management.create.campaign"/>}</Typography.Title>
      <Form.Item
        rules={[
          {
            required: true,
            message: <FormattedMessage id="pages.campaign-management.empty.message"/>,
          },
        ]}
        name="name"
        label={<Typography.Text>Tên chiến dịch</Typography.Text>}
        // hasFeedback
        help={error.message}
        validateStatus={error.type}
      >
        <Input placeholder={formatMessage({id: "pages.campaign-management.name"})} />
      </Form.Item>
      {children}
    </Form>
  );
}

export default connect(({settings}) => ({ settings })) (RenderForm)
