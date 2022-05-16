/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { Link, useIntl, connect, history } from 'umi';
import { Result, Button, message, Row, Col } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import PT from 'prop-types';
import AgentModalAnswer from '@/components/AgentModalAnswer';
import AgentModalRinging from '@/components/AgentModalRinging';
import AgentModalCallMiss from '@/components/AgentModalCallMiss';
// import UserAgent from '@/utils/sipjs';
import UserAgent from '@/utils/jssip';
import { SessionState } from 'sip.js';
import JsSIP from 'jssip';
import api from '@/api';
import styles from './BasicLayout.less';
import Timer from 'react-compound-timer';
import Modal from '@/components/Modal';
import { setupStomp, onDisconnectStomp } from '@/utils/stomp';
import { CALL_CENTER_MANAGEMENT } from '@/utils/permission';
// import ModalContextProvider from '@/components/Modal/modal';
import RootContextProvider from '@/contexts';
import { uuidv4 } from '@/utils/utils';

// eslint-disable-next-line camelcase
import logo_scc3 from '../assets/logo_3.svg';
import { StateSessionContext, NumberCallingContext, UserAgentContext } from './BasicLayoutContext';
import audio from '../assets/iphone_12.mp3';
import moment from 'moment';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    if (item.name !== 'profile') {
      const localItem = {
        ...item,
        children: item.children ? menuDataRender(item.children) : undefined,
      };
      return Authorized.check(item.authority, localItem, null);
    }
    // eslint-disable-next-line no-param-reassign
    item.name = '';
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });

BasicLayout.propTypes = {
  dispatch: PT.func.isRequired,
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]),
  settings: PT.instanceOf(Object),
  location: PT.shape({
    pathname: PT.string,
  }).isRequired,
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    authToken: PT.string,
    userId: PT.string,
    tokenGateway: PT.string,
    ext: PT.string,
    licenseModule: PT.instanceOf(Array),
  }).isRequired,
  keyTabCallcenter: PT.string,
  callManagement: PT.instanceOf(Object).isRequired,
  userAgent: PT.instanceOf(Object).isRequired,
};

BasicLayout.defaultProps = {
  children: <div />,
  settings: {},
  keyTabCallcenter: '',
};

const server = api.WS_CALL_CENTER_SERVICE;

function BasicLayout(props) {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    user,
    keyTabCallcenter,
    userAgent: userAgentModel,
    callManagement,
  } = props;
  const menuDataRef = useRef([]);
  const local = useRef();
  const remote = useRef();
  const timerController = React.useRef();
  const { numberCall: numberCalling, inbound } = callManagement;
  const { currentUser } = user;

  // const [ringingSound] = useState(new Audio(audio));
  const ringingSound = React.useMemo(() => new Audio(audio), []);
  const [ringing, setRinging] = useState(false);

  const [agentAnswer, toggleAngentAnswer] = useState(false);
  const [agentCallRinging, toggleAngentCallRinging] = useState(true);
  const [agentCallMiss, toggleAgentCallMiss] = useState(false);
  const [recall, toggleRecall] = useState(false);
  const [userAgent, setUserAgent] = useState(null);
  const [stateSession, setStateSession] = useState('');
  const [isHold, toggleHold] = useState(false);
  const [isMute, toggleMute] = useState(false);
  const [isShowPhoneCall, togglePhoneCall] = useState(true);
  const [authorized, setAuthorized] = React.useState({
    authority: undefined,
  });
  const [isOutgoing, setIsOutgoing] = useState(false);
  const { customerInfo: infoCustomer } = callManagement;

  const headers = React.useMemo(() => {
    return {
      Authorization: `${user.tokenGateway}`,
    };
  }, [user.tokenGateway]);

  const { formatMessage } = useIntl();

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  // get children authority
  // const authorized = useMemo(
  //   () => {
  //     console.log('aaa1112123',getMatchMenu(location.pathname || '/', menuDataRef.current))
  //     return getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
  //       authority: undefined,
  //     }

  //   },
  //   [location.pathname],
  // );

  const getContactUserByPhoneNumber = useCallback(
    async (phoneNumber) => {
      try {
        return dispatch({
          type: 'callManagement/getCustomerInfo',
          payload: phoneNumber,
        });
        // const res = await requestGetOmniContactListNormalizationFindInfo(headers, phoneNumber);
        // if (res.ho_va_ten || res.name) {
        //   setInfoCustomer({ sdt: phoneNumber, ...res });
        //   return null;
        // }
        // throw new Error('ERROR~');
      } catch (err) {
        return console.error(err);
        // setInfoCustomer({
        //   sdt: phoneNumber,
        // });
        // return null;
      }
    },
    [dispatch],
  );

  const updateAgentStatus = useCallback(
    (status) => {
      dispatch({
        type: 'userAgent/updateAgentStatus',
        payload: {
          agentUuid: user?.currentUser?.extension?.agentUuid || '',
          status,
        },
        headers,
      });
    },
    [dispatch, headers, user?.ext],
  );

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    const wsId = uuidv4();
    setupStomp(
      dispatch,
      user?.tokenGateway,
      user?.currentUser?.username,
      wsId,
      user?.currentUser?.id,
      user?.currentUser?.extension?.agentUuid || '',
    );
    dispatch({
      type: 'user/saveState',
      payload: {
        wsId,
      },
    });
    let _userAgent;
    if (user?.ext && user?.licenseModule?.includes('CallCenterManagement')) {
      _userAgent = new UserAgent({
        // aor: `sip:${user.ext}@sccpbx.com`,
        userAgentOptions: {
          sockets: [new JsSIP.WebSocketInterface(server)],
          uri: `sip:${user.ext}@sccpbx.com`,
          password: user?.currentUser?.extension?.password || '',
          session_timers: false, // 422 RFC 4028
          user_agent: user?.currentUser?.username || user.ext,
          register: false,
          display_name: user.ext,
          // contact_uri: `sip:${user.ext}@sccpbx.com`,
          contact_uri: new JsSIP.URI('sip', user.ext, 'sccpbx.com', null, {
            transport: 'wss',
          }).toString(),
          // register_expires: 60,
        },
        delegate: {
          // onCallRequest(num, callId) {
          //   toggleAngentAnswer(true);
          //   dispatch({
          //     type: 'callManagement/execution',
          //     payload: {
          //       callId,
          //       numberCall: num,
          //       ringingTime: moment(),
          //     },
          //   });
          //   // dispatch({
          //   //   type: 'callManagement/saveDataCallDetail',
          //   //   payload: {
          //   //     sip_call_id: callId,
          //   //   },
          //   //   headers,
          //   // });
          // },
          // onSessionInitial(_stateSession) {
          //   setStateSession(_stateSession);
          // },
          onSessionEstablishing(_stateSession) {
            setStateSession(_stateSession);
            toggleAngentCallRinging(false);
          },
          onSessionEstablished(_stateSession) {
            setStateSession(_stateSession);
          },
          onCallHangup(_stateSession) {
            console.log({ _stateSession });
            setStateSession(_stateSession);
          },
          onMissedCall(data) {
            console.log(data);
            const callId = data.message.call_id;
            const phone = data.message.from._uri._user;
            let direction = 'inbound';
            if (phone.length < 4) {
              direction = 'local';
            }
            dispatch({
              type: 'callManagement/missedCall',
              payload: {
                callId,
                phone,
                direction,
              },
            });
          },
          onCallReceived(num, callId) {
            setRinging(true);
            dispatch({
              type: 'callManagement/execution',
              payload: {
                callId,
                numberCall: num,
                ringingTime: moment(),
                inbound: true,
              },
            });
            toggleAngentCallRinging(true);
            timerController.current.reset();
          },
          onCallHold(holdState) {
            toggleHold(holdState);
          },
          onCallMute(muteState) {
            toggleMute(muteState);
          },
          onRegistered(id) {},
          onUnregistered(id) {},
          onReferAccept(request) {
            console.log(request);
          },
        },
        eventHandlers: {
          // onCallRequest
          progress(e) {
            setStateSession('Establishing');
            toggleAngentAnswer(true);
            // timerController.current.reset();
            dispatch({
              type: 'callManagement/execution',
              payload: {
                callId: e?.response?.call_id,
                numberCall: e?.response?.to?._uri?._user,
                ringingTime: moment(),
              },
            });
          },
          accepted(e) {
            console.log(e);
            setStateSession('Established');
            timerController.current.start();
          },
          failed(e) {
            console.log(e);
            // message.warning(e.cause);
            setStateSession('Terminated');
          },
          ended(e) {
            // console.log(e.originator === 'remote' ? 'Bên kia cúp máy' : 'Tự gác máy', e);
            console.log(e);
            timerController.current.stop();
            setStateSession('Terminated');
          },
        },
        mediaConstraints: { audio: true, video: false },
        media: {
          local: {
            video: local?.current,
          },
          remote: {
            video: remote?.current,
          },
        },
        pcConfig: {
          iceServers: [
            {
              // urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
              urls: [`stun:${process.env.STUN_URL || 'stun.l.google.com:19302'}`],
            },
          ],
        },
      });
      /**
       * setup access permission microphone,
       * nếu đồng ý cho kết nối sip, ngược lại disable icon phone
       */
      // _userAgent.userAgent.on('connecting', (args) => {
      //   // console.log('connecting');
      // });

      // _userAgent.userAgent.on('connected', () => {
      //   // console.log('connected');
      // });

      // _userAgent.userAgent.on('disconnected', () => {
      //   // console.log('disconnected');
      // });

      _userAgent.userAgent.on('registered', (e) => {
        togglePhoneCall(true);
        message.success(`Start receiving incoming call.`);
      });

      _userAgent.userAgent.on('registrationFailed', (e) => {
        togglePhoneCall(false);
        message.warning(`Registeration failed.`);
      });

      _userAgent.userAgent.on('unregistered', (e) => {
        togglePhoneCall(false);
        message.warning(`Stop receiving incoming call.`);
      });

      _userAgent.userAgent.on('newMessage', (e) => message.warning('newMessage'));
      // setUserAgent(_userAgent);
      // get status sipjs
      // dispatch({
      //   type: 'userAgent/fetchAgentStatus',
      //   payload: {
      //     ext: user.ext,
      //   },
      //   headers,
      // });
      if (
        navigator?.mediaDevices &&
        currentUser?.permissions?.includes(CALL_CENTER_MANAGEMENT.callInteract)
      ) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(() => {
            // console.log('connect');
            _userAgent.connect();
            _userAgent.userAgent.register();
            setUserAgent(_userAgent);
            // get status sipjs
            dispatch({
              type: 'userAgent/fetchAgentStatus',
              payload: {
                agentId: user?.currentUser?.extension?.agentUuid,
              },
              headers,
            });
          })
          .catch((err) => {
            console.error(err.toString());
            // có lỗi sẽ hủy đăng ký
            _userAgent.userAgent.unregister();
            togglePhoneCall(false);
          });
      }
    } else {
      togglePhoneCall(false);
    }
    return () => {
      // disconnect when logout
      if (_userAgent) {
        _userAgent?.disconnect();
      }
      onDisconnectStomp();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.username, user.ext]);

  useEffect(() => {
    switch (stateSession) {
      case 'Initial': {
        // console.log('callingggg')
        // toggleAgentCall(false);
        // toggleAngentAnswer(true);
        timerController.current.reset();
        break;
      }
      case 'Establishing': {
        timerController.current.reset();
        break;
      }
      // answer call inbound
      case 'Established': {
        setRinging(false);
        dispatch({
          type: 'callManagement/execution',
          payload: {
            answeringTime: moment(),
          },
        });
        toggleAngentAnswer(true);
        timerController.current.start();
        break;
      }
      case 'Terminating':
      case 'Terminated': {
        // kết thúc session...
        setRinging(false);
        toggleAngentAnswer(false);
        toggleAngentCallRinging(false);
        setIsOutgoing(false);
        // getNumber('');
        setStateSession('');
        toggleHold(false);
        toggleMute(false);
        timerController.current.stop();
        dispatch({
          type: 'callManagement/execution',
          payload: {
            answeringTime: '',
            ringingTime: '',
            numberCall: '',
            customerInfo: {},
            newCustomer: false,
            inbound: false,
            callId: '',
          },
        });
        // message.info('Cuộc gọi đã kết thúc.');
        break;
      }
      default:
        break;
    }
  }, [stateSession]);

  useEffect(() => {
    if (numberCalling?.length > 0) {
      getContactUserByPhoneNumber(numberCalling);
    }
  }, [numberCalling, getContactUserByPhoneNumber]);

  useEffect(() => {
    if (ringing) {
      ringingSound.play();
    } else {
      ringingSound.pause();
      ringingSound.currentTime = 0;
    }
  }, [ringing]);

  const handleCall = useCallback(
    async (number, options) => {
      try {
        // setNumberCalling(number);
        setIsOutgoing(true);
        userAgent.call(number, options);
        // message.loading('Đang thực hiện cuộc gọi.');
      } catch (err) {
        message.warning('Không thể thực hiện cuộc gọi vào lúc này.');
        toggleAngentAnswer(false);
        toggleAngentCallRinging(false);
        setIsOutgoing(false);
        // setNumberCalling('');
        setStateSession('');
        timerController.current.stop();
        toggleHold(false);
        toggleMute(false);
        console.error(err);
      }
    },
    [userAgent],
  );

  const handleAnswer = useCallback(async () => {
    try {
      // await userAgent.answer();
      toggleAngentCallRinging(false);
      toggleAngentAnswer(true);
    } catch (err) {
      // message.error(err.toString());
    }
  }, [userAgent]);

  const handleHangup = useCallback(async () => {
    try {
      toggleAngentAnswer(false);
      userAgent.hangup();
    } catch (err) {
      toggleAngentAnswer(false);
      toggleAngentCallRinging(false);
      setIsOutgoing(false);
      // setNumberCalling('');
      setStateSession('');
      timerController.current.stop();
      toggleHold(false);
      toggleMute(false);
      console.error(err);
    }
  }, [userAgent]);

  const handleDecline = useCallback(async () => {
    try {
      // await userAgent.decline();
      if (recall) {
        toggleRecall(false);
      } else {
        toggleAngentCallRinging(false);
      }
    } catch (err) {
      // message.error(err.toString());
    }
  }, [userAgent, recall]);

  const handleHold = useCallback(async () => {
    try {
      userAgent.hold();
    } catch (err) {
      // message.error(err.toString());
    }
  }, [userAgent]);

  const handleUnhold = useCallback(async () => {
    try {
      userAgent.unhold();
    } catch (err) {
      // message.error(err.toString());
    }
  }, [userAgent]);

  const handleMute = useCallback(async () => {
    try {
      userAgent.mute();
    } catch (err) {
      // message.error(err.toString());
    }
  }, [userAgent]);

  const handleUnmute = useCallback(async () => {
    try {
      userAgent.unmute();
    } catch (err) {
      // message.error(err.toString());
    }
  }, [userAgent]);

  const handleSendDTMF = useCallback(
    async (tone) => {
      try {
        await userAgent.sendDTMF(tone);
      } catch (err) {
        // message.error(err.toString());
      }
    },
    [userAgent],
  );

  const handleTransfer = useCallback(
    async (number) => {
      try {
        userAgent.transfer(`sip:${number}@sccpbx.com`);
      } catch (err) {
        // message.error(err.toString());
      }
    },
    [userAgent],
  );

  const menuDataRenderCallback = React.useCallback(
    (menuList) => {
      const currentMenu = getMatchMenu(location.pathname || '/', menuList).pop();
      setTimeout(() => {
        setAuthorized(currentMenu || { authority: undefined });
      }, 0);
      return menuDataRender(menuList);
    },
    [location.pathname],
  );

  return (
    <ProLayout
      // eslint-disable-next-line camelcase
      logo={
        process.env.ENV === 'local' || process.env.ENV === 'dev' ? (
          logo_scc3
        ) : (
          <div style={{ display: 'none' }}></div>
        )
      }
      formatMessage={formatMessage}
      {...props}
      {...settings}
      onCollapse={handleMenuCollapse}
      title={'Voicebot Campaign'}
      // pageTitleRender={(_, title) => {
      //   if (typeof title === 'string') {
      //     return `${title.split('-')[0]} - Voicebot Campaign`;
      //   }
      //   return 'Voicebot Campaign';
      // }}
      menuHeaderRender={(logo, title) => {
        if (process.env.ENV === 'local' || process.env.ENV === 'dev') {
          return logo;
        } else {
          return <div style={{ display: 'block', margin: '0px 0px 0px -5px' }}>{title}</div>;
        }
      }}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      // footerRender={() => defaultFooterDom}
      // menuDataRender={() => menuData}
      menuDataRender={menuDataRenderCallback}
      rightContentRender={() => (
        <RightContent
          call={handleCall}
          isShowPhoneCall={isShowPhoneCall}
          userAgentModel={userAgentModel}
          updateAgentStatus={updateAgentStatus}
          handleSendDTMF={handleSendDTMF}
          callManagement={callManagement}
        />
      )}
      postMenuData={(_menuData) => {
        menuDataRef.current = _menuData || [];
        return _menuData || [];
      }}
      // menu={{ defaultOpenAll: false }}
      headerContentRender={() => (
        <Row>
          <Col xs={0} sm={0} md={24}>
            <PageContainer
              title={false}
              content={false}
              extraContent={false}
              className={styles['page-container']}
              pageHeaderRender={(p) => {
                if (!p.breadcrumb.routes || p.breadcrumb.routes.length === 0) {
                  return '';
                }
                // cho page trang chủ.
                if (p.breadcrumb.routes.length === 2) {
                  p.breadcrumb.routes.shift();
                }

                return p.breadcrumb.routes.map((route) => {
                  const isLastItem =
                    p.breadcrumb.routes.indexOf(route) === p.breadcrumb.routes.length - 1;
                  if (!route.component && route.path.length > 1 && !isLastItem) {
                    return (
                      <Link to="" key={route.path}>
                        {route.breadcrumbName}
                      </Link>
                    );
                  }
                  if (route.path.length === 1 && !isLastItem) {
                    return (
                      <Link to={route.path} key={route.path}>
                        {route.breadcrumbName}
                      </Link>
                    );
                  }
                  return (
                    <span key={route.path} className={styles['current-page']}>
                      {route.breadcrumbName}
                    </span>
                  );
                });
              }}
            />
          </Col>
        </Row>
      )}
    >
      <RootContextProvider>
        <Timer
          startImmediately={false}
          formatValue={(value) => `${value < 10 ? `0${value}` : value} `}
        >
          {(control) => {
            timerController.current = control;
            return (
              <>
                {agentCallMiss && (
                  <AgentModalCallMiss
                    toggleAgentCallMiss={toggleAgentCallMiss}
                    toggleRecall={toggleRecall}
                  />
                )}
                {recall && (
                  <AgentModalRinging
                    type="recall"
                    decline={handleDecline}
                    answer={handleAnswer}
                    transfer={handleTransfer}
                    numberCalling={numberCalling}
                    infoCustomer={infoCustomer}
                  />
                )}
                {agentCallRinging && keyTabCallcenter !== 'callInterface' && (
                  <AgentModalRinging
                    type="ringing"
                    toggleAgentCallMiss={toggleAgentCallMiss}
                    decline={handleDecline}
                    answer={handleAnswer}
                    transfer={handleTransfer}
                    numberCalling={numberCalling}
                    infoCustomer={infoCustomer}
                  />
                )}
                {agentAnswer && keyTabCallcenter !== 'callInterface' && (
                  <AgentModalAnswer
                    stateSession={stateSession}
                    numberCalling={numberCalling}
                    infoCustomer={infoCustomer}
                    isHold={isHold}
                    isMute={isMute}
                    hold={handleHold}
                    unhold={handleUnhold}
                    mute={handleMute}
                    unmute={handleUnmute}
                    transfer={handleTransfer}
                    hangup={handleHangup}
                    headers={headers}
                    inbound={inbound}
                  />
                )}
                <Authorized authority={authorized.authority} noMatch={noMatch}>
                  {/* {children} */}
                  {React.Children.map(children, (child) => {
                    if (
                      (location.pathname.includes('call_management') ||
                        location.pathname.includes('monitor')) &&
                      React.isValidElement(child)
                    ) {
                      return (
                        <UserAgentContext.Provider
                          value={{
                            isHold,
                            isMute,
                            handleCall,
                            handleDecline,
                            handleAnswer,
                            handleHangup,
                            handleHold,
                            handleUnhold,
                            handleMute,
                            handleUnmute,
                            handleTransfer,
                            handleSendDTMF,
                            isOutgoing,
                          }}
                        >
                          <StateSessionContext.Provider value={stateSession}>
                            <NumberCallingContext.Provider
                              value={{
                                numberCalling,
                                infoCustomer,
                              }}
                            >
                              {child}
                            </NumberCallingContext.Provider>
                          </StateSessionContext.Provider>
                        </UserAgentContext.Provider>
                      );
                    }
                    return child;
                  })}
                </Authorized>
                <div style={{ display: 'none' }}>
                  <video playsInline ref={remote} autoPlay />
                  <video playsInline ref={local} muted />
                </div>
                <Modal />
              </>
            );
          }}
        </Timer>
      </RootContextProvider>
    </ProLayout>
  );
}

export default connect(({ global, settings, user, userAgent, callManagement }) => ({
  collapsed: global.collapsed,
  settings,
  user,
  userAgent,
  keyTabCallcenter: global.keyTabCallcenter,
  callManagement,
}))(React.memo(BasicLayout));
