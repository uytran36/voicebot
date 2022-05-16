import { useState, useEffect } from 'react';

export function useFetchDataBarChart(api) {
  const [state, setState] = useState([]);

  useEffect(() => {
    // call api in here
    const data = [
      { type: 'Máy bận', value: 1 },
      { type: 'KHG từ chối', value: 2 },
      { type: 'Không bắt máy', value: 3 },
      { type: 'Dừng cuộc gọi', value: 4 },
      { type: 'Thất bại khác khác', value: 5 },
    ];
    setState(data);
  }, []);

  return [state, setState];
}
