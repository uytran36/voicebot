import React, { useRef } from 'react';
import PT from 'prop-types';
import { Form, Tag, Input, DatePicker } from 'antd';
import { SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FormattedMessage } from 'umi';
import styles from './styles.less';
import Table from '@ant-design/pro-table';
import SelectMultiple from '@/components/SelectMultiple';

import { requestReportCampaignDetail } from './service';
const { RangePicker } = DatePicker;

function CallHistory() {
  const actionRef = useRef();

  const mockData = [
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 1',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      createdDate: new Date().toISOString(),
      status: 'PENDING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 2',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'RUNNING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 3',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'RUNNING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 4',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'COMPLETED',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 5',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'SCHEDULED',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 6',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'PENDING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 7',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'RUNNING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 8',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'RUNNING',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 9',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'COMPLETED',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 10',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'SCHEDULED',
    },
    {
      campaignCode: Math.random(),
      campaignName: 'Chiến dịch 11',
      campaignType: 'Auto Call',
      totalCustomer: 123,
      totalCall: 312,
      totalSuccessCall: Math.random(),
      totalUnSuccessCall: Math.random(),
      totalErrCall: Math.random(),
      totalCallTime: 3213132,
      averageCallTime: 98,
      totalRequestT2S: 312,
      totalCharacterT2S: 2133,
      status: 'COMPLETED',
    },
  ];

  return (
    <div className={styles.infoTable}>
      <Table
        headerTitle={
          <Form style={{ marginBottom: '0px', display: 'flex', gap: '10px' }}>
            <Form.Item
              style={{ display: 'list-item', marginBottom: '0px' }}
              name="role_name"
              label={<span>Kết quả</span>}
            >
              <SelectMultiple
                list={/* rolesFilter */ []}
                //callback={handleOkRole}
                style={{ width: 150 }}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: '0px', display: 'list-item' }}
              name="unit"
              label={<span>Agent </span>}
            >
              <SelectMultiple
                list={/* rolesFilter */ []}
                //callback={handleOkUnit}
                style={{ width: 150 }}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: '0px', display: 'list-item' }}
              name="department"
              label={<span>Thời gian</span>}
            >
              <RangePicker onChange={(e) => onSelectSumaryReport(e, detailCampaign.campaign_id)} />
            </Form.Item>
          </Form>
        }
        //search form
        toolBarRender={() => [
          <Input
            style={{
              width: 200,
            }}
            key="search"
            placeholder="Nhập từ khóa"
            prefix={<SearchOutlined />}
            allowClear
            /* onChange={(e) => {
            if (e.target.value.length === 0) {
              handleInputOnChange('');
            }
          }}
          onPressEnter={(e) => handleInputOnChange(e.target.value)} */
          />,
        ]}
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
            title: '#',
            className: styles.column,
            render: (_, record, id) => <span>{id + 1}</span>,
          },
          {
            title: 'Tên khách hàng',
            dataIndex: 'campaignName',
            key: 'campaignName',
            width: 150,
            className: styles.column,
          },
          {
            title: 'Số điện thoại',
            dataIndex: 'totalCustomer',
            key: 'totalCustomer',
            className: styles.column,
            align: 'center',
          },

          {
            title: 'Đầu số gọi ra',
            dataIndex: 'totalCall',
            key: 'totalCall',
            className: styles.column,
            align: 'center',
          },
          {
            title: 'Số máy nhánh',
            dataIndex: 'totalSuccessCall',
            key: 'totalSuccessCall',
            className: styles.column,
            align: 'center',
          },
          {
            title: 'Agent',
            dataIndex: 'totalUnSuccessCall',
            key: 'totalUnSuccessCall',
            className: styles.column,
            align: 'center',
          },
          {
            title: 'Thời gian bắt đầu',
            dataIndex: 'createdDate',
            key: 'createdDate',
            className: styles.column,
            align: 'center',
            render: (text) =>
              (text.length > 0 && moment(text).format('DD-MM-YYYY HH:mm:ss')) || '-',
          },
          {
            title: 'Thời lượng gọi',
            dataIndex: 'totalCallTime',
            key: 'totalCallTime',
            className: styles.column,
            align: 'center',
          },
          {
            title: 'Loại cuộc gọi',
            dataIndex: 'averageCallTime',
            key: 'averageCallTime',
            className: styles.column,
            align: 'center',
            render: (text) => (text !== 0 ? text.toFixed(2) : text),
          },
          {
            title: 'Lần gọi lại',
            dataIndex: 'totalRequestT2S',
            key: 'totalRequestT2S',
            className: styles.column,
            align: 'center',
          },

          {
            title: 'Kết quả',
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

          {
            title: 'Ghi chú',
            dataIndex: 'averageCallTime',
            key: 'averageCallTime',
            className: styles.column,
            align: 'center',
            render: (text) => (text !== 0 ? text.toFixed(2) : text),
          },
        ]}
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
              data: /* []  */ mockData, //mock data,
            };
          }
        }}
        //dataSource={mockData}
        actionRef={actionRef}
      />
    </div>
  );
}

export default CallHistory;
