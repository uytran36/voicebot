import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'antd';
import Texty from 'rc-texty';
import { PageContainer } from '@ant-design/pro-layout';
import { Link } from 'umi';
import {
  CheckCircleFilled,
  ClockCircleOutlined,
  FormOutlined,
  ApartmentOutlined,
  RiseOutlined,
  CommentOutlined,
  UserOutlined,
} from '@ant-design/icons';
import style from './style.less';

const Homepage = () => {
  return (
    <PageContainer>
      <div className={style.contentWrapper}>
        <div className={style.header}>
          <h3>Configuration guide</h3>
          <h3>
            Now that you have Amazon Connect setup. it’s easy to manage your contact center reliably
            at any scale. Following these steps will guide you through the basics of configuring FPT
            Connect for you business.
          </h3>
        </div>
        <div className={style.step}>
          <span>
            <CheckCircleFilled
              style={{ color: '#239627', fontSize: '20px', marginRight: '10px' }}
            />{' '}
            1. Claim a phone number
          </span>
          <h3>You must claim a phone number in order to receive and place calls</h3>
        </div>
        <Row gutter={[16, 32]}>
          <Col flex="auto">
            <div className={style.box}>
              <ClockCircleOutlined style={{ fontSize: '50px', marginRight: '20px' }} />
              <div className={style.content}>
                <h3>2. Set hours of operations</h3>
                <span>
                  Hours of operation define when Amazon Connect resources. such as queues, are
                  available, and may be referenced in contact flows
                </span>
              </div>
            </div>
          </Col>
          <Col flex="auto">
            <div className={style.box}>
              <FormOutlined style={{ fontSize: '50px', marginRight: '20px' }} />
              <div className={style.content}>
                <h3>3. Create queues</h3>
                <span>
                  Queue allow contacts to be routed to the best agents to service them if you need
                  to route contacts with different priorities or agents with different skills, you
                  will want to create multiple queues.
                </span>
              </div>
            </div>
          </Col>
          <Col flex="auto">
            <div className={style.box}>
              <CommentOutlined style={{ fontSize: '50px', marginRight: '20px' }} />
              <div className={style.content}>
                <h3>4. Create prompts</h3>
                <span>
                  Prompts are media that can be used to play back audio to customers or agents
                  contact flows. You can upload a pre-recorded wav file, or quickly record one
                  through our web interface using your computer’s microphone. Updates to prompts
                  take immediate effect in all contact flows they are referenced in.
                </span>
              </div>
            </div>
          </Col>
          <Col flex="auto">
            <div className={style.box}>
              <ApartmentOutlined style={{ fontSize: '50px', marginRight: '20px' }} />
              <div className={style.content}>
                <h3>5. Create contact flows</h3>
                <span>
                  Contact flows (summary to an IVR) define the customers’s experience ưhen they
                  contact you, Amazon Connect contact flows can intergrate with other systems such
                  are CRMs and databases to dynamic ally adapt the experience based on the customer
                  and their history. Amazon Connect’s contact flows intergrate with Amazon Lex and
                  provide text to speech and can enable natural language based self-service
                  interactions.
                </span>
              </div>
            </div>
          </Col>
          <Col flex="auto">
            <div className={style.box}>
              <RiseOutlined style={{ fontSize: '50px', marginRight: '20px' }} />
              <div className={style.content}>
                <h3>6. Create routing profiles</h3>
                <span>
                  A Routing Profile is a collection of queues that an agent will service contracts
                  from Routing profiles enable agents to service miltiple queues with the proper
                  priority.
                </span>
              </div>
            </div>
          </Col>
          <Col flex="auto">
            <div className={style.box}>
              <UserOutlined style={{ fontSize: '50px', marginRight: '20px' }} />
              <div className={style.content}>
                <h3>7. Configure users</h3>
                <span>
                  User Management enables adding, managing, and deleteing users. User specific
                  settings like routing profiles and permissions can be assigned once the users are
                  created.
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default Homepage;
