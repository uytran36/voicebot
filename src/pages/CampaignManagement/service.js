import request from '@/utils/request';
import {
  requestContactNormalizations,
  requestOmniContactListNormalization,
} from '@/pages/Sandardized/service';
import api from '@/api';

export async function requestGetListCustomer(headers, params) {
  return requestContactNormalizations(headers);
}

export async function requestGetCustomerByFilename(headers, params) {
  return requestOmniContactListNormalization(headers, params);
}

export async function requestGetListMusicBackground(headers, params) {
  return [
    'Music-OnHold_by_waderman.mp3',
    'Music-OnHold_Phone-holding-pack_by_waderman.mp3',
    'Music-OnHold_Phone-holding-pattern_by_waderman.mp3',
    'Music-OnHold_Phone-waiting_by_waderman.mp3',
    'Music-OnHold_Pleasant-ambient-background_by_waderman.mp3',
    'Music-OnHold_Smoothjazz_by_waderman.mp3',
  ];
}

export async function requestCreateScenarioes(headers, data) {
  return request(`${api.CAMPAIGN_SERVICE}/scenarioes`, {
    method: 'POST',
    data,
    headers,
  });
}

export async function requestUpdateScenario(headers, data, id) {
  if (id) {
    return request(`${api.CAMPAIGN_SERVICE}/scenarioes/${id}`, {
      method: 'PATCH',
      data,
      headers,
    });
  }
  return { error: 'ID is required...' };
}

export async function requestCreateStrageties(headers, data) {
  return request(`${api.CAMPAIGN_SERVICE}/strategies`, {
    method: 'POST',
    data,
    headers,
  });
}

export async function requestUpdateStrageties(headers, data, id) {
  if (id) {
    return request(`${api.CAMPAIGN_SERVICE}/strategies/${id}`, {
      method: 'PATCH',
      data,
      headers,
    });
  }
  return { error: 'ID is required...' };
}

export async function requestCallDemo(headers, id, phoneNumber) {
  return request(`${api.CAMPAIGN_SERVICE}/campaigns/${id}/call-demo?phoneNumber=${phoneNumber}`, {
    method: 'POST',
    headers,
  });
}

export async function requestGetSoundtrack(headers, data) {
  return request(`${api.IVR_SERVICE}/readFile`, {
    method: 'POST',
    data,
    headers,
  });
}

export async function requestUploadFile(headers, data) {
  return request(`${api.IVR_SERVICE}/uploadFile`, {
    method: 'POST',
    data,
    headers,
  });
}

export async function requestCreateCampaigns(headers, data) {
  return request(`${api.CAMPAIGN_SERVICE}/campaigns`, {
    method: 'POST',
    data,
    headers,
  });
}

export async function requestGetCampaigns({ params, query, headers }) {
  if (query) {
    return request(`${api.CAMPAIGN_SERVICE}/campaigns/${query}`, {
      method: 'GET',
      params,
      headers,
    });
  }
  return request(`${api.CAMPAIGN_SERVICE}/campaigns?filter={"limit": 1000}`, {
    method: 'GET',
    params,
    headers,
  });
}

export async function requestOmniContactListNormalizations(headers, params) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations`, {
    method: 'GET',
    params,
    headers,
  });
}

export async function requestUpdateCampaign(headers, data, id) {
  if (id) {
    return request(`${api.CAMPAIGN_SERVICE}/campaigns/${id}`, {
      method: 'PATCH',
      data,
      headers,
    });
  }
  return { error: 'ID is required...' };
}

export async function requestDeleteCampaign(headers, id) {
  if (id) {
    return request(`${api.CAMPAIGN_SERVICE}/campaigns/${id}`, {
      method: 'DELETE',
      headers,
    });
  }
  return { error: 'ID is required...' };
}

export async function requestUpdateOmniContactList(headers, data) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-addupdate`, {
    method: 'POST',
    data,
    headers,
  });
}

export async function requestDeleteOmniContactListNormalization(headers, id) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations/${id}`, {
    method: 'DELETE',
    headers,
  });
}

export async function requestReportCampaignSumary(headers, data) {
  return request(`${api.REPORT_SERVICE}/v1/report/campaign/summary`, {
    method: 'POST',
    headers: {
      ...headers,
    },
    data,
  });
}

export async function requestReportSessionCall(headers, data) {
  return request(`${api.REPORT_SERVICE}/v1/report/campaign/session`, {
    method: 'POST',
    headers: {
      ...headers,
    },
    data,
  });
}

export async function requestCheckNameCampaign(headers, name) {
  return request(`${api.CAMPAIGN_SERVICE}/scenarioes`, {
    method: 'GET',
    params: {
      filter: {
        where: { scenario_name: name },
      },
    },
    headers,
  });
}

export async function requestExportReportCampaign(headers, token, campaignID) {
  return request(`${api.REPORT_SERVICE}/v1/report/campaign/export?token=${token}&campaignID=${campaignID}&type=session`, {
  // return request(`http://172.27.228.157:3011/v1/report/campaign/export?token=${token}&campaignID=${campaignID}&type=session`, {
    method: 'GET',
    headers,
    responseType: "blob"
  });
  // return `http://172.27.228.157:3011/v1/report/campaign/export?token=${token}&campaignID=${campaignID}&type=session`
}
