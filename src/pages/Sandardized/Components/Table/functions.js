import { result, uniq } from 'lodash';
import { requestUpdateNormalizations, requestCheckDataDNC } from '../../service';

/**
 *
 * @param data phải object
 */
// kiểm tra dữ liệu
function checkDataError(data) {
  const _data = { ...data };
  _data.sdt = _data.sdt.replace('+84', '0');
  _data.sdt = _data.sdt.replace('(+84)', '0');
  let error = _data?.error || [];
  if (/^\d+$/.test(_data?.sdt)) {
    // nếu sdt đúng rule
    if (_data.sdt.charAt(0) === '0' && _data.sdt.length === 10) {
      error = error.filter((err) => err !== 'sdt');
    }
     else if (
      _data.sdt.charAt(0) === '8' &&
      _data.sdt.charAt(1) === '4' &&
      _data.sdt.length === 11
    ) {
      _data.sdt = _data.sdt.replace('84', '0')
      error = error.filter((err) => err !== 'sdt');
    }
     else {
      error = uniq([...error, 'sdt']);
    }
  }
  if (error.length === 0) {
    if (_data.error) {
      delete _data.error;
    }
    return _data;
  }

  return {
    ..._data,
    error,
  };
}

async function filterDataDNC(data, headers) {
  const doNotCall = [];
  const other = [];
  try {
    const res = await requestCheckDataDNC(
      headers,
      data.map((elm) => ({
        msisdn: elm?.sdt,
      })),
    );
    if (res.error) {
      throw new Error('No response.');
    }
    // sdt không tồm tại trong DoNotCall.
    // return data ngược lại filter 2 mảng doNotCall và other
    if (!res || res.length === 0) {
      return {
        other: data,
        doNotCall,
      };
    }
    // const resMap = res.map((elm) => elm.msisdn);
    data.forEach((elm) => {
      if (res.includes(elm.sdt)) {
        elm.error = ['sdt'];
        doNotCall.push(elm);
      } else {
        other.push(elm);
      }
    });
    return {
      other,
      doNotCall,
    };
  } catch (err) {
    return Promise.reject(new Error(err.toString()));
  }
}

export default {
  handleDeleteError: async (values, headers) => {
    if (!Array.isArray(values)) {
      return 'params is not array!';
    }

    const result = [];
    values.forEach((elm) => {
      const _reuslt = checkDataError(elm);
      if (!_reuslt?.error) {
        result.push(_reuslt);
      }
    });
    // console.log({result})
    try {
      if (result.length > 0) {
        // trả về danh sách sdt không có trong DoNotCall
        const { other } = await filterDataDNC(result, headers);
        return other;
      } else {
        return;
      }
    } catch (err) {
      return Promise.reject(new Error(err.toString()));
    }
  },

  handleCheckDataError: async (values, headers) => {
    if (!Array.isArray(values)) {
      return 'params is not array!';
    }
    const wrongData = [];
    const dataChecked = values.map((elm) => {
      const reuslt = checkDataError(elm);
      if (reuslt?.error) {
        wrongData.push(result);
      }
      return reuslt;
    });
    try {
      // trả về danh sách sdt có trong DoNotCall
      const { doNotCall } = await filterDataDNC(dataChecked, headers);
      // console.log({doNotCall})
      return {
        dataChecked,
        numWrong: [...wrongData, ...doNotCall].length,
      };
    } catch (err) {
      return Promise.reject(new Error(err.toString()));
    }
  },

  handleRequestUpdateNormalizations: async (headers, values) => {
    try {
      const res = await requestUpdateNormalizations(headers, values);
      if (res && res.error) {
        throw new Error(res.error.message);
      }
      return res;
    } catch (err) {
      return Promise.reject(new Error(err.toString()));
    }
  },

  handleViewDataError: async (values, headers) => {
    if (!Array.isArray(values)) {
      return Promise.reject(new Error('params is not array'));
    }
    const errorData = []; // wrong type phone number
    const dataIsNotError = [];
    values.forEach((elm) => {
      const data = checkDataError(elm);
      if (data?.error) {
        errorData.push(data);
      } else {
        dataIsNotError.push(data);
      }
    });
    try {
      if (dataIsNotError.length > 0) {
        const { other, doNotCall } = await filterDataDNC(dataIsNotError, headers);
        return {
          sortData: [...errorData, ...doNotCall, ...other],
          numWrong: errorData.length,
          doNotCall: doNotCall,
        };
      } else {
        return {
          sortData: [...errorData, ...dataIsNotError],
          numWrong: errorData.length,
          // doNotCall: []
        };
      }
    } catch (err) {
      return Promise.reject(new Error(err.toString()));
    }
  },
};
