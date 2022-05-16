import request from '@/utils/request';
import api from '@/api';
const tokenGateway = localStorage.getItem('access_token');

// export async function query() {
//   return request('/api/users');
// }
// export async function queryCurrent() {
//   return request('/api/currentUser');
// }
export async function queryNotices(headers, params) {
  return request(`${api.NOTIFICAITON_SERVICE}/notifications`, {
    headers,
    params,
  });
}

export async function changeNoticeStatus(headers, data) {
  return request(`${api.NOTIFICAITON_SERVICE}/notifications`, {
    headers,
    data,
    method: 'POST',
  });
}

export async function requestCurrentUserInfo(headers) {
  return request(`${api.ACCESS_SERVICE}/me`, {
    method: 'GET',
    headers,
  });
  // const a=1;
  // return {
  // _id: '9vQcFDiHTn3p952BM',
  // services: {
  //   password: {
  //     bcrypt: '$2b$10$tx6rJAFhdKNGmhqtuNYeB.ZxEzhvQNbbCBrR2zS3PwrfqaLETK8v.',
  //   },
  // },
  // username: 'trieutq3',
  // emails: [
  //   {
  //     address: 'trieutq3@fpt.com.vn',
  //     verified: false,
  //   },
  // ],
  // status: 'online',
  // active: true,
  // _updatedAt: '2021-03-20T10:04:40.132Z',
  // roles: ['admin', 'livechat-agent', 'livechat-manager'],
  // name: 'Trần Quang Triều',
  // nickname: 'trieutq3',
  // requirePasswordChange: false,
  // settings: {
  //   preferences: {
  //     enableAutoAway: true,
  //     idleTimeLimit: 300,
  //     desktopNotificationRequireInteraction: false,
  //     audioNotifications: 'mentions',
  //     desktopNotifications: 'all',
  //     mobileNotifications: 'all',
  //     unreadAlert: true,
  //     useEmojis: true,
  //     convertAsciiEmoji: true,
  //     autoImageLoad: true,
  //     saveMobileBandwidth: true,
  //     collapseMediaByDefault: false,
  //     hideUsernames: false,
  //     hideRoles: false,
  //     hideFlexTab: false,
  //     hideAvatars: false,
  //     sidebarGroupByType: true,
  //     sidebarViewMode: 'medium',
  //     sidebarHideAvatar: false,
  //     sidebarShowUnread: false,
  //     sidebarSortby: 'activity',
  //     showMessageInMainThread: false,
  //     sidebarShowFavorites: true,
  //     sendOnEnter: 'normal',
  //     messageViewMode: 0,
  //     emailNotificationMode: 'mentions',
  //     newRoomNotification: 'door',
  //     newMessageNotification: 'chime',
  //     muteFocusedConversations: true,
  //     notificationsSoundVolume: 100,
  //     sidebarShowDiscussion: true,
  //   },
  // },
  // statusConnection: 'online',
  // utcOffset: 7,
  // statusLivechat: 'available',
  // banners: {
  //   'versionUpdate-3_10_3': {
  //     id: 'versionUpdate-3_10_3',
  //     priority: 10,
  //     title: 'Update_your_RocketChat',
  //     text: 'New_version_available_(s)',
  //     textArguments: ['3.10.3'],
  //     link: 'https://github.com/RocketChat/Rocket.Chat/releases/tag/3.10.3',
  //   },
  //   'alert-5fd28c37f5204d0905436930': {
  //     id: 'alert-5fd28c37f5204d0905436930',
  //     priority: 10,
  //     title: 'Warning',
  //     text:
  //       "Please note that push to official Rocket.Chat mobile apps is unavailable for non-registered servers. See how to register your server [here], and check our forum for more details. If don't want to receive new notifications and are running version 3.5 or higher, you can turn it off in Administration > General > Updates > Enable the Update Checker.",
  //     textArguments: [],
  //     modifiers: [],
  //     link:
  //       'https://docs.rocket.chat/guides/administrator-guides/connectivity-services#introduction',
  //   },
  //   'versionUpdate-3_10_4': {
  //     id: 'versionUpdate-3_10_4',
  //     priority: 10,
  //     title: 'Update_your_RocketChat',
  //     text: 'New_version_available_(s)',
  //     textArguments: ['3.10.4'],
  //     link: 'https://github.com/RocketChat/Rocket.Chat/releases/tag/3.10.4',
  //   },
  //   'versionUpdate-3_10_5': {
  //     id: 'versionUpdate-3_10_5',
  //     priority: 10,
  //     title: 'Update_your_RocketChat',
  //     text: 'New_version_available_(s)',
  //     textArguments: ['3.10.5'],
  //     link: 'https://github.com/RocketChat/Rocket.Chat/releases/tag/3.10.5',
  //   },
  //   'versionUpdate-3_11_0': {
  //     id: 'versionUpdate-3_11_0',
  //     priority: 10,
  //     title: 'Update_your_RocketChat',
  //     text: 'New_version_available_(s)',
  //     textArguments: ['3.11.0'],
  //     link: 'https://github.com/RocketChat/Rocket.Chat/releases/tag/3.11.0',
  //   },
  //   'versionUpdate-3_11_1': {
  //     id: 'versionUpdate-3_11_1',
  //     priority: 10,
  //     title: 'Update_your_RocketChat',
  //     text: 'New_version_available_(s)',
  //     textArguments: ['3.11.1'],
  //     link: 'https://github.com/RocketChat/Rocket.Chat/releases/tag/3.11.1',
  //   },
  //   'versionUpdate-3_12_0': {
  //     id: 'versionUpdate-3_12_0',
  //     priority: 10,
  //     title: 'Update_your_RocketChat',
  //     text: 'New_version_available_(s)',
  //     textArguments: ['3.12.0'],
  //     link: 'https://github.com/RocketChat/Rocket.Chat/releases/tag/3.12.0',
  //   },
  //   'versionUpdate-3_12_1': {
  //     id: 'versionUpdate-3_12_1',
  //     priority: 10,
  //     title: 'Update_your_RocketChat',
  //     text: 'New_version_available_(s)',
  //     textArguments: ['3.12.1'],
  //     link: 'https://github.com/RocketChat/Rocket.Chat/releases/tag/3.12.1',
  //   },
  // },
  // statusText: 'hihi',
  // statusDefault: 'online',
  // avatarETag: 'XBuzNLTBhAxuJHpuu',
  // avatarOrigin: 'rest',
  // avatarUrl: 'http://172.27.228.157:3006/avatar/trieutq3',
  // success: true,
  // };
}

export async function requestGetLicense(headers) {
  return request(`${api.URL_LICENSE}/get-license`, {
    method: 'POST',
    data: {
      token: 'token_id',
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('tokenGateway')}`,
      ...headers,
    },
  });
  // return {
  //   status: 'OK',
  //   payload: {
  //     request_id: '287e5cf1-b226-8d36-f16a-b87f9492e4ef',
  //     lease_id: '',
  //     renewable: false,
  //     lease_duration: 0,
  //     data: {
  //       data: {
  //         licenseObject: [
  //           'mainpage',
  //           'call_center',
  //           'call_center/extensions',
  //           'call_center/gateways',
  //           'call_center/diaplan',
  //           'call_center/destination',
  //           'call_center/outbound_routes',
  //           'call_center/inbound_routes',
  //           'call_center/dialplan_manager',
  //           'call_center/applications',
  //           'call_center/call_block',
  //           'call_center/queues',
  //           'call_center/call_recordings',
  //           'call_center/history_call',
  //           'call_center/forward',
  //           'call_center/ivr',
  //           'call_center/operator_panel',
  //           'call_center/recordings',
  //           'call_center/ring_groups',
  //           'call_center/time_conditions',
  //           'call_center/voice_mail',
  //           'call_center/status',
  //           'call_center/active_call_center',
  //           'call_center/active_call',
  //           'call_center/agent_status',
  //           'call_center/registrations',
  //           'call_center/sip_status',
  //           'call_center/advanced',
  //           'call_center/access_controls',
  //           'call_center/default_settings',
  //           'config',
  //           'config/voicebot',
  //           'config/campaign-management',
  //           'config/standardized',
  //           'campaign',
  //           'standardized',
  //           'config/campaign-report',
  //           'omni_inbound',
  //           'omni_inbound/config_livechat',
  //           'campaign-management',
  //           'chat',
  //           'administrator',
  //           'administrator/roles',
  //           'administrator/users',
  //           'report-billing',
  //         ],
  //         licenseModule: ['Usermanagement', 'CallCenterManagement', 'OmniChatInbound'],
  //       },
  //     },
  //     wrap_info: null,
  //     warnings: null,
  //     auth: null,
  //   },
  // };
  // return {
  //   status: 'OK',
  //   payload: {
  //     request_id: null,
  //     lease_id: null,
  //     renewable: null,
  //     lease_duration: null,
  //     data: null,
  //     wrap_info: null,
  //     warnings: null,
  //     auth: null,
  //   },
  // };
}

export async function requestAddLicense(headers, data) {
  return request(`${api.URL_LICENSE}/add-license`, {
    method: 'POST',
    data,
    headers,
  });
}
