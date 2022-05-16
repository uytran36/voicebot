import request from '@/utils/request';
import api from '@/api';

export async function requestCreateVocieBot(data) {
  return request(`${api.VOICE_SERVICE}/voicebot/create`, {
    method: 'POST',
    data,
  });
}

export async function requestGetSipProfile(headers) {
  return request(`${api.VOICE_SERVICE}/pbx-sip-profiles`, {
    method: 'GET',
    headers,
  });
}

export async function requestCallVocieBot(data) {
  return request(`${api.VOICE_SERVICE}/call`, {
    method: 'POST',
    data,
  });
}

// export async function requestTestCall(data) {
//   return request(`${'http://172.30.12.139:3002'}/fsLog/broadcastLog`, {
//     method: 'POST',
//     data,
//   });
// }
