import React from 'react';
import { requestMonitorQueueDetail } from '@/services/call-center';

export const useFetchQueueDetail = (headers = {}, params, queueId) => {
  const [state, setState] = React.useState({ calls: [], agents: [] });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await requestMonitorQueueDetail(headers, params, queueId);
      if (response.msg === 'Success') {
        const { calls, agents } = response.response.details;
        setState({ calls, agents });
        setLoading(false);
      }
    };
    if (queueId) {
      fetchData();
    }
  }, [params, queueId]);
  return [state, loading];
};
