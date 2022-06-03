import React, { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react';
import { DonutChart, ColumnChart, StackedColumnChart, StackedBarChart } from 'bizcharts';

function Chart(props) {
  const { donutData, ratioReport, donutColor, unit, barColor, donutItem, type } = props;


  return (
    <>
      <DonutChart
        data={donutData}
        title={{
          visible: false,
        }}
        width={450}
        height={450}
        autoFit={true}
        innerRadius={0.6}
        radius={0.8}
        label={{
          visible: false,
        }}
        statistic={{
          title: {
            style: {
              height: '30px',
            },
            customHtml: () => unit,
            // offsetX: 31,
            offsetY: 30,
          },
          content: {
            style: {
              color: '#127ace',
            },
            offsetY: -30,
          },
        }}
        padding="auto"
        color={donutColor}
        angleField="value"
        colorField="type"
        pieStyle={{ stroke: 'white', lineWidth: 2 }}
        legend={{
          position: 'bottom',
          visible: true,
          custom: true,
          allowAllCanceled: true,
          items: donutItem.map((item) => ({
            value: item.value,
            name: item.name,
            marker: {
              symbol: 'square',
              style: { fill: item.color, r: 5 },
            },
          })),
        }}
      />
      {type === 'stackedColumn' && (
        <StackedColumnChart
          // width={700}
          height={450}
          autoFit={true}
          data={ratioReport}
          color={barColor}
          xField="day"
          yField="data"
          stackField="type"
          padding="auto"
          // meta={{
          //   day: {
          //     range: [0, 1],
          //   },
          // }}
          xAxis={{
            // visible: true,
            // grid: {
            //   visible: false,
            // },
            // line: {
            //   visible: false,
            // },
            // tickLine: {
            //   visible: false,
            // },
            label: {
              visible: true,
              autoRotate: true,
              autoHide: true,
            },
          }}
          // yAxis={{
          //   visible: true,
          //   grid: {
          //     visible: true,
          //   },
          //   line: {
          //     visible: false,
          //   },
          //   tickLine: {
          //     visible: true,
          //   },
          //   label: {
          //     visible: true,
          //     autoRotate: true,
          //     autoHide: true,
          //   },
          //   title: {
          //     visible: false,
          //     offset: 12,
          //   },
          //   tickCount: 6,
          // }}
          legend={{
            position: 'bottom',
            visible: true,
          }}
        />
      )}
      {type === 'column' && (
        <ColumnChart
          height={450}
          autoFit={true}
          data={ratioReport}
          color={barColor}
          xField="day"
          yField="data"
          padding="auto"
          meta={{
            // day: {
            //   range: [0, 1],
            // },
            data: {
              alias: unit,
            },
          }}
          xAxis={{
            // visible: true,
            // grid: {
            //   visible: true,
            // },
            // line: {
            //   visible: true,
            // },
            // tickLine: {
            //   visible: false,
            // },
            label: {
              visible: true,
              autoRotate: true,
              autoHide: true,
            },
            // title: {
            //   visible: true,
            // },
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
              visible: false,
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
          point={{
            visible: true,
            shape: 'circle',
          }}
          legend={false}
        />
      )}
    </>
  );
}

export default memo(Chart);
