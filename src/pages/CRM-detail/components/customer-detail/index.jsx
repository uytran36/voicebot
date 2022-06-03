import React from 'react';
import PT from 'prop-types';
import { Row, Col, Typography } from 'antd';
import BaseInfo from './base-info';
import InteractiveHistory from './interactive-history';
import { LeftOutlined } from '@ant-design/icons';

CustomerDetail.propTypes = {
  customer: PT.instanceOf(Object).isRequired,
  history: PT.instanceOf(Object).isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  wsId: PT.string,
  permissions: PT.shape({
    manage: PT.bool.isRequired,
    update: PT.bool.isRequired,
    onlyView: PT.bool.isRequired,
  }).isRequired,
}

function CustomerDetail({ customer, headers, history, wsId, permissions }) {
  return (
    <Row gutter={8}>
      <Col span={24}>
        <Typography.Title
          level={3}
          onClick={() => history.push('/customer-relationship-management/customer-management')}
        >
          <LeftOutlined />
          Khách hàng: {`${customer.name}`}
        </Typography.Title>
      </Col>
      <Col span={6}>
        <BaseInfo headers={headers} permissions={permissions} />
      </Col>
      <Col span={18}>
        <InteractiveHistory
          customer={customer}
          phones={customer?.phones?.map((phone) => phone.phone) || ''}
          headers={headers}
          wsId={wsId}
          permissions={permissions}
        />
      </Col>
    </Row>
  );
}

export default CustomerDetail;
