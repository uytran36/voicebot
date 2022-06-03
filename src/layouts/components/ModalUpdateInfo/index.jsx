import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'umi';
import { Form, Row, Col, Input, message } from 'antd';
import { Redirect, connect } from 'umi';
import { ConsoleSqlOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { requestUpdateUser } from '@/services/user-management';

const HeaderNode = () => (
  <div style={{ textAlign: 'center' }}>
    <strong>Cập nhật thông tin</strong>
  </div>
);

function FirstLoginPopUpBody(props) {
  const [isVisible, setIsVisable] = React.useState(true);

  const handleCancel = () => {
    setIsVisable(false);
  };

  const [refForm] = Form.useForm();
  const { dispatch } = props;
  let { tokenGateway, currentUser } = props.user;

  const headers = React.useMemo(
    () => ({
      Authorization: `${tokenGateway}`,
    }),
    [tokenGateway],
  );

  const userId = currentUser.user_id;

  const updateUser = async (header, data) => {
    const hide = message.loading('Đang cập nhật');
    try {
      const cloneValues = { ...data };
      delete cloneValues.email;
      delete cloneValues.role_id;
      const res = await requestUpdateUser(header, cloneValues, 'update-my-profile');
      if (res.success) {
        hide();
        message.success('Cập nhật user thành công');
        return data;
      } else throw new Error((res && res?.error?.msg) || 'Có lỗi khi cập nhật user');
    } catch (err) {
      hide();
      message.error(err.toString());
      return false;
    }
  };

  const onFinishForm = React.useCallback(async () => {
    const values = await refForm.validateFields();
    const dataForm = values;
    const result = await updateUser(headers, dataForm);
    if (result) {
      setIsVisable(false);
      dispatch({
        type: 'user/save',
        payload: {
          currentUser: {
            ...currentUser, // test
            ...result,
          },
        },
      });
    }
  }, [userId]);

  return (
    <Modal
      title={<HeaderNode />}
      closable={false}
      titleProps={{ style: { display: 'none' } }}
      visible={isVisible}
      onCancel={() => handleCancel()}
      onOk={onFinishForm}
    >
      <Form
        form={refForm}
        layout="vertical"
        initialValues={{
          ...currentUser,
        }}
      >
        <Row gutter={[30, 0]}>
          <Col span={12}>
            <Form.Item
              name="full_name"
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage id="pages.user-management.name" defaultMessage="Họ và tên" />
                </span>
              }
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="unit"
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage id="pages.user-management.unit" defaultMessage="Đơn vị" />
                </span>
              }
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="department"
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage
                    id="pages.user-management.department"
                    defaultMessage="Phòng ban"
                  />
                </span>
              }
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="branch"
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage id="pages.user-management.branch" defaultMessage="Chi nhánh" />
                </span>
              }
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="position_ftel"
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage
                    id="pages.user-management.position"
                    defaultMessage="Chức danh FPT"
                  />
                </span>
              }
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="employee_code"
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage id="pages.user-management.id" defaultMessage="Mã nhân viên" />
                </span>
              }
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="branch_number"
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage
                    id="pages.user-management.ipPhone"
                    defaultMessage="Số máy nhánh"
                  />
                </span>
              }
              rules={[
                {
                  pattern: '^[0-9]+$',
                  message: 'Wrong format!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="phone_number"
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage
                    id="pages.user-management.phone"
                    defaultMessage="Số điện thoại"
                  />
                </span>
              }
              rules={[
                () => ({
                  validator(_, value) {
                    const regexPhone = /(((\+|)84)|0)+([0-9]{9,10})\b/;
                    if (regexPhone.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Không phải định dạng số điện thoại'));
                  },
                }),
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="email"
              style={{ display: 'block' }}
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage
                    id="pages.user-management.username"
                    defaultMessage="Tên người dùng"
                  />
                </span>
              }
            >
              <Input disabled />
            </Form.Item>
          </Col>

          <Form.Item name="role_id" style={{ display: false }}></Form.Item>
        </Row>
      </Form>
    </Modal>
  );
}

export default connect(({ user }) => ({ user }))(FirstLoginPopUpBody);
