import { Client } from '@stomp/stompjs';
import api from '@/api';
import { formatMessage } from 'umi';
import { requestGetCurrentUserInfo } from '@/services/auth';
import { message, notification } from 'antd';
let client;

export const setupStomp = (dispatch, token, user, wsId, userId, agentUuid) => {
  client = new Client();
  client.configure({
    brokerURL: `${process.env.REACT_APP_WEBSOCKET_SSL}/websocket-chat`,
    onConnect: () => {
      if (client.connected) {
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
        client.subscribe(`/topic/report-callcenter-queue/${wsId}`, (message) => {
          if (message && message.body) {
            const msg = JSON.parse(message.body);
            window.location.assign(`${api.UMI_API_BASE_URL}${msg.link}`);
          }
        });
        client.subscribe(`/topic/report-queue/${wsId}`, (message) => {
          if (message && message.body) {
            const msg = JSON.parse(message.body);
            window.location.assign(`${api.UMI_API_BASE_URL}${msg.link}`);
          }
        });
        client.subscribe(`/topic/agent-update/${agentUuid}`, (message) => {
          if (message && message.body) {
            const msg = JSON.parse(message.body);
            const { status } = msg;
            dispatch({
              type: 'userAgent/updateAgentStatusWithoutApi',
              payload: { status },
            });
          }
        });
        client.subscribe(`/topic/report-crm-queue/${wsId}`, (mess) => {
          if (mess && mess.body) {
            const msg = JSON.parse(mess.body);
            // console.log(msg);
            if (msg?.msg === 'SUCCESS') {
              message.success('Export thành công.');
              window.open(`${api.UMI_API_BASE_URL}${msg.link}`);
            }
          }
        });
        client.subscribe(`/topic/import-queue/${wsId}`, (message) => {
          if (message && message.body) {
            const msg = JSON.parse(message.body);
            console.log(msg);
            // window.location.assign(`${api.UMI_API_BASE_URL}${msg.link}`);
          }
        });
        client.subscribe('/topic/notification/all', (message) => {
          if (message && message.body) {
            const msg = JSON.parse(message.body);
            dispatch({
              type: 'global/newNotice',
              payload: msg,
              headers: {
                Authorization: token,
              },
            });
          }
        });
        client.subscribe(`/topic/notification/private/${userId}`, (message) => {
          if (message && message.body) {
            const msg = JSON.parse(message.body);
            dispatch({
              type: 'global/newNotice',
              payload: msg,
              headers: {
                Authorization: token,
              },
            });
          }
        });
        client.subscribe(`/topic/report-callcenter-queue/${wsId}`, (mess) => {
          if (mess && mess.body) {
            const msg = JSON.parse(mess.body);
            // console.log(msg);
            if (msg?.msg === 'SUCCESS') {
              message.success('Export thành công.');
              window.open(`${api.UMI_API_BASE_URL}${msg.link}`);
            }
          }
        });
        client.subscribe(`/topic/fetch-me`, (message) => {
          if (message && message.body) {
            const msg = JSON.parse(message.body);
            // update permission thành công chúng ta cần phải
            // update lại permission của agent.
            if (msg.type === 'UPDATE_PERMISSION' && msg.status) {
              requestGetCurrentUserInfo({
                Authorization: token,
              })
                .then((res) => {
                  if (res.message === 'SUCCESS') {
                    dispatch({
                      type: 'user/save',
                      payload: {
                        currentUser: res.me,
                        ext: res.me.ipPhone,
                        userId: res.me.id,
                      },
                    });
                    return null;
                  }
                  throw new Error('ERROR~');
                })
                .catch((err) => {
                  notification.warning({
                    message: formatMessage({ id: 'component.stomp.fetch-me.warning' }),
                  });
                });
            }
          }
        });
      }
    },
    debug: (str) => {
      // console.log(new Date(), str);
    },
    connectHeaders: {
      Authorization: token,
    },
    reconnectDelay: 2000,
    heartbeatIncoming: 1000,
  });
  client.activate();
};

export const onDisconnectStomp = (token) => {
  if (client) {
    client.deactivate();
  }
};
