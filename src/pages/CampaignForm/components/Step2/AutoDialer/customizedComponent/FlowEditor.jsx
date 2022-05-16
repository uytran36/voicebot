import { Col, Row, Button } from 'antd';
import { Flow, withPropsAPI } from 'gg-editor';
import styles from '../index.less';
import React from 'react';
import CustomNode from './CustomFlowElement/customNode';
import CustomEdge from './CustomFlowElement/customEdge';
import EditSide from './EditSide';
import { nodeType } from './CustomFlowElement/customNode';
import { update_campaign_script } from '@/services/campaign-management';
import { connect } from 'umi';
import { message } from 'antd';
import ExampleBehaviour from './CustomFlowElement/customBehaviour';
class FlowEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { nodeOnClick: false };
    this.clickOnCanvas = this.clickOnCanvas.bind(this);
    this.saveScript = this.saveScript.bind(this);
  }

  componentDidMount() {
    const { graph } = this.graphNode;
    graph.addBehaviour('hoverAnchorActived');
  }

  hideAnchor(e) {
    e?.item?.anchorShapes?.forEach((anchor) => anchor?.attr('opacity', '0'));
  }

  async clickOnCanvas(e) {
    if (e?.item?.type === 'node') {
      await this.setState((preState) => ({
        ...preState,
        nodeOnClick: e?.item,
      }));
      this.hideAnchor(e);
    } else {
      this.setState((preState) => ({ ...preState, nodeOnClick: false }));
    }
  }

  async saveScript() {
    const { propsAPI } = this.props;
    const { save } = propsAPI;
    const check = await this.checkFlow();
    if (check) {
      const res = await update_campaign_script(this.props.headers, {
        campaign_id: this.props.campaignId,
        configuration: { nodes: save().nodes, edges: save().edges || [] },
      });
      if (res?.success) {
        const trickButton = document.getElementById('clickTrigger');
        trickButton.click();
      }
    } else message.warning('Trùng giá trị điều kiện!');
  }

  async checkFlow() {
    const { propsAPI } = this.props;
    const { save } = propsAPI;

    const allNode = save().nodes;
    const allLink = save().edges;
    let isDuplicate = false;

    const mergeNodeLink = [];
    allLink?.forEach((l) => {
      const sourceNode = allNode?.filter((n) => n.id == l.source);
      const targetNode = allNode?.filter((n) => n.id == l.target);
      mergeNodeLink.push({
        edgeID: l.id,
        sourceNode: sourceNode[0],
        targetNode: targetNode[0],
      });
    });

    const botandCondition = mergeNodeLink?.filter(
      (nl) =>
        nl.sourceNode.nodeCustomizeType == nodeType.Bot &&
        nl.targetNode.nodeCustomizeType == nodeType.Customer,
    );

    const listCheckBotNodeIDs = [];
    botandCondition?.some((bnC) => {
      const botIdChecking = bnC.sourceNode.id;
      if (listCheckBotNodeIDs?.findIndex((x) => botIdChecking == x) !== -1) return;
      listCheckBotNodeIDs.push(botIdChecking);
      let listUsedConditionInBot = [];
      botandCondition?.forEach((y) => {
        if (y.sourceNode.id === botIdChecking)
          listUsedConditionInBot = listUsedConditionInBot.concat(
            y.targetNode?.info?.details?.conditions,
          );
      });

      listUsedConditionInBot?.some((a) => {
        isDuplicate =
          listUsedConditionInBot?.filter(
            (b) =>
              b?.condition == a?.condition &&
              b?.value == a?.value &&
              !(b?.value === '' || b?.value === undefined || b?.value === null),
          ).length >= 2;

        if (isDuplicate == true) return true;
      });
      if (isDuplicate) return true;
    });

    if (isDuplicate) return false;
    return true;
  }

  render() {
    return (
      <>
        <Row className={styles.editorBd}>
          <Col span={this.state.nodeOnClick ? 18 : 24} className={styles.editorContent}>
            <Flow
              ref={(e) => (this.graphNode = e)}
              className={styles.flow}
              data={this.props.data}
              onClick={(e) => {
                this.clickOnCanvas(e);
              }}
              onBeforeItemActived={(e) => this.hideAnchor(e)}
              mode="default"
              onKeyDown={(e) => console.log(e)}
              graph={{
                modes: {
                  default: [
                    'panBlank',
                    'hoverGroupActived',
                    'keydownCmdWheelZoom',
                    //'clickEdgeSelected',
                    'clickNodeSelected',
                    'clickCanvasSelected',
                    //'clickGroupSelected',
                    'hoverNodeActived',
                    //'hoverEdgeActived',
                    'hoverButton',
                    //'clickCollapsedButton',
                    //'clickExpandedButton',
                    'wheelChangeViewport',
                    //'keydownShiftMultiSelected',
                    //'dragNodeAddToGroup',
                    //'dragOutFromGroup',
                    'panItem',
                    //'hoverEdgeControlPoint',
                    //'dragEdgeControlPoint',
                    //'hoverAnchorActived',
                  ],
                },
              }}
            />
          </Col>
          {this.state.nodeOnClick?.model?.id && (
            <Col span={6} className={styles.editorSidebar} key={this.state.nodeOnClick?.model?.id}>
              <EditSide
                headers={this.props.headers}
                dispatch={this.props.dispatch}
                campaignInfo={this.props.campaign2.campaignInfo}
                nodeOnClick={this.state.nodeOnClick}
              />
            </Col>
          )}

          <CustomNode />
          <CustomEdge />
          <ExampleBehaviour />
        </Row>

        <Row style={{ paddingTop: 10, backgroundColor: '#f0f2f5' }}>
          <Col span={12} style={{ textAlign: 'left' }}>
            <Button onClick={this.props.goBack}>Quay lại</Button>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => this.saveScript()}>
              Lưu & Tiếp tục
            </Button>
            <Button id="clickTrigger" htmlType="submit" style={{ display: 'none' }}></Button>
          </Col>
        </Row>
      </>
    );
  }
}

export default connect(({ campaign2 }) => ({ campaign2 }))(withPropsAPI(FlowEditor));
