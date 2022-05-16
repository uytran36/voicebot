import { requestMonitorAgentTable } from '@/services/call-center';
import React from 'react';

export const useFetchTableData = (headers = {}, params = {}, tick) => {
  const [state, setState] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(
    () => {
      const fetchData = async () => {
        setLoading(true);
        const response = await requestMonitorAgentTable(headers, params);
        if (response.code === 200) {
          setState(response.response.data);
          setLoading(false);
        }
      };
      fetchData();
    },
    [params, tick],
    tick,
  );
  return [state, loading];
};
