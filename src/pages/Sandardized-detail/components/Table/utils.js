import { uniq } from 'lodash';
import { requestCheckDataDNC, requestUpdateOmniContactList } from '@/services/campaign-management';

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
    if (!res || res.error) {
      throw new Error('No response.');
    }
    // sdt không tồm tại trong DoNotCall.
    // return data ngược lại filter 2 mảng doNotCall và other
    if (!res || res.length === 0) {
      return {
        cleanData: data,
        doNotCall,
      };
    }
    // const resMap = res.map((elm) => elm.msisdn);
    data.forEach((elm) => {
      if (res.includes(elm.sdt)) {
        elm.warning = ['sdt'];
        doNotCall.push(elm);
      } else {
        other.push(elm);
      }
    });
    return {
      cleanData: other,
      doNotCall,
    };
  } catch (err) {
    throw new Error(err)
  }
}

export async function handleCheckDataError (values, headers = {}) {
  if (!Array.isArray(values)) {
    throw new Error('params is not array!')
  }
  const errorData = {
    wrongFormat: [],
    // dnc: [],
    notFound: [], // sdt is required
  };
  const dataMapingWithRule = [];
  try {
    values.forEach((elm) => {
      if (!elm.sdt || elm.sdt.length === 0) {
        errorData.notFound.push({...elm, error: ['sdt']})
        return elm;
      }
      const result = checkDataError(elm);
      if (result?.error) {
        errorData.wrongFormat.push(result);
      } else {
        dataMapingWithRule.push(result)
      }
      return result;
    });
    // if (dataMapingWithRule.length > 0) {
    //   // trả về danh sách sdt có trong DoNotCall
    //   const {
    //     doNotCall,
    //     cleanData
    //   } = await filterDataDNC(dataMapingWithRule, headers);
    //   errorData.dnc = doNotCall;
    //   return {
    //     errorData,
    //     cleanData,
    //     doNotCall,
    //   };
    // }
    return {
      errorData,
      cleanData: dataMapingWithRule,
      doNotCall: [],
    };
  } catch (err) {
    throw new Error(err);
  }
}

export async function onDeleteDataError(values, headers = {}) {
  try {
    const { errorData, cleanData, doNotCall } = await handleCheckDataError(values, headers);
    return {
      errorData,
      cleanData,
      doNotCall
    };
  } catch(err) {
    throw new Error(err);
  }
}

export async function onRequestUpdateOmniContactList(headers, values){
  try {
    const res = await requestUpdateOmniContactList(headers, values);
    if (res && res.error) {
      throw new Error(res.error.message);
    }
    return res;
  } catch (err) {
    throw new Error(err);
  }
};