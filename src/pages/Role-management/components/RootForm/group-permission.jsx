import React, { useState } from 'react';
import { FormattedMessage } from 'umi';
import { Form, Input, Button, Typography, Collapse, Checkbox, Row } from 'antd';
import RootForm from './index';
import styles from './styles.less';
import { permission_mapping } from '@/constants/maping-permission';
const { Panel } = Collapse;
const CheckboxGroup = Checkbox.Group;

function GroupPermission(props) {
  const {
    refForm,
    permission,
    permissions,
    list_en,
  } = props

  const list = list_en?.map(elm => {
    return {
      label: permission_mapping.detail[Object.keys(permission_mapping.detail).find(e => e === elm.label)],
      value: elm.value
    }
  });

  const plainOptions = permissions.map(elm => {
    return {
      label: permission_mapping.detail[Object.keys(permission_mapping.detail).find(e => e === elm.permission)],
      value: elm.permission_id
    }
  });

  const [checkedList, setCheckedList] = React.useState(list);
  const [indeterminate, setIndeterminate] = React.useState((list && !!list.length && list.length < plainOptions.length) ? true : false);
  const [checkAll, setCheckAll] = React.useState(list && plainOptions && (list.length === plainOptions.length));

  const onChange = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
    let name = {}
    name[`${permission}`] = e.target.checked ? [...plainOptions.map(e => e.value)] : [];
    refForm.setFieldsValue({
      ...name,
    });
  };

  return (
    <Collapse defaultActiveKey={(list && list.length > 0) ? [`${permission}`] : []} ghost>
      <Panel className={styles} header={<Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} key={permission}>
        {permission_mapping.group[Object.keys(permission_mapping.group).find(e => e === permission)]}
      </Checkbox>}
        key={permission}>
        <div style={{ width: "100%" }}>
          <Form.Item
            name={permission}
            noStyle
          // label={
          //   <FormattedMessage
          //     defaultMessage="Role Description"
          //     id="pages.user-management.form.label.role-description"
          //   />
          // }
          >
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
          </Form.Item >
        </div>
      </Panel>
    </Collapse>
  )
}

export default GroupPermission