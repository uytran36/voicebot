import React, { useState, useCallback } from 'react';
import PT from 'prop-types';
import styles from './styles.less';
import { Form, Input, Select, message } from 'antd';
import Table from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import { requestGetUserList } from '../../service';

InternalContact.propTypes = {
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
};

const { Search } = Input;
function InternalContact({ headers }) {
  const [valueSearch, setValueSearch] = useState('');

  const columns = [
    // {
    //   render: () => <StarOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />,
    //   width: 40,
    // },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Họ và tên</span>,
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Số di động</span>,
      dataIndex: 'phone',
      align: 'left',
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Số máy nhánh</span>,
      dataIndex: 'ipPhone',
      align: 'left',
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Email</span>,
      dataIndex: 'emails',
      align: 'left',
      render: (_, record) => record?.emails?.length > 0 && record.emails[0].address,
    },
  ];

  const contact = [
    {
      label: 'Tất cả',
      value: 'all',
    },
    {
      label: 'Gắn sao',
      value: 'star',
    },
    {
      label: 'Không gắn sao',
      value: 'nostar',
    },
  ];

  const handleSearch = useCallback((e) => {
    const { value } = e.target;
    setValueSearch(value);
  }, []);

  const handleSubmitSearch = useCallback(() => {
    console.log(valueSearch);
  }, [valueSearch]);

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <Form className={styles.formLeft}>
          {/* <Form.Item label="Danh bạ">
            <Select disabled defaultValue="all" style={{ width: '12rem' }} options={contact} />
          </Form.Item> */}
        </Form>
        <div className={styles.search}>
          <Input
            prefix={<SearchOutlined onClick={handleSubmitSearch} />}
            onPressEnter={handleSubmitSearch}
            placeholder="Nhập từ khóa"
            onChange={handleSearch}
          />
        </div>
      </div>
      <Table
        options={false}
        search={false}
        columns={columns}
        params={{
          name: valueSearch,
          phone: valueSearch,
          ipPhone: valueSearch,
          'emails.address': valueSearch,
          username: valueSearch,
        }}
        // pagination={{
        //   defaultPageSize: 10,
        //   showTotal: false,
        //   size: 'default',
        // }}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
          size: 'default',
          // showSizeChanger: false,
        }}
        size="small"
        request={async (params, sorter, filter) => {
          let sortValue = '';
          if (Object.values(sorter)[0] === 'ascend') {
            sortValue = -1;
          }
          if (Object.values(sorter)[0] === 'descend') {
            sortValue = 1;
          }
          const data = {
            fields: {
              name: 1,
              username: 1,
              emails: 1,
              roles: 1,
              status: 1,
              avatarETag: 1,
              active: 1,
              moreData: 1,
              ipPhone: 1,
              phone: 1,
            },
            query: {
              $or: [
                // { 'emails.address': { $regex: '', $options: 'i' } },
                // { username: { $regex: '', $options: 'i' } },
                { name: { $regex: params.search || '', $options: 'i' } },
              ],
            },
            sort: {},
            size: params.pageSize,
            page: params.current - 1,
          };
          if (typeof sortValue === 'number') {
            data.sort[Object.keys(sorter)[0]] = sortValue;
          }

          const keyParams = Object.keys(params);
          let result = [];
          result = keyParams.map((item) => {
            if (item !== 'current' && item !== 'pageSize' && params[item]) {
              return {
                [item]: { $regex: `.*${params[item]}.*`, $options: 'i' },
              };
            }
          });
          if (result.filter(Boolean).length > 0) {
            data.query.$or = result.filter(Boolean);
          }
          try {
            const res = await requestGetUserList(headers, data);
            return {
              data: res.users,
              total: res.total,
            };
          } catch (err) {
            // message.error(err.toString());
            return {
              data: [],
              total: 0,
            };
          }
        }}
      />
    </div>
  );
}

export default InternalContact;
