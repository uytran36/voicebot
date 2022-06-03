import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styles from './styles.less';
import PT from 'prop-types';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
// import CheckWindowSize from '@/components/CheckWindownSize';

TweenOne.plugins.push(Children);

General.propTypes = {
  reportCampaignDaily: PT.instanceOf(Object).isRequired,
  callDurationDataChart: PT.instanceOf(Object).isRequired,
  ratioReport: PT.shape({
    arrCallingRatio: PT.instanceOf(Array),
    arrCampaignRatio: PT.instanceOf(Array),
    arrCharacterBar: PT.instanceOf(Array),
    arrCustomerRatio: PT.instanceOf(Array),
    arrRequestRatio: PT.instanceOf(Array),
    date: PT.instanceOf(Object),
  }).isRequired,
  rangeDateDays: PT.shape({
    fromDate: PT.any,
    toDate: PT.any,
  }).isRequired,
  setRangeDateDays: PT.func.isRequired,
  fetchReportCampaignDays: PT.func.isRequired,
  fetchReportCampaignDaily: PT.func.isRequired,
  token: PT.any.isRequired,
  tabActive: PT.string.isRequired,
  onChangeTab: PT.func.isRequired,
};

// const size = CheckWindowSize();

function General(props) {
  const StatisticLayout = ({ title, number, unit, state }) => {
    return (
      <div
        className={styles.statistic}
        // style={size.width >= 1410 ? { width: '15.5%' } : { width: '20rem' }}
      >
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

            {state ? (
              <span style={{ color: '#1CAF61', marginLeft: 'auto' }}>
                <ArrowUpOutlined style={{ color: '#1CAF61' }} />
                {Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
              </span>
            ) : (
              <span style={{ color: '#FF4D4E', marginLeft: 'auto' }}>
                <ArrowDownOutlined style={{ color: '#FF4D4E' }} />
                {Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const statistic = [
    {
      title: 'Chiến dịch đang tham gia',
      number: 700,
      unit: 'Chiến dịch',
    },
    {
      title: 'Số cuộc gọi tiếp nhận',
      number: 3000,
      unit: 'Cuộc gọi',
    },
    {
      title: 'Số cuộc gọi lại',
      number: 12,
      unit: 'Cuộc gọi',
    },
    {
      title: 'Số cuộc bỏ qua',
      number: 8,
      unit: 'Cuộc gọi',
    },
  ];

  return (
    <div className={styles.statisticWrapper}>
      {statistic.map((x, id) => (
        <StatisticLayout
          key={id}
          title={x.title}
          number={x.number}
          unit={x.unit}
          state={Math.random() < 0.5}
        />
      ))}
    </div>
  );
}

export default React.memo(General);
