import React from 'react';
import styles from './styles.less';
import { Radio, message } from 'antd';
import Table from '@ant-design/pro-table';
import { StarOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { requestListPbxCallQueue } from '../../service';

CallControl.propTypes = {
  children: PropTypes.element.isRequired,
};

function CallControl({ children }) {
  const columns = [
    {
      render: () => <Radio />,
      width: 40,
    },
    {
      title: <span style={{ color: '#1169b0', fontWeight: 'bold' }}>Số nhánh</span>,
      dataIndex: 'numDepart',
      align: 'center',
      width: 90,
    },
    {
      title: <span style={{ color: '#1169b0', fontWeight: 'bold' }}>Tên agent</span>,
      dataIndex: 'name',
      align: 'center',
      width: 130,
    },
    {
      title: <span style={{ color: '#1169b0', fontWeight: 'bold' }}>Khách hàng</span>,
      dataIndex: 'customer',
      align: 'center',
      width: 120,
    },
    {
      title: <span style={{ color: '#1169b0', fontWeight: 'bold' }}>Trạng thái</span>,
      dataIndex: 'status',
      align: 'center',
      width: 100,
    },
    {
      title: <span style={{ color: '#1169b0', fontWeight: 'bold' }}>Queue</span>,
      dataIndex: 'queue',
      align: 'center',
      width: 100,
    },
    {
      title: <span style={{ color: '#1169b0', fontWeight: 'bold' }}>Thời lượng</span>,
      dataIndex: 'duration',
      align: 'center',
      width: 100,
    },
  ];

  return (
    <div className={styles.container}>
      <Table
        size="small"
        search={false}
        options={false}
        request={async (_params, soter, filter) => {
          const params = {
            offset: 0,
            limit: 100,
            skip: 0,
            order: 'string',
            where: {
              additionalProp1: {},
            },
            fields: {
              id: true,
              session_id: true,
              call_center_queue_uuid: true,
              agent: true,
              agent_id: true,
              cid_number: true,
              bridge_epoch: true,
              system_epoch: true,
              duration_time: true,
              event_name: true,
              status: true,
              created: true,
            },
          };
          try {
            const res = await requestListPbxCallQueue({}, params);
            if(res.success) {
              return {
                data: res.data,
                total: res.length
              }
            }
            throw new Error(res.errors.toString() || 'Error~')
          } catch(err) {
            // message.error(err.toString())
            return {
              data: [],
              total: 0,
            }
          }
        }}
        columns={columns}
        pagination={false}
        scroll={{ y: 530 }}
      />
      {children}
    </div>
  );
}

export default CallControl;
