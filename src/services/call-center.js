import request from '@/utils/request';
import api from '@/api';
import { endpoint } from './auth';

export const requestGetOmniContactListNormalizationFindInfo = async (headers, sdt, params) => {
  // return request(`${api.CM_SERVICE}/api/v1/crm-service/customer/find-info/${sdt}`, {
  //   method: 'GET',
  //   headers,
  //   params,
  // });
  return request(`${api.CRM_SERVICE}/customer/info/${sdt}`, {
    method: 'GET',
    headers,
    params,
  });
  /**
   * return {
        "id": "604af44078b1e5101b5ef011",
        "sdt": "0984456148",
        "ten": "NVA1",
        "ho_va_ten": "Nguyễn Văn E",
        "alias": "A1",
        "age": 30,
        "gender": "male",
        "money": 52215,
        "money_symbol": "vnd",
        "xlsContactObject": {
            "id": "604af41878b1e529845ef003",
            "tentailieu": "123",
            "filename_raw": "excel upload mini.xlsx",
            "mota": "",
            "createdBy": "trieutq3",
            "ordinal": 0,
            "createdAt": "2021-03-12T04:54:48.145Z",
            "updatedAt": "2021-03-12T04:54:48.145Z"
        },
        "xlsContactListHistory": "604af41878b1e529845ef003",
        "omniContactListHistory": "string",
        "createdBy": "trieutq3",
        "createdAt": "2021-03-12T04:54:48.152Z",
        "updatedAt": "2021-03-12T04:54:48.152Z"
    }
   */
};

// export async function requestUpdateOmniContactListNormalizationEditInfo (headers, params, data) {
//   // return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-edit-info`, {
//   return request(`${api.CM_SERVICE}/api/v1/crm-service/customer/update`, {
//   // return request(
//   //   `${'http://172.27.228.157:8762/smart-contact-center-contact-list-management/api/v1'}/omni-contact-list-normalizations-edit-info`,
//   //   {
//       method: 'PATCH',
//       headers,
//       params,
//       data,
//     },
//   );
// }

export async function requestUpdateOmniContactListNormalizationEditInfo(headers, data) {
  return request(`${api.CRM_SERVICE}/customer`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestCallHistroyUpdate(sessionId, body, headers = {}) {
  return request(`${api.REPORT_SERVICE}/v1/report/pbx-call/call-history/update/${sessionId}`, {
    method: 'POST',
    headers,
    data: body,
  });
}

export async function requestGetLogCallEvent(body, headers = {}) {
  return request(
    `${api.UMI_API_BASE_URL}/smart-contact-center-logger-service/callEvents/logCallEvent`,
    {
      method: 'POST',
      headers,
      data: body,
    },
  );
}
// http://{{url}}/call-center/customer-history-call?sort={"xml_cdr_uuid" : 1}&page=1&limit=10&phone=0388827774
export const requestHistoryCallSupervisor = async (headers, params) => {
  // return request(`${api.REPORT_SERVICE}/call-center/supervisor-history-call`, {
  return request(`${api.REPORT_SERVICE}/call-center/customer-history-call`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestGetRegstrations = async (headers = {}, params) => {
  return request(`${api.UMI_API_BASE_URL}/api/auth/users/except`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestGetPbxExtensions = async (headers = {}) => {
  return request(`${api.VOICE_SERVICE}/pbx/extensions`, {
    method: 'GET',
    headers,
  });
};

export const requestExportCustomerHistoryCall = async (params, headers = {}) => {
  return request(`${api.REPORT_SERVICE}/call-center/customer-history-call/export`, {
    method: 'GET',
    headers,
    params,
  });
};

/**
 *
 * @param {Object} params.sip_call_id
 * @param {Object} headers
 * @returns {Object}
 */
export const requestGetDetailCall = async (params, headers = {}) => {
  return request(`${api.REPORT_SERVICE}/api/v1/call-history/call-detail`, {
    method: 'GET',
    headers,
    params,
  });
};

/**
 *
 * @param {Object} params.search
 * @param {Object} headers
 * @returns {Object}
 */
export const requestHistoryCall = async (headers, params) => {
  return request(`${api.CALLCENTER_SERVICE}/call-manage/history-call`, {
    method: 'GET',
    headers,
    params,
  });
  // return request(`${api.REPORT_SERVICE}/api/v1/call-history`, {
  //   method: 'GET',
  //   headers,
  //   params,
  // });
};

/**
 *
 * @param {Object} params.search
 * @param {Object} headers
 * @returns {Object}
 */
export const requestExportHistoryCall = async (headers, params) => {
  return request(`${api.CALL_CENTER}/call-manage/history-call/export`, {
    method: 'GET',
    headers,
    params,
  });
};

/**
 *
 * @param {Object} params.sip_call_id
 * @param {Object} headers
 * @returns {Object}
 */
export const requestAddNoteToCalling = async (params, data, headers = {}) => {
  return request(`${api.CALLCENTER_SERVICE}/call-manage/call-history/call-detail`, {
    method: 'PUT',
    headers,
    params,
    data,
  });
};

/**
 *
 * @param {Object} params
 * @param {Object} headers
 * @returns {Object}
 */
export const requestGetListUserNameAgent = async (params, headers = {}) => {
  return request(`${api.COLLAB_SERVICE}/api/v1/rocketchat-users`, {
    method: 'GET',
    headers,
    params,
  });
};

/**
 *
 * @param {Object} headers
 * @returns {Object}
 */
export const requestGetListExtensions = async (headers = {}, params = {}) => {
  return request(`${api.CALLCENTER_SERVICE}/extensions`, {
    method: 'GET',
    headers,
    params,
  });
};

/**
 *
 * @param {Object} headers
 * @returns {Object}
 */
export const requestMonitorCallInbound = async (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/calls`, {
    method: 'GET',
    headers,
    params,
  });
  return {
    code: 200,
    msg: 'SUCCESS',
    response: {
      data: [
        {
          id: '7a71c525-de55-4fd1-b234-bbf3a6184d83',
          direction: 'inbound',
          callNumber: '0938697503',
          callName: 'Pham Ba Phuc',
          recipientNumber: '101',
          recipientName: 'admin1',
          callStartTime: '08:53:44',
          callPickupTime: null,
          status: 'RINGING',
          time: '2021-11-19T01:53:44.000+00:00',
        },
        {
          id: 'e81ff48e-d01c-46d6-beeb-7dcdc05d154f',
          direction: 'inbound',
          callNumber: '0938697503',
          callName: 'Pham Ba Phuc',
          recipientNumber: '103',
          recipientName: 'admin',
          callStartTime: '08:53:44',
          callPickupTime: null,
          status: 'ACTIVE',
          time: '2021-11-19T01:53:44.000+00:00',
        },
        {
          id: '020ee3af-68d5-4ffa-9f52-aaec3428b00e',
          direction: 'inbound',
          callNumber: '0938697503',
          callName: 'Pham Ba Phuc',
          recipientNumber: '102',
          recipientName: 'test123142345',
          callStartTime: '08:53:44',
          callPickupTime: null,
          status: 'ACTIVE',
          time: '2021-11-19T01:53:44.000+00:00',
        },
      ],
    },
  };
};
/**
 *
 * @param {Object} headers
 * @returns {Object}
 */
export const requestHistoryCallCampaign = async (headers = {}, params) => {
  return request(`${api.REPORT_SERVICE}/api/v1/campaign-call-history`, {
    method: 'GET',
    headers,
    params,
  });
  console.log({ params });
  return {
    success: true,
    length: 2,
    data: [
      {
        xml_cdr_uuid: '0b0f8f14-cd0e-435d-b0a0-2fc7e637637b',
        status: 'FAILURE',
        note: null,
        sip_call_id: 'a831c526-7144-123a-2e98-020003fe000c',
        scc_campaign_id: null,
        direction: null,
        caller_id_number: '0000000000',
        caller_name: 'SCC-SYSTEM',
        destination_number: '0982303283',
        destination_name: '',
        start_epoch: '1628246041',
        start_stamp: '2021-08-06T10:34:01.000Z',
        answer_stamp: '2021-08-06T10:34:15.000Z',
        answer_epoch: '1628246055',
        end_epoch: '1628246085',
        end_stamp: '2021-08-06T10:34:45.000Z',
        duration: 30,
      },
      {
        xml_cdr_uuid: '4b75f331-27f4-4cfc-a84f-9d9e523e9cfd',
        status: 'SUCCESS',
        note: null,
        sip_call_id: 'X7B3SoVfCsPzg3WsrtHocQ..',
        scc_campaign_id: null,
        direction: 'outbound',
        caller_id_number: '100',
        caller_name: '100',
        destination_number: '0763991550',
        destination_name: '0763991550',
        start_epoch: '1626422981',
        start_stamp: '2021-07-16T08:09:41.000Z',
        answer_stamp: null,
        answer_epoch: '0',
        end_epoch: '1626422981',
        end_stamp: '2021-07-16T08:09:41.000Z',
        duration: null,
      },
    ],
  };
};
/**
 *
 * @param {Object} headers
 * @returns {Object}
 */
export const requestExportHistoryCallCampaign = async (headers = {}, params) => {
  return request(`${api.REPORT_SERVICE}/api/v1/campaign-call-history/export`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestLocalStatistic = (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/switchboard/report/local`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestExportLocalStatistic = (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/switchboard/report/local/export`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestOutboundStatictis = (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/switchboard/report/outbound`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestExportOutboundStatictis = (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/switchboard/report/outbound/export`, {
    headers,
    params,
    method: 'GET',
  });
};
/**
 *
 * @param {Object} headers
 * @param {Object} params.agentName
 * @param {Object} params.endDate
 * @param {Object} params.hotline
 * @param {Object} params.phoneCustomer
 * @param {Object} params.queueNum
 * @param {Object} params.startDate
 * @param {Object} params.typeChart
 * @returns {Object}
 */
export const requestGeneralStatistic = async (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/switchboard/report/general`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestExportGeneralStatistic = (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/switchboard/report/general/export`, {
    headers,
    params,
    method: 'GET',
  });
};
/**

/**
 *
 * @param {Object} headers
 * @param {Object} params.agentName
 * @param {Object} params.endDate
 * @param {Object} params.hotline
 * @param {Object} params.phoneCustomer
 * @param {Object} params.queueNum
 * @param {Object} params.startDate
 * @param {Object} params.typeChart
 * @returns {Object}
 */
export const requestInboundCallStatistic = async (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/switchboard/report/inbound`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestExportInboundCallStatistic = async (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/switchboard/report/inbound/export`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestMonitorAgentTable = async (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/agents`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestChangeAgentStatus = async (headers = {}, params, data) => {
  return request(`${api.CALLCENTER_SERVICE}/agents/status`, {
    method: 'POST',
    headers,
    params,
    data,
  });
};

export const requestMonitorQueueOverview = async (headers = {}, params) => {
  return request(`${api.CALLCENTER_SERVICE}/queue`, {
    method: 'GET',
    headers,
    params,
  });
};

export const requestMonitorQueueDetail = async (headers = {}, params, queueId) => {
  return request(`${api.CALLCENTER_SERVICE}/queue/${queueId}/details`, {
    headers,
    params,
  });
};

export const requestCancelCall = async (id, headers) => request(`${api.CALLCENTER_SERVICE}/calls/cancel`, {
  method: 'POST',
  headers,
  params: {
    id,
  },
})

/**
 * @param {string} params.id
 * @param {string} params.phone
 * @param {string} params.direction
 */
export const requestTransferCall = async (params, headers) => request(`${api.CALLCENTER_SERVICE}/calls/transfer`, {
  method: 'POST',
  headers,
  params,
})

export const requestGetListExtensionOnline = async (headers) => request(`${api.CALLCENTER_SERVICE}/extensions/online`, {
  method: 'GET',
  headers,
});

export const requestSetAgentDisturb = async (headers, params) => request(`${api.CALLCENTER_SERVICE}/agents/disturb`, {
  method: 'POST',
  headers,
  params
});
