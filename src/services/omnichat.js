import reqwest from 'reqwest';
import request from '@/utils/request';
import * as TYPE_ROOM_WIDGET from '../pages/Chat2/constants/TypeRoomWidget';
import api from '@/api';

export const baseURL = api.UMI_API_BASE_URL;
export const roomPath = '/api/smcc-chat-service/room';
export const messagePath = '/api/smcc-chat-service/message';
export async function requestListRoom(headers, params) {
  return request(`${baseURL + roomPath}`, {
    method: 'GET',
    headers,
    params,
  });
}
export async function loadHistory(headers, params) {
  return request(`${baseURL + messagePath}`, {
    method: 'GET',
    headers,
    params,
  });
}
export async function sendMessage(headers, params, data) {
  return request(`${baseURL + messagePath}/send`, {
    method: 'POST',
    headers,
    params,
    data,
  });
}
export async function sendMessageWithAttachments(headers, data) {
  return request(`${baseURL + messagePath}/send-message`, {
    method: 'POST',
    headers,
    data
  })
}
export async function receive(headers, params, data) {
  return request(`${baseURL + roomPath}/approved`, {
    method: 'POST',
    headers,
    params,
    data,
  });
}
export async function receiveTransition(headers, params, data) {
  return request(`${baseURL + roomPath}/allow`, {
    method: 'POST',
    headers,
    params,
    data,
  });
}
export async function rejectTransition(headers, params) {
  return request(`${baseURL + roomPath}/denied`, {
    method: 'POST',
    headers,
    params,
  });
}
export async function forwardMessage(headers, params) {
  return request(`${baseURL + roomPath }/forward`, {
    method: 'POST',
    headers,
    params
  })
}
export async function doneRoom(headers, params) {
  return request(`${baseURL + roomPath }/close/${params.roomId}`, {
    method: 'POST',
    headers,
  })
}
export async function rollBackForward(headers, params) {
  return request(`${baseURL + roomPath}/rollback`, {
    method: 'POST',
    params,
    headers
  })
}
