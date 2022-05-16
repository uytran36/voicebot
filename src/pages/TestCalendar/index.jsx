import React, { useEffect, useState, useCallback } from 'react';
import { Checkbox } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import MonthTable from './component/MonthTable';
import { Select, Input, Dropdown } from 'antd';

const { Option } = Select;
import './style.css'
const TestCalendar = () => {
  const dateNow = new Date(Date.now());
  const [dateCurren, setDateCurren] = useState(null)
  return (
    <PageContainer>
      <div style={{ width: '20%' }}>
        <Dropdown overlay={<MonthTable setDateCurren={setDateCurren} />} overlayStyle={{ width: '20%' }} trigger={['click']}>
          <Input style={{ width: '100%' }} value={dateCurren} placeholder="chon ngay"></Input>
        </Dropdown>
      </div>
    </PageContainer>
  );
};

export default TestCalendar;
