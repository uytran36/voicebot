import { requestContactNormalizations, reuqestDeleteContactListNormalization } from '../../service';
import { message } from 'antd';

export default {
  fetchContactNormalizations: async (headers, params) => {
    console.log({params})
    try {
      const res = await requestContactNormalizations(headers, {filter: {...params}});
      if (Array.isArray(res)) {
        const lastItem = res.pop();
        return {
          data: res,
          total: lastItem.total
      };
      }
      throw new Error('Fetch data failed');
    } catch (err) {
      console.error(err.toString());
      return {
        data: [],
        total: 0
    };
    }
  },
  handleDeleteOmniCOntactListNormalization: async (header, id) => {
    try {
      const res = await reuqestDeleteContactListNormalization(header, id);
      return res;
    } catch (err) {
      message.error(err.toString());
      return [];
    }
  },
};
