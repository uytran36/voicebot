import React, { useState, memo, useCallback } from 'react';
import PT from 'prop-types';
import { Form, Typography, Table, Button } from 'antd';
import styles from './styles.less';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

PreviewData.propTypes = {
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  file: PT.instanceOf(Object).isRequired,
  dataFileExcel: PT.instanceOf(Array).isRequired,
  history: PT.instanceOf(Object).isRequired,
};

const filtered = [
  'xlsContactListHistory',
  'xlsContactObject',
  'createdAt',
  'updatedAt',
  'object',
  'createdBy',
  '__rowNum__'
];

function PreviewData({ children, file, dataFileExcel, history }) {
  const columns = [];
  if (Array.isArray(dataFileExcel) && dataFileExcel.length > 0) {
    Object.keys(dataFileExcel[0]).forEach((key) => {
      if (!filtered.includes(key)) {
        columns.push({
          title: key.toString(),
          dataIndex: key.toString(),
          align: 'center',
          render: (_, record) => record[key].toString(),
        });
      }
    });
  }

  return (
    <Form {...layout} className={styles.form} layout="vertical">
      <Typography.Title level={3} className={styles.title}>
        Xem trước dữ liệu
      </Typography.Title>
      <Typography.Paragraph className={styles.subTitle}>
        Dữ liệu bạn chọn đang được thể hiện theo bảng bên dưới
      </Typography.Paragraph>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography.Title level={4} className={styles.title}>
          {file.files[0].originalname}
        </Typography.Title>
        {/* <Button onClick={handleClickButton}>Chuẩn hoá</Button> */}
      </div>

      <Table
        rowKey={() => Math.random().toString(36).substring(7)}
        columns={columns}
        dataSource={dataFileExcel}
        // pagination={{
        //   size:"small",
        //   // showSizeChanger: false,
        //   size: 'default',
        // }}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
          size: 'default',
          // showSizeChanger: false,
        }}
        size="small"
        scroll={{ x: true }}
      />

      {children}
    </Form>
  );
}

export default memo(PreviewData);
