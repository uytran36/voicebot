import React, { useRef } from 'react';
import PT from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'umi';
import { Row, Col } from 'antd';
// components
import Table from './Components/Table';
import Infomation from './Components/Infomation';

Omnichannel.propTypes = {
  history: PT.shape({
    push: PT.func,
  }).isRequired,
  omnichannel: PT.shape({
    isShowInfo: PT.bool,
  }).isRequired,
};

function Omnichannel({ omnichannel: { isShowInfo }, history }) {
  return (
    <Row gutter={[8, 8]}>
      <Col span={isShowInfo ? 16 : 24} style={{ transition: 'flex .3s, max-width .3s linear' }}>
        <Table />
      </Col>
      <Col span={8} style={{ transition: 'flex .3s, max-width .3s linear' }}>
        <QueueAnim type={['right', 'left']} delay={[400, 0]}>
          {isShowInfo && [
            <div key="info">
              <Infomation />
            </div>,
          ]}
        </QueueAnim>
      </Col>
    </Row>
  );
}

export default connect(({ omnichannel }) => ({ omnichannel }))(Omnichannel);
