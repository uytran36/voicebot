import request from '@/utils/request';
import { requestGetUserList } from '@/services/user-management';
import {
  requestOmniContactListNormalization,
  requestUpdateNormalizations,
} from '@/pages/Sandardized/service';
import api from '@/api';

export const requestListPbxCallQueue = (headers, params) => {
  return request(`${api.REPORT_SERVICE}/v1/report/pbx-call/call-queue/find`, {
    method: 'GET',
    headers,
    params: {
      filter: params,
    },
  });
};

export const requestHistoryCallSupervisor = (headers, params) => {
  return request(`${api.REPORT_SERVICE}/call-center/supervisor-history-call`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestHistoryCallAgent = (headers, params) => {
  return request(`${api.REPORT_SERVICE}/call-center/agent-history-call`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestCallCenterQueue = async (headers = {}, params) => {
  return request(`${api.VOICE_SERVICE}/call-center/queue`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestGetOmniContactListNormalizationEditInfo = async (headers, sdt, params) => {
  return request(`${api.CM_SERVICE}/api/v1/crm-service/customer/find-info/${sdt}`, {
    method: 'GET',
    headers,
    params,
  });
  return {
    id: '604af44078b1e5101b5ef011',
    sdt: '0984456148',
    ten: 'NVA1',
    ho_va_ten: 'Nguyễn Văn E',
    alias: 'A1',
    age: 30,
    gender: 'male',
    money: 52215,
    money_symbol: 'vnd',
    xlsContactObject: {
      id: '604af41878b1e529845ef003',
      tentailieu: '123',
      filename_raw: 'excel upload mini.xlsx',
      mota: '',
      createdBy: 'trieutq3',
      ordinal: 0,
      createdAt: '2021-03-12T04:54:48.145Z',
      updatedAt: '2021-03-12T04:54:48.145Z',
    },
    xlsContactListHistory: '604af41878b1e529845ef003',
    omniContactListHistory: 'string',
    createdBy: 'trieutq3',
    createdAt: '2021-03-12T04:54:48.152Z',
    updatedAt: '2021-03-12T04:54:48.152Z',
  };
};

export { requestGetUserList, requestOmniContactListNormalization, requestUpdateNormalizations };
