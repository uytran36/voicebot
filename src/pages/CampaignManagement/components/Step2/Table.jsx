/* eslint-disable camelcase */
import React, { useEffect, useState, useCallback } from 'react';
import PT from 'prop-types';
import { Table, message } from 'antd';
import styles from './styles.less';
import { Edit, Delete } from '@/components/Icons'

RenderTable.propTypes = {
  data: PT.instanceOf(Array).isRequired,
  filtered: PT.instanceOf(Array).isRequired,
  setRowSelected: PT.func.isRequired,
  toggle: PT.func.isRequired,
  deleteOmniContact: PT.func.isRequired,
};

export default function RenderTable({ data, toggle, setRowSelected, filtered, deleteOmniContact}) {
  const [columns, setColumns] = useState([]);

  // events
  const handleEdit = useCallback(
    (record) => (e) => {
      setRowSelected(record);
      toggle(true);
    },
    [setRowSelected, toggle],
  );

  const handleDelete = useCallback(
    (record) => (e) => {
      if(data.length > 1) {
        deleteOmniContact(record)
        return null;
      }
      message.warning('Danh sách không được để trống.')
      return null;
    },
    [deleteOmniContact, data],
  );

  useEffect(() => {
    const listKey = [];
    if (data.length > 0) {
      Object.keys(data[0]).forEach((other) => {
        if (!filtered.includes(other)) {
          listKey.push([other]);
        }
        return null;
        // if (elm !== 'id' && elm !== '_id' && elm !== 'key' && elm !== 'xlsContactObject') {
        //   listKey.push([elm]);
        // }
        // if (elm === 'xlsContactObject') {
        //   Object.keys(data[0].xlsContactObject).forEach((key) => {
        //     if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'id') {
        //       listKey.push(['xlsContactObject', key]);
        //     }
        //   });
        // }
      });
    }
    const col = listKey.map((key) => {
      return {
        title: key[key.length - 1].toString(),
        dataIndex: key,
        align: 'center',
        editable: key[key.length - 1].toLowerCase() === 'sdt',
        render: (text, record) => {
          if (typeof text === 'string' || typeof text === 'number') {
            if (record.error && record.error.includes(key[key.length - 1].toString())) {
              return <div style={{ color: 'red' }}>{text}</div>;
            }
            return <div style={{ color: 'black' }}>{text}</div>;
          }
          return '_';
        },
      };
    });
    setColumns([
      ...col,
      {
        title: 'action',
        align: 'center',
        render: (_, record) => {
          return (
            <div className={styles.icon}>
              <Edit width={18} height={18}  onClick={handleEdit(record)} />
              <Delete onClick={handleDelete(record)} />
            </div>
          );
        },
      },
    ]);
  }, [data, filtered, handleDelete, handleEdit]);

  return (
    <Table
      rowKey={() => Math.random().toString(36).substring(7)}
      // pagination={{
      //   size: 'small',
      //   // showSizeChanger: false,
      //   size: 'default',
      // }}
      pagination={{
        defaultPageSize: 10,
        showTotal: false,
        size: 'default',
        // showSizeChanger: false,
      }}
      size="small"
      columns={columns}
      dataSource={data}
      scroll={{ x: true }}
    />
  );
}
