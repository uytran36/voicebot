// export const VoiceBot = {
//   configVoicebot: 'configVoicebot',
//   importDataCalling: 'importDataCalling',
//   importDataDNC:'importDataDNC',
//   configCampaignIVR: 'configCampaignIVR',
//   configCampaignT2S: 'configCampaignT2S',
//   viewReportCampaign: 'viewReportCampaign',
// };

// export const OmniChatInbound = {
//   configChannelChat: 'configChannelChat',
//   accessLiveChat: 'accessLiveChat',
//   accessZalo: 'accessZalo',
//   accessFacebook: 'accessFacebook',
//   viewReportOmniInbound: 'viewReportOmniInbound',
//   viewDashboardOmniInbound: 'viewDashboardOmniInbound',
// }

export const MINI_CRM_MANAGEMENT = {
  manageInfoCustomer: 'manageInfoCustomer',
  updateInfoCustomer: 'updateInfoCustomer',
  onlyViewInfoCustomer: 'onlyViewInfoCustomer',
};

export const OMNI_CHAT_INBOUND = {
  configChannelZaloChat: 'configChannelZaloChat',
  configChannelFacebookChat: 'configChannelFacebookChat',
  configChannelLivechatChat: 'configChannelLivechatChat',
  chatChannelZalo: 'chatChannelZalo',
  chatChannelFacebook: 'chatChannelFacebook',
  chatChannelLivechat: 'chatChannelLivechat',
  allChat: 'allChat',
  accessZaloReport: 'accessZaloReport',
  accessFacebookReport: 'accessFacebookReport',
  accessLivechatReport: 'accessLivechatReport',
  accessLivechatStatisticsReport: 'accessLivechatStatisticsReport',
  accessZaloStatisticsReport: 'accessZaloStatisticsReport',
  accessFacebookStatisticsReport: 'accessFacebookStatisticsReport',
};

// export const USER_MANAGEMENT = {
//   viewRoleAndPermission: 'viewRoleAndPermission',
//   manageAndDecentralizeUsers: 'manageAndDecentralizeUsers',
//   'user-view': 'user-view',
//   // updateUser: 'updateUser',
//   // viewUserProfile: 'user-view',
//   // viewUserProfileOld: 'viewUserProfile',
//   // resetPassword: 'resetPassword',
//   // setupPermissionCallCenter: 'setupPermissionCallCenter',
//   // setupPermissionVoicebotCampaign: 'setupPermissionVoicebotCampaign',
//   // setupPermissionOmniInbound: 'setupPermissionOmniInbound',
//   // viewPermission: 'viewPermission',
//   // updatePermissionRole: 'updatePermissionRole'
// };

export const CALL_CENTER_MANAGEMENT = {
  configCallCenter: 'configCallCenter',
  callInteract: 'callInteract',
  numberPad: 'numberPad',
  internalDirectory: 'internalDirectory',
  clientDirectory: 'clientDirectory',
  personalCallHistory: 'personalCallHistory',
  allCallHistory: 'allCallHistory',
  callMonitor: 'callMonitor',
  monitorQueue: 'monitorQueue',
  monitorAgent: 'monitorAgent',
  accessPersonalCallReport: 'accessPersonalCallReport',
  accessAllCallReport: 'accessAllCallReport',
  // scc_callcenter_agent: 'scc_callcenter_agent',
  // scc_callcenter_supervisor: 'scc_callcenter_supervisor',
  // configCallCenter: 'configCallCenter',
};

export const USER_MANAGEMENT = {
  manageAndDecentralizeUsers: 'All User Management',
  manageAndDecentralizeUsersInUnit: 'Manage all user in Unit',
  manageUsersInDepartment: 'Manage all user in Department',
};

export const CALL_DATA_MANAGEMENT = {
  manageDataInExcelFile: 'Manage data in Excel file',
  manageDataFromAPI: 'Manage data from API',
};

export const CAMPAIGN_MANAGEMENT = {
  viewAutoCallCampaignOnly: 'View AutoCall campaign only',
  allAutoCallCampaign: 'All AutoCall campaign',
  viewAudoDialerCampaignOnly: 'View AudoDialer campaign only',
  allAudoDialerCampaign: 'All AudoDialer campaign',
  exportCampaignReport: 'Export campaign report'
}

export const REPORT_MANAGEMENT = {
  exportReport: 'Export report',
  accessOverviewReport: 'Access overview report',
  accessAutoCallReport: 'Access auto call report',
  accessAutoDialerReport: 'Access auto dialer report'
}

export const checkPermission = (listPermissions = [], action = '') => {
  // const path = window.location.pathname;
  // console.log("list permission", listPermissions)
  // console.log("permission", action)

  if (listPermissions.includes(action)) {
    return true;
  }
  return false;
};
