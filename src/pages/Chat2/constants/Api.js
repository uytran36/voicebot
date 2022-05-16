export const GET_ROOM = "/api/v1/rooms.get";
export const GET_ROOM_INFO = "/api/v1/rooms.info";
export const GET_ME= "/api/v1/me";
export const GET_GROUP_COUNTERS= "/api/v1/groups.counters";
export const GET_CHANNEL_COUNTERS= "/api/v1/channels.counters";
export const GET_SUBSCRIPTIONS_READ= "/api/v1/subscriptions.read";
export const UPLOAD_IMAGE_ROOOM= "/api/v1/rooms.upload/";
export const LOGIN_ROCKETCHAT= "/api/v1/login";
export const LOGOUT_ROCKETCHAT= "/api/v1/logout";
export const GET_LIST_USER = "/api/v1/users.list";
export const LEAVE_GROUP = "/api/v1/groups.leave";
export const INVITE_GROUP = "/api/v1/groups.invite";
export const LEAVE_CHANNEL = "/api/v1/channels.leave";
export const INVITE_CHANNEL = "/api/v1/channels.invite";

export const GET_GROUP_FILE = "/api/v1/groups.files";
export const SETTING_UPDATE = "/api/v1/settings/Livechat_enabled";
export const GET_CHANNEL_FILE = "/api/v1/channels.files";

export const SEARCH_CHAT = "/api/v1/chat.search";

// export const GET_VISITORS_INFO = "/api/v1/livechat/visitor/";
export const GET_VISITORS_INFO = "/api/v1/livechat/visitors.info";
export const GROUP_SETCUSTOMFIELDS = "/api/v1/groups.setCustomFields";
export const USERS_AUTOCOMPLETE = "/api/v1/users.autocomplete";

//API ALLCHAT
export const GET_AGENT_FACEBOOK = "/graphfb/api/v1/listMemberAgentOnlineFacebook";
export const GET_ALLROOM_OFFLINE = "/graphfb/api/v1/livechat.list";
export const GET_AGENT_ONLINE = "/graphfb/api/v1/listMemberAgentOnline";
export const TOGGLE_BOT_ROOM = "/graphfb/api/v1/chatbot-services/api/public/room/bot-status";
export const TOGGLE_BOT_CHANNEL = "/graphfb/api/v1/chatbot-services/api/public/channel/bot-status";
export const GET_STATUS_BOT_ROOM ="/graphfb/api/v1/chatbot-services/api/public/room/bot-status/";

//omni-channel
export const GET_ALLROOM_COUNTERS = "/omni-channel/api/v1/groups.list";
export const LOGIN_ALLCHAT= "/omni-channel/api/v1/login";
export const COUNT_UNREAD= "/omni-channel/api/v1/count.unread";
export const SAVE_CHAT = "/omni-channel/api/v1/save-chat";
export const CLOSE_GROUP = "/omni-channel/api/v1/facebook-agent-end-room";

//LIST MANAGEMENT
export const CM_VISTOR_INFOS = "/api/v1/smart-contact-center-cm-visitor-infos-find-one";
export const CM_CUSTOMER_INFOS = "/api/v1/smart-contact-center-cm-customer-infos";
export const CM_CUSTOMER_LIST = "api/v1/crm-service/customer/list";  
//COLLAB CHAT
export const FORWARD_USER = "/api/v1/forward-user";
export const DONE_ROOM = "/api/v1/done-room";
export const RECEIVE_TRANSITION = "/api/v1/receive-transition";
export const REJECT_TRANSITION = "/api/v1/reject-transition";
export const ROOM_UNREAD= "/api/v1/room/unread";

//REPORT SERVICE
export const CUSTOMER_HISTORY_CALL= "/call-center/customer-history-call";
export const CUSTOMER_HISTORY_ALL= "/crm/all-history-for-customer";


