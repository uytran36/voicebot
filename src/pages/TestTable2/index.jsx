import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import ProTable from '@ant-design/pro-table';
import { Checkbox, message, Modal } from 'antd';
import { DownOutlined, RightOutlined, InfoCircleOutlined } from '@ant-design/icons';
import FormRole from './components/Form';
import { requestGetPermission, testRole, updatePermission } from './service';

const listPermission2 = [
  {
    _id: 'accessFacebook',
    roles: ['admin'],
    isCreator: true,
    group_name: 'OmniChatInbound',
    alias: 'Quyền truy cập Omni Chat Social',
    name: 'Quyền truy cập Omni - Facebook Messenger',
    description: '',
  },
  {
    _id: 'accessLiveChat',
    roles: ['moderator'],
    isCreator: true,
    group_name: 'OmniChatInbound',
    alias: 'Quyền truy cập Omni Chat Social',
    name: 'Quyền truy cập Omni - Livechat',
    description: '',
  },
  {
    _id: 'accessZalo',
    roles: ['leader'],
    isCreator: true,
    group_name: 'OmniChatInbound',
    alias: 'Quyền truy cập Omni Chat Social',
    name: 'Quyền truy cập Omni - Zalo Chat',
    description: '',
  },
  {
    _id: 'configCampaignIVR',
    roles: [],
    isCreator: true,
    group_name: 'VoiceBot',
    alias: 'Quyền quản lý chiến dịch',
    name: 'Cấu hình chiến dịch IVR',
    description: '',
  },
  {
    _id: 'configCampaignT2S',
    roles: [],
    isCreator: true,
    group_name: 'VoiceBot',
    alias: 'Quyền quản lý chiến dịch',
    name: 'Cấu hình chiến dịch T2S',
    description: '',
  },
  {
    _id: 'configChannelChat',
    roles: ['admin'],
    isCreator: true,
    group_name: 'OmniChatInbound',
    alias: '',
    name: 'Quyền cấu hình kênh chat',
    description: '',
  },
  {
    _id: 'configVoicebot',
    roles: [],
    isCreator: true,
    group_name: 'VoiceBot',
    alias: '',
    name: 'Quyền cấu hình VoiceBot',
    description: '',
  },
  {
    _id: 'importDataCalling',
    roles: [],
    isCreator: true,
    group_name: 'VoiceBot',
    alias: 'Quyền quản lý dữ liệu gọi',
    name: 'Quyền import dữ liệu và chuẩn hóa dữ liệu gọi',
    description: '',
  },
  {
    _id: 'importDataDNC',
    roles: [],
    isCreator: true,
    group_name: 'VoiceBot',
    alias: 'Quyền quản lý dữ liệu gọi',
    name: 'Quyền import dữ liệu DNC',
    description: '',
  },
  {
    _id: 'viewDashboardOmniInbound',
    roles: ['admin'],

    isCreator: true,
    group_name: 'OmniChatInbound',
    alias: '',
    name: 'Quyền xem Dashboard Omni Inbound',
    description: '',
  },
  {
    _id: 'viewReportCampaign',
    roles: [],
    isCreator: true,
    group_name: 'VoiceBot',
    alias: '',
    name: 'Quyền xem báo cáo chiến dịch',
    description: '',
  },
  {
    _id: 'viewReportOmniInbound',
    roles: [],
    isCreator: true,
    group_name: 'OmniChatInbound',
    alias: '',
    name: 'Quyền xem báo cáo Omni Inbound',
    description: '',
  },
];

const Permission = (props) => {
  const { user } = props;
  const { userId, authToken, tokenGateway } = user;
  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`,
  };
  const DataSrc = [];
  const [role, setRole] = useState('');
  const [permission, setPermission] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [listPermission, setListPermission] = useState([]);
  const [colRole, setColRole] = useState([]);
  const [allRole, setAllRole] = useState([]);

  useEffect(() => {
    formatColumn();
    // formHeaderColumn();
  }, []);

  const formatColumn = async () => {
    // setListPermission(listPermission2);
    const res = await requestGetPermission(headers, {
      filter: {
        where: {
          or: [
            { group_name: 'VoiceBot' },
            { group_name: 'OmniChatInbound' },
            { group_name: 'Usermanagement' },
          ],
        },
      },
    });
    res?.length > 0 && setListPermission(res);
    formHeaderColumn(res);
  };

  const formHeaderColumn = async (resPermission) => {
    const allRoleArr = [];
    const roleCol = [
      {
        title: 'Key',
        dataIndex: 'key',
        align: 'left',
        width: 300,
        render: (_, record) => {
          if (record.groupname) {
            return {
              props: {
                style: { background: '#C4C4C4' },
              },
              children: record.key,
            };
          }
          return (
            <span>
              {record.key}
              <InfoCircleOutlined style={{ paddingLeft: '4px' }} />
            </span>
          );
        },
      },
    ];
    const res = await testRole();
    res.roles.map((x) => {
      if (typeof x._id === 'string') {
        allRoleArr.push(x._id);
        roleCol.push({
          title: (
            <span
              style={{ color: '#1890ff', cursor: 'pointer' }}
              onClick={() => setFormVisible(true)}
            >
              {x._id}
            </span>
          ),
          dataIndex: x._id,
          align: 'center',
          render: (_, record) => {
            // return {
            //   props: {
            //     style: { background: record.groupname ? 'red' : 'green' },
            //   },
            //   children: <div>123</div>,
            // };
            if (!record.alias) {
              if (record.groupname)
                return {
                  props: {
                    style: { background: '#C4C4C4' },
                  },
                  children: (
                    <Checkbox
                      name={x._id}
                      value={record.children}
                      onChange={(e) => onChange(e, resPermission)}
                    />
                  ),
                };
              return (
                <Checkbox
                  name={x._id}
                  value={record.key}
                  // checked={permission.includes(record.key) && role === x._id}
                  defaultChecked={record?.roles ? record.roles.includes(x._id) : false}
                  onChange={(e) => onChange(e, resPermission)}
                />
              );
            }
            return null;
            // return (
            //   <Checkbox
            //     name={x._id}
            //     value={record.key}
            //     defaultChecked={record?.roles ? record.roles.includes(x._id): false }
            //     onChange={onChange}
            //   />
            // );
          },
        });
      }
      return roleCol;
    });
    setAllRole(allRoleArr);
    setColRole(roleCol);
  };

  const merge = (arr) => {
    const seen = {};
    const NameAlias = arr.filter((entry) => {
      let previous;
      if (seen.hasOwnProperty(entry.key) && Object.keys(entry).length >= 2) {
        previous = seen[entry.key];
        previous.children.push(entry.children);
        return false;
      }
      if (!Array.isArray(entry.children) && Object.keys(entry).length >= 2 && entry.children) {
        // eslint-disable-next-line no-param-reassign
        entry.children = [entry.children];
      }
      seen[entry.key] = entry;
      return true;
    });
    return NameAlias;
  };

  for (let i = 0; i < listPermission.length; i += 1) {
    DataSrc.push({
      groupname: true,
      key: listPermission[i].group_name,
      id: listPermission[i]._id,
      children:
        listPermission[i].alias === ''
          ? {
              key: listPermission[i].name,
              roles: listPermission[i].roles,
              id: listPermission[i]._id,
            }
          : {
              key: listPermission[i].alias,
              children: {
                key: listPermission[i].name,
                roles: listPermission[i].roles,
                id: listPermission[i]._id,
              },
              alias: true,
              id: listPermission[i]._id,
            },
    });
  }

  const seen2 = {};
  const DataSrcNew = DataSrc.filter((entry) => {
    if (entry) {
      let previous;
      // console.log(entry, seen2.hasOwnProperty(entry.key));
      if (seen2.hasOwnProperty(entry.key)) {
        previous = seen2[entry.key];
        previous.children.push(entry.children);
        return false;
      }
      if (!Array.isArray(entry.children)) {
        // eslint-disable-next-line no-param-reassign
        entry.children = [entry.children];
      }
      seen2[entry.key] = entry;
      return true;
    }
  });

  for (let i = 0; i < DataSrcNew.length; i += 1) {
    DataSrcNew[i].children = merge(DataSrcNew[i].children);
  }

  const ObjectToString = (arr) => {
    if (arr) {
      const data = arr.map((x) => {
        return x.key;
      });
      return data;
    }
    return [];
  };

  const onChange = async (e, listPermissions) => {
    console.log(e, listPermissions);
    // handle permission
    if (typeof e.target.value === 'string') {
      const permissionSelected = listPermissions.find((elm) => elm.name === e.target.value);
      let dataUpdate = [];
      if (e.target.checked) {
        setRole(e.target.name);
        setPermission((arr) => [...arr, e.target.value]);
        dataUpdate = [
          {
            permissions: {
              _id: permissionSelected._id,
              roles: [...permissionSelected.roles, e.target.name],
            },
          },
        ];
      } else {
        setPermission(permission.filter((x) => x !== e.target.value));
        dataUpdate = [
          {
            permissions: {
              _id: permissionSelected._id,
              roles: permissionSelected.roles.filter((item) => item !== e.target.name),
            },
          },
        ];
        console.log(dataUpdate);
      }
      const resUpdatePermission = await updatePermission(headers, dataUpdate);
      if (resUpdatePermission?.success) {
        formatColumn();
        return message.success('Update permission success');
      }
      return message.error('Update permission fail');
    } else {
      // handle group name
      const data = e.target.value;
      if (e.target.checked) {
        setRole(e.target.name);
        for (let i = 0; i < data.length; i += 1) {
          if (Object.keys(data[i]).length <= 1 && !permission.includes(data[i].key))
            setPermission((arr) => [...arr, data[i].key]);
          else
            ObjectToString(data[i].children).map((x) => {
              if (!permission.includes(x)) setPermission((arr) => [...arr, x]);
              return permission;
            });
        }
        console.log('vao 2');
      } else {
        const dataUpdate = [];
        for (let i = 0; i < data.length; i += 1) {
          if (Object.keys(data[i]).length <= 1) {
            dataUpdate.push(data[i].key);
          }
          // eslint-disable-next-line array-callback-return
          else
            ObjectToString(data[i].children).map((x) => {
              dataUpdate.push(x);
            });
        }
        setPermission(
          permission.filter(function (x) {
            return dataUpdate.indexOf(x) < 0;
          }),
        );
        console.log('vao 3');
      }
    }
  };

  console.log(role, listPermission);

  const columns = [
    {
      title: 'Key',
      dataIndex: 'key',
      align: 'left',
      width: 300,
    },
    {
      title: 'Admin',
      dataIndex: 'admin',
      align: 'center',
      render: (text, record, index) => {
        console.log(record);
        if (!record.alias) {
          if (record.groupname)
            return (
              <Checkbox
                name="admin"
                value={record.children}
                onChange={onChange}
                // onClick={() => setFormVisible(true)}
              />
            );
          return (
            <Checkbox
              name="admin"
              value={record.key}
              checked={permission.includes(record.key) && role === 'admin'}
              onChange={onChange}
            />
          );
        }
        return null;
      },
    },
    {
      title: 'Supervisor',
      dataIndex: 'supervisor',
      align: 'center',
      render: (text, record, index) => {
        if (!record.alias) {
          if (record.groupname)
            return <Checkbox name="supervisor" value={record.children} onChange={onChange} />;
          return (
            <Checkbox
              name="supervisor"
              value={record.key}
              checked={permission.includes(record.key) && role === 'supervisor'}
              onChange={onChange}
            />
          );
        }
        return null;
      },
    },
    {
      title: 'Leader chat',
      dataIndex: 'leader-chat',
      align: 'center',
      render: (text, record, index) => {
        if (!record.alias) {
          if (record.groupname)
            return <Checkbox name="leader-chat" value={record.children} onChange={onChange} />;
          return (
            <Checkbox
              name="leader-chat"
              value={record.key}
              checked={permission.includes(record.key) && role === 'leader-chat'}
              onChange={onChange}
            />
          );
        }
        return null;
      },
    },
    {
      title: 'Leader call',
      dataIndex: 'leader-call',
      align: 'center',
      render: (text, record, index) => {
        if (!record.alias) {
          if (record.groupname)
            return <Checkbox name="leader-call" value={record.children} onChange={onChange} />;
          return (
            <Checkbox
              name="leader-call"
              value={record.key}
              checked={permission.includes(record.key) && role === 'leader-call'}
              onChange={onChange}
            />
          );
        }
        return null;
      },
    },
    {
      title: 'Supporter',
      dataIndex: 'supporter',
      align: 'center',
      render: (text, record, index) => {
        if (!record.alias) {
          if (record.groupname)
            return <Checkbox name="supporter" value={record.children} onChange={onChange} />;
          return (
            <Checkbox
              name="supporter"
              value={record.key}
              checked={permission.includes(record.key) && role === 'supporter'}
              onChange={onChange}
            />
          );
        }
        return null;
      },
    },
  ];

  console.log(colRole, listPermission);

  return (
    <PageContainer>
      {listPermission.length > 0 && (
        <>
          <ProTable
            pagination={{
              defaultPageSize: 10,
              showTotal: false,
              size: 'default',
              // showSizeChanger: false,
            }}
            size="small"
            columns={colRole}
            // columns={columns}
            dataSource={DataSrcNew}
            search={false}
            expandable={{
              defaultExpandAllRows: true,
              expandIcon: ({ expanded, onExpand, record }) => {
                console.log(record);
                if (record.groupname || record.alias) {
                  return expanded ? (
                    <RightOutlined
                      onClick={(e) => onExpand(record, e)}
                      style={{
                        color: '#1169B0',
                        fontWeight: 'bold',
                        fontSize: '10px',
                        paddingRight: '3px',
                      }}
                    />
                  ) : (
                    <DownOutlined
                      onClick={(e) => onExpand(record, e)}
                      style={{
                        color: '#1169B0',
                        fontWeight: 'bold',
                        fontSize: '10px',
                        paddingRight: '3px',
                      }}
                    />
                  );
                }
              },
            }}
            scroll={{ x: true }}
            // rowClassName={(record, index) => (record.groupname ? styles.red : styles.green)}
          />
          <Modal
            title="Cập nhật vai trò"
            visible={formVisible}
            onCancel={() => setFormVisible(false)}
          >
            <FormRole />
          </Modal>
        </>
      )}
    </PageContainer>
  );
};

export default connect(({ user }) => ({ user }))(Permission);

// phai fetch data api xu ly render column truoc
