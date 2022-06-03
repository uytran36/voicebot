import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Button, Image } from 'antd';
// import Texty from 'rc-texty';
import { history, connect, FormattedMessage } from 'umi';
import style from './style.less';
// import CheckWindowSize from '@/components/CheckWindownSize';
import ActiveLicense from './components/ActiveLicense';
import { requestGetLicense } from '@/services/user';
import { VoiceBot, OmniChatInbound } from '@/utils/permission';
import RenderCardModule from './components/CardModule';
import {
  PhoneHome,
  Inbound,
  OutBound,
  CustomerManagement,
  VoiceBotIcon,
  VoicebotCampaign,
} from '@/components/Icons';
import api from '@/api';

const Mainpage = (props) => {
  // const size = CheckWindowSize();
  const { user, dispatch } = props;
  const { userId, authToken, tokenGateway, currentUser, licenseModule } = user;
  const [isActiveLicense, setActiveLicense] = useState(false);
  const [licenseModules, setLicenseModule] = useState([]);
  const headers = {
    Authorization: tokenGateway,
  };

  useEffect(() => {
    // getLicense();
    // const connection = new WebSocket('ws://172.30.12.163:30122/socket.io/?EIO=3&transport=websocket&sid=oyLrnC7g73rBdHIyAAAC');
    //   // connection.onopen = () => {
    //   //   connection.send(JSON.stringify({ subscribedId }));
    //   // };
    // console.log({connection})
  }, []);

  const getLicense = async () => {
    const res = await requestGetLicense();
    if (res?.status === 400 && res?.details[0] === 'Please add license') {
      setActiveLicense(true);
      return localStorage.removeItem('validate');
    }
    if (res?.status === 'OK' && res?.payload?.data?.data?.licenseModule) {
      setLicenseModule(res.payload.data.data.licenseModule);
    }
    return setActiveLicense(false);
  };

  const checkPermissionComponent = (listPermissionComponent = [], listPermissionUser = []) => {
    const intersection = listPermissionComponent.filter((element) =>
      listPermissionUser.includes(element),
    );
    if (intersection.length > 0) {
      return true; // co quyen
    }
    return false;
  };

  const arrayIntroModule = [
    {
      title: (
        <FormattedMessage
          id="pages.mainpage.call.center.pbx.title"
          defaultMessage="Call Center PBX"
        />
      ),
      intro: (
        <FormattedMessage
          id="pages.mainpage.call.center.pbx.intro"
          defaultMessage="Voicebot Campaign giúp bạn thiết lập đa chiến dịch với hàng nghìn cuộc gọi đi(Outbound Call) tới số lượng lơn khách hàng: Quản lý danh sách khách hàng, chuẩn hoá dữ liệu, quản lý đa chiến dịch, địa phương hoá voicebot, cá nhân hoá dữ liệu, báo cáo/phân tích realtime."
        />
      ),
      listIntroItem: [
        <FormattedMessage key="1" id="pages.mainpage.call.center.pbx.intro.list.item-1" />,
        <FormattedMessage key="2" id="pages.mainpage.call.center.pbx.intro.list.item-2" />,
        <FormattedMessage key="3" id="pages.mainpage.call.center.pbx.intro.list.item-3" />,
        <FormattedMessage key="4" id="pages.mainpage.call.center.pbx.intro.list.item-4" />,
        <FormattedMessage key="5" id="pages.mainpage.call.center.pbx.intro.list.item-5" />,
        <FormattedMessage key="6" id="pages.mainpage.call.center.pbx.intro.list.item-6" />,
        <FormattedMessage key="7" id="pages.mainpage.call.center.pbx.intro.list.item-7" />,
        <FormattedMessage key="8" id="pages.mainpage.call.center.pbx.intro.list.item-8" />,
      ],
      icon: <PhoneHome />,
      // isAuthorized: checkPermissionComponent(Object.values(VoiceBot), currentUser?.permissions),
      // onClick: () =>
      //   checkPermissionComponent(Object.values(VoiceBot), currentUser?.permissions) &&
      //   history.replace('call_center/extensions'),
      isAuthorized: licenseModule.includes('CallCenterManagement'),
      onClick: () =>
        licenseModule.includes('CallCenterManagement') &&
        history.replace('/call_center/extensions'),
    },
    {
      title: (
        <FormattedMessage
          id="pages.mainpage.voicebot.inbound.title"
          defaultMessage="Voicebot Inbound"
        />
      ),
      intro: (
        <FormattedMessage
          id="pages.mainpage.voicebot.inbound.intro"
          defaultMessage="Voicebot Inbound có khả năng phản hồi các cuộc gọi đến từ khách hàng 24/7 thông qua các tính năng: thiết lập kịch bản tư vấn, giải đáp, cung cấp thông tin linh hoạt, phân loại khách hàng, nhận diện từ khoá, Bot điều hướng, dẫn dắt khách hàng và truy cập đến sản phẩm/dịch vụ, và kết nối khách hàng tới phòng ban mong muốn."
        />
      ),
      listIntroItem: [
        <FormattedMessage key="1" id="pages.mainpage.voicebot.inbound.intro.list.item-1" />,
        <FormattedMessage key="2" id="pages.mainpage.voicebot.inbound.intro.list.item-2" />,
        <FormattedMessage key="3" id="pages.mainpage.voicebot.inbound.intro.list.item-3" />,
        <FormattedMessage key="4" id="pages.mainpage.voicebot.inbound.intro.list.item-4" />,
        <FormattedMessage key="5" id="pages.mainpage.voicebot.inbound.intro.list.item-5" />,
        <FormattedMessage key="6" id="pages.mainpage.voicebot.inbound.intro.list.item-6" />,
        <FormattedMessage key="7" id="pages.mainpage.voicebot.inbound.intro.list.item-7" />,
        <FormattedMessage key="8" id="pages.mainpage.voicebot.inbound.intro.list.item-8" />,
        <FormattedMessage key="9" id="pages.mainpage.voicebot.inbound.intro.list.item-9" />,
        <FormattedMessage key="10" id="pages.mainpage.voicebot.inbound.intro.list.item-10" />,
      ],
      icon: <VoiceBotIcon />,
      // isAuthorized: checkPermissionComponent(Object.values(VoiceBot), currentUser?.permissions),
      // onClick: () =>
      //   checkPermissionComponent(Object.values(VoiceBot), currentUser?.permissions) &&
      //   history.replace('/config/campaign-management'),
    },
    {
      title: (
        <FormattedMessage
          id="pages.mainpage.voicebot.campaign.title"
          defaultMessage="Voicebot Campaign"
        />
      ),
      intro: (
        <FormattedMessage
          id="pages.mainpage.voicebot.campaign.intro"
          defaultMessage="Voicebot Campaign giúp bạn thiết lập đa chiến dịch với hàng nghìn cuộc gọi đi(Outbound Call) tới số lượng lơn khách hàng: Quản lý danh sách khách hàng, chuẩn hoá dữ liệu, quản lý đa chiến dịch, địa phương hoá voicebot, cá nhân hoá dữ liệu, báo cáo/phân tích realtime."
        />
      ),
      listIntroItem: [
        <FormattedMessage key="1" id="pages.mainpage.voicebot.campaign.intro.list.item-1" />,
        <FormattedMessage key="2" id="pages.mainpage.voicebot.campaign.intro.list.item-2" />,
        <FormattedMessage key="3" id="pages.mainpage.voicebot.campaign.intro.list.item-3" />,
        <FormattedMessage key="4" id="pages.mainpage.voicebot.campaign.intro.list.item-4" />,
        <FormattedMessage key="5" id="pages.mainpage.voicebot.campaign.intro.list.item-5" />,
        <FormattedMessage key="6" id="pages.mainpage.voicebot.campaign.intro.list.item-6" />,
      ],
      icon: <VoicebotCampaign />,
      // isAuthorized: checkPermissionComponent(Object.values(VoiceBot), currentUser?.permissions),
      // onClick: () =>
      //   checkPermissionComponent(Object.values(VoiceBot), currentUser?.permissions) &&
      //   history.replace('/config/campaign-management'),
      isAuthorized: licenseModule.includes('VoiceBot'),
      onClick: () =>
        licenseModule.includes('VoiceBot') && history.replace('/config/campaign-management-v2'),
    },
    {
      title: (
        <FormattedMessage
          id="pages.mainpage.omni.channel.inbound.title"
          defaultMessage="Omni Channel Inbound"
        />
      ),
      intro: (
        <FormattedMessage
          id="pages.mainpage.omni.channel.inbound.intro"
          defaultMessage="Cung cấp giải pháp hợp nhất đa kênh: Livechat, Facebook Messenger OA, Zalo OA, dữ liệụ cuộc gọi thoại đồng bộ và tập trung tại một nơi duy nhất giúp bạn xử lý tin nhắn tập trung và quản lý một cách tối ưu hiệu suất luồng chat-in."
        />
      ),
      listIntroItem: [
        <FormattedMessage key="1" id="pages.mainpage.omni.channel.outbound.intro.list.item-1" />,
        <FormattedMessage key="2" id="pages.mainpage.omni.channel.outbound.intro.list.item-2" />,
        <FormattedMessage key="3" id="pages.mainpage.omni.channel.outbound.intro.list.item-3" />,
        <FormattedMessage key="4" id="pages.mainpage.omni.channel.outbound.intro.list.item-4" />,
        <FormattedMessage key="5" id="pages.mainpage.omni.channel.outbound.intro.list.item-5" />,
      ],
      icon: <Inbound />,
      // isAuthorized: checkPermissionComponent(
      //   Object.values(OmniChatInbound),
      //   currentUser?.permissions,
      // ),
      // onClick: () =>
      //   checkPermissionComponent(Object.values(OmniChatInbound), currentUser?.permissions) &&
      //   history.replace('chat'),
      isAuthorized: licenseModule.includes('OmniChatInbound'),
      onClick: () =>
        licenseModule.includes('OmniChatInbound') && history.replace('/omni_inbound/chat'),
    },
    {
      title: (
        <FormattedMessage
          id="pages.mainpage.omni.channel.outbound.title"
          defaultMessage="Omni Channel Outbound"
        />
      ),
      intro: (
        <FormattedMessage
          id="pages.mainpage.omni.channel.outbound.intro"
          defaultMessage="Chăm sóc khách hàng chủ động nhờ tích hợp chatbot và thực hiện chiến dịch đa kênh. Quản lý danh sách khách hàng, truyền tải đa phương tiện."
        />
      ),
      listIntroItem: [
        <FormattedMessage key="1" id="pages.mainpage.omni.channel.outbound.intro.list.item-1" />,
        <FormattedMessage key="2" id="pages.mainpage.omni.channel.outbound.intro.list.item-2" />,
        <FormattedMessage key="3" id="pages.mainpage.omni.channel.outbound.intro.list.item-3" />,
        <FormattedMessage key="4" id="pages.mainpage.omni.channel.outbound.intro.list.item-4" />,
        <FormattedMessage key="5" id="pages.mainpage.omni.channel.outbound.intro.list.item-5" />,
      ],
      icon: <OutBound />,
      isAuthorized: false,
      onClick: () => {},
    },
    {
      title: (
        <FormattedMessage
          id="pages.mainpage.customer.management.title"
          defaultMessage="Customer Management"
        />
      ),
      listIntroItem: [
        <FormattedMessage
          key="1"
          id="pages.mainpage.customer.management.gather.intro.list.item-1"
          defaultMessage="Tập hợp hồ sơ lưu trữ và tổng hợp thông tin khách hàng đến từ đa kênh"
        />,
        <FormattedMessage
          key="2"
          id="pages.mainpage.customer.management.gather.intro.list.item-2"
          defaultMessage="Module này gồm các tiện ích để bạn quản lý và phân loại khách hàng mục tiêu nhằm mục đích sử dụng cho các loại chiến dịch truyền thông khác nhau của doanh nghiệp"
        />,
      ],
      icon: <CustomerManagement />,
      isAuthorized: false,
      onClick: () => {},
    },
  ];

  const handleChangeLicense = () => {
    setActiveLicense(true);
  };

  return (
    <>
      {isActiveLicense === null ? (
        ''
      ) : isActiveLicense ? (
        <ActiveLicense headers={headers} dispatch={dispatch} />
      ) : (
        <div className={style.contentWrapper}>
          <div className={style.header}>
            <div>
              <Typography.Title level={3}>
                <FormattedMessage
                  id="pages.mainpage.welcome1"
                  defaultMessage="Chào mừng bạn đến với hệ thống"
                />
              </Typography.Title>
              <Typography.Title level={3}>
                <FormattedMessage
                  id="pages.mainpage.welcome2"
                  defaultMessage="Voicebot Campaign!"
                />
              </Typography.Title>
              <Typography.Paragraph>
                <FormattedMessage
                  id="pages.mainpage.sub-welcome"
                  defaultMessage="Chào mừng bạn đến với hệ thống Voicebot Campaign"
                />
              </Typography.Paragraph>
              {(api.ENV === 'local' || api.ENV === 'dev') && (
                <Button type="primary" onClick={handleChangeLicense}>
                  <FormattedMessage id="pages.mainpage.btn.title" defaultMessage="Button" />
                </Button>
              )}
            </div>
            <div>
              <Image
                preview={false}
                src="/home-image.png"
                width={298}
                height={262}
                alt="Một cô gái đang đeo tai nghe"
              />
            </div>
          </div>
          {(api.ENV === 'local' || api.ENV === 'dev') && (
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Typography.Title style={{ margin: 0 }} level={2}>
                  All modules
                </Typography.Title>
              </Col>
              {arrayIntroModule.map((elm, index) => (
                <Col key={index} xs={24} sm={12} md={12} lg={8}>
                  <RenderCardModule
                    title={elm.title}
                    intro={elm.intro || ''}
                    listIntroItem={elm.listIntroItem}
                    isAuthorized={elm.isAuthorized}
                    onClick={elm.onClick}
                  >
                    {elm.icon}
                  </RenderCardModule>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
    </>
  );
};

export default connect(({ user }) => ({ user }))(Mainpage);
