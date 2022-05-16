import request from '@/utils/request';
import api from '@/api';

// const api = 'http://172.30.12.146:3010';
// export const api = 'http://172.27.228.157:3010';

/**
 * @param {Object} filter - one of type below;
 * @param {Object} headers
 * @returns {Array} response.data
 * @returns {String} response.error
 * @returns {Boolean} response.success
 */
export async function requestGetCustomers(filter, headers = {}) {
  return request(`${api.CM_SERVICE}/api/v1/crm-service/customer/list`, {
    method: 'GET',
    headers,
    params: {
      filter: {
        offset: 0,
        limit: 100,
        skip: 0,
        order: 'string',
        where: {
          additionalProp1: {},
        },
        fields: {
          _id: true,
          name: true,
          dateOfBirth: true,
          alias: true,
          age: true,
          gender: true,
          phones: true,
          addresses: true,
          email: true,
          facebook: true,
          zalo: true,
          groups: true,
          description: true,
          xlsContactObject: true,
          createdBy: true,
          createdAt: true,
          updatedBy: true,
          updatedAt: true,
        },
        ...filter,
      },
    },
  });
}

/**
 * @param {String} userId
 * @param {Object} headers
 * @returns {<Promise> Object} - Detail customer
 */
export async function requestGetCustomer(userId, headers = {}) {
  return request(`${api.CRM_SERVICE}/customer/${userId}`, {
    method: 'GET',
    headers,
  });
}

/**
 * @param {String} customerID
 * @param {Object} body
 * @param {Object} headers
 * @returns {<Promise> Object} - response
 */
export async function requestUpdateCustomer(customerID, body, headers = {}) {
  return request(`${api.CRM_SERVICE}/customer/update/${customerID}`, {
    method: 'PUT',
    headers,
    data: body,
  });
}

/**
 * @param { String[] } listCustomerId
 * @param {Object} headers
 * @returns {<Promise> Object} - response
 */
export async function requestDeleteCustomers(listCustomerId, headers = {}) {
  return request(`${api.CRM_SERVICE}/customer/delete`, {
    method: 'DELETE',
    headers,
    data: listCustomerId,
  });
}

/**
 * @param {Object} body
 * @param {Object} headers
 * @returns {<Promise> Object} - response
 */
export async function requestCreateCustomer(body, headers = {}) {
  return request(`${api.CRM_SERVICE}/customer/new`, {
    method: 'POST',
    headers,
    data: body,
  });
}

export async function requestGetCustomersOfGroup(params = {}, headers = {}) {
  return request(`${api.CRM_SERVICE}/customer/list-of-group`, {
    method: 'GET',
    headers,
    params: {
      search: '',
      groupId: '',
      offset: 0,
      ...params,
    },
  });
}

export async function requestExportCustomer(filter = {}, headers = {}) {
  return request(`${api.CRM_SERVICE}/customer/list-of-group/export`, {
    method: 'GET',
    headers,
    params: {
      columns: [].toString(),
      members: [].toString(),
      // isSelectAll: true,
      // offset: 0,
      // limit: 100,
      ...filter,
    },
  });
}

/**
 * @param {Object} filter - one of type below;
 * @param {Object} headers
 * @returns {Array} response.data
 * @returns {String} response.error
 * @returns {Boolean} response.success
 */
export async function requestGetGroups(filter, headers = {}) {
  return request(`${api.CRM_SERVICE}/group/list`, {
    method: 'GET',
    headers,
    params: { offset: 0, limit: 20, search: '', ...filter },
  });
}

export async function requestGetGroup(groupId, headers) {
  return request(`${api.CRM_SERVICE}/group/detail/${groupId}`, {
    method: 'GET',
    headers,
  });
}

/**
 * @param {Object} body
 * @param {Object} headers
 * @returns {<Promise> Object} - response
 */
export async function requestCreateGroup(body, headers) {
  return request(`${api.CRM_SERVICE}/group/new`, {
    method: 'POST',
    headers,
    data: body,
  });
}

/**
 * @param {String []} groupIds
 * @param {Object} headers
 * @returns {<Promise> Object} - response
 */
export async function requestDeleteGroup(groupIDs, headers) {
  return request(`${api.CRM_SERVICE}/group/delete`, {
    method: 'DELETE',
    headers,
    data: {
      groupIds: groupIDs,
    },
  });
}

/**
 * @param {String} groupId
 * @param {Object} body
 * @param {Object} headers
 * @returns {<Promise> Object} - response
 */
export async function requestUpdateGroup(groupId, body, headers) {
  return request(`${api.CRM_SERVICE}/group/update/${groupId}`, {
    method: 'POST',
    headers,
    params: {
      ...body,
    },
  });
}

/**
 * @param {Object} body
 * @param {Object} headers
 * @returns {<Promise> Object} - response
 */
export async function requestImportCustomer(body, headers = {}) {
  console.log(body);
  return request(`${api.CRM_SERVICE}/customer/import`, {
    method: 'POST',
    headers,
    data: body,
  });
}

/**
 * @param {Object} body
 * @param {Object} headers
 * @returns {<Promise> Object} - response
 */
export async function requestAddCustomersToGroup(body, headers) {
  return request(`${api.CRM_SERVICE}/group/add-members`, {
    method: 'POST',
    headers,
    data: body,
  });
}

export async function requestDeleteCustomersInGroup(body, headers) {
  return request(`${api.CRM_SERVICE}/group/remove-customer`, {
    method: 'DELETE',
    headers,
    params: body,
  });
}

/**
 *
 * @param {String} params.facebook
 * @param {String} params.zalo
 * @param {String} params.page
 * @param {String} params.sort
 * @param {String} params.limit
 * @param {Object} headers
 * @returns {Object}
 */
export async function requestHistoryCustomer(headers, params) {
  return request(`${api.CRM_SERVICE}/customer/all-history`, {
    method: 'GET',
    headers,
    params,
  });
  // return historyCustomer;
}

export async function exportHistoryCustomer(headers, params) {
  return request(`${api.CRM_SERVICE}/customer/all-history/export`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function exportHistoryChatCustomer(headers, params) {
  return request(`${api.CRM_SERVICE}/customer/history-chat/export`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function requestFetchHistoryCustomerChat(headers, params) {
  return request(`${api.CRM_SERVICE}/customer/history-chat`, {
    method: 'GET',
    headers,
    params,
  });
}
