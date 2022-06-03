import { useState, useEffect } from 'react';
import { requestInboundCallStatistic } from '@/services/call-center';

/**
 * Function hook fetch data line chart;
 * @param {Func} api - Function api to fetch data;
 * @returns
 */
export function useFetchDataInboundCall(header, params) {
  const [state, setState] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await requestInboundCallStatistic(header, params);
      if (res?.code === 200 && res?.response) {
        const numberCallInbound = [];
        const timeCallInbound = [];
        if (res.response?.chartCallInbound?.length > 0) {
          res.response?.chartCallInbound?.forEach((item) => {
            numberCallInbound.push(
              {
                day: item?.date,
                data: item?.totalFailureCall,
                type: 'Cuộc gọi thất bại',
              },
              {
                day: item?.date,
                data: item?.totalSuccessCall,
                type: 'Cuộc gọi thành công',
              },
            );
          });
        }
        if (res.response?.chartTimeCallInbound?.length > 0) {
          res.response?.chartTimeCallInbound?.forEach((item) => {
            timeCallInbound.push({
              day: item?.date,
              data: item?.totalTime,
              type: 'Cuộc gọi vào',
            });
          });
        }
        setState({
          numberInformation: res.response?.numberInformation,
          numberCallInbound,
          timeCallInbound,
        });
      }
    };
    fetchData();
    // const data = [
    //   { year: '1991', value: 3 },
    //   { year: '1992', value: 4 },
    //   { year: '1993', value: 3.5 },
    //   { year: '1994', value: 5 },
    //   { year: '1995', value: 4.9 },
    //   { year: '1996', value: 6 },
    //   { year: '1997', value: 7 },
    //   { year: '1998', value: 9 },
    //   { year: '1999', value: 13 },
    // ];
    // setState(data);
  }, [params]);

  return [state, setState];
}
