import React from 'react';
import { StackedColumnChart } from 'bizcharts';

function RenderStackedColumnChart({ ...rest }) {
  return (
    <StackedColumnChart
      height={500}
      autoFit={true}
      color={['#6376ff', '#1ee0ac', '#f7bb23']}
      stackField="type"
      padding="auto"
      columnStyle={{r: 10}}
      maxColumnWidth={50}
      xAxis={{
        // visible: true,
        // grid: {
        //   visible: true,
        // },
        // line: {
        //   visible: true,
        // },
        // tickLine: {
        //   visible: true,
        // },
        label: {
          visible: true,
          autoRotate: true,
          autoHide: true,
        },
      }}
      yAxis={{
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
        title: {
          visible: false,
          offset: 12,
        },
        tickCount: 6,
      }}
      {...rest}
    />
  );
}

export default RenderStackedColumnChart;
