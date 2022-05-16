import React from 'react';
import { Tabs, Card } from 'antd';
import AgentReport from './agent-report';
import CustomerReport from './customer-report';
import Chat from './chat-report/index';

function OmnichatReport() {
  return (
    <Tabs type="card" style={{ width: '100%' }} tabBarStyle={{ margin: 0 }}>
      <Tabs.TabPane key="agent-chat" tab="Báo cáo chat">
        <Card bodyStyle={{ padding: '0px 16px' }}>
          <Chat />
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane key="agent-report" tab="Báo cáo agent">
        <Card bodyStyle={{ padding: '0px 16px' }}>
          <AgentReport />
        </Card>
      </Tabs.TabPane>
      <Tabs.TabPane key="customer-report" tab="Khách hàng">
        <Card bodyStyle={{ padding: '0px 16px' }}>
          <CustomerReport />
        </Card>
      </Tabs.TabPane>
    </Tabs>
  );
}

export default OmnichatReport;
