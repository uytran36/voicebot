import React, { useState, useMemo } from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import { Row, Col, Tabs } from 'antd';
import NoDataPermission from '@/components/NoDataPermission';
import { CALL_CENTER_MANAGEMENT, checkPermission } from '@/utils/permission';
import CallReport from './components/CallMonitor';
import WaitReport from './components/WaitMonitor';
import AgentReport from './components/AgentMonitor';
import styles from './style.less';

const { TabPane } = Tabs;

Monitor.propTypes = {
  dispatch: PT.func.isRequired,
  dataCallMonitor: PT.any,
  user: PT.shape({
    tokenGateway: PT.string,
    currentUser: PT.instanceOf(Object),
  }).isRequired,
};

function Monitor(props) {
  const { user, dataCallMonitor, dispatch } = props;
  const [tabKey, setTabKey] = useState('callObserve');

  const headers = useMemo(() => {
    return {
      Authorization: `${user.tokenGateway}`,
    };
  }, [user.tokenGateway]);

  // list permission
  const isCallMonitor = useMemo(() => checkPermission(user.currentUser.permissions, CALL_CENTER_MANAGEMENT.callMonitor), [user.currentUser.permissions]);
  const isMonitorQueue = useMemo(() => checkPermission(user.currentUser.permissions, CALL_CENTER_MANAGEMENT.monitorQueue), [user.currentUser.permissions]);
  const isMonitorAgent = useMemo(() => checkPermission(user.currentUser.permissions, CALL_CENTER_MANAGEMENT.monitorAgent), [user.currentUser.permissions]);

  if (!isCallMonitor && !isMonitorQueue && !isMonitorAgent ) {
    return <NoDataPermission />
  }

  return (
    <div className={styles.body}>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <Col span={24}>
          <span
            style={{
              marginRight: '12px',
              color: 'rgba(0, 0, 0, 0.85)',
              fontSize: '24px',
              fontWeight: '500',
            }}
          >
            Giám sát
          </span>
        </Col>
        <Col span={24} style={{ border: '1px solid #f0f0f0', padding: 0 }}>
          <Tabs
            type="card"
            defaultActiveKey="callObserve"
            destroyInactiveTabPane={true}
            style={{ width: '100%' }}
            destroyInactiveTabPane={true}
            onTabClick={(key) => {
              setTabKey(key);
            }}
          >
            {isCallMonitor && (
              <TabPane tab="Giám sát cuộc goi" key="callObserve">
                <CallReport
                  headers={headers}
                  dataCallMonitor={dataCallMonitor}
                  tabKey={tabKey}
                  dispatch={dispatch}
                />
              </TabPane>
            )}
            {isMonitorQueue && (
              <TabPane tab="Giám sát hàng chờ" key="waitObserve">
                <WaitReport user={user} />
              </TabPane>
            )}
            {isMonitorAgent && (
              <TabPane tab="Giám sát agent" key="agentObserve">
                <AgentReport user={user} />
              </TabPane>
            )}
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
export default connect(({ user, callManagement }) => ({
  user,
  dataCallMonitor: callManagement.dataCallMonitor,
}))(React.memo(Monitor));
