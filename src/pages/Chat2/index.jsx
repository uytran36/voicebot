import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import setupSocket from './websocket/index';
import MainLayout from './layout/mainLayout';
import './assets/css/layoutWeb.css';
import { requestUpdateNotificationReceive } from '@/services/notification';
import { checkPermission, OMNI_CHAT_INBOUND } from '@/utils/permission';
import NoDataPermission from '@/components/NoDataPermission';

const Chat2 = (props) => {
  const { email, userId, authorization, permissions } = props;
  const [chatPermission, setChatPermission] = useState(false);
  useEffect(() => {
    //call api to disable noti
    requestUpdateNotificationReceive(
      {
        authorization,
      },
      {
        inChatModule: true,
      },
    );

    return () => {
      //call api to enable noti
      requestUpdateNotificationReceive(
        {
          authorization,
        },
        {
          inChatModule: false,
        },
      );
    };
  }, []);

  useEffect(() => {
    setChatPermission(
      checkPermission(permissions, OMNI_CHAT_INBOUND.chatChannelZalo) ||
        checkPermission(permissions, OMNI_CHAT_INBOUND.chatChannelFacebook) ||
        checkPermission(permissions, OMNI_CHAT_INBOUND.chatChannelLivechat),
    );
  }, [permissions]);
  return chatPermission ? (
    <div id="chathub-widget-web">
      <MainLayout email={email} userId={userId} authorization={authorization} />
    </div>
  ) : (
    <NoDataPermission />
  );
};

const mapStateToProps = ({ user, websocket }) => {
  return {
    email: user.currentUser.emails[0].address,
    userId: user.userId,
    authorization: user.tokenGateway,
    permissions: user.currentUser.permissions,
  };
};

export default connect(mapStateToProps)(Chat2);
