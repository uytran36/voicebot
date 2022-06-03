import { Col, Row } from 'antd';
import GGEditor from 'gg-editor';
import { PageContainer } from '@ant-design/pro-layout';
import { FlowToolbar } from './components/EditorToolbar';
import styles from './index.less';
import { useState, useEffect } from 'react';
import React from 'react';
import FlowEditor from './customizedComponent/FlowEditor';
GGEditor.setTrackable(false);
import { nodeType } from './customizedComponent/CustomFlowElement/customNode';

export default ({ goBack, headers, cloneScript, campaignId }) => {
  const [activeNode, setActiveNode] = useState();
  const [mountedKey, setMountedKey] = useState(Math.random());
  const defaultData = {
    nodes: [
      {
        type: 'node',
        size: '167*40',
        shape: 'custom-node',
        nodeCustomizeType: nodeType.Bot,
        color: '#C7E7FF',
        icon: '/icons/FlowIcon/bot.png',
        text: 'Welcome',
        x: 100,
        y: 55,
        id: '0',
        border: '#127ACE',
        colorFocus: '#45ACFF',
        iconFocus: '/icons/FlowIcon/bot-fill.png',
      },
    ],
  };

  const data = cloneScript;

  return (
    <>
      {data ? (
        <GGEditor key={mountedKey} className={styles.editor}>
          <Row className={styles.editorHd}>
            <Col span={24}>
              <FlowToolbar activeNode={activeNode} setMountedKey={setMountedKey} goBack={goBack} />
            </Col>
          </Row>
          <FlowEditor
            setActiveNode={setActiveNode}
            goBack={goBack}
            headers={headers}
            data={data}
            campaignId={campaignId}
          />
        </GGEditor>
      ) : (
        <p>Chưa có kịch bản</p>
      )}
    </>
  );
};
