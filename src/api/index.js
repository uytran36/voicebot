export default {
  UMI_API_BASE_URL: process.env.UMI_API_BASE_URL,
  WIDGET_LIVECHAT: `${process.env.UMI_WIDGET_LIVECHAT_URL}/widget.js`,
  ROCKET_CHAT: `${process.env.UMI_API_BASE_URL}/smart-contact-center-platform-chat/api/v1`,
  ACCESS_SERVICE: `${process.env.UMI_API_BASE_URL}/smart-contact-center-platform-chat-service/api/v1`,
  CM_SERVICE: `${process.env.UMI_API_BASE_URL}/smart-contact-center-contact-list-management`,
  REPORT_SERVICE: `${process.env.UMI_API_BASE_URL}/smart-contact-center-report-service`,
  REPORT_WS: process.env.UMI_API_REPORT_URL,
  CAMPAIGN_SERVICE: `${process.env.UMI_API_BASE_URL}/smart-contact-center-campaign-service-v2`,
  IVR_SERVICE: `${process.env.UMI_API_BASE_URL}/smart-contact-center-ivr-service`,
  VOICE_SERVICE: `${process.env.UMI_API_BASE_URL}/smart-contact-center-auto-call`,
  WS_CALL_SERVICE: 'ws://42.119.108.7:3013',
  CALL_CENTER_SERVICE: process.env.UMI_IFRAME_CALL_CENTER_URL,
  WS_CALL_CENTER_SERVICE: process.env.UMI_WS_CALL_CENTER_URL,
  URL_WIDGET_CHAT_SRC: `${process.env.UMI_CHAT_URL}/rocketchat-livechat.min.js`,
  URL_WIDGET_CHAT_SCRIPT: process.env.UMI_CHAT_URL,
  URL_LICENSE: `${process.env.UMI_API_BASE_URL}/api/license-service`,
  CALLCENTER_SERVICE: `${process.env.UMI_API_BASE_URL}/api/call-center-service`,
  COLLAB_SERVICE: `${process.env.URL_API_SERVICE_COLLAB_CHAT}`,
  CRM_SERVICE: `${process.env.UMI_API_BASE_URL}/api/crm-service`,
  CHAT_SERVICE: `${process.env.UMI_API_BASE_URL}/api/smcc-chat-service`,
  NOTIFICATION_SERVICE: `${process.env.UMI_API_BASE_URL}/api/notification-service`,
  WS_SERVICE: process.env.REACT_APP_WEBSOCKET_SSL,
  UMI_WIDGET_LIVECHAT_URL: process.env.UMI_WIDGET_LIVECHAT_URL,
  NOTIFICAITON_SERVICE: `${process.env.UMI_API_BASE_URL}/api/notification-service`,
  CALL_CENTER: `${process.env.UMI_API_BASE_URL}/api/call-center-service`,
  UMI_API_URL: process.env.UMI_API_URL,
  PORT: process.env.PORT,
  UMI_DOMAIN: process.env.UMI_DOMAIN,
  REDIRECT_URI_DOMAIN: process.env.REDIRECT_URI_DOMAIN,
  ENVIROMENT: process.env.ENVIROMENT,
  REDIRECT_URI_PROTOCOL: process.env.REDIRECT_URI_PROTOCOL,
  TENANT_NAME: process.env.TENANT_NAME,
  CLIENT_ID: process.env.CLIENT_ID,
  SECRET_ID: process.env.SECRET_ID,
  ENV: process.env.ENV,
};
