const Model = {
  namespace: 'campaign2',
  state: {
    campaignName: '',
    omniContactID: [],
    background_music: '',
    voiceSelect: '',
    campaignScenario: {
      id: '',
      introdution: {},
      dtmf: [],
    },
    campaignStrategies: {
      id: '',
    },
    createtime: '',
    campaignInfo: {},
  },
  effects: {
    // changle local state in redux
    *execution({ payload }, { put }) {
      yield put({
        type: 'save',
        payload,
      });
    },
    *saveCampaignInfo({ payload }, { put }) {
      yield put({
        type: 'save',
        payload: {
          campaignInfo: payload,
        },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    saveCampaignScenario(state, { payload }) {
      return {
        ...state,
        campaignScenario: {
          ...state.campaignScenario,
          ...payload,
        },
      };
    },

    saveCampaignStragetie(state, { payload }) {
      return {
        ...state,
        campaignStrategies: {
          ...state.campaignStrategies,
          ...payload,
        },
      };
    },
  },
};
export default Model;
