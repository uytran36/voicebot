import React, { useState, useCallback } from 'react';
import { formatMessage, FormattedMessage } from 'umi';
import PT from 'prop-types';
import { Table, Button, ConfigProvider } from 'antd';

RenderListCustomer.propTypes = {
  getRecord: PT.func,
  handleChangeStateModal: PT.func,
  data: PT.instanceOf(Array).isRequired,
};

RenderListCustomer.defaultProps = {
  getRecord: () => { },
  handleChangeStateModal: () => { },
};

export default function RenderListCustomer({
  getRecord,
  data,
  handleChangeStateModal,
  setIdListCustomer,
}) {
  const [_getRecord, setRecord] = useState({});
  const [idSelected, setIdSelected] = useState([])
  const handleSubmit = useCallback(() => {
    getRecord(_getRecord);
  }, [_getRecord, getRecord]);

  const handleSelectRow = useCallback(
    (listId, selectedRows) => {
      if (listId.length > 0) {
        setIdListCustomer(listId[0]);
        setIdSelected(listId)
      }
      setRecord(selectedRows);
    },
    [setIdListCustomer],
  );

  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={[
          {
            title: <FormattedMessage id="pages.campaign-management.name.list" />,
            dataIndex: 'tentailieu',
            align: 'center',
          },
        ]}
        // pagination={{
        //   position: ['bottomRight'],
        // }}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
          size: 'default',
          // showSizeChanger: false,
        }}
        size="small"
        rowSelection={{
          type: 'radio',
          onChange: (selectedRowKeys, records) => {
            handleSelectRow(selectedRowKeys, records[0]);
          },
          // getCheckboxProps: record => {
          //   return {
          //     disabled: record.id != null,
          //     name: record.id
          //   };
          // }
          selectedRowKeys: idSelected
        }}
        scroll={{ y: 400 }}
        dataSource={data}
        onRow={(record) => {
          // console.log({record})
          return ({
            onClick: () => handleSelectRow([record.id], record),
          })
        }}
      />
      <div
        style={{
          marginTop: 8,
          marginRight: 16,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Button
          onClick={() => {
            handleChangeStateModal(false);
          }}
          style={{ marginRight: 8 }}
        >
          {<FormattedMessage id="pages.campaign-management.exit" />}
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          {<FormattedMessage id="pages.campaign-management.choose" />}
        </Button>
      </div>
    </>
  );
}
