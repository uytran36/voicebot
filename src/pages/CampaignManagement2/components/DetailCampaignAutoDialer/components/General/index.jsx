import React, { useState, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import { DonutChart } from 'bizcharts';
import { Row, Col, Collapse } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import styles from './styles.less';
import CheckWindowSize from '@/components/CheckWindownSize';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';

TweenOne.plugins.push(Children);

function General(props) {
  const { reportCalling } = props;
  const size = CheckWindowSize();

  const StatisticLayout = ({ title, number, unit }) => {
    return (
      <div
        className={styles.statistic}
        //style={size.width >= 1210 ? { width: '23%' } : { width: '24rem' }}
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
                  floatLength: number % 1 === 0 ? 0 : 1,
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

  const totalTimeCall =
    reportCalling.call5s + reportCalling.call15s + reportCalling.call30s + reportCalling.call31s;
  const totalCustomer = reportCalling.callApproach + reportCalling.callNotApproach;
  const totalCall =
    reportCalling.callSuccess + reportCalling.callInprogress + reportCalling.callFail;
  // const averageTimeCall = totalCall !== 0 ? Number.parseFloat(totalTimeCall/totalCall).toFixed(1) : 0.0;
  const averageTimeCall =
    reportCalling.callDuration !== 0 && reportCalling.callDuration !== undefined
      ? Number.parseFloat(reportCalling.callDuration / reportCalling.total_call).toFixed(1)
      : 0.0;

  const statistic = [
    {
      title: 'Số lượng cuộc gọi',
      // number: Number.isNaN(totalTimeCall) ? 0 : totalTimeCall,
      // number: Number.isNaN(reportCalling.callDuration) ? 0 : reportCalling.callDuration,
      number: 3478,
      unit: 'cuộc',
    },
    {
      title: 'Tổng số khách hàng',
      // number: Number.isNaN(totalCall) ? 0 : totalCall,
      number: 126,
      unit: 'khách hàng',
    },
    {
      title: 'Tổng thời gian gọi',
      // number: Number.isNaN(totalCustomer) ? 0 : totalCustomer,
      number: '12:00:00',
      //unit: 'khách',
    },
    {
      title: 'Thời lượng trung bình',
      // number: Number.isNaN(averageTimeCall) && averageTimeCall.length === 0 ? 0 : +averageTimeCall,
      number: '00:05:00',
      //unit: 'giây',
    },
    {
      title: 'Số cuộc gọi nhỡ',
      // number: Number.isNaN(averageTimeCall) && averageTimeCall.length === 0 ? 0 : +averageTimeCall,
      number: 27,
      unit: 'cuộc',
    },
  ];

  const dataChartTotalCall = [
    {
      type: 'Thành công',
      // value: reportCalling?.callSuccess,
      value: 150,
    },
    {
      type: 'Đang xử lí',
      // value: reportCalling?.callInprogress,
      value: 20,
    },
    {
      type: 'Không thành công',
      // value: reportCalling?.callFail,
      value: 30,
    },
  ];

  const dataChartTotalCustomer = [
    {
      type: 'Đã tiếp cận',
      value: 78,
    },
    {
      type: 'Thất bại',
      value: 48,
    },
    {
      type: 'Chưa gọi',
      value: 48,
    },
  ];

  const dataChartDurationCall = [
    {
      type: 'Nhận cuộc gọi',
      value: 78,
    },
    {
      type: 'Gọi lại',
      value: 48,
    },
    {
      type: 'Bị bỏ qua',
      value: 48,
    },
  ];

  return (
    <>
      <Row className={styles.statisticWrapper}>
        {statistic.map((x, id) => (
          <Col flex={1}>
            <StatisticLayout key={id} title={x.title} number={x.number} unit={x.unit} />
          </Col>
        ))}
      </Row>
      {/* <div className={styles.statisticWrapper}>
        {statistic.map((x, id) => (
          <StatisticLayout key={id} title={x.title} number={x.number} unit={x.unit} />
        ))}
      </div> */}
      <Row>
        <Col span={8}>
          <DonutChart
            data={dataChartTotalCall || []}
            title={{
              visible: true,
              style: {
                fontWeight: 'bolder',
                textAlign: 'center',
              },
            }}
            autoFit
            //width={550}
            height={320}
            radius={0.8}
            innerRadius={0.6}
            label={{
              visible: false,
            }}
            statistic={{
              title: {
                style: {
                  color: '#127ACE',
                  fontWeight: 'bold',
                },
                customHtml: () => `${200}`,
              },
              content: {
                style: {
                  fontSize: '17px',
                  fontWeight: 'light',
                },
                customHtml: () => ` cuộc gọi`,
              },
            }}
            padding="auto"
            color={['#428DFF', '#07C2DE', '#D9D9D9']}
            angleField="value"
            colorField="type"
            pieStyle={{ stroke: 'white', lineWidth: 2 }}
            legend={{
              position: 'bottom',
              marker: {
                symbol: 'square',
              },
              formatter: (value, _, index) => {
                return `${value}: ${dataChartTotalCall[index].value}`;
              },
              offsetX: -30,
            }}
          />
        </Col>
        <Col span={8}>
          <DonutChart
            data={dataChartDurationCall || []}
            title={{
              visible: true,
              style: {
                fontWeight: 'bolder',
                textAlign: 'center',
              },
            }}
            autoFit
            //width={550}
            height={320}
            innerRadius={0.6}
            radius={0.8}
            label={{
              visible: false,
            }}
            statistic={{
              title: {
                style: {
                  color: '#127ACE',
                  fontWeight: 'bold',
                },
                customHtml: () => `${3478}`,
              },
              content: {
                style: {
                  fontSize: '17px',
                  fontWeight: 'light',
                },
                customHtml: () => ` phút`,
              },
            }}
            padding="auto"
            color={['#428DFF', '#FF4D4F', '#D9D9D9']}
            angleField="value"
            colorField="type"
            pieStyle={{ stroke: 'white', lineWidth: 2 }}
            legend={{
              position: 'bottom',
              marker: {
                symbol: 'square',
              },
              formatter: (value, _, index) => {
                return `${value}: ${dataChartDurationCall[index].value}`;
              },
              offsetX: -30,
            }}
          />
        </Col>
        <Col span={8}>
          <DonutChart
            data={dataChartTotalCustomer || []}
            title={{
              visible: true,
              style: {
                fontWeight: 'bolder',
                textAlign: 'center',
              },
            }}
            autoFit
            //width={550}
            height={320}
            radius={0.8}
            innerRadius={0.6}
            label={{
              visible: false,
            }}
            statistic={{
              title: {
                style: {
                  color: '#127ACE',
                  fontWeight: 'bold',
                },
                customHtml: () => `${126}`,
              },
              content: {
                style: {
                  fontSize: '17px',
                  fontWeight: 'light',
                },
                customHtml: () => ` khách hàng`,
              },
            }}
            padding="auto"
            color={['#428DFF', '#07C2DE', '#FF4D4F']}
            angleField="value"
            colorField="type"
            pieStyle={{ stroke: 'white', lineWidth: 2 }}
            legend={{
              position: 'bottom',
              marker: {
                symbol: 'square',
              },
              formatter: (value, _, index) => {
                return `${value}: ${dataChartTotalCustomer[index].value}`;
              },
              offsetX: -30,
            }}
          />
        </Col>
      </Row>
    </>
  );
}

export default General;

const dataButton = [
  { number: 1, amount: 90, percent: 40, buttonAfter: [] },
  {
    number: 2,
    amount: 90,
    percent: 40,
    buttonAfter: [
      {
        number: 1,
        amount: 45,
        percent: 20,
        buttonAfter: [{ number: 3, amount: 45, percent: 20, buttonAfter: [] }],
      },
      {
        number: 2,
        amount: 45,
        percent: 20,
        buttonAfter: [
          { number: 1, amount: 45, percent: 20, buttonAfter: [] },
          {
            number: 5,
            amount: 45,
            percent: 20,
            buttonAfter: [{ number: 3, amount: 45, percent: 20, buttonAfter: [] }],
          },
          { number: 6, amount: 45, percent: 20, buttonAfter: [] },
        ],
      },
      { number: 8, amount: 45, percent: 20, buttonAfter: [] },
    ],
  },
  { number: 4, amount: 0, percent: 0, buttonAfter: [] },
];

const { Panel } = Collapse;

const RenderButtonRecursive = ({ data }) => {
  return (
    <>
      {data.buttonAfter.map((itemChild, idx) => {
        return (
          <>
            {data.buttonAfter.length > 0 ? (
              <Collapse
                bordered={false}
                defaultActiveKey={['0']}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                className={styles.collapseButtonAfter}
              >
                {itemChild?.buttonAfter?.length > 0 ? (
                  <Panel
                    header={
                      <Row style={{ width: '100%' }} justify="space-between">
                        <Col span={12}>Phím {itemChild.number}</Col>
                        <Col style={{ display: 'flex' }}>
                          <div className={styles.colAmount}>{itemChild.amount}</div>
                          <div className={styles.colPercent}>{itemChild.percent}%</div>
                        </Col>
                      </Row>
                    }
                    key={idx}
                    className={styles.collapseButtonAfter}
                  >
                    <RenderButtonRecursive data={itemChild} />
                  </Panel>
                ) : (
                  <div className={styles.collapseButtonAfterChild}>
                    <Row style={{ width: '100%' }} justify="space-between">
                      <Col span={12}>Phím {itemChild.number}</Col>
                      <Col style={{ display: 'flex' }}>
                        <div className={styles.colAmount}>{itemChild.amount}</div>
                        <div className={styles.colPercent}>{itemChild.percent}%</div>
                      </Col>
                    </Row>
                  </div>
                )}
              </Collapse>
            ) : (
              <div className={styles.collapseButtonAfterChild}>
                <Row style={{ width: '100%' }} justify="space-between">
                  <Col span={12}>Phím {itemChild.number}</Col>
                  <Col style={{ display: 'flex' }}>
                    <div className={styles.colAmount}>{itemChild.amount}</div>
                    <div className={styles.colPercent}>{itemChild.percent}%</div>
                  </Col>
                </Row>
              </div>
            )}
          </>
        );
      })}
    </>
  );
};

const ListButton = () => {
  return (
    <>
      <div className={styles.titleWrapper}>
        <Row style={{ marginLeft: 20 }}>
          <Col span={16}>Phím</Col>
          <Col span={6}>Số lượng</Col>
          <Col span={2}>Tỷ lệ</Col>
        </Row>
      </div>
      <Collapse
        bordered={false}
        defaultActiveKey={['0']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        className={styles.collapseButton}
      >
        {dataButton.map((item, index) => {
          if (item.buttonAfter.length > 0) {
            return (
              <Panel
                header={
                  <Row style={{ width: '100%' }} justify="space-between">
                    <Col className={styles.colorTitle} span={12}>
                      Phím {item.number}
                    </Col>
                    <Col style={{ display: 'flex' }}>
                      <div className={`${styles.colorTitle} ${styles.colAmount}`}>
                        {item.amount}
                      </div>
                      <div className={`${styles.colorTitle} ${styles.colPercent}`}>
                        {item.percent}%
                      </div>
                    </Col>
                  </Row>
                }
                key={index}
                className={styles.collapseButtonAfterTitle}
              >
                <RenderButtonRecursive data={item} />
              </Panel>
            );
          } else {
            return (
              <div className={styles.notCollapse}>
                <Row style={{ width: '100%' }} justify="space-between">
                  <Col className={styles.colorTitle} span={12}>
                    Phím {item.number}
                  </Col>
                  <Col style={{ display: 'flex' }}>
                    <div className={`${styles.colorTitle} ${styles.colAmount}`}>{item.amount}</div>
                    <div className={`${styles.colorTitle} ${styles.colPercent}`}>
                      {item.percent}%
                    </div>
                  </Col>
                </Row>
              </div>
            );
          }
        })}
      </Collapse>
    </>
  );
};
