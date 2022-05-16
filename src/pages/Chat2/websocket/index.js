/* eslint-disable default-case */
import _ from 'lodash';
import { openNotification } from '../utils/notification';
import * as IdSocket from "../constants/IdSocket";
import LoginSocket from './LoginSocket';
import Id from './Id';

const setupSocket = (dispatch) => {
  const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_SSL);
  socket.onerror = (evt) => {
    openNotification('topRight', 'Kết nỗi thất bại.', 'Vui lòng nhấn F5 để kết nối lại ...');
  };
  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        msg: 'connect',
        version: '1',
        id: 'connect',
        support: ['1'],
      }),
    );
  };
  socket.onmessage = async (e) => {
    const response = JSON.parse(e.data);
    if (response.hasOwnProperty('server_id')) {
      dispatch({
        type: 'RESET',
      });
    }
    if (response.hasOwnProperty('id')) {
      switch (response.id) {
        case IdSocket.LOGIN_SOCKET: {
          LoginSocket(dispatch, socket, response);
          break;
        }
        case IdSocket.LOAD_HISTORY: {
          if (response.result && response.result.messages) {
            dispatch({
              type: 'rocketChat/getListMessage',
              payload: {
                data: response.result.messages,
              },
            });
          }
          break;
        }
        case 'SEND_MESSAGE': {
          break;
        }
        case IdSocket.ID: {
          Id(dispatch, socket, response);
          break;
        }
        case 'CHANGE_STATUS_LIVECHAT': {
          break;
        }
        case 'FORWARD_LIVECHAT': {
          break;
        }
        case IdSocket.GET_ROOM_SUBSCRIPTIONS: {
          dispatch({
            type: 'rocketChat/getRoomSubscriptionCompleted',
            payload: {
              data: JSON.stringify(response.result.update),
            }
          });
          break;
        }
        case IdSocket.GET_SUBSCRIPTIONS: {
          dispatch({
            type: 'rocketChat/getListSubscriptionCompleted',
            payload: {
              data: JSON.stringify(response.result.update),
            }
          });
          break;
        }
      }

      switch (
        response.msg // MSG
      ) {
        case 'added': // each ping from server need a 'pong' back
          if (response.collection === 'users') {
            dispatch({
              type: 'websocket/set_username',
              payload: {
                username: response.fields.username,
              }
            });
          }
          break;
        default:
          break;
      }
    } else {
      switch (
        response.msg // MSG
      ) {
        case 'ping': // each ping from server need a 'pong' back
          socket.send(
            JSON.stringify({
              msg: 'pong',
              id: 'pong',
            }),
          );
          break;
        case 'connected': // response result connecting
          dispatch({
            type: 'websocket/socket_connect',
            payload: {
              socket,
            }
          });
          break;
        case 'updated': // msg: updated
          break;
        case 'ready': // msg: updated
          break;
        case 'changed': // msg: updated
          break;
      }
    }
  };
  socket.onclose = () => {
    socket.close();
  };
  return socket;
};
export default setupSocket;
