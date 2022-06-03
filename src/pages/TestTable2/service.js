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

export async function updatePermission(headers, data) {
  return request(`${api.ROCKET_CHAT}/permissions.update`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestGetPermission(headers, params) {
  return request(`${api.ACCESS_SERVICE}/permissions`, {
    method: 'GET',
    params,
    headers
  });
}

// http://172.27.228.157:8762/smart-contact-center-platform-chat-service/api/v1/permission?filter={"where":{"or":[{"group_name": "VoiceBot"}, {"group_name": "OmniChatInbound"}]}}

//http://172.27.228.157:8762/smart-contact-center-platform-chat/api/v1/permission?filter={"where":{"or":[{"group_name":"VoiceBot"},{"group_name":"OmniChatInbound"}]}}
