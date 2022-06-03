import React from 'react';
import Table from '@ant-design/pro-table';
import styles from './styles.less'

function RenderTable({ ...rest }) {
  return (
    <Table
      search={false}
      options={false}
      scroll={{ x: 992 }}
      className={styles.table}
      cardProps={{
        bodyStyle: {padding: 0}
      }}
      pagination={{
        showTotal: false,
        size: 'default'
      }}
      columns={[
        {
          key: 'name',
          dataIndex: 'name',
          title: 'Họ và tên',
          align: 'left',
          width: 100,
          fixed: 'left',
          className: styles['light-blue'],
        },
        {
          key: 'phone',
          dataIndex: 'phone',
          title: 'Số điện thoại',
          align: 'left',
          width: 100,
          fixed: 'left',
          className: styles['light-blue'],
        },
        {
          key: 'fb',
          // dataIndex: 'facebook',
          title: 'Facebook',
          width: 140,
          className: styles['dark-orange'],
          children: [
            {
              key: 'received',
              dataIndex: 'fb_processing',
              title: 'Đã nhận',
              align: 'center',
              width: 70,
              className: styles['light-orange'],
            },
            {
              key: 'done',
              dataIndex: 'fb_resolve',
              title: 'Đã giải quyết',
              align: 'center',
              width: 70,
              className: styles['light-orange'],
            },
          ],
        },
        {
          key: 'zalo',
          // dataIndex: 'zalo',
          title: 'Zalo',
          width: 140,
          className: styles['dark-candy'],
          children: [
            {
              key: 'received',
              dataIndex: 'zalo_processing',
              title: 'Đã nhận',
              align: 'center',
              width: 70,
              className: styles['light-candy'],
            },
            {
              key: 'done',
              dataIndex: 'zalo_resolve',
              title: 'Đã giải quyết',
              align: 'center',
              width: 70,
              className: styles['light-candy'],
            },
          ],
        },
        {
          key: 'livechat',
          // dataIndex: 'livechat',
          title: 'Livechat',
          width: 140,
          className: styles['dark-purple'],
          children: [
            {
              key: 'received',
              dataIndex: 'livechat_processing',
              title: 'Đã nhận',
              align: 'center',
              width: 70,
              className: styles['light-purple'],
            },
            {
              key: 'done',
              dataIndex: 'livechat_resolve',
              title: 'Đã giải quyết',
              align: 'center',
              width: 70,
              className: styles['light-purple'],
            },
          ],
        },
      ]}
      {...rest}
    />
  );
}

export default RenderTable;
