import React, { useCallback, memo } from 'react';
import PT from 'prop-types';
import { formatMessage, FormattedMessage } from 'umi';
import { Radio, Form, Typography } from 'antd';
import styles from './styles.less';

CreateMethodEnterFile.propTypes = {
    getValues: PT.func.isRequired,
    children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
    valueForm: PT.instanceOf(Object).isRequired,
  };


const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

function CreateMethodEnterFile({ getValues, children, valueForm }) {
  const handleOnFinish = useCallback(
    (values) => {
      getValues(values);
    },
    [getValues],
  );

  return (
    <Form
      onFinish={handleOnFinish}
      initialValues={{
        method: valueForm.method || 'excel',
      }}
      {...layout}
      layout="vertical"
      className={styles.form}
    >
      <Typography.Title level={3} className={styles.title}>
        {/* {formatMessage({ id: "pages.campaign.method" })} */}
        <FormattedMessage id="pages.campaign.method"/>
      </Typography.Title>
      <Typography.Paragraph className={styles.subTitle}>
        {/* {formatMessage({ id: "pages.campaign.choose.method" })} */}
        <FormattedMessage id="pages.campaign.choose.method"/>
      </Typography.Paragraph>
      <Form.Item name="method">
        <Radio.Group>
          <Form.Item>
            <Radio value="excel">Excel</Radio>
          </Form.Item>
          <Form.Item>
            <Radio disabled value="sql">SQL</Radio>
          </Form.Item>
        </Radio.Group>
      </Form.Item>
      {children}
    </Form>
  );
}

export default memo(CreateMethodEnterFile);
