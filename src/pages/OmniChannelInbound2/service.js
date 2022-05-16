import request from '@/utils/request';
import api from '@/api';

// const urlSetting = 'http://172.30.13.180:4009'

// export async function requestUpdateConfigLiveChat(headers, data) {
//   return request(`${api.ACCESS_SERVICE}/smart-contact-center/livechat-settings`, {
//     method: 'PATCH',
//     headers,
//     data,
//   });
// }

// export async function requestGetConfigLiveChat(headers, listField) {
//   return request(`${api.ROCKET_CHAT}/settings.public`, {
//     method: 'GET',
//     headers,
//     params: {
//       query: {
//         _id: {
//           $in: listField,
//         },
//       },
//     },
//   });
// }

export async function requestGetConfigLiveChat(headers) {
  return request(`${api.CHAT_SERVICE}/live-chat/config`, {
    method: 'GET',
    headers,
  });
}

export async function requestUploadAvatar(headers, data) {
  return request(`${api.CHAT_SERVICE}/live-chat/upload-avatar`, {
    method: 'POST',
    headers,
    data
  });
}

export async function requestUpdateConfigLiveChat(headers, data) {
  console.log(data);
  return request(`${api.CHAT_SERVICE}/live-chat/config`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestGetFacebookSetting(headers) {
  return request(`${api.ACCESS_SERVICE}/facebook/service/setting`, {
    method: 'GET',
    headers,
  });
}

export async function requestGetFacebookInfo(headers, id) {
  return request(`${api.ACCESS_SERVICE}/facebook/${id}`, {
    method: 'GET',
    headers,
  });
}

export async function requestUpdateConfigSetting(headers, data) {
  return request(`${api.ACCESS_SERVICE}/smart-contact-center/setting`, {
    method: 'PATCH',
    headers,
    data,
  });
}

export async function requestConfigFacebookSetting(headers, data) {
  return request(`${api.ACCESS_SERVICE}/facebook/setting`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestGetZaloSetting(headers) {
  return request(`${api.ACCESS_SERVICE}/zalo/setting/default`, {
    method: 'GET',
    headers,
  });
}

export async function requestConfigZaloSetting(headers, data) {
  return request(`${api.ACCESS_SERVICE}/zalo/set-profile`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestGetListPageFacebook(headers, params = {}) {
  return request(`${api.CHAT_SERVICE}/fb-pages`, {
    headers,
    params,
  });
}

export async function requestGetListPageFacebookSubcribe(headers, params = {}) {
  return request(`${api.CHAT_SERVICE}/fb-pages/page-subscribe`, {
    headers,
    params,
  });
}

export async function requestSubcribePageFacebook(headers, data = {}) {
  return request(`${api.CHAT_SERVICE}/fb-pages/subscribe`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestUnsubcribePageFacebook(headers, params = {}) {
  return request(`${api.CHAT_SERVICE}/fb-pages/unsubscribe`, {
    method: 'POST',
    headers,
    params,
  });
}

export async function requestGetAccessToken(params = {}) {
  return request(`https://graph.facebook.com/v12.0/oauth/access_token`, {
    method: 'GET',
    params,
  });
}

export async function requestGetZaloOA(headers) {
  return request(`${api.CHAT_SERVICE}/zalo-page/zaloOA-info`, {
    headers,
  });
}

export async function requestUpdateZaloOA(headers, params = {}, data = {}) {
  return request(`${api.CHAT_SERVICE}/zalo-page/update-page`, {
    method: 'POST',
    headers,
    params,
    data,
  });
}

export async function requestSubcribeZaloOA(headers, data = {}) {
  return request(`${api.CHAT_SERVICE}/zalo-page/subscribe`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestInfoZaloOA(headers, params = {}) {
  return request(`${api.CHAT_SERVICE}/zalo-page/zaloOA-info-token`, {
    headers,
    params,
  });
}

export async function requestDeleteZaloOA(headers, params = {}) {
  return request(`${api.CHAT_SERVICE}/zalo-page/delete-page`, {
    method: 'POST',
    headers,
    params,
  });
}
