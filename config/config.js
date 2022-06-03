// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    // default: 'en-US',
    default: 'vi-VN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
    title: false,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    '@primary-color': defaultSettings.primaryColor,
    '@layout-header-background': defaultSettings.layoutHeaderBg,
    '@menu-dark-item-active-bg': defaultSettings.layoutHeaderBgActive,
    '@layout-body-background': defaultSettings.layoutBodyBackground,
    '@font-family': defaultSettings.font,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  esbuild: {},
  define: {
    'process.env.UMI_WS_CALL_CENTER_URL': process.env.UMI_WS_CALL_CENTER_URL,
    'process.env.UMI_IFRAME_CALL_CENTER_URL': process.env.UMI_IFRAME_CALL_CENTER_URL,
    'process.env._UMI_API_REPORT_URL': process.env._UMI_API_REPORT_URL,
    'process.env.UMI_CHAT_URL': process.env.UMI_CHAT_URL,
    'process.env.UMI_WIDGET_LIVECHAT_URL': process.env.UMI_WIDGET_LIVECHAT_URL,
    'process.env.UMI_API_BASE_URL': process.env.UMI_API_BASE_URL,
    'process.env.UMI_API_REPORT_URL': process.env.UMI_API_REPORT_URL,
    'process.env.REACT_APP_WEBSOCKET_SSL': process.env.REACT_APP_WEBSOCKET_SSL,
    'process.env.REACT_APP_URL_ROCKETCHAT': process.env.REACT_APP_URL_ROCKETCHAT,
    'process.env.URL_API_CM': process.env.URL_API_CM,
    'process.env.URL_API_SERVICE_COLLAB_CHAT': process.env.URL_API_SERVICE_COLLAB_CHAT,
    'process.env.URL_API_REPORT_SERVICE': process.env.URL_API_REPORT_SERVICE,
    'process.env.WidgetName': process.env.WidgetName,
    'process.env.IFRAME_USERNAME': process.env.IFRAME_USERNAME,
    'process.env.IFRAME_KEY': process.env.IFRAME_KEY,
    'process.env.IFRAME_UUID': process.env.IFRAME_UUID,
    'process.env.IFRAME_UUID_INBOUND': process.env.IFRAME_UUID_INBOUND,
    'process.env.CLIENT_ID_FB': process.env.CLIENT_ID_FB,
    'process.env.REDIRECT_URI_FB': process.env.REDIRECT_URI_FB,
    'process.env.CLIENT_SECRET_FB': process.env.CLIENT_SECRET_FB,
    'process.env.STUN_URL': process.env.STUN_URL,
    'process.env.UMI_API_URL': process.env.UMI_API_URL,
    'process.env.UMI_DOMAIN': process.env.UMI_DOMAIN,
    'process.env.PORT': process.env.PORT,
    'process.env.REDIRECT_URI_PROTOCOL': process.env.REDIRECT_URI_PROTOCOL,
    'process.env.REDIRECT_URI_DOMAIN': process.env.REDIRECT_URI_DOMAIN,
    'process.env.TENANT_NAME': process.env.TENANT_NAME,
    'process.env.CLIENT_ID': process.env.CLIENT_ID,
    'process.env.SECRET_ID': process.env.SECRET_ID,
    'process.env.SECRET_VALUE': process.env.SECRET_VALUE,
    'process.env.ENV': process.env.ENV,
  },
  chainWebpack(memo) {
    memo.module
      .rule('media')
      .test(/\.(mp3|4)$/)
      .use('file-loader')
      .loader(require.resolve('file-loader'));
  },
});
