import request from '@/utils/request';
import api from '@/api';

// export async function requestGetStatusAgent(headers, params) {
//   return request(`${api.VOICE_SERVICE}/pbx/agent/status`, {
//     method: 'GET',
//     headers,
//     params,
//   });
// }

export async function requestGetStatusAgent(headers, params) {
  return request(`${api.CALLCENTER_SERVICE}/agents/status`, {
    method: 'GET',
    headers,
    params,
  });
}

// export async function requestUpdateStatusAgent(headers, data) {
//   return request(`${api.VOICE_SERVICE}/pbx/agent/status`, {
//     method: 'PUT',
//     headers,
//     data,
//   });
// }

export async function requestUpdateStatusAgent(headers, data) {
  return request(`${api.CALLCENTER_SERVICE}/agents/status`, {
    method: 'POST',
    headers,
    data,
  });
}
