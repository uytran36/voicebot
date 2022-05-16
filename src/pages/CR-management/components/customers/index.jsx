import React, { useCallback, useState, useRef, useEffect } from 'react';
import PT from 'prop-types';
import debounce from 'lodash/debounce';
import {
  Button,
  Input,
  Form,
  Select,
  Space,
  message,
  Tooltip,
  Popover,
  notification,
  Popconfirm,
  Checkbox,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
// import Table from '@ant-design/pro-table';
import { Import, Export } from '@/components/Icons';
import styles from './styles.less';
import AddNewCustomer from '../add-new-customer';
import RootForm from '../root-form';
import {
  requestDeleteCustomers,
  requestCreateCustomer,
  requestExportCustomer,
  requestAddCustomersToGroup,
  requestGetCustomersOfGroup,
} from '@/services/crm';
import api from '@/api';
import Table from './Table';
import AddCustomersToGroups from './add-customers-to-group';
import { ModalUpdateContext } from '@/contexts/modal.context';
import NoDataPermission from '@/components/NoDataPermission';

// import moment from 'moment';

const onDeleteCustomer = async (listCusID, headers = {}) => {
  const hide = message.loading('Đang xoá...');
  try {
    const res = await requestDeleteCustomers(listCusID, headers);
    if (res?.msg === 'SUCCESS') {
      hide();
      message.success('Đã xoá khách hàng được chọn.');
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    hide();
    message.warning('Không thể xoá khách hàng được chọn.');
    return null;
  }
};

const onCreateCustomer = async (body, headers = {}) => {
  const hide = message.loading('Đang tạo mới...');
  try {
    const res = await requestCreateCustomer(body, headers);
    if (res.code === 200) {
      hide();
      message.success('Đã tạo mới khách hàng.');
      return true;
    }
    throw new Error(res.msg || 'ERROR~');
  } catch (err) {
    console.error(err);
    hide();
    notification.warning({
      message: 'Không thể tạo mới khách hàng',
      description: err.toString(),
    });
    return false;
  }
};

const onExportCustomer = async (fields, filter = {}, headers = {}) => {
  const hide = message.loading('Đang export...');
  // console.log(fields);
  try {
    const res = await requestExportCustomer(
      { columns: JSON.stringify(fields.toString()), members: [].toString(), ...filter },
      headers,
    );
    hide();
    // if (res.success) {
    //   message.success('Export thành công.');
    //   return res;
    // }
    // throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    // hide();
    // message.warning('Không thể export.');
    return null;
  }
};

const onAddCustomersToGroup = async (body, headers = {}) => {
  const hide = message.loading('Đang tạo mới...');
  try {
    const res = await requestAddCustomersToGroup(body, headers);
    if (res?.msg === 'SUCCESS') {
      hide();
      message.success('Thêm khách hàng vào nhóm thành công.');
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    hide();
    message.warning('Không thể thêm khách hàng vào nhóm.');
    return null;
  }
};

const maximumRowSelected = 200;
const messageMaximumRowSelected = `Không thể chọn hơn ${maximumRowSelected} khách hàng`;

Customers.propTypes = {
  onSettotalCustomer: PT.func.isRequired,
  toggleImportCustomer: PT.func.isRequired,
  groups: PT.instanceOf(Array).isRequired,
  tabActive: PT.string.isRequired,
  totalCustomer: PT.number.isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  wsId: PT.string.isRequired,
  permissions: PT.shape({
    manage: PT.bool.isRequired,
    update: PT.bool.isRequired,
    onlyView: PT.bool.isRequired,
  }).isRequired,
};

function Customers({
  onSettotalCustomer,
  toggleImportCustomer,
  groups,
  tabActive,
  totalCustomer,
  headers,
  wsId,
  permissions,
}) {
  const actionRef = useRef(null);
  const { manage, update, onlyView } = permissions;
  const [valueSearch, setValueSearch] = useState('');
  const [stateCol, setStateCol] = useState({});
  const [valueSelect, setValueSelect] = useState('');
  const [popoverVisible, togglePopover] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedAll, toggleSelectedAll] = useState(false);
  const [dataRowKeys, setDataRowKeys] = useState([]);

  const setStateModal = React.useContext(ModalUpdateContext);

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
        const result = onCreateCustomer(
          {
            ...values,
            groups: values.groups
              ? values.groups.map((group) => {
                  const groupSplit = group.split('-');
                  return {
                    id: groupSplit[0],
                    name: groupSplit[1],
                  };
                })
              : [],
            phones: [{ phone: values?.phones, default: true }],
            gender: values.gender || '',
            alias: values.alias || '',
            addresses: values.addresses || '',
            facebook: values.facebook || '',
            zalo: values.zalo || '',
            email: values.email || '',
            description: values.description || '',
            dateOfBirth: values.dateOfBirth || '',
          },
          headers,
        );
        if (result) {
          actionRef.current?.reload();
          setStateModal(false, {});
        }
      } catch (err) {
        console.error(err);
        notification.error({
          message: 'Không thể tạo mới khách hàng',
          description: 'Hãy kiểm tra lại các trường thông tin.',
        });
      }
    },
    [headers, setStateModal],
  );

  const handleAddNewCustomer = useCallback(() => {
    setStateModal(true, {
      bodyStyle: { padding: '10px' },
      title: 'Thêm khách hàng',
      footer: null,
      onCancel: () => setStateModal(false, {}),
      content: (
        <RootForm layout="vertical" onFinish={handleFinishForm}>
          <AddNewCustomer />
          <div className={styles['group-btn']}>
            <Button onClick={() => setStateModal(false, {})}>Huỷ</Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </RootForm>
      ),
    });
  }, [setStateModal, handleFinishForm]);

  /**
   * @param {String[]} _selectedRowKeys - ID record
   */
  const handleDeleteCustomer = useCallback(
    (_selectedRowKeys, onCleanSelected, _headers = {}) =>
      async () => {
        const result = await onDeleteCustomer(_selectedRowKeys, _headers);
        if (result) {
          actionRef.current?.reload();
          onCleanSelected();
        }
      },
    [],
  );

  /**
   * @param {String []} _selectedRowKeys - IDs
   */
  const handleExportData = useCallback(
    (_selectedRowKeys, _headers) => async () => {
      const filter = {
        members: _selectedRowKeys.toString(),
        subId: wsId,
        groupId: '',
      };
      console.log(filter);
      const result = await onExportCustomer(stateCol, filter, _headers);
      if (result?.success) {
        const file =
          result.data['url-download'].split('/')[result.data['url-download'].split('/').length - 1];
        window.open(`${api.CM_SERVICE}/assets/${file}`).focus();
      }
    },
    [stateCol, wsId],
  );
  // console.log({stateCol})
  const handleExportAllData = useCallback(async () => {
    const filter = {
      subId: wsId,
      groupId: '',
    };
    const result = await onExportCustomer(stateCol, filter, headers);
    if (result?.success) {
      const file =
        result.data['url-download'].split('/')[result.data['url-download'].split('/').length - 1];
      window.open(`${api.CM_SERVICE}/assets/${file}`).focus();
    }
  }, [wsId, stateCol, headers]);

  const addCustomerSelectedToGroups = useCallback(
    async (_selectedRowKeys, groupSelected, onCleanSelected, _headers, filter) => {
      let data = {};
      data.groups = groupSelected;
      // If selected row key is array, we must request API with 2 key member and groups.
      // Otherwise member is empty and add 2 key are isSelectAll and filter
      if (Array.isArray(_selectedRowKeys)) {
        data.members = _selectedRowKeys;
      } else {
        data.isSelectAll = 'true';
        data = { ...data, ...filter };
      }
      const result = await onAddCustomersToGroup(
        data,
        _headers,
        // (headers = {}),
      );
      if (result) {
        actionRef.current?.reload();
        togglePopover(false);
        onCleanSelected();
        toggleSelectedAll(false);
      }
    },
    [],
  );

  const onSelectChange = (e) => {
    setSelectedRowKeys(e);
  };

  return onlyView || manage || update ? (
    <Table
      pagination={{
        defaultPageSize: 10,
        showTotal: false,
        size: 'default',
        // showSizeChanger: false,
      }}
      // pagination={{
      //   defaultPageSize: 10,
      //   showTotal: false,
      //   size: 'default',
      // }}
      size="small"
      actionRef={actionRef}
      onColumnsStateChange={(_stateCol) => {
        setStateCol(_stateCol);
      }}
      headerTitle={
        <Form.Item label="Nhóm" style={{ margin: 0 }}>
          <Select
            disabled={false}
            defaultValue="all"
            style={{ width: '12rem' }}
            options={[
              { label: 'all', value: '' },
              ...groups.map((elm) => ({ value: elm.id, label: elm.name })),
            ]}
            onChange={(value) => setValueSelect(value)}
          />
        </Form.Item>
      }
      toolBarRender={() => [
        <Input
          key="input"
          prefix={<SearchOutlined />}
          // onPressEnter={handleSubmitSearch}
          placeholder="Nhập từ khóa"
          onChange={handleSearch}
          allowClear
        />,
        (manage || update) && (
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAddNewCustomer}>
            Thêm khách hàng
          </Button>
        ),
        (manage || update) && (
          <Tooltip key="im" title="Import">
            <Button
              size="middle"
              type="link"
              icon={<Import />}
              onClick={() => toggleImportCustomer(true)}
            />
          </Tooltip>
        ),
        (manage || update) && (
          <Tooltip key="ex" title="Export">
            <Button
              size="middle"
              type="link"
              icon={<Export style={{ color: '#111' }} />}
              onClick={handleExportAllData}
            />
          </Tooltip>
        ),
      ]}
      tableAlertOptionRender={false}
      rowSelection={
        onlyView
          ? false
          : {
              preserveSelectedRowKeys: true,
              selectedRowKeys,
              onChange: onSelectChange,
            }
      }
      tableAlertRender={({ selectedRowKeys: _selectedRowKeys, selectedRows, onCleanSelected }) => {
        return (
          <Space>
            <Tooltip title="Chọn tất cả">
              <Checkbox
                onChange={(e) => {
                  const { checked } = e.target;
                  if (checked) {
                    onSelectChange(dataRowKeys);
                  } else {
                    onSelectChange([]);
                  }
                  toggleSelectedAll(checked);
                }}
              />
            </Tooltip>
            <Tooltip
              title={_selectedRowKeys.length > maximumRowSelected && messageMaximumRowSelected}
              className={styles.selected}
            >
              <span>Đã chọn</span>
              <span>
                {`${selectedAll ? totalCustomer : _selectedRowKeys?.length}/${totalCustomer}`}
                <span>
                  {_selectedRowKeys.length > maximumRowSelected && (
                    <QuestionCircleOutlined style={{ marginLeft: '5px', color: 'red' }} />
                  )}
                </span>
              </span>
            </Tooltip>
            <Popover
              visible={_selectedRowKeys.length > maximumRowSelected ? false : popoverVisible}
              trigger="click"
              onVisibleChange={togglePopover}
              title="Hãy chọn nhóm"
              // overlayInnerStyle={{padding: 0}}
              overlayClassName={styles['overlay-popover']}
              content={
                <AddCustomersToGroups
                  dataSource={groups}
                  onCancel={() => togglePopover(false)}
                  onSave={(groupSelected) => {
                    if (selectedAll) {
                      const data = {
                        groupSelected: valueSelect,
                        search: valueSearch,
                      };
                      addCustomerSelectedToGroups(
                        true,
                        groupSelected,
                        onCleanSelected,
                        headers,
                        data,
                      );
                      return null;
                    }
                    addCustomerSelectedToGroups(
                      _selectedRowKeys,
                      groupSelected,
                      onCleanSelected,
                      headers,
                    );
                    return null;
                  }}
                />
              }
            >
              <Button
                disabled={_selectedRowKeys.length > maximumRowSelected}
                icon={<PlusOutlined />}
              >
                Thêm vào nhóm
              </Button>
            </Popover>
            {manage && (
              <Popconfirm
                title="Bạn có chắc chắn muốn xoá?"
                onConfirm={handleDeleteCustomer(_selectedRowKeys, onCleanSelected, headers)}
                disabled={_selectedRowKeys.length > maximumRowSelected}
              >
                <Button
                  disabled={_selectedRowKeys.length > maximumRowSelected}
                  icon={<DeleteOutlined />}
                >
                  Xoá khách hàng
                </Button>
              </Popconfirm>
            )}
            <Button
              disabled={_selectedRowKeys.length > maximumRowSelected}
              icon={<Export style={{ color: '#111' }} />}
              onClick={handleExportData(_selectedRowKeys, headers)}
            >
              Xuất dữ liệu
            </Button>
          </Space>
        );
      }}
      params={{ _tabActive: tabActive, search: valueSearch, groupSelected: valueSelect }}
      request={async ({ pageSize, current, _tabActive, search, groupSelected, ...params }) => {
        try {
          const data = {
            offset: current - 1,
            limit: pageSize,
          };
          if (groupSelected.length > 0) {
            data.groupId = groupSelected;
          }
          if (search.length > 0) {
            data.search = search;
            // const _search = ['name', 'phones.phone', 'email'].map(key => {
            //   return {
            //     [key]: {
            //       $regex: .*${search}.*, $options: 'i'
            //     }
            //   }
            // });
            // data.where = {
            //   or: _search
            // }
          }

          const res = await requestGetCustomersOfGroup(data, headers);
          if (res?.msg === 'SUCCESS') {
            const { totalRecord } = res.response;
            onSettotalCustomer(totalRecord);

            // Save data each page to render selected UI.
            // If rows selected we must set default value for selectedRowKeys
            const rowKeysPerPage = res.response.data.map((elm) => {
              return elm.id;
            });
            setDataRowKeys(rowKeysPerPage);
            if (selectedAll) {
              onSelectChange(rowKeysPerPage);
            }

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
    />
  ) : (
    <NoDataPermission />
  );
}

export default Customers;
