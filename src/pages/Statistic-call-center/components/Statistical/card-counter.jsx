import React from 'react';
import PT from 'prop-types';
import { Typography } from 'antd';
import styles from './styles.less'

RenderCardCounter.propTypes = {
  title: PT.string,
  time: PT.string,
}

RenderCardCounter.defaultProps = {
  title: '',
  time: '',
}

export default function RenderCardCounter({ title, time }) {
  return (
    <div className={styles['card-counter']}>
      <Typography.Title level={4}>{title}</Typography.Title>
      <div>{time}</div>
    </div>
  )
}


