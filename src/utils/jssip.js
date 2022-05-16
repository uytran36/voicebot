import { message } from 'antd';
import JsSIP from 'jssip';

export default class UA {
  constructor(options = {}) {
    this.attemptingReconnection = false;
    this.connectRequested = false;
    this.options = {
      ...options,
    };

    this.delegate = options?.delegate;
    this.userAgent = undefined;
    this.held = false;
    this.muted = false;
    this.session = undefined;

    // make user agent
    this.userAgentOptions = options?.userAgentOptions || {};
    this.userAgent = new JsSIP.UA(this.userAgentOptions);

    this.userAgent.on('newRTCSession', (e) => {
      const { session } = e;
      if (this.session) {
        session.terminate();
        return;
      }
      this.session = session;
      const peerconnection = session.connection;

      // set local media
      if (e.originator === 'local') {
        peerconnection.addEventListener('addstream', (event) => {
          const audio = this?.options?.media?.remote?.video;
          audio.srcObject = event.stream;
        });
      } else {
        this.delegate.onCallReceived(
          e?.request?.from?._display_name,
          e?.request?.headers?.['X-Scc-Callid'][0]?.raw,
        );
      }
      // outbound
      // if (session.direction === "outgoing") {

      // }
      // inbound
      if (session.direction === 'incoming') {
        session.on('accepted', (data) => {
          console.log('accepted');
          console.log(data);
          this.delegate.onSessionEstablishing('Established');
        });
        // Agent cúp máy
        session.on('ended', (data) => {
          //handle handup call
          console.log('ended');
          // message.warn(data);
          this.delegate.onCallHangup('Terminated');
        });
        // Khách hàng cúp máy (gọi nhỡ)
        session.on('failed', (data) => {
          if (data.cause === 'Canceled') {
            //handle missed call
            console.log(data);
            this.delegate.onMissedCall(data);
          } else {
            //handle reject call
            console.log(data);
            console.log('declice');
          }
          message.warn(data.cause);
          this.delegate.onCallHangup('Terminated');
        });
      }
      session.on('progress', (data) => {
        // onCallRequest
      });
      session.on('failed', (mdata) => {
        this.session = undefined;
      });

      session.on('ended', () => {
        this.session = undefined;
      });

      session.on('hold', (data) => {
        this.held = true;
        this.delegate.onCallHold(this.held);
      });

      session.on('unhold', (data) => {
        this.held = false;
        this.delegate.onCallHold(this.held);
      });
    });
    this.userAgent.start();
  }

  call(destination, option) {
    try {
      const options = {
        eventHandlers: this.options?.eventHandlers,
        mediaConstraints: this.options?.mediaConstraints,
        pcConfig: this.options?.pcConfig,
        ...option,
      };
      this.userAgent.call(`sip:${destination}@sccpbx.com`, options);
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  hangup() {
    try {
      if (this.session && this.session.isEnded() === false) {
        this.session.terminate();
      }
      this.session = undefined;
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  decline() {
    try {
      if (!this.session) {
        throw new Error('Session does not exist.');
      }
      this.session.terminate();
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  answer() {
    try {
      if (!this.session) {
        throw new Error('Session does not exist.');
      }
      const callOptions = {
        mediaConstraints: this.options?.mediaConstraints,
        pcConfig: this.options?.pcConfig,
      };
      this.session.answer(callOptions);
      this.session.connection.addEventListener('addstream', (event) => {
        const audio = this?.options?.media?.remote?.video;
        audio.srcObject = event.stream;
      });
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  disconnect() {
    try {
      console.log(`disconnecting...`);
      this.userAgent.stop();
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  connect() {
    try {
      console.log(`connecting...`);
      this.userAgent.start();
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  hold() {
    try {
      this.session.hold({ useUpdate: false });
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  unhold() {
    try {
      this.session.unhold({ useUpdate: false });
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  mute() {
    try {
      this.session.mute({ audio: true, video: true });
      this.muted = true;
      this.delegate.onCallMute(this.muted);
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  unmute() {
    try {
      this.session.unmute({ audio: true, video: true });
      this.muted = false;
      this.delegate.onCallMute(this.muted);
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  transfer(target) {
    try {
      if (!this.session) {
        throw new Error('Session does not exist.');
      }
      const transferOptions = {
        eventHandlers: this.options?.eventHandlers,
        mediaConstraints: this.options?.mediaConstraints,
        pcConfig: this.options?.pcConfig,
      };
      this.session.refer(target, transferOptions);
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  sendDTMF(tone) {
    try {
      if (!/^[0-9A-D#*,]$/.exec(tone)) {
        throw new Error('Invalid DTMF tone.');
      }

      if (!this.session) {
        throw new Error('Session does not exist.');
      }

      const options = {
        duration: 2000,
        transportType: 'RFC2833',
      };

      this.session.sendDTMF(tone, options);
    } catch (error) {
      throw new Error(error.toString());
    }
  }

  get id() {
    return this.options?.userAgentOptions?.display_name || 'Anonymous';
  }
}
