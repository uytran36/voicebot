import { Col, Row } from 'antd';
import GGEditor from 'gg-editor';
import { FlowToolbar } from './components/EditorToolbar';
import styles from './index.less';
import React from 'react';
import FlowEditor from './customizedComponent/FlowEditor';
GGEditor.setTrackable(false);
import { nodeType } from './customizedComponent/CustomFlowElement/customNode';

export default ({ goBack, headers, cloneScript, campaignId }) => {
  const element = document.getElementsByTagName('canvas');
  const canvasWidth = element[0]?.offsetWidth;
  const canvasHeight = element[0]?.offsetHeight;
  const startHeight = canvasHeight / 5;
  const defaultData = {
    nodes: [
      {
        type: 'node',
        size: '167*40',
        shape: 'custom-node',
        nodeCustomizeType: nodeType.Bot,
        color: '#C7E7FF',
        icon: '/icons/FlowIcon/bot.png',
        text: 'Lời chào mở đầu',
        x: canvasWidth / 2,
        y: startHeight,
        id: '0',
        border: '#127ACE',
        colorFocus: '#45ACFF',
        iconFocus: '/icons/FlowIcon/bot-fill.png',
      },

      {
        type: 'node',
        size: '167*40',
        shape: 'custom-node',
        nodeCustomizeType: nodeType.Bot,
        color: '#C7E7FF',
        icon: '/icons/FlowIcon/bot.png',
        text: 'Lời chào kết thúc',
        x: canvasWidth / 2,
        y: startHeight * 2,
        id: '1',
        border: '#127ACE',
        colorFocus: '#45ACFF',
        iconFocus: '/icons/FlowIcon/bot-fill.png',
      },

      {
        type: 'node',
        size: '167*40',
        shape: 'custom-node',
        nodeCustomizeType: nodeType.Agent,
        color: '#D7FFD7',
        icon: '/icons/FlowIcon/agent.png',
        text: 'Tổng đài viên',
        x: canvasWidth / 2,
        y: startHeight * 3,
        id: '2',
        border: '#1EAF61',
        iconFocus: '/icons/FlowIcon/agent-fill.png',
        colorFocus: '#5BE358',
      },

      {
        type: 'node',
        size: '167*40',
        shape: 'custom-node',
        nodeCustomizeType: nodeType.ReturnData,
        color: '#DECEFF',
        icon: '/icons/FlowIcon/export.png',
        text: 'Trả dữ liệu',
        x: canvasWidth / 2,
        y: startHeight * 4,
        id: '3',
        border: '#7F10D6',
        colorFocus: '#A279F9',
        iconFocus: '/icons/FlowIcon/export-fill.png',
      },
    ],
  };

  const data = cloneScript || defaultData; //sua khi có API

  return (
    <>
      {data ? (
        <GGEditor className={styles.editor}>
          <Row className={styles.editorHd}>
            <Col span={24}>
              <FlowToolbar />
            </Col>
          </Row>
          <FlowEditor goBack={goBack} headers={headers} data={data} campaignId={campaignId} />
        </GGEditor>
      ) : (
        <p>Chưa có kịch bản</p>
      )}
    </>
  );
};
