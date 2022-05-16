import request from '@/utils/request';
import { requestOmniContactListNormalization } from '@/pages/Sandardized/service';
import api from '@/api';

const { CM_SERVICE } = api;

export { requestOmniContactListNormalization, CM_SERVICE };

export async function requestUpdateCampaign(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/update_campaign`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestCreateCampaign(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/create_new_campaign`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestDuplicateCampaign(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/duplicate_campaign`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestUpdateCampaignConfig(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/update_campaign_configuration`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestGetListAPI(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/get_configuration_call_data_by_api`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestGetListExcel(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/get_call_data`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestDownLoadFileError(headers, url) {
  return request(url, {
    method: 'GET',
    headers,
    responseType: 'blob',
  });
}

export async function requestSaveValidatedExcel(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/save_validated_excel_rows`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestDownloadTemplateExcel(headers) {
  return request(`${api.UMI_API_BASE_URL}/campaign/download_excel_template`, {
    method: 'GET',
    headers,
    responseType: 'blob',
  });
}

//campaign script
export async function getListCampaignScript(headers) {
  return request(`${api.UMI_API_BASE_URL}/campaign/get_list_campaign_script`, {
    method: 'GET',
    headers,
  });
}

export async function new_campaign_script(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/new_campaign_call_script`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function update_campaign_script(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/update_campaign_call_script`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function uploadSoundFile(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/upload_file_audio_to_stream`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function geLinkTTS(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/get_link_tts`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function getVariableTTS(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/get_variable_tts`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function getFunctionTTS(headers) {
  return request(`${api.UMI_API_BASE_URL}/campaign/get_text_function`, {
    method: 'POST',
    headers,
  });
}

export async function getReturnDataAPIs(headers) {
  const data = {
    offset: 1,
    limit: 1000,
  };
  return request(`${api.UMI_API_BASE_URL}/campaign/get_return_call_data_by_api`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function getListSampleScript(headers) {
  return request(`${api.UMI_API_BASE_URL}/campaign/get_list_sample_script`, {
    method: 'POST',
    headers,
  });
}

export async function getSampleScriptById(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/get_sample_script_by_id`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function getScriptById(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/get_campaign_script_id`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestGetSipProfile(headers) {
  return request(`${api.VOICE_SERVICE}/pbx-sip-profiles`, {
    method: 'GET',
    headers,
  });
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
  return {
    error: 'ID is required...',
  };
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
  return {
    error: 'ID is required...',
  };
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

export async function requestGetCampaigns({ headers, query, data }) {
  if (query === undefined) {
    return request(`${api.UMI_API_BASE_URL}/campaign/get_campaign`, {
      method: 'POST',
      headers,
      data,
    });
  }
  return request(`${api.UMI_API_BASE_URL}/campaign/get_campaign_by_id`, {
    method: 'POST',
    data: { campaign_id: query },
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

export async function requestDeleteOmniContactListNormalizations(headers, id) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations/${id}`, {
    method: 'DELETE',
    headers,
  });
}

export async function requestUpdateOmniContactListNormalizations(body, id, headers = {}) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

export async function requestGetOmniContactListBase(headers, params) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-bases`, {
    method: 'GET',
    headers,
    params,
  });
}

// export async function requestUpdateCampaign(headers, data, id) {
//   if (id) {
//     return request(`${api.CAMPAIGN_SERVICE}/campaigns/${id}`, {
//       method: 'PATCH',
//       data,
//       headers,
//     });
//   }
//   return {
//     error: 'ID is required...',
//   };
// }

export async function requestDeleteCampaign(headers, id) {
  return request(`${api.UMI_API_BASE_URL}/campaign/delete_campaign`, {
    method: 'POST',
    headers,
    data: { campaign_id: id },
  });
}

export async function requestUpdateOmniContactList(headers, data) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-addupdate`, {
    method: 'POST',
    data,
    headers,
  });
}

export async function requestDeleteContactHistory(headers, id) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-base-all-child/${id}`, {
    method: 'DELETE',
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
        where: {
          scenario_name: name,
        },
      },
    },
    headers,
  });
}

export async function requestExportReportCampaign(headers, token, campaignID) {
  return request(
    `${api.REPORT_SERVICE}/v1/report/campaign/export?token=${token}&campaignID=${campaignID}&type=session`,
    {
      // return request(`http://172.27.228.157:3011/v1/report/campaign/export?token=${token}&campaignID=${campaignID}&type=session`, {
      method: 'GET',
      headers,
      responseType: 'blob',
    },
  );
  // return `http://172.27.228.157:3011/v1/report/campaign/export?token=${token}&campaignID=${campaignID}&type=session`
}

export async function requestCheckDataDNC(headers, data) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-check-dnc`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestContactHistories(headers, params) {
  return request(`${api.CM_SERVICE}/api/v1/xls-contact-list-histories`, {
    method: 'GET',
    headers,
    params,
  });
}

export async function requestContactNormalizations(headers, params) {
  return request(
    `${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-only-xlscontactobject`,
    {
      method: 'GET',
      headers,
      params,
    },
  );
}

// export async function requestContactNormalizationsExport(headers, params) {
//   return request(
//     `${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-only-xlscontactobject`,
//     {
//       method: 'GET',
//       headers,
//       params,
//     },
//   );
// }

export async function reuqestDeleteContactListNormalization(id, headers = {}) {
  return request(`${api.CM_SERVICE}/api/v1/omni-contact-list-normalizations-all-child/${id}`, {
    method: 'DELETE',
    headers,
  });
}

export async function requestImportFile(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/upload_excel_data`, {
    method: 'POST',
    headers,
    data: { ...data, download_enable: true },
  });
}

export async function requestChangeStatus(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/change_status`, {
    method: 'POST',
    headers,
    data,
  });
}

export async function requestGetExtensionNumber(headers, data) {
  return request(`${api.UMI_API_BASE_URL}/campaign/get_extension_number`, {
    method: 'POST',
    headers,
    data,
  });
}
