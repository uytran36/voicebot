import React, { useState, useCallback, useEffect, useRef } from 'react';
import PT from 'prop-types';

import {
  Typography,
  Popconfirm,
  Space,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Image,
  Tabs,
} from 'antd';
import { connect, FormattedMessage } from 'umi';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import exportIcon from '@/assets/Union.svg';
import { PlayPause } from '@/components/Icons';
import {
  requestCallDemo,
  requestReportCampaignSumary,
  requestGetCampaigns,
  requestChangeStatus,
  requestCreateCampaigns,
  requestCreateCampaign,
  requestDeleteCampaign,
  requestUpdateCampaignConfig,
  new_campaign_script,
  update_campaign_script,
  requestDuplicateCampaign,
} from '@/services/campaign-management';
import {
  requestHistoryCallCampaign,
  requestExportHistoryCallCampaign,
} from '@/services/call-center';
import styles from './styles.less';
import api from '@/api';
import { requestGetSipProfile } from '@/services/campaign-management';
import { openModal, closeModal, changeContentModal } from '@/components/ConfirmModal/openModal';
import ConfirmModal from '@/components/ConfirmModal';
import NoDataPermission from '@/components/NoDataPermission';
import { CAMPAIGN_MANAGEMENT, checkPermission, VoiceBot } from '@/utils/permission';
import CampaignInfo from './components/CampaignInfo';
import styled from 'styled-components';
import ListHistoryCall from './components/ListHistoryCall/index';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const StyleTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin: 0px;
  }
  .ant-tabs-content-holder {
    background: #ffffff;
  }
`;

function DetailCampaign({ detailCampaign }) {
  return (
    <>
      <div className={styles.titleWrapper}>
        <Title level={2}>{detailCampaign?.name || 'Chiến dịch 1'}</Title>
      </div>
      <StyleTabs type="card">
        <TabPane tab="Quản lý cuộc gọi" key="1">
          <CampaignInfo />
        </TabPane>
        <TabPane tab="Lịch sử cuộc gọi" key="2">
          <ListHistoryCall />
        </TabPane>
      </StyleTabs>
      {true ? <div></div> : <NoDataPermission />}
    </>
  );
}

export default connect(({ user }) => ({ user }))(DetailCampaign);
