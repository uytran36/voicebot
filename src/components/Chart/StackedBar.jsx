import React from 'react';
import { StackedBarChart } from 'bizcharts';

function RenderDonuteChart({ ...rest }) {
  return (
    <StackedBarChart
      height={500}
      autoFit={false}
      xField="data"
      yField="campaign"
      stackField="type"
      padding="auto"
      xAxis={{
        visible: true,
        grid: {
          visible: true,
        },
        line: {
          visible: true,
        },
        tickLine: {
          visible: true,
        },
        label: {
          visible: true,
          autoRotate: true,
          autoHide: true,
        },
      }}
      scrollbar={{
        type: 'vertical',
      }}
      {...rest}
    />
  );
}

export default RenderDonuteChart;
