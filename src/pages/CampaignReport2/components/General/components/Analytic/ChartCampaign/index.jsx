import React, { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react';
import { Input, Form, Typography, message, Button, Tabs, Steps, DatePicker } from 'antd';
import { DonutChart } from 'bizcharts';
import styles from './styles.less';

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

function ChartCampaign(props) {
  const { donutData, ratioReport, donutColor, title, lineColor, lineTitle, type, barColor } = props;
  console.log("check props", props)

  return (
    <DonutChart
      data={donutData || []}
      title={{
        visible: true,
        style: {
          fontWeight: 'bolder',
          textAlign: 'center',
        },
      }}
      autoFit
      width={550}
      height={320}
      innerRadius={0.6}
      radius={0.8}
      label={{
        visible: false,
      }}
      statistic={{
        title: {
          style: {
            fontSize: '17px',
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
        position: 'right',
        marker: {
          symbol: 'square',
        },
        offsetX: -30,
        formatter: (value, _, index) => {
          return `${value}: ${donutData[index].value}`;
        },
      }}
    />
  );
}

export default memo(ChartCampaign);
