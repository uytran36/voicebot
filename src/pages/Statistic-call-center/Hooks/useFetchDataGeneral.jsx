import { useState, useEffect } from 'react';
import { requestGeneralStatistic } from '@/services/call-center';

/**
 * Function hook fetch data line chart;
 * @param {Func} api - Function api to fetch data;
 * @returns
 */
export function useFetchDataGeneral(header, params) {
  const [state, setState] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await requestGeneralStatistic(header, params);
      if (res?.code === 200 && res?.response) {
        const numberCallGeneral = [];
        const timeCallGeneral = [];
        let totalCall = 0;
        let inboundCall = 0;
        let outboundCall = 0;
        let localCall = 0;
        let inboundTime = 0;
        let outboundTime = 0;
        let localTime = 0;

        if (res.response?.chartCallGeneral?.length > 0) {
          res.response?.chartCallGeneral?.forEach((item) => {
            totalCall += item?.totalCall;
            inboundCall += item?.inboundCall;
            outboundCall += item?.outboundCall;
            localCall += item?.localCall;
            numberCallGeneral.push(
              {
                day: item?.date,
                data: item?.localCall,
                type: 'Cuộc gọi nội bộ',
              },
              {
                day: item?.date,
                data: item?.outboundCall,
                type: 'Cuộc gọi ra',
              },
              {
                day: item?.date,
                data: item?.inboundCall,
                type: 'Cuộc gọi vào',
              },
            );
          });
        }
        if (res.response?.chartTimeCallGeneral?.length > 0) {
          res.response?.chartTimeCallGeneral?.forEach((item) => {
            inboundTime += item?.inboundTime;
            outboundTime += item?.outboundTime;
            localTime += item?.localTime;
            timeCallGeneral.push(
              {
                day: item?.date,
                data: item?.localTime,
                type: 'Cuộc gọi nội bộ',
              },
              {
                day: item?.date,
                data: item?.outboundTime,
                type: 'Cuộc gọi ra',
              },
              {
                day: item?.date,
                data: item?.inboundTime,
                type: 'Cuộc gọi vào',
              },
            );
          });
        }
        setState({
          numberInformation: res.response?.numberInformation,
          numberCallGeneral,
          timeCallGeneral,
          totalCall,
          outboundCall,
          localCall,
          inboundCall,
          inboundTime,
          outboundTime,
          localTime,
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
