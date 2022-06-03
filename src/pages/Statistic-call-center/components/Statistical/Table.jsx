import React from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { RightOutlined } from '@ant-design/icons';
import { Row, Col, Collapse } from 'antd';
import styles from './styles.less';
import moment from 'moment';

RenderList.propTypes = {
  data: PT.arrayOf(
    PT.shape({
      color: PT.string,
      ...PT.instanceOf(Array),
    }),
  ).isRequired,
  columns: PT.instanceOf(Array).isRequired,
  rowClassName: PT.func,
  expandable: PT.shape({
    rowExpandable: PT.func.isRequired,
    rowExpandRender: PT.func.isRequired,
  }),
};

RenderList.defaultProps = {
  rowClassName: () => {},
  expandable: {
    rowExpandable: () => {},
    rowExpandRender: () => {},
  },
};

export default function RenderList({ data, columns, expandable, rowClassName }) {
  const span = Math.floor(24 / columns.length);
  return (
    <React.Fragment>
      <Row span={24} className={styles.row}>
        {columns?.map((col) => (
          <Col span={span} style={{ textAlign: col.align }} key={col.key}>
            {col.title}
          </Col>
        ))}
      </Row>
      {data?.map((elm, index) => {
        if (expandable && expandable?.rowExpandable(elm, index)) {
          return (
            <Collapse
              bordered={false}
              style={{
                // position: 'relative',
                background: '#fff',
                marginBottom: 8,
                borderRadius: '4px',
              }}
              expandIcon={({ isActive }) => {
                return (
                  <RightOutlined
                    data-rotated={isActive.toString()}
                    className={classNames(styles['collapse-icon'], rowClassName(elm))}
                  />
                );
              }}
            >
              <Collapse.Panel
                style={{ border: 'none' }}
                className={styles['header-collapse-panel']}
                header={
                  <Row style={{ margin: 0 }} className={classNames(styles.row, rowClassName(elm))}>
                    {columns?.map((col) => {
                      return (
                        <Col span={8} style={{ textAlign: col.align }} key={col.key}>
                          {col.render && typeof col.render === 'function'
                            ? col.render(elm[col.key], elm, index)
                            : elm[col.key]}
                        </Col>
                      );
                    })}
                  </Row>
                }
              >
                {elm?.collapse?.map((recordCollapse, i) => (
                  <Row
                    key={i}
                    className={classNames(
                      styles.row,
                      styles['collapse-panel-element'],
                      rowClassName(elm),
                    )}
                  >
                    {columns?.map((col) => {
                      return (
                        <Col style={{ textAlign: col.align }} span={8} key={col.key}>
                          {(expandable &&
                            expandable.rowExpandRender &&
                            expandable.rowExpandRender(col.key, recordCollapse, i)) ||
                            ''}
                        </Col>
                      );
                    })}
                  </Row>
                ))}
              </Collapse.Panel>
            </Collapse>
          );
        }
        return (
          <Row key={index} className={classNames(styles.row, rowClassName(elm))}>
            {columns?.map((col) => (
              <Col span={span} style={{ textAlign: col.align }} key={col.key}>
                {col.render && typeof col.render === 'function'
                  ? col.render(elm[col.key], elm, index)
                  : elm[col.key]}
              </Col>
            ))}
          </Row>
        );
      })}
      <Row span={24} className={styles.row} style={{ background: '#DEEFFC' }}>
        {columns?.map((col, index) => {
          if (index === 0) {
            return (
              <Col key={col.key} span={span}>
                <span>Tổng</span>
              </Col>
            );
          }
          if (col.isSum) {
            const result = data?.reduce((a, b) => {
              const aInt = +a[col.dataIndex];
              const bInt = +b[col.dataIndex];
              return { [col.dataIndex]: aInt + bInt };
            });
            return (
              <Col span={span} style={{ textAlign: col.align }} key={col.key}>
                {col.isTimeMinute && !isNaN(result[col.dataIndex]) ? (
                  moment.utc(result[col.dataIndex] * 1000).format('HH:mm:ss')
                ) : col.isPercent ? (
                  `${result[col.dataIndex].toFixed(2)}%`
                ) : (
                  result[col.dataIndex]
                )}
                {/* {result[col.dataIndex]} */}
              </Col>
            );
          }
          return (
            <Col key={col.key} span={span}>
              -
            </Col>
          );
        })}
      </Row>
    </React.Fragment>
  );
}
