import request from '@/utils/request';
import api from '@/api'

export async function requestGetLiveChat(headers, params) {
  return request(`${api.ROCKET_CHAT}/livechat/rooms`, {
    method: 'GET',
    headers: {
      'X-Auth-Token': headers.authToken,
      'X-User-Id': headers.userId,
    },
    params,
  });
}

export async function requestListUserToForward(header, params) {
  return request(`${api.ROCKET_CHAT}/users.autocomplete`, {
    method: 'GET',
    headers: {
      'X-Auth-Token': header.authToken,
      'X-User-Id': header.userId,
    },
    params: {
      selector: {
        ...params
      }
    }
  })
}

export async function requestForwardLivechatRoom(header, data) {
  return request(`${api.ROCKET_CHAT}/livechat/room.forward`, {
    method: 'POST',
    headers: {
      'X-Auth-Token': header.authToken,
      'X-User-Id': header.userId,
    },
    data
  })
}
