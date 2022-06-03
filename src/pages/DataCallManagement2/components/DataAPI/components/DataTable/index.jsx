import React, { useEffect, useContext, useCallback, useState, useRef } from 'react';
import PT from 'prop-types';
import { Dropdown, Menu, Checkbox, Space, Button, Input, message, Form, DatePicker } from 'antd';
import Table from '@ant-design/pro-table';
import moment from 'moment';
import styles from './styles.less';
import debounce from 'lodash/debounce';
import { ModalUpdateContext } from '@/contexts/modal.context';
import {
  fetchAPIDataImport,
  fetchAPIDataExport,
  deleteAPIData,
  deleteAPIDataExport,
} from './function';
import { renderModalAPIForm } from '../RootForm/modalAPIForm';

import {
  // UnorderedListOutlined,
  // CopyOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  SearchOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
const { RangePicker } = DatePicker;
const formatDateTime = 'DD/MM/YYYY HH:mm';

DataTable.propTypes = {
  history: PT.shape({
    push: PT.func,
  }).isRequired,
  keyTab: PT.string.isRequired,
  onDelete: PT.func,
};

function DataTable({ headers, history, keyTab, onDelete, type, ...props }) {
  const setStateModal = useContext(ModalUpdateContext);
  const [pageSize, setPageSize] = useState(10);
  const [valueSearch, setValueSearch] = useState({ search: '', from: {}, to: {} });

  const actionRef = useRef();
  const timedifference = moment().utcOffset();

  const changePageSize = (current, size) => {
    setPageSize(size);
  };

  const onToggleModalConfirmDeleteData = React.useCallback(
    (id) => () => {
      setStateModal(true, {
        footer: null,
        closable: false,
        onCancel: () => setStateModal(false, {}),
        content: (
          <div className={styles.deleteModalWrapper}>
            <div className={styles.warning}>
              <InfoCircleOutlined style={{ color: '#faad14' }} />
              <span>Bạn có chắc chắn muốn xóa?</span>
            </div>
            <div className={styles.footer}>
              <Button onClick={() => setStateModal(false, {})} className={styles.noButton}>
                Không
              </Button>
              <Button
                className={styles.yesButton}
                onClick={async () => {
                  if (type === 'import') {
                    const success = await deleteAPIData(headers, id);
                    if (success) {
                      actionRef.current.reload();
                    }
                    setStateModal(false, {});
                  } else {
                    const success = await deleteAPIDataExport(headers, id);
                    if (success) {
                      actionRef.current.reload();
                    }
                    setStateModal(false, {});
                  }
                }}
              >
                Có
              </Button>
            </div>
          </div>
        ),
      });
    },
    [headers, setStateModal],
  );

  const onToggleModalAPIForm = useCallback(
    (isEdit, record) => () => {
      const cb = () => {
        actionRef.current.reload();
        setStateModal(false, {});
      };
      const sample = {
        strategy: 'no_authentication',
        config: {
          method: 'GET',
          url: 'http://manapi.fpt.vn/APICall.svc/getCustomerVoiceAuto',
          header: {},
          parameters: {},
        },
        mapping: {
          phone_number: 'sdt',
        },
      };
      const initialValues = {
        name: record?.name,
        type: record?.type,
        strategy: record?.strategy,
        configuration: record
          ? JSON.stringify(record?.configuration)
          : `{
            "mapping": 
              {
                "phone_number": "mapping fields here"
              },
            "strategy": "no authentication",
            "config": 
              {
                "method": "input method here",
                "url": "input here",
                "header": {},
                "parameters": {}
              }
            }`,
        id: record?.id,
      };

      renderModalAPIForm({
        headers,
        initialValues,
        isEdit,
        cb,
        setStateModal,
        type,
      })();
    },
    [headers, setStateModal],
  );

  const menu = (record, _keyTab) => () => (
    <Menu>
      {/* <Menu.Item
        key="1"
        onClick={() => history.push(`/config/data-call-management-2/${_keyTab}/${record?.sessionId}`)}
      >
        <span>
          <EditOutlined style={{ marginRight: 5 }} />
          Chỉnh sửa dữ liệu
        </span>
      </Menu.Item> */}
      <Menu.Item key="4" onClick={onToggleModalConfirmDeleteData(record.id)}>
        <span>
          <DeleteOutlined style={{ marginRight: 5 }} />
          Xóa dữ liệu
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Table
        actionRef={actionRef}
        style={styles}
        rowKey={(record) => record.id}
        size="small"
        // rowClassName={(record) => rowSelected._id === record._id && styles['row-selected']}
        pagination={{
          defaultPageSize: pageSize,
          size: 'default',
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '30', '50'],
          showTotal: false,
          onShowSizeChange: changePageSize,
        }}
        cardProps={{
          padding: 0,
        }}
        scroll={{ x: 992 }}
        search={false}
        options={false}
        ƒ
        params={{
          search: valueSearch.search,
          from: valueSearch.from,
          to: valueSearch.to,
        }}
        request={async (params, sorter, filter) => {
          if (type === 'import') {
            const { data, total } = await fetchAPIDataImport({
              headers,
              params,
              sorter,
              filter,
            });
            const dataArray = data.map((item, index) => {
              return {
                ...item,
                index: (params.current - 1) * params.pageSize + (index + 1),
              };
            });
            return {
              data: dataArray,
              total,
            };
          } else {
            const { data, total } = await fetchAPIDataExport({
              headers,
              params,
              sorter,
              filter,
            });
            const dataArray = data.map((item, index) => {
              return {
                ...item,
                index: (params.current - 1) * params.pageSize + (index + 1),
              };
            });
            return {
              data: dataArray,
              total,
            };
          }
        }}
        columns={[
          {
            title: <span style={{ fontWeight: 'bold' }}>STT</span>,
            align: 'center',
            width: 20,
            render: (text, record, id) => {
              return <span>{record.index}</span>;
            },
          },
          {
            title: <span style={{ fontWeight: 'bold' }}>Tên dữ liệu</span>,
            dataIndex: 'name',
            align: 'left',
            width: 200,
            render: (text, record, id) => {
              return (
                <p
                  onClick={onToggleModalAPIForm(true, record)}
                  style={{ margin: 0, cursor: 'pointer' }}
                >
                  {text}
                </p>
              );
            },
          },
          {
            title: <span style={{ fontWeight: 'bold' }}>API Type</span>,
            dataIndex: 'type',
            align: 'left',
            width: 100,
          },
          {
            title: <span style={{ fontWeight: 'bold' }}>Số lượng chiến dịch sử dụng</span>,
            dataIndex: 'amount',
            align: 'left',
            width: 80,
          },
          {
            title: <span style={{ fontWeight: 'bold' }}>Thời gian tạo</span>,
            dataIndex: 'create_at',
            align: 'left',
            width: 150,
            render: (text) =>
              moment(text).isValid()
                ? moment.utc(text).utcOffset(timedifference).format(formatDateTime)
                : '-',
          },
          {
            title: <span style={{ fontWeight: 'bold' }}>Thời gian sử dụng gần nhất</span>,
            dataIndex: 'update_at',
            align: 'left',
            width: 150,
            render: (text) =>
              moment(text).isValid()
                ? moment.utc(text).utcOffset(timedifference).format(formatDateTime)
                : '-',
          },
          {
            align: 'center',
            width: 10,
            // fixed: 'right',
            render: (text, record) => {
              return (
                <Dropdown trigger={['click']} overlay={menu(record, keyTab)}>
                  <MoreOutlined style={{ fontSize: 26, cursor: 'pointer' }} />
                </Dropdown>
              );
            },
          },
        ]}
        toolBarRender={() => [
          <Input
            key="search"
            prefix={<SearchOutlined />}
            placeholder="Nhập từ khoá"
            allowClear
            // onPressEnter={(e) => setValueSearch(e.target.value)}
            maxLength={50}
            onChange={debounce(
              (e) => {
                const { value } = e.target;
                if (value.length <= 50) {
                  actionRef.current.reset();
                  setValueSearch({ ...valueSearch, search: value });
                } else {
                  message.warning('Đã vượt quá giới hạn tìm kiếm 50 ký tự!');
                }
              },
              500,
              {
                trailing: true,
                leading: false,
              },
            )}
          />,
          <Button key="add" type="primary" onClick={onToggleModalAPIForm(false)}>
            <PlusOutlined />
            <span>Thêm API</span>
          </Button>,
        ]}
        headerTitle={
          <div className={styles.searchWrapper}>
            <div className={styles.search}>
              <Form.Item label="Thời gian tải lên" style={{ marginBottom: 0 }}>
                <RangePicker
                  placeholder={['Từ ngày', 'Đến ngày']}
                  ranges={{
                    Today: [moment(), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                  }}
                  onChange={debounce(
                    (dates, dateStrings) => {
                      if (dates !== null) {
                        actionRef.current.reset();
                        const dateFrom = new Date(dateStrings[0]);
                        const dateTo = new Date(dateStrings[1]);
                        dateTo.setTime(dateTo.getTime() + 86399999);
                        setValueSearch({
                          ...valueSearch,
                          from: dateFrom.toISOString(),
                          to: dateTo.toISOString(),
                        });
                      } else {
                        actionRef.current.reset();
                        setValueSearch({ ...valueSearch, from: {}, to: {} });
                      }
                    },
                    500,
                    {
                      trailing: true,
                      leading: false,
                    },
                  )}
                />
              </Form.Item>
            </div>
          </div>
        }
      />
    </>
  );
}

export default React.memo(DataTable);
