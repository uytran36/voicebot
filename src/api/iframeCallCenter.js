import api from './index';

const username = process.env.IFRAME_USERNAME
const key = process.env.IFRAME_KEY
const uuid = process.env.IFRAME_UUID
const uuidInbound = process.env.IFRAME_UUID_INBOUND
const paramsAuthen = `username=${username}&key=${key}`;

export default {
  CALL_CENTER_EXTENSIONS: `${api.CALL_CENTER_SERVICE}/app/extensions/scc_extensions.php?${paramsAuthen}`,
  CALL_CENTER_GATEWAYS: `${api.CALL_CENTER_SERVICE}/app/gateways/scc_gateways.php?${paramsAuthen}`,
  CALL_CENTER_OUTBOUND_ROUTES: `${api.CALL_CENTER_SERVICE}/app/dialplans/scc_dialplans.php?${paramsAuthen}&app_uuid=${uuid}`,
  CALL_CENTER_INBOUND_ROUTES: `${api.CALL_CENTER_SERVICE}/app/dialplans/scc_dialplans.php?${paramsAuthen}&app_uuid=${uuidInbound}`,
  CALL_CENTER_DIALPLAN_MANAGER: `${api.CALL_CENTER_SERVICE}/app/dialplans/scc_dialplans.php?${paramsAuthen}`,
  CALL_CENTER_DESTINATION: `${api.CALL_CENTER_SERVICE}/app/destinations/scc_destinations.php?${paramsAuthen}`,
  CALL_CENTER_AGENTS: `${api.CALL_CENTER_SERVICE}/app/call_centers/scc_call_center_agents.php?${paramsAuthen}`,
  CALL_CENTER_QUEUES: `${api.CALL_CENTER_SERVICE}/app/call_centers/scc_call_center_queues.php?${paramsAuthen}`,
  CALL_CENTER_HISTORY_CALL: `${api.CALL_CENTER_SERVICE}/app/xml_cdr/scc_xml_cdr.php?${paramsAuthen}`,
  CALL_CENTER_CALL_RECORDINGS: `${api.CALL_CENTER_SERVICE}/app/call_recordings/scc_call_recordings.php?${paramsAuthen}`,
  CALL_CENTER_IVR: `${api.CALL_CENTER_SERVICE}/app/ivr_menus/scc_ivr_menus.php?${paramsAuthen}`,
  CALL_CENTER_OPERATOR_PANEL: `${api.CALL_CENTER_SERVICE}/app/operator_panel/scc_index.php?${paramsAuthen}`,
  CALL_CENTER_RING_GROUPS: `${api.CALL_CENTER_SERVICE}/app/ring_groups/scc_ring_groups.php?${paramsAuthen}`,
  CALL_CENTER_TIME_CONDITIONS: `${api.CALL_CENTER_SERVICE}/app/time_conditions/scc_time_conditions.php?${paramsAuthen}`,
  CALL_CENTER_RECORDINGS: `${api.CALL_CENTER_SERVICE}/app/recordings/scc_recordings.php?${paramsAuthen}`,
  CALL_CENTER_CALL_BLOCK: `${api.CALL_CENTER_SERVICE}/app/call_block/scc_call_block.php?${paramsAuthen}`,
  CALL_CENTER_FORWARD_CALL: `${api.CALL_CENTER_SERVICE}/app/calls/scc_calls.php?${paramsAuthen}`,
  CALL_CENTER_VOICE_MAIL: `${api.CALL_CENTER_SERVICE}/app/voicemails/scc_voicemails.php?${paramsAuthen}`,
  CALL_CENTER_ACTIVE_CALL_CENTER: `${api.CALL_CENTER_SERVICE}/app/call_center_active/scc_call_center_queue.php?${paramsAuthen}`,
  CALL_CENTER_ACTIVE_CALL: `${api.CALL_CENTER_SERVICE}/app/calls_active/scc_calls_active.php?${paramsAuthen}`,
  CALL_CENTER_AGENT_STATUS: `${api.CALL_CENTER_SERVICE}/app/call_centers/scc_call_center_agent_status.php?${paramsAuthen}`,
  CALL_CENTER_REGISTRATIONS: `${api.CALL_CENTER_SERVICE}/app/registrations/scc_registrations.php?${paramsAuthen}`,
  CALL_CENTER_SIP_STATUS: `${api.CALL_CENTER_SERVICE}/app/sip_status/scc_sip_status.php?${paramsAuthen}`,
  CALL_CENTER_ACCESS_CONTROLS: `${api.CALL_CENTER_SERVICE}/app/access_controls/scc_access_controls.php?${paramsAuthen}`,
  CALL_CENTER_DEFAULT_SETTINGS: `${api.CALL_CENTER_SERVICE}/core/default_settings/scc_default_settings.php?${paramsAuthen}`,
  CALL_CENTER_EXTENSION_SUMMARY: `${api.CALL_CENTER_SERVICE}/app/xml_cdr/scc_xml_cdr_extension_summary.php?${paramsAuthen}`,
};
