import React, { useState, useEffect } from 'react';
import { StackedColumnChart } from 'bizcharts';
import styles from './styles.less';
import { requestGetCallStatisticsByDay } from '@/services/campaign-management';

const AmountOutbound = ({ rangeDate, headers, campaign_id }) => {
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

    const res = await requestGetCallStatisticsByDay(headers, filter);
    if (res?.success) {
      if (res?.data?.length > 0) {
        const detail = res?.data[0]?.call_state_of_the_day;
        const temp = Object.keys(detail).map((item) => {
          let array = [
            {
              day: item,
              data: res?.data[0]?.call_state_of_the_day[item].success,
              type: 'Cuộc gọi thành công',
            },
            {
              day: item,
              data: res?.data[0]?.call_state_of_the_day[item].failure,
              type: 'Cuộc gọi thất bại',
            },
          ];
          return array;
        });

        setData(temp[0]);
      }
    }
  }, []);

  return (
    <StackedColumnChart
      data={data}
      color={['#428DFF', '#FF9B2F']}
      xField="day"
      yField="data"
      stackField="type"
      title={{
        visible: false,
        text: 'Số lượng cuộc gọi',
        style: {
          textAlign: 'top-left',
          fontWeight: 'bold',
          fontFamily: 'Roboto',
          fontSize: 16,
          color: 'rgba(0, 0, 0, 0.85)',
        },
      }}
      legend={{
        visible: true,
        custom: true,
        allowAllCanceled: true,
        position: 'top-center',
        items: [
          {
            value: 'Cuộc gọi thành công',
            name: 'Cuộc gọi thành công',
            marker: {
              symbol: 'square',
              style: { fill: '#428DFF', r: 5 },
            },
          },
          {
            value: 'Cuộc gọi thất bại',
            name: 'Cuộc gọi thất bại',
            marker: {
              symbol: 'square',
              style: { fill: '#FF9B2F', r: 5 },
            },
          },
        ],
      }}
    />
  );
};

export default AmountOutbound;
