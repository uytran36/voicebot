import React, { useState, memo, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import { Button, Row, Col, Tooltip, Tabs } from 'antd';
import { AudioOutlined, PauseOutlined, FormOutlined } from '@ant-design/icons';
import Timer from 'react-compound-timer';
import { SessionState } from 'sip.js';

import styles from './styles.less';
// import LogCall from '../../../Call_Interface/components/LogCall';
import { Talk, Speak, Untalk, Mute, Silent } from '@/components/Icons';

const { TabPane } = Tabs;

PhoneModal.propTypes = {
  handleSendDTMF: PT.func.isRequired,
  rowSelected: PT.instanceOf(Object).isRequired,
  stateSession: PT.string.isRequired,
};

const TALK_WITH_AGENT = '2';
const THREE_WAY_CALLS = '3';
const BACK = '0';
const TALK_WITH_CUSTOMER = '1';

function PhoneModal({ handleSendDTMF, rowSelected, stateSession }) {
  // const [keyTab, setKeyTab] = useState(false);
  const [isSupMode, toggleSupMode] = useState(true);
  const [isTalkWithAgent, toggleTalkWithAgent] = useState(false);
  const [isThreeWayCall, toggleThreeWayCall] = useState(false);
  const [isTalkWithCus, toggleTalkWithCus] = useState(false);

  useEffect(
    () => () => {
      toggleSupMode(false);
      toggleTalkWithCus(false);
      toggleTalkWithAgent(false);
      toggleThreeWayCall(false);
    },
    [],
  );

  const _handleSendDTMF = useCallback(
    (state, tone) => () => {
      handleSendDTMF(tone);
      switch (tone) {
        case BACK: {
          toggleSupMode(state);
          toggleTalkWithCus(false);
          toggleTalkWithAgent(false);
          toggleThreeWayCall(false);
          break;
        }
        case TALK_WITH_CUSTOMER: {
          toggleTalkWithCus(state);
          toggleSupMode(false);
          toggleTalkWithAgent(false);
          toggleThreeWayCall(false);
          break;
        }
        case TALK_WITH_AGENT: {
          toggleTalkWithAgent(state);
          toggleTalkWithCus(false);
          toggleSupMode(false);
          toggleThreeWayCall(false);
          break;
        }
        case THREE_WAY_CALLS: {
          toggleThreeWayCall(state);
          toggleTalkWithAgent(false);
          toggleTalkWithCus(false);
          toggleSupMode(false);
          break;
        }
        default:
          break;
      }
    },
    [handleSendDTMF],
  );

  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.callWrapper}>
        <div className={styles.call}>
          <div className={styles.callInfoWrapper}>
            <div className={styles.callNumber}>
              <span>
                {rowSelected?.direction === 'inbound'
                  ? rowSelected?.recipientName
                  : rowSelected?.callNumber || 'Unknown'}
              </span>
            </div>
          </div>
          <div>
            <span style={{ color: '#127ace', fontSize: 18, fontWeight: 600 }}>
              {stateSession === SessionState.Established ? (
                <div className={styles.counter}>
                  <span>
                    <Timer.Hours />
                  </span>
                  <span>
                    <Timer.Minutes />
                  </span>
                  <span>
                    <Timer.Seconds />
                  </span>
                </div>
              ) : (
                <span>Đang kết nối</span>
              )}
            </span>
          </div>
        </div>
        <div className={styles.incallFeatureWrapper}>
          <Tooltip title="Eavesdrop mode">
            <Button
              className={`${styles.incallFeature} ${
                isSupMode ? styles['current-active'] : styles.pause
              }`}
              icon={<PauseOutlined style={{ color: '#fff', fontSize: 14 }} />}
              onClick={_handleSendDTMF(true, BACK)}
            />
          </Tooltip>
          <Tooltip title="Talk with customer mode">
            {isTalkWithCus ? (
              <Button
                className={`${styles.incallFeature} ${styles['current-active']}`}
                icon={<Mute style={{ color: '#fff', fontSize: 14 }} />}
              />
            ) : (
              <Button
                onClick={_handleSendDTMF(true, TALK_WITH_CUSTOMER)}
                className={`${styles.incallFeature} ${styles.audio}`}
                icon={<AudioOutlined style={{ color: '#fff', fontSize: 14 }} />}
              />
            )}
          </Tooltip>
          <Tooltip title="Three way call mode">
            {isThreeWayCall ? (
              <Button
                className={`${styles.incallFeature} ${styles['current-active']}`}
                icon={<Untalk style={{ color: '#fff', fontSize: 18 }} />}
              />
            ) : (
              <Button
                onClick={_handleSendDTMF(true, THREE_WAY_CALLS)}
                className={`${styles.incallFeature} ${styles.talk}`}
                icon={<Talk style={{ color: '#fff', fontSize: 18 }} />}
              />
            )}
          </Tooltip>
          <Tooltip title="Talk with agent mode">
            {isTalkWithAgent ? (
              <Button
                className={`${styles.incallFeature} ${styles['current-active']}`}
                icon={<Silent style={{ color: '#fff', fontSize: 18 }} />}
              />
            ) : (
              <Button
                onClick={_handleSendDTMF(true, TALK_WITH_AGENT)}
                className={`${styles.incallFeature} ${styles.speak}`}
                icon={<Speak style={{ color: '#fff', fontSize: 18 }} />}
              />
            )}
          </Tooltip>
        </div>
      </div>
      {/* <Row gutter={[12, 0]}>
        <Col span={24}>
          <Tabs
            type="card"
            style={{ width: '100%' }}
            tabBarStyle={{ padding: '5px 5px 0 5px' }}
            onTabClick={(key) => {
              setKeyTab(Number(key));
            }}
          >
            <TabPane
              tab={
                <span style={{ fontSize: 17 }}>
                  <BarsOutlined style={{ marginRight: 10 }} />
                  Log cuộc gọi
                </span>
              }
              key="1"
            >
              <LogCall />
            </TabPane>
            <TabPane
              tab={
                <span style={{ fontSize: 17 }}>
                  <FormOutlined style={{ marginRight: 10 }} />
                  Ghi chú
                </span>
              }
              key="2"
            >
              <Note isCallMonitor={true} />
            </TabPane>
          </Tabs>
        </Col>
      </Row> */}
    </div>
  );
}

export default memo(PhoneModal);
