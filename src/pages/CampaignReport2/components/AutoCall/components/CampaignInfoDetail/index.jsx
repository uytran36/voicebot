import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { Tag, Typography, message, Button, Tabs, Steps, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, PieChartFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import styles from './styles.less';
import { requestReportCampaignDetail } from '../../service';
import Table from '@ant-design/pro-table';

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function CampaignInfoDetail(props) {
  useEffect(() => {}, []);
  const { fetchReportDetail, actionRef } = props;
  return (
    <>
      {/* <Table
        columns={columns}
        dataSource={mockData}
        search={false}
        options={false}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
          size: 'default',
          // showSizeChanger: false,
        }}
      /> */}
      <Table
        // tableLayout={'auto'}
        scroll={{ x: 1500 }}
        // sticky
        className={styles.tableContent}
        rowClassName={styles.tableRow}
        // pagination={{
        //   current: 1,
        //   pageSize: 10,
        //   // showSizeChanger: false,
        //   showTotal: false,
        // }}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
          size: 'default',
          // showSizeChanger: false,
        }}
        size="small"
        search={false}
        options={false}
        columns={[
          {
            title: 'Mã chiến dịch',
            dataIndex: 'campaignCode',
            key: 'campaignCode',
            className: styles.column,
          },
          {
            title: 'Tên chiến dịch',
            dataIndex: 'campaignName',
            key: 'campaignName',
            className: styles.column,
          },
          {
            title: 'Tổng số khách hàng',
            dataIndex: 'totalCustomer',
            key: 'totalCustomer',
            className: styles.column,
            align: 'center',
          },
          {
            title: 'Đã tiếp cận',
            dataIndex: 'totalSuccessCall',
            key: 'totalSuccessCall',
            className: styles.column,
            align: 'center',
          },
          {
            title: 'Tổng số cuộc gọi',
            dataIndex: 'totalCall',
            key: 'totalCall',
            className: styles.column,
            align: 'center',
          },
          {
            title: 'Tổng thời gian gọi',
            dataIndex: 'totalCallTime',
            key: 'totalCallTime',
            className: styles.column,
            align: 'center',
          },
          {
            title: 'Thời lượng cuộc gọi trung bình',
            dataIndex: 'averageCallTime',
            key: 'averageCallTime',
            className: styles.column,
            align: 'center',
            render: (text) => (text !== 0 ? text.toFixed(2) : text),
          },
          {
            title: 'API yêu cầu',
            dataIndex: 'totalRequestT2S',
            key: 'totalRequestT2S',
            className: styles.column,
            align: 'center',
          },
          {
            title: 'Ký tự',
            dataIndex: 'totalCharacterT2S',
            key: 'totalCharacterT2S',
            className: styles.column,
            align: 'center',
          },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            align: 'center',
            className: styles.column,
            render: (text, record, index) => {
              if (record.status === 'RUNNING') {
                return <Tag color="green">Đang chạy</Tag>;
              }
              if (record.status === 'COMPLETED') {
                return <Tag color="blue">Hoàn Thành</Tag>;
              }
              if (record.status === 'PENDING') {
                return <Tag color="orange">Tạm dừng</Tag>;
              }
              if (record.status === 'SCHEDULED') {
                return <Tag color="default">Chưa chạy</Tag>;
              }
              return <Tag color="default">{record.status}</Tag>;
            },
          },
        ]}
        request={async () => {
          try {
            const res = await fetchReportDetail();
            if (res.success) {
              return {
                data: res.data,
              };
            }
            throw new Error(res.error || 'ERROR!');
          } catch (err) {
            // message.error(err.toString());
            return {
              data: [],
            };
          }
        }}
        actionRef={actionRef}
      />
    </>
  );
}

export default memo(CampaignInfoDetail);
