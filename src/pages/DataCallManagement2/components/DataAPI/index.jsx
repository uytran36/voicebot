import React, { useState, useCallback, useEffect, Suspense } from 'react';
import {
  Input,
  Form,
  Typography,
  message,
  Button,
  Tabs,
  Steps,
  DatePicker,
  Upload,
  Card,
} from 'antd';
import styles from './styles.less';
import {
  // requestContactHistories,
  requestContactNormalizations,
  // requestDeleteContactHistory,
  reuqestDeleteContactListNormalization,
} from '@/services/campaign-management';

import moment from 'moment';
const { TabPane } = Tabs;
const DataTable = React.lazy(() => import('./components/DataTable'));

async function onDeleteContactListNormalization(id, headers = {}) {
  const hide = message.loading('Đang xoá...');
  try {
    if (!id) {
      throw new Error('Missing ID');
    }
    const res = await reuqestDeleteContactListNormalization(id, headers);
    if (res && res.status) {
      hide();
      message.success('Đã xoá dữ liệu đã chuẩn hoá.');
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    hide();
    message.error('Xoá dữ liệu đã chuẩn hoá thất bại.');
    console.error(err);
    return null;
  }
}

async function fetchContactNormalizations(params, headers) {
  try {
    const res = await requestContactNormalizations(headers, { filter: { ...params } });
    if (res.success) {
      return {
        data: res.data,
        total: res.total,
      };
    }
    throw new Error('Fetch data failed');
  } catch (err) {
    console.error(err);
    return {
      data: [],
      total: 0,
    };
  }
}

export const signature = {
  contactListBase: 'list-base',
  contactListNormalizations: 'list-normalizations',
};

const DataAPI = (props) => {
  const { headers, importDataDNC, importDataCalling, history, currentUser } = props;
  const contactNormalizationRef = React.useRef(null);
  const [keyTab, setKeyTab] = useState(signature.contactListNormalizations);
  const [searchValue, setSearchValue] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddData, toggleAddData] = useState(false);

  const handleDeleteOmniContactListNormalization = useCallback(
    (id) => async () => {
      const result = await onDeleteContactListNormalization(id, headers);
      if (result) {
        contactNormalizationRef.current?.reload();
      }
    },
    [headers],
  );

  return (
    <React.Fragment>
      <Tabs defaultActiveKey="1" onChange={null}>
        <TabPane tab="Import" key="1">
          <Suspense fallback={<div>loading..</div>}>
            <DataTable
              headers={headers}
              setSearchValue={(searchStr) => {
                setSearchValue(searchStr);
                if (searchStr.length > 0) {
                  console.log('string search');
                  setCurrentPage(currentPage + 1);
                }
              }}
              actionRef={contactNormalizationRef}
              onDelete={handleDeleteOmniContactListNormalization}
              pagination={{
                defaultPageSize: 10,
                showTotal: false,
                size: 'default',
                hideOnSinglePage: true,
              }}
              size="small"
              keyTab={keyTab}
              params={{ search: searchValue, _createdAt: createdAt }}
              history={history}
              key={currentPage}
              type="import"
            />
          </Suspense>
        </TabPane>
        <TabPane tab="Export" key="2">
          <Suspense fallback={<div>loading..</div>}>
            <DataTable
              headers={headers}
              setSearchValue={(searchStr) => {
                setSearchValue(searchStr);
                if (searchStr.length > 0) {
                  console.log('string search');
                  setCurrentPage(currentPage + 1);
                }
              }}
              actionRef={contactNormalizationRef}
              onDelete={handleDeleteOmniContactListNormalization}
              pagination={{
                defaultPageSize: 10,
                showTotal: false,
                size: 'default',
                hideOnSinglePage: true,
              }}
              size="small"
              keyTab={keyTab}
              params={{ search: searchValue, _createdAt: createdAt }}
              history={history}
              key={currentPage}
              type="export"
            />
          </Suspense>
        </TabPane>
      </Tabs>
    </React.Fragment>
  );
};

export default DataAPI;
