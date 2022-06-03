import React, { useEffect, useRef, useState } from 'react';
import PT from 'prop-types';
import { Row, Col, Typography, Button, Form, Input, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { requestGetZaloSetting, requestConfigZaloSetting } from '../../service';

const { Title, Paragraph } = Typography;

ConfigZaloOA.propTypes = {
  headers: PT.instanceOf(Object).isRequired,
  handleClickBack: PT.func.isRequired,
};

function ConfigZaloOA(props) {
  const { handleClickBack, headers } = props;
  const [form] = Form.useForm();
  const textAreaRef = useRef(null);
  const [isChangeToken, setIsChangeToken] = useState(false);

  useEffect(() => {
    requestGetZaloSetting(headers).then((res) => {
      if (res) {
        form.setFieldsValue({
          zalo_oa_token: res.zalo_oa_token,
          zalo_oa_id: res.zalo_oa_id,
        });
      }
    });
  }, []);

  const layoutInput = {
    labelCol: {
      xxl: { span: 4, offset: 5 },
      xl: { span: 5, offset: 5 },
      lg: { span: 6, offset: 5 },
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

  const onFinish = async (values) => {
    // return console.log(values)
    requestConfigZaloSetting(headers, values).then((res) => {
      if (res.status) {
        message.success('Cập nhật config zalo thành công');
        return handleClickBack();
      }
      return message.error('Cập nhật config zalo thất bại');
    });
  };

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    // setCopySuccess('Copied!');
    message.info('Copied');
  }

  return (
    <>
      <Form form={form} onFinish={onFinish}>
        <Row>
          <Col span={17}>
            <Form.Item label=" " colon={false} labelAlign="right" {...layoutInput}>
              <span style={{ fontWeight: 'light', fontStyle: 'italic' }}>
                Bạn hãy copy Webhook URL để khai báo cấu hình trên Zalo App
              </span>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={17}>
            <Form.Item label="Webhook URL" labelAlign="right" name="zalo_oa_id" {...layoutInput}>
              <Input ref={textAreaRef} suffix={<CopyOutlined onClick={copyToClipboard} />} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={17}>
            <Form.Item
              name="zalo_oa_token"
              label="Zalo Webhook Token"
              labelAlign="right"
              {...layoutInput}
            >
              <Input />
            </Form.Item>
          </Col>
          {/* <Col span={5}>
            <Button
              type="primary"
              style={{ marginLeft: '20px' }}
              onClick={() => setIsChangeToken(true)}
            >
              Thay đổi
            </Button>
          </Col> */}
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

export default ConfigZaloOA;
