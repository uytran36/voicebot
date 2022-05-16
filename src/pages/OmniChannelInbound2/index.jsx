import React, { useState, useCallback, useEffect } from 'react';
import { connect, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import PT from 'prop-types';
import { Row, Col, Typography, Card, Tabs, Button } from 'antd';
import { FacebookOutlined, YoutubeOutlined, WhatsAppOutlined } from '@ant-design/icons';
import styles from './styles.less';
import ConfigLiveChat from './components/ConfigLiveChat';
import ConfigFacebookOA from './components/ConfigFacebookOA';
import ConfigZaloOA from './components/ConfigZaloOA';
import NoDataPermission from '@/components/NoDataPermission';
import { checkPermission, OMNI_CHAT_INBOUND } from '@/utils/permission';

OmniChanelInbound2.propTypes = {
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
  }).isRequired,
  dispatch: PT.func.isRequired,
};

const { Title } = Typography;
const { TabPane } = Tabs;

function OmniChanelInbound2(props) {
  const [isOpenFB, setIsOpenFB] = useState(false);
  const [isOpenZL, setIsOpenZL] = useState(false);
  const [isOpenLC, setIsOpenLC] = useState(false);
  const [keyTab, setKeyTab] = useState(1);
  const [configChannelChat, setConfigChannelChat] = useState(false);
  const [configFacebookChat, setConfigFacebookChat] = useState(false);
  const [configLivechatChat, setConfigLivechatChat] = useState(false);
  const [configZaloChat, setConfigZaloChat] = useState(false);
  const handleClickBack = useCallback(() => {
    setIsOpenLC(false);
    setIsOpenFB(false);
    setIsOpenZL(false);
  }, [isOpenLC, isOpenFB, isOpenZL]);
  const { user, dispatch, location } = props;
  const { userId, authToken, tokenGateway, currentUser } = user;
  const headers = {
    Authorization: `${tokenGateway}`,
  };

  useEffect(() => {
    setConfigChannelChat(
      checkPermission(currentUser?.permissions, OMNI_CHAT_INBOUND.configChannelZaloChat) ||
        checkPermission(currentUser?.permissions, OMNI_CHAT_INBOUND.configChannelLivechatChat) ||
        checkPermission(currentUser?.permissions, OMNI_CHAT_INBOUND.configChannelFacebookChat),
    );
    setConfigFacebookChat(
      checkPermission(currentUser?.permissions, OMNI_CHAT_INBOUND.configChannelFacebookChat),
    );
    setConfigLivechatChat(
      checkPermission(currentUser?.permissions, OMNI_CHAT_INBOUND.configChannelLivechatChat),
    );
    setConfigZaloChat(
      checkPermission(currentUser?.permissions, OMNI_CHAT_INBOUND.configChannelZaloChat),
    );
  }, [currentUser?.permissions]);

  const TabLayout = ({ name, icon }) => (
    <div className={styles.tabTitleWrapper}>
      <span>{name}</span>
      {icon}
    </div>
  );
  return configChannelChat ? (
    <>
      <Title level={2}>Cấu hình kênh chat</Title>
      <Tabs
        type="card"
        style={{ width: '100%' }}
        onTabClick={(key) => {
          setKeyTab(Number(key));
        }}
      >
        {configFacebookChat && (
          <TabPane
            tab={
              <TabLayout
                name="Cấu hình Messenger"
                icon={<img style={{ width: '100%', marginLeft: 10 }} src="/Messenger.svg" alt="" />}
              />
            }
            key="1"
          >
            <div className={styles.bodyWrapper}>
              <ConfigFacebookOA
                handleClickBack={handleClickBack}
                headers={headers}
                dispatch={dispatch}
                location={location}
              />
            </div>
          </TabPane>
        )}
        {configZaloChat && (
          <TabPane
            tab={
              <TabLayout
                name="Cấu hình Zalo"
                icon={<img style={{ width: '100%', marginLeft: 10 }} src="/Zalo.svg" alt="" />}
              />
            }
            key="2"
          >
            <div className={styles.bodyWrapper}>
              <ConfigZaloOA handleClickBack={handleClickBack} headers={headers} />
            </div>
          </TabPane>
        )}
        {configLivechatChat && (
          <TabPane
            tab={
              <TabLayout
                name="Cấu hình Livechat"
                icon={<img style={{ width: '100%', marginLeft: 10 }} src="/Livechat.svg" alt="" />}
              />
            }
            key="3"
          >
            <div className={styles.bodyWrapper}>
              <ConfigLiveChat handleClickBack={handleClickBack} headers={headers} />
            </div>
          </TabPane>
        )}
      </Tabs>
    </>
  ) : (
    <NoDataPermission />
  );
}

export default connect(({ user }) => ({ user }))(OmniChanelInbound2);
