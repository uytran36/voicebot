import { Col, Row, Button } from 'antd';
import { Flow, withPropsAPI } from 'gg-editor';
import styles from '../index.less';
import { Popover } from 'antd';
import React from 'react';
import PopUpModal from './PopUpModal';
import CustomNode from './CustomFlowElement/customNode';
import CustomEdge from './CustomFlowElement/customEdge';
import EditSide from './EditSide';
import { nodeType } from './CustomFlowElement/customNode';
import { update_campaign_script, requestGetCampaigns } from '@/services/campaign-management';
import { connect } from 'umi';
import { message } from 'antd';
import ExampleBehaviour from './CustomFlowElement/customBehaviour';
class FlowEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isVisible: false, top: 0, left: 0, nodeOnClick: false, campaignInfo: {} };
    this.clickOnCanvas = this.clickOnCanvas.bind(this);
    this.hidePopUp = this.hidePopUp.bind(this);
    this.saveScript = this.saveScript.bind(this);
    this.checkClickOnPlusIcon = this.checkClickOnPlusIcon.bind(this);
  }

  componentDidMount() {
    const { graph } = this.graphNode;
    graph.addBehaviour('hoverAnchorActived');
    requestGetCampaigns({ headers: this.props.headers, query: this.props.campaignId }).then(
      (res) => {
        if (res?.success) {
          this.setState((preState) => ({
            ...preState,
            campaignInfo: res?.data[0],
          }));
        }
      },
    );
  }

  checkClickOnPlusIcon(e) {
    const { propsAPI } = this.props;
    const { getSelected } = propsAPI;
    const selected = getSelected()[0];
    const availableCLickX = [selected?.model.x + 80 - 20, selected?.model.x + 80 + 20];
    const availableCLickY = [selected?.model.y + 10 - 20, selected?.model.y + 10 + 20];
    const group = selected?.group;
    const plusIcon = group?.findByClass('plusIcon')[0];
    const isClickValid =
      e.x >= availableCLickX[0] &&
      e.x <= availableCLickX[1] &&
      e.y >= availableCLickY[0] &&
      e.y <= availableCLickY[1];

    return (
      selected !== undefined &&
      /* plusIcon !== undefined && */
      (e.shape?._cfg?.class == 'plusIcon' || isClickValid)
    );
  }

  hideAnchor(e) {
    const anchorShapes = e?.item?.anchorShapes || e?.currentItem?.anchorShapes;
    anchorShapes?.forEach((anchor) => anchor?.attr('opacity', '0'));
  }

  async clickOnCanvas(e) {
    if (e?.item?.type === 'node') {
      this.hidePlusIcon();
      await this.setState((preState) => ({
        ...preState,
        isVisible: false,
        nodeOnClick: e?.item,
      }));

      this.props.setActiveNode(e.item);
      if (e.item.model.nodeCustomizeType !== nodeType.ReturnData) {
        const group = e.item.getGraphicGroup();
        this.hideAnchor(e);

        group.addShape('image', {
          class: 'plusIcon',
          attrs: {
            cursor: 'pointer',
            x: 75,
            y: -7,
            img: '/icons/FlowIcon/plus-circle.png',
          },
        });
      }
    } else if (this.checkClickOnPlusIcon(e)) {
      this.setState((preState) => ({
        ...preState,
        isVisible: true,
        top: e.domY,
        left: e.domX,
        //nodeOnClick: selected,
      }));
    } else {
      await this.hidePlusIcon();
      if (this.state.isVisible)
        this.setState((preState) => ({ ...preState, isVisible: false, nodeOnClick: false }));
      else this.setState((preState) => ({ ...preState, nodeOnClick: false }));
    }
  }

  async hidePopUp() {
    this.hidePlusIcon();
    if (this.state.isVisible || this.state.nodeOnClick)
      this.setState((preState) => ({ ...preState, isVisible: false /* , nodeOnClick: false */ }));
  }

  async hidePlusIcon() {
    const onClickNode = this.state.nodeOnClick;
    const group = onClickNode?.group;
    if (group) {
      const plusIcon = group?.findByClass('plusIcon')[0];
      plusIcon && group?.removeChild(plusIcon);
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
              onDrag={(e) => {
                this.hidePopUp();
                this.hideAnchor(e);
              }}
              onDragEnd={(e) => {
                this.hideAnchor(e);
              }}
              onAfterViewportChange={() => this.hidePopUp()}
              onBeforeItemActived={(e) => this.hideAnchor(e)}
              mode="default"
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
            <Popover
              visible={this.state.isVisible}
              content={
                <PopUpModal
                  nodeType={this.state.nodeOnClick?.model?.nodeCustomizeType}
                  data={this.props.data}
                  hidePopUp={() => this.hidePopUp()}
                />
              }
            >
              <div style={{ position: 'absolute', top: this.state.top, left: this.state.left }} />
            </Popover>
          </Col>
          {this.state.nodeOnClick?.model?.id && (
            <Col
              span={6}
              className={styles.editorSidebar}
              onMouseEnter={() => this.hidePopUp()}
              key={this.state.nodeOnClick.model.id}
            >
              <EditSide
                nodeOnClickID={this.state.nodeOnClick.model.id} //fix blink while check duplicate condition
                headers={this.props.headers}
                dispatch={this.props.dispatch}
                campaignInfo={this.state.campaignInfo}
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
