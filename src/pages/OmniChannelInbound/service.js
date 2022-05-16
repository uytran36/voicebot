import request from '@/utils/request';
import api from '@/api';

// const urlSetting = 'http://172.30.13.180:4009'

export async function requestUpdateConfigLiveChat(headers, data) {
  return request(`${api.ACCESS_SERVICE}/smart-contact-center/livechat-settings`, {
    method: 'PATCH',
    headers,
    data,
  });
}

export async function requestGetConfigLiveChat(headers, listField) {
  return request(`${api.ROCKET_CHAT}/settings.public`, {
    method: 'GET',
    headers,
    params: {
      query: {
        "_id": {
          "$in": listField
        }
      }
    }
  });
}

export async function requestGetFacebookSetting(headers) {
  return request(`${api.ACCESS_SERVICE}/facebook/service/setting`, {
    method: 'GET',
    headers
  });
}

export async function requestGetFacebookInfo(headers, id) {
  return request(`${api.ACCESS_SERVICE}/facebook/${id}`, {
    method: 'GET',
    headers
  });
}

export async function requestUpdateConfigSetting(headers, data) {
  return request(`${api.ACCESS_SERVICE}/smart-contact-center/setting`, {
    method: 'PATCH',
    headers,
    data
  });
}

export async function requestConfigFacebookSetting(headers, data) {
  return request(`${api.ACCESS_SERVICE}/facebook/setting`, {
    method: 'POST',
    headers,
    data
  });
}

export async function requestGetZaloSetting(headers) {
  return request(`${api.ACCESS_SERVICE}/zalo/setting/default`, {
    method: 'GET',
    headers
  });
}

export async function requestConfigZaloSetting(headers, data) {
  return request(`${api.ACCESS_SERVICE}/zalo/set-profile`, {
    method: 'POST',
    headers,
    data
  });
}

