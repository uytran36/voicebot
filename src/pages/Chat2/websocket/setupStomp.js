import { Client } from '@stomp/stompjs';
import api from '@/api';

let client;

export const setupStomp = (dispatch, token, user) => {
  client = new Client();
  client.configure({
    brokerURL: `${api.WS_SERVICE}/websocket/websocket-chat`,
    onConnect: () => {
      client.subscribe('/topic/new-room', (message) => {
        if (message && message.body) {
          const msg = JSON.parse(message.body);
          dispatch({
            type: 'rocketChat/wsOnMessage',
            payload: msg,
            headers: {
              Authorization: token,
            },
          });
        }
      });
      client.subscribe('/topic/new-message', (message) => {
        if (message && message.body) {
          const msg = JSON.parse(message.body);
          dispatch({
            type: 'rocketChat/wsOnMessage',
            payload: msg,
            headers: {
              Authorization: token,
            },
          });
        }
      });
      client.subscribe(`/topic/${user}`, (message) => {
        if (message && message.body) {
          const msg = JSON.parse(message.body);
          dispatch({
            type: 'rocketChat/wsOnMessage',
            payload: msg,
            headers: {
              Authorization: token,
            },
          });
        }
      });
      client.subscribe(
        `/topic/report-callcenter-queue/${localStorage.getItem('rid')}`,
        (message) => {
          if (message && message.body) {
            const msg = JSON.parse(message.body);
            window.location.assign(`${api.CALLCENTER_SERVICE}/${msg.link}`);
          }
        },
      );
      client.subscribe(`/topic/report-queue/${localStorage.getItem('rid')}`, (message) => {
        if (message && message.body) {
          const msg = JSON.parse(message.body);
          window.location.assign(`${api.CHAT_SERVICE}/${msg.link}`);
        }
      });
    },
    debug: (str) => {
      // console.log(new Date(), str);
    },
    connectHeaders: {
      Authorization: token,
    },
  });
  client.activate();
};

export const onDisconnect = (token) => {
  if (client) {
    client.deactivate();
  }
};
