import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'umi';
import { Form, Row, Col, Input, Select, DatePicker, Button } from 'antd';
import { requestGetListExtensions } from '@/services/call-center';

DetailUser.propTypes = {
  roles: PT.instanceOf(Array).isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  isEdit: PT.bool,
};

DetailUser.defaultProps = {
  isEdit: false,
};

function DetailUser({ headers, isEdit, roles, record }) {
  const [extensions, setExtensions] = React.useState([]);
  const [multipleRole, setMultipleRole] = React.useState([]);

  React.useEffect(() => {
    requestGetListExtensions(headers, {
      status: 'available',
    })
      .then((resExt) => {
        if (!resExt.success) {
          throw new Error(`ERROR~`);
        }
        setExtensions(resExt.data);
      })
      .catch((err) => {
        setExtensions([]);
      });
  }, [headers]);

  const handleSelectRole = React.useCallback((value) => {
    setMultipleRole(value);
  }, []);

  return (
    <Row gutter={[30, 0]}>
      <Col span={12}>
        <Form.Item
          name="full_name"
          label={
            <span style={{ color: '#000' }}>
              <FormattedMessage id="pages.user-management.name" defaultMessage="Họ và tên" />
            </span>
          }
          // rules={[
          //   {
          //     pattern: new RegExp(/^[^0-9\]|\\/:;"'<>,&.?~`#!(${%)\-_@^*+=}[]+$/),
          //     message: 'Chỉ nhập chữ cái không chứa số hay kí tự đặc biệt',
          //   },
          // ]}
        >
          <Input disabled={isEdit} />
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
          <Input disabled={isEdit && record?.unit} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="department"
          label={
            <span style={{ color: '#000' }}>
              <FormattedMessage id="pages.user-management.department" defaultMessage="Phòng ban" />
            </span>
          }
        >
          <Input disabled={isEdit && record?.department} />
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
          <Input disabled={isEdit && record?.branch} />
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
          <Input disabled={isEdit && record?.employee_code} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="branch_number"
          label={
            <span style={{ color: '#000' }}>
              <FormattedMessage
                id="pages.user-management.extension"
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
              <FormattedMessage id="pages.user-management.phone" defaultMessage="Số điện thoại" />
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
          name="username"
          label={
            <span style={{ color: '#000' }}>
              <FormattedMessage
                id="pages.user-management.username"
                defaultMessage="Tên người dùng"
              />
            </span>
          }
        >
          <Input disabled={isEdit} />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item
          name="role_id"
          label={
            <span style={{ color: '#000' }}>
              <FormattedMessage id="pages.user-management.role" defaultMessage="Vai trò" />
            </span>
          }
        >
          <Select
            //mode="multiple"
            allowClear
            onChange={handleSelectRole}
            options={[...roles].map((elm) => ({
              key: elm.id,
              value: elm.id,
              label: elm.role,
            }))}
          />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item
          name="is_active"
          label={
            <span style={{ color: '#000' }}>
              <FormattedMessage id="pages.user-management.status" defaultMessage="Trạng thái" />
            </span>
          }
        >
          <Select>
            <Select.Option key={true} value={true}>
              active
            </Select.Option>
            <Select.Option key={false} value={false}>
              inactive
            </Select.Option>
          </Select>
        </Form.Item>
      </Col>

      <Form.Item name="email" style={{ display: 'none' }}>
        <Input />
      </Form.Item>
    </Row>
  );
}

export default DetailUser;
