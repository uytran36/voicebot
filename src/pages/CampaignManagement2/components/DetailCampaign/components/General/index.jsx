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
const { Panel } = Collapse;

function General({ reportCalling, campaign_id, rangeDate, headers }) {
  const [dataButton, setDataButton] = useState([]);
  const [statistic, setStatistic] = useState([]);
  const [dataChartTotalCall, setDataChartTotalCall] = useState([]);
  const [dataChartTotalCustomer, setDataChartTotalCustomer] = useState([]);
  const [dataChartDurationCall, setDataChartDurationCall] = useState([]);

  useEffect(() => {
    mappingData();

    if (Object.keys(reportCalling).length > 0) {
      setStatistic([
        {
          title: 'Tổng thời gian gọi',
          number: reportCalling?.call_answer?.total_call_duration,
          unit: 'phút',
        },
        {
          title: 'Tổng số cuộc gọi',
          number: reportCalling?.total_call?.total_call,
          unit: 'cuộc',
        },
        {
          title: 'Tổng số khách hàng',
          number: reportCalling?.total_customer?.total_customers,
          unit: 'khách',
        },
        {
          title: 'Thời lượng trung bình',
          number: reportCalling?.average_call_duration,
          unit: 'giây',
        },
      ]);
      setDataChartTotalCall([
        {
          type: 'Thành công',
          value: reportCalling?.total_call?.success,
        },
        {
          type: 'Không thành công',
          value: reportCalling?.total_call?.failure,
        },
      ]);
      setDataChartTotalCustomer([
        {
          type: 'Đã tiếp cận',
          value: reportCalling?.total_customer?.Receive,
        },
        {
          type: 'Chưa tiếp cận',
          value: reportCalling?.total_customer?.not_received_yet,
        },
      ]);
      setDataChartDurationCall([
        {
          type: 'Dưới 5s',
          value: reportCalling?.call_answer?.less_than_5s,
        },
        {
          type: '5s-15s',
          value: reportCalling?.call_answer['5s-15s'],
        },
        {
          type: '15s-30s',
          value: reportCalling?.call_answer['15s-30s'],
        },
        {
          type: 'Trên 30s',
          value: reportCalling?.call_answer?.greater_than_30s,
        },
      ]);
    }
  }, [reportCalling]);

  const mappingData = () => {
    const fakeData = {
      1: {
        total: 2,
        '1-5': {
          total: 1,
          '1-5-3': {
            total: 1,
            '1-5-3-4': {
              total: 1,
            },
          },
        },
        '1-2': {
          total: 1,
          '1-2-8': {
            total: 1,
            '1-2-8-3': {
              total: 1,
              '1-2-8-3-5': {
                total: 1,
                '1-2-8-3-5-4': {
                  total: 1,
                },
              },
            },
          },
        },
      },
    };
    const fakeRate = {
      1: 1.0,
      2: 1.0,
    };

    const tree = Object.keys(fakeData).map((i) => {
      let arr = Object.keys(fakeData[i])
        .filter((v) => v !== 'total')
        .map((o) => {
          let temp = Object.keys(fakeData[i][o])
            .filter((k) => k !== 'total')
            .map((l) => {
              let temp2 = Object.keys(fakeData[i][o][l])
                .filter((m) => m !== 'total')
                .map((n) => {
                  let temp3 = Object.keys(fakeData[i][o][l][n])
                    .filter((p) => p !== 'total')
                    .map((q) => {
                      let temp4 = Object.keys(fakeData[i][o][l][n][q])
                        .filter((a) => a !== 'total')
                        .map((b) => {
                          return {
                            number: parseInt(b.substr(b.length - 1)),
                            amount: fakeData[i][o][l][n][q][b].total,
                            // percent: 0,
                            buttonAfter: [],
                          };
                        });
                      return {
                        number: parseInt(q.substr(q.length - 1)),
                        amount: fakeData[i][o][l][n][q].total,
                        // percent: 0,
                        buttonAfter: temp4,
                      };
                    });
                  return {
                    number: parseInt(n.substr(n.length - 1)),
                    amount: fakeData[i][o][l][n].total,
                    // percent: 0,
                    buttonAfter: temp3,
                  };
                });
              return {
                number: parseInt(l.substr(l.length - 1)),
                amount: fakeData[i][o][l].total,
                // percent: 0,
                buttonAfter: temp2,
              };
            });
          return {
            number: parseInt(o.substr(o.length - 1)),
            amount: fakeData[i][o].total,
            // percent: 0,
            buttonAfter: temp,
          };
        });
      return {
        number: parseInt(i),
        amount: fakeData[i].total,
        percent: fakeRate[i] * 100,
        buttonAfter: arr,
      };
    });
    console.log(tree);
    setDataButton(tree);
  };

  const size = CheckWindowSize();

  const StatisticLayout = ({ title, number, unit }) => {
    return (
      <div
        className={styles.statistic}
        style={size.width >= 1210 ? { width: '23%' } : { width: '24rem' }}
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
                            <div className={styles.colPercent}>
                              {itemChild?.percent ? `${itemChild.percent}%` : ''}
                            </div>
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
                          <div className={styles.colPercent}>
                            {itemChild?.percent ? `${itemChild.percent}%` : ''}
                          </div>
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
                      <div className={styles.colPercent}>{itemChild?.percent}%</div>
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
                      <div className={`${styles.colorTitle} ${styles.colAmount}`}>
                        {item.amount}
                      </div>
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

  return (
    <>
      <div className={styles.statisticWrapper}>
        {statistic.map((x, id) => (
          <StatisticLayout key={id} title={x.title} number={x.number} unit={x.unit} />
        ))}
      </div>
      <div className={styles.container_chart}>
        <div className={styles.doughnut}>
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
            width={550}
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
                customHtml: () => `${reportCalling?.total_call?.total_call}`,
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
            color={['#428DFF', '#FF9B2F']}
            angleField="value"
            colorField="type"
            pieStyle={{ stroke: 'white', lineWidth: 2 }}
            legend={{
              position: 'right',
              marker: {
                symbol: 'square',
              },
              formatter: (value, _, index) => {
                return `${value}: ${dataChartTotalCall[index].value}`;
              },
              offsetX: -30,
            }}
          />
        </div>
        <div className={styles.doughnut}>
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
                  color: '#127ACE',
                  fontWeight: 'bold',
                },
                customHtml: () => `${reportCalling?.call_answer?.total_call_duration}`,
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
            color={['#24DD9A', '#44CEEC', '#408CFF', '#6360FF']}
            angleField="value"
            colorField="type"
            pieStyle={{ stroke: 'white', lineWidth: 2 }}
            legend={{
              position: 'right',
              marker: {
                symbol: 'square',
              },
              formatter: (value, _, index) => {
                return `${value}: ${dataChartDurationCall[index].value}`;
              },
              offsetX: -30,
            }}
          />
        </div>
        <div className={styles.doughnut}>
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
            width={550}
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
                customHtml: () => `${reportCalling?.total_customer?.total_customers}`,
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
            color={['#428DFF', '#BFBFBF']}
            angleField="value"
            colorField="type"
            pieStyle={{ stroke: 'white', lineWidth: 2 }}
            legend={{
              position: 'right',
              marker: {
                symbol: 'square',
              },
              formatter: (value, _, index) => {
                return `${value}: ${dataChartTotalCustomer[index].value}`;
              },
              offsetX: -30,
            }}
          />
        </div>
        <div className={styles.listButton}>
          <ListButton />
        </div>
      </div>
    </>
  );
}

export default General;