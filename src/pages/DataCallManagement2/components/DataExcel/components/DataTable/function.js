import { message } from 'antd';
import {
  requestFetchDataList,
  requestDeleteExcelData,
  requestDownloadExcelData,
  requestDownloadLink,
} from '@/services/datacall-management';
import { endpoint } from '@/services/auth';
import fileDownload from 'js-file-download';

export const fetchDataList = async ({ headers, params }) => {
  try {
    const res = await requestFetchDataList(headers, {
      pagination_enable: true,
      pagination_current: params.current,
      pagination_size: params.pageSize,
      data_type: 'excel',
      search: params.name,
      filter:
        params.from && Object.keys(params.from).length !== 0
          ? {
              from_datetime: params.from,
              to_datetime: params.to,
            }
          : null,
    });
    if (res.success === true && Array.isArray(res.data)) {
      return {
        data: res.data[0].data,
        total: res.data[0].total_db_record,
      };
    }
    throw new Error(res.toString() || 'error...');
  } catch (err) {
    message.error(err.toString());
    return {
      data: [],
      total: 0,
    };
  }
};

/**
 * @param {Object} headers
 * @param {string[]} ids
 * @returns boolean
 */
export const deleteExcelData = async (headers, ids) => {
  const hide = message.loading('Đang xóa...');
  try {
    const res = await requestDeleteExcelData(headers, {
      call_data_ids: ids,
    });
    if (res.success === true) {
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

export const downloadExcelData = async (headers, record) => {
  const hide = message.loading('Đang lấy liên kết...');
  try {
    const res = await requestDownloadExcelData(headers, {
      call_data_id: record.id,
    });
    if (res.success === true) {
      message.success(res.message || 'Lấy liên kết thành công');
      const downloader = await axios({
        url,
        method: 'GET',
        headers,
        responseType: 'blob', // Important
      });
      fileDownload(downloader, `${record.name}.xlsx`);
      hide();
      return true;
    }
    message.warning(res.message || 'Data không được phép download');
    hide();
    return false;
  } catch (err) {
    message.error('Lấy liên kết thất bại');
    console.error(err.toString());
    hide();
    return false;
  }
};
