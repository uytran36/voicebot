import React from 'react';
import Table from '@ant-design/pro-table';
import PropTypes from 'prop-types';
import { Col, Row, Typography, Tag } from 'antd';
import { ForwardFilled, StarFilled, StarOutlined } from '@ant-design/icons';
import styles from './styles.less';
function CustomTable(props) {
  const {data, goTo} = props;
  const columnShapes = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: function (text, record) {
        return (
          <Row style={{ cursor: 'pointer' }} onClick={goTo} align="center" gutter={[5, 5]}>
            <Col>
              {!record.is_responsed ? <StarFilled style={{ color: 'red' }} /> : <StarOutlined />}
            </Col>
            <Col>
              <Typography.Text>{text}</Typography.Text>
            </Col>
          </Row>
        );
      },
    },
    {
      title: 'Ẩn/Hiện',
      dataIndex: 'is_visible',
      key: 'is_visible',
      render: (text) => (text ? <Tag color="cyan">Hiện</Tag> : <Tag color="gold">Ẩn</Tag>),
    },
    {
      title: 'Link bài viết',
      dataIndex: 'post_link',
      key: 'post_link',
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: 'Fanpage',
      dataIndex: 'fanpage_name',
      key: 'fanpage_name',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'cus_name',
      key: 'cus_name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (text) => (
        <Typography.Text style={{ width: '150px' }} ellipsis>
          {text}
        </Typography.Text>
      ),
      width: '150px',
    },
    {
      title: 'Thời gian bình luận',
      dataIndex: 'comment_time',
      key: 'comment_time',
    },
    {
      title: 'Agent xử lý',
      dataIndex: 'agent',
      key: 'agent',
    },
    {
      title: 'Thời gian trả lời',
      dataIndex: 'response_time',
      key: 'response_time',
    },
    {
      title: 'Title',
      key: 'title',
      render: () => (
        <Row style={{ cursor: 'pointer' }}>
          <Col>
            <ForwardFilled style={{ color: 'blue' }} />
          </Col>
          <Col>
            <Typography.Text strong style={{ color: 'blue' }}>
              Trả lời
            </Typography.Text>
          </Col>
        </Row>
      ),
    },
  ];

  return (
    <Table
      toolBarRender={false}
      search={false}
      columns={columnShapes}
      dataSource={data}
      rowClassName={(record) => (record.is_responsed ? null : styles['bg-green'])}
      scroll={{ x: 1500 }}
    />
  );
}

CustomTable.propTypes = {
  data: PropTypes.array.isRequired,
  goTo: PropTypes.func.isRequired,
};

export default CustomTable;
