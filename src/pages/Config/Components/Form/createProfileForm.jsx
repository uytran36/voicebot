/**
 * Chú ý hãy viết đầy đủ props-types :)
 */

import React, { useState, Fragment, useRef, useEffect, useCallback } from 'react';
import PT from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeUp,
  faEllipsisH,
  faEllipsisV,
  faVideoSlash,
  faVideo,
  faPhoneAlt,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import Icon, {
  AudioMutedOutlined,
  EllipsisOutlined,
  PhoneFilled,
  PhoneOutlined,
  PlusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  Steps,
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  Radio,
  Button,
  Typography,
  Select,
  notification,
} from 'antd';
import { FormattedMessage } from 'umi';
import { requestCallVocieBot } from '../../service';
import Timer from 'react-compound-timer';
import styles from '../../styles.less';
import api from '@/api';

const IconRemove = () => (
  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M15.2 0.833252H4.80005L0.800049 4.99992L4.80005 9.16659H15.2V0.833252Z"
      stroke="#007AFF"
    />
    <path
      d="M8.218 5.368L7.138 3.898H7.792L8.536 4.984L9.31 3.898H9.922L8.854 5.326L10.054 7H9.4L8.536 5.716L7.672 7H7.054L8.218 5.368Z"
      fill="#007AFF"
    />
  </svg>
);
CreateProfileForm.propTypes = {
  getValues: PT.func.isRequired,
};

export default function CreateProfileForm({
  getValues,
  Step,
  setStep,
  formData,
  sipProfile,
  user,
}) {
  // all refs
  const inputRef = useRef();
  // states
  const [currentStep, setCurrentStep] = useState(0);
  const [subscribedId, setSubscribedId] = useState(null);
  const [currentStepTestDial, setcurrentStepTestDial] = useState(0);

  const handleOnFinish = (values) => {
    switch (Step) {
      case 1:
        // if (currentStep < 4) {
        getValues(values);
        // if (currentStep === 0) {
        //   // setCurrentStep(currentStep + 1);
        // } else {
        // }
        setStep(Step + 1);
        // getValues(values);
        break;
      case 2:
        getValues(values);
        setStep(Step + 1);
        break;
      case 3:
        if (currentStepTestDial == 0) {
          // getValues(values);
          // setcurrentStepTestDial(1);
        }
        break;
      default:
        break;
    }
  };

  const handleTestCall = () => {
    if (formData && formData.phoneNumberCall && formData.phoneNumber) {
      const data = {
        test_content: 'voice_bot',
        gateway_uuid: formData.phoneNumber.split('/')[1],
        number: formData.phoneNumberCall,
        provider: 'mobile',
        text:
          'FPT Telecom xin kính chào quí khách. Đây là cuộc gọi test từ hệ thống voice bot campaign. Cảm ơn quý khách đã lắng nghe',
        key: '2c44dfeba92a37bfebef8',
        customer_type: '5',
        data: '',
        voice: 'female_north',
        // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkxrWDZjU1htaU45a1dUVEtCIiwibmFtZSI6InRlc3RjYWxsIiwicm9sZXMiOlsidXNlciIsImF1dG9jYWxsLWFkbWluIl0sImlhdCI6MTYxMjQxMzQ4OCwiZXhwIjoxNjEyNDM1MDg4fQ.mlmkt1Fd1OnW0JCskF4nrnuyO8Cmq68DilqQLZMF0Y0"
        token: user.tokenHub,
        trace_call: 'true',
      };
      requestCallVocieBot(data).then((resCallBot) => {
        console.log({ resCallBot });
        if (resCallBot?.success === 'true') {
          setSubscribedId(resCallBot.call_id);
        }
      });
    } else {
      notification.error({
        message: 'Không đủ thông tin!!',
        description: 'Error',
      });
    }
  };

  useEffect(() => {
    if (subscribedId) {
      // const connection = new WebSocket('ws://172.30.12.139:3003');
      const connection = new WebSocket(api.WS_CALL_SERVICE);
      connection.onopen = () => {
        connection.send(JSON.stringify({ subscribedId }));
      };
      connection.onerror = (e) => {
        notification.error({
          message: 'Connection socket error!!',
          description: 'Error',
        });
      };

      connection.onclose = () => {
        notification.warning({
          message: 'Connection socket close!!',
          description: 'Error',
        });
      };
      connection.onmessage = (e) => {
        let res = JSON.parse(e.data);
        console.log({ res });
        switch (res.event_name) {
          case 'CONNECTED':
            break;
          case 'CHANNEL_CREATE':
            setcurrentStepTestDial(2);
            break;
          case 'CHANNEL_ANSWER':
            setcurrentStepTestDial(3);
            break;
          case 'CHANNEL_HANGUP':
            setcurrentStepTestDial(4);
            break;
          case 'NO_ANSWER':
            setcurrentStepTestDial(5);
            break;
          default:
            break;
        }
      };
    }
  }, [subscribedId]);

  return (
    <Row>
      <Col xs={0} md={6} lg={5} style={{ borderRight: '1px solid #000' }}>
        {/* <Typography.Title level={3}>Bước 01: Create profile</Typography.Title>
        {Step === 1 ? <Steps progressDot direction="vertical" current={currentStep}>
          <Steps.Step title="Thiết lập lưu trữ thông tin khách hàng" />
          <Steps.Step title="Tạo admin" />
          <Steps.Step title="Thiết lập sử dụng dịch vụ" />
          <Steps.Step title="Lưu trữ mở khóa dữ liệu" />
          <Steps.Step title="Kiểm tra" />
        </Steps> : ''} */}
        <Typography.Title level={3}>
          <FormattedMessage id="pages.config.step1" defaultMessage="Bước 01: Tạo hồ sơ" />
        </Typography.Title>
        <Typography.Title level={3}>
          <FormattedMessage id="pages.config.step2" defaultMessage="Bước 02: Tạo đầu số" />
        </Typography.Title>
        <Typography.Title level={3}>
          <FormattedMessage id="pages.config.step3" defaultMessage="Bước 03: Test dial" />
        </Typography.Title>
      </Col>
      <Col xs={24} md={18} lg={19}>
        {/* step 1 */}
        {Step === 1 ? (
          <Form
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            onFinish={handleOnFinish}
            layout={currentStep === 2 ? 'vertical' : 'horizontal'}
          >
            {currentStep === 0 && <InfoCustomer />}
            {/* {currentStep === 1 && <CreateAdmin />} */}
            {/* {currentStep === 1 && <CreateService />} */}
            <div className={`${styles['btn-group']}`}>
              <div>
                <Button
                  size="large"
                  className={styles.btn}
                  onClick={() => {
                    if (currentStep > 0) {
                      setCurrentStep(currentStep - 1);
                    }
                  }}
                >
                  <FormattedMessage id="pages.config.back" defaultMessage="Quay lại" />
                </Button>
              </div>
              <div>
                <Button size="large" className={styles.btn} type="primary" htmlType="submit">
                  <FormattedMessage id="pages.config.continue" defaultMessage="Tiếp tục" />
                </Button>
              </div>
            </div>
          </Form>
        ) : (
          ''
        )}
        {Step === 2 ? (
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            onFinish={handleOnFinish}
            layout="vertical"
          >
            <CreatePhoneFirst sipProfile={sipProfile} />
            <div className={`${styles['btn-group']}`}>
              <Button size="large" className={styles.btn} onClick={() => setStep(1)}>
                <FormattedMessage id="pages.config.back" defaultMessage="Quay lại" />
              </Button>
              <Button size="large" className={styles.btn} type="primary" htmlType="submit">
                <FormattedMessage id="pages.config.continue" defaultMessage="Tiếp tục" />
              </Button>
            </div>
          </Form>
        ) : (
          ''
        )}
        {Step === 3 ? (
          <Row>
            <Col span={14}>
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 14 }}
                onFinish={handleOnFinish}
                layout="vertical"
              >
                <TestDial
                  getValues={getValues}
                  Step={currentStepTestDial}
                  formData={formData}
                  handleTestCall={handleTestCall}
                />
                <div className={`${styles['btn-group']}`}>
                  <div>
                    <Button
                      size="large"
                      className={styles.btn}
                      onClick={() => {
                        setStep(2);
                        setcurrentStepTestDial(0);
                      }}
                    >
                      <FormattedMessage id="pages.config.back" defaultMessage="Quay lại" />
                    </Button>
                  </div>
                  <div>
                    <Button size="large" className={styles.btn} type="primary" htmlType="submit">
                      <FormattedMessage id="pages.config.continue" defaultMessage="Tiếp tục" />
                    </Button>
                  </div>
                </div>
              </Form>
            </Col>
            <Col span={8}>
              {currentStepTestDial === 0 ? (
                <CreatePurePhone
                  handleTestCall={handleTestCall}
                  formData={formData}
                  getValues={getValues}
                  inputRef={inputRef}
                />
              ) : (
                ''
              )}
              {currentStepTestDial === 1 ? (
                <div className={styles['iphone']}>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingLeft: 30,
                        marginTop: 100,
                      }}
                    >
                      <Row>
                        <PlusOutlined
                          style={{ fontSize: 12, marginRight: 20, color: '#007AFF', lineHeight: 2 }}
                        />
                        <Typography.Text className={styles['phone-number-text']}>
                          {formData.phoneNumberCall}
                        </Typography.Text>
                        <Icon
                          component={IconRemove}
                          style={{
                            fontSize: 12,
                            marginLeft: 'auto',
                            marginRight: 20,
                            lineHeight: 2,
                          }}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <button className={styles['iphone-number']}>
                        <label>1 </label>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>2 </label>
                        <span>ABC</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>3 </label>
                        <span> DFE</span>
                      </button>
                    </Col>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <button className={styles['iphone-number']}>
                        <label>4 </label>
                        <span> GHI</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>5 </label>
                        <span> JKL</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>6 </label>
                        <span> MNO</span>
                      </button>
                    </Col>
                    <Col
                      styl
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <button className={styles['iphone-number']}>
                        <label>7 </label>
                        <span> PQRS</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>8 </label>
                        <span>TUV</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>9 </label>
                        <span>WXYZ</span>
                      </button>
                    </Col>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <button className={styles['iphone-number']}>
                        <label>* </label>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>0</label>
                        <span>+</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label># </label>
                      </button>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <Button on className={styles['iphone-number-call']} type="primary">
                        <FontAwesomeIcon size="lg" icon={faPhoneAlt} />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ) : (
                ''
              )}

              {currentStepTestDial === 2 ? (
                <div className={styles['iphone-on-call']}>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        textAlign: 'center',
                        display: 'grid',
                        marginTop: 100,
                      }}
                    >
                      <Typography.Text className={styles['phone-number-text']}>
                        {formData.phoneNumberCall}
                      </Typography.Text>
                      <Typography.Text className={styles['phone-number-text-description']}>
                        Đang gọi ...
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 100,
                        flex: 0,
                      }}
                    >
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <AudioMutedOutlined style={{ fontSize: 20 }} />
                        </Button>
                        <span className={styles['description-button']}>Im lặng</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faEllipsisV} />
                          <FontAwesomeIcon size="lg" icon={faEllipsisV} />
                          <FontAwesomeIcon size="lg" icon={faEllipsisV} />
                        </Button>
                        <span className={styles['description-button']}>Bàn phím</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faVolumeUp} />
                        </Button>
                        <span className={styles['description-button']}>Loa</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <PlusOutlined style={{ fontSize: 20 }} />
                        </Button>
                        <span className={styles['description-button']}>Im lặng</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faVideo} />
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              ) : (
                ''
              )}
              {currentStepTestDial === 1 ? (
                <div className={styles['iphone']}>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        paddingLeft: 30,
                        marginTop: 100,
                      }}
                    >
                      <Row>
                        <PlusOutlined
                          style={{ fontSize: 12, marginRight: 20, color: '#007AFF', lineHeight: 2 }}
                        />
                        <Typography.Text className={styles['phone-number-text']}>
                          {formData.phoneNumberCall}
                        </Typography.Text>
                        <Icon
                          component={IconRemove}
                          style={{
                            fontSize: 12,
                            marginLeft: 'auto',
                            marginRight: 20,
                            lineHeight: 2,
                          }}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <button className={styles['iphone-number']}>
                        <label>1 </label>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>2 </label>
                        <span>ABC</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>3 </label>
                        <span> DFE</span>
                      </button>
                    </Col>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <button className={styles['iphone-number']}>
                        <label>4 </label>
                        <span> GHI</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>5 </label>
                        <span> JKL</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>6 </label>
                        <span> MNO</span>
                      </button>
                    </Col>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <button className={styles['iphone-number']}>
                        <label>7 </label>
                        <span> PQRS</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>8 </label>
                        <span>TUV</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>9 </label>
                        <span>WXYZ</span>
                      </button>
                    </Col>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <button className={styles['iphone-number']}>
                        <label>* </label>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label>0</label>
                        <span>+</span>
                      </button>
                      <button className={styles['iphone-number']}>
                        <label># </label>
                      </button>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <Button className={styles['iphone-number-call']} type="primary">
                        <FontAwesomeIcon size="lg" icon={faPhoneAlt} />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ) : (
                ''
              )}

              {currentStepTestDial === 2 ? (
                <div className={styles['iphone-on-call']}>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        textAlign: 'center',
                        display: 'grid',
                        marginTop: 100,
                      }}
                    >
                      <Typography.Text className={styles['phone-number-text']}>
                        {formData.phoneNumberCall}
                      </Typography.Text>
                      <Typography.Text className={styles['phone-number-text-description']}>
                        Đang gọi ...
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 100,
                        flex: 0,
                      }}
                    >
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <AudioMutedOutlined style={{ fontSize: 20 }} />
                        </Button>
                        <span className={styles['description-button']}>Im lặng</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faEllipsisV} />
                          <FontAwesomeIcon size="lg" icon={faEllipsisV} />
                          <FontAwesomeIcon size="lg" icon={faEllipsisV} />
                        </Button>
                        <span className={styles['description-button']}>Bàn phím</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faVolumeUp} />
                        </Button>
                        <span className={styles['description-button']}>Loa</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <PlusOutlined style={{ fontSize: 20 }} />
                        </Button>
                        <span className={styles['description-button']}>Im lặng</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faVideo} />
                        </Button>
                        <span className={styles['description-button']}>Bàn phím</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faVolumeUp} />
                        </Button>
                        <span className={styles['description-button']}>Loa</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <Button className={styles['iphone-number-calling']} type="primary" danger>
                        <FontAwesomeIcon size="lg" icon={faPhoneAlt} transform={{ rotate: 135 }} />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ) : (
                ''
              )}
              {currentStepTestDial === 3 ? (
                <div className={styles['iphone-on-call']}>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        textAlign: 'center',
                        display: 'grid',
                        marginTop: 100,
                      }}
                    >
                      <Typography.Text className={styles['phone-number-text']}>
                        {formData.phoneNumberCall}
                      </Typography.Text>
                      <Typography.Text className={styles['phone-number-text-description']}>
                        <Timer
                          initialTime={0}
                          startImmediately={true}
                          formatValue={(value) => `${value < 10 ? `0${value}` : value} `}
                        >
                          <React.Fragment>
                            <Timer.Hours /> :
                            <Timer.Minutes /> :
                            <Timer.Seconds />
                          </React.Fragment>
                        </Timer>
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 100,
                        flex: 0,
                      }}
                    >
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <AudioMutedOutlined style={{ fontSize: 20 }} />
                        </Button>
                        <span className={styles['description-button']}>Im lặng</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faEllipsisV} />
                          <FontAwesomeIcon size="lg" icon={faEllipsisV} />
                          <FontAwesomeIcon size="lg" icon={faEllipsisV} />
                        </Button>
                        <span className={styles['description-button']}>Bàn phím</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faVolumeUp} />
                        </Button>
                        <span className={styles['description-button']}>Loa</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <PlusOutlined style={{ fontSize: 20 }} />
                        </Button>
                        <span className={styles['description-button']}>Im lặng</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faVideo} />
                        </Button>
                        <span className={styles['description-button']}>Bàn phím</span>
                      </div>
                      <div className={styles['margin-button']}>
                        <Button className={styles['iphone-number-calling']} type="primary">
                          <FontAwesomeIcon size="lg" icon={faVolumeUp} />
                        </Button>
                        <span className={styles['description-button']}>Loa</span>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        display: 'inline-flex',
                        marginTop: 20,
                        flex: 0,
                      }}
                    >
                      <Button className={styles['iphone-number-calling']} type="primary" danger>
                        <FontAwesomeIcon size="lg" icon={faPhoneAlt} transform={{ rotate: 135 }} />
                      </Button>
                    </Col>
                  </Row>
                </div>
              ) : (
                ''
              )}
              {currentStepTestDial === 4 ? (
                <div className={styles['iphone-on-call']}>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        textAlign: 'center',
                        display: 'grid',
                        marginTop: 100,
                      }}
                    >
                      <Typography.Text className={styles['phone-number-text']}>
                        {formData.phoneNumberCall}
                      </Typography.Text>
                      <Typography.Text className={styles['phone-number-text-description']}>
                        Điện thoại cúp máy
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 330 }}>
                    <div style={{ marginLeft: '20%', display: 'inline-grid', textAlign: 'center' }}>
                      <Button className={styles['iphone-number-calling']} type="primary">
                        <FontAwesomeIcon size="lg" icon={faTimes} transform={{ rotate: 135 }} />
                      </Button>
                      <span className={styles['description-button']}>Hủy</span>
                    </div>
                    <div
                      style={{
                        marginLeft: 'auto',
                        marginRight: '20%',
                        display: 'inline-grid',
                        textAlign: 'center',
                      }}
                    >
                      <Button className={styles['iphone-number-call']} type="primary">
                        <FontAwesomeIcon size="lg" icon={faPhoneAlt} />
                      </Button>
                      <span className={styles['description-button']}>Gọi lại</span>
                    </div>
                  </Row>
                </div>
              ) : (
                ''
              )}
              {currentStepTestDial === 5 ? (
                <div className={styles['iphone-on-call']}>
                  <Row>
                    <Col
                      span={16}
                      style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        textAlign: 'center',
                        display: 'grid',
                        marginTop: 100,
                      }}
                    >
                      <Typography.Text className={styles['phone-number-text']}>
                        {formData.phoneNumberCall}
                      </Typography.Text>
                      <Typography.Text className={styles['phone-number-text-description']}>
                        Không trả lời
                      </Typography.Text>
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 330 }}>
                    <div style={{ marginLeft: '20%', display: 'inline-grid', textAlign: 'center' }}>
                      <Button className={styles['iphone-number-calling']} type="primary">
                        <FontAwesomeIcon size="lg" icon={faTimes} transform={{ rotate: 135 }} />
                      </Button>
                      <span className={styles['description-button']}>Hủy</span>
                    </div>
                    <div
                      style={{
                        marginLeft: 'auto',
                        marginRight: '20%',
                        display: 'inline-grid',
                        textAlign: 'center',
                      }}
                    >
                      <Button className={styles['iphone-number-call']} type="primary">
                        <FontAwesomeIcon size="lg" icon={faPhoneAlt} />
                      </Button>
                      <span className={styles['description-button']}>Gọi lại</span>
                    </div>
                  </Row>
                </div>
              ) : (
                ''
              )}
            </Col>
          </Row>
        ) : (
          ''
        )}
      </Col>
    </Row>
  );
}
function CreatePurePhone({ formData, getValues, inputRef, handleTestCall }) {
  const handleClickNumber = (value) => {
    if (formData && formData.phoneNumberCall) {
      formData.phoneNumberCall = formData.phoneNumberCall + value;
      getValues(formData);
    } else {
      getValues({
        phoneNumberCall: value,
      });
    }
    if (inputRef && inputRef.current) {
      inputRef.current.focus({
        cursor: 'end',
      });
    }
  };
  const handleClickRemove = () => {
    formData.phoneNumberCall = formData.phoneNumberCall.slice(0, -1);
    getValues(formData);
  };
  return (
    <div className={styles['iphone']}>
      {formData && formData.phoneNumberCall ? (
        <Row>
          <Col
            style
            span={16}
            style={{ marginLeft: 'auto', marginRight: 'auto', paddingLeft: 30, marginTop: 100 }}
          >
            <Row>
              <Input
                suffix={
                  <Icon
                    component={IconRemove}
                    style={{ fontSize: 12, marginLeft: 'auto', marginRight: 20, lineHeight: 2 }}
                    onClick={() => handleClickRemove()}
                  />
                }
                prefix={
                  <PlusOutlined
                    style={{ fontSize: 12, marginRight: 20, color: '#007AFF', lineHeight: 2 }}
                  />
                }
                ref={inputRef}
                value={formData && formData.phoneNumberCall ? formData.phoneNumberCall : null}
                className={styles['phone-number-text']}
              ></Input>
            </Row>
          </Col>
        </Row>
      ) : null}

      <Row>
        <Col
          style
          span={16}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'inline-flex',
            marginTop: formData && formData.phoneNumberCall ? 20 : 150,
            flex: 0,
          }}
        >
          <button onClick={() => handleClickNumber('1')} className={styles['iphone-number']}>
            <label>1 </label>
          </button>
          <button onClick={() => handleClickNumber('2')} className={styles['iphone-number']}>
            <label>2 </label>
            <span>ABC</span>
          </button>
          <button onClick={() => handleClickNumber('3')} className={styles['iphone-number']}>
            <label>3 </label>
            <span> DFE</span>
          </button>
        </Col>
        <Col
          style
          span={16}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'inline-flex',
            marginTop: 20,
            flex: 0,
          }}
        >
          <button onClick={() => handleClickNumber('4')} className={styles['iphone-number']}>
            <label>4 </label>
            <span> GHI</span>
          </button>
          <button onClick={() => handleClickNumber('5')} className={styles['iphone-number']}>
            <label>5 </label>
            <span> JKL</span>
          </button>
          <button onClick={() => handleClickNumber('6')} className={styles['iphone-number']}>
            <label>6 </label>
            <span> MNO</span>
          </button>
        </Col>
        <Col
          style
          span={16}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'inline-flex',
            marginTop: 20,
            flex: 0,
          }}
        >
          <button onClick={() => handleClickNumber('7')} className={styles['iphone-number']}>
            <label>7 </label>
            <span> PQRS</span>
          </button>
          <button onClick={() => handleClickNumber('8')} className={styles['iphone-number']}>
            <label>8 </label>
            <span>TUV</span>
          </button>
          <button onClick={() => handleClickNumber('9')} className={styles['iphone-number']}>
            <label>9 </label>
            <span>WXYZ</span>
          </button>
        </Col>
        <Col
          style
          span={16}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'inline-flex',
            marginTop: 20,
            flex: 0,
          }}
        >
          <button onClick={() => handleClickNumber('*')} className={styles['iphone-number']}>
            <label>* </label>
          </button>
          <button onClick={() => handleClickNumber('0')} className={styles['iphone-number']}>
            <label>0</label>
            <span>+</span>
          </button>
          <button onClick={() => handleClickNumber('#')} className={styles['iphone-number']}>
            <label># </label>
          </button>
        </Col>
      </Row>
      <Row>
        <Col
          style
          span={16}
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'inline-flex',
            marginTop: 20,
            flex: 0,
          }}
        >
          <Button onClick={handleTestCall} className={styles['iphone-number-call']} type="primary">
            <FontAwesomeIcon size="lg" icon={faPhoneAlt} />
          </Button>
        </Col>
      </Row>
    </div>
  );
}

function InfoCustomer() {
  const [isLocalChecked, setLocalCheck] = useState(null);
  const localInputRef = useRef();
  const publicInputRef = useRef();
  // console.log(localInputRef)
  return (
    <Fragment>
      <div className={styles['header-form']}>
        <Typography.Title level={4}>
          <FormattedMessage
            id="pages.config.info.customer.heading"
            defaultMessage="Thiết lập lưu trữ thông tin khách hàng"
          />
        </Typography.Title>
        <Typography.Paragraph className={styles['paragraph-form']}>
          <FormattedMessage
            id="pages.config.info.customer.heading2"
            defaultMessage="Hệ thông cho phép người dùng thiết lập một profile để quản lý dữ liệu liên quan đến nghiệp
            vụ Voicebot bao gồm thiết lâp, cấu hình Voicebot, chiến dich..."
          />
        </Typography.Paragraph>
        <Typography.Paragraph className={styles['paragraph-form']}>
          <FormattedMessage
            id="pages.config.info.customer.heading3"
            defaultMessage="Hành động này không thể thu hồi"
          />
        </Typography.Paragraph>
      </div>
      <Form.Item label="Profile URL https://">
        <Form.Item
          noStyle
          name="profileUrl"
          rules={[{ required: true, message: 'Profile URL is required' }]}
        >
          <Input style={{ width: 200, marginRight: 5 }} />
        </Form.Item>
        {/* <span style={{ color: '#000' }}>.omni.com/connect/home</span> */}
      </Form.Item>
      <Form.Item
        name="ipLocal"
        label={
          <Radio
            checked={isLocalChecked === 0}
            value={0}
            onChange={() => {
              // reset field
              publicInputRef.current.handleReset('');
              localInputRef.current.select();
              setLocalCheck(0);
            }}
          >
            <span style={{ color: '#000' }}>
              <FormattedMessage
                id="pages.config.info.customer.local.ip"
                defaultMessage="Nhập Local IP"
              />
            </span>
          </Radio>
        }
      >
        <Input
          allowClear
          style={{ width: 200, marginRight: 5 }}
          // ref={(node) => {
          //   localInputRef = node;
          // }}
          ref={localInputRef}
          onSelect={() => {
            // reset field public
            if (publicInputRef.current.state.value) {
              publicInputRef.current.handleReset('');
              localInputRef.current.select();
            }
            setLocalCheck(0);
          }}
        />
      </Form.Item>

      <Form.Item
        label={
          <Radio
            checked={isLocalChecked === 1}
            value={1}
            onChange={(e) => {
              // reset field
              localInputRef.current.handleReset('');
              publicInputRef.current.select();
              setLocalCheck(1);
            }}
          >
            <span style={{ color: '#000' }}>
              <FormattedMessage
                id="pages.config.info.customer.public.ip"
                defaultMessage="Nhập Public IP"
              />
            </span>
          </Radio>
        }
        name="isPublic"
      >
        <Input
          allowClear
          style={{ width: 200, marginRight: 5 }}
          ref={publicInputRef}
          onSelect={() => {
            // reset field local
            if (localInputRef.current.state.value) {
              localInputRef.current.handleReset('');
              publicInputRef.current.select();
            }
            setLocalCheck(1);
          }}
        />
      </Form.Item>
      {isLocalChecked === 1 ? (
        <Form.Item
          label={<span style={{ color: '#000' }}>Nhập domain </span>}
          name="isPublicDomain"
        >
          <Input allowClear style={{ width: 200, marginRight: 5 }} />
        </Form.Item>
      ) : null}
    </Fragment>
  );
}

function CreateAdmin() {
  const [isAddAdmin, setAddAdmin] = useState(false);

  return (
    <Fragment>
      <div className={styles['header-form']} style={{ marginBottom: '2rem' }}>
        <Typography.Title level={4}>
          <FormattedMessage id="pages.config.create.admin.title" defaultMessage="Tạo Admin" />
        </Typography.Title>
        <Typography.Paragraph className={styles['paragraph-form']}>
          <FormattedMessage
            id="pages.config.create.admin.heading"
            defaultMessage="Thiết lập admin để nắm quyền truy cập và quản trị profile Voicebot, quyền này có thể áp
          dụng cho chính bạn hoặc người dùng khác. Có thể thêm người dùng và quản lý quyền sau đó."
          />
        </Typography.Paragraph>
        <Typography.Paragraph className={styles['paragraph-form']}>
          <PlusCircleOutlined />
          <span>
            <FormattedMessage
              id="pages.config.create.admin.heading2"
              defaultMessage="Liên kết tới tài khoản đã tồn tại"
            />
          </span>
        </Typography.Paragraph>
        <Checkbox checked={isAddAdmin} onChange={() => setAddAdmin(!isAddAdmin)}>
          <FormattedMessage id="pages.config.create.admin.add" defaultMessage="Thêm admin" />
        </Checkbox>
      </div>
      {isAddAdmin && (
        <Fragment>
          {/* <Form.Item name="firstName" label="Họ">
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Tên">
            <Input />
          </Form.Item> */}
          <Form.Item
            name="lastName"
            label={<FormattedMessage id="pages.config.create.admin.lastname" defaultMessage="Họ" />}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="firstName"
            label={
              <FormattedMessage id="pages.config.create.admin.firstname" defaultMessage="Tên" />
            }
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label={
              <FormattedMessage
                id="pages.config.create.admin.username"
                defaultMessage="Tên người dùng"
              />
            }
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label={
              <FormattedMessage id="pages.config.create.admin.password" defaultMessage="Mật khẩu" />
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label={
              <FormattedMessage
                id="pages.config.create.admin.password.confirm"
                defaultMessage="Nhập lại mật khẩu"
              />
            }
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error('The two passwords that you entered do not match!'),
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Fragment>
      )}
    </Fragment>
  );
}

function CreateService() {
  return (
    <Fragment>
      <div className={styles['header-form']} style={{ marginBottom: '2rem' }}>
        <Typography.Title level={4}>
          <FormattedMessage
            id="pages.config.create.service.heading"
            defaultMessage="Thiết lập sử dụng dịch vụ"
          />
        </Typography.Title>
        <Typography.Paragraph className={styles['paragraph-form']}>
          <FormattedMessage
            id="pages.config.create.service.heading2"
            defaultMessage="Thiết lập dịch vụ mà bạn muốn sử dụng trên sản phẩm của mình"
          />
        </Typography.Paragraph>
      </div>
      <div style={{ marginLeft: '6em' }}>
        <Form.Item
          name="isIncomingCall"
          label={
            <Typography.Text>
              <FormattedMessage
                id="pages.config.create.service.field1"
                defaultMessage="Cuộc gọi tới"
              />
            </Typography.Text>
          }
          valuePropName="checked"
        >
          <Checkbox>
            <FormattedMessage
              id="pages.config.create.service.textbox1"
              defaultMessage="Tôi có nhu cầu sử dụng cuộc gọi đến với Smart Contact Center"
            />
          </Checkbox>
        </Form.Item>
        <Form.Item
          name="isOutcomingCall"
          valuePropName="checked"
          label={
            <Typography.Text>
              <FormattedMessage
                id="pages.config.create.service.field2"
                defaultMessage="Cuộc gọi đi"
              />
            </Typography.Text>
          }
        >
          <Checkbox>
            <FormattedMessage
              id="pages.config.create.service.textbox2"
              defaultMessage="Tôi có nhu cầu sử dụng cuộc gọi đi với Smart Contact Center"
            />
          </Checkbox>
        </Form.Item>
      </div>
    </Fragment>
  );
}

function CreatePhoneFirst({ sipProfile }) {
  const [isPhoneFirst, setIsPhoneFirst] = useState(false);
  const [plusPhoneFirst, setPlusPhoneFirst] = useState(false);
  const [notPhoneFirst, setNotPhoneFirst] = useState(false);
  const handleIsPhoneFirst = (value) => {
    setIsPhoneFirst(!isPhoneFirst);
    if (notPhoneFirst === true) {
      setNotPhoneFirst(false);
      setPlusPhoneFirst(false);
    }
  };
  const handlePlusPhoneFirst = () => {
    setPlusPhoneFirst(!plusPhoneFirst);
  };
  const handleNotPhoneFirst = useCallback(() => {
    setNotPhoneFirst(!notPhoneFirst);
    if (isPhoneFirst) {
      setIsPhoneFirst(false);
      setPlusPhoneFirst(false);
    }
  }, [isPhoneFirst, notPhoneFirst]);
  return (
    <Fragment>
      <div className={styles['header-form']} style={{ marginBottom: '2rem' }}>
        <Typography.Title level={4}>
          <FormattedMessage
            id="pages.config.create.phone.first.heading"
            defaultMessage="Tạo đầu số"
          />
        </Typography.Title>
      </div>
      <div style={{ marginLeft: '6em' }}>
        <Form.Item name="isPhoneExistTrue">
          <Radio checked={isPhoneFirst} onClick={handleIsPhoneFirst} value={isPhoneFirst}>
            <span style={{ color: '#000', fontSize: '18px' }}>
              <FormattedMessage
                id="pages.config.create.phone.first.box1"
                defaultMessage="Đã có đầu số"
              />
            </span>
          </Radio>
        </Form.Item>
        {isPhoneFirst ? (
          <div style={{ paddingLeft: '2em' }}>
            <Row>
              <Col span={4}>
                {' '}
                <span style={{ color: '#282828', fontSize: '18px' }}>
                  <FormattedMessage
                    id="pages.config.create.phone.first.prefix.phone"
                    defaultMessage="Đầu số"
                  />
                </span>
              </Col>
              <Col span={16}>
                <Form.Item name="phoneFirst">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row style={{ marginBottom: '1em' }}>
              <Col span={24}>
                <span style={{ color: '#282828', fontSize: '18px' }}>
                  <FormattedMessage
                    id="pages.config.create.phone.first.gateway"
                    defaultMessage="Cấu hình gateway"
                  />
                </span>
              </Col>
              <div style={{ paddingLeft: '3em' }}>
                <Col span={24} style={{ marginBottom: '1em' }}>
                  <Form.Item name="setting">
                    <Radio.Group>
                      <Radio value="trunk">
                        <FormattedMessage
                          id="pages.config.create.phone.first.trunk"
                          defaultMessage="Trunk"
                        />
                      </Radio>
                      <Radio value="acc">
                        <FormattedMessage
                          id="pages.config.create.phone.first.sip"
                          defaultMessage="SIP Register"
                        />
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                {/* <Col span={24} style={{ marginBottom: '1em' }}>
                <Form.Item name="sip_register">
                  <Radio>
                    <span style={{ color: '#000' }}>SIP Register</span>
                  </Radio>
                </Form.Item>
              </Col> */}
              </div>
            </Row>
            <Row style={{ marginBottom: '1em' }}>
              <Col span={24}>
                <span style={{ color: '#282828', fontSize: '18px' }}>
                  <FormattedMessage
                    id="pages.config.create.phone.first.trunk.config"
                    defaultMessage="Cấu hình trunk"
                  />
                </span>
              </Col>
              <Col span={24} style={{ paddingLeft: '3em' }}>
                <Row>
                  <Col span={4}>
                    {' '}
                    <span style={{ color: '#282828' }}>
                      <FormattedMessage
                        id="pages.config.create.phone.first.ip.hostname"
                        defaultMessage="IP/Hostname"
                      />
                    </span>
                  </Col>
                  <Col span={16}>
                    <Form.Item name="gatewayHostname">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    {' '}
                    <span style={{ color: '#282828' }}>
                      <FormattedMessage
                        id="pages.config.create.phone.first.port"
                        defaultMessage="Port"
                      />
                    </span>
                  </Col>
                  <Col span={16}>
                    <Form.Item name="gatewayPort">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    {' '}
                    <span style={{ color: '#282828' }}>
                      <FormattedMessage
                        id="pages.config.create.phone.first.transport"
                        defaultMessage="Transport"
                      />
                    </span>
                  </Col>
                  <Col span={16}>
                    <Form.Item name="gatewayTransport">
                      <Select style={{ width: '100%' }}>
                        <Option value={'TCP'}>
                          <FormattedMessage
                            id="pages.config.create.phone.first.tcp"
                            defaultMessage="TCP"
                          />
                        </Option>
                        <Option value={'UDP'}>
                          <FormattedMessage
                            id="pages.config.create.phone.first.udp"
                            defaultMessage="UDP"
                          />
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        ) : (
          ''
        )}

        <Form.Item name="isPhoneExistFalse">
          <Radio checked={notPhoneFirst} onClick={handleNotPhoneFirst} value={notPhoneFirst}>
            <span style={{ color: '#000', fontSize: '18px' }}>
              <FormattedMessage
                id="pages.config.create.phone.first.box2"
                defaultMessage="Chưa có đầu số"
              />
            </span>
          </Radio>
        </Form.Item>
        {notPhoneFirst ? (
          <>
            <Row>
              <Col span={10} style={{ paddingLeft: '2em' }}>
                <Form.Item name="phoneNumber">
                  <Select size="small" style={{ width: '100%' }}>
                    {sipProfile?.map(
                      (item) =>
                        item.from_user && (
                          <Option value={`${item.from_user}/${item.gateway_uuid}`}>
                            {item.from_user}
                          </Option>
                        ),
                    )}
                  </Select>
                </Form.Item>
                <span>
                  <FormattedMessage id="pages.config.phone.number" defaultMessage="Số điện thoại" />
                </span>
              </Col>
            </Row>
          </>
        ) : (
          ''
        )}
      </div>
    </Fragment>
  );
}

function TestDial({ getValues, Step, handleTestCall, formData }) {
  return (
    <Fragment>
      <div className={styles['header-form']} style={{ marginBottom: '2rem' }}>
        <Typography.Title level={4}>
          <FormattedMessage id="pages.config.test.dial.heading" defaultMessage="Test Dial" />
        </Typography.Title>
        <Typography.Paragraph>
          <FormattedMessage
            id="pages.config.test.dial.heading2"
            defaultMessage="Make a test call of voicebot with the number +84 123456789 to a customer phone number.You can enter your phone number to experience the call test."
          />
        </Typography.Paragraph>
      </div>
      <div className={styles['header-form']} style={{ marginBottom: '2rem' }}>
        <Row style={{ width: '100%' }}>
          <Col span={6}>
            <Typography.Text strong style={{ fontSize: 16 }}>
              <FormattedMessage id="pages.config.phone.number" defaultMessage="Số điện thoại" />
            </Typography.Text>
          </Col>
          <Col span={14}>
            {/* <Form.Item
              name='phoneNumberCall'
              style={{ width: '100%' }}
              rules={[
                {
                  required: true,
                  message: 'Please enter phone number!',
                }]}> */}
            <Input
              type="tel"
              style={{ width: '40%' }}
              placeholder="+84900000000"
              value={formData && formData.phoneNumberCall ? formData.phoneNumberCall : null}
              onChange={(e) => {
                formData.phoneNumberCall = e.target.value;
                getValues(formData);
              }}
            />
            {/* </Form.Item> */}
          </Col>
          {formData && formData.phoneNumberCall ? (
            <Col span={2}>
              <Button onClick={handleTestCall} className={styles.btnCall}>
                Gọi
              </Button>
            </Col>
          ) : null}
        </Row>
      </div>
    </Fragment>
  );
}
