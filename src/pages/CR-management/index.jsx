import React, { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import { Tabs, Tag } from 'antd';
import styles from './styles.less';
import { requestGetGroups, requestGetCustomersOfGroup } from '@/services/crm';
import ImportCustomer from './components/import-customer';
import { checkPermission, MINI_CRM_MANAGEMENT } from '@/utils/permission';

const CustomersComponent = React.lazy(() => import('./components/customers'));
const GroupsComponent = React.lazy(() => import('./components/groups'));

CustomerManagement.propTypes = {
  dispatch: PT.func.isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
  }).isRequired,
  crm: PT.shape({
    tabActive: PT.string,
  }).isRequired,
};

function CustomerManagement({ dispatch, user, crm: { tabActive } }) {
  const [totalCustomer, settotalCustomer] = useState(0);
  const [totalGroups, settotalGroups] = useState(0);
  const [isImportCustomer, toggleImportCustomer] = useState(false);
  const [groups, setGroups] = useState([]);
  const [permissions, setPermissions] = useState({ manage: false, update: false, onlyView: false });
  useEffect(() => {
    setPermissions({
      manage: checkPermission(
        user?.currentUser?.permissions,
        MINI_CRM_MANAGEMENT.manageInfoCustomer,
      ),
      update: checkPermission(
        user?.currentUser?.permissions,
        MINI_CRM_MANAGEMENT.updateInfoCustomer,
      ),
      onlyView: checkPermission(
        user?.currentUser?.permissions,
        MINI_CRM_MANAGEMENT.onlyViewInfoCustomer,
      ),
    });
  }, [user?.currentUser?.permissions]);

  const headers = useMemo(() => {
    return {
      'X-Auth-Token': user.authToken,
      'X-User-Id': user.userId,
      Authorization: `${user.tokenGateway}`,
    };
  }, [user.authToken, user.tokenGateway, user.userId]);

  const toggleTab = useCallback(
    (_activeKey) => {
      dispatch({
        type: 'crm/execution',
        payload: {
          tabActive: _activeKey,
        },
      });
    },
    [dispatch],
  );

  useEffect(() => {
    if (tabActive === 'cus') {
      requestGetGroups({ limit: 50 }, headers)
        .then((res) => {
          if (res?.msg === 'SUCCESS') {
            const { totalRecord } = res.response;
            settotalGroups(totalRecord || 0);
            setGroups(res.response.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
    if (tabActive === 'group') {
      requestGetCustomersOfGroup({ limit: 1 }, headers)
        .then((res) => {
          if (res?.msg === 'SUCCESS') {
            const { totalRecord } = res.response;
            settotalCustomer(totalRecord || 0);
          }
        })
        .catch((err) => {
          settotalCustomer(0);
          console.error(err);
        });
    }
  }, [headers, tabActive]);

  return (
    <div className={styles.container}>
      {isImportCustomer && <ImportCustomer onToggleBack={toggleImportCustomer} />}
      {!isImportCustomer && (
        <Tabs
          type="card"
          defaultActiveKey={tabActive}
          onChange={(activeKey) => toggleTab(activeKey)}
        >
          <Tabs.TabPane
            tab={
              <span>
                <span>Khách hàng</span>{' '}
                <Tag
                  style={
                    tabActive === 'cus'
                      ? {
                          color: '#127ACE',
                          background: '#EBF5FD',
                          borderColor: '#EBF5FD',
                          borderRadius: '10px',
                        }
                      : {
                          color: 'rgb(0,0,0,.45)',
                          background: '#F0F0F0',
                          borderRadius: '10px',
                        }
                  }
                >
                  {totalCustomer}
                </Tag>
              </span>
            }
            key="cus"
          >
            <div className={styles.pane}>
              <Suspense fallback={<div>loading..</div>}>
                <CustomersComponent
                  onSettotalCustomer={settotalCustomer}
                  toggleImportCustomer={toggleImportCustomer}
                  groups={groups}
                  tabActive={tabActive}
                  totalCustomer={totalCustomer}
                  headers={headers}
                  wsId={user.wsId}
                  permissions={permissions}
                />
              </Suspense>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              <span>
                <span>Nhóm</span>{' '}
                <Tag
                  style={
                    tabActive === 'group'
                      ? {
                          color: '#127ACE',
                          background: '#EBF5FD',
                          borderColor: '#EBF5FD',
                          borderRadius: '10px',
                        }
                      : { color: 'rgb(0,0,0,.45)', background: '#F0F0F0', borderRadius: '10px' }
                  }
                >
                  {totalGroups}
                </Tag>
              </span>
            }
            key="group"
          >
            <Suspense fallback={<div>loading..</div>}>
              <GroupsComponent
                settotalGroups={settotalGroups}
                tabActive={tabActive}
                headers={headers}
                permissions={permissions}
              />
            </Suspense>
          </Tabs.TabPane>
        </Tabs>
      )}
    </div>
  );
}

export default connect(({ user, crm }) => ({ user, crm }))(CustomerManagement);
