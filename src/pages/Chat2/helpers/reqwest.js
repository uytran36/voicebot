import reqwest from 'reqwest';
import * as TYPE_ROOM_WIDGET from '../constants/TypeRoomWidget';
import api from '@/api';

const reqwestLiveChat = ({
  callback,
  basePath = api.UMI_API_BASE_URL,
  path,
  status,
  type,
  typeRoom,
  typeSocial,
  typeMessage,
  userId,
  authToken,
  authorization,
}) => {
  reqwest({
    url: basePath + path + '?status=' + status + '&type=' + type,
    type: 'json',
    method: 'get',
    contentType: 'application/json',
    headers: {
      'X-Auth-Token': authToken,
      'X-User-Id': userId,
      Authorization: authorization,
    },
    success: (res) => {
      let rooms = {};
      if (
        (typeMessage === TYPE_ROOM_WIDGET.HANDLE_MESSENGE &&
          typeSocial === TYPE_ROOM_WIDGET.CHATALL) ||
        (typeMessage === TYPE_ROOM_WIDGET.FORWARD_MESSENGE &&
          typeSocial === TYPE_ROOM_WIDGET.CHATALL)
      ) {
        rooms = res && res.response ? res.response.roomsInfo.rooms.reverse() : null;
      } else {
        rooms = res && res.response ? res.response.roomsInfo.rooms : null;
      }
      let processing = res && res.response ? res.response.roomsInfo.processing : null;
      let waiting = res && res.response ? res.response.roomsInfo.waiting : null;
      callback({
        rooms,
        typeRoom,
        typeSocial,
        typeMessage,
        processing,
        waiting,
      });
    },
  });
};
const reqwestRoom = ({
  callback,
  basePath = process.env.URL_API_SERVICE_COLLAB_CHAT,
  path,
  typeRoom,
  typeSocial,
  typeMessage,
  userId,
  authToken,
  authorization,
}) => {
  reqwest({
    url: basePath + path,
    type: 'json',
    method: 'get',
    contentType: 'application/json',
    headers: {
      'X-Auth-Token': authToken,
      'X-User-Id': userId,
      Authorization: authorization,
    },
    success: (res) => {
      let rooms = {};
      if (
        (typeMessage === TYPE_ROOM_WIDGET.HANDLE_MESSENGE &&
          typeSocial === TYPE_ROOM_WIDGET.CHATALL) ||
        (typeMessage === TYPE_ROOM_WIDGET.FORWARD_MESSENGE &&
          typeSocial === TYPE_ROOM_WIDGET.CHATALL)
      ) {
        rooms = res && res.data ? res.data.reverse() : null;
      } else {
        rooms = res && res.data ? res.data : null;
      }
      callback({
        rooms,
        typeRoom,
        typeSocial,
        typeMessage,
      });
    },
  });
};

const reqwestPostCallback = ({
  callback,
  basePath = process.env.URL_API_SERVICE_COLLAB_CHAT,
  apiPath,
  userId,
  authToken,
  filter,
}) => {
  reqwest({
    url: basePath + apiPath,
    type: 'json',
    method: 'post',
    contentType: 'application/json',
    headers: {
      'X-Auth-Token': authToken,
      'X-User-Id': userId,
    },
    data: filter,
    success: (res) => {
      callback({
        res,
      });
    },
    error: (err) => {
      callback({
        err,
      });
    },
  });
};
const reqwestCMS = ({
  callback,
  callbackErr,
  basePath = process.env.URL_API_CM,
  apiPath,
  userId,
  authToken,
  filter,
  method,
  authorization,
}) => {
  reqwest({
    url: basePath + apiPath,
    type: 'json',
    method: method,
    contentType: 'application/json',
    headers: {
      'X-Auth-Token': authToken,
      'X-User-Id': userId,
      Authorization: authorization,
    },
    data: filter,
    success: (res) => {
      callback(res);
    },
    error: (err) => {
      callbackErr(err);
    },
  });
};
const reqwestUpdateCM = ({
  callback,
  callbackErr,
  basePath = process.env.UMI_API_BASE_URL,
  apiPath,
  roomId,
  data,
  authorization,
}) => {
  reqwest({
    url: basePath + apiPath + `?roomId=${roomId}`,
    type: 'json',
    method: 'put',
    contentType: 'application/json',
    headers: {
      Authorization: authorization,
    },
    data,
    success: (res) => {
      callback(res);
    },
    error: (err) => {
      callbackErr(err);
    },
  });
};
const reqwestListPhone = ({
  callback,
  callbackErr,
  basePath = process.env.UMI_API_BASE_URL,
  apiPath,
  search,
  authorization,
}) => {
  reqwest({
    url: basePath + apiPath + `?search=${search}`,
    type: 'json',
    method: 'get',
    headers: {
      Authorization: authorization,
    },
    success: (res) => {
      callback(res);
    },
    error: (err) => {
      callbackErr(err);
    },
  });
};
const reqwestCustomerInfo = ({
  callback,
  callbackErr,
  basePath = process.env.UMI_API_BASE_URL,
  apiPath,
  authorization,
}) => {
  reqwest({
    url: basePath + apiPath,
    type: 'json',
    method: 'get',
    headers: {
      Authorization: authorization,
    },
    success: (res) => {
      callback(res);
    },
    error: (err) => {
      callbackErr(err);
    },
  });
};
const reqwestLog = ({
  callback,
  callbackErr,
  basePath = process.env.UMI_API_BASE_URL,
  apiPath,
  customerId,
  authorization,
}) => {
  reqwest({
    url: basePath + apiPath + '?customerId=' + customerId,
    type: 'json',
    method: 'get',
    headers: {
      Authorization: authorization,
    },
    success: (res) => {
      callback(res);
    },
    error: (err) => {
      callbackErr(err);
    },
  });
};
export {
  reqwestRoom,
  reqwestPostCallback,
  reqwestCMS,
  reqwestLog,
  reqwestLiveChat,
  reqwestUpdateCM,
  reqwestListPhone,
  reqwestCustomerInfo,
};
