import React, { Fragment, useContext, useCallback, useState, useRef } from 'react';
import PT from 'prop-types';
import { Dropdown, Menu, Checkbox, Space, Button, Input, message, Form, DatePicker } from 'antd';
import Table from '@ant-design/pro-table';
import styles from './styles.less';

import moment from 'moment';
import debounce from 'lodash/debounce';
import { ModalUpdateContext } from '@/contexts/modal.context';
import { fetchDataList, deleteExcelData, downloadExcelData } from './function';

import {
  // UnorderedListOutlined,
  // CopyOutlined,
  DownloadOutlined,
  DeleteOutlined,
  MoreOutlined,
  SearchOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
const { RangePicker } = DatePicker;

DataTable.propTypes = {
  history: PT.shape({
    push: PT.func,
  }).isRequired,
};

function DataTable({ toggleAddData, headers }) {
  const [valueSearch, setValueSearch] = useState({ name: '', from: {}, to: {} });
  const [pageSize, setPageSize] = useState(10);
  const actionRef = useRef();
  const setStateModal = React.useContext(ModalUpdateContext);

  const menu = (record) => () => (
    <Menu>
      <Menu.Item
        key="1"
        onClick={handleDownloadData(record)}
      >
        <span>
          <DownloadOutlined style={{ marginRight: 5 }} />
          Download dữ liệu
        </span>
      </Menu.Item>
      <Menu.Item key="4" onClick={onToggleModalConfirmDeleteData(record.id, {})}>
        <span>
          <DeleteOutlined style={{ marginRight: 5 }} />
          Xóa dữ liệu
        </span>
      </Menu.Item>
    </Menu>
  );

  const handleDownloadData = React.useCallback(
    (record) => async () => {
      await downloadExcelData(headers, record);
    },
    [headers],
  );

  const changePageSize = (current, size) => {
    setPageSize(size);
  }

  const onToggleModalConfirmDeleteData = React.useCallback(
    (id, { selectedRowKeys, onCleanSelected }) => () => {
      let selected = []
      if (id !== "") {
        selected.push(id)
      } else {
        selected = [...selectedRowKeys]
      }
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
                  const success = await deleteExcelData(headers, selected);
                  if (success) {
                    actionRef.current.reload();
                    if (id === "") {
                      onCleanSelected();
                    } else {
                      actionRef.current.clearSelected();
                    }
                  }
                  setStateModal(false, {});
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

  return (
    <>
      <Table
        actionRef={actionRef}
        rowKey={(record) => record.id}
        rowSelection
        className={styles.paddingTable}
        size="small"
        // rowClassName={(record) => rowSelected._id === record._id && styles['row-selected']}
        pagination={{
          defaultPageSize: pageSize,
          size: 'default',
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['5', '10', '20', '30', '50'],
          showTotal: false,
          onShowSizeChange: changePageSize
        }}
        cardProps={{
          padding: 0,
        }}
        scroll={{ x: 992 }}
        search={false}
        options={false}
        params={{
          name: valueSearch.name,
          from: valueSearch.from,
          to: valueSearch.to,
        }}
        request={async (params, sorter, filter) => {
          const { data, total } = await fetchDataList({
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
            total
          };
        }}
        columns={[
          {
            title: <span style={{ fontWeight: 'bold' }}>STT</span>,
            // align: 'center',
            width: 20,
            render: (text, record, id) => {
              return <span>{record.index}</span>;
            },
          },
          {
            title: <span style={{ fontWeight: 'bold' }}>Tên dữ liệu</span>,
            dataIndex: 'name',
            align: 'left',
            width: 400,
            // render: (text, record, id) => {
            //   return (
            //     <p
            //       onClick={onToggleModalRoleForm(true, record)}
            //       style={{ margin: 0, cursor: 'pointer' }}
            //     >
            //       {text}
            //     </p>
            //   );
            // },
          },
          {
            title: <span style={{ fontWeight: 'bold' }}>Người tải lên</span>,
            dataIndex: 'upload_by_username',
            align: 'left',
            width: 200,
          },
          {
            title: <span style={{ fontWeight: 'bold' }}>Thời gian tải lên</span>,
            dataIndex: 'create_at',
            align: 'left',
            width: 200,
            render: (text) => (moment(text).isValid() ? moment(text).format('DD/MM/YYYY HH:mm') : '-'),
          },
          {
            align: 'center',
            width: 10,
            // fixed: 'right',
            render: (text, record) => {
              return (
                <Dropdown trigger={['click']} overlay={menu(record)}>
                  <MoreOutlined style={{ fontSize: 26, cursor: 'pointer' }} />
                </Dropdown>
              );
            },
          },
        ]}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space size={20}>
            <span>{`Đã chọn: ${selectedRowKeys.length}`}</span>
            <Button
              onClick={onToggleModalConfirmDeleteData("", { selectedRowKeys, onCleanSelected })}
              style={{ background: '#fff', color: '#000' }}
              icon={<DeleteOutlined />}
            >
              Xóa dữ liệu
            </Button>
          </Space>
        )}
        tableAlertOptionRender={null}
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
                  setValueSearch({ ...valueSearch, name: value });
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
          <Button
            key="add"
            type="primary"
            onClick={() => toggleAddData(true)}
          >
            <PlusOutlined />
            <span>Thêm dữ liệu</span>
          </Button>
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
                        dateTo.setTime(dateTo.getTime() + 86399999)
                        setValueSearch({ ...valueSearch, from: dateFrom.toISOString(), to: dateTo.toISOString() });
                      }
                      else {
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
