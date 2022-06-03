import React, { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react';
import { Progress, Form, Typography, message, Button, Tabs, Steps, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, PieChartFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import styles from './styles.less';

import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import { ProgressChart } from 'bizcharts';

const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
TweenOne.plugins.push(Children);

function General(props) {
  const { data, threshold } = props;
  const StatisticLayout = ({ title, number, unit, percent, color }) => {
    return (
      <div className={styles.statistic}>
        <div className={styles.statisticInfo}>
          <div className={styles.title}>
            <span>{title}</span>
          </div>
          <div className={styles.data}>
            <TweenOne
              className={styles.count}
              animation={{
                Children: {
                  value: typeof number === 'number' ? number : 0,
                  floatLength: 0,
                  formatMoney: true,
                },
                duration: 1000,
              }}
            >
              0
            </TweenOne>
            <span>{unit}</span>
          </div>
        </div>
        <Progress
          showInfo={false}
          strokeLinecap="square"
          strokeColor={color}
          percent={percent * 100}
        />
      </div>
    );
  };

  const statistic = [
    {
      title: 'Số lượng cuộc gọi',
      number: data.totalCalled,
      percent: data.totalCalled / threshold.CALL,
      unit: 'cuộc',
      color: '#6376FF',
    },
    {
      title: 'Cuộc gọi đã kết nối',
      number: data.totalCallConnected,
      percent: data.totalCallConnected / threshold.CALL,
      unit: 'cuộc',
      color: '#1EE0AC',
    },
    {
      title: 'Tổng thời gian thoại',
      number: data.totalTimeCalled,
      percent: data.totalTimeCalled / threshold.CALL_TIME,
      unit: 'giây',
      color: '#247BFF',
    },
    {
      title: 'API đã yêu cầu',
      number: data.totalRequestT2S,
      percent: data.totalRequestT2S / threshold.REQUEST_T2S,
      unit: 'API',
      color: '#07C2DE',
    },
    {
      title: 'Số ký tự T2S',
      number: data.totalCharactersT2S,
      percent: data.totalCharactersT2S / threshold.CHARACTER_T2S,
      unit: 'ký tự',
      color: '#FFA000',
    },
  ];

  return (
    <>
      <div className={styles.statisticWrapper}>
        {statistic.map((x, id) => (
          <StatisticLayout
            key={id}
            title={x.title}
            number={x.number}
            color={x.color}
            unit={x.unit}
            percent={x.percent}
          />
        ))}
      </div>
    </>
  );
}

export default React.memo(General);
