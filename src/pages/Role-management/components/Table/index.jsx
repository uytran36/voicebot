import React, { Fragment, useCallback, useState } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import debounce from 'lodash/debounce';
import Table from '@ant-design/pro-table';
import { FormattedMessage } from 'umi';
import {
  SearchOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Space, Button, Input, message, Form, DatePicker, Select, AutoComplete } from 'antd';
import { groupBy, concat } from 'lodash';

// import { checkPermission, Usermanagement } from '@/utils/permission';
import { requestGetPermissions, getPermissionByRoleId } from '@/services/permission-management';
import { ModalUpdateContext } from '@/contexts/modal.context';
import styles from './styles.less';
import { fetchRoleList, deleteRole, fetchUser } from './function';
// import RootForm from '../RootForm';
import { renderModalRoleForm } from '../RootForm/modal-role-form';
import SelectMultiple from '@/components/SelectMultiple';

RenderTable.propTypes = {
  headers: PT.shape({
    Authorization: PT.string,
  }).isRequired,
  isManageAndDecentralizeUsers: PT.bool.isRequired,
};
const { RangePicker } = DatePicker;
const { Option } = Select;

function RenderTable({ headers, isManageAndDecentralizeUsers }) {
  const actionRef = React.useRef();
  const setStateModal = React.useContext(ModalUpdateContext);
  const [valueSearch, setValueSearch] = useState({ role: '', create_by: '', from: '', to: '' });
  const [optionModule, setOptionsModule] = useState([]);
  const [pageSize, setPageSize] = useState(10);

  React.useEffect(() => {
    handleRequestFetchUser(headers).then((users) => {
      setOptionsModule(users.reduce((a, v) => ({ ...a, [v]: v }), {}));
    });
    // handleRequestGetPermissionByRoleId(headers).then(permissions => {
    //   setCheckedList(permissions)
    // })
  }, []);

  const onToggleModalRoleForm = React.useCallback(
    (isEdit, initialValues) => () => {
      const cb = () => {
        actionRef.current.reload();
        setStateModal(false, {});
      };

      handleRequestPermissionList(headers, initialValues).then((result) => {
        const { permissions, list } = result;
        renderModalRoleForm({
          headers,
          initialValues,
          isEdit,
          cb,
          setStateModal,
          permissions,
          list,
        })();
      });
    },
    [headers, setStateModal],
  );

  const handleRequestPermissionList = React.useCallback(
    async (headers, initialValues) => {
      const res = await requestGetPermissions(headers, {});
      let list = [];
      if (initialValues?.id !== undefined) {
        list = await handleRequestGetPermissionByRoleId(headers, initialValues?.id);
      }
      if (res?.data) {
        const permissions = groupBy(
          Object.values(res?.data[0]).filter((elm) => elm.group),
          'group',
        );
        return { permissions, list };
      }
    },
    [headers],
  );

  const onToggleModalConfirmDeleteRole = React.useCallback(
    ({ selectedRowKeys, onCleanSelected }) => () => {
      setStateModal(true, {
        footer: null,
        closable: false,
        onCancel: () => setStateModal(false, {}),
        content: (
          <div className={styles.deleteModalWrapper}>
            <div className={styles.warning}>
              <InfoCircleOutlined style={{ color: '#faad14' }} />
              <span>Bạn có chắc chắn muốn xóa?</span>
            </div>
            <div className={styles.footer}>
              <Button onClick={() => setStateModal(false, {})} className={styles.noButton}>
                Không
              </Button>
              <Button
                className={styles.yesButton}
                onClick={async () => {
                  const success = await deleteRole(headers, selectedRowKeys);
                  if (success) {
                    actionRef.current.reload();
                    onCleanSelected();
                  }
                  setStateModal(false, {});
                }}
              >
                Có
              </Button>
            </div>
          </div>
        ),
      });
    },
    [headers, setStateModal, actionRef, deleteRole],
  );

  const handleOkCreator = (creater) => {
    setValueSearch({ ...valueSearch, create_by: creater.join() });
    return actionRef.current.reset();
  };

  const handleRequestFetchUser = async (headers) => {
    try {
      const res = await fetchUser(headers);
      return res.data;
    } catch (err) {
      return [];
    }
  };

  const handleRequestGetPermissionByRoleId = async (headers, id) => {
    try {
      const res = await getPermissionByRoleId(headers, id);
      return res.data;
    } catch (err) {
      return [];
    }
  };

  const changePageSize = (current, size) => {
    setPageSize(size);
  };

  return (
    <div className={styles.userTable}>
      <Table
        actionRef={actionRef}
        rowKey={(record) => record.id}
        size="small"
        // rowClassName={(record) => rowSelected._id === record._id && styles['row-selected']}
        pagination={{
          defaultPageSize: pageSize,
          size: 'default',
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '30', '50'],
          showTotal: false,
          onShowSizeChange: changePageSize,
        }}
        cardProps={{
          bodyStyle: { background: '#f0f2f5', paddingTop: 0 },
        }}
        scroll={{ x: true }}
        search={false}
        options={false}
        params={{
          role: valueSearch.role,
          create_by: valueSearch.create_by,
          from: valueSearch.from,
          to: valueSearch.to,
        }}
        rowSelection
        request={async (params, sorter, filter) => {
          const { data, total } = await fetchRoleList({
            headers,
            params,
            // sorter,
            // filter,
          });
          const dataArray = data.map((item, index) => {
            return {
              ...item,
              index: (params.current - 1) * params.pageSize + (index + 1),
            };
          });
          return {
            data: dataArray,
            total,
          };
        }}
        tableAlertOptionRender={null}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={20}>
            <span>{`Đã chọn: ${selectedRowKeys.length}`}</span>
            <Button
              onClick={onToggleModalConfirmDeleteRole({ selectedRowKeys, onCleanSelected })}
              style={{ background: '#fff', color: '#000' }}
              icon={<DeleteOutlined />}
            >
              Xóa vai trò
            </Button>
          </Space>
        )}
        toolBarRender={() => [
          <Input
            key="search"
            prefix={<SearchOutlined />}
            placeholder="Nhập tên vai trò"
            allowClear
            // onPressEnter={(e) => setValueSearch(e.target.value)}
            maxLength={50}
            onChange={debounce(
              (e) => {
                const { value } = e.target;
                if (value.length <= 50) {
                  actionRef.current.reset();
                  setValueSearch({ ...valueSearch, role: value });
                } else {
                  message.warning('Đã vượt quá giới hạn tìm kiếm 50 ký tự!');
                }
              },
              500,
              {
                trailing: true,
                leading: false,
              },
            )}
          />,
          isManageAndDecentralizeUsers && (
            <Button key="add" type="primary" onClick={onToggleModalRoleForm(false)}>
              <PlusOutlined />
              <span>Thêm vai trò</span>
            </Button>
          ),
        ]}
        headerTitle={
          <div className={styles.searchWrapper}>
            <div className={styles.search}>
              <Form.Item label="Thời gian" style={{ marginRight: 20, marginBottom: 0 }}>
                <RangePicker
                  placeholder={['Từ ngày', 'Đến ngày']}
                  ranges={{
                    Today: [moment(), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  onChange={debounce(
                    (dates, dateStrings) => {
                      actionRef.current.reset();
                      setValueSearch({ ...valueSearch, from: dateStrings[0], to: dateStrings[1] });
                    },
                    500,
                    {
                      trailing: true,
                      leading: false,
                    },
                  )}
                />
              </Form.Item>
              <Form.Item label="Người tạo" style={{ marginBottom: 0 }}>
                <SelectMultiple
                  list={optionModule}
                  callback={handleOkCreator}
                  style={{ width: 150 }}
                />
              </Form.Item>
            </div>
          </div>
        }
        columns={[
          {
            title: <b>#</b>,
            align: 'center',
            width: 30,
            render: (text, record, id) => {
              return <span>{record.index}</span>;
            },
          },
          {
            title: (
              <b>
                <FormattedMessage defaultMessage="Name" id="pages.user-management.role.name" />
              </b>
            ),
            dataIndex: 'role',
            align: 'left',
            render: (text, record, id) => {
              return (
                <p
                  onClick={onToggleModalRoleForm(true, record)}
                  style={{ margin: 0, cursor: 'pointer' }}
                >
                  {text}
                </p>
              );
            },
            width: 400,
          },
          {
            title: <b>Người tạo</b>,
            dataIndex: 'create_by',
            align: 'left',
            width: 150,
          },
          {
            title: (
              <b>
                <FormattedMessage
                  defaultMessage="Update At"
                  id="pages.user-management.col.updatedAt"
                />
              </b>
            ),
            dataIndex: 'create_at',
            align: 'left',
            width: 180,
            render: (text) =>
              moment(text).isValid() ? moment(text).format('DD/MM/YYYY HH:mm') : '-',
          },
          {
            title: <b>Ngày sửa gần nhất</b>,
            dataIndex: 'update_at',
            align: 'left',
            render: (text) =>
              moment(text).isValid() ? moment(text).format('DD/MM/YYYY HH:mm') : '-',
            width: 180,
          },
          {
            title: (
              <b>
                <FormattedMessage
                  defaultMessage="Description"
                  id="pages.user-management.role.description"
                />
              </b>
            ),
            dataIndex: 'description',
            align: 'left',
            width: 450,
          },
        ]}
      />
    </div>
  );
}

export default RenderTable;
