import request from '@/utils/request';
import api from '@/api';

export async function requestReportDayOutbound(headers, data) {
  return request(`${api.REPORT_SERVICE}/v1/report/voice-outbound/days`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestReportMonthOutbound(headers, data) {
  return request(`${api.REPORT_SERVICE}/v1/report/voice-outbound/month`, {
    method: 'POST',
    headers,
    data
  });
}
