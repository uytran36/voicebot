import React, { useState, useCallback, useRef, useMemo } from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import Table from '@ant-design/pro-table';
import moment from 'moment';
import functions from './functions';
// import { EyeOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { Form, Input, Button, Popconfirm, message } from 'antd';
import styles from './styles.less';
import { Edit, Delete, Eye, Search } from '@/components/Icons';

RenderRawTable.propTypes = {
  handleOnClickToShowDetail: PT.func.isRequired,
  setType: PT.func.isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
  }).isRequired,
};

function RenderRawTable({
  user: { userId, authToken, tokenGateway },
  handleOnClickToShowDetail,
  setType,
  history
}) {
  // define refs
  const refTable = useRef();

  const [valueSearch, setValueSearch] = useState('');

  const headers = useMemo(() => ({
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`,
  }), [authToken, tokenGateway, userId]);

  const handleDeleteRecord = useCallback((record) => async () => {
    const res = await functions.handleDeleteContactHistory(headers, record.id)
    if(res && res.status) {
      refTable.current.reload();
      return message.success('Xoá dữ liệu thành công')
    }
    return message.error('Xoá dữ liệu thất bại')
  },[headers])

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'tentailieu',
      align: 'center',
    },
    {
      title: 'Người tải lên',
      dataIndex: 'createdBy',
      align: 'center',
    },
    {
      title: 'Người sửa gần nhất',
      dataIndex: 'createdBy',
      align: 'center',
    },
    {
      title: 'Thời gian tải lên',
      dataIndex: 'createdAt',
      align: 'center',
      render: (text) => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '-'),
    },
    {
      title: 'Thời gian sửa gần nhất',
      dataIndex: 'updatedAt',
      align: 'center',
      render: (text) => (text ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '-'),
    },
    {
      title: 'Hành động',
      align: 'center',
      render: (_, record) => {
        return (
          <div>
            <Eye
              className={`${styles.btn} ${styles.icon}`}
              onClick={() => {
                handleOnClickToShowDetail(record, 'view');
                setType('raw');
              }}
            />
            <Edit
              className={`${styles.btn} ${styles.icon}`}
              onClick={() => {
                handleOnClickToShowDetail(record, 'edit');
                setType('raw');
              }}
            />
            <Popconfirm title={`Bạn có muốn xóa #${record.tentailieu}`} onConfirm={handleDeleteRecord(record)}>
              <Delete className={`${styles.btn} ${styles.icon}`} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      rowKey={() => Math.random().toString(36).substring(7)}
      search={false}
      options={false}
      columns={columns}
      actionRef={refTable}
      // pagination={{
      //   defaultPageSize: 10,
      //   showTotal: false,
      // }}
      pagination={{
        defaultPageSize: 10,
        showTotal: false,
        size: 'default',
        // showSizeChanger: false,
      }}
      size="small"
      scroll={{ x: true }}
      headerTitle={
        <div className={styles.searchWrapper}>
          <div className={styles.search}>
            <Form onFinish={(values) => setValueSearch(values.search)} layout="inline">
              <Form.Item name="search">
                <Input
                  allowClear
                  onChange={(e) => e.target.value.length === 0 && setValueSearch('')}
                />
              </Form.Item>
              <Button
                style={{
                  background: '#0D99B8',
                  textAlign: 'center',
                  color: '#fff',
                }}
                htmlType="submit"
              >
                <Search width={11} height={11} style={{ marginRight: 7 }} />
                <span>Tìm kiếm</span>
              </Button>
            </Form>
          </div>
        </div>
      }
      params={{ search: valueSearch }}
      request={async ({ search, pageSize, current }) => {
        const params = {
          limit: pageSize,
          offset: pageSize * current - pageSize,
        }
        if(search.length > 0) {
          params.where = {
            'tentailieu': {
              regexp: `.*${search}.*`
            },
          };
        }
        const { data, total } = await functions.fetchContactHistories(headers, params);
        return {
          data: data.filter((elm) => {
            if (search) {
              return elm?.tentailieu.toLowerCase().includes(search.toLowerCase());
            }
            return elm;
          }),
          total
        };
      }}
    />
  );
}

export default connect(({ user }) => ({ user }))(RenderRawTable);
