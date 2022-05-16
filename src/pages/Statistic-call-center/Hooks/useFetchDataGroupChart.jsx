import { useState, useEffect } from 'react';
import DataSet from '@antv/data-set';

const ds = new DataSet();

export function useFetchDataGroupChart(api, options) {
  const [state, setState] = useState([]);
  const { x, y, stackField } = options; // required
  useEffect(() => {
    // call api in here
    const data = [
      { type: 'success', date: '2/1', value: 163 },
      { type: 'success', date: '2/2', value: 203 },
      { type: 'failure', date: '2/1', value: 502 },
      { type: 'failure', date: '2/2', value: 635 },
    ];
    const dv = ds
      .createView()
      .source(data).transform({
        type: 'map',
        callback: (obj) => {
          const cloneObj = obj;

          return {
            ...obj,
            xField: obj[x],
            yField: obj[y],
            stackField: obj[stackField],
          }
        }
      });
    setState(dv.rows);
  }, [stackField, x, y]);

  return [state, setState];
}
