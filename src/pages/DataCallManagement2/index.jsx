import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { Typography, Tabs, Card } from 'antd';
import { connect } from 'umi';
import PT from 'prop-types';
import DataExcel from './components/DataExcel';
import DataAPI from './components/DataAPI';
import styles from './style.less';
export const signature = {
  contactListBase: 'list-base',
  contactListNormalizations: 'list-normalizations',
};
import { CALL_DATA_MANAGEMENT, checkPermission } from '@/utils/permission';
import NoDataPermission from '@/components/NoDataPermission';

const { TabPane } = Tabs;
const { Title } = Typography;

DataCallManagement2.propTypes = {
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
  }).isRequired,
  history: PT.instanceOf(Object).isRequired,
};

function DataCallManagement2(props) {
  const {
    user: { userId, tokenGateway, currentUser },
    history,
  } = props;

  const [importDataCalling, setImportDataCalling] = useState(false);
  const [importDataDNC, setImportDataDNC] = useState(false);
  const [headers, setHeaders] = useState({});

  useEffect(() => {
    setHeaders({
      Authorization: tokenGateway,
    });

  }, [tokenGateway, userId]);

  const isManageDataInExcelFile = React.useMemo(
    () => {
      return checkPermission(currentUser?.permissions, CALL_DATA_MANAGEMENT.manageDataInExcelFile)
    },
    [currentUser?.permissions],
  );

  const isManageDataFromAPI = React.useMemo(
    () => {
      return checkPermission(currentUser?.permissions, CALL_DATA_MANAGEMENT.manageDataFromAPI)
    },
    [currentUser?.permissions],
  );

  return (
    <React.Fragment>
      {
        isManageDataInExcelFile || isManageDataFromAPI ? (
          <Suspense fallback={<div>loading..</div>}>
            <Title level={3}>Quản lý dữ liệu gọi</Title>
            <div className="card-container">
              <Tabs onChange={null} type="card">
                {isManageDataInExcelFile ? (
                  <TabPane tab="Dữ liệu file excel" key="1">
                    <Card bordered={false} style={{ padding: 20 }}>
                      <DataExcel
                        headers={headers}
                        history={history}
                        currentUser={currentUser}
                      />
                    </Card>
                  </TabPane>
                ) : (<></>)}
                {isManageDataFromAPI ? (
                  <TabPane tab="Dữ liệu API" key="2">
                    <Card bordered={false} className="api-tab">
                      <DataAPI
                        headers={headers}
                        importDataDNC={importDataDNC}
                        importDataCalling={importDataCalling}
                        history={history}
                        currentUser={currentUser}
                      />
                    </Card>
                  </TabPane>
                ) : (<></>)}
              </Tabs>
            </div>
          </Suspense>
        ) : (
          <NoDataPermission />
        )
      }
    </React.Fragment>

  );
}

export default connect(({ user }) => ({
  user,
}))(DataCallManagement2);
