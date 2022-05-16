import request from '@/utils/request';
import api from '@/api';
import { endpoint } from './auth';

export async function requestRoleList(headers, data) {
  return request(`${endpoint}/user/get_roles`, {
    method: 'POST',
    headers,
    data,
  });
  // return request(`${api.ACCESS_SERVICE}/roles.list`, {
  //     method: 'GET',
  //     headers,
  //     params,
  // });
}

export async function requestUserCreateRole(headers) {
  return request(`${endpoint}/user/get_user_create_role`, {
    method: 'POST',
    headers,
  });
}

export async function requestCreateRole(headers, data) {
  return request(`${endpoint}/user/add_role`, {
    method: 'POST',
    headers,
    data,
  });

  // return request(`${api.ACCESS_SERVICE}/roles/new`, {
  //     method: 'POST',
  //     headers,
  //     data
  // })
}


export async function requestGetPermissionByRoleId(headers, roleId) {
  return request(`${endpoint}/user/get_permission_by_role_id`, {
    method: 'POST',
    headers,
    data: {
      role_id: roleId,
    },
  });
}

export async function requestUpdateRole(headers, data) {
  return request(`${endpoint}/user/update_role`, {
    method: 'POST',
    headers,
    data,
  });
  // return request(`${api.ACCESS_SERVICE}/roles/update/${id}`, {
  //     method: 'PATCH',
  //     headers,
  //     data
  // })
}

/**
 * Delete role
 * @param {Object} headers
 * @param {string[]} data
 * @returns {Promise<object>}
 */
export async function requestDeleteRole(headers, data) {
  console.log("data", data)
  return request(`${endpoint}/user/delete_role`, {
    method: 'POST',
    headers,
    data,
  });
  // return request(`${api.ACCESS_SERVICE}/roles/delete/${id}`, {
  //     method: 'DELETE',
  //     headers,
  // })
}

export async function requestGetRoleWithRoleName(headers, params) {
  // return request(`${api.ROCKET_CHAT}/permissions.listAll`, {
  return request(`${api.ACCESS_SERVICE}/roles/permission-list`, {
    method: 'GET',
    headers,
    params
  })
}

export async function requestUpdatePermission(headers, data) {
  return request(`${api.ACCESS_SERVICE}/permissions.update`, {
    method: 'POST',
    headers,
    data,
  });
}


