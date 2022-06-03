import React from 'react';
import PT from 'prop-types';
import Table from '@ant-design/pro-table';
import { groupBy, concat } from 'lodash';
import {
  RightCircleOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Tooltip, Checkbox, message, Input, Button, Form, Select } from 'antd';
import { ModalUpdateContext } from '@/contexts/modal.context';
import { requestGetPermissions, requestUpdatePermission } from '@/services/permission-management';
import { requestRoleList } from '@/services/role-management';
import { requestGetLicense } from '@/services/auth';
import { checkPermission, USER_MANAGEMENT } from '@/utils/permission';
import styles from './styles.less';
import { renderModalRoleForm } from '@/pages/Role-management/components/RootForm/modal-role-form';
import debounce from 'lodash/debounce';
import { permission_mapping } from '@/constants/maping-permission';
import api from '@/api';
const ALL_OPTIONS_MODULE = 'Tất cả';
const isString = (str) => typeof str === 'string';

// const handleChecked = (arr, name) => {
//   const result = [];
//   arr.forEach(elm => {
//     if (elm.alias) {
//       elm.children.forEach(child => {
//         result.push(child.roles.includes(name))
//       })
//       return null;
//     }
//     result.push(elm.roles.includes(name))
//     return null;
//   })
//   return result.every((x) => x === true);
// }

const handleDisable = (record, role) => {
  if (record?.groupName) {
    // const index = record?.optionGroup?.filter(elm => {
    //   return elm.id !== record.id
    // }).findIndex(elm => {
    //   if (elm.roles_list.includes(role.id)) {
    //     return true;
    //   }
    // });
    // if (index < 0) {
    //   return false;
    // }
    return true;
  }
  return false;
};

/**
 * Create new array mapping with rule table ANTD
 * @param {Array} dataTable
 * @returns {Array} - Mapping with rule table ANTD
 * @example
 *
 * convertDataTable([
 *   {alias: '1', group_name: 'b', name: 'name1', roles: []},
 *   {alias: '1', group_name: 'b', name: 'name2', roles: []},
 *   {alias: '', group_name: 'b', name: 'name3', roles: []},
 *   {alias: '', group_name: 'a', name: 'name4', roles: []},
 * ])
 * => [
 *   {groupName: true, key: b, children: [
 *    {
 *     key: '1',
 *     alias: true,
 *     children: [{key: name1, roles: []}, {key: name2, roles: []}]
 *    },
 *    {key: 'name3', roles: []}
 *  ]},
 *  {groupName: true, key: a, children: [
 *    {key: 'name4', roles: []}
 *  ]}
 * ]
 */

const convertDataTable = (dataTable) => {
  // group data with same group_name to object  ;
  const grouped = groupBy(
    dataTable.filter((elm) => elm.group),
    'group',
  );

  const result = Object.keys(grouped).map((key, index) => {
    // group data with same alias to object;
    const groupByAlias = groupBy(grouped[key], 'alias');
    let children = [];
    Object.keys(groupByAlias).forEach((keyGroupAlias) => {
      /**
       * if @keyGroupAlias is empty, push each element to @children
       * otherwise push element to @children with key @alias = true
       */
      if (keyGroupAlias.length === 0) {
        children = concat(
          groupByAlias[keyGroupAlias].map((elm) => {
            const optionGroup =
              elm.group &&
              dataTable
                .filter((data) => data.group === elm.group)
                .map((e) => ({
                  id: e.permission_id,
                  roles: e.roles_id,
                }));
            return {
              id: elm.permission_id,
              key:
                permission_mapping.detail[
                  Object.keys(permission_mapping.detail).find((e) => e === elm.permission)
                ],
              roles: elm.roles_id,
              optionGroup:
                permission_mapping.group[
                  Object.keys(permission_mapping.group).find((e) => e === elm.group)
                ],
              // description: elm.description,
            };
          }),
          children,
        );
        return null;
      }
      children.push({
        key: keyGroupAlias,
        children: groupByAlias[keyGroupAlias].map((elm) => {
          return {
            id: elm.permission_id,
            key:
              permission_mapping.detail[
                Object.keys(permission_mapping.detail).find((e) => e === elm.permission)
              ],
            roles: elm.roles_id,
            optionGroup:
              permission_mapping.group[
                Object.keys(permission_mapping.group).find((e) => e === elm.group)
              ],
          };
        }),
        alias: true,
      });
      return null;
    });
    return {
      index,
      key:
        permission_mapping.group[Object.keys(permission_mapping.group).filter((e) => e === key)[0]],
      children,
      groupName: true,
    };
  });
  return result;
};

const defaultColumns = [
  {
    title: <b>Cụm chức năng</b>,
    dataIndex: 'name',
    align: 'left',
    width: 450,
    fixed: 'left',
    render: (_, record) => {
      if (record.groupName) {
        return {
          props: {
            style: { background: '#fff' },
          },
          children: <b>{record.key}</b>,
        };
      }
      if (record.alias) {
        return {
          props: {
            style: { background: '#fff' },
          },
          children: (
            <span>
              <b>{record.key}</b>
              <Tooltip title={record.description || record.key}>
                <InfoCircleOutlined
                  style={{
                    paddingRight: '4px',
                    color: '#1169B0',
                    cursor: 'pointer',
                    paddingLeft: 10,
                  }}
                />
              </Tooltip>
            </span>
          ),
        };
      }
      return {
        props: {
          style: { background: '#EBF5FB' },
        },
        children: (
          <span>
            <span>{record.key}</span>
            <Tooltip title={record.description || record.key}>
              <InfoCircleOutlined
                style={{
                  paddingRight: '4px',
                  color: '#1169B0',
                  cursor: 'pointer',
                  paddingLeft: 10,
                }}
              />
            </Tooltip>
          </span>
        ),
      };
    },
  },
];

const handleRequestGetLicense = async (headers) => {
  try {
    const license = await requestGetLicense(headers);
    if (license.status === 'OK') {
      return license.payload.data.data.licenseModule.map((module) => ({ group_name: module }));
    }
    throw new Error('~ERROR');
  } catch (err) {
    return null;
  }
};

const handleRequestPermissionList = async (headers) => {
  try {
    const params = {
      group: '',
      permission: '',
    };
    const res = await requestGetPermissions(headers, params);
    if (res?.data) {
      let list = [];
      const permissionsList = Object.values(res.data[0]);
      permissionsList.forEach((element) => {
        let permission = {};
        permission['label'] = element.permission;
        permission['value'] = element.permission_id;
        list.push(permission);
      });
      return list;
    }
    throw new Error('~ERROR');
  } catch (err) {
    return [];
  }
};

const handleRequestGetRoles = async (headers) => {
  try {
    const res = await requestRoleList(headers, { limit: 100, offset: 1 });
    if (res.success === true && Array.isArray(res.data)) {
      return res.data;
    }
    throw new Error('~ERROR');
  } catch (err) {
    return [];
  }
};

RenderTable.propTypes = {
  currentUser: PT.shape({
    permissions: PT.array,
  }).isRequired,
  headers: PT.shape({
    Authorization: PT.string,
  }).isRequired,
};

function RenderTable({ headers, currentUser }) {
  const actionRef = React.useRef();
  const setStateModal = React.useContext(ModalUpdateContext);

  const isManageAndDecentralizeUsers = React.useMemo(
    () => checkPermission(currentUser.permissions, USER_MANAGEMENT.manageAndDecentralizeUsers),
    [currentUser.permissions],
  );
  const [columns, setColumns] = React.useState([]);
  const [licenses, setLicenses] = React.useState([]);
  const [valueSearch, setValueSearch] = React.useState(''); // not used
  const [optionModule, setOptionsModule] = React.useState([]);
  const [roleList, setRoleList] = React.useState([]);
  const [selectedModule, setSelectedModule] = React.useState('Tất cả');

  const handleUpdatePermission = React.useCallback(
    async (dataForm) => {
      try {
        const data = {
          permission_id: dataForm[0]?._id,
          roles_id: dataForm[0]?.roles,
        };
        const res = await requestUpdatePermission(headers, data);
        if (res.success === true) {
          message.success('Cập nhật quyền thành công.');
          actionRef.current.reload();
          return null;
        }
        throw new Error('~ERROR');
      } catch (err) {
        message.error('Có lỗi trong quá trình cập nhật.');
        return null;
      }
    },
    [headers],
  );

  const onCheckboxOnChange = React.useCallback(
    (e) => {
      const { value, id, role, checked, optionGroup } = e.target;
      if (optionGroup) {
        const index = optionGroup
          .filter((elm) => elm.id !== id)
          .findIndex((elm) => {
            if (elm.roles.includes(role)) {
              return true;
            }
          });
        if (index >= 0) {
          message.warning('Không thể cập nhật, hãy kiểm tra lại chính sách quyền.');
          return null;
        }
      }
      if (isString(id)) {
        const dataForm = [
          {
            _id: id,
            roles: checked ? [...value, role] : value.filter((item) => item !== role),
          },
        ];
        handleUpdatePermission(dataForm);
        return null;
      }
      const permissions = [];
      value.forEach((elm) => {
        if (!elm.children) {
          permissions.push({
            _id: elm.id,
            roles: checked
              ? [...new Set([...elm.roles, role])]
              : elm.roles.filter((item) => item !== role),
          });
          return null;
        }
        elm.children.forEach((child) => {
          permissions.push({
            _id: child.id,
            roles: checked
              ? [...new Set([...child.roles, name])]
              : child.roles.filter((item) => item !== name),
          });
        });
        return null;
      });
      handleUpdatePermission(permissions);
      return null;
    },
    [handleUpdatePermission],
  );

  const onToggleModalRoleForm = React.useCallback(
    (isEdit, initialValues) => () => {
      const cb = () => {
        actionRef.current.reload();
        setStateModal(false, {});
      };

      handleRequestPermissionList2(headers, initialValues).then((result) => {
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

  const handleRequestGetPermissionByRoleId = async (headers, id) => {
    try {
      const res = await getPermissionByRoleId(headers, id);
      return res.data;
    } catch (err) {
      return [];
    }
  };

  const handleRequestPermissionList2 = React.useCallback(
    async (headers, initialValues) => {
      const params = {
        group: '',
        permission: '',
      };
      const res = await requestGetPermissions(headers, params);
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
  // const onToggleModalRoleForm = React.useCallback((isEdit, initialValues) => () => {
  //   const cb = async () => {
  //     // update or create success we must re-render header
  //     const roles = await handleRequestGetRoles(headers);
  //     setRoleList(roles);
  //     setStateModal(false, {});
  //   }
  //   renderModalRoleForm({ headers, initialValues, isEdit, cb, setStateModal })()
  // }, [headers, setStateModal]);

  React.useLayoutEffect(() => {
    const mergeColumns = [...defaultColumns];
    roleList.forEach((role) => {
      if (isString(role.role)) {
        mergeColumns.push({
          title: (
            <Tooltip placement="top" title={role.role}>
              <div
                style={{
                  color: '#000',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  // width: '20px'
                }}
              >
                {role.role}
              </div>
            </Tooltip>
          ),
          dataIndex: role.role,
          align: 'center',
          render: (_, record) => {
            if (!record.alias) {
              if (record.groupName) {
                return {
                  props: {
                    style: { background: '#fff' },
                  },
                  children: (
                    <Checkbox
                      // id={record.groupName && []}
                      // role={role.name}
                      // value={record.children}
                      // optionGroup={record.optionGroup}
                      // checked={handleChecked(record.children, role.code)}
                      // onChange={onCheckboxOnChange}
                      disabled
                    />
                  ),
                };
              }
              return {
                props: {
                  style: { background: '#EBF5FB' },
                },
                children: isManageAndDecentralizeUsers ? (
                  <Checkbox
                    id={record.id}
                    role={role.id}
                    value={record.roles}
                    optionGroup={record.group}
                    disabled={handleDisable(record, role)}
                    checked={record?.roles ? record.roles.includes(role.id) : false}
                    onChange={onCheckboxOnChange}
                  />
                ) : record.roles.includes(role.id) ? (
                  <CheckOutlined style={{ color: 'green' }} />
                ) : (
                  <CloseOutlined style={{ color: 'red' }} />
                ),
              };
            }
            return null;
          },
        });
      }
    });
    setColumns(mergeColumns);
  }, [
    isManageAndDecentralizeUsers,
    onCheckboxOnChange,
    onToggleModalRoleForm,
    roleList,
    setStateModal,
  ]);

  React.useEffect(() => {
    handleRequestPermissionList(headers).then((permissions) => {
      setOptionsModule(permissions);
    });
  }, []);

  React.useEffect(() => {
    handleRequestGetRoles(headers).then((roles) => {
      setRoleList(roles);
    });

    handleRequestGetLicense(headers).then((license) => {
      if (license) {
        setLicenses(license);
        setOptionsModule([
          {
            label: 'Tất cả',
            value: ALL_OPTIONS_MODULE,
          },
          // eslint-disable-next-line camelcase
          // ...license.map(({ group_name }) => ({ label: group_name, value: group_name }))
        ]);
      }
    });
  }, [headers]);

  return (
    <div className={styles.userTable}>
      <Table
        search={false}
        options={false}
        pagination={false}
        size="small"
        scroll={{ x: 1900, y: 650 }}
        cardProps={{
          bodyStyle: { background: '#f0f2f5', paddingTop: 0 },
        }}
        rowKey={(record) => `${record.key}${record.index}`}
        actionRef={actionRef}
        columns={columns}
        params={{
          _licenses: licenses,
          _selectedModule: selectedModule,
          search: valueSearch,
        }}
        request={async ({ _licenses, _selectedModule, search }) => {
          // if length license > 0 we must call api
          if (_licenses.length > 0) {
            const params = {
              group: '',
              permission: search,
            };
            if (_selectedModule !== ALL_OPTIONS_MODULE) {
              params.group = _selectedModule;
            }
            try {
              const res = await requestGetPermissions(headers, params);
              let values;
              if (api.ENV === 'local' || api.ENV === 'dev') {
                values = Object.values(res?.data[0]);
              } else {
                // hide report management
                let resObject = res?.data[0];
                const listKeyToRemove = Object.keys(resObject).filter(
                  (item) => res?.data[0][item]?.group === 'Report Management',
                );
                for (let key of listKeyToRemove) {
                  delete resObject[key];
                }
                values = Object.values(resObject); // change resObject to res?.data[0] to unhide
              }

              if (Array.isArray(values)) {
                const dataConverted = convertDataTable(values);
                return {
                  data: dataConverted,
                  total: res?.total,
                };
              }
              throw new Error('~ERROR');
            } catch (err) {
              return {
                data: [],
                total: 0,
              };
            }
          }
          return {
            data: [],
            total: 0,
          };
        }}
        expandable={{
          defaultExpandAllRows: true,
          expandIcon: ({ expanded, onExpand, record }) => {
            if (record.groupName || record.alias) {
              return (
                <RightCircleOutlined
                  onClick={(e) => onExpand(record, e)}
                  style={{
                    color: '#1169B0',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    padding: '0 5px',
                    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform .2s linear',
                    transformOrigin: 'center center',
                  }}
                />
              );
            }
            return '';
          },
        }}
        toolBarRender={() => [
          <Input
            key="search"
            // onPressEnter={(e) => setValueSearch(e.target.value)}
            placeholder="Nhập từ khóa"
            allowClear
            prefix={<SearchOutlined />}
            onChange={debounce(
              (e) => {
                const { value } = e.target;
                if (value.length <= 50) {
                  setValueSearch(value);
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
          <Button
            hidden={!isManageAndDecentralizeUsers}
            key="add"
            style={{ background: '#127ace', color: '#fff' }}
            onClick={onToggleModalRoleForm(false)}
            icon={<PlusOutlined />}
          >
            Thêm vai trò
          </Button>,
        ]}
        headerTitle={
          <div className={styles.searchWrapper}>
            <div className={styles.search}>
              <Form.Item label="Cụm chức năng" style={{ marginBottom: 0 }}>
                <Select
                  defaultValue="Tất cả"
                  style={{ width: '18rem' }}
                  placeholder="Tất cả"
                  onChange={setSelectedModule}
                >
                  <Option key="Tất cả" value="Tất cả">
                    Tất cả
                  </Option>
                  {Object.keys(permission_mapping.group).map((item) => (
                    <Option key={item} value={item}>
                      {
                        permission_mapping.group[
                          Object.keys(permission_mapping.group).find((e) => e === item)
                        ]
                      }
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default RenderTable;
