import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Typography, Popover, Row, Col, Tooltip, Button } from 'antd';
import { InfoCircleFilled, PhoneFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import TweenOne from 'rc-tween-one';
import Children from 'rc-tween-one/lib/plugin/ChildrenPlugin';
import { DonutChart } from 'bizcharts';
import styles from './styles.less';
import DeclineButton from './DeclineButton';
import ProCard from '@ant-design/pro-card';
import CheckWindowSize from '@/components/CheckWindownSize';
import avatarCall from '@/assets/avatar_incoming_call.png';

TweenOne.plugins.push(Children);

function CampaignInfo(props) {
  const size = CheckWindowSize();

  const CardLayout = ({ title, icon, suffix, children, type }) => {
    return (
      <ProCard className={styles.procard}>
        <div className={styles.header}>
          <div className={styles.prefix}>
            <div className={type !== 'error' ? styles.icon : styles.iconError}>{icon}</div>
            <div className={type !== 'error' ? styles.title : styles.titleError}>
              <span>{title}</span>
            </div>
          </div>
          <div className={styles.suffix}>{suffix}</div>
        </div>
        <div className={styles.body}>{children}</div>
      </ProCard>
    );
  };

  const dataChartTotalCall = [
    {
      type: 'Thành công',
      // value: reportCalling?.callSuccess,
      value: 843,
    },
    {
      type: 'Chưa tiếp cận',
      // value: reportCalling?.callFail,
      value: 114,
    },
    {
      type: 'Thất bại',
      // value: reportCalling?.callInprogress,
      value: 170,
    },
  ];
  const dataChartDurationCall = [
    {
      type: 'Nhận cuộc gọi',
      // value: reportCalling?.call5s,
      value: 843,
    },
    {
      type: 'Gọi lại',
      // value: reportCalling?.call15s,
      value: 114,
    },
    {
      type: 'Bỏ qua',
      // value: reportCalling?.call30s,
      value: 170,
    },
  ];
  const content = (
    <div className={styles['info-wrapper']}>
      <div className={styles['info-wrapper-time']}>00:01:30</div>&gt;
      <div className={styles['info-wrapper-detail']}>Thời gian nghe máy TB</div>&gt;
      <div className={styles['info-wrapper-time']}>00:02:30</div>
    </div>
  );

  return (
    <>
      <CardLayout
        title="Thông tin chiến dịch"
        icon={<InfoCircleFilled style={{ color: '#526eff' }} />}
      >
        <div className={styles['info-campaign-wrapper']}>
          <div
            className={styles['info-campaign-time']}
            style={size.width >= 1210 ? { width: '23%' } : { width: '24rem' }}
          >
            <Typography.Title level={3}>Thời gian của chiến dịch</Typography.Title>
            <Row>
              <Col span={12}>
                <Typography.Text level={4}>Bắt đầu</Typography.Text>
                <Typography.Text level={4}>20/08/2021</Typography.Text>
              </Col>
              <Col span={12}>
                <Typography.Text level={4}>Kết thúc</Typography.Text>
                <Typography.Text level={4}>20/09/2021</Typography.Text>
              </Col>
            </Row>
          </div>
          <div
            className={styles['info-campaign-timeleft']}
            style={size.width >= 1210 ? { width: '23%' } : { width: '24rem' }}
          >
            <Typography.Title level={3}>Thời gian còn lại</Typography.Title>
            <div>07:01:12</div>
          </div>
          <div
            className={styles['info-campaign-summary']}
            style={size.width >= 1210 ? { width: '23%' } : { width: '24rem' }}
          >
            <Typography.Title level={3}>Tổng thời gian gọi</Typography.Title>
            <div>07:01:12</div>
          </div>
          <div
            className={styles['info-campaign-time-average']}
            style={size.width >= 1210 ? { width: '23%' } : { width: '24rem' }}
          >
            <Typography.Title level={3}>Thời gian nghe máy TB</Typography.Title>
            <div style={{ display: 'flex' }}>
              <div>00:02:48</div>
              <Popover content={content}>
                <ExclamationCircleOutlined style={{ fontSize: '21px', margin: 'auto 0' }} />
              </Popover>
            </div>
          </div>
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
                  customHtml: () => `${1125}`,
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
              color={['#428DFF', '#FF9B2F', '#EE414A']}
              angleField="value"
              colorField="type"
              pieStyle={{ stroke: 'white', lineWidth: 2 }}
              legend={{
                position: 'right',
                marker: {
                  symbol: 'square',
                },
                formatter: (value, _, index) => {
                  return `${value}: ${dataChartTotalCall[index].value} (${
                    Math.round(((dataChartTotalCall[index].value * 100) / 1127) * 10) / 10
                  }%)`;
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
                  customHtml: () => `${1125}`,
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
              color={['#428DFF', '#07C2DE', '#EE414A']}
              angleField="value"
              colorField="type"
              pieStyle={{ stroke: 'white', lineWidth: 2 }}
              legend={{
                position: 'right',
                marker: {
                  symbol: 'square',
                },
                formatter: (value, _, index) => {
                  return `${value}: ${dataChartDurationCall[index].value} (${
                    Math.round(((dataChartDurationCall[index].value * 100) / 1127) * 10) / 10
                  }%)`;
                },
                offsetX: -30,
              }}
            />
          </div>
        </div>
      </CardLayout>
      <CardLayout title="Tương tác cuộc gọi" icon={<PhoneFilled style={{ color: '#526eff' }} />}>
        <div className={styles['interaction-card-call']}>
          <div className={styles['interaction-card-call-info']}>
            <div className={styles['circle-avatar']}>
              <img src={avatarCall} alt="" />
            </div>
            <div>
              <div>Nguyễn Thu Hương</div>
              <div>0372571256</div>
            </div>
          </div>
          <div className={styles['interaction-card-call-action']}>
            <Tooltip title="Answer">
              <Button
                size="large"
                type="circle"
                className={`${styles.callFeature} ${styles.phone}`}
                // onClick={answer}
                icon={<PhoneFilled className={styles.bell} />}
              />
            </Tooltip>
            <DeclineButton size="large" title="Decline" />
          </div>
        </div>
        <div className={styles['interaction-card-info']}>
          <div className={styles['interaction-card-info-queue']}>
            <div>Tổng cuộc gọi hàng chờ:</div>
            <div>
              <div>8</div>
              <div>cuộc</div>
            </div>
          </div>
          <div className={styles['interaction-card-info-missed']}>
            <div>Số cuộc gọi nhỡ:</div>
            <div>
              <div>4</div>
              <div>cuộc</div>
            </div>
          </div>
          <div className={styles['interaction-card-info-agent']}>
            <div>Tổng số agent tham gia:</div>
            <div>
              <div>10</div>
              <div>agent</div>
            </div>
          </div>
          <div className={styles['interaction-card-info-incall']}>
            <div>Đang trong cuộc gọi:</div>
            <div>
              <div>10</div>
              <div>agent</div>
            </div>
          </div>
        </div>
      </CardLayout>
    </>
  );
}

export default connect(({ user }) => ({ user }))(CampaignInfo);
