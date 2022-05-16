import React, { useCallback, memo, useState } from 'react';
import PT from 'prop-types';
import { Form, Input, Typography, notification } from 'antd';
import { formatMessage, FormattedMessage } from 'umi';
import styles from './styles.less';
import { requestContactHistories } from '@/pages/Sandardized/service';

CreateNewDoc.propTypes = {
  getValues: PT.func.isRequired,
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  valueForm: PT.instanceOf(Object).isRequired,
  user: PT.instanceOf(Object).isRequired,
  headers: PT.instanceOf(Object).isRequired,
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

function CreateNewDoc({ getValues, children, valueForm, user, headers }) {
  const [formError, setFormError] = useState({});

  const handleOnFinish = useCallback(
    async (values) => {
      try {
        const res = await requestContactHistories(
          headers,
          {
            filter: {
              where: {
                tentailieu: values.nameFile,
                // "$or": [
                //   {"xlsContactObject.filename_raw":`${values.nameFile}.csv`},
                //   {"xlsContactObject.filename_raw":`${values.nameFile}.xlsx`}
                // ]
              },
            },
          },
        );
        if (res.length > 0) {
          setFormError({
            validateStatus: 'error',
            help: `Tên file #${values.nameFile} đã tồn tại`,
          });
        } else {
          setFormError({
            validateStatus: 'success',
            help: '',
          });
          getValues(values);
        }
      } catch (err) {
        notification.error(err.toString());
      }
    },
    [getValues, user],
  );

  return (
    <Form
      {...layout}
      onFinish={handleOnFinish}
      className={styles.form}
      layout="vertical"
      initialValues={{ nameFile: valueForm.nameFile }}
    >
      <Typography.Title level={3} className={styles.title}>
        {/* {formatMessage({ id: "pages.campaign.create.new.document" })} */}
        <FormattedMessage id="pages.campaign.create.new.document" />
      </Typography.Title>
      <Typography.Paragraph className={styles.subTitle}>
        {/* {formatMessage({ id: "pages.campaign.name.file.action" })} */}
        <FormattedMessage id="pages.campaign.name.file.action" />
      </Typography.Paragraph>
      <Typography.Paragraph className={styles.warn}>
        <Typography.Text className={`${styles.textWarn} ${styles.bold}`}>
          <FormattedMessage id="pages.campaign.note" />
        </Typography.Text>
        <Typography.Text>
          {/* {formatMessage({ id: "pages.campaign.note.content" })} */}
          <FormattedMessage id="pages.campaign.note.content" />
        </Typography.Text>
      </Typography.Paragraph>
      <Form.Item
        name="nameFile"
        // hasFeedback
        rules={[
          {
            required: true,
            message: <FormattedMessage id="page.campaign.name.empty"/>
          },
        ]}
        label={
          <span className={`${styles.label} ${styles.bold}`}>
            <FormattedMessage id="pages.campaign.name.file" />
          </span>
        }
        validateStatus={formError?.validateStatus}
        help={formError?.help}
      >
        <Input allowClear />
      </Form.Item>
      {children}
    </Form>
  );
}

export default memo(CreateNewDoc);
