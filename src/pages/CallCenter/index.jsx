import React, { useState, useMemo } from 'react';
import { Row, Col, Tabs } from 'antd';
import styles from './style.less';
import Extension from './components/Extension';
import Queue from './components/Queue';

const { TabPane } = Tabs;

function ExtQ(props) {
  const [tabKey, setTabKey] = useState('callObserve');

  return (
    <div className={styles.body}>
      <Row align="middle" justify="space-between" style={{ marginBottom: 20 }}>
        <Col span={24}>
          <span
            style={{
              marginRight: '12px',
              color: 'rgba(0, 0, 0, 0.85)',
              fontSize: '24px',
              fontWeight: '500',
            }}
          >
            Giám sát
          </span>
        </Col>
        <Col span={24} style={{ border: '1px solid #f0f0f0', padding: 0 }}>
          <Tabs
            type="card"
            defaultActiveKey="callObserve"
            destroyInactiveTabPane={true}
            style={{ width: '100%' }}
            onTabClick={(key) => {
              setTabKey(key);
            }}
          >
            <TabPane tab="Extension" key="ext">
              <Extension />
            </TabPane>
            <TabPane tab="Queue" key="queue">
              <Queue />
            </TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
}
export default ExtQ;
