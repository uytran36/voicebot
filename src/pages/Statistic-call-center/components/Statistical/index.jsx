import React, { memo } from 'react';
import PT from 'prop-types';
import { Typography, Row, Col } from 'antd';
import { DonuteChart } from '@/components/Chart';
import CardCounter from './card-counter';
import styles from './styles.less';
import Table from './Table';

Statistical.propTypes = {
  overview: PT.instanceOf(Array),
  table: PT.shape({
    data: PT.array,
    columns: PT.array,
  }).isRequired,
  chart: PT.shape({
    data: [],
  }).isRequired,
};

Statistical.defaultProps = {
  overview: [],
  chart: {
    data: [],
    columns: [],
  },
};

// color={['#EE414A', '#07C2DE']}
function Statistical({ overview, table, chart }) {
  const { data, ...propsChart } = chart;
  return (
    <Row className={styles.statistical} justify="space-between">
      {data && data.length > 0 && (
        <Col span={6} className={styles.chart}>
          <DonuteChart padding="auto" {...propsChart} data={data || []} />
        </Col>
      )}
      {overview.length > 0 && (
        <Col span={5} className={styles.overview}>
          {overview.map((elm, index) => (
            <CardCounter key={index} title={elm.title} time={elm.time} />
          ))}
        </Col>
      )}
      {table?.columns && (
        <Col span={12} className={styles.table}>
          <Table {...table} />
        </Col>
      )}
    </Row>
  );
}

export default memo(Statistical);

CustomStatistical.propTypes = {
  overview: PT.instanceOf(Array),
  table: PT.shape({
    data: PT.array,
    columns: PT.array,
  }).isRequired,
  chart: PT.shape({
    data: [],
  }).isRequired,
  transferCall: PT.instanceOf(Object).isRequired,
};

export function CustomStatistical({ overview, table, chart, transferCall }) {
  const { data, ...propsChart } = chart;
  return (
    <Row className={styles.statistical} justify="space-between">
      {data && data.length > 0 && (
        <Col span={6} className={styles.chart}>
          <DonuteChart color={['#EE414A', '#07C2DE']} {...propsChart} data={data || []} />
        </Col>
      )}
      <Col span={5} className={styles.overview}>
        {overview?.length > 0 &&
          overview?.map((elm, index) => (
            <CardCounter key={index} title={elm.title} time={elm.time} />
          ))}
        <div className={styles['transfer-call']}>
          <Typography.Title level={4}>Thời gian đàm thoại</Typography.Title>
          <Row>
            <Col span={12}>
              <Typography.Text level={4}>Tổng</Typography.Text>
              <Typography.Text level={4}>{transferCall?.total}</Typography.Text>
            </Col>
            <Col span={12}>
              <Typography.Text level={4}>TB</Typography.Text>
              <Typography.Text level={4}>{transferCall?.avg}</Typography.Text>
            </Col>
          </Row>
        </div>
      </Col>
      {table?.columns && (
        <Col span={12} className={styles.table}>
          <Table {...table} />
        </Col>
      )}
    </Row>
  );
}
