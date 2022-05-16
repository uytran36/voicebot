import React from 'react';
import PT from 'prop-types';
import { Card, Typography } from 'antd';
import CheckCircle from '@ant-design/icons/CheckCircleTwoTone';
import styles from './styles.less';

RenderCardModule.propTypes= {
  title: PT.oneOfType([PT.string, PT.instanceOf(Object)]),
  intro: PT.oneOfType([PT.arrayOf(PT.node), PT.node, PT.string]),
  listIntroItem: PT.oneOfType([PT.arrayOf(PT.node), PT.node, PT.arrayOf(PT.string)]),
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]),
  onClick: PT.func,
  isAuthorized: PT.bool,
}

RenderCardModule.defaultProps= {
  title: '',
  intro: '',
  listIntroItem: [],
  children: <div />,
  isAuthorized: false,
  onClick: () => {},
}

function RenderCardModule({ title, intro, children, onClick, isAuthorized, listIntroItem }) {
  return <Card bordered={false} bodyStyle={{ padding: 0 }} className={`${styles['card-hover']} ${isAuthorized && styles['card-border']}`}>
    <div className={`${styles.card}`} onClick={onClick}>
      {isAuthorized && <CheckCircle className={styles['icon-check']} twoToneColor='#3CA8FF' />}
      <div className={styles['card-content']}>
        <Typography.Title className={styles['card-content-title']} level={3}>{title}</Typography.Title>
        <ul data-length={false}>
          {intro  && <li className={styles['card-content-intro']} style={{display: `${listIntroItem?.length > 0 && 'inline'}`}}>
            {intro}
          </li>}
          {listIntroItem.map((itemIntro, index) => (
            <li className={styles['card-content-intro-item']} key={index}>
              {itemIntro}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles['icon-children']}>
        {children}
      </div>
    </div>
  </Card>;
}

export default RenderCardModule;