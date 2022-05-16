import React, { useState, useCallback, useMemo } from 'react';
import moment from 'moment';
import { connect } from 'umi';
import { CloseOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Button } from 'antd';
import { TableAdvance, constant } from '../components/Table';
import CustomDatePicker from '@/components/CustomDatePicker';
import { Export } from '@/components/Icons';
import {
  requestDetailChat,
  requestDetailConversation,
  requestDetailChatExport,
} from '@/services/chat';

export default connect(({ user }) => ({ user }))(function DetailChat({ dispatch, user }) {
  const headers = useMemo(
    () => ({
      // 'X-Auth-Token': user.authToken,
      // 'X-User-Id': user.userId,
      Authorization: `${user.tokenGateway}`,
    }),
    [user.authToken, user.tokenGateway, user.userId],
  );
  const [dateSelect, setDateSelect] = useState({
    startDate: moment().startOf('day'),
    endDate: moment().endOf('day'),
  });
  const [paramsTable, setParamsTable] = useState({});

  const onCancelModal = useCallback(() => {
    dispatch({
      type: 'modal/changeElement',
      payload: {
        content: null,
        footer: null,
        title: '',
        width: 640,
        bodyStyle: {},
      },
    });
    dispatch({
      type: 'modal/showModal',
      payload: false,
    });
  }, [dispatch]);

  const onRowClick = useCallback(
    (e, records) => {
      const { roomId } = records;
      const params = {
        startDate: dateSelect.startDate.format('YYYY-MM-DD'),
        endDate: dateSelect.endDate.format('YYYY-MM-DD'),
      };
      dispatch({
        type: 'modal/changeElement',
        payload: {
          title: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 500,
                    color: '#000000',
                  }}
                >
                  Chi tiết hội thoại
                </div>
              </div>
              <CloseOutlined onClick={() => onCancelModal()} />
            </div>
          ),
          content: (
            <TableAdvance
              pagination={false}
              rowClassName={(record) => record?.agent && 'table-row-agent'}
              // rowClassName={(record) => record.agent && '#127ace'}
              rowKey={(record) => record.session_id}
              columns={constant.DetailConversationReportTableHeader}
              search={false}
              options={false}
              scroll={{ x: 600, y: 500 }}
              request={async ({ current, pageSize, dateSelected }) => {
                try {
                  const res = await requestDetailConversation(headers, roomId, params);
                  if (res.code === 200) {
                    return {
                      data: res?.response?.messages || [],
                      total: 10 * (res?.response.totalPage + 1),
                    };
                  }
                  throw new Error('ERROR~');
                } catch (err) {
                  return {
                    data: [],
                    total: 0,
                  };
                }
              }}
            />
          ),
          width: 740,
          footer: {
            footer: null,
            onCancel: () => {
              onCancelModal();
            },
          },
          bodyStyle: {
            padding: '0px 0px 16px 0px',
          },
        },
        onCancel: () => console.log('123'),
      });
    },
    [dispatch, onCancelModal, dateSelect],
  );

  return (
    <Row>
      <Col span={24}>
        <TableAdvance
          pagination={{
            showTotal: false,
            size: 'default',
            defaultPageSize: 10,
          }}
          rowKey={(record) => record.session_id}
          columns={constant.DetailChatReportTableHeader}
          onRow={(record) => ({
            onClick: (e) => onRowClick(e, record),
          })}
          headerTitle={<Typography.Title level={5}>Chi tiết chat</Typography.Title>}
          toolBarRender={() => [
            <CustomDatePicker
              key="datepicker"
              disabled={false}
              placeholder={['Từ ngày', 'Đến ngày']}
              value={[dateSelect.startDate, dateSelect.endDate]}
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
                  endDate: moment().startOf('day'),
                });
                return null;
              }}
            />,
            <Button
              key="export"
              type="primary"
              icon={<Export />}
              onClick={() => {
                const params = {
                  beginDate: dateSelect.startDate.format('YYYY-MM-DD'),
                  closedDate: dateSelect.endDate.format('YYYY-MM-DD'),
                  subId: user.wsId
                };
                requestDetailChatExport(headers, params);
              }}
            >
              Export
            </Button>,
          ]}
          params={{ dateSelected: dateSelect }}
          request={async ({ current, pageSize, dateSelected }) => {
            const params = {
              beginDate: dateSelected.startDate.format('YYYY-MM-DD'),
              closedDate: dateSelected.endDate.format('YYYY-MM-DD'),
              limit: pageSize,
              page: current - 1,
            };
            setParamsTable({
              current,
              pageSize,
            });
            try {
              const res = await requestDetailChat(headers, params);
              if (res.code === 200) {
                return {
                  data: res?.response?.listAllChatDetails || [],
                  total: pageSize * (res?.response.totalPage + 1),
                };
              }
              throw new Error('ERROR~');
            } catch (err) {
              return {
                data: [],
                total: 0,
              };
            }
          }}
        />
      </Col>
    </Row>
  );
});
