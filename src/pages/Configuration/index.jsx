import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'antd';
import Texty from 'rc-texty';
import { PageContainer } from '@ant-design/pro-layout';
import { Link } from 'umi';
import { UserSwitchOutlined, BellOutlined, MenuOutlined, ProfileOutlined } from '@ant-design/icons';
import style from './style.less';

const Configuration = () => {

  const [isAnimation, setAnimation] = useState(false)

  const handleAnimation = (state) => {
    setAnimation(state)
  }

  return (
    <PageContainer>
      <Card>
        <Row gutter={[16, 32]} style={{ marginLeft: '1rem' }}>
          <Col flex="auto">
            <Link to="/configuration/generalconfig">
              <Button size="large" className={style.button}>
                <MenuOutlined />
                <Texty>Cấu hình chung</Texty>
              </Button>
            </Link>
          </Col>
          <Col flex="auto">
            <Button size="large" className={style.button} onMouseEnter={() => handleAnimation(true)} onMouseLeave={() => handleAnimation(false)}>
              <UserSwitchOutlined />
              {isAnimation ? <Texty>Phân quyền truy cập</Texty> : 'Phân quyền truy cập'}
            </Button>
          </Col>
          <Col flex="auto">
            <Button size="large" className={style.button}>
              <ProfileOutlined />
              Billing
            </Button>
          </Col>
          <Col flex="auto">
            <Button size="large" className={style.button}>
              <BellOutlined />
              Thông báo
            </Button>
          </Col>
        </Row>
        <Row gutter={[16, 32]} style={{ marginLeft: '1rem' }}>
          <Col flex="auto">
            <Button size="large" className={style.button}>
              <MenuOutlined />
              Cấu hình chung
            </Button>
          </Col>
          <Col flex="auto">
            <Button size="large" className={style.button}>
              <UserSwitchOutlined />
              Phân quyền truy cập
            </Button>
          </Col>
          <Col flex="auto">
            <Button size="large" className={style.button}>
              <ProfileOutlined />
              Billing
            </Button>
          </Col>
          <Col flex="auto">
            <Button size="large" className={style.button}>
              <BellOutlined />
              Thông báo
            </Button>
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default Configuration;
