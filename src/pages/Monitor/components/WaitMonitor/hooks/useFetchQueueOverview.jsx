import { requestMonitorQueueOverview } from '@/services/call-center';
import React from 'react';

export const useFetchQueueOverview = (headers = {}, params) => {
  const [state, setState] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await requestMonitorQueueOverview(headers, params);
      if (response.msg === 'Success') {
        const data = response.response.queues;
        setState(data);
        setLoading(false);
      }
    };
    fetchData();
  }, [params]);

  return [state, loading];
};
