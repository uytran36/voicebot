import request from '@/utils/request';
import { endpoint } from './auth';

export async function requestFetchDataList(headers, params) {

  return request(`${endpoint}/campaign/get_call_data`, {
    method: 'POST',
    headers,
    body: JSON.stringify(params)
  });
}

export async function requestDeleteExcelData(headers, data) {
  return request(`${endpoint}/campaign/delete_call_data`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}

export async function requestDownloadExcelData(headers, data) {
  return request(`${endpoint}/campaign/download_excel_data`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
}

export async function requestDownloadLink(headers, url) {
  return request(url, {
    method: 'GET',
    headers,
    responseType: 'blob',
  });
}

export async function requestSaveValidatedExcel(headers, data) {
  return request(`${endpoint}/campaign/save_validated_excel_rows`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestDeleteAPIData(headers, data) {
  return request(`${endpoint}/campaign/delete_configuration_call_data_by_api`, {
    method: 'POST',
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
}

export async function requestDeleteAPIDataExport(headers, data) {
  return request(`${endpoint}/campaign/delete_return_call_data_by_api`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function requestCreateAPIData(headers, data) {
  return request(`${endpoint}/campaign/create_configuration_call_data_by_api`, {
    method: 'POST',
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
}

export async function requestCreateAPIDataExport(headers, data) {
  return request(`${endpoint}/campaign/created_return_data_by_api`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function requestUpdateAPIData(headers, data) {
  return request(`${endpoint}/campaign/update_configuration_call_data_by_api`, {
    method: 'POST',
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
}
export async function requestUpdateAPIDataExport(headers, data) {
  return request(`${endpoint}/campaign/update_return_call_data_by_api`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
export async function requestfetchAPIData(headers, params) {
  return request(`${endpoint}/campaign/get_configuration_call_data_by_api`, {
    method: 'POST',
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });
}
export async function requestfetchAPIDataExport(headers, params) {
  return request(`${endpoint}/campaign/get_return_call_data_by_api`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
}

export async function requestTestLoadAPIData(headers, data) {
  return request(`${endpoint}/campaign/get_example_data`, {
    method: 'POST',
    headers: {
      ...headers,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}