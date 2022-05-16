import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './styles.less';
import { Row, Col, Button, Tooltip, Card } from 'antd';
import {
  PhoneFilled,
  PauseOutlined,
  AudioFilled,
  BarsOutlined,
  FormOutlined,
  CaretRightFilled,
} from '@ant-design/icons';
import LogCall from './components/LogCall';
import PT from 'prop-types';
// import { truncate } from 'lodash';
import { SessionState } from 'sip.js';
import { Mute } from '@/components/Icons';
import TransferButton from '@/components/TransferButton';
import DeclineButton from '@/components/DeclineButton';
import Timer from 'react-compound-timer';
import {
  StateSessionContext,
  NumberCallingContext,
  UserAgentContext,
} from '@/layouts/BasicLayoutContext';
import { NoteForm, onSaveNote } from '@/components/NoteCall';
import { NoteContext, NoteUpdateContext } from '@/contexts/note.context';

/**
 * Render Call interface component.
 * @param {Object} userAgent - userAgent class with methods: call, decline, answer,... detail see at @/utils/sipjs.js.
 * @param {String} stateSession - status of session sipjs.
 * @return {Component}
 */
CallInterface.propTypes = {
  headers: PT.instanceOf(Object).isRequired,
  dispatch: PT.func.isRequired,
  keyTabCallcenter: PT.string.isRequired,
};

function CallInterface({ headers, dispatch, keyTabCallcenter }) {
  const formRef = useRef(null); // ~antd form v4
  const {
    isHold,
    isMute,
    isOutgoing,
    handleAnswer,
    handleDecline,
    handleHangup,
    handleHold,
    handleUnhold,
    handleMute,
    handleUnmute,
    handleTransfer,
    inbound,
  } = useContext(UserAgentContext);
  const stateSession = useContext(StateSessionContext);
  const { numberCalling, infoCustomer } = useContext(NumberCallingContext);
  const valueNotes = React.useContext(NoteContext);
  const setValuesNote = React.useContext(NoteUpdateContext);

  const [clickCall, setClickCall] = useState(false);
  const [isPickupPhone, togglePickupPhone] = useState(false);

  useEffect(() => {
    switch (stateSession) {
      case SessionState.Initial: {
        break;
      }
      case SessionState.Establishing: {
        // disable action at phone icon
        togglePickupPhone(false);
        break;
      }
      case SessionState.Established: {
        setClickCall(true);
        togglePickupPhone(false);
        break;
      }
      case SessionState.Terminating:
      case SessionState.Terminated: {
        // kết thúc session...
        setClickCall(false);
        if (keyTabCallcenter === 'callInterface') {
          onSaveNote({ values: valueNotes, headers }, () => {
            setValuesNote({})
          });
          // formRef?.current?.submit(); // save form note
        }
        break;
      }
      default:
        break;
    }
  }, [stateSession, keyTabCallcenter, valueNotes, headers, setValuesNote]);

  if (numberCalling && numberCalling.length > 0) {
    return (
      <div className={styles.container}>
        <div className={styles.callWrapper}>
          <div className={styles.call}>
            <div className={styles.callInfoWrapper}>
              <div className={styles.circleWrapper}>
                <div className={styles.circle} />
                {/* <img src="./avatar_cute.jpg" alt="" /> */}
              </div>
              <div className={styles.callInfo}>
                <div className={styles.callName}>
                  <span>{Object.keys(infoCustomer).length ? infoCustomer.name : 'Unknow'}</span>
                </div>
                <div className={styles.callNumber}>
                  <span>{numberCalling}</span>
                </div>
              </div>
            </div>
            {!clickCall ? (
              <div className={styles.callFeatureWrapper}>
                {isOutgoing ? (
                  <span>Đang kết nối</span>
                ) : (
                  <>
                    <Tooltip title="Answer">
                      <Button
                        loading={isPickupPhone}
                        className={`${styles.callFeature} ${styles.phone}`}
                        onClick={() => {
                          handleAnswer();
                          togglePickupPhone(true);
                        }}
                        icon={<PhoneFilled style={{ fontSize: 14 }} />}
                      />
                    </Tooltip>
                    {/* <TransferButton handleSelectStaff={handleTransfer} /> */}
                    <DeclineButton title="Decline" onClick={handleDecline} />
                  </>
                )}
              </div>
            ) : (
              <div>
                <span style={{ color: '#127ace', fontSize: 18, fontWeight: 600 }}>
                  {stateSession === SessionState.Established && (
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
                  )}
                </span>
              </div>
            )}
          </div>
          {clickCall && (
            <div className={styles.incallFeatureWrapper}>
              <Tooltip title={`${!isHold ? 'Hold' : 'Unhold'}`}>
                {isHold ? (
                  <Button
                    onClick={handleUnhold}
                    size="large"
                    shape="circle"
                    type="primary"
                    icon={<CaretRightFilled />}
                    // hidden={inbound}
                  />
                ) : (
                  <Button
                    onClick={handleHold}
                    size="large"
                    shape="circle"
                    type="primary"
                    icon={<PauseOutlined />}
                    // hidden={inbound}
                  />
                )}
              </Tooltip>
              <Tooltip title={`${!isMute ? 'Mute' : 'Unmute'}`}>
                {isMute ? (
                  <Button
                    onClick={handleUnmute}
                    size="large"
                    shape="circle"
                    type="primary"
                    icon={<Mute />}
                  />
                ) : (
                  <Button
                    onClick={handleMute}
                    size="large"
                    shape="circle"
                    type="primary"
                    icon={<AudioFilled />}
                  />
                )}
              </Tooltip>
              <TransferButton size="large" handleSelectStaff={handleTransfer} />
              <DeclineButton size="large" title="Hangup" onClick={handleHangup} />
            </div>
          )}
        </div>
        {clickCall && (
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Card
                title={
                  <span style={{ fontSize: 17, fontWeight: 'bold' }}>
                    <BarsOutlined style={{ marginRight: 10 }} />
                    Log cuộc gọi
                  </span>
                }
                style={{ height: '100%' }}
              >
                <LogCall headers={headers} />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title={
                  <span style={{ fontSize: 17, fontWeight: 'bold' }}>
                    <FormOutlined style={{ marginRight: 10 }} />
                    Ghi Chú
                  </span>
                }
              >
                {keyTabCallcenter === 'callInterface' &&
                  <NoteForm
                    isCallMonitor={false}
                    valueNotes={valueNotes}
                  />
                }
              </Card>
            </Col>
          </Row>
        )}
      </div>
    );
  }
  return <div className={styles.container}></div>;
}

export default CallInterface;
