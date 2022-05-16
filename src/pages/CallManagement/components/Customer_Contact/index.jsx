import React, { useState, useCallback, useRef } from 'react';
import PT from 'prop-types';
import styles from './styles.less';
import { Form, Select, Input, Typography, message, Tag } from 'antd';
import Table from '@ant-design/pro-table';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import { requestOmniContactListNormalization, requestUpdateNormalizations } from '../../service';
import { requestGetCustomersOfGroup } from '@/services/crm';
import { RenderEditRow, RenderEditRowTable } from '@/components/Editable';
import debounce from 'lodash/debounce';
import moment from 'moment';

CustomerContact.propTypes = {
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
};

function CustomerContact({ headers }) {
  const actionRef = useRef(null);
  const [editingKey, setEditingKey] = useState('');
  // const [form] = Form.useForm();
  const [values, setValues] = useState({});
  const [valueSearch, setValueSearch] = useState('');

  const isEditing = useCallback((record) => record.id === editingKey, [editingKey]);

  const toggleEdit = (record) => () => {
    setEditingKey(record.id);
  };

  const handleCancel = useCallback(() => {
    setEditingKey('');
    setValues({});
  }, []);

  const handleSave = useCallback(
    (record) => async () => {
      try {
        const res = await requestUpdateNormalizations(headers, [
          {
            ...record,
            ...values,
          },
        ]);
        if (res && res.error) {
          throw new Error(res.error.message);
        }
        handleCancel();
        actionRef.current.reload();
      } catch (err) {
        handleCancel();
        // message.error(err.toString());
      }
    },
    [headers, values, handleCancel],
  );

  const columns = [
    // {
    //   render: () => <StarOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />,
    //   width: 40,
    // },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Họ và tên</span>,
      dataIndex: 'ho_va_ten',
      align: 'left',
      width: 120,
      editable: true,
      required: true,
      render: (text, record, i) => {
        return <span>{text}</span>;
      },
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Mã khách hàng</span>,
      dataIndex: 'code',
      align: 'left',
      editable: true,
      width: 120,
      render: (text, record, i) => {
        return <span>{text}</span>;
      },
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Số điện thoại</span>,
      dataIndex: 'sdt',
      align: 'left',
      editable: true,
      width: 120,
      required: true,
      render: (text, record, i) => {
        return <span>{text}</span>;
      },
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Email</span>,
      dataIndex: 'email',
      align: 'left',
      editable: true,
      width: 120,
      render: (text, record, i) => {
        return <span>{text}</span>;
      },
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>{<EditOutlined />}</span>,
      align: 'left',
      width: 40,
      actions: true,
      editable: true,
      render: (_, record, i) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={handleSave(record)}
              style={{
                marginRight: 8,
                color: '#fff',
                background: '#127ACE',
                padding: '5px 16px',
                borderRadius: '5px',
              }}
            >
              Lưu
            </a>
            <a
              onClick={handleCancel}
              style={{
                borderRadius: '5px',
                marginRight: 8,
                padding: '5px 16px',
                color: '#000',
                border: '1px solid #D9D9D9',
              }}
            >
              Huỷ
            </a>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={toggleEdit(record)}>
            <EditOutlined />
          </Typography.Link>
        );
      },
    },
  ];
  const columnsCRM = [
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Họ và tên</span>,
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      width: 120,
      editable: true,
      required: true,
      render: (text, record, i) => {
        return <span>{text}</span>;
      },
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Ngày sinh</span>,
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      align: 'left',
      width: 120,
      editable: true,
      required: true,
      render: (text, record, i) => {
        return record.dateOfBirth ? moment(record.dateOfBirth).format('DD-MM-YYYY') : '';
      },
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Số điện thoại</span>,
      dataIndex: 'phones',
      key: 'phones',
      align: 'left',
      editable: true,
      width: 120,
      required: true,
      render: (text, record, i) => {
        if (record.phones) {
          return record.phones.map((item) => (
            <Tag key={item.phone} color="processing">
              {item.phone}
            </Tag>
          ));
        }
        return '';
      },
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Địa chỉ</span>,
      dataIndex: 'addresses',
      key: 'addresses',
      align: 'left',
      editable: true,
      width: 120,
      required: true,
      render: (text, record, i) => {
        return <span>{text}</span>;
      },
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Email</span>,
      dataIndex: 'email',
      key: 'email',
      align: 'left',
      editable: true,
      width: 120,
      render: (text, record, i) => {
        return <span>{text}</span>;
      },
    },
    {
      title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Nhóm</span>,
      dataIndex: 'groups',
      key: 'groups',
      align: 'left',
      editable: true,
      width: 120,
      render: (text, record, i) => {
        if (record.groups) {
          return record.groups.map((item) => (
            <Tag key={item.name} color="geekblue">
              {item.name}
            </Tag>
          ));
        }
        return '';
      },
    },
    // {
    //   title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>{<EditOutlined />}</span>,
    //   align: 'left',
    //   width: 40,
    //   actions: true,
    //   editable: true,
    //   render: (_, record, i) => {
    //     const editable = isEditing(record);
    //     return editable ? (
    //       <span>
    //         <a
    //           onClick={handleSave(record)}
    //           style={{
    //             marginRight: 8,
    //             color: '#fff',
    //             background: '#127ACE',
    //             padding: '5px 16px',
    //             borderRadius: '5px',
    //           }}
    //         >
    //           Lưu
    //         </a>
    //         <a
    //           onClick={handleCancel}
    //           style={{
    //             borderRadius: '5px',
    //             marginRight: 8,
    //             padding: '5px 16px',
    //             color: '#000',
    //             border: '1px solid #D9D9D9',
    //           }}
    //         >
    //           Huỷ
    //         </a>
    //       </span>
    //     ) : (
    //       <Typography.Link disabled={editingKey !== ''} onClick={toggleEdit(record)}>
    //         <EditOutlined />
    //       </Typography.Link>
    //     );
    //   },
    // },
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

  const handleSearch = debounce(
    (e) => {
      const { value } = e.target;
      setValueSearch(value);
    },
    500,
    {
      trailing: true,
      leading: false,
    },
  );

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
            prefix={<SearchOutlined />}
            // onPressEnter={handleSubmitSearch}
            placeholder="Nhập từ khóa"
            onChange={handleSearch}
          />
        </div>
      </div>
      {/* <Form form={form} component={false}> */}
      <Table
        actionRef={actionRef}
        // columns={columns.map((col) => {
        //   if (!col.editable) {
        //     return col;
        //   }
        //   return {
        //     ...col,
        //     onCell: (record) => {
        //       if (record) {
        //         return {
        //           record,
        //           dataIndex: col.dataIndex,
        //           title: col.title,
        //           editing: isEditing(record),
        //           handleSave: (value) => setValues({ ...values, ...value }),
        //         };
        //       }
        //       return record;
        //     },
        //   };
        // })}
        columns={columnsCRM}
        search={false}
        options={false}
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
        rowClassName="editable-row"
        rowKey={(record) => record.id}
        components={{
          body: {
            row: RenderEditRowTable,
            cell: RenderEditRow,
          },
        }}
        params={{ search: valueSearch }}
        // request={async ({ pageSize, current, search }) => {
        //   const filter = { limit: pageSize, offset: pageSize * current - pageSize };
        //   if (search.length > 0) {
        //     // filter.where  = {or: [{
        //     //   sdt: {regexp: `.*${search}.*`}
        //     // }, {
        //     //   ten: {regexp: `.*${search}.*`}
        //     // }]};
        //     filter.where = {
        //       or: [
        //         {
        //           ho_va_ten: { like: `${search}`, $options: 'i' },
        //         },
        //         {
        //           sdt: { regexp: `.*${search}.*`, $options: 'i' },
        //         },
        //         {
        //           ho_va_ten: { regexp: `.*${search}.*`, $options: 'i' },
        //         },
        //       ],
        //     };
        //   }
        //   try {
        //     const res = await requestOmniContactListNormalization(headers, { filter });
        //     if (Array.isArray(res)) {
        //       const { total } = res.pop();
        //       // console.log(total)
        //       return {
        //         data: res,
        //         total,
        //       };
        //     }
        //     throw new Error('ERROR~');
        //   } catch (err) {
        //     // message.error(err.toString());
        //     console.error(err.toString());
        //     return {
        //       data: [],
        //       total: 0,
        //     };
        //   }
        // }}
        request={async ({ pageSize, current, search }) => {
          const data = {
            offset: current - 1,
            limit: pageSize,
            groupId: '',
            search: ''
          };
          if (search.length > 0) {
            data.search = search;
            // const _search = ['name', 'phones.phone', 'email'].map(key => {
            //   return {
            //     [key]: {
            //       $regex: `.*${search}.*`, $options: 'i'
            //     }
            //   }
            // });
            // data.where = {
            //   or: _search
            // }
          }
          try {
            const res = await requestGetCustomersOfGroup(data, headers);
            if (res?.msg === "SUCCESS") {
              const {totalRecord} = res.response;
              // Save data each page to render selected UI.
              // If rows selected we must set default value for selectedRowKeys
              return {
                data: res.response.data,
                total: totalRecord,
              };
            }
            throw new Error('ERROR~');
          } catch (error) {
            console.error(error);
            return {
              data: [],
              total: 0,
            };
          }
        }}
      />
      {/* </Form> */}
    </div>
  );
}

export default CustomerContact;
