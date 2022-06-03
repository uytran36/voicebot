import request from '@/utils/request';
import api from '@/api';

export async function requestGetNotificationSettings(headers) {
  return request(`${api.NOTIFICATION_SERVICE}/notifications/settings`, {
    method: 'GET',
    headers,
  });
}

export async function requestUpdateNotificationSettings(data, headers) {
  return request(`${api.NOTIFICATION_SERVICE}/notifications/settings`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestUpdateNotificationReceive(headers, data) {
  return request(`${api.NOTIFICATION_SERVICE}/notifications/receive/update`, {
    headers,
    data,
    method: 'POST',
  });
}
