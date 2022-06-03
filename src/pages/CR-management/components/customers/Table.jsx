import React, { useCallback, useState, useEffect } from 'react';
import PT from 'prop-types';
import { Link } from 'umi';
import Table from '@ant-design/pro-table';
import { Typography, Tooltip } from 'antd';
import moment from 'moment';
import styles from './styles.less';

const _nameCols = [
  {
    label: 'Tên khách hàng',
    key: 'name',
  },
  {
    label: 'Số điện thoại',
    key: 'phones',
  },
  {
    label: 'Email',
    key: 'email',
  },
];

const optionsCols = [
  {
    label: 'Ngày sinh',
    key: 'dateOfBirth',
  },
  {
    label: 'Địa chỉ',
    key: 'addresses',
  },
  {
    label: 'Nhóm',
    key: 'groups',
  },
  {
    label: 'Thời gian tạo',
    key: 'createdAt',
  },
  {
    label: 'Giới tính',
    key: 'gender',
  },
  {
    label: 'Danh xưng',
    key: 'alias',
  },
  {
    label: 'Ghi chú',
    key: 'description',
  },
  {
    label: 'Facebook',
    key: 'facebook',
  },
  {
    label: 'Zalo',
    key: 'zalo',
  },
  // {
  //   label: 'Thời gian cập nhật',
  //   key: 'updatedAt',
  // },
  {
    label: 'Người tạo',
    key: 'createdBy',
  },
];

RenderTable.propTypes = {
  request: PT.func.isRequired,
  onColumnsStateChange: PT.func.isRequired,
};

function RenderTable({ request, onColumnsStateChange, ...props }) {
  const [stateCol, setStateCol] = useState({});
  const [columns, setColumns] = useState([]);
  const [columnsStateMap, setColumnsStateMap] = useState([]);
  const [nameCols, setNameCols] = useState(_nameCols);

  const setupColumns = useCallback(
    (firstRecord) => {
      const keys = [];
      Object.keys(firstRecord).forEach((key) => {
        if (!['_id', 'updatedAt', 'visitor_id'].includes(key)) {
          keys.push([key]);
        }
      });
      const columnsState = {};
      const cols = keys.map((key) => {
        const col = {
          key,
          dataIndex: key,
          align: 'left',
          width: '100px',
          textWrap: 'word-break',
          ellipsis: true,
          render: (text, record) => {
            if (key[0] === 'name') {
              return (
                <Link
                  to={
                    {
                      pathname: `/customer-relationship-management/customer-management/customer/${record.id}`,
                    } || ''
                  }
                >
                  <Typography.Text ellipsis className={styles.link}>
                    {text}
                  </Typography.Text>
                </Link>
              );
            }
            if (key[0] === 'phones') {
              if (record.phones) {
                return (
                  <ul className={`${styles['tag-phone']}`}>
                    {record.phones.map((elm, index) => (
                      <li key={index}>
                        <Tooltip title={elm.phone}>{elm.phone}</Tooltip>
                      </li>
                    ))}
                  </ul>
                );
              }
              return '';
            }
            if (key[0] === 'groups') {
              if (record.groups) {
                return (
                  <ul className={`${styles['tag-phone']}`}>
                    {record.groups.map((item, index) => (
                      <li key={index} className={`${styles['tag-groups']} ant-tag`}>
                        <Tooltip title={item.name}>{item.name}</Tooltip>
                      </li>
                    ))}
                  </ul>
                );
              }
              return '';
            }

            if (key[0] === 'dateOfBirth') {
              return moment(record.dateOfBirth).isValid() ? (
                <Typography.Text ellipsis>
                  {moment(record.dateOfBirth).format('DD-MM-YYYY')}
                </Typography.Text>
              ) : (
                ''
              );
            }

            if (key[0] === 'createdAt') {
              return moment(record.createdAt).isValid() ? (
                <Typography.Text
                  ellipsis={{
                    tooltip: moment(record.createdAt).format('DD-MM-YYYY HH:mm:ss'),
                    row: 1,
                  }}
                >
                  {moment(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                </Typography.Text>
              ) : (
                ''
              );
            }
            if (key[0] === 'updatedAt') {
              return moment(record.updatedAt).isValid()
                ? moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')
                : '';
            }
            return text;
          },
        };
        // detect name col
        const index = [...nameCols].findIndex((nameCol) => nameCol.key === key[0]);
        if (index < 0) {
          columnsState[key[0]] = {
            show: false,
          };
        }
        if (index >= 0) {
          return {
            ...col,
            title: <Typography.Text ellipsis>{nameCols[index].label}</Typography.Text>,
          };
        }
        // translate key to VN
        const indexOptCol = [...optionsCols].findIndex((nameCol) => nameCol.key === key[0]);
        if (indexOptCol >= 0) {
          return {
            ...col,
            title: <Typography.Text ellipsis>{optionsCols[indexOptCol].label}</Typography.Text>,
          };
        }
        return {
          ...col,
          key,
          title: <Typography.Text ellipsis>{key[key.length - 1].toString()}</Typography.Text>,
        };
      });
      setColumns(cols);
      setColumnsStateMap(columnsState);

      // đồng bộ col state với component cha
      const result = [];
      cols.forEach((col) => {
        if (!Object.keys(columnsState).includes(col.key[0])) {
          result.push(col.key[0]);
        }
      });
      setStateCol(result);
    },
    [nameCols],
  );

  useEffect(() => {
    onColumnsStateChange(stateCol);
  }, [onColumnsStateChange, stateCol]);

  return (
    <Table
      rowKey={(record) => record.id}
      options={{
        setting: true,
        fullScreen: false,
        reload: false,
        density: false,
      }}
      scroll={{ x: 992 }}
      search={false}
      rowSelection={true}
      pagination={{
        defaultPageSize: 10,
        showTotal: false,
        size: 'default',
      }}
      size="small"
      columnsStateMap={columnsStateMap}
      onColumnsStateChange={(r, x) => {
        const result = [];
        columns.forEach((col) => {
          if (!Object.keys(r).includes(col.key[0])) {
            result.push(col.key[0]);
          }
        });
        Object.keys(r).forEach((elm) => {
          if (r[elm].show || r[elm].show === undefined) {
            result.push(elm);
          }
        });
        setStateCol(result);
        setColumnsStateMap(r);
        const a = result.map((elm) => {
          // maping with name col
          const index = _nameCols.findIndex((col) => col.key === elm);
          if (index >= 0) {
            return _nameCols[index];
          }
          // maping with other name col
          const otherIndex = optionsCols.findIndex((col) => col.key === elm);
          if (otherIndex >= 0) {
            return optionsCols[otherIndex];
          }
          return { key: elm, label: elm };
        });
        setNameCols(a);
      }}
      tableAlertOptionRender={false}
      request={async ({ ...params }) => {
        const { data, total } = await request(params);
        if (data.length > 0) {
          setupColumns(data[0]);
        }
        return {
          data,
          total,
        };
      }}
      columns={columns}
      {...props}
    />
  );
}

export default React.memo(RenderTable);
