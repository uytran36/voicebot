import React, { useEffect } from 'react';
import PT from 'prop-types';
import styles from './styles.less';
import { Row, Col, Tabs } from 'antd';
import CallInterface from './components/Call_Interface';
import CallHistory from './components/Call_History';
import InternalContact from './components/Internal_Contact';
import CustomerContact from './components/Customer_Contact';
import { connect } from 'umi';
// import CallMonitor from './components/Call_Monitor';
import { CALL_CENTER_MANAGEMENT, checkPermission } from '@/utils/permission';

const { TabPane } = Tabs;

CallManagement.propTypes = {
  keyTabCallcenter: PT.string.isRequired,
  dispatch: PT.func.isRequired,
  user: PT.shape({
    permissions: PT.arrayOf(PT.string),
    currentUser: PT.object,
    tokenGateway: PT.string,
  }).isRequired,
};

function CallManagement(props) {
  const { dispatch, user, keyTabCallcenter } = props;
  const { tokenGateway, currentUser } = user;

  const headers = React.useMemo(() => ({
    Authorization: `${tokenGateway}`,
  }), [tokenGateway]);

  // list permission
  const isCallInteract = React.useMemo(() => checkPermission(currentUser?.permissions, CALL_CENTER_MANAGEMENT.callInteract), [currentUser?.permissions]);
  const isPersonalCallHistory = React.useMemo(() => checkPermission(currentUser?.permissions, CALL_CENTER_MANAGEMENT.personalCallHistory), [currentUser?.permissions]);
  const isAllCallHistory = React.useMemo(() => checkPermission(currentUser?.permissions, CALL_CENTER_MANAGEMENT.allCallHistory), [currentUser?.permissions]);
  const isInternalDirectory = React.useMemo(() => checkPermission(currentUser?.permissions, CALL_CENTER_MANAGEMENT.internalDirectory), [currentUser?.permissions]);
  const isClientDirectory = React.useMemo(() => checkPermission(currentUser?.permissions, CALL_CENTER_MANAGEMENT.clientDirectory), [currentUser?.permissions]);

  useEffect(() => {
    if (isCallInteract) {
      // setSupervisor(false);
      dispatch({
        type: 'global/changeKeyTabCallcenter',
        payload: 'callInterface',
      });
      dispatch({
        type: 'callManagement/execution',
        payload: {
          isSupervisor: false,
        },
      });
    }
    // if (currentUser?.permissions?.includes(CALL_CENTER_MANAGEMENT?.scc_callcenter_supervisor)) {
    //   // if (currentUser?.username === 'sangtt9') {
    //   setSupervisor(true);
    //   dispatch({
    //     type: 'global/changeKeyTabCallcenter',
    //     payload: 'callMonitor',
    //   });
    // }
    return () => {
      dispatch({
        type: 'global/changeKeyTabCallcenter',
        payload: '',
      });
    };
  }, [currentUser.permissions, dispatch, isCallInteract]);

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
            Quản lý cuộc gọi
          </span>
          {/* <Select
            suffixIcon={<CaretDownFilled style={{ color: '#000' }} />}
            style={{ width: 200 }}
            defaultValue="available"
          >
            <Option value="available">
              <span style={{ color: '#16B14B' }}>Available</span>
            </Option>
            <Option value="break">
              <span style={{ color: '#D19E1F' }}>Break time</span>
            </Option>
            <Option value="busy">
              <span style={{ color: '#DF3638' }}>Busy</span>
            </Option>
          </Select> */}
        </Col>
        {/* <Col>
          <Input style={{ width: 500 }} placeholder="Tìm kiếm" />
        </Col> */}
        <Col span={24} style={{ border: '1px solid #f0f0f0', padding: 0 }}>
          <Tabs
            type="card"
            defaultActiveKey="callInterface"
            style={{ width: '100%' }}
            // tabBarStyle={{ padding: '5px 5px 0 5px' }}
            onTabClick={(key) => {
              dispatch({
                type: 'global/changeKeyTabCallcenter',
                payload: key,
              });
            }}
          >
            {/* {isSupervisor === null ? (
              ''
            ) : isSupervisor ? (
              <TabPane tab="Giám sát cuộc gọi" key="callInterface">
                <div className={styles['tab-container']}>

                </div>
              </TabPane>
            ) : (

            )} */}
            {isCallInteract && (
              <TabPane
                tab={'Tương tác cuộc gọi'}
                key={'callInterface'}
              // tab={isSupervisor ? 'Giám sát cuộc gọi' : 'Tương tác cuộc gọi'}
              // key={isSupervisor ? 'callMonitor' : 'callInterface'}
              >
                <div className={styles['tab-container']}>
                  <CallInterface
                    // numberCalling={numberCalling}
                    // userAgent={userAgent}
                    // stateSession={stateSession}
                    // infoCustomer={infoCustomer}
                    dispatch={dispatch}
                    headers={headers}
                    keyTabCallcenter={keyTabCallcenter}
                  />
                  {/* {isSupervisor === null ? (
                    ''
                  ) : isSupervisor ? (
                    <CallMonitor
                      // userAgent={userAgent}
                      // stateSession={stateSession}
                      dispatch={dispatch}
                      dataCallMonitor={dataCallMonitor}
                      headers={headers}
                      keyTabCallcenter={keyTabCallcenter}
                    />
                  ) : (
                    <CallInterface
                      // numberCalling={numberCalling}
                      // userAgent={userAgent}
                      // stateSession={stateSession}
                      // infoCustomer={infoCustomer}
                      dispatch={dispatch}
                      headers={headers}
                      keyTabCallcenter={keyTabCallcenter}
                    />
                  )} */}
                </div>
              </TabPane>
            )}
            {(isAllCallHistory || isPersonalCallHistory) && (
              <TabPane tab="Lịch sử cuộc gọi" key="callHistory">
                <CallHistory
                  // isSupervisor={isSupervisor}
                  isAllCallHistory={isAllCallHistory}
                  headers={headers}
                  currentUser={currentUser}
                  user={user}
                  keyTabCallcenter={keyTabCallcenter}
                />
              </TabPane>
            )}
            {isInternalDirectory && (
              <TabPane tab="Danh bạ nội bộ" key="internalContact">
                <div className={styles['tab-container']}>
                  <InternalContact headers={headers} />
                </div>
              </TabPane>
            )}
            {isClientDirectory && (
              <TabPane tab="Danh bạ khách hàng" key="customerContact">
                <div className={styles['tab-container']}>
                  <CustomerContact headers={headers} />
                </div>
              </TabPane>
            )}
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}

export default connect(({ user, callManagement, global }) => ({
  user,
  dataCallMonitor: callManagement.dataCallMonitor,
  // isSupervisor: callManagement.isSupervisor,
  keyTabCallcenter: global.keyTabCallcenter,
}))(CallManagement);
