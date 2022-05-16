import request from '@/utils/request';
import api from '@/api';
import { endpoint } from './auth';

export async function updateUserStatus(headers, arrayID, status) {
  const data = {
    users_id: arrayID,
    state: status,
  };

  return request(`${endpoint}/user/update_state_user`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestGetUserInfo(headers, data) {
  if (data)
    return request(`${endpoint}/user/get_user_by_id`, {
      method: 'POST',
      headers,
      data,
    });
  else
    return request(`${endpoint}/user/my_info`, {
      method: 'POST',
      headers,
    });
}

export async function requestRoleList(headers) {
  return request(`${endpoint}/user/get_roles`, {
    method: 'POST',
    headers,
    data: {},
  });
}

export async function requestDepartmentUnitList(headers) {
  return request(`${endpoint}/user/get_unit_department`, {
    method: 'POST',
    headers,
  });
}

export async function requestGetUserList(headers, data) {
  return request(`${endpoint}/user/get_user`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestUpdateUser(headers, data, APItype) {
  let url = `${endpoint}/user/update_profile`;
  if (APItype !== 'update-my-profile') url = `${endpoint}/user/update_profile_for_admin`;
  return request(url, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestUpdateUserStatus(headers, data) {
  return request(`${endpoint}/api/auth/users/update/status`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function getListUser(headers, params) {
  return request(`${endpoint}/api/auth/users/except`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function uploadImage(headers, data) {
  return request(`${endpoint}/user/upload_avatar_user`, {
    method: 'POST',
    headers,
    data,
  });
}
