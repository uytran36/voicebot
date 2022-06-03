import { Divider } from 'antd';
import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';
import { withPropsAPI } from 'gg-editor';
import React from 'react';
import { Button, Typography, Input, Col, Row } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

// const FlowToolbar = () => (
//   <Toolbar className={styles.toolbar}>
//     <ToolbarButton command="undo" />
//     <ToolbarButton command="redo" />
//     <Divider type="vertical" />
//     <ToolbarButton command="copy" />
//     <ToolbarButton command="paste" />
//     <ToolbarButton command="delete" />
//     <Divider type="vertical" />
//     <ToolbarButton command="zoomIn" icon="zoom-in" text="Zoom In" />
//     <ToolbarButton command="zoomOut" icon="zoom-out" text="Zoom Out" />
//     <ToolbarButton command="autoZoom" icon="fit-map" text="Fit Map" />
//     <ToolbarButton command="resetZoom" icon="actual-size" text="Actual Size" />
//     <Divider type="vertical" />
//     <ToolbarButton command="toBack" icon="to-back" text="To Back" />
//     <ToolbarButton command="toFront" icon="to-front" text="To Front" />
//     <Divider type="vertical" />
//     <ToolbarButton command="multiSelect" icon="multi-select" text="Multi Select" />
//     <ToolbarButton command="addGroup" icon="group" text="Add Group" />
//     <ToolbarButton command="unGroup" icon="ungroup" text="Ungroup" />
//   </Toolbar>
// );

class FlowToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.actionZoom = this.actionZoom.bind(this);
    this.state = {
      scale: 100,
    }
  }

  actionZoom(type) {
    const current = this.state.scale;
    return this.setState({
      scale: type === "in" && current < 200 ? current + 10 : (type === "out" && current > 20 ? current - 10 : current)
    })
  }

  reset() {
    this.props.setMountedKey(Math.random());
  }

  render() {
    const { propsAPI } = this.props;
    const { getSelected } = propsAPI;
    let isActive = { display: 'flex' };
    try {
      const selected = getSelected()[0];
      if (selected.model.id == 0) {
        isActive = { display: 'none' };
      }
    } catch { }

    return (
      <Toolbar className={styles.toolbar}>
        <Col span={19}>
          <Row>
            <Typography.Title
              level={5}
              onClick={() => this.props.goBack()}
              style={{ cursor: 'pointer', marginBottom: 0 }}
            >
              <LeftOutlined />
              <span> &ensp; Kịch bản </span>
            </Typography.Title>
            <Divider type="vertical" />
            <ToolbarButton command="undo" />
            <ToolbarButton command="redo" />
            <Divider type="vertical" />
            <span style={isActive}>
              <ToolbarButton command="copy" />
              <ToolbarButton command="paste" />
              <ToolbarButton command="delete" />
              <Divider type="vertical" />
            </span>
            <Button danger onClick={this.reset}>
              Reset all
            </Button>
          </Row>
        </Col>
        <Col span={5}>
          <Row justify="end">
            <ToolbarButton command="zoomOut" icon="zoom-out" text="Zoom Out" action={this.actionZoom} param="out" />
            <Input placeholder={`${this.state.scale}%`} disabled={true} style={{ width: 60, textAlign: 'center' }} />
            <ToolbarButton command="zoomIn" icon="zoom-in" text="Zoom In" action={this.actionZoom} param="in" />
          </Row>
        </Col>


      </Toolbar >
    );
  }
}

export default withPropsAPI(FlowToolbar);
