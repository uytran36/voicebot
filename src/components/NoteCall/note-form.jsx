import React from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import { Form, Input, Row, Col } from 'antd';
import { NoteUpdateContext } from '@/contexts/note.context';
import {
  requestUpdateOmniContactListNormalizationEditInfo,
  requestAddNoteToCalling,
} from '@/services/call-center';
import styles from './styles.less';

const dumb = () => {};

export async function useHandleFinish({ values, headers = {} }, cb = dumb) {
  try {
    const { note, sdt, callId, username, ...other } = values;
    await requestUpdateOmniContactListNormalizationEditInfo(headers, {
      ...other,
      phones: [
        {
          phone: sdt,
          isFirstNumber: true,
        },
      ],
    });
    await requestAddNoteToCalling(
      {
        sip_call_id: callId,
      },
      {
        agent_username: username,
        call_note: note,
        customer_name: other.name,
      },
      headers,
    );
    cb();
  } catch (err) {
    console.error(err);
  }
  return null;
}

NoteForm.propTypes = {
  layout: PT.shape({
    span: PT.oneOfType([PT.instanceOf(Object), PT.number]),
    xs: PT.oneOfType([PT.instanceOf(Object), PT.number]),
    sm: PT.oneOfType([PT.instanceOf(Object), PT.number]),
    md: PT.oneOfType([PT.instanceOf(Object), PT.number]),
    lg: PT.oneOfType([PT.instanceOf(Object), PT.number]),
    xl: PT.oneOfType([PT.instanceOf(Object), PT.number]),
    xxl: PT.oneOfType([PT.instanceOf(Object), PT.number]),
  }),
  labelFormItemClassName: PT.string,
  isCallMonitor: PT.bool.isRequired,
  valueNotes: PT.instanceOf(Object),
  currentUser: PT.shape({
    username: PT.string,
  }).isRequired,
  callManagement: PT.shape({
    callId: PT.string,
    numberCall: PT.oneOfType([PT.string, PT.number]),
    customerInfo: PT.object,
  }).isRequired,
};

NoteForm.defaultProps = {
  layout: { span: 12 },
  labelFormItemClassName: '',
  valueNotes: {},
};

function NoteForm({
  layout,
  labelFormItemClassName,
  isCallMonitor,
  valueNotes,
  callManagement,
  currentUser,
}) {
  const [form] = Form.useForm();
  const setValues = React.useContext(NoteUpdateContext);

  const { username } = currentUser;
  const { callId, numberCall, customerInfo } = callManagement;

  const handleValuesChange = React.useCallback(
    (_, allFields) => {
      setValues({
        ...allFields,
        sdt: numberCall,
        callId,
        username,
      });
    },
    [callId, numberCall, setValues, username],
  );

  React.useEffect(() => {
    if (setValues) {
      setValues({
        sdt: numberCall,
        callId,
        username,
        ...customerInfo,
      });
    }
  }, [callId, numberCall, setValues, username, customerInfo]);

  React.useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      ...customerInfo,
      sdt: numberCall,
    });
  }, [customerInfo, form, numberCall]);

  return (
    <Form
      form={form}
      layout="vertical"
      className={styles.formWrapper}
      initialValues={valueNotes}
      onValuesChange={handleValuesChange}
    >
      <Row gutter={[24, 0]}>
        <Col {...layout}>
          <Form.Item
            name="name"
            label={
              <span className={labelFormItemClassName} style={{ color: '#FFFFFF' }}>
                Tên khách hàng
              </span>
            }
            style={{ marginBottom: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col {...layout}>
          <Form.Item
            name="sdt"
            label={
              <span className={labelFormItemClassName} style={{ color: '#FFFFFF' }}>
                Số điện thoại
              </span>
            }
            style={{ marginBottom: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[24, 12]}>
        <Col {...layout}>
          <Form.Item
            name="email"
            label={
              <span className={labelFormItemClassName} style={{ color: '#FFFFFF' }}>
                Email
              </span>
            }
            style={{ marginBottom: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col {...layout}>
          <Form.Item
            name="addresses"
            label={
              <span className={labelFormItemClassName} style={{ color: '#FFFFFF' }}>
                Địa chỉ
              </span>
            }
            style={{ marginBottom: 24 }}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      {!isCallMonitor && (
        <Form.Item
          name="note"
          label={
            <span className={labelFormItemClassName} style={{ color: '#FFFFFF' }}>
              Ghi chú
            </span>
          }
          style={{ marginBottom: 24 }}
        >
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
        </Form.Item>
      )}
    </Form>
  );
}

export default connect(({ user, callManagement }) => ({
  currentUser: user.currentUser,
  callManagement,
}))(NoteForm);
