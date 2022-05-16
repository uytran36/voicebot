import { requestGetCampaigns } from './service';
import { requestGetSipProfile } from '../Config/service';

const Model = {
  namespace: 'campaign',
  state: {
    strategy: '',
    scenario: '',
    nameCampaign: '',
    initialValues: {},
    sipProfile: [],
    listBgMusic: [],
    data: [], // data table step 2,
    openForm: false,
    showTableStep2: false,
  },
  effects: {
    // changle local state in redux
    *execution({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },

    *fetchListCampaigns({ payload, headers }, { call, put }) {
      const res = yield call(requestGetCampaigns, { query: payload, headers });
      if (res.success) {
        yield put({
          type: 'save',
          payload: {
            initialValues: Array.isArray(res.campaigns) ? res.campaigns[0] : res,
            nameCampaign: Array.isArray(res.campaigns)
              ? res.campaigns[0].campaignScenario.scenario_name
              : res.campaignScenario.scenario_name,
          },
        });
      }
    },

    *getSipProfile({ headers }, { call, put }) {
      const res = yield call(requestGetSipProfile, headers);
      if (res) {
        yield put({
          type: 'save',
          payload: {
            sipProfile: res,
          },
        });
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
