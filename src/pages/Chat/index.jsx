import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import api from '@/api';
import { checkPermission, OmniChatInbound } from '@/utils/permission';

const Chat = ({ user }) => {
  const [reLoad, setReload] = useState(false);
  useEffect(() => {
    if (checkPermission(user?.currentUser?.permissions, OmniChatInbound.viewDashboardOmniInbound)) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      const code = `
     (function(w, d, s, o, f, js, fjs) {
            var elemDiv = document.createElement('div');
            elemDiv.setAttribute("id", "chathub-widget-web");
            d.body.appendChild(elemDiv);
            w['Widget-Collaboration-Hub-SCC-FPT'] = o;
            w[o] = w[o] || function() {
                (w[o].q = w[o].q || []).push(arguments)
            };
            js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
            js.id = o;
            js.src = f;
            js.async = 1;
            fjs.parentNode.insertBefore(js, fjs);
        }(window, document, 'script', 'WidgetHubSCC', '${api.WIDGET_LIVECHAT}?_v=' + Math.random()));
        WidgetHubSCC('initweb', {
          targetElementId: 'chathub-widget-web',
          token: '${user.authToken}',
          authorization: 'Bearer ${user.tokenGateway}',
          email: '${user.currentUser.email}',
        });`;
      try {
        script.appendChild(document.createTextNode(code));
        script.async = true;
        document.getElementById('chathub-widget-web').appendChild(script);
      } catch (e) {
        script.text = code;

        document.getElementById('chathub-widget-web').appendChild(script);
      }
      if (reLoad) {
        console.log('reLoad', reLoad);
        document.addEventListener('load', WidgetHubSCC('reload', { token: `${user.authToken}` }));
      }
      return () => {
        const element = document.getElementById('chathub-widget-web');
        element.remove();
        document.addEventListener('load', WidgetHubSCC('disconnectws'));
        setReload(true);
      };
    }
  });
  return <div div id="chathub-widget-web"></div>;
};
export default connect(({ user }) => ({ user }))(Chat);
