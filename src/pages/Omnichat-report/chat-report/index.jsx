import React, { useState, lazy, Suspense } from 'react';
import { Row, Col, Button, Space } from 'antd';

const LazyNumberOfChat = lazy(() => import('./number-of-chat'));
const LazyDurationAndRateChat = lazy(() => import('./duration-rate-chat'));
const LazyDetailChat = lazy(() => import('./detail-chat'));

const styleButtonActive = {
  backgroundColor: '#399DEE',
  color: '#FFFFFF',
  borderRadius: '2px',
};

export default function ChatReport() {
  const [tab, setTab] = useState(1);

  return (
    <Row>
      <Col span={24} style={{ margin: '24px 0' }}>
        <Row style={{ display: 'flex', justifyContent: 'center' }}>
          <Col span={24} flex='inherit'>
            <Space>
              <Button style={tab === 1 ? styleButtonActive : {}} onClick={() => setTab(1)}>
                Số lượng chat
              </Button>
              <Button style={tab === 2 ? styleButtonActive : {}} onClick={() => setTab(2)}>
                Thời lượng và tỷ lệ giải quyết
              </Button>
              <Button style={tab === 3 ? styleButtonActive : {}} onClick={() => setTab(3)}>
                Chi tiết chat
              </Button>
            </Space>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        {tab === 1 && (
          <Suspense fallback={'Vui lòng đợi...'}>
            <LazyNumberOfChat />
          </Suspense>
        )}
        {tab === 2 && (
          <Suspense fallback={'Vui lòng đợi...'}>
            <LazyDurationAndRateChat />
          </Suspense>
        )}
        {tab === 3 && (
          <Suspense fallback={'Vui lòng đợi...'}>
            <LazyDetailChat />
          </Suspense>
        )}
      </Col>
    </Row>
  );
}
