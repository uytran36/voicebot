/* eslint-disable react/prop-types */
import React, { useState, useCallback, useMemo } from 'react';
import PT from 'prop-types';
import debounce from 'lodash/debounce';
import { SearchOutlined } from '@ant-design/icons';
import { Export } from '@/components/Icons';
import { connect } from 'umi';
import { Input, Button, Typography } from 'antd';
import { TableAdvance } from './components/Table';
import CustomeDatePicker from '@/components/CustomDatePicker';
import styles from './styles.less';
import { requestGetReportCustomer, requestExportReportCustomer } from '@/services/chat';
import DetailCustomer from './components/Detail-customer';

import moment from 'moment';

CustomerReport.propTypes = {
  dispatch: PT.func.isRequired,
}

function CustomerReport({ dispatch, user }) {
  const [valueSearch, setValueSearch] = useState('');
  const [dateSelect, setDateSelect] = useState({
    startDate: moment().startOf('day'),
    endDate: moment().startOf('day')
  });

  const headers = useMemo(
    () => ({
      // 'X-Auth-Token': user.authToken,
      // 'X-User-Id': user.userId,
      Authorization: `${user.tokenGateway}`,
    }),
    [user.tokenGateway],
  );

  const handleSearch = debounce(
    (e) => {
      const { value } = e.target;
      setValueSearch(value);
    },
    500,
    {
      trailing: true,
      leading: false,
    },
  );

  const handleExportData = useCallback(async () => {
    try {
      const res = await requestExportReportCustomer(headers, {
        beginDate: dateSelect.startDate.format('YYYY-MM-DD'),
        closedDate: dateSelect.endDate.format('YYYY-MM-DD'),
        subId: user.wsId,
      });
      return null;
    } catch (err) {
      console.log(err);
    }
  }, [dateSelect, headers]);

  const handleChangeElementModal = useCallback(
    (objElement) => {
      dispatch({
        type: 'modal/changeElement',
        payload: objElement,
      });
    },
    [dispatch],
  );

  const handleChangeStateModal = useCallback(
    (stateModal) => {
      dispatch({
        type: 'modal/showModal',
        payload: stateModal,
      });
    },
    [dispatch],
  );

  return (
    <TableAdvance
      className={styles.table}
      headerTitle={<Typography.Title level={5}>Lịch sử chat của Agent</Typography.Title>}
      toolBarRender={() => [
        <Input
          key="input"
          prefix={<SearchOutlined />}
          placeholder="Nhập từ khóa"
          onChange={handleSearch}
          allowClear
        />,
        <CustomeDatePicker
          key="date-picker"
          disabled={false}
          value={[dateSelect.startDate, dateSelect.endDate]}
          placeholder={['Từ ngày', 'Đến ngày']}
          onChange={(value) => {
            if (value?.length > 0) {
              setDateSelect({
                startDate: value[0],
                endDate: value[1],
              });
              return null;
            }
            setDateSelect({
              startDate: moment().startOf('day'),
              endDate: moment().startOf('day')
            });
            return null;
          }}
        />,
        <Button key="export" type="primary" icon={<Export />} onClick={handleExportData}>
          Export
        </Button>,
      ]}
      params={{ filterDate: dateSelect, customerName: valueSearch }}
      request={async ({ filterDate, customerName, current, pageSize }) => {
        const params = {
          beginDate: filterDate.startDate.format('YYYY-MM-DD'),
          closedDate: filterDate.endDate.format('YYYY-MM-DD'),
          customerName,
          limit: pageSize,
          page: current - 1,
        };
        try {
          const res = await requestGetReportCustomer(headers, params);
          if (res.code === 200) {
            const result = [];
            res.response.data.map(data => {
              result.push({
                fullname: data.customerName,
                phone: data.phone,
                fb_id: data.report.FACEBOOK.id,
                fb_total: data.report.FACEBOOK.totalRoom,
                zalo_id: data.report.ZALO.id,
                zalo_total: data.report.ZALO.totalRoom,
                livechat_id: data.report.LIVECHAT.id,
                livechat_total: data.report.LIVECHAT.totalRoom,
              })
            })
            return {
              data: result,
              total: 10 * (res.response.totalPage + 1),
            };
          }
          throw new Error('ERROR~');
        } catch (err) {
          console.error(err);
          return {
            data: [],
            total: 0,
          };
        }
      }}
      columns={[
        {
          key: 'fullname',
          dataIndex: 'fullname',
          title: 'Họ và tên',
          align: 'center',
          width: 150,
          fixed: 'left',
          className: styles['light-blue'],
          render: (text, record) => {
            return (
              <span
                onClick={() => {
                  handleChangeElementModal({
                    width: 992,
                    bodyStyle: {
                      padding: '0px',
                    },
                    content: <DetailCustomer onClose={handleChangeStateModal} />,
                    footer: {
                      // centered: true,
                      style: { top: 120 },
                      footer: null,
                      onCancel: () => handleChangeStateModal(false),
                    },
                  });
                }}
              >
                {text}
              </span>
            );
          },
        },
        {
          key: 'phone',
          dataIndex: 'phone',
          title: 'Số điện thoại',
          align: 'center',
          width: 150,
          fixed: 'left',
          className: styles['light-blue'],
        },
        {
          key: 'fb',
          title: 'Facebook',
          // width: 140,
          className: styles['dark-orange'],
          children: [
            {
              key: 'facebook[id]',
              dataIndex: 'fb_id',
              title: 'ID Facebook',
              align: 'center',
              // width: 70,
              className: styles['light-orange'],
            },
            {
              key: 'total-fb',
              dataIndex: 'fb_total',
              title: 'Tổng hội thoại',
              align: 'center',
              // width: 70,
              className: styles['light-orange'],
            },
          ],
        },
        {
          key: 'zalo',
          title: 'Zalo',
          align: 'center',
          // width: 140,
          className: styles['dark-candy'],
          children: [
            {
              key: 'id-zalo',
              dataIndex: 'zalo_id',
              title: 'ID Zalo',
              align: 'center',
              // width: 70,
              className: styles['light-candy'],
            },
            {
              key: 'total-zalo',
              dataIndex: 'zalo_total',
              title: 'Tổng hội thoại',
              align: 'center',
              // width: 70,
              className: styles['light-candy'],
            },
          ],
        },
        {
          key: 'livechat',
          title: 'Livechat',
          align: 'center',
          // width: 140,
          className: styles['dark-purple'],
          children: [
            {
              key: 'id-livechat',
              dataIndex: 'livechat_id',
              title: 'ID Livechat',
              align: 'center',
              // width: 70,
              className: styles['light-purple'],
            },
            {
              key: 'total-livechat',
              dataIndex: 'livechat_total',
              title: 'Tổng hội thoại',
              align: 'center',
              // width: 70,
              className: styles['light-purple'],
            },
          ],
        },
      ]}
    />
  );
}

export default connect(({ user }) => ({ user }))(CustomerReport);
