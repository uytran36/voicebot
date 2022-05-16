import { Toolbar } from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';
import { withPropsAPI } from 'gg-editor';
import React from 'react';
import { Input, Col, Row } from 'antd';

class FlowToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.actionZoom = this.actionZoom.bind(this);
    this.state = {
      scale: 100,
    };
  }

  actionZoom(type) {
    const current = this.state.scale;
    return this.setState({
      scale:
        type === 'in' && current < 200
          ? current + 10
          : type === 'out' && current > 20
          ? current - 10
          : current,
    });
  }

  render() {
    return (
      <Toolbar className={styles.toolbar}>
        <Col span={19}></Col>
        <Col span={5}>
          <Row justify="end">
            <ToolbarButton
              command="zoomOut"
              icon="zoom-out"
              text="Zoom Out"
              action={this.actionZoom}
              param="out"
            />
            <Input
              placeholder={`${this.state.scale}%`}
              disabled={true}
              style={{ width: 60, textAlign: 'center' }}
            />
            <ToolbarButton
              command="zoomIn"
              icon="zoom-in"
              text="Zoom In"
              action={this.actionZoom}
              param="in"
            />
          </Row>
        </Col>
      </Toolbar>
    );
  }
}

export default withPropsAPI(FlowToolbar);
