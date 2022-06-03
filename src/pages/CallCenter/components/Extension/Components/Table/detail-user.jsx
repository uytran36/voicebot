import React from 'react';
import { FormattedMessage } from 'umi';
import { Form, Row, Col, Input, Select, Checkbox } from 'antd';
import { connect } from 'umi';

function DetailUser({ headers, isEdit, roles, record, user }) {
  const [inputPassValue, setInputPassValue] = React.useState('');
  const [isAgent, setIsAgent] = React.useState();

  const onCheckRepeat = async (e) => {
    if (!e.target.checked) setInputPassValue('');
    setIsAgent(e.target.checked);
  };

  return (
    <Row gutter={[30, 0]}>
      <Col span={12}>
        <Form.Item
          name="branch_number"
          label="Extension"
          rules={[
            {
              pattern: '^[0-9]+$',
              message: 'Wrong format!',
            },
            { required: true, message: 'Vui lòng nhập extension!' },
          ]}
        >
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="agentPass"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            placeholder="Nhập mật khẩu"
            value={inputPassValue}
            onChange={(e) => setInputPassValue(e.target.value)}
          />
          <input
            value={inputPassValue}
            onChange={(e) => setInputPassValue(e.target.value)}
            type="hidden"
          />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="phone_number" label="Queue">
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="full_name" label="Tổng đài viên">
          <Select
            showSearch
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => option.children.includes(input)}
            filterSort={(optionA, optionB) =>
              optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
            }
          >
            <Option value="1">Not Identified</Option>
            <Option value="2">Closed</Option>
            <Option value="3">Communicated</Option>
            <Option value="4">Identified</Option>
            <Option value="5">Resolved</Option>
            <Option value="6">Cancelled</Option>
          </Select>
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item name="unit" label="Mô tả">
          <Input />
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

//export default DetailUser;
export default connect(({ user }) => ({ user }))(DetailUser);
