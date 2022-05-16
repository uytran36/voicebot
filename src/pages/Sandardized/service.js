import request from '@/utils/request';
import api from '@/api';

export async function requestUpdateNormalizations(headers, data) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-addupdate`, {
    method: "POST",
    headers,
    data
  })
}

export async function requestContactHistories(headers, params) {
  return request(`${api.CM_SERVICE}/api/v1/xls-contact-list-histories`, {
    method: 'GET',
    headers,
    params
  })
}

export async function requestDeleteContactHistory(headers, id) {
  if(!id) {
    return Promise.reject(new Error('Missing id.'))
  }
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-base-all-child/${id}`, {
    method: 'DELETE',
    headers
  })
}

export async function requestContactNormalizations(headers, params) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-only-xlscontactobject`, {
    method: 'GET',
    headers,
    params
  })
}

export async function requestGetOmniContactListBase(headers, params) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-bases`, {
    method: 'GET',
    headers,
    params
  })
}

export async function requestOmniContactListNormalization(headers, params) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations`, {
    method: 'GET',
    headers,
    params
  })
}

export async function requestCheckDataDNC(headers, data) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-check-dnc`, {
    method: 'POST',
    headers,
    data
  })
}

export async function reuqestDeleteContactListNormalization (headers, id) {
  if(!id) {
    return Promise.reject(new Error('Missing id.'))
  }
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-all-child/${id}`, {
    method: 'DELETE',
    headers
  })
}
