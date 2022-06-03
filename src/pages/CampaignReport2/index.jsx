import React, { useState, useCallback, useEffect, Suspense } from 'react';
import {
  Input,
  Space,
  Typography,
  message,
  Button,
  Tabs,
  Steps,
  DatePicker,
  notification,
  Tag,
  Card,
} from 'antd';
import { connect } from 'umi';
import PT from 'prop-types';
import General from './components/General';
import AutoCall from './components/AutoCall';
import AutoDialer from './components/AutoDialer';
import { REPORT_MANAGEMENT, checkPermission, VoiceBot } from '@/utils/permission';
import NoDataPermission from '@/components/NoDataPermission';
import styles from './styles.less';
const { Title } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

CampaignReport2.propTypes = {
  user: PT.shape({
    tokenHub: PT.string,
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
    currentUser: PT.instanceOf(Object),
  }).isRequired,
};

function CampaignReport2(props) {
  const {
    user: { userId, authToken, tokenGateway, tokenHub, currentUser },
  } = props;
  const [viewReportCampaign, setViewReportCampaign] = useState(false);

  useEffect(() => {

  }, []);

  const isviewReportCampaignOverview = React.useMemo(
    () => {
      return checkPermission(currentUser?.permissions, REPORT_MANAGEMENT.accessOverviewReport)
    },
    [currentUser?.permissions],
  );

  const isviewReportCampaignAutoCall = React.useMemo(
    () => {
      return checkPermission(currentUser?.permissions, REPORT_MANAGEMENT.accessAutoCallReport)
    },
    [currentUser?.permissions],
  );
  const isviewReportCampaignAutoDialer = React.useMemo(
    () => {
      return checkPermission(currentUser?.permissions, REPORT_MANAGEMENT.accessAutoDialerReport)
    },
    [currentUser?.permissions],
  );
  return (
    <React.Fragment>
      {
        isviewReportCampaignOverview || isviewReportCampaignAutoCall || isviewReportCampaignAutoDialer ? (
          <Suspense fallback={<div>loading..</div>}>
            <Title level={3}>Báo cáo chiến dịch</Title>
            <div className="card-container">
              <Tabs type="card" className={styles} defaultActiveKey="1">
                {isviewReportCampaignOverview ? (
                  <TabPane tab="Tổng quan" key="1">
                    <Card bordered={false}>
                      <General />
                    </Card>
                  </TabPane>) : (<></>)}
                {isviewReportCampaignAutoCall ? (
                  <TabPane tab="Auto call" key="2">
                    <Card bordered={false}>
                      <AutoCall />
                    </Card>
                  </TabPane>) : (<></>)}
                {isviewReportCampaignAutoDialer ? (
                  <TabPane tab="Auto Dialer" key="3">
                    <Card bordered={false}>
                      <AutoDialer />
                    </Card>
                  </TabPane>) : (<></>)}

              </Tabs>
            </div>
          </Suspense>
        ) : (
          <NoDataPermission />
        )
      }
    </React.Fragment>
  );
}

export default connect(({ user }) => ({ user }))(CampaignReport2);
