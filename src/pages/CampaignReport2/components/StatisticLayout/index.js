import styles from './styles.js'
import React, { useState, useCallback, useEffect, useRef, memo, useMemo } from 'react';
import { PlusOutlined, SearchOutlined, PieChartFilled, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import styles from './styles.less';
import TweenOne from 'rc-tween-one';

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
                    <span style={{ marginLeft: 3, marginRight: 3 }}>{unit}</span>
                    {state ? <span style={{ color: "#1CAF61", marginLeft: "auto" }}>
                        <ArrowUpOutlined style={{ color: "#1CAF61" }} />
                        {Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
                    </span> : <span style={{ color: "#FF4D4E", marginLeft: "auto" }}>
                        <ArrowDownOutlined style={{ color: "#FF4D4E" }} />
                        {Math.floor(Math.random() * (1000 - 1 + 1) + 1)}
                    </span>}

                </div>
            </div>
        </div>
    );
};

export default StatisticLayout