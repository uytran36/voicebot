import component from './vi-VN/component';
import globalHeader from './vi-VN/globalHeader';
import menu from './vi-VN/menu';
import pwa from './vi-VN/pwa';
import settingDrawer from './vi-VN/settingDrawer';
import settings from './vi-VN/settings';
import pages from './vi-VN/pages';

export default {
  'navBar.lang': 'Ngôn ngữ',
  'layout.user.link.help': 'Trợ giúp',
  'layout.user.link.privacy': 'Riêng tư',
  'layout.user.link.terms': 'Điều khoản',
  'app.preview.down.block': 'Tải trang này xuống dự án của bạn',
  'app.welcome.link.fetch-blocks': 'Nhận tất cả khối',
  'app.welcome.link.block-list': 'Nhanh chóng xây dựng tiêu chuẩn, các trang dựa trên phát triển `khối`',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
