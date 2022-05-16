/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
import {
  UserAgent,
  SessionState,
  Inviter,
  UserAgentState,
  Registerer,
  RegistererState,
  Invitation,
  RequestPendingError,
} from 'sip.js';
import { Transport } from 'sip.js/lib/platform/web';
import { SessionDescriptionHandler } from 'sip.js/lib/platform/web/session-description-handler';

// ⇩⇩⇩ helper functions defined here ⇩⇩⇩
const handleError = (err) => {
  console.error(err.toString());
};
const handleLog = (log) => console.log(log.toString());
const handleWarn = (warn) => console.warn(warn.toString());

const setupLocalMedia = (session, options, id) => {
  if (!session) {
    return handleError('Session does not exist.');
  }
  const mediaElm = options?.media?.local?.video;
  if (mediaElm) {
    const localStream = session?.sessionDescriptionHandler?.localMediaStream;
    if (!localStream) {
      handleError('Local media stream undefined.');
    }
    mediaElm.srcObject = localStream;
    mediaElm.volumn = 0;
    mediaElm.play().catch((err) => {
      handleError(`[${id}] failed to play local media: ${{ err }}`);
    });
  }
  return null;
};

const setupRemoteMedia = (session, options, id) => {
  if (!session) {
    return handleError('Session does not exist.');
  }
  const mediaElm = options?.media?.remote?.video || options?.media?.remote?.audio;

  if (mediaElm) {
    const remoteStream = session?.sessionDescriptionHandler?.remoteMediaStream;
    if (!remoteStream) {
      handleError('Remote media stream undefined.');
    }
    // console.log(remoteStream)
    mediaElm.autoplay = true;
    mediaElm.srcObject = remoteStream;
    mediaElm.play().catch((err) => {
      handleError(`[${id}] failed to play remote media: ${{ err }}`);
    });
    mediaElm.onaddtrack = () => {
      mediaElm.load();
      mediaElm.play().catch((err) => {
        console.log(`[${id}] failed to play remote media: ${{ err }}`);
      });
    };
  }
  return null;
};

const cleanupMedia = (options) => {
  if (options && options.media) {
    const local = options.media?.local;
    const remote = options.media?.remote;

    if (local) {
      local.video.srcObject = null;
      local.video.pause();
    }
    if (remote) {
      if (remote.audio) {
        remote.audio.srcObject = null;
        remote.audio.pause();
      }
      if (remote.video) {
        remote.video.srcObject = null;
        remote.video.pause();
      }
    }
  }
};

const sendInvite = (inviter, inviterInviteOptions, options) => {
  console.log('/////////////////////', inviter, inviterInviteOptions, options);
  return inviter.invite(inviterInviteOptions).then(() => {
    console.log('Send invite');
  });
};

const enableReceiverTracks = (enable = false, session) => {
  if (!session) {
    handleError('Session does not exist.');
  }
  const { sessionDescriptionHandler } = session;
  if (!(sessionDescriptionHandler instanceof SessionDescriptionHandler)) {
    handleError("Session's session description handler not instance of SessionDescriptionHandler.");
  }
  const { peerConnection } = sessionDescriptionHandler;
  if (!peerConnection) {
    handleError('Peer connection closed.');
  }
  const getReceivers = peerConnection.getReceivers();
  getReceivers.forEach((receiver) => {
    if (receiver.track) {
      receiver.track.enabled = enable;
    }
  });
};

const enableSenderTracks = (enable = false, session) => {
  if (!session) {
    handleError('Session does not exist.');
  }
  const { sessionDescriptionHandler } = session;
  if (!(sessionDescriptionHandler instanceof SessionDescriptionHandler)) {
    handleError("Session's session description handler not instance of SessionDescriptionHandler.");
  }

  const { peerConnection } = sessionDescriptionHandler;
  if (!peerConnection) {
    handleError('Peer connection closed.');
  }

  peerConnection.getSenders().forEach((sender) => {
    if (sender.track) {
      sender.track.enabled = enable;
    }
  });
};

// ⇩⇩⇩ main class ⇩⇩⇩
export default class UA {
  constructor(server, options = {}) {
    this.attemptingReconnection = false;
    this.connectRequested = false;
    this.held = false;
    this.muted = false;
    this.options = {
      ...options,
    };
    this._register = undefined;
    this.registerRequest = false;
    this.session = undefined;
    this.userAgent = undefined;
    this.delegate = options?.delegate;
    this.userAgentOptions = options?.userAgentOptions || {};

    if (!this.userAgentOptions.transportConstructor) {
      this.userAgentOptions.transportConstructor = Transport;
    }

    if (!this.userAgentOptions.transportOptions) {
      this.userAgentOptions.transportOptions = {
        server,
      };
    }

    if (!this.userAgentOptions.uri) {
      if (options.aor) {
        const uri = UserAgent.makeURI(options.aor);
        if (!uri) {
          handleError(`Failed to create a vaild URI from ${options.uri}`);
        }
        this.userAgentOptions.uri = uri;
      }
    }

    // make user agent
    this.userAgent = new UserAgent(this.userAgentOptions);
    this.userAgent.delegate = {
      // handle connect khi server established
      onConnect: () => {
        if (this.delegate?.onServerConnect) {
          this.delegate.onServerConnect();
        }
        if (this._register && this.registerRequest) {
          this._register.register().catch((err) => {
            handleError(err.toString());
          });
        }
      },
      // handle disconnect khi server mất kết nối
      onDisconnect: (error) => {
        if (this.delegate.onServerDisconnect) {
          this.delegate.onServerDisconnect(error);
        }
        if (this.session) {
          // clear session...
          this.hangup();
        }
        if (this._register) {
          this._register.unregister().catch((err) => {
            handleError(err.toString());
          });
        }
        if (error) {
          // maybe handle reconnection...
          handleError(error);
          this.attemptReconnection();
        }
      },
      // handle incoming invitations
      onInvite: (invitation) => {
        console.log('////////////////////////////////',{invitation})
        // console.log({invitation})
        // hiện tại chỉ hỗ trợ 1 session trong 1 thời điểm
        // tuy nhiên, invite request có thể được nhận bất cứ lúc nào.
        // vì vậy ta cần phải reject bất kỳ lời mời nào.
        const referralInviterOptions = {
          sessionDescriptionHandlerOptions: { constraints: this.constraints },
        };
        if (this.session) {
          invitation.accept().then(() => {
            this.initSession(invitation, referralInviterOptions);
            // sendInvite(referral.makeInviter(_referralInviterOptions))
          });
          // invitation.reject().then(() => {
          //     handleError(`[${this.id}] reject INVITE`)
          // }). catch(err => {
          //     handleError(`[${this.id}] failed to reject INVITE`)
          //     handleError(err.toString())
          // })
          this.initSession(invitation, referralInviterOptions);
          return null;
        }
        // const referralInviterOptions = {
        //   sessionDescriptionHandlerOptions: { constraints: this.constraints },
        // };
        this.initSession(invitation, referralInviterOptions);
        if (this.delegate?.onCallReceived) {
          console.log('/////////////////////////////////////////',this.delegate);
          this.delegate.onCallReceived(invitation);
        } else {
          // invitation
          //   .reject()
          //   .then(() => {
          //     handleLog(`[${this.id}] rejected INVITE`);
          //   })
          //   .catch((err) => {
          //     handleError(err.toString());
          //   });
        }
        return null;
      },
      onMessage: (message) => {
        console.log({ message });
        message.accept().then(() => {
          if (this.delegate && this.delegate.onMessageReceived) {
            this.delegate.onMessageReceived(message.request.body);
          }
        });
      },
      onRefer: (referral) => {
        console.log({ referral });
      },
    };
    window.addEventListener('online', () => {
      handleLog(`[${this.id}] online`);
      this.attemptReconnection();
    });
  }

  /**
   * ⇩⇩⇩ Other functions must be defined down here ⇩⇩⇩
   * ⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩
   */
  /**
   * initial session.
   * @param _session - invite session to setup
   * @param _referralInviterOptions - options for any inviter created as result of a refer
   */
  initSession(_session, _referralInviterOptions) {
    // set session
    this.session = _session;
    // call session created.
    if (this.delegate.onCallCreated) {
      this.delegate.onCallCreated();
    }
    // setup session state changed
    this.session.stateChange.addListener((state) => {
      if (this.session !== _session) {
        // nếu session đã thay đổi, return null;
        return null;
      }
      console.log({ state });
      // console.log(this.delegate)
      switch (state) {
        case SessionState.Initial: {
          break;
        }
        case SessionState.Establishing: {
          if (this.delegate?.onCallRequest) {
            this.delegate.onCallRequest(state);
          }
          break;
        }
        case SessionState.Established: {
          setupLocalMedia(this.session, this.options, this.id);
          setupRemoteMedia(this.session, this.options, this.id);
          if (this.delegate?.onCallAnswered) {
            this.delegate.onCallAnswered(state);
          }
          break;
        }
        case SessionState.Terminating:
        case SessionState.Terminated: {
          this.session = undefined;
          cleanupMedia(this.options);
          if (this.delegate?.onCallHangup) {
            this.delegate.onCallHangup(state);
          }
          break;
        }
        default:
          handleError('Unknow session state');
      }
      return null;
    });
    // setup delegate
    this.session.delegate = {
      onInfo: (info) => {
        console.log({ info });
        // no delegate
        // if(this.delegate.onCallDTMFReceived === undefined) {
        //     info.reject();
        //     return null;
        // }
        // // invalid content type
        // const contentType = info.request.getHeader('content-type');
        // if(!contentType) {
        //     info.reject();
        //     return null;
        // }
        // // invalid body
        // const body = info.request.body.split('\r\n', 2);
        // if(body.length !== 2) {
        //     info.reject()
        //     return null;
        // }
        // // invalid tone
        // let tone = undefined
        // const toneRegExp = /^(Signal\s*?=\s*?)([0-9A-D#*]{1})(\s)?.*/
        // if(toneRegExp.test(body[0])) {
        //     tone = body[0].replace(toneRegExp, '$2');
        // }
        // if(!tone) {
        //     info.reject()
        //     return null;
        // }
      },
      onRefer: (referral) => {
        console.log({ referral });
        referral.accept().then(() => {
          this.initSession(referral.makeInviter(_referralInviterOptions), _referralInviterOptions);
          sendInvite(referral.makeInviter(_referralInviterOptions));
        });
      },
    };
  }

  /**
   * End a session
   * Send a bye request, cancel request, reject response to end the current session.
   * use onCallTerminated delegate method to determine if and when session is terminated.
   */
  terminated() {
    if (!this.session) {
      handleError('Session does not exist.');
      return null;
    }
    // console.log('this.session.state', this.session.state)
    switch (this.session.state) {
      case SessionState.Initial: {
        if (this.session instanceof Inviter) {
          return this.session.cancel().then(() => {
            handleLog(`[${this.id}] inviter nerver send INVITE canceled`);
          });
        }
        if (this.session instanceof Invitation) {
          return this.session.reject().then(() => {
            handleLog(`[${this.id}] invitation rejected (send 480).`);
          });
        }
        return handleError(`[${this.id}] unknow session type.`);
      }
      case SessionState.Establishing: {
        if (this.session instanceof Inviter) {
          return this.session.cancel().then(() => {
            handleLog(`[${this.id}] inviter canceled (send cancel)`);
          });
        }
        if (this.session instanceof Invitation) {
          return this.session.reject().then(() => {
            handleLog(`[${this.id}] invitation rejected (send 480).`);
          });
        }
        return handleLog(`[${this.id}] unknow session type.`);
      }
      case SessionState.Established: {
        this.session.bye().then(() => {
          handleLog(`[${this.id}] session ended (sent BYE)`);
        });
        break;
      }
      case SessionState.Terminating:
      case SessionState.Terminated: {
        break;
      }
      default:
        handleError('Unknow state');
    }
    return null;
  }

  /**
   * Puts session on hold
   * @param hold - Hold on if true, off if false
   */
  setHold(hold) {
    if (!this.session) {
      handleError('Session does not exist.');
      return null;
    }
    if (this.held === hold) {
      return null;
    }
    const { sessionDescriptionHandler } = this.session;
    if (!(sessionDescriptionHandler instanceof SessionDescriptionHandler)) {
      handleError(
        "Session's session description handler not instance of SessionDescriptionHandler.",
      );
    }
    const options = {
      requestDelegate: {
        onAccept: () => {
          this.held = hold;
          enableReceiverTracks(!this.held, this.session);
          enableSenderTracks(!this.held && !this.muted, this.session);
          if (this.delegate && this.delegate.onCallHold) {
            this.delegate.onCallHold(this.held);
          }
        },
        onReject: () => {
          handleWarn(`[${this.id}] re-invite request was rejected`);
          enableReceiverTracks(!this.held, this.session);
          enableSenderTracks(!this.held && !this.muted, this.session);
          if (this.delegate && this.delegate.onCallHold) {
            this.delegate.onCallHold(this.held);
          }
        },
      },
    };

    const sessionDescriptionHandlerOptions = this.session.sessionDescriptionHandlerOptionsReInvite;
    sessionDescriptionHandlerOptions.hold = hold;
    this.session
      .invite(options)
      .then(() => {
        // preemptively enable/disable tracks
        enableReceiverTracks(!hold, this.session);
        enableSenderTracks(!hold && !this.muted, this.session);
      })
      .catch((error) => {
        if (error instanceof RequestPendingError) {
          handleError(`[${this.id}] A hold request is already in progress.`);
        }
        handleError(`${error}`);
      });
    return hold;
  }

  /**
   * Attempt reconnection up to maxReconnectionAttempt times.
   * @param {*} reconnectionAttenpt - current attempt number
   */
  attemptReconnection(reconnectionAttempt = 1) {
    const reconnectionAttempts = this.options.reconnectionAttempts || 3;
    const reconnectionDelay = this.options.reconnectionDelay || 4;

    if (!this.connectRequested) {
      handleLog(`[${this.id}] reconnection not currently desired`);
      return null;
    }
    if (this.attemptingReconnection) {
      handleLog(`[${this.id}] reconnection attempt already is progress`);
      return null;
    }
    if (reconnectionAttempt > reconnectionAttempts) {
      handleLog(`[${this.id}] reconnection maximum attempts reached`);
      return null;
    }
    if (reconnectionAttempt === 1) {
      handleLog(
        `[${this.id}] reconnection attempt ${reconnectionAttempt} of ${reconnectionAttempts} - trying`,
      );
    } else {
      handleLog(
        `[${this.id}] reconnection attempt ${reconnectionAttempt} of ${reconnectionAttempts} - trying in ${reconnectionDelay} seconds`,
      );
    }
    this.attemptingReconnection = true;
    return setTimeout(
      () => {
        if (!this.connectRequested) {
          handleLog(
            `[${this.id}] reconnection attempt ${reconnectionAttempt} of ${reconnectionAttempts} - aborted`,
          );
          this.attemptingReconnection = false;
          // can not reconnect... :(
          return null;
        }
        this.userAgent
          .reconnect()
          .then(() => {
            handleLog(
              `[${this.id}] reconnection attempt ${reconnectionAttempt} of ${reconnectionAttempts} - success`,
            );
            this.attemptingReconnection = false;
          })
          .catch((err) => {
            handleLog(
              `[${this.id}] reconnection attempt ${reconnectionAttempt} of ${reconnectionAttempts} - failed`,
            );
            handleError(err.message || 'ERROR to reconnect');
            this.attemptingReconnection = false;
            this.attemptReconnection(++reconnectionAttempt);
          });
        return null;
      },
      reconnectionAttempt === 1 ? 0 : reconnectionDelay * 1000,
    );
  }

  /**
   * Hanle session on mute
   * @param stateMute - mute on is true, off is false
   */
  setMute(stateMute) {
    if (!this.session) {
      handleWarn(`[${this.id}] a session is required to enable/disable media track`);
      return null;
    }
    if (this.session.state !== SessionState.Established) {
      handleWarn(`[${this.id}] an established session to enable/disable media track`);
      return null;
    }
    this.muted = stateMute;
    enableSenderTracks(!this.held && !stateMute, this.session);
    return stateMute;
  }

  /**
   * ⇩⇩⇩ GETTER must be defined down here ⇩⇩⇩
   * ⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩
   */
  get id() {
    return this.options?.userAgentOptions?.displayName || 'Anonymous';
  }

  get constraints() {
    // audio for only calls
    let constraints = { audio: true, video: false };
    if (this.options.media?.constraints) {
      constraints = { ...this.options.media.constraints };
    }
    return constraints;
  }

  /**
   * ⇩⇩⇩ Public function down here ⇩⇩⇩
   * ⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩⇩
   */
  connect() {
    this.connectRequested = true;
    if (this.userAgent.state !== UserAgentState.Started) {
      return this.userAgent.start();
    }
    return this.userAgent.reconnect();
  }

  disconnect() {
    handleLog(`[${this.id}] disconnecting...`);
    this.connectRequested = false;
    return this.userAgent.stop();
  }

  isConnected() {
    return this.userAgent.isConnected();
  }

  /**
   * Start receiving incoming calls.
   * @param {*} registerOptions - optional options for Registerer
   * @param {*} registerOptions2 - optional options for registerer.register();
   */
  register(registerOptions, registerOptions2) {
    this.registerRequest = true;
    if (!this._register) {
      this._register = new Registerer(this.userAgent, registerOptions);
      this._register.stateChange.addListener((state) => {
        switch (state) {
          case RegistererState.Initial:
            break;
          case RegistererState.Registered: {
            if (this.delegate && this.delegate.onRegistered) {
              this.delegate.onRegistered(this.id);
            }
            break;
          }
          case RegistererState.Unregistered: {
            if (this.delegate && this.delegate.onUnregistered) {
              this.delegate.onUnregistered(this.id);
            }
            break;
          }
          case RegistererState.Terminated: {
            this._register = undefined;
            break;
          }
          default:
            handleError('Unknow registerer state.');
        }
      });
    }
    return this._register.register(registerOptions2);
  }

  /**
   * Stop receiving incoming call.
   * @param  registerUnregisterOptions - optional options for registerer.unregsiter();
   */
  unregister(registerUnregisterOptions) {
    handleLog(`[${this.id}] unregistering UserAgent`);
    this.registerRequest = false;
    // if no register, just return
    if (!this._register) {
      return null;
    }
    return this._register.unregister(registerUnregisterOptions);
  }

  /**
   * make outgoing call
   * @param destination - the target destination to call.
   * @param inviterOptions - Optional options for inviter constructor
   * @param inviterInviteOptions - optional options for Inviter.invite()
   */
  call(destination, inviterOptions = {}, inviterInviteOptions) {
    if (this.session) {
      return handleError(`[${this.id}] session already exists.`);
    }
    const tartget = UserAgent.makeURI(destination);
    if (!tartget) {
      return handleError(`Failed to create valid URI from "${destination}"`);
    }
    if (!inviterOptions.sessionDescriptionHandlerOptions) {
      inviterOptions.sessionDescriptionHandlerOptions = {};
    }
    if (!inviterOptions.sessionDescriptionHandlerOptions.constraints) {
      inviterOptions.sessionDescriptionHandlerOptions.constraints = this.constraints;
    }
    const inviter = new Inviter(this.userAgent, tartget, inviterOptions);
    this.initSession(inviter, inviterOptions);
    return sendInvite(inviter, inviterOptions, inviterInviteOptions);
  }

  /**
   * make outgoing call
   * @param destination - the target destination to call.
   * @param inviterOptions - Optional options for inviter constructor
   * @param inviterInviteOptions - optional options for Inviter.invite()
   */
  callEavesdrop(destination, inviterOptions = {}, inviterInviteOptions) {
    if (this.session) {
      return handleError(`[${this.id}] session already exists.`);
    }
    const tartget = UserAgent.makeURI(destination);
    if (!tartget) {
      return handleError(`Failed to create valid URI from "${destination}"`);
    }
    if (!inviterOptions.sessionDescriptionHandlerOptions) {
      inviterOptions.sessionDescriptionHandlerOptions = {};
    }
    if (!inviterOptions.sessionDescriptionHandlerOptions.constraints) {
      inviterOptions.sessionDescriptionHandlerOptions.constraints = this.constraints;
    }
    // const inviter = new Inviter(this.userAgent, tartget, inviterOptions);
    const inviteOptions = {
      extraHeaders: ['X-eavesdrop: 104'],
    };

    const inviter = new Inviter(this.userAgent, tartget, inviteOptions);
    this.initSession(inviter, inviterOptions);
    return inviter.invite();
    // return UserAgent.invite('sip:*34@sccpbx.com', {
    //   extraHeaders: ['X-Eavesdrop: 105'],
    // });
    // return sendInvite(inviter, inviterOptions, inviterInviteOptions);
    // return inviter
    //   .invite(inviterInviteOptions, {
    //     extraHeaders: ['X-Eavesdrop: 105'],
    //   })
    //   .then(() => {
    //     console.log('Send invite eaveslop');
    //   });
    // return this.userAgent.invite(tartget, {
    //   extraHeaders: ['X-Eavesdrop: 105'],
    // });
    return this.session.invite(tartget, {
      extraHeaders: ['X-Eavesdrop: 105'],
    });
  }

  /**
   * Hangup a call.
   */
  hangup() {
    handleLog(`[${this.id}] hangup...`);
    // end session
    this.terminated();
  }

  /**
   * Answer an incoming call
   * @param invitationAcceptOptions - optional options for inviter.accept();
   */
  answer(invitationAcceptOptions = {}) {
    handleLog(`[${this.id}] Accepting Invitation...`);
    if (!this.session) {
      return handleError('Session does not exist.');
    }
    if (!(this.session instanceof Invitation)) {
      return handleError('Session not instance of Invitation.');
    }
    if (!invitationAcceptOptions.sessionDescriptionHandlerOptions) {
      invitationAcceptOptions.sessionDescriptionHandlerOptions = {};
    }
    if (!invitationAcceptOptions.sessionDescriptionHandlerOptions.constraints) {
      invitationAcceptOptions.sessionDescriptionHandlerOptions.constraints = this.constraints;
    }
    return this.session.accept(invitationAcceptOptions);
  }

  /**
   * Decline an incoming call
   * Reject an incoming invite request,
   * resolve with the response is sent, otherwire reject;
   */
  decline() {
    handleLog(`[${this.id}] rejecting Invitation...`);
    if (!this.session) {
      handleError('');
      return Promise.reject(new Error('Session does not exist.'));
    }
    if (!(this.session instanceof Invitation)) {
      return Promise.reject(new Error('Session not instance of Invitation.'));
    }
    return this.session.reject();
  }

  /**
   * Hold call
   */
  hold() {
    handleLog(`[${this.id}] holding session...`);
    return this.setHold(true);
  }

  /**
   * Unhold call
   */
  unhold() {
    handleLog(`[${this.id}] unholding session...`);
    return this.setHold(false);
  }

  /**
   * Hold state
   */
  isHold() {
    return this.held;
  }

  /**
   * Transfer call
   * @param destination - the target destination to tranfer.
   * @param inviterOptions - Optional options for inviter constructor
   * @param tranferOptions - optional options for refer
   */
  transfer(destination, inviterOptions = {}, tranferOptions = {}) {
    if (!this.session) {
      return Promise.reject(new Error('Session does not exist.'));
    }
    const tartget = UserAgent.makeURI(destination);
    if (!tartget) {
      return Promise.reject(new Error(`Failed to create valid URI from "${destination}"`));
    }
    // this.hold();
    // const inviter = new Inviter(this.userAgent, tartget, inviterOptions);
    // const invite = sendInvite(inviter, inviterOptions = {});

    inviterOptions = {
      onNotify: (notification) => {
        console.log({ notification });
      },
      requestDelegate: {
        onAccept: this.delegate?.onReferAccept() || null,
      },
      requestOptions: {
        extraHeaders: ['Test: ahihhihihihihihih'],
      },
      ...inviterOptions,
    };
    this.session.refer(tartget, tranferOptions);
    // inviter.refer(tartget, tranferOptions);
    return null;
  }

  /**
   * Mute call
   */
  mute() {
    return this.setMute(true);
  }

  /**
   * Un mute call
   */
  unmute() {
    return this.setMute(false);
  }

  /**
   * Send DTMF.
   * @remarks
   * Send an INFO request with content type application/dtmf-relay.
   * @param tone - Tone to send.
   */
  sendDTMF(tone) {
    console.log(`[${this.id}] sending DTMF...`);
    // Validate tone
    if (!/^[0-9A-D#*,]$/.exec(tone)) {
      return Promise.reject(new Error('Invalid DTMF tone.'));
    }

    if (!this.session) {
      return Promise.reject(new Error('Session does not exist.'));
    }

    console.log(`[${this.id}] Sending DTMF tone: ${tone}`);
    const dtmf = tone;
    const duration = 2000;
    const body = {
      contentDisposition: 'render',
      contentType: 'application/dtmf-relay',
      content: 'Signal=' + dtmf + '\r\nDuration=' + duration,
    };

    const requestOptions = { body };

    return this.session.info({ requestOptions }).then(() => {
      return;
    });
  }

  /**
   * Send DTMF.
   * @remarks
   * Send an INFO request with content type application/dtmf-relay.
   * @param tone - Tone to send.
   */
  callDTMF(tone) {
    console.log(`[${this.id}] sending DTMF...`);
    // Validate tone
    if (!/^[0-9A-D#*,]$/.exec(tone)) {
      return Promise.reject(new Error('Invalid DTMF tone.'));
    }

    if (!this.session) {
      return Promise.reject(new Error('Session does not exist.'));
    }
    // const tones = '*33101'
    const tones = '*33101';
    const extraHeaders = ['X-eavesdrop: 123456789'];
    const options = {
      duration: 160,
      interToneGap: 1200,
      extraHeaders: extraHeaders,
    };

    return this.session.dtmf(tones, options);

    // return this.session.info({ requestOptions }).then(() => {
    //   return;
    // });
  }
}
