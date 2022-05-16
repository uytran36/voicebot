/* eslint-disable require-yield */
/* eslint-disable prefer-template */
import { notification } from 'antd';
import * as IdSocket from '../pages/Chat2/constants/IdSocket';

const getStateWs = (state) => state.websocket;

const Model = {
  namespace: 'websocket',
  state: {
    socket: null,
    socket_false: {
      data: '',
    },
    chathub_widget_userId: null,
    chathub_widget_userName: null,
    smart_contact_authorization: null,
    statusLivechat: 'not-available',
    loginFail: true,
    loginSuccess: false,
    isConnected: false,
  },
  effects: {
    *subscriptionServer({ payload }, { select }) {
      const { params } = payload;
      const stateWs = yield select(getStateWs);
      const userId = stateWs.chathub_widget_userId;
      params.socket.send(
        JSON.stringify({
          "msg": "sub",
          "id": userId + "ID",
          "name": "stream-notify-user",
          "params": [
            userId + "/subscriptions-changed",
            false
          ]
        })
      );

      // stream-notify-user - rooms-changed
      params.socket.send(
        JSON.stringify({
          "msg": "sub",
          "id": userId + "streamNotifyUser",
          "name": "stream-notify-user",
          "params": [userId + "/rooms-changed", {
            "useCollection": false,
            "args": []
          }]
        })
      );
      params.socket.send(
        JSON.stringify({
          "msg": "sub",
          "id": userId + "streamNotifyUserNotify",
          "name": "stream-notify-user",
          "params": [userId + "/notification", {
            "useCollection": false,
            "args": []
          }]
        })
      );
      params.socket.send(
        JSON.stringify({
          "msg": "sub",
          "id": userId + "message",
          "name": "stream-notify-user",
          "params": [userId + "/message", false]
        })
      );
      params.socket.send(
        JSON.stringify({
          "msg": "sub",
          "id": userId + "otr",
          "name": "stream-notify-user",
          "params": [userId + "/otr", false]
        })
      );
      params.socket.send(
        JSON.stringify({
          "msg": "sub",
          "id": userId + "webrtc",
          "name": "stream-notify-user",
          "params": [
            userId + "/webrtc",
            false
          ]
        })
      );
      params.socket.send(
        JSON.stringify({
          "msg": "sub",
          "id": userId + "userData",
          "name": "stream-notify-user",
          "params": [
            userId + "/userData",
            false
          ]
        })
      );
      params.socket.send(
        JSON.stringify({
          "msg": "method",
          "method": "rooms/get",
          "id": IdSocket.GET_ROOM_SUBSCRIPTIONS,
          "params": [{ "$date": null }]
        })
      );
      params.socket.send(
        JSON.stringify({
          "msg": "method",
          "method": "subscriptions/get",
          "id": IdSocket.GET_SUBSCRIPTIONS,
          "params": [{ "$date": null }]
        })
      );
    },
    *loadHistory({ payload, from }) {
      payload.socket.send(
        JSON.stringify({
          msg: 'method',
          method: 'loadHistory',
          id: IdSocket.LOAD_HISTORY,
          params: [payload.roomId, null, 500, new Date().getTime()],
        }),
      );
    },
    *streamRoomMessage({ payload }) {
      payload.socket.send(
        JSON.stringify({
          msg: 'sub',
          id: payload.roomId + 'stream-room-messages',
          name: 'stream-room-messages',
          params: [payload.roomId, true],
        }),
      );
    },
    *sendMessage({ payload }, { select }) {
      const stateWS = yield select(getStateWs);
      const { socket } = stateWS;
      try {
        socket.send(
          JSON.stringify({
            msg: 'method',
            method: 'sendMessage',
            id: IdSocket.SEND_MESSAGE,
            params: [
              {
                _id: Math.random().toString(36).substring(7),
                rid: payload.roomId,
                msg: payload.msg,
              },
            ],
          }),
        );
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *outGroup({ payload }) {
      payload.socket.send(
        JSON.stringify({
          msg: 'method',
          method: 'livechat:closeRoom',
          id: IdSocket.OUT_GROUP,
          params: ['roomID', 'Kết thúc hội thoại', { clientAction: true, tags: [] }],
        }),
      );
    },
    *loginSocket({ payload }, { put }) {
      payload.socket.send(
        JSON.stringify({
          msg: 'method',
          method: 'login',
          id: IdSocket.LOGIN_SOCKET,
          params: [{ resume: payload.authorization }],
        }),
      );
      yield put({
        type: 'smart_contact_authorization',
        payload: payload?.authorization,
      });
    },
    *startForwardLivechat({ payload }, { select }) {
      const state = yield select(getStateWs);
      const { socket } = state;
      try {
        socket.send(
          JSON.stringify({
            msg: 'method',
            method: 'livechat:transfer',
            params: [{ roomId: payload.roomId, comment: payload.comment, userId: payload.userId }],
            id: IdSocket.FORWARD_LIVECHAT,
          }),
        );
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *startAddUser({ payload }, { select }) {
      const state = yield select(getStateWs);
      const { socket } = state;
      try {
        socket.send(
          JSON.stringify({
            msg: 'method',
            method: 'addUsersToRoom',
            params: [{ rid: payload.roomId, users: [payload.userName] }],
            id: 'AddUser',
          }),
        );
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *startSetOwner({ payload }, { select }) {
      const state = yield select(getStateWs);
      const { socket } = state;
      try {
        socket.send(
          JSON.stringify({
            msg: 'method',
            method: 'addRoomOwner',
            params: [payload.roomId, payload.userId],
            id: 'SetOwner',
          }),
        );
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *startLeaveRoom({ payload }, { select }) {
      const state = yield select(getStateWs);
      const { socket } = state;
      try {
        socket.send(
          JSON.stringify({
            msg: 'method',
            method: 'leaveRoom',
            params: [payload.roomId],
            id: 'LeaveRoom',
          }),
        );
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    socket_login(state, { payload }) {
      if (payload) {
        return {
          ...state,
          socket: payload.socket,
          chathub_widget_userId: payload.userId,
          chathub_widget_authToken: payload.authToken,
          loginFail: false,
          loginSuccess: true,
        };
      }
      localStorage.clear();
      return {};
    },
    login_rocketchat_fail(state, action) {
      return {
        ...state,
        loginFail: true,
      };
    },
    login_rocketchat_completed(state, { payload }) {
      if (payload) {
        return {
          ...state,
          loginFail: false,
          chathub_widget_userId: payload.userId,
          chathub_widget_authToken: payload.authToken,
        };
      }
      localStorage.clear();
      return {};
    },
    socket_connect(state, { payload }) {
      if (payload.socket) {
        return {
          ...state,
          socket: payload.socket,
          isConnected: true,
        }
      }
    },
    socket_disconnect(state, { payload }) {
      return {
        ...state,
        socket: null,
        isConnected: false,
      }
    },
    status_livechat(state, { payload }) {
      return {
        ...state,
        statusLivechat: payload.statusLivechat
      }
    },
    set_username(state, { payload }) {
      return {
        ...state,
        chathub_widget_userName: payload.username
      }
    },
    socket_reset(state, action) {
      return {
        ...state,
        loginFail: true,
        socket: null
      }
    },
    smart_contact_authorization(state, { payload }) {
      return {
        ...state,
        smart_contact_authorization: payload,
      };
    },
  },
};
export default Model;
