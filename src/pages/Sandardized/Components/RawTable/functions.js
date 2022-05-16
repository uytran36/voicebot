import { requestContactHistories, requestDeleteContactHistory } from '../../service';
import { message } from 'antd';

export default {
    fetchContactHistories: async (headers, params) => {
        try {
            const res = await requestContactHistories(headers, {filter: {...params}});
            if(Array.isArray(res)) {
                const lastItem = res.pop()
                return {
                    data: res,
                    total: lastItem.total
                }
            }
            throw new Error('Fetch data failed')
        } catch(err) {
            console.error(err.toString())
            return {
                data: [],
                total: 0
            }
        }
    },
    handleDeleteContactHistory: async (header, id) => {
        try {
            const res = await requestDeleteContactHistory(header, id)
            return res
        } catch(err) {
            message.error(err.toString() || 'ERROR~')
            return null
        }
    }
}
