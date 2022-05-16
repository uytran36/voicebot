import React, { useState, useCallback, useRef } from 'react';
import PT from 'prop-types';
import { Typography, Input, Button, message, Space, Popconfirm, Tooltip } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { Export } from '@/components/Icons';
import styles from './styles.less';
import Table from '@/pages/CR-management/components/customers/Table';
import {
  requestExportCustomer,
  requestGetCustomersOfGroup,
  requestDeleteCustomersInGroup,
} from '@/services/crm';
import api from '@/api';

const onExportCustomer = async (stateColumns, filter = {}, headers = {}) => {
  const hide = message.loading('Đang export...');
  try {
    const res = await requestExportCustomer(
      {
        columns: JSON.stringify(stateColumns.length > 0 ? stateColumns.toString() : [].toString()),
        members: [].toString(),
        ...filter,
      },
      headers,
    );
    if (res) {
      hide();
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    // hide();
    // message.warning('Không thể export.');
    return null;
  }
};

const onDeleteCustomersInGroup = async (body, headers = {}) => {
  const hide = message.loading('Đang xoá...');
  try {
    const res = await requestDeleteCustomersInGroup(body, headers);
    if (res?.msg === 'SUCCESS') {
      hide();
      message.success('Đã xoá.');
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    hide();
    message.warning('Không thể xoá.');
    return null;
  }
};

RenderTable.propTypes = {
  groupId: PT.string.isRequired,
  wsId: PT.string.isRequired,
  headers: PT.shape({
    Authorization: PT.string,
  }).isRequired,
  permissions: PT.shape({
    manage: PT.bool.isRequired,
    update: PT.bool.isRequired,
    onlyView: PT.bool.isRequired,
  }).isRequired,
};

function RenderTable({ groupId, wsId, headers, permissions }) {
  const actionRef = useRef(null);

  const [valueSearch, setValueSearch] = useState('');
  const [stateCol, setStateCol] = useState({});
  const [totalCustomer, setTotalCustomer] = useState(0);

  const { manage, update, onlyView } = permissions;
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

  const handleExportAllData = useCallback(
    (_groupId) => async () => {
      const filter = {
        // groupId: _groupId,
        groupId: '',
        subId: wsId,
      };
      const result = await onExportCustomer(stateCol, filter, headers);
      if (result?.msg === 'SUCCESS') {
        // const file = result.data['url-download'].split('/')[
        //   result.data['url-download'].split('/').length - 1
        // ];
        // window.open(`${api.CM_SERVICE}/assets/${file}`).focus();
      }
    },
    [stateCol],
  );

  /**
   * @param {String[]} _selectedRowKeys - ID record
   */
  const handleDeleteCustomer = useCallback(
    (_selectedRowKeys, _groupId, onCleanSelected) => async () => {
      const result = await onDeleteCustomersInGroup(
        { id: _groupId, customerId: _selectedRowKeys.toString() },
        headers,
      );
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
    (_selectedRowKeys, groupId) => async () => {
      const filter = {
        members: _selectedRowKeys.toString(),
        // groupId,
        groupId: '',
        subId: wsId,
      };
      // console.log({stateCol})
      const result = await onExportCustomer(stateCol, filter, headers);
      if (result?.msg === 'SUCCESS') {
        // const file = result.data['url-download'].split('/')[
        //   result.data['url-download'].split('/').length - 1
        // ];
        // window.open(`${api.CM_SERVICE}/assets/${file}`).focus();
      }
    },
    [headers, stateCol, wsId],
  );

  return (
    <Table
      pagination={{
        defaultPageSize: 10,
        showTotal: false,
        size: 'default',
        // showSizeChanger: false,
      }}
      size="small"
      rowSelection={onlyView ? false : true}
      actionRef={actionRef}
      search={false}
      cardProps={{
        bodyStyle: { padding: 0 },
        className: styles['card-table-pro'],
      }}
      headerTitle={
        <Typography.Title level={5}>
          <span style={{ color: '#127ACE' }}>{totalCustomer}</span> Khách hàng
        </Typography.Title>
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
          <Tooltip key="ex" title="Xuất excel">
            <Button
              size="middle"
              type="link"
              icon={<Export style={{ color: '#111' }} />}
              onClick={handleExportAllData(groupId)}
            />
          </Tooltip>
        ),
      ]}
      tableAlertRender={({ selectedRowKeys, selectedRows, onCleanSelected }) => {
        return (
          <Space align="center">
            <p className={styles.selected}>
              <span>Đã chọn</span>
              <span>{selectedRowKeys.length}</span>
            </p>
            {manage && (
              <Popconfirm
                onConfirm={handleDeleteCustomer(selectedRowKeys, groupId, onCleanSelected)}
                title="Bạn có chắc chắn muốn xoá?"
              >
                <Button icon={<DeleteOutlined />}>Xoá khách hàng</Button>
              </Popconfirm>
            )}
            <Button
              icon={<Export style={{ color: '#111' }} />}
              onClick={handleExportData(selectedRowKeys, groupId)}
            >
              Xuất dữ liệu
            </Button>
          </Space>
        );
      }}
      onColumnsStateChange={(_stateCol) => {
        setStateCol(_stateCol);
      }}
      params={{ id: groupId, search: valueSearch }}
      request={async ({ current, pageSize, id, search }) => {
        const params = {
          limit: pageSize,
          offset: current - 1,
          groupId: id,
        };
        if (search.length > 0) {
          params.search = search;
        }

        try {
          const res = await requestGetCustomersOfGroup(params, headers);
          if (res?.msg === 'SUCCESS') {
            const { totalRecord } = res.response;
            setTotalCustomer(totalRecord);
            return {
              data: res.response.data,
              totalRecord,
            };
          }
          throw new Error('ERROR~');
        } catch (err) {
          console.error(err);
          setTotalCustomer(0);
          return {
            data: [],
            total: 0,
          };
        }
      }}
    />
  );
}

export default RenderTable;
