import request from '@/utils/request';
import api from '@/api';

export async function requestReportMonthOutbound(headers, data) {
  return request(`${api.REPORT_SERVICE}/v1/report/voice-outbound/month`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestReportCampaignDetail(headers, data) {
  return request(`${api.REPORT_SERVICE}/v1/report/campaign/detail`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestReportVoiceOutboundDays(headers, data) {
  return request(`${api.REPORT_SERVICE}/v1/report/voice-outbound/days`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestReportCampaignDaily(headers, data) {
  // return request(`${api.REPORT_SERVICE}/v1/report/campaign/daily`, {
  //   method: 'POST',
  //   headers,
  //   data,
  // });
}

export async function requestReportCampaignDays(headers, data) {
  // return request(`${api.REPORT_SERVICE}/v1/report/campaign/days`, {
  //   method: 'POST',
  //   headers,
  //   data,
  // });
}

export async function requestReportCampaignMonth(headers, data) {
  return request(`${api.REPORT_SERVICE}/v1/report/campaign/month`, {
    method: 'POST',
    headers,
    data,
  });
}
