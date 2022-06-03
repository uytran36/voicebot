import React, { useState } from 'react';
import { formatMessage, FormattedMessage } from 'umi';
import { Form, Input, Row, Col } from 'antd';
import {
  PhoneOutlined
} from '@ant-design/icons';

export default function CallDemo({ callDemo, id }) {
  const [phoneNumber, setPhoneNumber] = useState('')

  return (
    <Row justify="center">
      <Col span={20}>
        <Form>
          <Form.Item
            name="phone"
            style={{ paddingTop: '30px' }}
            label={<FormattedMessage id="pages.campaign-management.phone.number"/>}
            rules={[
              {
                pattern: new RegExp('^[0-9]{10,11}$'),
                message: <FormattedMessage id="pages.campaign-management.invalid.phone.number"/>,
                required: true,
              },
            ]}
          >
            <Input.Search
              onChange={(e) => setPhoneNumber(e.target.value)}
              onSearch={() => callDemo(id, phoneNumber)}
              enterButton={<PhoneOutlined />}
            />
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
