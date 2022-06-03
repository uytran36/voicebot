import React, { useState } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { formatMessage, FormattedMessage } from 'umi';
import { CopyOutlined } from '@ant-design/icons';
import PT from 'prop-types';

DuplicateCampaign.propTypes = {
  duplicateCampaign: PT.func.isRequired,
};

export default function DuplicateCampaign({ duplicateCampaign }) {
  const [nameCampaign, setNameCampaign] = useState('')

  return (
    <Row justify="center">
      <Col span={20}>
        <Form.Item
          style={{ paddingTop: '30px' }}
          label={<FormattedMessage id="pages.campaign-management.campaign.name"/>}
          rules={[
            {
              pattern: new RegExp('^[0-9]{3,11}$'),
              message: 'Phone invalid',
            },
          ]}
        >
          <Input.Search
            onChange={(e) => setNameCampaign(e.target.value)}
            onSearch={() => duplicateCampaign(nameCampaign)}
            enterButton={<CopyOutlined />}
          />
        </Form.Item>
      </Col>
    </Row>
  );
}
