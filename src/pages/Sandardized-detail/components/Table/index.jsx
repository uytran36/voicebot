import React, { useState, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import Table from '@ant-design/pro-table';
import { Dropdown, Menu, Input, Typography } from 'antd';
import { MoreOutlined, DeleteOutlined, EditOutlined, SearchOutlined, LeftOutlined } from '@ant-design/icons';
import { RenderEditRow, RenderEditRowTable } from '@/components/Editable';
import styles from './styles.less';
// import uniq from 'lodash/uniq';
import debounce from 'lodash/debounce';
import { requestUpdateOmniContactList, requestOmniContactListNormalizations, requestDeleteOmniContactListNormalizations } from '@/services/campaign-management';
import { filterField } from '@/constants/filter-data-excel';

export const onGetOmniContactListNormalizations = async (headers, params = {}) => {
  try {
    const res = await requestOmniContactListNormalizations(headers, {
      filter: {
        ...params,
      },
    });
    if (Array.isArray(res) && res.length > 0) {
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    return [];
  }
};

const onDeleteOmniContactListNormalizations = async (headers, id = '') => {
  try {
    if (!id || id.length === 0) {
      throw new Error('Missing ID~');
    }
    const res = await requestDeleteOmniContactListNormalizations(headers, id);
    if (res) {
      // api return 204 status
      throw new Error('ERROR~');
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const setupColumns = (firstRecord) => {
  const cols = [];
  const keys = [];
  Object.keys(firstRecord).forEach((key) => {
    if (!filterField.includes(key)) {
      keys.push([key]);
    }
  });

  keys.forEach((key) => {
    cols.push({
      key,
      title: key[key.length - 1].toString(),
      dataIndex: key,
      align: 'left',
      width: 100,
      editable: true, // nếu không muốn edit cell thì hãy kiểm tra key.
      render: (text, record) => {
        if (typeof text === 'string') {
          if (record.error && record.error.includes(key[key.length - 1].toString())) {
            return <div style={{ color: 'red' }}>{text}</div>;
          }
          if (record.warning && record.warning.includes(key[key.length - 1].toString())) {
            return <div style={{ color: '#E99B00' }}>{text}</div>;
          }
          return <div style={{ color: 'black' }}>{text}</div>;
        }
        if (record[key]) {
          if (record.checked === 1) {
            return <div style={{ color: 'green' }}>{record[key].toString()}</div>;
          }
          if (record.checked === 0) {
            return <div style={{ color: 'red' }}>{record[key].toString()}</div>;
          }
          return <div style={{ color: 'black' }}>{record[key].toString()}</div>;
        }
        return '-';
      },
    });
  });
  return cols;
};

RenderTable.propTypes = {
  onCancel: PT.oneOfType([PT.func, PT.null]),
  sessionId: PT.string.isRequired,
  headers: PT.instanceOf(Object).isRequired,
};

RenderTable.defaultProps = {
  onCancel: null,
};

function RenderTable({ sessionId, headers, onCancel, ...props }) {
  const [editingKey, setEditingKey] = useState('');
  const [values, setValues] = useState({});
  const [valueSearch, setSearchValue] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');

  const [columns, mapColsFromResponse] = useState([]);
  const [mergeCols, setMergeCols] = useState([]);

  const actionRef = React.useRef(null);

  /**
   * @function Void - Toggle edit
   * @param {Object} record
   */
  const toggleEdit = useCallback(
    (record) => () => {
      setEditingKey(record.id);
    },
    [],
  );

  /**
   * @function - check is edit
   * @param {Object} record
   * @returns {Boolean} - if true enable edit, false disable edit
   */
  const isEditing = useCallback((record, source) => record.id === editingKey, [editingKey]);

  /**
   * @function Event - handle cancel
   */
  const handleCancel = useCallback(() => {
    setEditingKey('');
    setValues({});
  }, []);

  /**
   * @function HOF - handle save form edit
   * @param {Object} record
   */
  const handleSave = useCallback(
    (record, _values) => async () => {
      try {
        const newValues = { ...record, ..._values };
        const res = await requestUpdateOmniContactList(headers, [newValues]);
        if (res) {
          actionRef.current.reload();
          handleCancel()
        }
        throw new Error('ERROR~')
      } catch (err) {
        console.error(err);
      }
    },
    [handleCancel, headers],
  );

  /**
   * @function HOF
   * @param {Object} record
   */
  const handleDelete = useCallback((record) => async () => {
    const result = await onDeleteOmniContactListNormalizations(headers, record.id);
    if (result) {
      actionRef.current.reload();
    }
  }, [headers]);

  /**
   * Render menu dropdown
   * @param {Object} record
   * @returns {Node}
   */
  const menu = useCallback(
    (record) => (
      <Menu>
        {
          <Menu.Item key="edit" onClick={toggleEdit(record)}>
            <span>
              <EditOutlined style={{ marginRight: 5 }} />
              Chỉnh sửa
            </span>
          </Menu.Item>
        }
        <Menu.Item key="delete" onClick={handleDelete(record)}>
          <span>
            <DeleteOutlined style={{ marginRight: 5 }} />
            Xóa
          </span>
        </Menu.Item>
      </Menu>
    ),
    [handleDelete, toggleEdit],
  );

  useEffect(() => {
    setMergeCols([...columns, {
      key: 'action',
      title: 'action',
      align: 'center',
      fixed: 'right',
      width: 60,
      render: (_, record) => {
        const editable = isEditing(record, 'setCol');
        if (editable) {
          return (
            <span>
              <a
                onClick={handleSave(record, values)}
                style={{
                  marginRight: 8,
                  color: '#fff',
                  background: '#127ACE',
                  padding: '5px 16px',
                  borderRadius: '5px',
                }}
              >
                Lưu
              </a>
              <a
                onClick={handleCancel}
                style={{
                  borderRadius: '5px',
                  marginRight: 8,
                  padding: '5px 16px',
                  color: '#000',
                  border: '1px solid #D9D9D9',
                }}
              >
                Huỷ
              </a>
            </span>
          );
        }
        return (
          <Dropdown
            placement="bottomLeft"
            className={styles.icon}
            trigger={['click']}
            overlay={() => menu(record)}
          >
            <MoreOutlined style={{ fontSize: 26, cursor: 'pointer' }} />
          </Dropdown>
        );
      },
    }])
  }, [columns, handleCancel, handleSave, isEditing, menu, values]);

  return (
    <div>
      <Table
        rowKey={(record) => record.id}
        actionRef={actionRef}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
          hideOnSinglePage: true
        }}
        search={false}
        scroll={{ x: 992, y: 500 }}
        cardProps={{
          bodyStyle: { padding: 0 },
          className: styles['card-table-pro'],
        }}
        rowClassName={(record) => {
          if (record.error) {
            return styles.rowError;
          }
          if (record.warning) {
            return styles.rowWarning;
          }
          return '';
        }}
        options={{ setting: true, fullScreen: false, reload: false, density: false }}
        components={{
          body: {
            row: RenderEditRowTable,
            cell: RenderEditRow,
          },
        }}
        onColumnsStateChange={(state) => {
          const keys = Object.keys(state);
          const result = [];
          keys.forEach((key) => {
            if (key === 'action') {
              return null;
            }
            if (state[key].show === undefined) {
              return null;
            }
            if (state[key].show === false) {
              result.push(key);
              return null;
            }
            return null;
          });
          return null;
        }}
        toolBarRender={() => {
          return [
            <Input
              key="search"
              prefix={<SearchOutlined />}
              // onPressEnter={handleSubmitSearch}
              placeholder="Nhập từ khóa"
              onChange={debounce((e) => setSearchValue(e.target.value), 500)}
            />,
          ];
        }}
        headerTitle={
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <Typography.Title
              level={3} style={{ margin: 0, cursor: 'pointer' }}
              onClick={typeof onCancel === 'function' && onCancel}
            >
              {typeof onCancel === 'function' && <LeftOutlined style={{ marginRight: '5px' }} />}
              {headerTitle}
            </Typography.Title>
          </div>
        }
        columns={mergeCols.map((col) => {
          if (!col.editable) {
            return col;
          }
          return {
            ...col,
            onCell: (record) => ({
              record,
              // editable: col.editable && record?.error?.length > 0,
              dataIndex: col.dataIndex,
              title: col.title,
              editing: isEditing(record, 'oncell'),
              handleSave: (value) => {
                setValues({ ...values, ...value });
              },
            }),
          };
        })}
        params={{ sessionID: sessionId, searchStr: valueSearch }}
        request={async ({ sessionID, pageSize, current, searchStr }) => {
          const params = {
            where: { sessionId: sessionID },
            limit: pageSize,
            offset: pageSize * current - pageSize
          };

          if (searchStr.length > 0) {
            // detail at: https://loopback.io/doc/en/lb3/Where-filter.html
            params.where = {
              and: [
                {
                  sessionId: sessionID,
                },
                {
                  or: [
                    {
                      sodienthoai: {like: searchStr}
                    },
                    {
                      phone: {like: searchStr}
                    }
                  ]
                }
              ]
              
            }
          }
          const res = await onGetOmniContactListNormalizations(headers, params)
          if (res.length > 0) {
            const cols = setupColumns(res[0]);
            mapColsFromResponse(cols);
            setHeaderTitle(res[0]?.xlsContactObject?.tentailieu || '');
            const { total } = res.pop();
            return {
              data: res,
              total
            }
          }
          return {
            data: [],
            total: 0
          }
        }}
        {...props}
      />
    </div>
  );
}

export default React.memo(RenderTable);
