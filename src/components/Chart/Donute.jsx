import React from 'react';
import { DonutChart } from 'bizcharts';

function RenderDonuteChart({ ...rest }) {
  return (
    <DonutChart
      title={{
        visible: true,
        style: {
          fontWeight: 'bolder',
          textAlign: 'center',
        },
      }}
      autoFit
      width={450}
      height={450}
      radius={0.8}
      innerRadius={0.6}
      label={{
        visible: false,
      }}
      padding="auto"
      color={['#428dff', '#07c2de', '#d9d9d9']}
      angleField="value"
      colorField="type"
      pieStyle={{ stroke: 'white', lineWidth: 2 }}
      legend={{
        position: 'bottom',
        marker: {
          symbol: 'square',
        },
      }}
      {...rest}
    />
  );
}

export default RenderDonuteChart;
