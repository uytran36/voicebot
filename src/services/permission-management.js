import request from '@/utils/request';
import api from '@/api';
import { endpoint } from './auth';

export async function requestGetPermissions(headers, data) {
  return request(`${endpoint}/user/get_role_in_permission`, {
    method: 'POST',
    headers,
    data,
  })
  // return request(`${api.ACCESS_SERVICE}/permissions`, {
  //   method: 'GET',
  //   params,
  //   headers,
  // })
}

export async function requestUpdatePermission(headers, data) {
  return request(`${endpoint}/user/update_role_in_permission`, {
    method: 'POST',
    headers,
    data,
  });
  // return request(`${api.ACCESS_SERVICE}/permissions.update`, {
  //   method: 'POST',
  //   headers,
  //   data,
  // });
}


export async function getPermissionByRoleId(headers, roleId) {
  return request(`${endpoint}/user/get_permission_by_role_id`, {
    method: 'POST',
    headers,
    data: {
      role_id: roleId,
    },
  });
}