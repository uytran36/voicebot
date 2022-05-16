import React, { useState, useCallback, useEffect, useRef } from 'react';
import { FormattedMessage } from 'umi';
import PT from 'prop-types';
import {
  Row,
  Col,
  Typography,
  Button,
  Form,
  Space,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Upload,
  Rate,
  Checkbox,
  Input,
  ConfigProvider,
  Avatar,
  message,
  Dropdown,
  Popover,
} from 'antd';
import styles from './styles.less';

import Preview from './components/Preview';

import {
  CopyOutlined,
  UploadOutlined,
  UserOutlined,
  CaretDownOutlined,
  CloseOutlined,
  CheckOutlined,
  MoreOutlined,
  PaperClipOutlined,
  PictureOutlined,
  SendOutlined,
} from '@ant-design/icons';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import { requestUpdateConfigLiveChat, requestGetConfigLiveChat } from '../../service';
import api from '@/api';

const { Title, Paragraph } = Typography;

ConfigLiveChat.propTypes = {
  user: PT.shape({
    authToken: PT.string,
    userId: PT.string,
    tokenGateway: PT.string,
  }).isRequired,
  handleClickBack: PT.string.isRequired,
};

function ConfigLiveChat(props) {
  const { handleClickBack, headers } = props;
  const [form] = Form.useForm();
  const [colorLiveChat, setColorLiveChat] = useState({
    titleBackground: '#2f7cba',
    popupAgent: '#2f7cba',
    popupUser: '#f27227',
    textAgent: '#fff',
    textUser: '#fff',
  });
  const [switchAgentConfig, setSwitchAgentConfig] = useState({
    Livechat_interface_avatar_agent_default: true,
    Livechat_show_agent_info: false,
  });
  const [configLiveChat, setConfigLiveChat] = useState({});
  const [openColorPopupAgent, setOpenColorPopupAgent] = useState(false);
  const [openColorTextAgent, setOpenColorTextAgent] = useState(false);
  const [openColorPopupUser, setOpenColorPopupUser] = useState(false);
  const [openColorTextUser, setOpenColorTextUser] = useState(false);
  const [switchRegisterInfo, setSwitchRegisterInfo] = useState(false);
  const [switchBeginChat, setSwitchBeginChat] = useState(false);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const layoutInputTitle = {
    labelCol: {
      xxl: { span: 3 },
      xl: { span: 3 },
      lg: { span: 4 },
      md: { span: 5 },
      sm: { span: 6 },
      xs: { span: 7 },
    },
    wrapperCol: {
      xxl: { span: 12 },
      xl: { span: 9 },
      md: { span: 12 },
      sm: { span: 15 },
      xs: { span: 24 },
    },
  };

  const layoutSwitchAgent = {
    labelCol: {
      xxl: { span: 5, offset: 4 },
      xl: { span: 7, offset: 4 },
      lg: { span: 8, offset: 3 },
      md: { span: 12, offset: 3 },
      sm: { span: 14, offset: 2 },
      xs: { span: 24, offset: 2 },
    },
    wrapperCol: {
      xxl: { span: 9 },
      xl: { span: 9 },
      md: { span: 12 },
      sm: { span: 15 },
      xs: { span: 24, offset: 2 },
    },
  };

  const layoutSwitchDisplayAgent = {
    labelCol: {
      xxl: { span: 12, offset: 4 },
      xl: { span: 15, offset: 4 },
      lg: { span: 24, offset: 3 },
      md: { span: 18, offset: 3 },
      sm: { span: 20, offset: 2 },
      xs: { span: 2, offset: 2 },
    },
    wrapperCol: {
      xxl: { span: 9, offset: 0 },
      xl: { span: 9, offset: 0 },
      lg: { span: 24, offset: 4 },
      md: { span: 24, offset: 4 },
      sm: { span: 24, offset: 3 },
      xs: { span: 24, offset: 3 },
    },
  };

  const layoutBackgroundInterfaceColor = {
    xl: { span: 7, offset: 4 },
    lg: { span: 9, offset: 3 },
    md: { span: 14, offset: 3 },
    sm: { span: 16, offset: 2 },
    xs: { span: 18, offset: 2 },
  };

  const layoutBackgroundInterfaceWidget = {
    xl: { span: 8, offset: 1 },
    lg: { span: 9, offset: 1 },
    md: { span: 14, offset: 3 },
    sm: { span: 16, offset: 2 },
    xs: { span: 18, offset: 2 },
  };

  const layoutToggleTitle = {
    labelCol: {
      xl: { span: 3, offset: 0 },
      md: { span: 3, offset: 0 },
      sm: { span: 3, offset: 2 },
      xs: { span: 2, offset: 2 },
    },
    wrapperCol: {
      xl: { span: 8, offset: 0 },
      md: { span: 6, offset: 4 },
      sm: { span: 24, offset: 3 },
      xs: { span: 24, offset: 3 },
    },
  };

  const layoutRegisterNamePhone = {
    labelCol: {
      xl: { span: 16, offset: 0 },
      md: { span: 18, offset: 0 },
      sm: { span: 20, offset: 2 },
      xs: { span: 2, offset: 2 },
    },
    wrapperCol: {
      xl: { span: 8, offset: 0 },
      md: { span: 6, offset: 4 },
      sm: { span: 24, offset: 3 },
      xs: { span: 24, offset: 3 },
    },
  };

  const layoutRegisterEmailAge = {
    labelCol: {
      xl: { span: 14, offset: 8 },
      md: { span: 18, offset: 7 },
      sm: { span: 20, offset: 2 },
      xs: { span: 2, offset: 2 },
    },
    wrapperCol: {
      xl: { span: 2, offset: 0 },
      md: { span: 2, offset: 10 },
      sm: { span: 24, offset: 3 },
      xs: { span: 24, offset: 3 },
    },
  };

  const layoutButtonStart = {
    labelCol: {
      xl: { span: 6 },
      md: { span: 9 },
      sm: { span: 16 },
      xs: { span: 17, offset: 2 },
    },
    wrapperCol: {
      xl: { span: 2, offset: 0 },
      md: { span: 2, offset: 0 },
      sm: { span: 2, offset: 0 },
      xs: { span: 2, offset: 3 },
    },
  };

  const layoutTextEnd = {
    labelCol: {
      xl: { span: 12, offset: 2 },
      md: { span: 19, offset: 2 },
      sm: { span: 24, offset: 2 },
      xs: { span: 2 },
    },
    wrapperCol: {
      xl: { span: 2, offset: 0 },
      md: { span: 2, offset: 0 },
      sm: { span: 2, offset: 3 },
      xs: { span: 2, offset: 2 },
    },
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  function changeHandler(colors, field) {
    setConfigLiveChat({
      ...configLiveChat,
      [field]: colors.color,
    });
  }

  // const Demo = () => {
  //   const onFinish = (values) => {
  //     console.log('Received values of form: ', values);
  //   };
  // }

  const onFinish = async (values) => {
    try {
      const dataConfig = {
        ...values,
        Livechat_title_color: configLiveChat.Livechat_title_color,
        Livechat_color_popup_agent: configLiveChat.Livechat_color_popup_agent,
        Livechat_color_popup_user: configLiveChat.Livechat_color_popup_user,
        Livechat_color_text_agent: configLiveChat.Livechat_color_text_agent,
        Livechat_color_text_user: configLiveChat.Livechat_color_text_user,
        Livechat_registration_form: configLiveChat.Livechat_registration_form,
        Livechat_conversation_start_greeting: configLiveChat.Livechat_conversation_start_greeting,
        Livechat_registration_form_message: values.Livechat_conversation_start_greeting
          ? values.Livechat_registration_form_message
          : '',
        Livechat_conversation_finished_text: configLiveChat.Livechat_conversation_finished_message
          ? values.Livechat_conversation_finished_text
          : '',
        Livechat_register_info: configLiveChat.Livechat_register_info,
        Livechat_conversation_finished_message: `${configLiveChat.Livechat_conversation_finished_message}`,
        Livechat_age_field_registration_form: configLiveChat.Livechat_age_field_registration_form,
        Livechat_phone_field_registration_form:
          configLiveChat.Livechat_phone_field_registration_form,
        Livechat_email_field_registration_form:
          configLiveChat.Livechat_email_field_registration_form,
        Livechat_name_field_registration_form: configLiveChat.Livechat_name_field_registration_form,
      };
      console.log(dataConfig);
      // delete dataConfig.Livechat_registration_form;
      if (
        configLiveChat.Livechat_conversation_start_greeting &&
        values.Livechat_registration_form_message === ''
      ) {
        return message.warn('Vui lòng nhập lời chào mở đầu');
      }
      if (
        configLiveChat.Livechat_conversation_finished_message &&
        values.Livechat_conversation_finished_text === ''
      ) {
        return message.warn('Vui lòng nhập tin nhắn hoàn thành cuộc trò chuyện');
      }
      const res = await requestUpdateConfigLiveChat(headers, dataConfig);
      if (res && res?.status) {
        message.success('Cập nhật cấu hình thành công');
        return handleClickBack();
      }
      throw new Error('Cập nhật cấu hình thất bại');
    } catch (error) {
      return message.error(error.toString());
    }
  };

  const onChangeSwitchAgent = (valueAvatar, valueInfoAgent) => {
    setSwitchAgentConfig({
      Livechat_interface_avatar_agent_default: valueAvatar,
      Livechat_show_agent_info: valueInfoAgent,
    });
  };

  const getConfigLiveChat = useCallback(() => {
    const listField = [
      'Livechat_register_info', // toggle thong tin dang ky
      'Livechat_age_field_registration_form', // toggle thong tin dang ky tuoi
      'Livechat_email_field_registration_form', // toggle thong tin dang ky email
      'Livechat_name_field_registration_form', // toggle thong tin dang ky ten
      'Livechat_phone_field_registration_form', // toggle thong tin dang ky phone
      'Livechat_show_agent_email', // choose thiet lap thong tin agent
      'Livechat_show_agent_info', // choose hien thi thong tin thuc cua agent
      'Livechat_registration_form_message', // input loi chao mo dau
      'Livechat_registration_form', // toggle phim bat dau
      'Livechat_conversation_start_greeting', // toggle loi chao mo dau
      'Livechat_title_color', // mau nen tieu de preview
      'Livechat_title', // tieu de preview
      'Livechat_color_popup_agent', // mau nen agent
      'Livechat_color_popup_user', // mau nen user
      'Livechat_color_text_agent', // mau chu agent
      'Livechat_color_text_user', // mau chu user
      'Livechat_conversation_finished_message', // toggle tin nhan khi hoan thanh chat
      'Livechat_conversation_finished_text', // nhap text khi hoan thanh chat
    ];
    requestGetConfigLiveChat(headers, listField).then((res) => {
      if (res?.success && res?.settings?.length > 0) {
        const result = Object.fromEntries(res.settings.map((item) => [item._id, item.value]));
        result.Livechat_conversation_finished_message =
          result.Livechat_conversation_finished_message === 'true' && true;
        // result.Livechat_phone_field_registration_form =
        //   result.Livechat_phone_field_registration_form === 'true' && true;
        // result.Livechat_age_field_registration_form =
        //   result.Livechat_age_field_registration_form === 'true' && true;
        // if (result.Livechat_registration_form || result.Livechat_conversation_start_greeting)
        //   setSwitchBeginChat(true);
        // else setSwitchBeginChat(false);

        // if (
        //   result.Livechat_phone_field_registration_form ||
        //   result.Livechat_name_field_registration_form ||
        //   result.Livechat_email_field_registration_form ||
        //   result.Livechat_age_field_registration_form
        // )
        //   setSwitchRegisterInfo(true);
        // else setSwitchRegisterInfo(false);

        form.setFieldsValue(result);
        // setRegisterForm(result.Livechat_register_info)
        return setConfigLiveChat(result);
      }
    });
  }, [form, headers]);

  const handleChange = (e, fieldName) => {
    setConfigLiveChat({
      ...configLiveChat,
      [fieldName]: e?.target?.value || '',
    });
  };

  useEffect(() => {
    getConfigLiveChat();
  }, []);

  // useEffect(() => {
  //   if (
  //     configLiveChat.Livechat_registration_form ||
  //     configLiveChat.Livechat_conversation_start_greeting
  //   )
  //     setSwitchBeginChat(true);
  //   else setSwitchBeginChat(false);
  // }, [
  //   configLiveChat.Livechat_conversation_start_greeting,
  //   configLiveChat.Livechat_registration_form,
  // ]);

  // useEffect(() => {
  //   if (
  //     configLiveChat.Livechat_phone_field_registration_form ||
  //     configLiveChat.Livechat_name_field_registration_form ||
  //     configLiveChat.Livechat_email_field_registration_form ||
  //     configLiveChat.Livechat_age_field_registration_form
  //   )
  //     setSwitchRegisterInfo(true);
  //   else setSwitchRegisterInfo(false);
  // }, [
  //   configLiveChat.Livechat_phone_field_registration_form,
  //   configLiveChat.Livechat_name_field_registration_form,
  //   configLiveChat.Livechat_email_field_registration_form,
  //   configLiveChat.Livechat_age_field_registration_form,
  // ]);

  function copyToClipboard() {
    const copyText = document.getElementById('script').textContent;
    const textArea = document.createElement('textarea');
    textArea.textContent = copyText;
    document.body.append(textArea);
    textArea.select();
    document.execCommand('copy');
    message.info('Copied');
  }

  const script = `
    <!-- Start of Collaboration HUB Livechat Script -->
    <script type="text/javascript">
      (function(w, d, s, u) {
          w.RocketChat = function(c) { w.RocketChat._.push(c) }; w.RocketChat._ = []; w.RocketChat.url = u;
          var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
          j.async = true; j.src = '${api.URL_WIDGET_CHAT_SRC}';
          h.parentNode.insertBefore(j, h);
      })(window, document, 'script', '${api.URL_WIDGET_CHAT_SCRIPT}');
    </script>
  `;

  return (
    <div className={styles.body}>
      <Title style={{ color: '#127ace', fontWeight: '600' }} level={4}>
        Cài đặt
      </Title>
      <Paragraph style={{ fontWeight: 'light' }}>
        Để cài đặt Collaboration.HUB Livechat trong trang web của bạn, hãy sao chép và dán mã này
        vào trang cuối trên trang web của bạn
      </Paragraph>
      <Col span={24} style={{ marginBottom: 40 }}>
        <div className={styles.scriptWrapper}>
          <pre
            id="script"
            style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '3rem' }}
          >
            {script}
            <CopyOutlined
              onClick={copyToClipboard}
              style={{ marginTop: 25, marginRight: 25, fontSize: 17 }}
            />
          </pre>
        </div>
      </Col>

      <Title style={{ color: '#127ace', fontWeight: 'bolder' }} level={4}>
        Cấu hình client side
      </Title>
      <Form
        form={form}
        layout="vertical"
        name="validate_other"
        // {...formItemLayout}
        onFinish={onFinish}
        initialValues={{
          // Livechat_title: configLiveChat.Livechat_title || 'Title chat', // Tieu de
          Livechat_interface_name_agent_default: 'Agent name',
          Livechat_email_field_registration_form: false,
          Livechat_phone_field_registration_form: false,
          Livechat_age_field_registration_form: false,
          Livechat_name_field_registration_form: false,
          Livechat_show_agent_info: !switchAgentConfig.Livechat_interface_avatar_agent_default,
          Livechat_interface_avatar_agent_default:
            `'${switchAgentConfig.Livechat_interface_avatar_agent_default}'` || `avatar agent`,
          Livechat_conversation_start_text: 'start text',
          Livechat_conversation_finished_text: 'finish text',
        }}
      >
        <Col
          // xl={{ offset: 3 }}
          // md={{ offset: 2 }}
          // xs={{ offset: 1 }}
          style={{ marginBottom: '10px', fontWeight: 'bolder', fontSize: '16px' }}
        >
          Khung chat:
        </Col>
        <Form.Item
          name="Livechat_title"
          label="Tiêu đề Livechat"
          rules={[{ required: true, message: 'Please select your favourite colors!' }]}
          labelAlign="left"
          {...layoutInputTitle}
        >
          <Input onChange={(e) => handleChange(e, 'Livechat_title')} />
        </Form.Item>
        <Row gutter={[10, 10]} style={{ marginBottom: 20 }}>
          <Col
            xxl={{ span: 12 }}
            xl={{ span: 12 }}
            lg={{ span: 24 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <div style={{ marginBottom: 15 }}>
              <span style={{ fontWeight: 'bolder', fontSize: '16px' }}>Giao diện</span>
            </div>
            <div style={{ overflowY: 'auto', height: '784px', border: '1px solid #d9d9d9' }}>
              <div className={styles.configWrapper}>
                <Space direction="vertical" size={15} style={{ width: '100%' }}>
                  {/* <Row>
                    <Col span={24}>
                      <span style={{ marginBottom: '10px', fontWeight: 'bolder' }}>
                        Thông tin Agent
                      </span>
                    </Col>
                  </Row> */}
                  {/* <Row>
                    <Col span={23} offset={1}>
                      <Radio.Group value={1} style={{ width: '100%' }}>
                        <Space size={15} direction="vertical" style={{ width: '100%' }}>
                          <Radio value={1}>Thiết lập thông tin đại diện</Radio>
                          <Row>
                            <Col span={23} offset={1}>
                              <div className={styles.avatarWrapper}>
                                <div className={styles.noAvatar}>
                                  <UserOutlined style={{ fontSize: 25, color: '#fff' }} />
                                </div>
                                <Form.Item
                                  style={{ marginBottom: 0 }}
                                  valuePropName="fileList"
                                  getValueFromEvent={normFile}
                                >
                                  <Upload name="logo" action="/upload.do" listType="picture">
                                    <Button style={{ marginBottom: 10 }} icon={<UploadOutlined />}>
                                      Thay ảnh đại diện
                                    </Button>
                                  </Upload>
                                  <span style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
                                    Images should be at least 300 x 300 px in png or jpeg file
                                  </span>
                                </Form.Item>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col span={23} offset={1}>
                              <Form.Item
                                style={{ marginBottom: 0 }}
                                name="Livechat_interface_name_agent_default"
                                label="Tên Agent"
                              >
                                <Input />
                              </Form.Item>
                            </Col>
                          </Row>
                          <Radio value={2}>
                            <div className={styles.radioValue2}>
                              <h3 style={{ fontSize: 14 }}>
                                Cho phép Hiển thị thông tin Agent thực
                              </h3>
                              <h3 style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 12 }}>
                                (Bao gồm thông tin Họ và tên, ảnh đại diện của agent)
                              </h3>
                            </div>
                          </Radio>
                        </Space>
                      </Radio.Group>
                    </Col>
                  </Row> */}
                  <Row>
                    <Col span={24}>
                      <span style={{ marginBottom: '10px', fontWeight: 'bolder' }}>Màu sắc</span>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 15 }}>
                    <Col span={5} offset={1}>
                      <span>Màu nền Visitor</span>
                      <div className={styles.colorPickerWrapper}>
                        <div className={styles.colorPicker}>
                          <div className={styles.boxWrapper}>
                            <div
                              className={`${styles.box} ${styles.defaultBackground1}`}
                              style={{ background: configLiveChat.Livechat_color_popup_agent }}
                            />
                          </div>
                        </div>
                        <div className={styles.select}>
                          <Popover
                            content={
                              <ColorPicker.Panel
                                color={configLiveChat.Livechat_color_popup_agent}
                                style={{ borderRight: '50%' }}
                                onChange={(color) =>
                                  changeHandler(color, 'Livechat_color_popup_agent')
                                }
                                enableAlpha={false}
                              />
                            }
                            placement={'bottom'}
                            trigger="click"
                            visible={openColorPopupAgent}
                            onVisibleChange={(visible) => setOpenColorPopupAgent(visible)}
                          >
                            <CaretDownOutlined />
                          </Popover>
                        </div>
                      </div>
                    </Col>
                    <Col span={5} offset={13}>
                      <span>Màu chữ Visitor</span>
                      <div className={styles.colorPickerWrapper}>
                        <div className={styles.colorPicker}>
                          <div className={styles.boxWrapper}>
                            <div
                              className={`${styles.box} ${styles.defaultBackground2}`}
                              style={{ background: configLiveChat.Livechat_color_text_agent }}
                            />
                          </div>
                        </div>
                        <div className={styles.select}>
                          <Popover
                            content={
                              <ColorPicker.Panel
                                color={configLiveChat.Livechat_color_text_agent}
                                style={{ borderRight: '50%' }}
                                onChange={(color) =>
                                  changeHandler(color, 'Livechat_color_text_agent')
                                }
                                enableAlpha={false}
                              />
                            }
                            placement={'bottom'}
                            trigger="click"
                            visible={openColorTextAgent}
                            onVisibleChange={(visible) => setOpenColorTextAgent(visible)}
                          >
                            <CaretDownOutlined />
                          </Popover>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row style={{ marginBottom: 15 }}>
                    <Col span={5} offset={1}>
                      <span>Màu nền Agent</span>
                      <div className={styles.colorPickerWrapper}>
                        <div className={styles.colorPicker}>
                          <div className={styles.boxWrapper}>
                            <div
                              className={`${styles.box} ${styles.defaultBackground3}`}
                              style={{ background: configLiveChat.Livechat_color_popup_user }}
                            />
                          </div>
                        </div>
                        <div className={styles.select}>
                          <Popover
                            content={
                              <ColorPicker.Panel
                                color={configLiveChat.Livechat_color_popup_user}
                                style={{ borderRight: '50%' }}
                                onChange={(color) =>
                                  changeHandler(color, 'Livechat_color_popup_user')
                                }
                                enableAlpha={false}
                              />
                            }
                            placement={'bottom'}
                            trigger="click"
                            visible={openColorPopupUser}
                            onVisibleChange={(visible) => setOpenColorPopupUser(visible)}
                          >
                            <CaretDownOutlined />
                          </Popover>
                        </div>
                      </div>
                    </Col>
                    <Col span={5} offset={13}>
                      <span>Màu chữ Agent</span>
                      <div className={styles.colorPickerWrapper}>
                        <div className={styles.colorPicker}>
                          <div className={styles.boxWrapper}>
                            <div
                              className={`${styles.box} ${styles.defaultBackground4}`}
                              style={{ background: configLiveChat.Livechat_color_text_user }}
                            />
                          </div>
                        </div>
                        <div className={styles.select}>
                          <Popover
                            content={
                              <ColorPicker.Panel
                                color={configLiveChat.Livechat_color_text_user}
                                style={{ borderRight: '50%' }}
                                onChange={(color) =>
                                  changeHandler(color, 'Livechat_color_text_user')
                                }
                                enableAlpha={false}
                              />
                            }
                            placement={'bottom'}
                            trigger="click"
                            visible={openColorTextUser}
                            onVisibleChange={(visible) => setOpenColorTextUser(visible)}
                          >
                            <CaretDownOutlined />
                          </Popover>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <span style={{ marginBottom: '10px', fontWeight: 'bolder' }}>
                        Tùy chọn nội dung chat
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={9} offset={1}>
                      <span style={{ color: '#127ace' }}>Thông tin đăng ký</span>
                    </Col>
                    <Col span={2} offset={12}>
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={switchRegisterInfo}
                        onChange={() => setSwitchRegisterInfo(!switchRegisterInfo)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={22} offset={2}>
                      <Form.Item
                        label=""
                        name="Livechat_name_field_registration_form"
                        valuePropName="checked"
                        defaultChecked={configLiveChat.Livechat_name_field_registration_form}
                      >
                        <Checkbox
                          disabled={!switchRegisterInfo}
                          onChange={(e) =>
                            setConfigLiveChat({
                              ...configLiveChat,
                              Livechat_name_field_registration_form: e.target.checked,
                            })
                          }
                        >
                          Họ và tên
                        </Checkbox>
                      </Form.Item>
                      <Form.Item
                        label=""
                        name="Livechat_phone_field_registration_form"
                        valuePropName="checked"
                        defaultChecked={configLiveChat.Livechat_phone_field_registration_form}
                      >
                        <Checkbox
                          disabled={!switchRegisterInfo}
                          onChange={(e) =>
                            setConfigLiveChat({
                              ...configLiveChat,
                              Livechat_phone_field_registration_form: e.target.checked,
                            })
                          }
                        >
                          Số điện thoại
                        </Checkbox>
                      </Form.Item>
                      <Form.Item
                        label=""
                        name="Livechat_email_field_registration_form"
                        valuePropName="checked"
                        defaultChecked={configLiveChat.Livechat_email_field_registration_form}
                      >
                        <Checkbox
                          disabled={!switchRegisterInfo}
                          onChange={(e) =>
                            setConfigLiveChat({
                              ...configLiveChat,
                              Livechat_email_field_registration_form: e.target.checked,
                            })
                          }
                        >
                          Email
                        </Checkbox>
                      </Form.Item>
                      {/* <Form.Item
                        label=""
                        name="Livechat_age_field_registration_form"
                        valuePropName="checked"
                        defaultChecked={configLiveChat.Livechat_age_field_registration_form}
                      >
                        <Checkbox
                          disabled={!switchRegisterInfo}
                          onChange={(e) =>
                            setConfigLiveChat({
                              ...configLiveChat,
                              Livechat_age_field_registration_form: e.target.checked,
                            })
                          }
                        >
                          Độ tuổi
                        </Checkbox>
                      </Form.Item> */}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={9} offset={1}>
                      <span style={{ color: '#127ace' }}>Thông tin khi bắt đầu chat</span>
                    </Col>
                    <Col span={2} offset={12}>
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={switchBeginChat}
                        onChange={(checked) => setSwitchBeginChat(checked)}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={22} offset={2}>
                      <Form.Item
                        label=""
                        name="Livechat_registration_form"
                        valuePropName="checked"
                        defaultChecked={configLiveChat.Livechat_registration_form}
                      >
                        <Checkbox
                          disabled={!switchBeginChat}
                          onChange={(e) =>
                            setConfigLiveChat({
                              ...configLiveChat,
                              Livechat_registration_form: e.target.checked,
                            })
                          }
                        >
                          {`Phím "Bắt đầu"`}
                        </Checkbox>
                      </Form.Item>
                      <Form.Item
                        label=""
                        name="Livechat_conversation_start_greeting"
                        valuePropName="checked"
                        defaultChecked={configLiveChat.Livechat_conversation_start_greeting}
                      >
                        <Checkbox
                          disabled={!switchBeginChat}
                          onChange={(e) =>
                            setConfigLiveChat({
                              ...configLiveChat,
                              Livechat_conversation_start_greeting: e.target.checked,
                            })
                          }
                        >
                          Lời chào mở đầu
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  {configLiveChat.Livechat_conversation_start_greeting && (
                    <Row>
                      <Col span={22} offset={2}>
                        <Form.Item name="Livechat_registration_form_message">
                          <Input.TextArea
                            showCount
                            maxLength={100}
                            onChange={(e) => handleChange(e, 'Livechat_registration_form_message')}
                            disabled={!switchBeginChat}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col span={9} offset={1}>
                      <span style={{ color: '#127ace' }}>Tin nhắn khi hoàn thành chat</span>
                    </Col>
                    <Col span={2} offset={12}>
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={configLiveChat.Livechat_conversation_finished_message}
                        onChange={() =>
                          setConfigLiveChat({
                            ...configLiveChat,
                            Livechat_conversation_finished_message: !configLiveChat.Livechat_conversation_finished_message,
                          })
                        }
                      />
                    </Col>
                  </Row>
                  {configLiveChat.Livechat_conversation_finished_message && (
                    <Row>
                      <Col span={23} offset={1}>
                        <Form.Item name="Livechat_conversation_finished_text">
                          <Input.TextArea showCount maxLength={100} />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                </Space>
              </div>
            </div>
          </Col>
          <Col
            xxl={{ offset: 1, span: 11 }}
            xl={{ offset: 1, span: 11 }}
            lg={{ span: 24, offset: 0 }}
          >
            <div style={{ marginBottom: 15 }}>
              <span style={{ fontWeight: 'bolder', fontSize: '16px' }}>Preview</span>
            </div>
            <Preview
              switchRegisterInfo={switchRegisterInfo}
              switchBeginChat={switchBeginChat}
              configLiveChat={configLiveChat}
            />
          </Col>
        </Row>
        <Form.Item wrapperCol={{ span: 12 }}>
          {/* <Button
            style={{
              background: '#fff',
              color: '#2f7cba',
              marginRight: '10px',
              borderRadius: '4px',
            }}
            onClick={handleClickBack}
          >
            Quay lại
          </Button> */}
          <Button type="primary" htmlType="submit" style={{ borderRadius: '4px' }}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ConfigLiveChat;
