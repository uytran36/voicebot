import React from 'react';
import PT from 'prop-types';
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
      <Col span={24}>
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

      <Col span={24}>
        <Form.Item name="unit" label="Mô tả">
          <Input />
        </Form.Item>
      </Col>
    </Row>
  );
}

//export default DetailUser;
export default connect(({ user }) => ({ user }))(DetailUser);
