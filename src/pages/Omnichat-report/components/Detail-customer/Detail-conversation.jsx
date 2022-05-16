import React from 'react';
import PT from 'prop-types';
import Table from '@ant-design/pro-table';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { requestGetDetailConversation } from '@/services/chat';
import styles from './styles.less';

RenderDetailConversation.propTypes = {
  onNextContent: PT.func.isRequired
}

function RenderDetailConversation({ onNextContent }) {
  return (
    <div>
      <div className={styles['header-card']}>
        <div>
          <h3>Chi tiết hội thoại</h3>
        </div>
        <div data-icon='back' onClick={onNextContent}>
          <ArrowLeftOutlined />
        </div>
      </div>
      <Table
        search={false}
        options={false}
        scroll={{ x: 992, y: 992 }}
        pagination={false}
        request={async () => {
          try {
            const res = await requestGetDetailConversation()
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
            key: 'sender',
            dataIndex: 'sender',
            title: 'Người gửi',
            align: 'left',
            width: 60,
          },
          {
            key: 'content',
            dataIndex: 'content',
            title: 'Nội dung',
            align: 'left',
            width: 180,
          },
          {
            key: 'time',
            dataIndex: 'time',
            title: 'Thời gian',
            align: 'left',
            width: 100,
          },
        ]}
      />
    </div>
  )
}

export default RenderDetailConversation;
