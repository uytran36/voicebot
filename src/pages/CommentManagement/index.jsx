import React from 'react';
import { Tabs } from 'antd';
import WebsiteTab from './components/WebsiteTab/index';
import PT from 'prop-types';

StatisticCallCenter.propTypes = {
  history: PT.shape({
    push: PT.func,
  }).isRequired,
};

function StatisticCallCenter(props) {
  const {history} = props;
  return (
    <Tabs
      type="card"
      style={{ width: '100%' }}
      tabBarStyle={{ margin: 0 }}
      defaultActiveKey="overview"
    >
      <Tabs.TabPane key="website" tab="Website">
        <WebsiteTab history={history} />
      </Tabs.TabPane>
      <Tabs.TabPane key="facebook" tab="Facebook"></Tabs.TabPane>
    </Tabs>
  );
}

export default StatisticCallCenter;
