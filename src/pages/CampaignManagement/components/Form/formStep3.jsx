import React, { useCallback, useState, useEffect } from 'react';
import PT from 'prop-types';
import { connect, formatMessage, FormattedMessage } from 'umi';
import { PlayCircleFilled } from '@ant-design/icons';
import { Table, Button } from 'antd';
import { Player } from '@/components/Player';

RenderBackgroundMusic.propTypes = {
  getRecord: PT.func,
  handleChangeStateModal: PT.func,
  toggle: PT.func.isRequired,
  campaign: PT.shape({
    listBgMusic: PT.instanceOf(Array)
  }).isRequired,
};

RenderBackgroundMusic.defaultProps = {
  getRecord: () => {},
  handleChangeStateModal: () => {},
};

function RenderBackgroundMusic({ getRecord, handleChangeStateModal, toggle, campaign: {listBgMusic} }) {
  const [_getRecord, setRecord] = useState({});

  const handleSubmit = useCallback(() => {
    getRecord(_getRecord);
    toggle(-1)();
  }, [_getRecord, getRecord, toggle]);

  const handleSelectRow = useCallback((_, selectedRows) => {
    setRecord(selectedRows[0]);
  }, []);

  const onRowClick = useCallback((record, rowIndex) => e => {
    setRecord(record)
  }, [])

  return (
    <>
      <Table
        size="small"
        rowKey={(record) => record.name}
        columns={[
          {
            title: <FormattedMessage id="pages.campaign-management.name.file" />,
            dataIndex: 'name',
            align: 'center',
          },
          {
            title: <FormattedMessage id= "pages.campaign-management.listen" />,
            align: 'center',
            dataIndex: 'url',
            render: (_, record, index) => {
              return <Player playing={record.playing} url={record.url} toggle={toggle(index)} />;
            },
          },
        ]}
        onRow={(record, rowIndex) => ({
          onClick: onRowClick(record, rowIndex)
        })}
        pagination={false}
        rowSelection={{
          type: 'radio',
          onChange: handleSelectRow,
          selectedRowKeys: [_getRecord.name]
        }}
        dataSource={listBgMusic}
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
        <Button type="primary" onClick={handleSubmit}>
          {<FormattedMessage id="pages.campaign-management.submit" />}
        </Button>
        <Button
          onClick={() => {
            handleChangeStateModal(false);
            toggle(-1)();
          }}
          style={{ marginLeft: 8 }}
        >
          {<FormattedMessage id="pages.campaign-management.cancel" />}
        </Button>
      </div>
    </>
  );
}

export default connect(({ campaign }) => ({ campaign }))(RenderBackgroundMusic);
