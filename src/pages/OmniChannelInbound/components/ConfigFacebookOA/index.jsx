import React, { useEffect, useState, useRef } from 'react';
import PT from 'prop-types';
import { Row, Col, Typography, Button, Form, Input, Image, message, Card } from 'antd';
import style from './style.less';
import {
  requestGetFacebookSetting,
  requestConfigFacebookSetting,
  requestGetFacebookInfo,
  requestUpdateConfigSetting,
} from '../../service';
import { CopyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

ConfigFacebookOA.propTypes = {
  headers: PT.instanceOf(Object).isRequired,
  handleClickBack: PT.func.isRequired,
};

function ConfigFacebookOA(props) {
  const { handleClickBack, headers } = props;
  const [pageName, setPageName] = useState('');
  const [pageImage, setPageImage] = useState({});
  const [form] = Form.useForm();
  const [isChangeToken, setIsChangeToken] = useState(false);
  const textAreaRef = useRef(null);
  const [facebookID, setFacebookID] = useState(null);
  useEffect(() => {
    getFacebookSetting();
  }, []);

  const getFacebookSetting = () => {
    requestGetFacebookSetting(headers).then((res) => {
      if (res?.data && res?.data?.length > 0) {
        form.setFieldsValue({
          facebook_webhook_income: res.facebook_webhook_income,
          facebook_webhook_token: res.facebook_webhook_token,
          facebook_page_token: res.data[0]?.facebook_page_token,
        });
        setFacebookID(res.data[0]?.facebook_page_id);
        setPageName(res.data[0]?.facebook_page_name);
        setPageImage(res.data[0]?.facebook_page_picture.data);
      }
    });
  };

  const onFinish = async (values) => {
    // return console.log(values)
    requestConfigFacebookSetting(headers, {
      facebook_page_token: values.facebook_page_token,
    }).then((res) => {
      if (res.status) {
        setPageName(res.name);
        setPageImage(res.picture.data);
        message.success('Cập nhật config facebook thành công');
        return handleClickBack();
      }
      return message.error('Cập nhật config facebook thất bại');
    });
  };

  // const onConnect = async (values) => {
  //   const { facebook_page_id } = form.getFieldValue()
  //   // return console.log(facebook_page_id)
  //   requestGetFacebookInfo(headers, facebook_page_id).then(res => {
  //     if (res?.facebook_page_picture) {
  //       setPageName(res.facebook_page_name)
  //       setPageImage(res.facebook_page_picture.data)
  //       return message.success('Lấy thông tin page thành công')
  //     }
  //     return message.error('Lấy thông tin page thất bại')
  //   })
  // }

  const onChangeWebtoken = async (values) => {
    const { facebook_webhook_token } = form.getFieldValue();
    // return console.log(facebook_page_id)
    requestUpdateConfigSetting(headers, { facebook_webhook_token }).then((res) => {
      if (res?.status) {
        getFacebookSetting();
        return message.success('Cập nhật token thành công');
      }
      return message.error('Cập nhật token thất bại');
    });
  };

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    e.target.focus();
    message.info('Copied');
  }

  const layoutInput = {
    labelCol: {
      xxl: { span: 5, offset: 5 },
      xl: { span: 6, offset: 4 },
      lg: { span: 8, offset: 4 },
      md: { span: 24, offset: 5 },
      sm: { span: 24, offset: 5 },
      xs: { span: 24, offset: 5 },
    },
    wrapperCol: {
      xxl: { span: 17, offset: 0 },
      xl: { span: 16, offset: 1 },
      lg: { span: 15, offset: 1 },
      md: { span: 24, offset: 5 },
      sm: { span: 24, offset: 5 },
      xs: { span: 24, offset: 5 },
    },
  };

  return (
    <>
      <Form form={form} onFinish={onFinish}>
        <Row>
          <Col span={17}>
            <Form.Item label=" " colon={false} labelAlign="right" {...layoutInput}>
              <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>
                Bạn hãy copy Webhook URL để khai báo cấu hình trên Facebook
              </span>
            </Form.Item>
          </Col>
        </Row>
        {/* <Form.Item
          label="Webhook URL"
          labelAlign="left"
          {...layoutInput}
        >
          <Input />
          <Button type="primary" style={{ marginLeft: '20px' }}>
            Sao chép
          </Button>
        </Form.Item> */}
        <Row>
          <Col span={17}>
            <Form.Item
              label="Webhook URL"
              labelAlign="right"
              {...layoutInput}
              name="facebook_webhook_income"
            >
              <Input ref={textAreaRef} suffix={<CopyOutlined onClick={copyToClipboard} />} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={17}>
            <Form.Item
              {...layoutInput}
              name="facebook_webhook_token"
              label="Facebook Webhook Token"
              labelAlign="right"
            >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={5}>
            {/* <Button type="primary" style={{ marginLeft: '20px' }} onClick={onChangeWebtoken}>
              Thay đổi
          </Button> */}
          </Col>
        </Row>
        <Row>
          <Col span={17}>
            <Form.Item
              {...layoutInput}
              name="facebook_page_token"
              label="Facebook Page Token"
              labelAlign="right"
            >
              <Input />
            </Form.Item>
          </Col>

          {/* <Col span={5}>
            <Button onClick={onConnect} type="primary" style={{ marginLeft: '20px', width: '85px' }}>
              Kết nối
          </Button>
          </Col> */}
        </Row>
        <Row>
          <Col span={17}>
            <Form.Item label=" " colon={false} labelAlign="right" {...layoutInput}>
              <Card title={`Xác nhận ${pageImage.url && pageName ? '' : 'không'} kết nối page`}>
                <div className={style.pageWrapper}>
                  <div className={style.page}>
                    <div className={style.image}>
                      <Image
                        width={pageImage.width}
                        height={pageImage.height}
                        src={pageImage.url}
                      />
                    </div>
                    <div className={style.content}>
                      <div className={style.name}>
                        <span>{pageName}</span>
                      </div>
                      <div className={style.url}>
                        <span>{`https://facebook.com/${facebookID}`}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={17}>
            <Form.Item label=" " colon={false} labelAlign="right" {...layoutInput}>
              {/* <Button
                style={{ background: '#fff', color: '#2f7cba', marginRight: '10px' }}
                onClick={handleClickBack}
              >
                Quay lại
              </Button> */}
              <Button style={{ background: '#fff', color: '#2f7cba', marginRight: '10px' }}>
                Kiểm tra
              </Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default ConfigFacebookOA;
