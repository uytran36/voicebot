import { Button, Card, Col, Row, Select, Typography, Form, Input } from 'antd';
import DatePicker from '@/components/CustomDatePicker';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Table from './Table';

const fakeDataTable = [
  {
    id: '67098',
    is_visible: true,
    fanpage_name: 'Nhà thuốc FPT Long Châu',
    post_link: 'https://brenna.us',
    cus_name: 'Chu Hoàng Diệp',
    phone_number: '0123456789',
    content: 'Tìm sản phẩm trị mụn',
    comment_time: '31/01/2021 00:12:19',
    agent: null,
    response_time: null,
    is_responsed: false,
  },
  {
    id: '67098',
    is_visible: true,
    fanpage_name: 'Nhà thuốc FPT Long Châu',
    post_link: 'https://brenna.us',
    cus_name: 'Chu Hoàng Diệp',
    phone_number: '0123456789',
    content: 'Tìm sản phẩm trị mụn',
    comment_time: '31/01/2021 00:12:19',
    agent: 'SangTT9',
    response_time: '31/01/2021 00:12:19',
    is_responsed: true,
  },
  {
    id: '67098',
    is_visible: false,
    fanpage_name: 'Nhà thuốc FPT Long Châu',
    post_link: 'https://brenna.us',
    cus_name: 'Chu Hoàng Diệp',
    phone_number: '0123456789',
    content:
      'Tìm sản phẩm trị mụn Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam laboriosam quos, quo nulla aliquam praesentium ut doloribus accusamus voluptate cupiditate sint illo quis rerum sapiente quod culpa neque earum laudantium',
    comment_time: '31/01/2021 00:12:19',
    agent: 'SangTT9',
    response_time: '31/01/2021 00:12:19',
    is_responsed: true,
  },
  {
    id: '67098',
    is_visible: true,
    fanpage_name: 'Nhà thuốc FPT Long Châu',
    post_link: 'https://brenna.us',
    cus_name: 'Chu Hoàng Diệp',
    phone_number: '0123456789',
    content: 'Tìm sản phẩm trị mụn',
    comment_time: '31/01/2021 00:12:19',
    agent: 'SangTT9',
    response_time: '31/01/2021 00:12:19',
    is_responsed: false,
  },
  {
    id: '67098',
    is_visible: true,
    fanpage_name: 'Nhà thuốc FPT Long Châu',
    post_link: 'https://brenna.us',
    cus_name: 'Chu Hoàng Diệp',
    phone_number: '0123456789',
    content: 'Tìm sản phẩm trị mụn',
    comment_time: '31/01/2021 00:12:19',
    agent: 'SangTT9',
    response_time: '31/01/2021 00:12:19',
    is_responsed: true,
  },
  {
    id: '67098',
    is_visible: false,
    fanpage_name: 'Nhà thuốc FPT Long Châu',
    post_link: 'https://brenna.us',
    cus_name: 'Chu Hoàng Diệp',
    phone_number: '0123456789',
    content: 'Tìm sản phẩm trị mụn',
    comment_time: '31/01/2021 00:12:19',
    agent: 'SangTT9',
    response_time: '31/01/2021 00:12:19',
    is_responsed: true,
  },
  {
    id: '67098',
    is_visible: false,
    fanpage_name: 'Nhà thuốc FPT Long Châu',
    post_link: 'https://brenna.us',
    cus_name: 'Chu Hoàng Diệp',
    phone_number: '0123456789',
    content: 'Tìm sản phẩm trị mụn',
    comment_time: '31/01/2021 00:12:19',
    agent: 'SangTT9',
    response_time: '31/01/2021 00:12:19',
    is_responsed: true,
  },
  {
    id: '67098',
    is_visible: false,
    fanpage_name: 'Nhà thuốc FPT Long Châu',
    post_link: 'https://brenna.us',
    cus_name: 'Chu Hoàng Diệp',
    phone_number: '0123456789',
    content: 'Tìm sản phẩm trị mụn',
    comment_time: '31/01/2021 00:12:19',
    agent: 'SangTT9',
    response_time: '31/01/2021 00:12:19',
    is_responsed: true,
  },
];

import PT from 'prop-types';

WebsiteTab.propTypes = {
  history: PT.shape({
    push: PT.func,
  }).isRequired,
};

function WebsiteTab(props) {
  const { history } = props;
  return (
    <Card>
      <Row style={{ marginBottom: '37px' }} justify="space-between" align="bottom">
        <Col span={15}>
          <Row gutter={[10, 10]} align="bottom">
            <Col span={5}>
              <Typography.Text>Trạng thái</Typography.Text>
              <Select style={{ width: '100%' }} options={[]} placeholder="Tất cả" />
            </Col>
            <Col span={5}>
              <Typography.Text>Agent xử lý</Typography.Text>
              <Select style={{ width: '100%' }} options={[]} placeholder="Tất cả" />
            </Col>
            <Col span={10}>
              <Typography.Text>Thời gian bình luận</Typography.Text>
              <DatePicker />
            </Col>
          </Row>
        </Col>
        <Col span={9}>
          <Row align="bottom" justify="end" gutter={[5, 5]}>
            <Col span={10}>
              <Input prefix={<SearchOutlined />} placeholder="Nhập từ khóa" />
            </Col>
            <Col span={5}>
              <Button type="primary"> Export</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Table
        goTo={() => history.push('/omni_inbound/comment_management/detail_comment')}
        data={fakeDataTable}
      />
    </Card>
  );
}

export default WebsiteTab;
