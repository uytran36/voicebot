import { message } from 'antd';
import {
  requestCreateAPIData,
  requestCreateAPIDataExport,
  requestfetchAPIData,
  requestfetchAPIDataExport,
  requestUpdateAPIData,
  requestUpdateAPIDataExport,
  requestDeleteAPIData,
  requestDeleteAPIDataExport,
  requestTestLoadAPIData,
} from '@/services/datacall-management';

export const fetchAPIDataImport = async ({ headers, params }) => {
  try {
    const res = await requestfetchAPIData(headers, {
      offset: params.current,
      limit: params.pageSize,
      search: params.search,
      filter:
        params.from && Object.keys(params.from).length !== 0
          ? {
              from_datetime: params.from,
              to_datetime: params.to,
            }
          : null,
    });
    if (res?.success === true) {
      return {
        data: res.data,
        total: res.length,
      };
    }
    throw new Error('error...');
  } catch (err) {
    return {
      data: [],
      total: 0,
    };
  }
};

export const fetchAPIDataExport = async ({ headers, params }) => {
  try {
    const res = await requestfetchAPIDataExport(headers, {
      offset: params.current,
      limit: params.pageSize,
      search: params.search,
      filter:
        params.from && Object.keys(params.from).length !== 0
          ? {
              from_datetime: params.from,
              to_datetime: params.to,
            }
          : null,
    });
    if (res?.success === true) {
      return {
        data: res.data,
        total: res.length,
      };
    } else {
      throw new Error('error');
    }
  } catch (err) {
    return {
      data: [],
      total: 0,
    };
  }
};

export const fetchPermissionWithApiData = async (headers, params) => {
  try {
    const res = await requestGetApiDataWithApiDataName(headers, params);
    if (Array.isArray(res?.permissions)) {
      return res.permissions;
    }
    if (Array.isArray(res)) {
      return res;
    }
    throw new Error(res.toSring() || 'error...');
  } catch (err) {
    message.error(err.toSring());
    return [];
  }
};

export const createAPIData = async (headers, data) => {
  const hide = message.loading('Đang tạo...');
  try {
    const res = await requestCreateAPIData(headers, data);
    if (res && res?.success === false && res?.error?.includes('already existed')) {
      hide();
      message.warning(`Vai trò #${data.name} đã tồn tại.`);
      return false;
    }
    if (res && res?.success === true && res?.data) {
      hide();
      message.success(`Tạo API Data ${res?.data?.name} thành công.`);
      return true;
    }
    throw new Error(res && res.error && 'Có lỗi trong quá trình tạo API Data, kiểm tra lại tên.');
  } catch (err) {
    hide();
    message.error(err.toString());
    return false;
  }
};

export const createAPIDataExport = async (headers, data) => {
  const hide = message.loading('Đang tạo...');
  try {
    const res = await requestCreateAPIDataExport(headers, data);
    if (res && res?.success === false) {
      hide();
      return false;
    }
    if (res && res?.success === true && res?.data) {
      hide();
      message.success(`Tạo API Data ${res?.data?.name} thành công.`);
      return true;
    }
    throw new Error(res && res.error && 'Có lỗi trong quá trình tạo API Data, kiểm tra lại tên.');
  } catch (err) {
    hide();
    message.error(err.toString());
    return false;
  }
};

export const updateAPIData = async (headers, data) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    const res = await requestUpdateAPIData(headers, data);
    if (res && res?.success === true && res?.data) {
      hide();
      message.success(`Cập nhật API Data thành công.`);
      return true;
    }
    throw new Error(res && res.message);
  } catch (err) {
    hide();
    message.error('Có lỗi trong quá trình cập nhật.');
    return false;
  }
};

export const updateAPIDataExport = async (headers, data) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    const res = await requestUpdateAPIDataExport(headers, data);
    if (res && res?.success === true && res?.data) {
      hide();
      message.success(`Cập nhật API Data thành công.`);
      return true;
    }
  } catch (err) {
    hide();
    message.error('Có lỗi trong quá trình cập nhật.');
    return false;
  }
};

export const deleteAPIData = async (headers, id) => {
  const hide = message.loading('Đang xóa...');
  const configId = {
    configuration_id: id,
  };
  try {
    const res = await requestDeleteAPIData(headers, configId);
    if (res && res?.success === true) {
      message.success(res.message || 'Xoá API Data thành công');
      hide();
      return true;
    }
    message.warning(res.message || 'Xoá API Data thất bại');
    hide();
    return false;
  } catch (err) {
    message.error('Xoá API Data thất bại');
    console.error(err.toString());
    hide();
    return false;
  }
};

export const deleteAPIDataExport = async (headers, id) => {
  const hide = message.loading('Đang xóa...');
  const configId = {
    configuration_id: id,
  };
  try {
    const res = await requestDeleteAPIDataExport(headers, configId);
    if (res && res?.success === true) {
      message.success(res.message || 'Xoá API Data thành công');
      hide();
      return true;
    }
    message.warning('Xoá API Data thất bại');
    hide();
    return false;
  } catch (err) {
    message.error('Xoá API Data thất bại');
    console.error(err.toString());
    hide();
    return false;
  }
};

export const testLoadAPIData = async (headers, data) => {
  const hide = message.loading('Đang test load...');
  try {
    const res = await requestTestLoadAPIData(headers, data);
    if (res && res?.success === true && res?.data) {
      return res.data;
    }
    throw new Error(res && res.message);
  } catch (err) {
    hide();
    message.error('Có lỗi trong quá trình test load.');
    return false;
  }
};
