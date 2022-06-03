import React, { useEffect, useState } from 'react';
import { Checkbox, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { testPermission, testRole, updatePermission } from './service';
import FormRole from './components/Form';
import Form from 'antd/lib/form/Form';

const fakeData = [
  {
    key: 'Access Mailer Screen',
    admin: 'Access Mailer Screen',
    moderator: 'Access Mailer Screen',
  },
  {
    key: 'Assign Roles',
    admin: 'Assign Roles',
    moderator: 'Assign Roles',
  },
  {
    key: 'Ban User',
    admin: 'Ban User',
    moderator: 'Ban User',
  },
  {
    key: 'Call Management',
    admin: 'Call Management',
    moderator: 'Call Management',
  },
  {
    key: 'Archive Room',
    admin: 'Archive Room',
    moderator: 'Archive Room',
  },
];

const TestTable = () => {
  const admin = [];
  const moderator = [];
  const [role, setRole] = useState([]);
  const [allRole, setAllRole] = useState([]);
  const roleArr = [];
  const [permissionDataSrc, setPermissionDataSrc] = useState([]);
  const [permissionReload, setPermissionReload] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

  const onChange = (e) => {
    console.log(e.target.name, e.target.value, e.target.checked)
    const dataUpdate = [];
    // clone object in permission data
    permissionDataSrc.map(x => {
      const clone = JSON.parse(JSON.stringify(x));
      if(clone.key === e.target.value) {
        clone[e.target.name] = e.target.checked;
        for(let i = 0; i < allRole.length; i+=1) {
          if(clone[allRole[i]] === true) {
            dataUpdate.push(allRole[i])
          }
        }
      }
      return clone;
    })
    roleArr.push(e.target.name);
    const permissionUpdate = {
      permissions: [{ _id: e.target.value, roles: dataUpdate }],
    }
    console.log(permissionUpdate);
    (async () => {
      const res = await updatePermission(permissionUpdate);
      console.log(res);
    })();
  };

  useEffect(() => {
    (async () => {
      const resRole = await testRole();
      const resPermission = await testPermission();
      const permission = resPermission.update.filter(x => x.groupPermissionId === undefined);
      setPermissionReload(permission)
      // create col of role
      const roleCol = [
        {
          title: 'Key',
          dataIndex: 'key',
        }
      ]
      const allRoleArr = []
      // array of all role and role col for pro table
      resRole.roles.map(x => {
        if(typeof x._id === 'string') {
          allRoleArr.push(x._id);
          roleCol.push({
            title: <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={() => setFormVisible(true)}>{x._id}</span>,
            dataIndex: x._id,
            render: (_, record) => {
              // console.log(record);
              return <Checkbox name={x._id} value={record.key} defaultChecked={record[x._id]} onChange={onChange} />;
            },
          });
        }
        return roleCol;
      }})
      // console.log(allRoleArr, roleCol)
      setAllRole(allRoleArr);
      setRole(roleCol);
      const permissionData = [];
      // add data for pro table
      for(let i = 0; i < permission.length; i+=1) {
        const obj={};
        obj.key = permission[i]._id;
        // eslint-disable-next-line array-callback-return
        permission[i].roles.map(x => {
          obj[x] = true;
        })
        // eslint-disable-next-line array-callback-return
        allRoleArr.filter(x=>!permission[i].roles.includes(x)).map(x=>{
          obj[x] = false
        })
        permissionData.push(obj);
      }
      setPermissionDataSrc(permissionData)
    })();
  }, []);

  console.log(permissionDataSrc);

  return (
    <PageContainer>
      <ProTable columns={role} dataSource={permissionDataSrc} search={false} />
      <Modal title="Cập nhật vai trò" visible={formVisible} onCancel={() => setFormVisible(false)}>
        <FormRole />
      </Modal>
    </PageContainer>
  );
};

export default TestTable;
