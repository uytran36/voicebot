import React, { useState } from 'react';
import { FormattedMessage } from 'umi';
import { Form, Input, Button, Typography, Collapse, Checkbox } from 'antd';
import RootForm from './index';
import { createRole, updateRole, getPermissionByRoleId } from '../Table/function';
import GroupPermission from './group-permission';
import { groupBy, concat, isArray } from 'lodash';
import api from '@/api';

const { Title } = Typography;

function RoleForm(props) {
  const { headers, initialValues, isEdit, cb, setStateModal, permissions, list } = props.props;

  const [form] = Form.useForm();

  React.useEffect(() => {
    // const listcheckedID = list.map(e => e.permission_id)
    // const listPermissions = [].concat(...Object.values(permissions))
    // const newList = listPermissions.filter(e => listcheckedID.includes(e.permission_id)).map(elm => { return { label: elm.permission, value: elm.permission_id, group: elm.group } })
    // // const grouped = groupBy(newList.filter(elm => elm.group), 'group');
    // var grouped = _.mapValues(_.groupBy(newList, 'group'),
    //   clist => clist.map(per => { return per.value }));
    // console.log("new list", grouped)
  }, []);

  const grouped = _.mapValues(
    _.groupBy(
      []
        .concat(...Object.values(permissions))
        .filter((e) => list.map((e) => e.permission_id).includes(e.permission_id))
        .map((elm) => {
          return { label: elm.permission, value: elm.permission_id, group: elm.group };
        }),
      'group',
    ),
    (clist) =>
      clist.map((per) => {
        return per.value;
      }),
  );

  const groupedList = _.mapValues(
    _.groupBy(
      []
        .concat(...Object.values(permissions))
        .filter((e) => list.map((e) => e.permission_id).includes(e.permission_id))
        .map((elm) => {
          return { label: elm.permission, value: elm.permission_id, group: elm.group };
        }),
      'group',
    ),
    (clist) => clist.map((per) => _.omit(per, 'group')),
  );

  const handleCreateNewRole = async (values) => {
    const array = [];
    Object.values(values).filter((e) => {
      if (isArray(e)) {
        array.push(e);
      }
    });
    const permission_list = [].concat(...array);
    const valueRequest = {
      list_permission: permission_list,
      description: values.description,
      role: values.role,
    };
    const success = await createRole(headers, valueRequest);
    if (success) {
      cb();
    }
  };

  const handleUpdateRole = async (values) => {
    const array = [];
    Object.values(values).filter((e) => {
      if (isArray(e)) {
        array.push(e);
      }
    });
    const permission_list = [].concat(...array);
    const valueRequest = {
      list_permission: permission_list,
      description: values.description,
      role: values.role,
      role_id: initialValues.id,
    };
    const success = await updateRole(headers, valueRequest);
    if (success) {
      cb();
    }
  };

  const initValue = {
    ...initialValues,
    ...grouped,
  };

  return (
    <RootForm
      refForm={form}
      headers={headers}
      initialValues={initValue}
      onFinish={isEdit ? handleUpdateRole : handleCreateNewRole}
    >
      <Title level={5}> {isEdit ? 'Chỉnh sửa vai trò' : 'Thêm vai trò'}</Title>
      <Form.Item
        name="role"
        label={
          <FormattedMessage
            defaultMessage="Role Name"
            id="pages.user-management.form.label.role-name"
          />
        }
        rules={[
          {
            required: true,
            message: 'Tên không được để trống',
          },
          {
            maxLength: 30,
            message: 'Tên đã đạt đến số kí tự tối đa',
          },
          {
            pattern: new RegExp(/^[^\]|\\/:;"'<>,&.?~`#!(${%)\-_@^*+=}[]+$/),
            message: 'Tên không được chứa kí tự đặc biệt',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="description"
        label={
          <FormattedMessage
            defaultMessage="Role Description"
            id="pages.user-management.form.label.role-description"
          />
        }
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        label={
          <FormattedMessage
            defaultMessage="Permission"
            id="pages.user-management.form.label.permission"
          />
        }
      >
        {api.ENV === 'local' && api.ENV === 'local'
          ? Object.keys(permissions).map((permission) => (
              <GroupPermission
                refForm={form}
                permission={permission}
                permissions={Object.values(permissions).find((e) => e[0].group === permission)}
                list_en={groupedList[permission]}
              />
            ))
          : Object.keys(permissions)
              .filter((item) => item !== 'Report Management') // hide report management
              .map((permission) => (
                <GroupPermission
                  refForm={form}
                  permission={permission}
                  permissions={Object.values(permissions).find((e) => e[0].group === permission)}
                  list_en={groupedList[permission]}
                />
              ))}
      </Form.Item>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button style={{ marginRight: 10 }} onClick={() => setStateModal(false, {})}>
          Hủy
        </Button>
        <Button type="primary" htmlType="submit">
          Lưu
        </Button>
      </div>
    </RootForm>
  );
}

export default RoleForm;
