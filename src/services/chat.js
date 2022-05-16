import request from '@/utils/request';
import api from '@/api';
import { dashboardchat } from '../../mock/dashboardchat';

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
export async function requestGetHistoryChat(headers, params) {
  return request(`${api.CM_SERVICE}/omni-inbound/chat-customer-history`, {
    method: 'GET',
    headers,
    params,
  });
  // return historyChat
}

export async function requestGetReportHistoryChat(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-chat-history`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function requestExportReportHistoryChat(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-chat-history/export`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function requestReportChat(header, params) {
  return {
    success: true,
    data: [
      { day: '1/1', data: 300, type: 'Livechat' },
      { day: '1/1', data: 400, type: 'Zalo' },
      { day: '1/1', data: 500, type: 'Messenger' },
      { day: '2/1', data: 400, type: 'Livechat' },
      { day: '2/1', data: 800, type: 'Zalo' },
      { day: '2/1', data: 900, type: 'Messenger' },
      { day: '3/1', data: 900, type: 'Livechat' },
      { day: '3/1', data: 800, type: 'Zalo' },
      { day: '3/1', data: 700, type: 'Messenger' },
      { day: '4/1', data: 550, type: 'Livechat' },
      { day: '4/1', data: 1200, type: 'Zalo' },
      { day: '4/1', data: 900, type: 'Messenger' },
      { day: '5/1', data: 350, type: 'Livechat' },
      { day: '5/1', data: 150, type: 'Zalo' },
      { day: '5/1', data: 270, type: 'Messenger' },
      { day: '6/1', data: 650, type: 'Livechat' },
      { day: '6/1', data: 800, type: 'Zalo' },
      { day: '6/1', data: 1300, type: 'Messenger' },
      { day: '7/1', data: 200, type: 'Livechat' },
      { day: '7/1', data: 400, type: 'Zalo' },
      { day: '7/1', data: 500, type: 'Messenger' },
      { day: '8/1', data: 120, type: 'Livechat' },
      { day: '8/1', data: 460, type: 'Zalo' },
      { day: '8/1', data: 780, type: 'Messenger' },
      { day: '9/1', data: 210, type: 'Livechat' },
      { day: '9/1', data: 1100, type: 'Zalo' },
      { day: '9/1', data: 170, type: 'Messenger' },
      { day: '10/1', data: 1210, type: 'Livechat' },
      { day: '10/1', data: 1100, type: 'Zalo' },
      { day: '10/1', data: 200, type: 'Messenger' },
    ],
  };
}

/**
 * Request report chat detail
 * @param {Object} headers
 * @param {Object} params
 * @returns {<Promise>Response}
 */

// export async function requestReportChatDetail(headers, params) {
//   return request(`${api.CHAT_SERVICE}/chat/user/data`, {
//     method: 'GET',
//     headers,
//     params,
//   });
// }

export async function requestReportChatDetail(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-all-quantity-chat`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function requestExportReportChatDetail(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-all-quantity-chat/export`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function requestChatDetail(header, params) {
  return {
    success: true,
    data: [
      {
        id: '1/1',
        id_chat: 300,
        channel: 'Livechat',
        customer_name: 'Nguyễn Văn A',
        phone: '0909090909',
        agent_name: 'Agent 1',
        startAt: '2021-07-31T09:13:57.000Z',
        endAt: '2021-07-31T09:13:57.000Z',
        note: '12345',
      },
      {
        id: '1/1',
        id_chat: 300,
        channel: 'Zalo',
        customer_name: 'Nguyễn Văn B',
        phone: '0909090909',
        agent_name: 'Agent 2',
        startAt: '2021-07-31T09:13:57.000Z',
        endAt: '2021-07-31T09:13:57.000Z',
        note: '12345',
      },
      {
        id: '1/1',
        id_chat: 300,
        channel: 'Messenger',
        customer_name: 'Nguyễn Văn C',
        phone: '0909090909',
        agent_name: 'Agent 3',
        startAt: '2021-07-31T09:13:57.000Z',
        endAt: '2021-07-31T09:13:57.000Z',
        note: '12345',
      },
    ],
  };
}

export async function requestChatDetailConversation(header, params) {
  return {
    success: true,
    data: [
      {
        agent_name: 'Agent 1',
        startAt: '2021-07-31T09:13:57.000Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        note: '12345',
        agent: true,
      },
      {
        agent_name: 'Customer',
        startAt: '2021-07-31T09:13:57.000Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        note: '12345',
        agent: false,
      },
      {
        agent_name: 'Agent 3',
        startAt: '2021-07-31T09:13:57.000Z',
        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        note: '12345',
        agent: true,
      },
    ],
  };
}

export async function requestGetReportCustomer(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-customer-chat`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function requestExportReportCustomer(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-customer-chat/export`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function requestGetListConversation(headers, params) {
  return {
    success: true,
    data: [
      {
        channel: 'zalo',
        id: '123123',
        agent: 'quanth20',
        statedAt: '28/7/2021 00:00',
        ended: '28/7/2021 00:00',
        status: 'complete',
        note: '',
      },
    ],
  };
}

export async function requestGetDetailConversation(headers, params) {
  return {
    success: true,
    data: [
      {
        sender: 'quanth20',
        time: '28/7/2021 00:00',
        content:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt dolores maxime officia, earum aliquid sequi, cum pariatur et officiis quos tenetur recusandae est reiciendis nobis quibusdam, totam nisi impedit similique?',
      },
      {
        sender: 'tran hong quan',
        time: '28/7/2021 00:10',
        content:
          'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt dolores maxime officia, earum aliquid sequi, cum pariatur et officiis quos tenetur recusandae est reiciendis nobis quibusdam, totam nisi impedit similique?',
      },
    ],
  };
}

/**
 * Request get resolution rate report chat
 * @param {Object} headers
 * @param {Object} params
 * @returns {<Promise>Response}
 */
export async function requestGetResolveRatioReportChat(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-resolved-ratio`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function requestExportResolveRatioReportChat(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-resolved-ratio/export`, {
    method: 'GET',
    headers,
    params,
  });
}

/**
 * Request get duration report chat
 * @param {Object} headers
 * @param {Object} params
 * @returns {<Promise>Response}
 */
// export async function requestDurationReportChat(headers, params) {
//   return request(`${api.CHAT_SERVICE}/chat/duration-report`, {
//     method: 'GET',
//     headers,
//     params,
//   });
// }

export async function requestDurationReportChat(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-all-chat-time`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function requestExportDurationReportChat(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-all-chat-time/export`, {
    method: 'GET',
    headers,
    params,
  });
}

/**
 * Request get dashboard chat
 * @param {Object} headers
 * @param {Object} params.beginDate
 * @param {Object} params.closedDate
 * @returns {<Promise>Response}
 */
export async function requestDashboardChat(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-all-omnichat`, {
    method: 'GET',
    headers,
    params,
  });
  // return dashboardchat;
}

/**
 * Request get detail chat
 * @param {Object} headers
 * @param {Object} params.beginDate
 * @param {Object} params.closedDate
 * @param {Object} params.page
 * @param {Object} params.limit
 * @returns {<Promise>Response}
 */
export async function requestDetailChat(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-all-chat-details`, {
    method: 'GET',
    headers,
    params,
  });
}

/**
 * Request get detail chat
 * @param {Object} headers
 * @param {Object} params.beginDate
 * @param {Object} params.closedDate
 * @param {Object} params.page
 * @param {Object} params.limit
 * @returns {<Promise>Response}
 */
export async function requestDetailChatExport(headers, params) {
  return request(`${api.CHAT_SERVICE}/report/get-all-chat-details/export`, {
    method: 'GET',
    headers,
    params,
  });
}

/**
 * Request get detail chat
 * @param {Object} headers
 * @param {String} roomId
 * @returns {<Promise>Response}
 */
export async function requestDetailConversation(headers, roomId, params) {
  return request(`${api.CHAT_SERVICE}/message/all-room/${roomId}`, {
    method: 'GET',
    headers,
    params,
  });
}
