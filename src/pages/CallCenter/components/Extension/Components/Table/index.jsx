import React, { useState } from 'react';
import PT from 'prop-types';
import { connect, FormattedMessage } from 'umi';
import Table from '@ant-design/pro-table';
import { Button, Input, message, Switch, Form, Select, Space } from 'antd';
import {
  RightCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { ModalUpdateContext } from '@/contexts/modal.context';
import limitWords from '@/utils/limitWords';
import {
  requestGetUserList,
  requestRoleList,
  requestDepartmentUnitList,
  updateUserStatus,
} from '@/services/user-management';
import { checkPermission, USER_MANAGEMENT } from '@/utils/permission';
import styles from './styles.less';
import { functions } from './functions';
import DetailUser from './detail-user';
import RootForm from '../Root-form';
import SelectMultiple from '@/components/SelectMultiple';

RenderTable.propTypes = {
  dispatch: PT.func.isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
    currentUser: PT.instanceOf(Object),
    tokenGateway: PT.string,
  }).isRequired,
};

function RenderTable({ dispatch, user }) {
  let { tokenGateway, currentUser } = user;
  const actionRef = React.useRef();
  const setStateModal = React.useContext(ModalUpdateContext);
  const [pageSize, setPageSize] = useState(10);
  const [roles, setRoles] = React.useState([]);
  const [rolesFilter, setRolesFilter] = React.useState([]);
  const [units, setUnits] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const status = {
    true: 'active',
    false: 'deactive',
  };

  const [valueSearch, setValueSearch] = React.useState('');

  const headers = React.useMemo(
    () => ({
      Authorization: `${tokenGateway}`,
    }),
    [tokenGateway],
  );

  const changePageSize = (current, size) => {
    setPageSize(size);
  };

  const isManageAndDecentralizeUsers = React.useMemo(
    () =>
      checkPermission(
        user?.currentUser?.permissions,
        USER_MANAGEMENT['manageAndDecentralizeUsers'],
      ),
    [user?.currentUser?.permissions],
  );

  const [filterCall, setFilterCall] = useState({
    role_name: [],
    unit: [],
    department: [],
    is_active: [],
  });

  const handleOkRole = (role_name) => {
    setFilterCall({ ...filterCall, role_name: role_name.join() });
    return actionRef.current.reset();
  };

  const handleOkUnit = (unit) => {
    setFilterCall({ ...filterCall, unit: unit.join() });
    return actionRef.current.reset();
  };

  const handleOkDepartment = (department) => {
    setFilterCall({ ...filterCall, department: department.join() });
    return actionRef.current.reset();
  };

  const handleOkStatus = (is_active) => {
    setFilterCall({ ...filterCall, is_active: is_active.join() });
    return actionRef.current.reset();
  };

  const handleUpdateUser = React.useCallback(
    async (values, _userId) => {
      const dataForm = values;
      const success = await functions.updateUser(headers, { ...dataForm, user_id: _userId });
      if (success) {
        actionRef.current.reload();
        setStateModal(false, {});
      }
      return null;
    },
    [headers, setStateModal],
  );

  const handleClickNameUser = React.useCallback(
    (e, record) => {
      if (
        e.target.closest('.anticon') ||
        e.target.closest('.ant-btn') ||
        e.target.closest('.status')
      ) {
        return null;
      }

      setStateModal(true, {
        title: <span className={styles['title-modal-detail-user']}>Chỉnh sửa Extension</span>,
        width: 740,
        footer: null,
        bodyStyle: {
          padding: '0px 0px 16px 0px',
        },
        onCancel: () => {
          setStateModal(false, {});
        },
        content: (
          <RootForm
            style={{ padding: '10px 25px 0 25px' }}
            layout="vertical"
            //onFinish={handleUpdateUser}
            headers={headers}
            userId={record.user_id}
          >
            <DetailUser headers={headers} roles={roles} isEdit={true} record={record} />

            <div style={{ display: 'flex' }}>
              <Button
                onClick={() => {
                  setStateModal(false, {});
                }}
                icon={<DeleteOutlined />}
              >
                Xóa Extension
              </Button>
              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => {
                    setStateModal(false, {});
                  }}
                >
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Space>
            </div>
          </RootForm>
        ),
      });

      return null;
    },
    [handleUpdateUser, headers, roles, setStateModal],
  );

  const handleClickAddExtension = React.useCallback(() => {
    setStateModal(true, {
      title: <span className={styles['title-modal-detail-user']}>Thêm Extension</span>,
      width: 740,
      footer: null,
      bodyStyle: {
        padding: '0px 0px 16px 0px',
      },
      onCancel: () => {
        setStateModal(false, {});
      },
      content: (
        <RootForm
          style={{ padding: '10px 25px 0 25px' }}
          layout="vertical"
          //onFinish={handleUpdateUser}
          headers={headers}
          //userId={record.user_id}
        >
          <DetailUser headers={headers} /* roles={roles} */ isEdit={false} /* record={record} */ />
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => {
                setStateModal(false, {});
              }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Space>
        </RootForm>
      ),
    });

    return null;
  }, [handleUpdateUser, headers, roles, setStateModal]);

  const handleInputOnChange = React.useCallback((value) => {
    setValueSearch(value);
    actionRef.current.reset();
  }, []);

  React.useEffect(() => {
    requestRoleList(headers)
      .then((res) => {
        if (res.data) {
          setRoles(res.data);
          let roles = [];
          res.data.forEach((i) => roles.push(i.role));
          setRolesFilter(roles.reduce((a, v) => ({ ...a, [v]: v }), {}));
        } else {
          throw new Error(`ERROR~`);
        }
      })
      .catch((err) => {
        setRoles([]);
      });

    requestDepartmentUnitList(headers)
      .then((res) => {
        if (res.success) {
          let units = res.data[0].unit;
          setUnits(units.reduce((a, v) => ({ ...a, [v]: v }), {}));
        } else {
          throw new Error(`ERROR~`);
        }
      })
      .catch((err) => {
        setUnits([]);
      });

    requestDepartmentUnitList(headers)
      .then((res) => {
        if (res.data) {
          let department = res.data[0].department;
          setDepartments(department.reduce((a, v) => ({ ...a, [v]: v }), {}));
        } else {
          throw new Error(`ERROR~`);
        }
      })
      .catch((err) => {
        setDepartments([]);
      });
  }, [headers]);

  const enableOrDisableSelected = React.useCallback(
    ({ selectedRowKeys, onCleanSelected }, status) =>
      () => {
        setStateModal(true, {
          footer: null,
          closable: false,
          onCancel: () => setStateModal(false, {}),
          content: (
            <div className={styles.deleteModalWrapper}>
              <div className={styles.warning}>
                <InfoCircleOutlined style={{ color: '#faad14' }} />
                <span>Bạn có muốn xóa?</span>
              </div>
              <div className={styles.footer}>
                <Button onClick={() => setStateModal(false, {})} className={styles.noButton}>
                  Không
                </Button>
                <Button
                  className={styles.yesButton}
                  onClick={async () => {
                    // const success = await updateUserStatus(headers, selectedRowKeys, status);
                    // if (success) {
                    //   actionRef.current.reload();
                    //   onCleanSelected();
                    // }
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
    [headers, setStateModal],
  );

  return (
    <div className={styles.userTable}>
      <Table
        search={false}
        options={false}
        size="small"
        cardProps={{
          bodyStyle: { paddingTop: 0 },
        }}
        pagination={{
          defaultPageSize: pageSize,
          size: 'default',
          showTotal: false,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '30', '50'],
          onShowSizeChange: changePageSize,
        }}
        request={async ({ current, pageSize, search }, sort, filter) => {
          const _params = {
            limit: pageSize,
            offset: current,
            search_data: valueSearch || '',
            filter_data: {
              role_name: filterCall?.role_name?.length > 0 ? filterCall.role_name.split(',') : [],
              unit: filterCall?.unit?.length > 0 ? filterCall.unit.split(',') : [],
              department:
                filterCall?.department?.length > 0 ? filterCall.department.split(',') : [],
              is_active:
                filterCall?.is_active?.length > 0
                  ? filterCall.is_active.split(',').map((i) => {
                      if (i === 'true') return true;
                      else return false;
                    })
                  : [],
            },
          };
          const res = await requestGetUserList(headers, _params);
          const dataArray = res.data.map((item, index) => {
            return {
              ...item,
              index: (current - 1) * pageSize + (index + 1),
            };
          });

          return {
            data: dataArray,
            total: res.length,
          };
        }}
        actionRef={actionRef}
        rowKey={(record) => record.user_id}
        rowSelection
        tableAlertOptionRender={null}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={20}>
            <span>{`Đã chọn: ${selectedRowKeys.length}`}</span>
            <Button
              onClick={enableOrDisableSelected({ selectedRowKeys, onCleanSelected }, true)}
              style={{ background: '#fff', color: '#000' }}
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Space>
        )}
        headerTitle={
          <Form style={{ marginBottom: '0px', display: 'flex', gap: '10px' }}>
            <Form.Item
              style={{ display: 'list-item', marginBottom: '0px' }}
              name="role_name"
              label="Extension"
            >
              <SelectMultiple list={rolesFilter} callback={handleOkRole} style={{ width: 150 }} />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: '0px', display: 'list-item' }}
              name="unit"
              label="Queue"
            >
              <SelectMultiple list={units} callback={handleOkUnit} style={{ width: 150 }} />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: '0px', display: 'list-item' }}
              name="status"
              label={
                <span>
                  <FormattedMessage id="pages.user-management.status" defaultMessage="Trạng thái" />
                </span>
              }
            >
              <SelectMultiple list={status} callback={handleOkStatus} style={{ width: 150 }} />
            </Form.Item>
          </Form>
        }
        //search form
        toolBarRender={() => [
          <Input
            style={{
              width: 200,
            }}
            key="search"
            placeholder="Nhập từ khóa"
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => {
              if (e.target.value.length === 0) {
                handleInputOnChange('');
              }
            }}
            onPressEnter={(e) => handleInputOnChange(e.target.value)}
          />,
          <Button
            hidden={!isManageAndDecentralizeUsers}
            key="add"
            style={{ background: '#127ace', color: '#fff' }}
            onClick={() => handleClickAddExtension()}
            icon={<PlusOutlined />}
          >
            Thêm extension
          </Button>,
        ]}
        columns={[
          {
            title: <b>#</b>,
            align: 'center',
            width: 20,
            render: (text, record, id) => {
              return <span>{record.index}</span>;
            },
          },
          {
            title: <b>Extension</b>,
            dataIndex: 'branch_number',
            align: 'left',
            render: (text, record) => {
              return (
                <div className={styles.colName} onClick={(e) => handleClickNameUser(e, record)}>
                  <span>{text}</span>
                </div>
              );
            },
          },
          {
            title: <b>Queue</b>,
            dataIndex: `phone_number`,
            align: 'left',
          },
          {
            title: <b>Tổng đài viên</b>,
            dataIndex: 'full_name',
            align: 'left',
          },
          {
            title: <b>Trạng thái</b>,
            dataIndex: 'status',
            align: 'center',
            render: (text, record, id) => {
              let textColor;
              if (record.is_active) {
                textColor = '#1890ff';
                text = 'Active';
              } else {
                textColor = 'lightgrey';
                text = 'Deactive';
              }
              return <span style={{ color: textColor }}>{text}</span>;
            },
          },

          {
            title: <b>Mô tả</b>,
            dataIndex: `unit`,
            align: 'left',
          },
        ]}
      />
    </div>
  );
}

export default connect(({ user }) => ({ user }))(RenderTable);
