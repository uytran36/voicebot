import { useState, useEffect } from 'react';

/**
 * Function hook fetch data line chart;
 * @param {Func} api - Function api to fetch data;
 * @returns 
 */
export function useFetchDataLineChart(api) {
  const [state, setState] = useState([]);
  useEffect(() => {
    const data = [
      { year: '1991', value: 3 },
      { year: '1992', value: 4 },
      { year: '1993', value: 3.5 },
      { year: '1994', value: 5 },
      { year: '1995', value: 4.9 },
      { year: '1996', value: 6 },
      { year: '1997', value: 7 },
      { year: '1998', value: 9 },
      { year: '1999', value: 13 },
    ];
    setState(data);
  }, []);

  return [state, setState];
}
