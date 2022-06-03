import request from '@/utils/request';
import api from '@/api';
import { requestUpdateUser } from '@/services/user-management';

export async function requestUpdateCurrentUser(headers, data) {
  return requestUpdateUser(headers, data);
}

export async function requestUploadAvatar(headers, data) {
  return request(`${api.ROCKET_CHAT}/users.setAvatar`, {
    method: 'POST',
    headers,
    data,
  });
}
