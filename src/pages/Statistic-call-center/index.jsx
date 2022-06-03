import React from 'react';
import PT from 'prop-types';
import { Tabs } from 'antd';
import ReportOutCalling from './Report-out-calling';
import OverviewReport from './OverviewReport';
import CallInboundReport from './CallInboundReport';
import InternalCallingReport from './Internal-calling-report';
import { connect, FormattedMessage } from 'umi';

StatisticCallCenter.propTypes = {
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    tokenGateway: PT.string,
  }).isRequired,
};

function StatisticCallCenter(props) {
  return (
    <Tabs
      type="card"
      style={{ width: '100%' }}
      tabBarStyle={{ margin: 0 }}
      defaultActiveKey="overview"
    >
      <Tabs.TabPane key="overview" tab="Tổng quan">
        <OverviewReport user={props.user} />
      </Tabs.TabPane>
      <Tabs.TabPane key="inbound" tab="Cuộc gọi vào">
        <CallInboundReport user={props.user} />
      </Tabs.TabPane>
      <Tabs.TabPane key="out-calling" tab="Cuộc gọi ra">
        <ReportOutCalling user={props.user} />
      </Tabs.TabPane>
      <Tabs.TabPane key="internal-calling" tab="Cuộc gọi nội bộ">
        <InternalCallingReport user={props.user} />
      </Tabs.TabPane>
    </Tabs>
  );
}

export default connect(({ user }) => ({ user }))(StatisticCallCenter);
