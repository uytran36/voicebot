import React, { useState, useEffect } from 'react';
import { BarChart } from 'bizcharts';
import { requestGetNumberOfErrorCall } from '@/services/campaign-management';

const FailErrorStatistic = ({ rangeDate, headers, campaign_id }) => {
  const [data, setData] = useState([]);

  useEffect(async () => {
    let filter;
    if (rangeDate?.fromData !== undefined) {
      filter = {
        campaign_id,
        filter_data: {
          from_datetime: rangeDate.fromData,
          to_datetime: rangeDate.toDate,
        },
      };
    } else {
      filter = {
        campaign_id,
      };
    }
    const res = await requestGetNumberOfErrorCall(headers, filter);
    if (res?.success) {
      if (res?.data?.length > 0) {
        const detail = Object.keys(res?.data[0]?.call_error_detail).map((item) => {
          return {
            value: res?.data[0]?.call_error_detail[item],
            type: item,
          };
        });
        setData(detail);
      }
    }
  }, []);

  return (
    <BarChart
      color={'#FF4D4F'}
      data={data}
      xField={'value'}
      yField={'type'}
      title={{
        visible: true,
        text: 'Số lượng cuộc gọi',
        style: {
          fontFamily: 'Helvetica',
          textAlign: 'center',
          fontSize: '20px',
        },
      }}
      description={{
        visible: true,
        alignTo: 'left',
        text: 'Nguyên nhân',
        style: {
          fontSize: 16,
          fill: 'black',
          fontFamily: 'Helvetica',
          fontWeight: 'bold',
        },
      }}
    />
  );
};

export default FailErrorStatistic;
