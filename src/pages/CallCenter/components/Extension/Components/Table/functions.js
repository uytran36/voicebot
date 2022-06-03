import { message } from 'antd';
import { formatMessage } from 'umi';
import {
  requestCreateUser,
  requestUpdateUser,
  requestUpdateUserStatus,
} from '@/services/user-management';

export const functions = {
  addUser: async (header, values) => {
    const hide = message.loading('Đang tạo');
    try {
      const res = await requestCreateUser(header, values);
      if (res && res.message === 'SUCCESS') {
        hide();
        // message.success('Tạo user thành công');
        message.success({
          content: formatMessage({ id: 'pages.user-management.message.success.create' }),
        });
        return true;
      }
      throw new Error(res && res?.error);
    } catch (err) {
      hide();
      message.error('Có lỗi khi tạo user');
      return false;
    }
  },  

  updateUser: async (header, data) => {
    const hide = message.loading('Đang cập nhật');
    try {
      const res = await requestUpdateUser(header, data);
      if (res.success) {
        hide();
        message.success('Cập nhật user thành công');
        return true;
      }
      throw new Error((res && res?.error?.msg) || 'Có lỗi khi cập nhật user');
    } catch (err) {
      hide();
      message.error(err.toString());
      return false;
    }
  },

  updateUserStatus: async (header, data) => {
    const hide = message.loading('Đang xoá');
    try {
      const res = await requestUpdateUserStatus(header, data);
      if (res && !res.status) {
        throw new Error('ERROR~');
      }
      hide();
      message.success('Thay đổi trạng thái user thành công');
      return true;
    } catch (err) {
      hide();
      message.error('Có lỗi khi cập nhật user');
      return false;
    }
  },
};
