import request from '@/utils/request';
import api from '@/api'

export async function testRole() {
  return request(`${api.ROCKET_CHAT}/roles.list`, {
    method: 'GET',
    headers: {
      'X-Auth-Token': 'qGeQcnFG95iP9XZS0uag4uOXnx7TweUMaL9EhvgPs9S',
      'X-User-Id': '893RY6y8uuB9d5kXQ',
    },
  });
}

export async function testPermission() {
  return request(`${api.ROCKET_CHAT}/permissions.listAll`, {
    method: 'GET',
    headers: {
      'X-Auth-Token': 'qGeQcnFG95iP9XZS0uag4uOXnx7TweUMaL9EhvgPs9S',
      'X-User-Id': '893RY6y8uuB9d5kXQ',
    },
  });
}

export async function updatePermission(data) {
  return request(`${api.ROCKET_CHAT}/permissions.update`, {
    method: 'POST',
    headers: {
      'X-Auth-Token': 'qGeQcnFG95iP9XZS0uag4uOXnx7TweUMaL9EhvgPs9S',
      'X-User-Id': '893RY6y8uuB9d5kXQ',
    },
    data,
  });
}
