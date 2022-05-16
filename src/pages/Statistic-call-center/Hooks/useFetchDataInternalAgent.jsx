import { useState, useEffect } from 'react';
import { requestLocalStatistic } from '@/services/call-center';

export function useFetchDataInternalAgent(header, params) {
  const [state, setState] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await requestLocalStatistic(header, params);
      if (res?.code === 200 && res?.response) {
        const numberCallGeneral = [];
        const timeCallGeneral = [];
        let totalCall = 0;
        let totalTime = 0;

        if (res.response?.chartCallLocal?.length > 0) {
          res.response?.chartCallLocal?.forEach((item) => {
            numberCallGeneral.push(
              {
                day: item?.date,
                data: item?.totalIncomeCall,
                type: 'Cuộc gọi ra',
              },
              {
                day: item?.date,
                data: item?.totalOutcomeCall,
                type: 'Cuộc gọi vào',
              },
            );
          });
        }
        if (res.response?.chartTimeCallLocal?.length > 0) {
          res.response?.chartTimeCallLocal?.forEach((item) => {
            timeCallGeneral.push(
              {
                day: item?.date,
                data: item?.totalTimeOutcomeCall,
                type: 'Cuộc gọi ra',
              },
              {
                day: item?.date,
                data: item?.totalTimeIncomeCall,
                type: 'Cuộc gọi vào',
              },
            );
          });
        }
        totalCall =
          res.response.numberInformation.totalIncomeCall +
          res.response.numberInformation.totalOutcomeCall;
        totalTime =
          res.response.numberInformation.totalTimeIncomeCall +
          res.response.numberInformation.totalTimeOutcomeCall;
        const avgTime = totalCall !== 0 ? totalTime / totalCall : 0;
        console.log({ totalCall, totalTime, avgTime });
        setState({
          numberInformation: res.response?.numberInformation,
          numberCallGeneral,
          timeCallGeneral,
          totalCall,
          avgTime,
          totalTime,
        });
      }
    };
    fetchData();
  }, [params]);

  return [state];
}
