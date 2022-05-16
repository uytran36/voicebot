import React, { useState, useCallback, useEffect, useRef, memo } from 'react';
import { Tag, Typography, message, Button, Tabs, Steps, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, PieChartFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import styles from './styles.less';
import { requestReportCampaignDetail } from '../../service';
import Table from '@ant-design/pro-table';
import moment from 'moment';

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function CampaignInfoDetail(props) {
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => { }, []);
  const changePageSize = (current, size) => {
    setPageSize(size);
  }

  const { fetchReportDetail, actionRef } = props;
  const mockData = [
    {
      campaignName: "Chiến dịch 1",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      createdDate: new Date().toISOString(),
      status: "PENDING",
    },
    {
      campaignName: "Chiến dịch 2",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: "RUNNING",
    },
    {
      campaignName: "Chiến dịch 3",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: "RUNNING",
    },
    {
      campaignName: "Chiến dịch 4",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: "COMPLETED",
    },
    {
      campaignName: "Chiến dịch 5",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: "SCHEDULED",
    },
    {
      campaignName: "Chiến dịch 6",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: "PENDING",
    },
    {
      campaignName: "Chiến dịch 7",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: "RUNNING",
    },
    {
      campaignName: "Chiến dịch 8",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: "RUNNING",
    },
    {
      campaignName: "Chiến dịch 9",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: "COMPLETED",
    },
    {
      campaignName: "Chiến dịch 10",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: "SCHEDULED",
    },
    {
      campaignName: "Chiến dịch 11",
      campaignType: "Auto Call",
      totalCustomer: 123,
      totalCall: 312,
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: "COMPLETED",
    },
  ]
  const columns = [
    {
      title: '#',
      className: styles.column,
      render: (_, record, id) => <span>{id + 1}</span>,
    },
    {
      title: 'Tên chiến dịch',
      dataIndex: 'campaignName',
      key: 'campaignName',
      className: styles.column,
    },
    {
      title: 'Loại chiến dịch',
      dataIndex: 'campaignType',
      key: 'campaignType',
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
      title: 'Thời lượng trung bình',
      dataIndex: 'averageCallTime',
      key: 'averageCallTime',
      className: styles.column,
      align: 'center',
      render: (text) => (text !== 0 ? text.toFixed(2) : text),
    },
    {
      title: 'Tổng API yêu cầu',
      dataIndex: 'totalRequestT2S',
      key: 'totalRequestT2S',
      className: styles.column,
      align: 'center',
    },
    {
      title: 'Số ký tự T2S',
      dataIndex: 'totalCharacterT2S',
      key: 'totalCharacterT2S',
      className: styles.column,
      align: 'center',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdDate',
      key: 'createdDate',
      className: styles.column,
      align: 'center',
      render: (text) => (text.length > 0 && moment(text).isValid() ? moment(text).format('DD-MM-YYYY HH:mm:ss') : '-'),
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
  ]
  return (
    <>
      <Table
        dataSource={mockData}
        scroll={{ x: 1500 }}
        style={styles}
        className={styles['no-padding']}
        rowClassName={styles.tableRow}
        pagination={{
          defaultPageSize: pageSize,
          size: 'default',
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '30', '50'],
          showTotal: false,
          onShowSizeChange: changePageSize
        }}
        search={false}
        options={false}
        columns={columns}
        request={async () => {
          try {
            const res = await requestReportCampaignDetail(headers, {
              status: statusDetail,
              token: tokenHub,
              fromDate: dateReportDetail.fromDate.toJSON(),
              toDate: dateReportDetail.toDate.toJSON(),
            });
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
