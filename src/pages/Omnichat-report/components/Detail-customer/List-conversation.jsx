import React from 'react';
import PT from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';
import Table from '@ant-design/pro-table';
import { requestGetListConversation } from '@/services/chat';
import styles from './styles.less';

RenderListConversation.propTypes = {
  onNextContent: PT.func.isRequired,
  onClose: PT.func.isRequired
}

function RenderListConversation({ onNextContent, onClose }) {
  return (
    <div>
      <div className={styles['header-card']}>
        <div>
          <h3>Danh sách hội thoại</h3>
        </div>
        <div data-icon='close' onClick={onClose}>
          <CloseOutlined />
        </div>
      </div>
      <Table
        search={false}
        options={false}
        scroll={{ x: 992, y: 992 }}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
        }}
        request={async () => {
          try {
            const res = await requestGetListConversation()
            if (res.success) {
              return {
                data: res.data,
                total: res.data.length
              }
            }
            throw new Error('ERROR~');
          } catch(err) {
            console.error(err);
            return {
              data: [],
              total: 0
            }
          }
        }}
        columns={[
          {
            key: 'channel',
            dataIndex: 'channel',
            title: 'Kênh chat',
            align: 'left',
            width: 100,
            fixed: 'left',
            render: (text, record) => {
              return (<div style={{cursor: 'pointer'}} onClick={onNextContent}>{text}</div>)
            }
          },
          {
            key: 'id',
            dataIndex: 'id',
            title: 'ID',
            align: 'left',
            width: 100,
          },
          {
            key: 'agent',
            dataIndex: 'agent',
            title: 'agent tiếp nhận',
            align: 'left',
            width: 100,
          },
          {
            key: 'startedAt',
            dataIndex: 'startedAt',
            title: 'Thời gian bắt đầu',
            align: 'center',
            width: 100,
          },
          {
            key: 'endedAt',
            dataIndex: 'endedAt',
            title: 'Thời gian kết thúc',
            align: 'center',
            width: 100,
          },
          {
            key: 'status',
            dataIndex: 'status',
            title: 'Trạng thái',
            align: 'left',
            width: 100,
          },
          {
            key: 'note',
            dataIndex: 'note',
            title: 'Ghi chú',
            align: 'left',
            width: 100,
          },
        ]}
      />
    </div>
  )
}

export default RenderListConversation;
