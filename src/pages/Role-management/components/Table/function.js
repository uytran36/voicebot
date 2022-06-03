import { message } from 'antd';
import {
  requestRoleList,
  requestCreateRole,
  requestUpdateRole,
  requestDeleteRole,
  requestUserCreateRole,
  requestGetRoleWithRoleName,
  requestGetPermissionByRoleId,
} from '@/services/role-management';

export const fetchRoleList = async ({ headers, params }) => {
  if (params.from === '') delete params.from;
  if (params.to === '') delete params.to;
  try {
    const res = await requestRoleList(headers, {
      offset: params.current,
      limit: params.pageSize,
      role: params.role,
      create_by: params.create_by,
      from_date: params?.from,
      to_date: params?.to
    });
    if (res?.success === true && Array.isArray(res.data)) {
      return {
        data: res.data,
        total: res.length
      }
    }
    throw new Error(res.toSring() || 'error...');
  } catch (err) {
    message.error(err.toSring());
    return {
      data: [],
      total: 0,
    };
  }
}

export const getPermissionByRoleId = async (headers, params) => {
  try {
    const res = await requestGetPermissionByRoleId(headers, params);
    if (res?.success && Array.isArray(res?.data)) {
      return res.data;
    }
    throw new Error(res.toSring() || 'error...');
  } catch (err) {
    message.error(err.toSring());
    return [];
  }
}

export const fetchPermissionWithRole = async (headers, params) => {
  try {
    const res = await requestGetRoleWithRoleName(headers, params);
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
}

export const createRole = async (headers, data) => {
  const hide = message.loading('Đang tạo...');
  if (!data.description) {
    data['description'] = '';
  }
  try {
    const res = await requestCreateRole(headers, data);
    if (res?.error?.includes('Role already exist')) {
      hide();
      message.warning(`Vai trò #${data.role} đã tồn tại.`);
      return false;
    }
    if (res && res?.success === false && res?.error.includes('list_permission is not null')) {
      hide();
      message.warning(`Vui lòng chọn tối thiểu 1 quyền.`);
      return false;
    }
    if (res && res?.success === true) {
      hide();
      message.success(`Tạo vai trò thành công.`);
      return true;
    }
    throw new Error(res && res.error && 'Có lỗi trong quá trình tạo vai trò, kiểm tra lại tên.');
  } catch (err) {
    hide();
    message.error(`Tạo vai trò thất bại`);
    return false;
  }
}

export const updateRole = async (headers, data) => {
  const hide = message.loading('Đang cập nhật...');
  try {
    const res = await requestUpdateRole(headers, data);

    if (res && res?.success === false && res?.error.includes('list_permission is not null')) {
      hide();
      message.warning(`Vui lòng chọn tối thiểu 1 quyền.`);
      return false;
    }
    if (res && res?.success === true) {
      hide();
      message.success(`Cập nhật vai trò thành công.`);
      return true;
    }
    throw new Error((res && res.message));
  } catch (err) {
    hide();
    message.error('Có lỗi trong quá trình cập nhật.');
    return false;
  }
}

/**
 * @param {Object} headers
 * @param {string[]} ids
 * @returns boolean
 */
export const deleteRole = async (headers, ids) => {
  const hide = message.loading('Đang xóa...');
  try {
    const objIDs = {
      roles_id: ids
    }
    const res = await requestDeleteRole(headers, objIDs);
    if (res && res?.success === true) {
      message.success(res.message || 'Xoá vai trò thành công');
      hide();
      return true
    }
    message.warning(res.message || 'Xoá vai trò thất bại');
    hide();
    return false
  } catch (err) {
    message.error('Xoá vai trò thất bại');
    console.error(err.toString());
    hide();
    return false
  }
}

export const fetchUser = async (headers, data) => {
  try {
    const res = await requestUserCreateRole(headers);
    if (res && res?.success === true) {
      return {
        data: res.data,
        total: res.length,
      };
    }
    throw new Error(res && res.error && 'Có lỗi trong quá trình lấy thông tin.');
  } catch (err) {
    return {
      data: [],
      total: 0,
    };
  }
}


