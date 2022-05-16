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
import { checkPermission, OmniChatInbound } from '@/utils/permission';

OmniChanelInbound.propTypes = {
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
  }).isRequired,
};

const { Title } = Typography;
const { TabPane } = Tabs;

function OmniChanelInbound(props) {
  const [isOpenFB, setIsOpenFB] = useState(false);
  const [isOpenZL, setIsOpenZL] = useState(false);
  const [isOpenLC, setIsOpenLC] = useState(false);
  const [keyTab, setKeyTab] = useState(1);
  const [configChannelChat, setConfigChannelChat] = useState(false);

  const handleClickBack = useCallback(() => {
    setIsOpenLC(false);
    setIsOpenFB(false);
    setIsOpenZL(false);
  }, [isOpenLC, isOpenFB, isOpenZL]);
  const { user } = props;
  const { userId, authToken, tokenGateway, currentUser } = user;
  const headers = {
    // 'X-Auth-Token': authToken,
    // 'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`,
  };

  useEffect(() => {
    setConfigChannelChat(
      checkPermission(currentUser?.permissions, OmniChatInbound.configChannelChat),
    );
  }, []);

  const TabLayout = ({ name, icon }) => (
    <div className={styles.tabTitleWrapper}>
      <span>{name}</span>
      {icon}
    </div>
  );
  return (
    // <Card className={styles.card} bordered={false}>
    //   {!isOpenFB && !isOpenZL && !isOpenLC && (
    //     <div className={styles.bodyWrapper}>
    //       <div className={styles.header}>
    //         <span>Cấu hình Omni-Chat</span>
    //       </div>
    //       <Row className={styles.body}>
    //         <Col className={styles.config} span={3} onClick={() => setIsOpenFB(true)}>
    //           <FacebookOutlined style={{ fontSize: '60px', color: '#1976d2' }} />
    //           <br />
    //           <span>Cấu hình Facebook OA</span>
    //         </Col>
    //         <Col className={styles.config} span={2} offset={3} onClick={() => setIsOpenZL(true)}>
    //           <YoutubeOutlined style={{ fontSize: '60px', color: '#1976d2' }} />
    //           <br />
    //           <span>Cấu hình Zalo OA</span>
    //         </Col>
    //         <Col className={styles.config} span={3} offset={3} onClick={() => setIsOpenLC(true)}>
    //           <WhatsAppOutlined style={{ fontSize: '60px', color: '#1976d2' }} />
    //           <br />
    //           <span>Cấu hình Livechat</span>
    //         </Col>
    //       </Row>
    //     </div>
    //   )}
    //   {isOpenLC && <ConfigLiveChat handleClickBack={handleClickBack} headers={headers} />}
    //   {isOpenFB && <ConfigFacebookOA handleClickBack={handleClickBack} headers={headers} />}
    //   {isOpenZL && <ConfigZaloOA handleClickBack={handleClickBack} headers={headers} />}
    // </Card>
    configChannelChat ? (
      <>
        <Title level={2}>Cấu hình kênh chat</Title>
        <Tabs
          type="card"
          style={{ width: '100%' }}
          onTabClick={(key) => {
            setKeyTab(Number(key));
          }}
        >
          <TabPane
            tab={
              <TabLayout
                name="Cấu hình Messenger"
                icon={
                  <img style={{ width: '100%', marginLeft: 10 }} src="/Messenger.svg" alt="" />
                }
              />
            }
            key="1"
          >
            <div className={styles.bodyWrapper}>
              <ConfigFacebookOA handleClickBack={handleClickBack} headers={headers} />
            </div>
          </TabPane>
          <TabPane
            tab={
              <TabLayout
                name="Cấu hình Zalo"
                icon={
                  <img style={{ width: '100%', marginLeft: 10 }} src="/Zalo.svg" alt="" />
                }
              />
            }
            key="2"
          >
            <div className={styles.bodyWrapper}>
              <ConfigZaloOA handleClickBack={handleClickBack} headers={headers} />
            </div>
          </TabPane>
          <TabPane
            tab={
              <TabLayout
                name="Cấu hình Livechat"
                icon={
                  <img style={{ width: '100%', marginLeft: 10 }} src="/Livechat.svg" alt="" />
                }
              />
            }
            key="3"
          >
            <div className={styles.bodyWrapper}>
              <ConfigLiveChat handleClickBack={handleClickBack} headers={headers} />
            </div>
          </TabPane>
        </Tabs>
      </>
    ) : <NoDataPermission />
  );
}

export default connect(({ user }) => ({ user }))(OmniChanelInbound);
