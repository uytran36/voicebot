import React, { useCallback, useRef, useState } from 'react';
import moment from 'moment';
import PT from 'prop-types';
import Table from '@ant-design/pro-table';
import debounce from 'lodash/debounce';
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Form, DatePicker, Space, message, Popconfirm } from 'antd';
import { Export } from '@/components/Icons';
import { Link } from 'umi';
import styles from './styles.less';
import RootForm from '../root-form';
import AddNewGroup from '../add-new-group';
import { addNewGroupValidate } from './validate';
import validate from '@/utils/validate';
import { requestCreateGroup, requestDeleteGroup, requestGetGroups } from '@/services/crm';
import { ModalUpdateContext } from '@/contexts/modal.context';
import NoDataPermission from '@/components/NoDataPermission';

/**
 * @param {Object} body
 * @param {Object} headers
 * @returns {Object} - Response
 */
const onCreateGroup = async (body, headers = {}) => {
  const hide = message.loading('Đang tạo mới...');
  try {
    const res = await requestCreateGroup(body, headers);
    if (res?.msg === 'SUCCESS') {
      hide();
      message.success('Đã tạo mới nhóm.');
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    hide();
    message.warning('Không thể tạo mới nhóm.');
    return null;
  }
};

const onDeleteGroups = async (groupIDs, headers = {}) => {
  const hide = message.loading('Đang xoá...');
  try {
    const res = await requestDeleteGroup(groupIDs, headers);
    if (res?.msg === 'SUCCESS') {
      hide();
      message.success('Đã xoá nhóm được chọn.');
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    hide();
    message.warning('Không thể xoá nhóm được chọn.');
    return null;
  }
};

Groups.propTypes = {
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  tabActive: PT.string.isRequired,
  settotalGroups: PT.func.isRequired,
  permissions: PT.shape({
    manage: PT.bool.isRequired,
    update: PT.bool.isRequired,
    onlyView: PT.bool.isRequired,
  }).isRequired,
};

function Groups({ settotalGroups, tabActive, headers, permissions }) {
  const actionRef = useRef(null);
  const setStateModal = React.useContext(ModalUpdateContext);
  const { manage, update, onlyView } = permissions;

  const [valueSearch, setValueSearch] = useState('');

  const handleSearch = debounce(
    (e) => {
      const { value } = e.target;
      setValueSearch(value);
      actionRef.current.reset();
    },
    500,
    {
      trailing: true,
      leading: false,
    },
  );

  const handleFinishForm = useCallback(
    async (values) => {
      try {
        const valueValidates = validate(addNewGroupValidate)(values);
        const result = await onCreateGroup(valueValidates, headers);
        if (result) {
          actionRef.current?.reload();
          setStateModal(false, {});
        }
      } catch (err) {
        console.error(err);
        message.error('Không thể tạo mới nhóm.');
      }
      console.log({ values });
    },
    [headers, setStateModal],
  );

  const handleAddNewGroup = useCallback(() => {
    setStateModal(true, {
      bodyStyle: { padding: '10px' },
      title: 'Thêm mới nhóm',
      footer: null,
      onCancel: () => setStateModal(false, {}),
      content: (
        <RootForm layout="vertical" onFinish={handleFinishForm}>
          <AddNewGroup />
          <div className={styles['group-btn']}>
            <Button onClick={() => setStateModal(false, {})}>Huỷ</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </RootForm>
      ),
    });
  }, [handleFinishForm, setStateModal]);

  /**
   * @param {String[]} _selectedRowKeys - ID record
   */
  const handleDeleteGroups = useCallback(
    (_selectedRowKeys, onCleanSelected, _headers) => async () => {
      const result = await onDeleteGroups(_selectedRowKeys, _headers);
      if (result) {
        actionRef.current?.reload();
        onCleanSelected();
      }
    },
    [],
  );

  return manage || update || onlyView ? (
    <Table
      actionRef={actionRef}
      search={false}
      options={false}
      // pagination={{
      //   defaultPageSize: 10,
      //   showTotal: false,
      // }}
      scroll={{ x: 992 }}
      pagination={{
        defaultPageSize: 10,
        showTotal: false,
        size: 'default',
        // showSizeChanger: false,
      }}
      size="small"
      headerTitle={
        <>
          <Form.Item
            key="createTime"
            label="Thời gian tạo"
            style={{ marginRight: 24, marginBottom: 0 }}
          >
            <DatePicker.RangePicker disabled />
          </Form.Item>
          <Form.Item key="lastMod" label="Ngày sửa gần nhất" style={{ margin: 0 }}>
            <DatePicker.RangePicker disabled />
          </Form.Item>
        </>
      }
      toolBarRender={() => [
        <Input
          key="input"
          prefix={<SearchOutlined />}
          // onPressEnter={handleSubmitSearch}
          placeholder="Nhập từ khóa"
          onChange={handleSearch}
        />,
        (manage || update) && (
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAddNewGroup}>
            Thêm nhóm
          </Button>
        ),
        // <Button size="middle" key="ex" type="link" icon={<Export style={{ color: '#111' }} />} />,
      ]}
      rowSelection={!(onlyView || update)}
      rowKey={(recotd) => recotd.id}
      tableAlertOptionRender={false}
      tableAlertRender={
        onlyView || update
          ? false
          : ({ selectedRowKeys, selectedRows, onCleanSelected }) => {
              return (
                <Space>
                  <p className={styles.selected}>
                    <span>Đã chọn</span>
                    <span>{selectedRowKeys.length}</span>
                  </p>
                  <Popconfirm
                    onConfirm={handleDeleteGroups(selectedRowKeys, onCleanSelected, headers)}
                    title="Bạn có chắc chắn muốn xoá?"
                  >
                    <Button icon={<DeleteOutlined />}>Xoá nhóm</Button>
                  </Popconfirm>
                  {/* <Button icon={<Export role="img" aria-label="export" className={`anticon`} />}>
            Xuất dữ liệu
          </Button> */}
                </Space>
              );
            }
      }
      params={{ tabActive, valueSearch }}
      request={async ({ pageSize, current, tabActive: _tabActive, valueSearch: _valueSearch }) => {
        try {
          const filter = {
            offset: current - 1,
            limit: pageSize,
            search: _valueSearch,
          };

          const res = await requestGetGroups(filter, headers);
          if (res?.msg === 'SUCCESS') {
            const { totalRecord } = res.response;
            settotalGroups(totalRecord);
            return {
              data: res.response.data,
              total: totalRecord,
            };
          }
          throw new Error('ERROR~');
        } catch (err) {
          console.error(err);
          return {
            data: [],
            total: 0,
          };
        }
      }}
      columns={[
        {
          title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Tên nhóm</span>,
          dataIndex: 'name',
          align: 'left',
          width: 130,
          render: (text, record) => (
            <Link
              to={{
                pathname: `/customer-relationship-management/customer-management/group/${record.id}`,
              }}
            >
              {text}
            </Link>
          ),
        },
        {
          title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Mô tả</span>,
          dataIndex: 'description',
          align: 'left',
          width: 130,
        },
        {
          title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Số lượng khách hàng</span>,
          dataIndex: 'memberCount',
          align: 'right',
          width: 100,
        },
        {
          title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Thời gian tạo</span>,
          dataIndex: 'createdAt',
          align: 'center',
          width: 100,
          render: (text) =>
            moment(text).isValid() ? moment(text).format('DD/MM/YYYY HH:mm') : '-',
        },
        {
          title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>Ngày sửa gần nhất</span>,
          dataIndex: 'updatedAt',
          align: 'center',
          width: 100,
          render: (text) =>
            moment(text).isValid() ? moment(text).format('DD/MM/YYYY HH:mm') : '-',
        },
      ]}
    />
  ) : (
    <NoDataPermission />
  );
}

export default Groups;
