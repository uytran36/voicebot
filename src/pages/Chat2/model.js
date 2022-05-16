/* eslint-disable require-yield */
/* eslint-disable prefer-const */
/* eslint-disable no-throw-literal */
/* eslint-disable no-empty */
/* eslint-disable no-lone-blocks */
/* eslint-disable object-shorthand */
/* eslint-disable operator-assignment */
/* eslint-disable consistent-return */
import { notification } from 'antd';
import _ from 'lodash';
import * as TYPE_ROOM_WIDGET from './constants/TypeRoomWidget';
import * as API from './constants/Api';
import { GET, POST, sendFile, GET2 } from './service';
import {
  doneRoom,
  forwardMessage,
  loadHistory,
  receive,
  receiveTransition,
  rejectTransition,
  requestListRoom,
  rollBackForward,
  sendMessage,
  sendMessageWithAttachments,
} from '@/services/omnichat';
import reqwest from 'reqwest';
import { getListUser } from '@/services/user-management';

const getState = (state) => state.rocketChat;
const getUser = (state) => state.user;
const getStateWs = (state) => state.websocket;
const initialState = {
  roomInfo: null,
  userInfo: null,
  listMessage: null,
  images: null,
  typeSocial: null,
  typeRoom: null,
  typeMessage: null,
  listRoom: null,
  listRoomOffline: null,
  lengthRoomOffline: null,
  listRoomSearch: [],
  listMessagesSearch: [],
  listearch: [],
  listUser: [],
  text: null,
  skip: 0,
  maxLength: 0,
  numberRoomRead: 0,
  numberRoomReadLiveChat: 0,
  lengthDefault: 0,
  lengthLivechat: 0,
  groupFile: null,
  groupImageVideo: [],
  loading: false,
  loadingMessage: false,
  loginFail: false,
  activeRoom: -1,
  notification: null,
  listSubscription: null,
  calling: false,
  link_calling: false,
  visitorsInfoLivechat: null,
  visitorsInfo: null,
  customerInfo: null,
  listCustomerInfo: null,
  roomSubscription: null,
  notificationSubscription: null,
  processing: 0,
  waiting: 0,
  keyNextMessage: null,
  limitMessage: 0,
};

function updateListRoom(listRoom, roomData) {
  try {
    if (listRoom && listRoom.length > 0) {
      const checkRoom = _.findIndex(listRoom, { _id: roomData._id });
      if (checkRoom > -1) {
        listRoom.splice(checkRoom, 1);
        listRoom.unshift(roomData);
        return listRoom;
      }
      listRoom.unshift(roomData);
      return listRoom;
    }
    listRoom.push(roomData);
    return listRoom;
  } catch (e) {
    notification.error({
      message: e.toString(),
      placement: 'topRight',
    });
  }
}
function updateListSub(listSub, subData) {
  try {
    const checkRoom = _.findIndex(listSub, { _id: subData._id });
    if (checkRoom > -1) {
      listSub.splice(checkRoom, 1);
      listSub.unshift(subData);
      return listSub;
    }
    listSub.unshift(subData);
    return listSub;
  } catch (e) {
    notification.error({
      message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
      placement: 'topRight',
    });
  }
}
// Notification
function openNotificationError(message, description) {
  notification.error({
    message,
    description,
    placement: 'topRight',
  });
}
function openNotificationSuccess(message, description) {
  notification.success({
    message,
    description,
    placement: 'topRight',
  });
}
function getNotificationBySubscription({ subs, rooms, username }) {
  const result = {
    allchat: {
      value: 0,
      new: 0,
      receive: 0,
      forward: 0,
      done: 0,
    },
    zalo: {
      value: 0,
      new: 0,
      receive: 0,
      forward: 0,
      done: 0,
    },
    facebook: {
      value: 0,
      new: 0,
      receive: 0,
      forward: 0,
      done: 0,
    },
    livechat: 0,
  };
  return result;
}
function updateNotificationBySubscription({
  sub,
  rooms,
  notificationSubscription,
  listSubscription,
  status,
  userInfo,
}) {
  const result = notificationSubscription;
  const username = userInfo ? userInfo.username : null;
  if (sub && username && rooms && listSubscription && Array.isArray(rooms) && rooms.length > 0) {
    const _room = rooms.find((value) => value._id === sub.rid);
    const _sub = listSubscription.find((value) => value._id === sub._id);

    if (status === 'inserted') {
      if (sub.t === 'l') {
        result.livechat += 1;
      } else {
        if (_room.customFields && _room.customFields.isZalo) {
          result.allchat.value = result.allchat.value + 1;
          result.zalo.value = result.zalo.value + 1;
          if (
            _room.customFields.session === 'start' ||
            (_room.customFields.session.status === 'inTransition' &&
              _room.customFields.session.to === username &&
              _room.muted &&
              _room.muted.indexOf(username) !== -1)
          ) {
            result.allchat.new = result.allchat.new + 1;
            result.zalo.new = result.zalo.new + 1;
          }
          if (
            (_room.customFields.session.status === 'successTransition' ||
              _room.customFields.session.status === 'fallTransition' ||
              _room.customFields.session.status === 'inTransition') &&
            _room.customFields.session.from === username
          ) {
            result.allchat.forward = result.allchat.forward + 1;
            result.zalo.forward = result.zalo.forward + 1;
          }
          if (
            _room.muted &&
            _room.muted.indexOf(username) === -1 &&
            _room.customFields.session &&
            _room.customFields.session.status === 'receiveTransition'
          ) {
            result.allchat.receive = result.allchat.receive + 1;
            result.zalo.receive = result.zalo.receive + 1;
          }
          if (_room.customFields.session.status === 'done') {
            result.allchat.done = result.allchat.done + 1;
            result.zalo.done = result.zalo.done + 1;
          }
        }
        if (_room.customFields && _room.customFields.isFacebook) {
          result.allchat.value = result.allchat.value + 1;
          result.facebook.value = result.facebook.value + 1;
          if (
            _room.customFields.session === 'start' ||
            (_room.customFields.session.status === 'inTransition' &&
              _room.customFields.session.to === username &&
              _room.muted &&
              _room.muted.indexOf(username) !== -1)
          ) {
            result.allchat.new = result.allchat.new + 1;
            result.facebook.new = result.facebook.new + 1;
          }
          if (
            (_room.customFields.session.status === 'successTransition' ||
              _room.customFields.session.status === 'fallTransition' ||
              _room.customFields.session.status === 'inTransition') &&
            _room.customFields.session.from === username
          ) {
            result.allchat.forward = result.allchat.forward + 1;
            result.facebook.forward = result.facebook.forward + 1;
          }
          if (
            _room.muted &&
            _room.muted.indexOf(username) === -1 &&
            _room.customFields.session &&
            _room.customFields.session.status === 'receiveTransition'
          ) {
            result.allchat.receive = result.allchat.receive + 1;
            result.facebook.receive = result.facebook.receive + 1;
          }
          if (_room.customFields.session.status === 'done') {
            result.allchat.done = result.allchat.done + 1;
            result.facebook.done = result.facebook.done + 1;
          }
        }
      }
    }
    if (_room && _sub) {
      if (status === 'removed') {
        if (_room.t === 'l') {
          result.livechat = result.livechat > 0 ? result.livechat - 1 : 0;
        } else {
          if (_room.customFields && _room.customFields.isZalo) {
            result.allchat.value = result.allchat.value > 0 ? result.allchat.value - 1 : 0;
            result.zalo.value = result.zalo.value > 0 ? result.zalo.value - 1 : 0;
            if (
              _room.customFields.session === 'start' ||
              (_room.customFields.session.status === 'inTransition' &&
                _room.customFields.session.to === username &&
                _room.muted &&
                _room.muted.indexOf(username) !== -1)
            ) {
              result.allchat.new = result.allchat.new - 1;
              result.zalo.new = result.zalo.new - 1;
            }
            if (
              (_room.customFields.session.status === 'successTransition' ||
                _room.customFields.session.status === 'fallTransition' ||
                _room.customFields.session.status === 'inTransition') &&
              _room.customFields.session.from === username
            ) {
              result.allchat.forward = result.allchat.forward - 1;
              result.zalo.forward = result.zalo.forward - 1;
            }
            if (
              _room.muted &&
              _room.muted.indexOf(username) === -1 &&
              _room.customFields.session &&
              _room.customFields.session.status === 'receiveTransition'
            ) {
              result.allchat.receive = result.allchat.receive > 0 ? result.allchat.receive - 1 : 0;
              result.zalo.receive = result.zalo.receive > 0 ? result.zalo.receive - 1 : 0;
            }
            if (_room.customFields.session.status === 'done') {
              result.allchat.done = result.allchat.done - 1;
              result.zalo.done = result.zalo.done - 1;
            }
          }
          if (_room.customFields && _room.customFields.isFacebook) {
            result.allchat.value = result.allchat.value > 0 ? result.allchat.value - 1 : 0;
            result.facebook.value = result.facebook.value > 0 ? result.facebook.value - 1 : 0;
            if (
              _room.customFields.session === 'start' ||
              (_room.customFields.session.status === 'inTransition' &&
                _room.customFields.session.to === username &&
                _room.muted &&
                _room.muted.indexOf(username) !== -1)
            ) {
              result.allchat.new = result.allchat.new > 0 ? result.allchat.new - 1 : 0;
              result.facebook.new = result.facebook.new > 0 ? result.facebook.new - 1 : 0;
            }
            if (
              (_room.customFields.session.status === 'successTransition' ||
                _room.customFields.session.status === 'fallTransition' ||
                _room.customFields.session.status === 'inTransition') &&
              _room.customFields.session.from === username
            ) {
              result.allchat.forward = result.allchat.forward > 0 ? result.allchat.forward - 1 : 0;
              result.facebook.forward =
                result.facebook.forward > 0 ? result.facebook.forward - 1 : 0;
            }
            if (
              _room.muted &&
              _room.muted.indexOf(username) === -1 &&
              _room.customFields.session &&
              _room.customFields.session.status === 'receiveTransition'
            ) {
              result.allchat.receive = result.allchat.receive > 0 ? result.allchat.receive - 1 : 0;
              result.facebook.receive =
                result.facebook.receive > 0 ? result.facebook.receive - 1 : 0;
            }
            if (_room.customFields.session.status === 'done') {
              result.allchat.done = result.allchat.done > 0 ? result.allchat.done - 1 : 0;
              result.facebook.done = result.facebook.done > 0 ? result.facebook.done - 1 : 0;
            }
          }
        }
      }
      if (status === 'updated' && !_sub.alert && sub.alert) {
        if (_room.t === 'l') {
          result.livechat = result.livechat + 1;
        } else if (
          _room.customFields &&
          (_room.customFields.session === 'start' ||
            (_room.customFields.session.status === 'inTransition' &&
              _room.customFields.session.to === username &&
              _room.muted &&
              _room.muted.indexOf(username) !== -1) ||
            ((_room.customFields.session.status === 'successTransition' ||
              _room.customFields.session.status === 'fallTransition' ||
              _room.customFields.session.status === 'inTransition') &&
              _room.customFields.session.from === username) ||
            _room.customFields.session.status === 'done' ||
            (_room.muted &&
              _room.muted.indexOf(username) === -1 &&
              _room.customFields.session &&
              _room.customFields.session.status === 'receiveTransition'))
        ) {
          if (_room.customFields && _room.customFields.isZalo) {
            result.allchat.value = result.allchat.value + 1;
            result.zalo.value = result.zalo.value + 1;
            if (
              _room.customFields.session === 'start' ||
              (_room.customFields.session.status === 'inTransition' &&
                _room.customFields.session.to === username &&
                _room.muted &&
                _room.muted.indexOf(username) !== -1)
            ) {
              result.allchat.new = result.allchat.new + 1;
              result.zalo.new = result.zalo.new + 1;
            }
            if (
              (_room.customFields.session.status === 'successTransition' ||
                _room.customFields.session.status === 'fallTransition' ||
                _room.customFields.session.status === 'inTransition') &&
              _room.customFields.session.from === username
            ) {
              result.allchat.forward = result.allchat.forward + 1;
              result.zalo.forward = result.zalo.forward + 1;
            }
            if (
              _room.muted &&
              _room.muted.indexOf(username) === -1 &&
              _room.customFields.session &&
              _room.customFields.session.status === 'receiveTransition'
            ) {
              result.allchat.receive = result.allchat.receive + 1;
              result.zalo.receive = result.zalo.receive + 1;
            }
            if (_room.customFields.session.status === 'done') {
              result.allchat.done = result.allchat.done + 1;
              result.zalo.done = result.zalo.done + 1;
            }
          }
          if (_room.customFields && _room.customFields.isFacebook) {
            result.allchat.value = result.allchat.value + 1;
            result.facebook.value = result.facebook.value + 1;
            if (
              _room.customFields.session === 'start' ||
              (_room.customFields.session.status === 'inTransition' &&
                _room.customFields.session.to === username &&
                _room.muted &&
                _room.muted.indexOf(username) !== -1)
            ) {
              result.allchat.new = result.allchat.new + 1;
              result.facebook.new = result.facebook.new + 1;
            }
            if (
              (_room.customFields.session.status === 'successTransition' ||
                _room.customFields.session.status === 'fallTransition' ||
                _room.customFields.session.status === 'inTransition') &&
              _room.customFields.session.from === username
            ) {
              result.allchat.forward = result.allchat.forward + 1;
              result.facebook.forward = result.facebook.forward + 1;
            }
            if (
              _room.muted &&
              _room.muted.indexOf(username) === -1 &&
              _room.customFields.session &&
              _room.customFields.session.status === 'receiveTransition'
            ) {
              result.allchat.receive = result.allchat.receive + 1;
              result.facebook.receive = result.facebook.receive + 1;
            }
            if (_room.customFields.session.status === 'done') {
              result.allchat.done = result.allchat.done + 1;
              result.facebook.done = result.facebook.done + 1;
            }
          }
        }
      }
      if (status === 'updated' && !sub.alert) {
        if (_room.t === 'l') {
          result.livechat = result.livechat > 0 ? result.livechat - 1 : 0;
        } else if (
          _room.customFields &&
          (_room.customFields.session === 'start' ||
            (_room.customFields.session.status === 'inTransition' &&
              _room.customFields.session.to === username &&
              _room.muted &&
              _room.muted.indexOf(username) !== -1) ||
            ((_room.customFields.session.status === 'successTransition' ||
              _room.customFields.session.status === 'fallTransition' ||
              _room.customFields.session.status === 'inTransition') &&
              _room.customFields.session.from === username) ||
            _room.customFields.session.status === 'done' ||
            (_room.muted &&
              _room.muted.indexOf(username) === -1 &&
              _room.customFields.session &&
              _room.customFields.session.status === 'receiveTransition'))
        ) {
          if (_room.customFields && _room.customFields.isZalo) {
            result.allchat.value = result.allchat.value > 0 ? result.allchat.value - 1 : 0;
            result.zalo.value = result.zalo.value > 0 ? result.zalo.value - 1 : 0;
            if (
              _room.customFields.session === 'start' ||
              (_room.customFields.session.status === 'inTransition' &&
                _room.customFields.session.to === username &&
                _room.muted &&
                _room.muted.indexOf(username) !== -1)
            ) {
              result.allchat.new = result.allchat.new > 0 ? result.allchat.new - 1 : 0;
              result.zalo.new = result.zalo.new > 0 ? result.zalo.new - 1 : 0;
            }
            if (
              (_room.customFields.session.status === 'successTransition' ||
                _room.customFields.session.status === 'fallTransition' ||
                _room.customFields.session.status === 'inTransition') &&
              _room.customFields.session.from === username
            ) {
              result.allchat.forward = result.allchat.forward > 0 ? result.allchat.forward - 1 : 0;
              result.zalo.forward = result.zalo.forward > 0 ? result.zalo.forward - 1 : 0;
            }
            if (
              _room.muted &&
              _room.muted.indexOf(username) === -1 &&
              _room.customFields.session &&
              _room.customFields.session.status === 'receiveTransition'
            ) {
              result.allchat.receive = result.allchat.receive > 0 ? result.allchat.receive - 1 : 0;
              result.zalo.receive = result.zalo.receive > 0 ? result.zalo.receive - 1 : 0;
            }
            if (_room.customFields.session.status === 'done') {
              result.allchat.done = result.allchat.done > 0 ? result.allchat.done - 1 : 0;
              result.zalo.done = result.zalo.done > 0 ? result.zalo.done - 1 : 0;
            }
          }
          if (_room.customFields && _room.customFields.isFacebook) {
            result.allchat.value = result.allchat.value > 0 ? result.allchat.value - 1 : 0;
            result.facebook.value = result.facebook.value > 0 ? result.facebook.value - 1 : 0;
            if (
              _room.customFields.session === 'start' ||
              (_room.customFields.session.status === 'inTransition' &&
                _room.customFields.session.to === username &&
                _room.muted &&
                _room.muted.indexOf(username) !== -1)
            ) {
              result.allchat.new = result.allchat.new > 0 ? result.allchat.new - 1 : 0;
              result.facebook.new = result.facebook.new > 0 ? result.facebook.new - 1 : 0;
            }
            if (
              (_room.customFields.session.status === 'successTransition' ||
                _room.customFields.session.status === 'fallTransition' ||
                _room.customFields.session.status === 'inTransition') &&
              _room.customFields.session.from === username
            ) {
              result.allchat.forward = result.facebook.forward > 0 ? result.allchat.forward - 1 : 0;
              result.facebook.forward =
                result.facebook.forward > 0 ? result.facebook.forward - 1 : 0;
            }
            if (
              _room.muted &&
              _room.muted.indexOf(username) === -1 &&
              _room.customFields.session &&
              _room.customFields.session.status === 'receiveTransition'
            ) {
              result.allchat.receive = result.facebook.receive > 0 ? result.allchat.receive - 1 : 0;
              result.facebook.receive =
                result.facebook.receive > 0 ? result.facebook.receive - 1 : 0;
            }
            if (_room.customFields.session.status === 'done') {
              result.allchat.done = result.facebook.done > 0 ? result.allchat.done - 1 : 0;
              result.facebook.done = result.facebook.done > 0 ? result.facebook.done - 1 : 0;
            }
          }
        }
      }
    }
  }
  return result;
}

const Model = {
  namespace: 'rocketChat',
  state: {
    roomInfo: null,
    userInfo: null,
    listMessage: null,
    images: null,
    typeSocial: null,
    typeRoom: null,
    typeMessage: null,
    listRoom: null,
    listRoomOffline: null,
    lengthRoomOffline: null,
    listRoomSearch: [],
    listMessagesSearch: [],
    listearch: [],
    listUser: [],
    text: null,
    skip: 0,
    maxLength: 0,
    numberRoomRead: 0,
    numberRoomReadLiveChat: 0,
    lengthDefault: 0,
    lengthLivechat: 0,
    groupFile: null,
    groupImageVideo: [],
    loading: false,
    loadingMessage: false,
    loginFail: false,
    activeRoom: -1,
    notification: null,
    listSubscription: null,
    calling: false,
    link_calling: false,
    visitorsInfoLivechat: null,
    visitorsInfo: null,
    customerInfo: null,
    listCustomerInfo: null,
    roomSubscription: null,
    notificationSubscription: null,
  },
  effects: {
    // General
    *execution({ payload }, { call, put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    // Rocketchat - ROOM
    *updateListRoom({ payload }, { call, put, select }) {
      const { data, status } = payload;
      const state = yield select(getState);
      let listRoom = state.listRoom ? JSON.parse(state.listRoom) : [];
      const { typeSocial } = state;
      const { typeRoom } = state;
      const { userInfo } = state;
      const { roomInfo } = state;

      try {
        if (data) {
          if (typeRoom === TYPE_ROOM_WIDGET.WAITING) {
            if (typeSocial === TYPE_ROOM_WIDGET.CHATALL) {
              if (
                data.customFields &&
                (data.customFields.isFacebook || data.customFields.isZalo) &&
                data.customFields.session &&
                (data.customFields.session.status === 'start' ||
                  (data.customFields.session.status === 'inTransition' &&
                    data.customFields.session.to === userInfo.username))
              ) {
                if (status === 'updated') {
                  listRoom = updateListRoom(listRoom, data);
                  yield put({
                    type: 'updateListRoomCompleted',
                    payload: {
                      data: listRoom && listRoom.length > 0 ? JSON.stringify(listRoom) : null,
                      typeSocial: typeSocial,
                      typeRoom: typeRoom,
                    },
                  });
                }
              }
            }
            if (typeSocial === TYPE_ROOM_WIDGET.FACEBOOK) {
              if (
                data.customFields &&
                data.customFields.isFacebook &&
                data.customFields.session &&
                (data.customFields.session.status === 'start' ||
                  (data.customFields.session.status === 'inTransition' &&
                    data.customFields.session.to === userInfo.username))
              ) {
                if (status === 'updated') {
                  listRoom = updateListRoom(listRoom, data);
                  yield put({
                    type: 'updateListRoomCompleted',
                    payload: {
                      data: listRoom && listRoom.length > 0 ? JSON.stringify(listRoom) : null,
                      typeSocial: typeSocial,
                      typeRoom: typeRoom,
                    },
                  });
                }
              }
            }
            if (typeSocial === TYPE_ROOM_WIDGET.ZALO) {
              if (
                data.customFields &&
                data.customFields.isZalo &&
                data.customFields.session &&
                (data.customFields.session.status === 'start' ||
                  (data.customFields.session.status === 'inTransition' &&
                    data.customFields.session.to === userInfo.username))
              ) {
                if (status === 'updated') {
                  listRoom = updateListRoom(listRoom, data);
                  yield put({
                    type: 'updateListRoomCompleted',
                    payload: {
                      data: listRoom && listRoom.length > 0 ? JSON.stringify(listRoom) : null,
                      typeSocial: typeSocial,
                      typeRoom: typeRoom,
                    },
                  });
                }
              }
            }
          }
          if (typeRoom === TYPE_ROOM_WIDGET.RECEIVED) {
            if (roomInfo?._id === data?._id) {
              yield put({
                type: 'setRoomInfo',
                payload: {
                  data: data,
                },
              });
            }
            if (typeSocial === TYPE_ROOM_WIDGET.CHATALL) {
              if (
                data.t === 'l' ||
                (data.t === 'p' &&
                  data.customFields &&
                  (data.customFields.isFacebook || data.customFields.isZalo) &&
                  data.customFields.session &&
                  (data.customFields.session.status !== 'start' ||
                    (data.customFields.session.status === 'inTransition' &&
                      data.customFields.session.from === userInfo.username)))
              ) {
              }
              {
                if (status === 'updated') {
                  listRoom = updateListRoom(listRoom, data);
                  yield put({
                    type: 'updateListRoomCompleted',
                    payload: {
                      data: listRoom && listRoom.length > 0 ? JSON.stringify(listRoom) : null,
                      typeSocial: typeSocial,
                      typeRoom: typeRoom,
                    },
                  });
                }
              }
            }
            if (typeSocial === TYPE_ROOM_WIDGET.FACEBOOK) {
              if (
                data.customFields &&
                data.customFields.isFacebook &&
                data.customFields.session &&
                (data.customFields.session.status !== 'start' ||
                  (data.customFields.session.status === 'inTransition' &&
                    data.customFields.session.from == userInfo.username))
              ) {
                if (status === 'updated') {
                  listRoom = updateListRoom(listRoom, data);
                  yield put({
                    type: 'updateListRoomCompleted',
                    payload: {
                      data: listRoom && listRoom.length > 0 ? JSON.stringify(listRoom) : null,
                      typeSocial: typeSocial,
                      typeRoom: typeRoom,
                    },
                  });
                }
              }
            }
            if (typeSocial === TYPE_ROOM_WIDGET.ZALO) {
              if (
                data.customFields &&
                data.customFields.isZalo &&
                data.customFields.session &&
                (data.customFields.session.status !== 'start' ||
                  (data.customFields.session.status === 'inTransition' &&
                    data.customFields.session.from == userInfo.username))
              ) {
                if (status === 'updated') {
                  listRoom = updateListRoom(listRoom, data);
                  yield put({
                    type: 'updateListRoomCompleted',
                    payload: {
                      data: listRoom && listRoom.length > 0 ? JSON.stringify(listRoom) : null,
                      typeSocial: typeSocial,
                      typeRoom: typeRoom,
                    },
                  });
                }
              }
            }
            if (typeSocial === TYPE_ROOM_WIDGET.LIVECHAT_ONLINE) {
              if (status === 'updated' && data.t === 'l') {
                listRoom = updateListRoom(listRoom, data);
                yield put({
                  type: 'updateListRoomCompleted',
                  payload: {
                    data: listRoom && listRoom.length > 0 ? JSON.stringify(listRoom) : null,
                    typeSocial: typeSocial,
                    typeRoom: typeRoom,
                  },
                });
              }
            }
          }
          if (status === 'removed') {
            const checkRoom = _.findIndex(listRoom, { _id: data?.rid });
            if (checkRoom > -1) {
              listRoom.splice(checkRoom, 1);
              yield put({
                type: 'updateListRoomCompleted',
                payload: {
                  data: listRoom && listRoom.length > 0 ? JSON.stringify(listRoom) : null,
                  typeSocial: typeSocial,
                  typeRoom: typeRoom,
                },
              });
            }
          }
        }
      } catch (e) {
        notification.error({
          message: e.toString(),
          placement: 'topRight',
        });
      }
    },
    *updateListRoomByBot({ payload }, { call, put, select }) {
      const { roomData } = payload;
      const state = yield select(getState);
      const listRoom = state.listRoom ? JSON.parse(state.listRoom) : null;
      try {
        const checkRoom = _.findIndex(listRoom, { _id: roomData._id });
        if (checkRoom > -1) {
          listRoom[checkRoom] = roomData;
          yield put({
            type: 'updateListRoomCompleted',
            payload: {
              data: JSON.stringify(listRoom),
            },
          });
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *loadListRoom({ payload }, { call, put, select }) {
      const { typeRoom, skip, open, userId, authToken } = payload;
      const state = yield select(getState);
      const listRoom = JSON.parse(state.listRoom);

      try {
        const dataRequest = yield POST({
          API_PATH: API.GET_ALLROOM_COUNTERS,
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          authToken: authToken,
          userId: userId,
          filter: {
            type: typeRoom,
            limit: 20,
            skip: skip * 20,
            where: {
              open: { $exists: open },
            },
          },
        });
        let dataResult = [];
        if (dataRequest && dataRequest.status) {
          dataResult = listRoom.concat(dataRequest.data.message.reverse());
          yield put({
            type: 'loadListRoomCompleted',
            payload: {
              data: JSON.stringify(dataResult),
              typeRoom: typeRoom,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *loadMoreMessage({ headers, lastMessage }, { call, put, select }) {
      const state = yield select(getState);
      const { message } = lastMessage;
      let elment;
      const params = {
        limit: 30,
        roomId: state.roomInfo.id,
        next: state.keyNextMessage,
      };
      try {
        let res = yield call(loadHistory, headers, params);
        if (res && res.msg === 'SUCCESS') {
          yield put({
            type: 'saveKeyNextMessage',
            payload: {
              data:
                res.response.messagesPage.next === null ? 'error' : res.response.messagesPage.next,
            },
          });
          let listMsg = JSON.parse(state.listMessage);
          let newMsg = res.response.messagesPage.messages.reverse();
          let newListMsg = newMsg;
          if (listMsg !== null) {
            newListMsg = newMsg.concat(listMsg);
            yield put({
              type: 'getListMessageCompleted',
              payload: {
                data: JSON.stringify(newListMsg),
              },
            });
            yield put({
              type: 'limitMessageSave',
              payload: {
                data: state.limitMessage + 30,
              },
            });
          }
          if (message && message.mid) {
            elment = document.getElementById(message.mid);
            elment.scrollIntoView();
          }
        } else {
          throw 'Error';
        }
      } catch (error) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getListRoom({ headers, payload }, { call, put }) {
      const { params, callback } = payload;
      const { status, filter, type } = params;
      try {
        const res = yield call(requestListRoom, headers, params);
        let rooms = {};
        if (res && res.msg === 'Ok') {
          // rooms = res.response.roomsInfo.rooms.reverse();
          rooms = res.response.roomsInfo.rooms;
          let processing = res && res.response ? res.response.roomsInfo.processing : null;
          let waiting = res && res.response ? res.response.roomsInfo.waiting : null;
          yield put({
            type: 'notificationSave',
            payload: {
              processing,
              waiting,
            },
          });
          callback({
            rooms,
            typeRoom: status,
            typeSocial: type,
            typeMessage: filter,
          });
        } else {
          throw 'Error';
        }
      } catch (error) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *wsOnMessage({ payload, headers }, { call, select, put }) {
      const state = yield select(getState);
      const params = {
        status: state.typeRoom,
        filter: state.typeMessage,
        type: state.typeSocial === TYPE_ROOM_WIDGET.CHATALL ? '' : state.typeSocial,
      };
      const { roomInfo } = state;
      const res = yield call(requestListRoom, headers, params);
      if (res && res.msg === 'Ok') {
        let processing = res && res.response ? res.response.roomsInfo.processing : null;
        let waiting = res && res.response ? res.response.roomsInfo.waiting : null;
        yield put({
          type: 'notificationSave',
          payload: {
            processing,
            waiting,
          },
        });
      }
      let rooms = [];

      // new room
      if (payload.eventType === 'new_room') {
        if (res && res.msg === 'Ok') {
          if (
            state.typeRoom === TYPE_ROOM_WIDGET.WAITING &&
            (state.typeSocial === payload.roomType ||
              state.typeSocial === TYPE_ROOM_WIDGET.CHATALL) &&
            (state.typeMessage === TYPE_ROOM_WIDGET.NEW ||
              state.typeMessage === TYPE_ROOM_WIDGET.ALL)
          ) {
            rooms = res.response.roomsInfo.rooms;
            yield put({
              type: 'updateListRoomCompleted',
              payload: {
                data: JSON.stringify(rooms),
                typeSocial: state.typeSocial,
                typeRoom: state.typeRoom,
                typeMessage: state.typeMessage,
              },
            });
          }
        } else {
          notification.error({
            message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
            placement: 'topRight',
          });
        }
      }

      // new message - received
      if (payload.eventType === 'new_message') {
        if (res && res.msg === 'Ok') {
          if (
            (state.typeMessage === TYPE_ROOM_WIDGET.ALL || state.typeMessage === payload.status) &&
            (state.typeSocial === TYPE_ROOM_WIDGET.CHATALL || state.typeSocial === payload.roomType)
          ) {
            rooms = res.response.roomsInfo.rooms;
            yield put({
              type: 'updateListRoomCompleted',
              payload: {
                data: JSON.stringify(rooms),
                typeSocial: state.typeSocial,
                typeRoom: state.typeRoom,
                typeMessage: state.typeMessage,
              },
            });
            let result = rooms.filter((room) => room.id === roomInfo.id);
            yield put({
              type: 'setRoomInfo',
              payload: {
                data: result?.length > 0 ? result[0] : rooms[0],
              },
            });
          }
          if (state.roomInfo.id === payload.roomId) {
            yield put({
              type: 'loadHistory',
              payload: {
                params: {
                  roomId: state.roomInfo.id,
                  limit: 30,
                },
              },
              headers: headers,
            });
          }
        } else {
          notification.error({
            message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
            placement: 'topRight',
          });
        }
      }
    },
    *getListSubscription({ payload }, { call, put, select }) {
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield GET({
          API_PATH: '/api/v1/subscriptions.get',
          baseURL: process.env.REACT_APP_URL_ROCKETCHAT,
          userId,
          authToken,
        });
        let dataResult = [];
        if (dataRequest && dataRequest.status == 200) {
          dataResult = dataRequest.data;
          yield put({
            type: 'getListSubscriptionCompleted',
            payload: {
              data: JSON.stringify(dataResult.update),
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *updateListSubscription({ payload }, { call, put, select }) {
      const { data, status } = payload;
      const state = yield select(getState);
      let subscriptions = state.listSubscription ? JSON.parse(state.listSubscription) : null;
      try {
        if (status === 'updated' && subscriptions) {
          subscriptions = updateListSub(subscriptions, data);
          yield put({
            type: 'getListSubscriptionCompleted',
            payload: {
              data: JSON.stringify(subscriptions),
            },
          });
        }
        if (status === 'removed') {
          let checkRoom = _.findIndex(subscriptions, { _id: data._id });
          if (checkRoom > -1) {
            subscriptions.splice(checkRoom, 1);
            yield put({
              type: 'getListSubscriptionCompleted',
              payload: {
                data: JSON.stringify(subscriptions),
              },
            });
          }
        }
        if (status === 'inserted') {
          subscriptions.unshift(data);
          yield put({
            type: 'getListSubscriptionCompleted',
            payload: {
              data: JSON.stringify(subscriptions),
            },
          });
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getAllRoomOffline({ payload }, { call, put, select }) {
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield GET({
          API_PATH: API.GET_ALLROOM_OFFLINE,
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          params: {
            sort: { sent_at: -1 },
            query: { support_status: false },
          },
          authToken,
          userId,
        });
        let dataResult = [];
        if (dataRequest && dataRequest.status) {
          dataResult = dataRequest.data;
          yield put({
            type: 'getAllRoomOfflineCompleted',
            payload: {
              data: JSON.stringify(dataResult.words.reverse()),
              maxLength: dataResult.total,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getYourChats({ payload }, { call, put, select }) {
      const { typeRoom, skip, open, authToken, userId, typeSocial } = payload;
      const state = yield select(getState);
      let userInfo = state.userInfo;
      try {
        let dataRequest = yield POST({
          API_PATH: API.GET_ALLROOM_COUNTERS,
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          authToken: authToken,
          userId: userId,
          filter: {
            type: 'p',
            limit: 50,
            skip: 0,
            username: userInfo.username,
            typeRoom: typeSocial,
          },
        });
        let dataResult = [];
        if (dataRequest && dataRequest.status) {
          dataResult = dataRequest.data.message;
          yield put({
            type: 'getListRoomCompleted',
            payload: {
              data: JSON.stringify(dataResult.reverse()),
              maxLength: maxLength,
              typeSocial: typeSocial,
              typeRoom: typeRoom,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getRequest({ payload }, { call, put, select }) {
      const { typeRoom, skip, open, authToken, userId, typeSocial } = payload;
      const state = yield select(getState);
      let userInfo = state.userInfo;
      try {
        let dataRequest = yield POST({
          API_PATH: API.GET_ALLROOM_COUNTERS,
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          authToken: authToken,
          userId: userId,
          filter: {
            type: 'p',
            limit: 50,
            skip: 0,
            username: userInfo.username,
            typeRoom: typeSocial,
          },
        });
        let dataResult = [];
        if (dataRequest && dataRequest.status) {
          dataResult = dataRequest.data.message;
          dataResult = dataResult.filter(
            (room) =>
              !(room.customFields && room.customFields.agentSupport && room.customFields.botStatus),
          );
          let { maxLength } = dataRequest.data;
          yield put({
            type: 'getListRoomCompleted',
            payload: {
              data: JSON.stringify(dataResult.reverse()),
              maxLength: maxLength,
              typeRoom: typeRoom,
              typeSocial: typeSocial,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *searchRoomWeb({ payload, headers }, { call, put, select }) {
      const { searchValue } = payload;
      const state = yield select(getState);
      const { listRoom } = state;
      try {
        let listRoomSearch = [];
        // if (searchValue) {
        const params = {
          status: state.typeRoom,
          filter: state.typeMessage,
          type: state.typeSocial === TYPE_ROOM_WIDGET.CHATALL ? '' : state.typeSocial,
          q: searchValue,
        };
        const res = yield call(requestListRoom, headers, params);
        if (res && res.msg === 'Ok') {
          let processing = res && res.response ? res.response.roomsInfo.processing : null;
          let waiting = res && res.response ? res.response.roomsInfo.waiting : null;
          listRoomSearch = res && res.response ? res.response.roomsInfo.rooms : null;

          yield put({
            type: 'notificationSave',
            payload: {
              processing,
              waiting,
            },
          });
          yield put({
            type: 'searchRoomWebCompleted',
            payload: {
              data: JSON.stringify(listRoomSearch),
            },
          });

          if (listRoomSearch && listRoomSearch.length > 0) {
            const room = listRoomSearch[0];

            yield put({
              type: 'resetListMessage',
            });
            yield put({
              type: 'loadHistory',
              payload: {
                params: {
                  roomId: room.id,
                  limit: 30,
                },
              },
              headers: headers,
            });

            yield put({
              type: 'setRoomInfo',
              payload: {
                data: room,
              },
            });
          }
        }
        // } else {
        //   notification.error({
        //     message: 'Vui lòng nhập giá trị tìm kiếm vào trường tìm kiếm',
        //     placement: 'topRight',
        //   });
        // }
      } catch (e) {
        console.log(e);
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getRoomInfo({ payload }, { call, put, select }) {
      const { roomId, type } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield GET({
          API_PATH: API.GET_ROOM_INFO + '?roomId=' + roomId,
          userId,
          authToken,
        });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data.room;
          if (type === 'GET_ROOM_INFOISC')
            yield put({
              type: 'getRoomInfoISCCompleted',
              payload: {
                data: dataResult,
              },
            });
          else {
            yield put({
              type: 'getRoomInfoCompleted',
              payload: {
                data: dataResult,
              },
            });
          }
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getRoomInfoISC({ payload }, { call, put, select }) {
      const { roomId, type } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield GET({
          API_PATH: API.GET_ROOM_INFO + '?roomId=' + roomId,
          userId,
          authToken,
        });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data.room;
          if (type === 'GET_ROOM_INFOISC')
            yield put({
              type: 'getRoomInfoISCCompleted',
              payload: {
                data: dataResult,
              },
            });
          else {
            yield put({
              type: 'getRoomInfoCompleted',
              payload: {
                data: dataResult,
              },
            });
          }
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *updateRoomInfo({ payload }, { call, put, select }) {
      const state = yield select(getState);
      let listRoom = state.listRoom ? JSON.parse(state.listRoom) : null;
      try {
        if (listRoom && listRoom.length > 0) {
          yield put({
            type: 'setRoomInfo',
            payload: {
              data: listRoom[listRoom.length - 1],
            },
          });
        } else {
          yield put({
            type: 'setRoomInfo',
            payload: {
              data: null,
            },
          });
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *closeGroup({ payload }, { call, put, select }) {
      const { params } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          API_PATH: API.CLOSE_GROUP,
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          filter: {
            roomId: params.roomId,
            username: params.userName,
            message: params.msg,
          },
          authToken,
          userId,
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *toggleBotChannel({ payload }, { call, put, select }) {
      const { roomId } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          API_PATH: API.TOGGLE_BOT_CHANNEL,
          filter: { roomId: roomId },
          userId,
          authToken,
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *toggleBotRoom({ payload }, { call, put, select }) {
      const { roomId } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          API_PATH: API.TOGGLE_BOT_ROOM,
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          filter: { roomId: roomId.roomId, botStatus: roomId.botStatus },
          userId,
          authToken,
        });
        yield put({
          type: 'getStatusBotRoomCompleted',
          payload: {
            data: dataRequest.data.botStatus,
          },
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getNumberRoomRead({ payload }, { call, put, select }) {
      try {
        // let dataRequest = yield POST({
        //     API_PATH: API.GET_ALLROOM_COUNTERS,
        //     baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
        //     filter: {
        //         "filter": {
        //             "where": {
        //             }
        //         },
        //         "type": 'general'
        //     }
        // });
        // if (dataRequest && dataRequest.status && dataRequest.data && dataRequest.data.message) {
        //     let dataResult = dataRequest.data.message;
        //     yield put({
        //         type: TYPES.GET_NUMBER_ROOM_READ_COMPLETED,
        //         countLivechat: dataResult.countLivechat,
        //         countOther: dataResult.countOther
        //     })
        // } else {
        //     throw "Error"
        // }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    // Rocketchat - USER
    *getListUser({ payload, headers }, { call, put, select }) {
      const { params } = payload;
      try {
        let res = yield call(getListUser, headers, params);
        if (res) {
          let dataResult = res.users;
          yield put({
            type: 'getListUserCompleted',
            payload: {
              data: dataResult,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getListAgentFacebook({ payload }, { call, put, select }) {
      const state = yield select(getState);
      const userInfo = state.userInfo;
      const stateWs = yield select(getStateWs);
      let userId = stateWs.chathub_widget_userId;
      let authToken = stateWs.chathub_widget_authToken;
      try {
        let dataRequest = yield GET({
          API_PATH: API.GET_AGENT_FACEBOOK,
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          userId,
          authToken,
        });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data.data.filter((value) => value._id !== userInfo._id);
          yield put({
            type: 'getAgentFacebookCompleted',
            payload: {
              data: dataResult,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getSubscriptionsRead({ payload }, { call, put, select }) {
      const { params } = payload;
      const state = yield select(getState);
      let listRoom = JSON.parse(state.listRoom);
      let notificationState = JSON.parse(state.notification);
      let { typeSocial } = state;
      const { userInfo } = state;
      const stateWs = yield select(getStateWs);
      let userId = stateWs.chathub_widget_userId;
      let authToken = stateWs.chathub_widget_authToken;
      try {
        yield POST({
          API_PATH: API.GET_SUBSCRIPTIONS_READ,
          filter: {
            rid: params.roomId,
          },
          userId,
          authToken,
        });
        let checkRoom = _.findIndex(listRoom, { _id: params.roomId });
        if (checkRoom > -1) {
          if (listRoom[checkRoom].alert) {
            listRoom[checkRoom].alert = null;
            yield put({
              type: 'updateListRoomSubscriptionCompleted',
              payload: {
                data: JSON.stringify(listRoom),
                notification: JSON.stringify(notificationState),
              },
            });
          }
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *uploadImageRoom({ payload }, { call, put, select }) {
      const { params } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield sendFile({
          API_PATH: API.UPLOAD_IMAGE_ROOOM + params.roomId,
          filter: {
            file: params.file,
          },
          userId,
          authToken,
        });
        yield put({
          type: 'getRoomInfoCompleted',
          payload: {
            data: dataRequest,
          },
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    // Rocketchat - LOGIN
    *loginRocketChat({ payload }, { call, put, select }) {
      const { params, socket } = payload;
      try {
        let dataRequest = yield POST({
          API_PATH: API.LOGIN_ROCKETCHAT,
          filter: params,
        });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data.data;
          yield put({
            type: 'loginRocketChatCompleted',
            payload: {
              socket: socket,
              userId: dataResult.userId,
              authToken: dataResult.authToken,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *loginAllChat({ payload }, { call, put, select }) {
      const { params, socket } = payload;
      try {
        let token = params.token;
        let words = token.split('-');
        let timeCheckToken = new Date();
        const md = md5(timeCheckToken.toDateString() + words[2]);
        let dataRequest = yield GET({
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          API_PATH: API.LOGIN_ALLCHAT,
          params: {
            email: params.email,
            token: words[0] + '-' + words[1] + '-' + md,
            // token: params.token
          },
        });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data;
          yield put({
            type: 'loginRocketChatCompleted',
            payload: {
              userId: dataResult.userId,
              authToken: dataResult.authToken,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        yield put({
          type: 'loginRocketChatFail',
        });
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *logoutRocketChat({ payload }, { call, put, select }) {
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          API_PATH: API.LOGOUT_ROCKETCHAT,
          userId,
          authToken,
        });
        if (dataRequest && dataRequest.status) {
          yield put({
            type: 'logoutRocketChatCompleted',
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getToken({ payload }, { call, put, select }) {
      const { params } = payload;
      try {
        if (params.tokenASC) {
          params.socket.send(
            JSON.stringify({
              msg: 'method',
              method: 'login',
              id: IDSocket.LOGIN_SOCKET,
              params: [{ resume: params.tokenASC }],
            }),
          );
        } else if (params.tokenSCCD) {
          params.socket.send(
            JSON.stringify({
              msg: 'method',
              method: 'login',
              id: IDSocket.LOGIN_SOCKET,
              params: [{ resume: params.tokenSCCD }],
            }),
          );
        } else {
          throw 'err';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    // Rocketchat - MESSAGE
    *loadHistory({ payload, headers }, { call, put, select }) {
      const { params } = payload;
      let res = yield call(loadHistory, headers, params);
      if (res && res.msg === 'SUCCESS') {
        yield put({
          type: 'saveKeyNextMessage',
          payload: {
            data:
              res.response.messagesPage.next === null ? 'error' : res.response.messagesPage.next,
          },
        });
        yield put({
          type: 'getListMessage',
          payload: {
            data: res.response.messagesPage.messages,
          },
        });
        yield put({
          type: 'limitMessageSave',
          payload: {
            data: 30,
          },
        });
        // let elment = document.getElementById('chathub-widget-chatBot');
        //     elment.scrollTop = elment.scrollHeight;
      } else {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getListMessage({ payload }, { call, put, select }) {
      let listMess = payload.data.reverse();
      yield put({
        type: 'getListMessageCompleted',
        payload: {
          data: JSON.stringify(listMess),
        },
      });
      let elment = document.getElementById('chathub-widget-chatBot');
      elment.scrollTop = elment.scrollHeight;
    },
    *updateListMessage({ payload }, { call, put, select }) {
      const { data, socket } = payload;
      const state = yield select(getState);
      let { roomInfo } = state;
      let listMessage = JSON.parse(state.listMessage);
      if (listMessage && roomInfo) {
        if (data.rid === roomInfo._id) {
          if (data.urls) {
            if (data.urls[0].parsedUrl) {
              listMessage.push(data);
              yield put({
                type: 'getListMessageCompleted',
                payload: {
                  data: JSON.stringify(listMessage),
                },
              });
            }
          } else {
            listMessage.push(data);
            yield put({
              type: 'getListMessageCompleted',
              payload: {
                data: JSON.stringify(listMessage),
              },
            });
          }
        }
      }
    },
    // Rocketchat - ME
    *getMe({ payload }, { call, put, select }) {
      const { authorization } = payload;
      try {
        let dataRequest = yield GET({ API_PATH: API.GET_ME, authorization: authorization });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data;
          // if (dataResult.statusLivechat !== 'available') {
          //     socket.send(JSON.stringify(
          //         {
          //             "msg": "method",
          //             "method": "livechat:changeLivechatStatus",
          //             "params": [],
          //             "id": IDSocket.CHANGE_STATUS_LIVECHAT
          //         }
          //     ))
          // } else {

          // }
          yield put({
            type: 'websocket/status_livechat',
            payload: {
              statusLivechat: dataResult.statusLivechat
                ? dataResult.statusLivechat
                : 'not-available',
            },
          });
          yield put({
            type: 'getMeCompleted',
            payload: {
              data: dataResult,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getStatusBotRoom({ payload }, { call, put, select }) {
      const { roomId } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield GET({
          API_PATH: API.GET_STATUS_BOT_ROOM + roomId,
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          userId,
          authToken,
        });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data;
          yield put({
            type: 'getStatusBotRoomCompleted',
            payload: {
              data: dataResult.botStatus,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    // Rocketchat - FORWARD
    *leaveGroup({ payload }, { call, put, select }) {
      const { params } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          API_PATH: API.LEAVE_GROUP,
          filter: params,
          authToken,
          userId,
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *inviteGroup({ payload }, { call, put, select }) {
      const { params } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          API_PATH: API.INVITE_GROUP,
          filter: params,
          authToken,
          userId,
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *leaveChannel({ payload }, { call, put, select }) {
      const { params } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          API_PATH: API.LEAVE_CHANNEL,
          filter: params,
          authToken,
          userId,
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *inviteChannel({ payload }, { call, put, select }) {
      const { params } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          API_PATH: API.INVITE_CHANNEL,
          filter: params,
          userId,
          authToken,
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    // Rocketchat - SAVE CHAT
    *saveChat({ payload }, { call, put, select }) {
      const { params } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          API_PATH: API.SAVE_CHAT,
          filter: params,
          authToken,
          userId,
        });
        yield put({
          type: 'saveChatCompleted',
          payload: {
            data: dataRequest.data,
          },
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    // Rocketchat - SETTING UPDATE
    *settingUpdate({ payload }, { call, put, select }) {
      const { value } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          API_PATH: API.SETTING_UPDATE,
          filter: value,
          authToken,
          userId,
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    // Rocketchat - CHANNEL SET CUSTOM FILE
    *channelsSetCustomFields({ payload }, { call, put, select }) {
      const { param } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield POST({
          API_PATH: API.GROUP_SETCUSTOMFIELDS,
          filter: param,
          authToken,
          userId,
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    // Rocketchat - FILE
    *getGroupFile({ payload }, { call, put, select }) {
      const { roomId } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield GET({
          API_PATH: API.GET_GROUP_FILE + '?roomId=' + roomId,
          userId,
          authToken,
        });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data;
          let dataFile = dataResult.files
            .filter((value) => value.typeGroup == 'application' || value.typeGroup == 'text')
            .sort((a, b) => {
              return new Date(b._updatedAt) - new Date(a._updatedAt);
            });
          let dataImageVideo = dataResult.files
            .filter((value) => value.typeGroup == 'image' || value.typeGroup == 'video')
            .sort((a, b) => {
              return new Date(b._updatedAt) - new Date(a._updatedAt);
            });
          yield put({
            type: 'getGroupFileCompleted',
            payload: {
              dataFile: dataFile,
              dataImageVideo: dataImageVideo,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getChannelFile({ payload }, { call, put, select }) {
      const { roomId } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield GET({
          API_PATH: API.GET_CHANNEL_FILE + '?roomId=' + roomId,
          userId,
          authToken,
        });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data;
          let dataFile = dataResult.files
            .filter(
              (value) => value.type.search('image') === -1 && value.type.search('video') === -1,
            )
            .sort((a, b) => {
              return new Date(b._updatedAt) - new Date(a._updatedAt);
            });
          let dataImageVideo = dataResult.files
            .filter(
              (value) => value.type.search('image') !== -1 || value.type.search('video') !== -1,
            )
            .sort((a, b) => {
              return new Date(b._updatedAt) - new Date(a._updatedAt);
            });
          yield put({
            type: 'getChannelFileCompleted',
            payload: {
              dataFile: dataFile,
              dataImageVideo: dataImageVideo,
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getVisitorsInfo2({ payload }, { call, put, select }) {
      try {
        const { id } = payload;
        const stateWs = yield select(getUser);
        const { tokenGateway } = stateWs;
        const res = yield GET2({
          API_PATH: `/api/crm-service/customer/visitor-info/${id}`,
          authorization: tokenGateway,
        });
        if (res.code === 200) {
          yield put({
            type: 'getCMVisitorInfoCompleted',
            payload: {
              data: { visitor_info: res.response.data },
            },
          });
        }
      } catch (err) {
        console.log(err);
        yield put({
          type: 'getCMVisitorInfoCompleted',
          payload: {
            data: { visitor_info: {} },
          },
        });
      }
    },
    *getCustomerInfo({ payload }, { call, put, select }) {
      try {
        const { phone } = payload;
        const stateWs = yield select(getUser);
        const { tokenGateway } = stateWs;
        const res = yield GET2({
          API_PATH: `/api/crm-service/customer/phone/${phone}`,
          authorization: tokenGateway,
        });
        if (res.code === 200) {
          yield put({
            type: 'getCMCustomerInfoCompleted',
            payload: {
              data: res.response.data,
            },
          });
        }
      } catch (err) {
        console.log(err);
        yield put({
          type: 'getCMCustomerInfoCompleted',
          payload: {
            data: {},
          },
        });
      }
    },
    *getFiles({ payload }, { call, put, select }) {
      try {
        const { roomId } = payload;
        const stateWs = yield select(getUser);
        const { tokenGateway } = stateWs;
        const res = yield GET2({
          API_PATH: `/api/smcc-chat-service/message/attachments?roomId=${roomId}&type=MISC`,
          authorization: tokenGateway,
        });
        if (res.code === 200) {
          yield put({
            type: 'getGroupFileCompleted',
            payload: {
              data: res.response.messagesPage.attachmentDtos,
            },
          });
        }
      } catch (err) {
        console.log(err);
        yield put({
          type: 'getGroupFileCompleted',
          payload: {
            data: {},
          },
        });
      }
    },
    *getImageVideo({ payload }, { call, put, select }) {
      try {
        const { roomId } = payload;
        const stateWs = yield select(getUser);
        const { tokenGateway } = stateWs;
        const res = yield GET2({
          API_PATH: `/api/smcc-chat-service/message/attachments?roomId=${roomId}&type=IMAGE_VIDEO`,
          authorization: tokenGateway,
        });
        if (res.code === 200) {
          yield put({
            type: 'getGroupImageVideoCompleted',
            payload: {
              data: res.response.messagesPage.attachmentDtos,
            },
          });
        }
      } catch (err) {
        console.log(err);
        yield put({
          type: 'getGroupImageVideoCompleted',
          payload: {
            data: {},
          },
        });
      }
    },
    *getVisitorsInfo({ payload }, { call, put, select }) {
      try {
        const { id } = payload;
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield GET({
          API_PATH: API.GET_VISITORS_INFO + '?visitorId=' + id,
          userId,
          authToken,
        });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data;
          if (dataResult?.visitor?.livechatData?.phone) {
            let filter = {
              where: {
                'phones.phone': dataResult.visitor.livechatData.phone,
              },
            };
            let dataRequestCusList = yield GET({
              baseURL: process.env.URL_API_CM,
              API_PATH: API.CM_CUSTOMER_LIST + `?filter=${JSON.stringify(filter)}`,
              userId,
              authToken,
            });
            if (
              dataRequestCusList &&
              dataRequestCusList.status &&
              (dataRequestCusList.status === 200 || dataRequestCusList.status === 304) &&
              dataRequestCusList.data?.data.length > 0 &&
              dataRequestCusList.data?.data[0]._id
            ) {
              yield put({
                type: 'getCMCustomerInfoCompleted',
                payload: {
                  data: dataRequestCusList.data.data[0],
                },
              });
            }
          }
          yield put({
            type: 'getVisitorsInfoCompleted',
            payload: {
              data: dataResult.visitor,
            },
          });
        } else {
          yield put({
            type: 'getVisitorsInfoCompleted',
            payload: {
              data: null,
            },
          });
          throw 'Error';
        }
      } catch (e) {
        yield put({
          type: 'getVisitorsInfoCompleted',
          payload: {
            data: null,
          },
        });
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống 2.',
          placement: 'topRight',
        });
      }
    },
    *searchChat({ payload }, { call, put, select }) {
      const { params } = payload;
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let dataRequest = yield GET({
          API_PATH: API.SEARCH_CHAT,
          params: params,
          authToken,
          userId,
        });
        if (
          dataRequest &&
          dataRequest.status &&
          (dataRequest.status === 200 || dataRequest.status === 304) &&
          dataRequest.data
        ) {
          let dataResult = dataRequest.data;
          yield put({
            type: 'searchChatCompleted',
            payload: {
              data: JSON.stringify(dataResult.messages),
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    // Widget
    *countUnread({ payload }, { call, put, select }) {
      const { params } = payload;
      const stateWs = yield select(getStateWs);
      let userId = stateWs.chathub_widget_userId;
      let authToken = stateWs.chathub_widget_authToken;
      let authorization = stateWs.smart_contact_authorization;

      try {
        let dataRequest = yield GET({
          API_PATH: API.ROOM_UNREAD,
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          userId,
          authToken,
          authorization,
        });
        let dataResult = [];
        if (dataRequest && dataRequest.status) {
          dataResult = dataRequest.data;
          yield put({
            type: 'countUnreadCompleted',
            payload: {
              data: JSON.stringify(dataResult),
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *updateCountUnread({ payload }, { call, put, select }) {
      const { data, status } = payload;
      const state = yield select(getState);
      let listRoom = JSON.parse(state.listRoom);
      let userInfo = state.userInfo;
      let notification = JSON.parse(state.notification);
      // let typeSocial = state.typeSocial;
      let roomInfo = null,
        botStatus = false;
      const stateWs = yield select(getStateWs);
      let userId = stateWs.chathub_widget_userId;
      let authToken = stateWs.chathub_widget_authToken;
      let authorization = stateWs.smart_contact_authorization;
      try {
        if (status === 'updated') {
          let dataRequestRoomInfo = yield GET({
            API_PATH: API.GET_ROOM_INFO + '?roomId=' + data.rid,
            userId,
            authToken,
            authorization,
          });
          if (
            dataRequestRoomInfo &&
            dataRequestRoomInfo.status &&
            (dataRequestRoomInfo.status === 200 || dataRequestRoomInfo.status === 304) &&
            dataRequestRoomInfo.data
          ) {
            roomInfo = dataRequestRoomInfo.data.room;
          }
          if (data.alert) {
            if (data.t === 'p') {
              if (roomInfo) {
                let dataRequestStatus = yield GET({
                  API_PATH: API.GET_STATUS_BOT_ROOM + data._id,
                  baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
                });
                if (dataRequestStatus && dataRequestStatus.status === 200) {
                  botStatus = dataRequestStatus.data.botStatus;
                }
                if (dataRequestStatus && dataRequestStatus.status === 200) {
                  if (
                    roomInfo.customFields &&
                    roomInfo.customFields.agentSupport &&
                    userInfo &&
                    userInfo.username === roomInfo.customFields.agentSupport
                  ) {
                    notification.facebookYourChat = notification.facebookYourChat + 1;
                  }
                  if (
                    !(roomInfo.customFields && roomInfo.customFields.agentSupport) &&
                    !dataRequestStatus.data.botStatus
                  ) {
                    notification.facebookOther = notification.facebookOther + 1;
                  }
                  notification.facebookAll = notification.facebookAll + 1;
                }
              }
            }
            if (data.t === 'l') {
              notification.livechat = notification.livechat + 1;
            }
          } else if (
            roomInfo &&
            roomInfo.lastMessage &&
            roomInfo.lastMessage.u &&
            roomInfo.lastMessage.u._id &&
            roomInfo.lastMessage.u._id !== userId
          ) {
            if (data.t === 'p') {
              let dataRequestStatus = yield GET({
                API_PATH: API.GET_STATUS_BOT_ROOM + data._id,
                baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
              });
              if (dataRequestStatus && dataRequestStatus.status === 200) {
                if (
                  roomInfo.customFields &&
                  roomInfo.customFields.agentSupport &&
                  userInfo &&
                  userInfo.username === roomInfo.customFields.agentSupport
                ) {
                  notification.facebookYourChat = notification.facebookYourChat - 1;
                }
                if (
                  !(roomInfo.customFields && roomInfo.customFields.agentSupport) &&
                  !dataRequestStatus.data.botStatus
                ) {
                  notification.facebookOther = notification.facebookOther - 1;
                }
                notification.facebookAll = notification.facebookAll - 1;
              }
            }
            if (data.t === 'l') {
              notification.livechat = notification.livechat - 1;
            }
          }
        }
        yield put({
          type: 'countUnreadCompleted',
          payload: {
            data: JSON.stringify(notification),
          },
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *updateCountUnreadRealtime({ payload }, { call, put, select }) {
      try {
        const stateWs = yield select(getStateWs);
        let userId = stateWs.chathub_widget_userId;
        let authToken = stateWs.chathub_widget_authToken;
        let authorization = stateWs.smart_contact_authorization;

        let dataRequest = yield GET({
          API_PATH: API.ROOM_UNREAD,
          baseURL: process.env.URL_API_SERVICE_COLLAB_CHAT,
          userId,
          authToken,
          authorization,
        });
        let dataResult = [];
        if (dataRequest && dataRequest.status) {
          dataResult = dataRequest.data;
          yield put({
            type: 'countUnreadCompleted',
            payload: {
              data: JSON.stringify(dataResult),
            },
          });
        } else {
          throw 'Error';
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *forwardUser({ payload, headers }, { call }) {
      const { params } = payload;
      try {
        let res = yield call(forwardMessage, headers, params);

        if (res && res.msg === 'SUCCESS') {
          openNotificationSuccess('Thành công!!', 'Chuyển tiếp thành công.');
        } else {
          openNotificationError('Thất bại!!', 'Chuyển tiếp thất bại.');
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *doneRoom({ payload, headers }, { call }) {
      const { params } = payload;
      try {
        let res = yield call(doneRoom, headers, params);
        if (res && res.msg === 'SUCCESS') {
          openNotificationSuccess('Thành công!!', 'Đóng cuộc hội thoại thành công.');
        } else {
          openNotificationError('Thất bại!!', 'Đóng cuộc hội thoại thất bại.');
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *rollBackForward({ payload, headers }, { call }) {
      const { params } = payload;
      try {
        let res = yield call(rollBackForward, headers, params);
        if (res && res.msg === 'SUCCESS') {
          openNotificationSuccess('Thành công!!', 'Thu hồi chuyển tiếp thành công.');
        } else {
          openNotificationError('Thất bại!!', 'Thu hồi chuyển tiếp thất bại.');
        }
      } catch (error) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *receive({ payload, headers }, { call, put, select }) {
      try {
        let { params, data } = payload;
        let res = yield call(receive, headers, params, data);
        // approved
        const state = yield select(getState);
        const roomParams = {
          status: state.typeRoom,
          filter: state.typeMessage,
          type: state.typeSocial === TYPE_ROOM_WIDGET.CHATALL ? '' : state.typeSocial,
        };
        const notiResponse = yield call(requestListRoom, headers, roomParams);
        if (notiResponse && notiResponse.msg === 'Ok') {
          let processing =
            notiResponse && notiResponse.response
              ? notiResponse.response.roomsInfo.processing
              : null;
          let waiting =
            notiResponse && notiResponse.response ? notiResponse.response.roomsInfo.waiting : null;
          yield put({
            type: 'notificationSave',
            payload: {
              processing,
              waiting,
            },
          });
        }
        if (res && res.msg === 'SUCCESS') {
          openNotificationSuccess('Thành công!!', 'Đã chấp nhận cuộc hội thoại thành công.');
        } else {
          openNotificationError('Thất bại!!', 'Đã chấp nhận cuộc hội thoại thất bại.');
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *receiveTransition({ payload, headers }, { call, put, select }) {
      try {
        let { params, data } = payload;
        let res = yield call(receiveTransition, headers, params, data);
        // allow
        if (res && res.msg === 'SUCCESS') {
          openNotificationSuccess('Thành công!!', 'Đã chấp nhận cuộc hội thoại thành công.');
        } else {
          openNotificationError('Thất bại!!', 'Đã chấp nhận cuộc hội thoại thất bại.');
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *rejectTransition({ payload, headers }, { call, put, select }) {
      try {
        let { params } = payload;
        let res = yield call(rejectTransition, headers, params);
        if (res && res.msg === 'SUCCESS') {
          openNotificationSuccess('Thành công!!', 'Đã từ chối cuộc hội thoại thành công.');
        } else {
          openNotificationError('Thất bại!!', 'Đã từ chối cuộc hội thoại thất bại.');
        }
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *sendMessage({ payload, headers }, { call, put, select }) {
      try {
        const { params, data } = payload;
        let res = yield call(sendMessage, headers, params, data);
        const state = yield select(getState);

        const roomParams = {
          status: state.typeRoom,
          filter: state.typeMessage,
          type: state.typeSocial === TYPE_ROOM_WIDGET.CHATALL ? '' : state.typeSocial,
        };
        // append message
        const message = {
          senderId: state.roomInfo.agent.id,
          recipientId: state.roomInfo.customFields.dataInfoDto.id,
          text: data.text,
          timestamp: new Date(Date.now()).toJSON(),
        };
        let listMessage = JSON.parse(state.listMessage);
        let newListMessage = listMessage.concat([message]);
        yield put({
          type: 'getListMessageCompleted',
          payload: {
            data: JSON.stringify(newListMessage),
          },
        });
        let elment = document.getElementById('chathub-widget-chatBot');
        elment.scrollTop = elment.scrollHeight;
        if (res) {
          if (res.msg !== 'SUCCESS') {
            notification.error({
              message: 'Gửi tin nhắn thất bại.',
              placement: 'topRight',
            });
          }
          yield put({
            type: 'loadHistory',
            payload: {
              params: {
                roomId: params.roomId,
                limit: 30,
              },
            },
            headers: headers,
          });
          let elment = document.getElementById('chathub-widget-chatBot');
          elment.scrollTop = elment.scrollHeight;

          const roomResponse = yield call(requestListRoom, headers, roomParams);
          let rooms = {};
          if (roomResponse && roomResponse.msg === 'Ok') {
            rooms = roomResponse.response.roomsInfo.rooms;
            yield put({
              type: 'updateListRoomCompleted',
              payload: {
                data: JSON.stringify(rooms),
                typeSocial: state.typeSocial,
                typeRoom: state.typeRoom,
                typeMessage: state.typeMessage,
              },
            });
          }
        }
      } catch (error) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *sendMessageWithAttachments({ payload, headers }, { call, put, select }) {
      try {
        const { data } = payload;
        let res = yield call(sendMessageWithAttachments, headers, data);
        const state = yield select(getState);
        const roomParams = {
          status: state.typeRoom,
          filter: state.typeMessage,
          type: state.typeSocial === TYPE_ROOM_WIDGET.CHATALL ? '' : state.typeSocial,
        };
        const base64 = data.get('files');
        const type = base64?.type?.includes('image')
          ? 'image'
          : base64?.type?.includes('video')
          ? 'video'
          : 'file';
        const message = {
          senderId: state.roomInfo.agent.id,
          recipientId: state.roomInfo.customFields.dataInfoDto.id,
          text: '',
          timestamp: new Date(Date.now()).toJSON(),
          attachments: [{ type: type, payloadUrl: base64.preview }],
        };
        let listMessage = JSON.parse(state.listMessage);
        let messageT = listMessage;
        if (data.get('text') !== null) {
          const messageText = {
            senderId: state.roomInfo.agent.id,
            recipientId: state.roomInfo.customFields.dataInfoDto.id,
            text: data.get('text'),
            timestamp: new Date(Date.now()).toJSON(),
          };
          messageT = messageT.concat([messageText]);
        }
        let newListMessage = messageT.concat([message]);
        yield put({
          type: 'getListMessageCompleted',
          payload: {
            data: JSON.stringify(newListMessage),
          },
        });
        let elment = document.getElementById('chathub-widget-chatBot');
        elment.scrollTop = elment.scrollHeight;

        if (res) {
          if (res.msg !== 'SUCCESS') {
            notification.error({
              message: 'Gửi tin nhắn thất bại.',
              placement: 'topRight',
            });
          }
          yield put({
            type: 'loadHistory',
            payload: {
              params: {
                roomId: state.roomInfo.id,
                limit: 30,
              },
            },
            headers: headers,
          });
          yield put ({
            type: 'getFiles',
            payload: {
              roomId: state.roomInfo.id,
            }
          });
          yield put ({
            type: 'getImageVideo',
            payload: {
              roomId: state.roomInfo.id,
            }
          });
          let elment = document.getElementById('chathub-widget-chatBot');
          elment.scrollTop = elment.scrollHeight;

          const roomResponse = yield call(requestListRoom, headers, roomParams);
          let rooms = {};
          if (roomResponse && roomResponse.msg === 'Ok') {
            rooms = roomResponse.response.roomsInfo.rooms;
            yield put({
              type: 'updateListRoomCompleted',
              payload: {
                data: JSON.stringify(rooms),
                typeSocial: state.typeSocial,
                typeRoom: state.typeRoom,
                typeMessage: state.typeMessage,
              },
            });
          }
        }
      } catch (error) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *getSubscriptions({ payload }, { call, put, select }) {
      const { data } = payload;
      const state = yield select(getState);
      let roomSubscription = state.roomSubscription;

      const stateWs = yield select(getStateWs);
      let userId = stateWs.chathub_widget_userId;
      let authToken = stateWs.chathub_widget_authToken;
      let username = stateWs.chathub_widget_userName;
      try {
        let result = yield getNotificationBySubscription({
          subs: data,
          rooms: JSON.parse(roomSubscription),
          username,
        });
        yield put({
          type: 'notificationCompleted',
          payload: {
            data: JSON.stringify(result),
          },
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *updateNotificationSubscription({ payload }, { call, put, select }) {
      const { data, status } = payload;
      const state = yield select(getState);
      let roomSubscription = state.roomSubscription ? JSON.parse(state.roomSubscription) : null;
      let listSubscription = state.listSubscription ? JSON.parse(state.listSubscription) : null;
      let userInfo = state.userInfo;
      let notificationSubscription = state.notificationSubscription
        ? JSON.parse(state.notificationSubscription)
        : null;
      try {
        let result = yield updateNotificationBySubscription({
          sub: data,
          rooms: roomSubscription,
          listSubscription,
          notificationSubscription,
          status,
          userInfo,
        });
        yield put({
          type: 'notificationCompleted',
          payload: {
            data: JSON.stringify(result),
          },
        });
      } catch (e) {
        notification.error({
          message: 'Đã gặp sự cố .Vui lòng F5 hoặc liên hệ đơn vị vận hành hệ thống.',
          placement: 'topRight',
        });
      }
    },
    *updateRoomSubscriptions({ payload }, { call, put, select }) {
      const { data, status } = payload;
      const state = yield select(getState);
      let roomSubscription = state.roomSubscription ? JSON.parse(state.roomSubscription) : [];
      try {
        if (status === 'inserted') {
          roomSubscription.push(data);
          yield put({
            type: 'getRoomSubscriptionCompleted',
            payload: {
              data: roomSubscription.length > 0 ? JSON.stringify(roomSubscription) : null,
            },
          });
        }
        if (status === 'updated') {
          let checkRoom = _.findIndex(roomSubscription, { _id: data._id });
          roomSubscription.splice(checkRoom, 1);
          roomSubscription.push(data);
          yield put({
            type: 'getRoomSubscriptionCompleted',
            payload: {
              data: roomSubscription.length > 0 ? JSON.stringify(roomSubscription) : null,
            },
          });
        }
        if (status === 'removed' && roomSubscription.length > 0) {
          let checkRoom = _.findIndex(roomSubscription, { _id: data.rid });
          if (checkRoom > -1) {
            roomSubscription.splice(checkRoom, 1);
            yield put({
              type: 'getRoomSubscriptionCompleted',
              payload: {
                data: roomSubscription.length > 0 ? JSON.stringify(roomSubscription) : null,
              },
            });
          }
        }
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
    calling(state, { payload }) {
      if (state.userInfo.username !== payload.userName) {
        return {
          ...state,
          calling: payload.data,
          link_calling: payload.link,
        };
      }
      return {
        ...state,
      };
    },
    saveKeyNextMessage(state, { payload }) {
      return {
        ...state,
        keyNextMessage: payload.data,
      };
    },
    notificationSave(state, { payload }) {
      return {
        ...state,
        processing: payload.processing,
        waiting: payload.waiting,
      };
    },
    getListMessageCompleted(state, { payload }) {
      return {
        ...state,
        listMessage: payload.data,
        loadingMessage: true,
      };
    },
    getRoomInfoCompleted(state, { payload }) {
      return {
        ...state,
        roomInfo: payload.data,
      };
    },
    limitMessageSave(state, { payload }) {
      return {
        ...state,
        limitMessage: payload.data,
      };
    },
    getRoomInfoISCCompleted(state, { payload }) {
      return {
        ...state,
        roomInfoISC: payload.data,
      };
    },
    getListRoomCompleted(state, { payload }) {
      return {
        ...state,
        listRoom: payload.data,
        lengthLivechat: payload.lengthLivechat,
        lengthDefault: payload.lengthDefault,
        typeRoom: payload.typeRoom,
        maxLength: payload.maxLength,
        typeSocial: payload.typeSocial,
        loading: true,
      };
    },
    getListSubscriptionCompleted(state, { payload }) {
      return {
        ...state,
        listSubscription: payload.data,
        loading: true,
      };
    },
    updateListRoomCompleted(state, { payload }) {
      return {
        ...state,
        listRoom: payload.data,
        typeSocial: payload.typeSocial,
        typeRoom: payload.typeRoom,
        typeMessage: payload.typeMessage,
        loading: true,
      };
    },
    removeRoomCompleted(state, { payload }) {
      return {
        ...state,
        listRoom: payload.data,
        loading: true,
      };
    },
    updateListRoomSubscriptionCompleted(state, { payload }) {
      return {
        ...state,
        listRoom: payload.data,
        notification: payload.notification,
        loading: true,
      };
    },
    loadListRoomCompleted(state, { payload }) {
      return {
        ...state,
        listRoom: payload.data,
        loading: true,
      };
    },
    searchRoomWebCompleted(state, { payload }) {
      return {
        ...state,
        listRoom: payload.data,
        loading: true,
      };
    },
    uploadImageRoomCompleted(state, { payload }) {
      return {
        ...state,
        images: payload.data,
      };
    },
    getListUserCompleted(state, { payload }) {
      return {
        ...state,
        listUser: payload.data,
      };
    },
    getAgentFacebookCompleted(state, { payload }) {
      return {
        ...state,
        listUser: payload.data,
      };
    },
    getMeCompleted(state, { payload }) {
      return {
        ...state,
        userInfo: payload.data,
      };
    },
    resetState(state, { payload }) {
      return {
        ...initialState,
        userInfo: state.userInfo,
        typeRoom: state.typeRoom,
        notification: state.notification,
        showInfo: state.showInfo,
        typeSocial: state.typeSocial,
        numberRoomRead: state.numberRoomRead,
        numberRoomReadLiveChat: state.numberRoomReadLiveChat,
      };
    },
    resetListMessage(state, { payload }) {
      return {
        ...state,
        listMessage: null,
        loadingMessage: false,
      };
    },
    getGroupFileCompleted(state, { payload }) {
      return {
        ...state,
        groupFile: payload.data,
      };
    },
    getGroupImageVideoCompleted(state, { payload }) {
      return {
        ...state,
        groupImageVideo: payload.data,
      };
    },
    logoutRocketChatCompleted(state, { payload }) {
      return {
        ...initialState,
      };
    },
    setText(state, { payload }) {
      return {
        ...state,
        text: payload.value,
      };
    },
    getNumberRoomReadCompleted(state, { payload }) {
      return {
        ...state,
        numberRoomRead: payload.countOther,
        numberRoomReadLiveChat: payload.countLivechat,
      };
    },
    getChannelFileCompleted(state, { payload }) {
      return {
        ...state,
        groupFile: payload.dataFile,
        groupImageVideo: payload.dataImageVideo,
      };
    },
    getVisitorsInfoCompleted(state, { payload }) {
      return {
        ...state,
        visitorsInfoLivechat: payload.data,
      };
    },
    getCMVisitorInfoCompleted(state, { payload }) {
      return {
        ...state,
        visitorsInfo: payload.data.visitor_info ? payload.data.visitor_info : null,
        // customerInfo: payload.data.customer_info?._id ? payload.data.customer_info : null,
      };
    },
    setLoading(state, { payload }) {
      return {
        ...state,
        loading: payload.data,
      };
    },
    getStatusBotRoomCompleted(state, { payload }) {
      return {
        ...state,
        statusBot: payload.data,
      };
    },
    saveChatCompleted(state, { payload }) {
      return {
        ...state,
        statusSaveChat: payload.data,
      };
    },
    getAllRoomOfflineCompleted(state, { payload }) {
      return {
        ...state,
        listRoomOffline: payload.data,
        lengthRoomOffline: payload.maxLength,
        loading: true,
      };
    },
    updateActiveRoom(state, { payload }) {
      return {
        ...state,
        activeRoom: payload.data,
      };
    },
    countUnreadCompleted(state, { payload }) {
      return {
        ...state,
        notification: payload.data,
      };
    },
    setRoomInfo(state, { payload }) {
      return {
        ...state,
        roomInfo: payload.data,
      };
    },
    getCMCustomerInfoCompleted(state, { payload }) {
      return {
        ...state,
        customerInfo: payload.data,
      };
    },
    searchCMCustomerInfoCompleted(state, { payload }) {
      return {
        ...state,
        listCustomerInfo: payload.data,
      };
    },
    searchChatCompleted(state, { payload }) {
      return {
        ...state,
        listMessagesSearch: payload.data,
      };
    },
    getRoomSubscriptionCompleted(state, { payload }) {
      return {
        ...state,
        roomSubscription: payload.data,
      };
    },
    notificationCompleted(state, { payload }) {
      return {
        ...state,
        notificationSubscription: payload.data,
      };
    },
  },
};

export default Model;
