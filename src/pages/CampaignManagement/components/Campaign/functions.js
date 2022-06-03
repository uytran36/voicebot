import { message } from 'antd';
import { requestGetCampaigns } from '../../service';

export default {
    fetchListCampaign: async (headers, params) => {
        try {
            const res = await requestGetCampaigns({headers, params})
            if(res.success) {
                return res.campaigns
            }
            throw new Error(res.error || 'Error...')
        } catch(err) {
            // message.error(err.toString())
            return []
        }
    }
}
