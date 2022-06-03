import request from '@/utils/request';
import api from '@/api';

export const endpoint = api.UMI_API_BASE_URL;

/**
 * request to login
 * @param {string} data.username
 * @param {string} data.password
 * @returns {Promise<object>}
 */
export async function verifySSO(data) {
  if (api.ENV === 'local') {
    return request(`${endpoint}/user/sso_verify`, {
      method: 'POST',
      data,
    });
  } else {
    return request(`${endpoint}/user/sso_fpt_verify_code`, {
      method: 'POST',
      data,
    });
  }
  // return request('http://172.27.228.236:8001/user/get_roles', {
  //   method: 'POST',
  //   headers: {
  //     Authorization:
  //       'Bearer ' +
  //       'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxZWQ5Z2RZSXlaVDY2WGplNDhOb3lTb1hncGZhWkNEX3RjX2V4Tmozb1pJIn0.eyJleHAiOjE2NDE0NjE1NjIsImlhdCI6MTY0MTQ1Nzk2MiwianRpIjoiMjE2ZDU0MjYtZTNhNy00ZmIwLWE1YTAtOWI0ZGQ2ZDBmMjhmIiwiaXNzIjoiaHR0cHM6Ly8xNzIuMjcuMjI4LjIzODo4NDQzL2F1dGgvcmVhbG1zL0RldlZvaWNlQm90Q2FtcGFpZ24iLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMWIwODVjYmItZjcwNC00MjcxLWI2MWUtZDQ5MWQ4NmY1MDQwIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZmFzdGFwaS1iYWNrZW5kIiwic2Vzc2lvbl9zdGF0ZSI6IjE1MjgyMTY3LTIxZjMtNGI2My05NmMxLWJiNGYyNjI4YTlkOSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtZGV2dm9pY2Vib3RjYW1wYWlnbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6IjE1MjgyMTY3LTIxZjMtNGI2My05NmMxLWJiNGYyNjI4YTlkOSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkzDom4gTMOqIFRoYW5oIiwicHJlZmVycmVkX3VzZXJuYW1lIjoibGFubHQyMyIsImdpdmVuX25hbWUiOiJMw6JuIiwiZmFtaWx5X25hbWUiOiJMw6ogVGhhbmgiLCJlbWFpbCI6Imxhbmx0MjNAZnB0LmNvbS52biJ9.gePLvn4--1uOljPrPiTcdbSqBpR-bln02nJWwa47gILb1ng1z_Iuyv1ATRo7glTIbIIdOwA4Z8sni-tfKBgdOP2hC83J_4KbYx4V_ApK651eSb-dHnAvcblOF48NdL4Zw5175yQhVKZrz9nvUKqzCe_mXWwTfXzC5XZugXpPwh08GrTyfBRb58lV3DQIRFCwLRXtx7ediiZXyHkfOu7Ts3B06p387YH2Q6cXIGtVBJaagVQNTi4wH__aFHq6J0jZYGvM7LwsJwyu2VgoaTwy_NNWwk4Bly4p70Qh9mw4YgO4Ny6bMGwbAnZAsPsTIB68ebAW39unzcE_vwDRPp1DPg',
  //   },
  // });
  // return request(
  //   'http://172.27.228.60:3333/ticket-list-home?api_key=n96M1TPG821EdN4mMIjnGKxGytx9W2UJ&from=0&size=100&show=true', {
  //     method: 'GET',
  //   }
  // );
}

export async function requestLogin(data) {
  return request(`${endpoint}/api/auth/login`, {
    method: 'POST',
    data,
  });
  // return request(`${api.ACCESS_SERVICE}/users/login`, {
  //   method: 'POST',
  //   data,
  // });
}

export async function requestLogout() {
  if (api.ENV === 'local') {
    return request(`${endpoint}/user/sso_logout`, {
      method: 'GET',
      params: {
        // refresh_token: data.refresh_token,
        // access_token: data.access_token,
        redirect_uri: `${api.UMI_API_URL}/mainpage`,
      },
    });
  } else {
    return request(`${api.UMI_API_BASE_URL}/user/sso_fpt_logout`, {
      method: 'GET',
      params: {
        redirect_uri: `${api.UMI_API_URL}`,
      },
    });
  }
}

export async function requestLogin2(data) {
  return request(`${endpoint}/user/login`, {
    // return request(`http://172.27.228.236:8001/user/sso_login`, {
    method: 'POST',
    data,
    // redirect: 'localhost:8000/',
  });
}

export async function getPermissionByRoleId(accessToken, roleId) {
  return request(`${endpoint}/user/get_permission_by_role_id`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
    data: {
      role_id: roleId,
    },
  });
}

export async function getRoleUser(headers) {
  return request(`${endpoint}/user/my_permission`, {
    method: 'POST',
    headers,
    data: {},
  });
}

/**
 *
 * @param {string} headers.Authorization
 * @returns {Promise<object>}
 */
export async function requestGetCurrentUserInfo(accessToken, userId) {
  // return request(`${endpoint}/api/auth/users/me`, {
  //   method: 'GET',
  //   headers,
  // });
  // return request(`${endpoint}/user/get_user_by_id`, {
  //   method: 'POST',
  //   headers: {
  //     Authorization: 'Bearer ' + accessToken,
  //   },
  //   data: {
  //     id: userId,
  //   },
  // });
  return {
    me: {
      id: '6131c12466eaf19ca7a2daff',
      username: 'admin',
      password: null,
      createdAt: '2021-01-22T01:53:31.156+00:00',
      emails: [{ address: 'xath.hx1001@gmail.com', verified: false }],
      permissions: [
        'resetPassword',
        'setupPermissionCallCenter',
        'setupPermissionOmniInbound',
        'setupPermissionVoicebotCampaign',
        'updatePermissionRole',
        'updateUser',
        'user-view',
        'viewPermission',
        'viewRoleAndPermission',
        'manageAndDecentralizeUsers',
        'viewUserProfile',
        'scc_callcenter_agent',
        'scc_callcenter_supervisor',
        'configCallCenter',
        'accessFacebook',
        'accessLiveChat',
        'accessZalo',
        'configChannelChat',
        'livechatFacebook',
        'viewDashboardOmniInbound',
        'viewReportOmniInbound',
        'livechatZalo',
      ],
      type: 'user',
      status: 'offline',
      active: true,
      updatedAt: '2021-10-07T02:14:57.507+00:00',
      roles: ['admin', 'livechat-agent'],
      name: 'admin',
      requirePasswordChange: false,
      statusText: '',
      lastLogin: '2021-01-31T15:49:45.534+00:00',
      statusConnection: 'offline',
      gender: 'Male',
      phone: '097888324',
      ipPhone: '102',
      extension: {
        extensionUuid: '78464382-d49a-44dd-99ec-604f2e494202',
        agentUuid: 'bcd3f54e-bfbe-488d-a9ee-ac9fcbb1253e',
        domainUuid: 'b0239f3e-2542-46d1-b779-19efd2b751fa',
        extension: '103',
        numberAlias: null,
        userContext: 'sccpbx.com',
        enabled: 'true',
        password: 'vo9EFsQ!6z',
      },
    },
    message: 'SUCCESS',
  };
}

/**
 *
 * @param {string} headers.Authorization
 * @returns {Promise<object>}
 */
export async function requestGetLicense(headers) {
  // return request(`${api.URL_LICENSE}/get-license`, {
  //   method: 'POST',
  //   headers,
  //   // data: {
  //   //   token: 'token_id',
  //   // },
  // });
  return {
    status: 'OK',
    payload: {
      request_id: '287e5cf1-b226-8d36-f16a-b87f9492e4ef',
      lease_id: '',
      renewable: false,
      lease_duration: 0,
      data: {
        data: {
          licenseObject: [
            'mainpage',
            'call_center',
            'call_center/extensions',
            'call_center/gateways',
            'call_center/diaplan',
            'call_center/destination',
            'call_center/outbound_routes',
            'call_center/inbound_routes',
            'call_center/dialplan_manager',
            'call_center/applications',
            'call_center/call_block',
            'call_center/queues',
            'call_center/call_recordings',
            'call_center/history_call',
            'call_center/forward',
            'call_center/ivr',
            'call_center/operator_panel',
            'call_center/recordings',
            'call_center/ring_groups',
            'call_center/time_conditions',
            'call_center/voice_mail',
            'call_center/status',
            'call_center/active_call_center',
            'call_center/active_call',
            'call_center/agent_status',
            'call_center/registrations',
            'call_center/sip_status',
            'call_center/advanced',
            'call_center/access_controls',
            'call_center/default_settings',
            'config',
            'config/voicebot',
            'config/campaign-management',
            'config/standardized',
            'campaign',
            'standardized',
            'config/campaign-report',
            'omni_inbound',
            'omni_inbound/config_livechat',
            'campaign-management',
            'chat',
            'administrator',
            'administrator/roles',
            'administrator/users',
            'report-billing',
          ],
          licenseModule: ['Usermanagement', 'CallCenterManagement', 'OmniChatInbound'],
        },
      },
      wrap_info: null,
      warnings: null,
      auth: null,
    },
  };
  return {
    status: 'OK',
    payload: {
      request_id: null,
      lease_id: null,
      renewable: null,
      lease_duration: null,
      data: null,
      wrap_info: null,
      warnings: null,
      auth: null,
    },
  };
}

/**
 * Request to refresh token
 * @param {string} data.refreshToken
 * @returns {Promise<object>}
 */
export async function requestRefreshToken(refreshToken) {
  if (api.ENV === 'local') {
    return request(`${endpoint}/user/sso_refresh_token`, {
      method: 'POST',
      data: {
        refresh_token: refreshToken,
      },
    });
  }

  return request(`${endpoint}/user/sso_fpt_refresh_token`, {
    method: 'POST',
    data: {
      refresh_token: refreshToken,
      redirect_uri: api.UMI_API_URL,
    },
  });
}

/**
 * Request to change password
 * @param {string} data.password
 * @param {string} data.passwordOld
 * @param {string} headers.Authorization
 * @returns {Promise<object>}
 */
export async function requestChangePassword(data, headers = {}) {
  return request(`${endpoint}/api/auth/users/change-password`, {
    method: 'POST',
    data,
    headers,
  });
}
