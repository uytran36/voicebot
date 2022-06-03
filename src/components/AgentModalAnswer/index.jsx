import React, { useState, Fragment, useCallback, useRef, useEffect } from 'react';
import PT from 'prop-types';
import { SessionState } from 'sip.js';
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  PhoneFilled,
  EditFilled,
  ClockCircleFilled,
  CloseOutlined,
} from '@ant-design/icons';
import { Row, Col, Image, Button, Tooltip, Timeline } from 'antd';
import History from './History';
import style from './style.less';
import Timer from 'react-compound-timer';
import avatarCall from '@/assets/avatar_incoming_call.png';
import { PlayPause, Microphone, MicrophoneSlash, CallOutboundIcon } from '@/components/Icons';
import { NoteForm, onSaveNote } from '@/components/NoteCall';
import { NoteContext, NoteUpdateContext } from '@/contexts/note.context';

ModalAnswer.propTypes = {
  hold: PT.func.isRequired,
  unhold: PT.func.isRequired,
  mute: PT.func.isRequired,
  unmute: PT.func.isRequired,
  transfer: PT.func.isRequired,
  hangup: PT.func.isRequired,
  numberCalling: PT.string.isRequired,
  infoCustomer: PT.instanceOf(Object).isRequired,
  stateSession: PT.string.isRequired,
  isMute: PT.bool.isRequired,
  isHold: PT.bool.isRequired,
  inbound: PT.bool.isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  keyTabCallcenter: PT.string.isRequired,
  dispatch: PT.func.isRequired,
};

function ModalAnswer({
  stateSession,
  hold,
  unhold,
  mute,
  unmute,
  hangup,
  numberCalling,
  infoCustomer,
  isMute,
  isHold,
  headers,
  keyTabCallcenter,
}) {
  // const formRef = useRef(null); // ~antd form v4
  const valueNotes = React.useContext(NoteContext);
  const setValuesNote = React.useContext(NoteUpdateContext);

  const [ult, setUlt] = useState('note');
  const [itemRight, toggleItemRight] = useState(false);
  const [isFullscreen, toggleFullscreen] = useState(false);

  const handleEndCall = useCallback(() => {
    hangup();
    // console.log(controller)
    // controller?.current?.stop();
  }, [hangup]);

  useEffect(() => {
    switch (stateSession) {
      case SessionState.Initial: {
        break;
      }
      case SessionState.Terminating:
      case SessionState.Terminated: {
        // kết thúc session...
        if (keyTabCallcenter !== 'callInterface') {
          onSaveNote({ values: valueNotes, headers }, () => {
            setValuesNote({});
          });
          // formRef?.current?.submit(); // save form note
        }
        break;
      }
      default:
        break;
    }
  }, [stateSession, keyTabCallcenter, valueNotes, headers, setValuesNote]);

  return (
    <Fragment>
      {
        <div
          className={`${style['answer-container']} ${
            !isFullscreen && style['answer-container-mini-size']
          }`}
        >
          <Row className={style['answer-container-header']}>
            {isFullscreen && (
              <>
                <Col span={1}>
                  <CallOutboundIcon />
                </Col>
                <Col span={3}>Cuộc gọi ra</Col>
              </>
            )}
            <Col span={19}>Đang đổ chuông</Col>
            <Col span={isFullscreen ? 1 : 5} style={{ textAlign: 'right' }}>
              {isFullscreen ? (
                <FullscreenExitOutlined
                  onClick={() => {
                    setUlt('');
                    toggleItemRight(false);
                    toggleFullscreen(!isFullscreen);
                  }}
                />
              ) : (
                <FullscreenOutlined
                  style={{ fontSize: 19, color: '#fff', marginLeft: 20 }}
                  onClick={() => {
                    setUlt('');
                    toggleItemRight(false);
                    toggleFullscreen(!isFullscreen);
                  }}
                />
              )}
            </Col>
          </Row>
          <Row className={style['answer-container-body']}>
            <Col
              span={itemRight ? 15 : !isFullscreen ? 24 : 22}
              className={style['answer-containder-body-detail']}
            >
              <div className={style['answer-info']}>
                <Image
                  width={isFullscreen ? 132 : 100}
                  preview={false}
                  height={isFullscreen ? 132 : 90}
                  alt="avatar call"
                  src={avatarCall}
                />
                <div>
                  <h3 className={style['answer-info-user']}>
                    {numberCalling || 'Nguyễn Thu Hương'}
                  </h3>
                  <div className={style['answer-info-user-number']}>
                    {Object.keys(infoCustomer).length ? infoCustomer.name : '0961 234 567'}
                  </div>
                  <p className={style['answer-info-campaign']}>{'Chiến dịch 1'}</p>
                </div>
              </div>
              <div className={style['answer-actions']}>
                <span className={style['answer-actions-calling']}>
                  <Button
                    size="large"
                    shape="circle"
                    type="primary"
                    onClick={isHold ? unhold : hold}
                    icon={
                      <PlayPause
                        disabled
                        style={{ color: '#fff' }}
                        paused={isHold ? 'play' : 'paused'}
                      />
                    }
                  />

                  <Button
                    onClick={isMute ? unmute : mute}
                    size="large"
                    shape="circle"
                    type="primary"
                    icon={isMute ? <MicrophoneSlash /> : <Microphone />}
                  />

                  <Button
                    onClick={handleEndCall}
                    size="large"
                    shape="circle"
                    type="primary"
                    icon={<PhoneFilled rotate={225} />}
                  />
                </span>
              </div>
            </Col>
            {itemRight && (
              <Col span={7} style={{ background: 'rgba(255, 255, 255, 0.07)' }}>
                {ult === 'history' && (
                  <div>
                    <Row style={{ padding: '16px 16px 0px 16px' }}>
                      <Col span={22}>
                        <div
                          span={24}
                          style={{
                            color: '#fff',
                            fontSize: 16,
                            padding: '5px 8px',
                            textAlign: 'center',
                          }}
                        >
                          <span>Lịch sử</span>
                        </div>
                      </Col>
                      <Col span={2} style={{ margin: 'auto' }}>
                        <CloseOutlined
                          style={{ color: '#FFFFFF', textAlign: 'center' }}
                          onClick={() => toggleItemRight(false)}
                        />
                      </Col>
                    </Row>
                    <History />
                  </div>
                )}
                {ult === 'note' && (
                  <>
                    <Row style={{ padding: '16px 16px 0px 16px' }}>
                      <Col span={22}>
                        <div
                          span={24}
                          style={{
                            color: '#fff',
                            fontSize: 16,
                            padding: '5px 8px',
                            textAlign: 'center',
                          }}
                        >
                          <span>Ghi chú</span>
                        </div>
                      </Col>
                      <Col span={2} style={{ margin: 'auto' }}>
                        <CloseOutlined
                          style={{ color: '#FFFFFF', textAlign: 'center' }}
                          onClick={() => toggleItemRight(false)}
                        />
                      </Col>
                    </Row>
                    <NoteForm
                      layout={{ span: 24 }}
                      labelFormItemClassName={style['label-form-item']}
                      isCallMonitor={false}
                      valueNotes={valueNotes}
                    />
                  </>
                )}
              </Col>
            )}
            {isFullscreen && (
              <Col span={2}>
                <span className={style['answer-actions-info']}>
                  <Tooltip title="Ghi chú">
                    <Button
                      size="large"
                      shape="circle"
                      type="primary"
                      icon={<EditFilled />}
                      // disabled
                      onClick={() => {
                        setUlt('note');
                        toggleItemRight(true);
                      }}
                      className={ult === 'note' && style['button-active']}
                    />
                  </Tooltip>
                  <Tooltip title="Lịch sử gọi">
                    <Button
                      size="large"
                      shape="circle"
                      type="primary"
                      icon={<ClockCircleFilled />}
                      onClick={() => {
                        setUlt('history');
                        toggleItemRight(true);
                      }}
                      className={ult === 'history' && style['button-active']}
                    />
                  </Tooltip>
                </span>
              </Col>
            )}
          </Row>
        </div>
      }
    </Fragment>
  );
}

export default React.memo(ModalAnswer);
