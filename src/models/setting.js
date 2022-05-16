import defaultSettings from '../../config/defaultSettings';
import { setUp } from '@/utils/request';

const updateColorWeak = (colorWeak) => {
  const root = document.getElementById('root');

  if (root) {
    root.className = colorWeak ? 'colorWeak' : '';
  }
};

const SettingModel = {
  namespace: 'settings',
  state: defaultSettings,
  reducers: {
    changeSetting(state = defaultSettings, { payload }) {
      const { colorWeak, contentWidth } = payload;

      if (state.contentWidth !== contentWidth && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }

      updateColorWeak(!!colorWeak);
      return { ...state, ...payload };
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      console.log(dispatch)
      // when app start, we just run setUp() 1 time;
      setUp(dispatch);
    }
  }
};
export default SettingModel;
