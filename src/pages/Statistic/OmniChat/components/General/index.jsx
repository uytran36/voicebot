/* eslint-disable camelcase */
import { memo } from 'react';
import styles from './styles.less';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import PT from 'prop-types';

TweenOne.plugins.push(Children);

General.propTypes = {
  dataReport: PT.instanceOf(Object).isRequired,
};

function General({ dataReport }) {
  const {
    avgConservationTime,
    avgResolvedTime,
    avgWaitingTime,
    conservationQuantity,
    interactConservationQuantity,
    processingConservationQuantity,
    transferRate,
    waitingConservationQuantity
  } = dataReport;
  const StatisticLayout = ({ title, number, unit, color }) => {
    return (
      <div className={styles.statistic} style={{ borderLeft: `7px solid ${color}` }}>
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
      </div>
    );
  };

  const statistic = [
    {
      title: 'Số lượng hội thoại',
      number: conservationQuantity,
      unit: 'hội thoại',
      color: '#6376ff',
    },
    {
      title: 'Hội thoại có tương tác',
      number: interactConservationQuantity,
      unit: 'hội thoại',
      color: '#1ee0ac',
    },
    {
      title: 'Hội thoại đang giải quyết',
      number: processingConservationQuantity,
      unit: 'hội thoại',
      color: '#ffa000',
    },
    {
      title: 'Hội thoại đang chờ',
      number: waitingConservationQuantity,
      unit: 'khách hàng',
      color: '#07c2de',
    },
    {
      title: 'Thời gian hội thoại trung bình',
      number: avgConservationTime,
      unit: 'phút',
      color: '#ffa000',
    },
    {
      title: 'Thời gian chờ trung bình',
      number: avgWaitingTime,
      // number: (average_waiting_time / (1000 * 60)).toFixed(1),
      unit: 'phút',
      color: '#07c2de',
    },
    {
      title: 'Thời gian xử lý trung bình',
      number: avgResolvedTime,
      // number: (average_processing_time / (1000 * 60)).toFixed(1),
      unit: 'phút',
      color: '#6376ff',
    },
    {
      title: 'Tỷ lệ chuyển tiếp',
      number: transferRate,
      // number: (number_transfer_rate / (1000 * 60)).toFixed(1),
      unit: '%',
      color: '#1ee0ac',
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
            unit={x.unit}
            color={x.color}
          />
        ))}
      </div>
    </>
  );
}
export default memo(General);
