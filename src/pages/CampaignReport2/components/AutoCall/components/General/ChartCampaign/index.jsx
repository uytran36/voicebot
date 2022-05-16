import React, { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react';
import { Input, Form, Typography, message, Button, Tabs, Steps, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, PieChartFilled } from '@ant-design/icons';
import { DonutChart, ColumnChart, StackedColumnChart, StackedBarChart } from 'bizcharts';
import { LineChart } from '@/components/Chart';
import styles from './styles.less';

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function ChartCampaign(props) {
  const { donutData, ratioReport, donutColor, title, lineColor, lineTitle, type, barColor } = props;

  return (
    <>
      {donutData && (
        <DonutChart
          data={donutData}
          title={{
            visible: true,
            text: 'Biểu đồ thống kê',
            style: {
              fontWeight: 'bolder',
              textAlign: 'center',
            },
          }}
          width={450}
          height={450}
          autoFit={false}
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
              customHtml: () => title,
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
            marker: {
              symbol: 'square',
            },
          }}
        />
      )}
      {type === 'line' && (
        <LineChart
          data={ratioReport}
          xField="day"
          yField="data"
          color={lineColor}
          /*  options={{
            color: lineColor,
          }} */
          legend={{
            position: 'bottom',
          }}
        />
      )}
      {type === 'column' && (
        <ColumnChart
          height={500}
          autoFit={false}
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
              alias: 'Kí tự',
            },
          }}
          xAxis={{
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
            // title: {
            //   visible: true,
            // },
          }}
          yAxis={{
            xvisible: true,
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
        />
      )}
      {type === 'stackedColumn' && (
        <StackedColumnChart
          height={500}
          autoFit={false}
          data={ratioReport}
          color={barColor}
          xField="day"
          yField="data"
          stackField="type"
          padding="auto"
          legend={{
            custom: true,
            allowAllCanceled: true,
            position: 'bottom',
            items: lineTitle.map((item) => ({
              value: item.value,
              name: item.name,
              marker: {
                symbol: 'square',
                style: { fill: item.color, r: 5 },
              },
            })),
          }}
        />
      )}
      {type === 'stackedBar' && (
        <StackedBarChart
          height={500}
          autoFit={false}
          data={ratioReport}
          color={barColor}
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
          legend={{
            custom: true,
            allowAllCanceled: true,
            position: 'bottom',
            items: lineTitle.map((item) => ({
              value: item.value,
              name: item.name,
              marker: {
                symbol: 'square',
                style: { fill: item.color, r: 5 },
              },
            })),
          }}
          scrollbar={{
            type: 'vertical',
          }}
        />
      )}
    </>
  );
}

export default memo(ChartCampaign);
