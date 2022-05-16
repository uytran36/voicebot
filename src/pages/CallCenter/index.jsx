import React, { useState, useEffect } from 'react';
import urlIframe from '@/api/iframeCallCenter';
import PT from 'prop-types';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import DialPlan from './DialPlan';
import { checkPermission, CALL_CENTER_MANAGEMENT } from '@/utils/permission';
import NoDataPermission from '@/components/NoDataPermission';

CallCenter.propTypes = {
  location: PT.instanceOf(Object).isRequired,
  user: PT.instanceOf(Object).isRequired,
};

function CallCenter(props) {
  const { location, user } = props;
  const pathList = location.pathname.split('/');
  const path = pathList[pathList.length - 1];

  const [configCallCenter, setConfigCallCenter] = useState(false);
  useEffect(() => {
    setConfigCallCenter(
      checkPermission(user?.currentUser?.permissions, CALL_CENTER_MANAGEMENT.configCallCenter),
    );
  }, []);

  const iframe = {
    extensions: urlIframe.CALL_CENTER_EXTENSIONS,
    gateways: urlIframe.CALL_CENTER_GATEWAYS,
    outbound_routes: urlIframe.CALL_CENTER_OUTBOUND_ROUTES,
    destination: urlIframe.CALL_CENTER_DESTINATION,
    agents: urlIframe.CALL_CENTER_AGENTS,
    queues: urlIframe.CALL_CENTER_QUEUES,
    history_call: urlIframe.CALL_CENTER_HISTORY_CALL,
    call_recordings: urlIframe.CALL_CENTER_CALL_RECORDINGS,
    ivr: urlIframe.CALL_CENTER_IVR,
    time_conditions: urlIframe.CALL_CENTER_TIME_CONDITIONS,
    recordings: urlIframe.CALL_CENTER_RECORDINGS,
    call_block: urlIframe.CALL_CENTER_CALL_BLOCK,
    forward: urlIframe.CALL_CENTER_FORWARD_CALL,
    voice_mail: urlIframe.CALL_CENTER_VOICE_MAIL,
    inbound_routes: urlIframe.CALL_CENTER_INBOUND_ROUTES,
    dialplan_manager: urlIframe.CALL_CENTER_DIALPLAN_MANAGER,
    operator_panel: urlIframe.CALL_CENTER_OPERATOR_PANEL,
    ring_groups: urlIframe.CALL_CENTER_RING_GROUPS,
    active_call_center: urlIframe.CALL_CENTER_ACTIVE_CALL_CENTER,
    active_call: urlIframe.CALL_CENTER_ACTIVE_CALL,
    agent_status: urlIframe.CALL_CENTER_AGENT_STATUS,
    registrations: urlIframe.CALL_CENTER_REGISTRATIONS,
    sip_status: urlIframe.CALL_CENTER_SIP_STATUS,
    access_controls: urlIframe.CALL_CENTER_ACCESS_CONTROLS,
    default_settings: urlIframe.CALL_CENTER_DEFAULT_SETTINGS,
    extension_summary: urlIframe.CALL_CENTER_EXTENSION_SUMMARY,
  };

  const renderTabPage = (pathName) => {
    let content = [];
    if (pathName === 'dialplan') {
      content = [
        {
          name: 'Destination',
          content: iframe.destination,
        },
        {
          name: 'Outbound Routes',
          content: iframe.outbound_routes,
        },
        {
          name: 'Inbound Routes',
          content: iframe.inbound_routes,
        },
        {
          name: 'Dialplan Manager',
          content: iframe.dialplan_manager,
        },
      ];
    }
    if (pathName === 'status') {
      content = [
        {
          name: 'Active Call Center',
          content: iframe.active_call_center,
        },
        {
          name: 'Active Call',
          content: iframe.active_call,
        },
        {
          name: 'Agent Status',
          content: iframe.agent_status,
        },
        {
          name: 'Registrations',
          content: iframe.registrations,
        },
        {
          name: 'Sip Status',
          content: iframe.sip_status,
        },
        {
          name: 'Extension Summary',
          content: iframe.extension_summary,
        },
      ];
    }
    if (pathName === 'applications') {
      content = [
        {
          name: 'Call Block',
          content: iframe.call_block,
        },
        {
          name: 'Queue',
          content: iframe.queues,
        },
        {
          name: 'Call Recordings',
          content: iframe.call_recordings,
        },
        {
          name: 'History Call',
          content: iframe.history_call,
        },
        {
          name: 'Forward',
          content: iframe.forward,
        },
        {
          name: 'IVR',
          content: iframe.ivr,
        },
        {
          name: 'Operator Panel',
          content: iframe.operator_panel,
        },
        {
          name: 'Recordings',
          content: iframe.recordings,
        },
        {
          name: 'Ring Groups',
          content: iframe.ring_groups,
        },
        {
          name: 'Time Conditions',
          content: iframe.time_conditions,
        },
        {
          name: 'Voice mail',
          content: iframe.voice_mail,
        },
      ];
    }
    if (pathName === 'advanced') {
      content = [
        {
          name: 'Access Controls',
          content: iframe.access_controls,
        },
        {
          name: 'Default Settings',
          content: iframe.default_settings,
        },
      ];
    }
    return content.length > 0 ? (
      <DialPlan returnJSX={returnJSX} iframe={iframe} content={content} key={iframe} />
    ) : null;
  };

  const returnJSX = (html) => {
    const frame = `<iframe height="915px" width="100%" src=${html} frameborder="0" allowFullScreen="true"></iframe>`;
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: frame,
        }}
      />
    );
  };

  const renderIframe = () => {
    if (configCallCenter) {
      const iframeRender = iframe[path];
      if (iframeRender) {
        // const frame = `<iframe height="915px" width="100%" src=${iframeRender} frameborder="0" allowFullScreen="true"></iframe>`;
        return returnJSX(iframeRender);
      }
      return renderTabPage(path);
    }
    return <NoDataPermission />;
  };

  return renderIframe();
}

export default connect(({ user }) => ({ user }))(CallCenter);
