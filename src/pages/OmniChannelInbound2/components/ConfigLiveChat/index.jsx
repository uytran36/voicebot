import React, { useState, useCallback, useEffect } from 'react';
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
  Image,
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
import {
  requestUpdateConfigLiveChat,
  requestGetConfigLiveChat,
  requestUploadAvatar,
} from '../../service';
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
  const [configLiveChat, setConfigLiveChat] = useState([]);
  const [openColorPopupAgent, setOpenColorPopupAgent] = useState(false);
  const [openColorTextAgent, setOpenColorTextAgent] = useState(false);
  const [openColorPopupUser, setOpenColorPopupUser] = useState(false);
  const [openColorTextUser, setOpenColorTextUser] = useState(false);
  const [switchRegisterInfo, setSwitchRegisterInfo] = useState(false);
  const [switchBeginChat, setSwitchBeginChat] = useState(false);
  const [switchIntroductionChat, setSwitchIntroductionChat] = useState(false);
  // const [avatarUrl, setAvatarUrl] = useState('');
  const [valueInfoAgent, setValueInfoAgent] = useState(1);

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
    // setConfigLiveChat({
    //   ...configLiveChat,
    //   [field]: colors.color,
    // });
    configLiveChat.map((x) => {
      if (x.code === field) {
        x.value = colors.color;
      }
    });
    setConfigLiveChat([...configLiveChat]);
  }

  const onFinish = async (values) => {
    try {
      // if (
      //   configLiveChat.Livechat_conversation_start_greeting &&
      //   values.Livechat_registration_form_message === ''
      // ) {
      //   return message.warn('Vui lòng nhập lời chào mở đầu');
      // }
      // if (
      //   configLiveChat.Livechat_conversation_finished_message &&
      //   values.Livechat_conversation_finished_text === ''
      // ) {
      //   return message.warn('Vui lòng nhập tin nhắn hoàn thành cuộc trò chuyện');
      // }
      const res = await requestUpdateConfigLiveChat(headers, configLiveChat);
      if (res?.code === 200) {
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
    requestGetConfigLiveChat(headers).then((res) => {
      if (res?.code === 200 && res?.response?.listConfig?.length > 0) {
        // const result = Object.fromEntries(
        //   res.response.listConfig.map((item) => [item.code, item.value]),
        // );
        // if (result.introduction_title.length > 0) {
        //   result.introduction_title_active = true;
        // } else result.introduction_title_active = false;
        // if (result.introduction_content.length > 0) {
        //   result.introduction_content_active = true;
        // } else result.introduction_content_active = false;
        // console.log(result);

        // form.setFieldsValue(result);
        // // setRegisterForm(result.Livechat_register_info)
        console.log(res.response.listConfig);
        return setConfigLiveChat(res.response.listConfig);
      }
    });
  }, [form, headers]);

  const handleChange = (e, fieldName) => {
    configLiveChat.map((x) => {
      if (x.code === fieldName) {
        x.value = e?.target?.value || '';
      }
    });
    setConfigLiveChat([...configLiveChat]);
  };

  const handleCheck = (e, fieldName) => {
    configLiveChat.map((x) => {
      if (x.code === fieldName) {
        x.active = e;
      }
    });
    setConfigLiveChat([...configLiveChat]);
  };

  useEffect(() => {
    getConfigLiveChat();
  }, []);

  function copyToClipboard() {
    const copyText = document.getElementById('script').textContent;
    const textArea = document.createElement('textarea');
    textArea.textContent = copyText;
    document.body.append(textArea);
    textArea.select();
    document.execCommand('copy');
    message.info('Copied');
  }

  // const script = `
  //   <script>
  //       (function(w, d, s, o, f, js, fjs) {
  //           var elemDiv = document.createElement('div');
  //           elemDiv.setAttribute("id", "widget-live-chat");
  //           d.body.appendChild(elemDiv);
  //           w['Widget-livechat'] = o;
  //           w[o] = w[o] || function() {
  //               (w[o].q = w[o].q || []).push(arguments)
  //           };
  //           js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
  //           js.id = o;
  //           js.src = f;
  //           js.async = 1;
  //           fjs.parentNode.insertBefore(js, fjs);
  //       }(window, document, 'script', 'WidgetSCC', '${api.WIDGET_LIVECHAT}' + Math.random()));
  //       WidgetSCC('initweb', {
  //           targetElementId: 'widget-live-chat',
  //       });
  //   </script>
  // `;

  const script = `
    <script>
      (function (w, d, s, o, f, js, fjs) {
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
          "beforeend",
          "<link rel='stylesheet' href='${api.UMI_WIDGET_LIVECHAT_URL}/main.css' />");
        var elemDiv = document.createElement('div');
        elemDiv.setAttribute("id", "widget-live-chat");
        d.body.appendChild(elemDiv);
        w['Widget-livechat'] = o;
        w[o] = w[o] || function () {
          (w[o].q = w[o].q || []).push(arguments)
        };
        js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
        js.id = o;
        js.src = f;
        js.async = 1;
        fjs.parentNode.insertBefore(js, fjs);
      }(window, document, 'script', 'WidgetSCC', '${api.WIDGET_LIVECHAT}?_v=' + Math.random()));
      WidgetSCC('initweb', {
        targetElementId: 'widget-live-chat',
      });
    </script>
  `;

  const filterConfig = (config, field) => {
    return config.filter((x) => x.code === field)[0];
  };

  const beforeUpload = (file) => {
    const isImage = file.type === 'image/png' || file.type === 'image/jpeg';
    if (!isImage) {
      message.error(`${file.name} is not a image file (jpg/png)`);
    }
    return isImage ? true : Upload.LIST_IGNORE;
  };

  const handleUploadAvatar = async (info) => {
    if (info.file.status === 'done') {
      const res = info.fileList[0].response;
      if (res.code === 200) {
        message.success('Upload avatar successfully');
        configLiveChat.map((x) => {
          if (x.code === 'agent_avatar') {
            x.value = res?.response?.linkAvatar;
          }
        });
        setConfigLiveChat([...configLiveChat]);
      } else {
        message.error('Upload avatar failed');
      }
    }
  };

  const handleChangeRadio = (e) => {
    // setValueInfoAgent(e?.target?.value)
    if (e?.target?.value === 1) {
      configLiveChat.map((x) => {
        if (x.code === 'setting_agent_info') {
          x.active = true;
        }
      });
      setConfigLiveChat([...configLiveChat]);
    } else {
      configLiveChat.map((x) => {
        if (x.code === 'setting_agent_info') {
          x.active = false;
        }
      });
      setConfigLiveChat([...configLiveChat]);
    }
  };

  console.log(configLiveChat);

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
        // initialValues={{
        //   // Livechat_title: configLiveChat.Livechat_title || 'Title chat', // Tieu de
        //   agent_name: configLiveChat.agent_name,
        //   Livechat_email_field_registration_form: false,
        //   Livechat_phone_field_registration_form: false,
        //   Livechat_name_field_registration_form: false,
        //   Livechat_show_agent_info: !switchAgentConfig.Livechat_interface_avatar_agent_default,
        //   Livechat_interface_avatar_agent_default:
        //     `'${switchAgentConfig.Livechat_interface_avatar_agent_default}'` || `avatar agent`,
        //   Livechat_conversation_start_text: 'start text',
        //   Livechat_conversation_finished_text: 'finish text',
        // }}
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
          // name="livechat_title"
          label="Tiêu đề Livechat"
          rules={[{ required: true, message: 'Please select your favourite colors!' }]}
          labelAlign="left"
          {...layoutInputTitle}
        >
          <Input
            value={filterConfig(configLiveChat, 'livechat_title')?.value}
            onChange={(e) => handleChange(e, 'livechat_title')}
          />
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
                  <Row>
                    <Col span={24}>
                      <span style={{ marginBottom: '10px', fontWeight: 'bolder' }}>
                        Thông tin Agent
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={23} offset={1}>
                      <Radio.Group
                        onChange={(e) => handleChangeRadio(e)}
                        value={filterConfig(configLiveChat, 'setting_agent_info')?.active ? 1 : 2}
                        style={{ width: '100%' }}
                      >
                        <Space size={15} direction="vertical" style={{ width: '100%' }}>
                          <Radio value={1}>Thiết lập thông tin đại diện</Radio>
                          <Row>
                            <Col span={23} offset={1}>
                              <div className={styles.avatarWrapper}>
                                {filterConfig(configLiveChat, 'agent_avatar')?.value ? (
                                  <div className={styles.avatar}>
                                    <img
                                      alt="avatar"
                                      src={`${api.UMI_API_BASE_URL}/api/files${
                                        filterConfig(configLiveChat, 'agent_avatar')?.value
                                      }`}
                                    />
                                  </div>
                                ) : (
                                  <div className={styles.noAvatar}>
                                    <UserOutlined style={{ fontSize: 25, color: '#fff' }} />
                                  </div>
                                )}
                                <Form.Item
                                  style={{ marginBottom: 0 }}
                                  valuePropName="fileList"
                                  getValueFromEvent={normFile}
                                >
                                  <Upload
                                    action={`${api.CHAT_SERVICE}/live-chat/upload-avatar`}
                                    onChange={handleUploadAvatar}
                                    beforeUpload={beforeUpload}
                                    multiple={false}
                                    maxCount={1}
                                    name="file"
                                  >
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
                              <Form.Item style={{ marginBottom: 0 }} label="Tên Agent">
                                <Input
                                  value={filterConfig(configLiveChat, 'agent_name')?.value}
                                  onChange={(e) => handleChange(e, 'agent_name')}
                                />
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
                  </Row>
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
                              style={{
                                background: filterConfig(configLiveChat, 'visitor_color_popup')
                                  ?.value,
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.select}>
                          <Popover
                            content={
                              <ColorPicker.Panel
                                color={filterConfig(configLiveChat, 'visitor_color_popup')?.value}
                                style={{ borderRight: '50%' }}
                                onChange={(color) => changeHandler(color, 'visitor_color_popup')}
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
                              style={{
                                background: filterConfig(configLiveChat, 'visitor_color_chat')
                                  ?.value,
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.select}>
                          <Popover
                            content={
                              <ColorPicker.Panel
                                color={filterConfig(configLiveChat, 'visitor_color_chat')?.value}
                                style={{ borderRight: '50%' }}
                                onChange={(color) => changeHandler(color, 'visitor_color_chat')}
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
                              style={{
                                background: filterConfig(configLiveChat, 'agent_color_popup')
                                  ?.value,
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.select}>
                          <Popover
                            content={
                              <ColorPicker.Panel
                                color={filterConfig(configLiveChat, 'agent_color_popup')?.value}
                                style={{ borderRight: '50%' }}
                                onChange={(color) => changeHandler(color, 'agent_color_popup')}
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
                              style={{
                                background: filterConfig(configLiveChat, 'agent_color_chat')?.value,
                              }}
                            />
                          </div>
                        </div>
                        <div className={styles.select}>
                          <Popover
                            content={
                              <ColorPicker.Panel
                                color={filterConfig(configLiveChat, 'agent_color_chat')?.value}
                                style={{ borderRight: '50%' }}
                                onChange={(color) => changeHandler(color, 'agent_color_chat')}
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
                      <span style={{ color: '#127ace' }}>Lời giới thiệu</span>
                    </Col>
                    <Col span={2} offset={12}>
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={filterConfig(configLiveChat, 'introduction_form')?.active}
                        onChange={(checked) => handleCheck(checked, 'introduction_form')}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={22} offset={2}>
                      <Form.Item style={{ marginBottom: 0 }}>
                        <Checkbox
                          disabled={!filterConfig(configLiveChat, 'introduction_form')?.active}
                          checked={filterConfig(configLiveChat, 'introduction_title')?.active}
                          onChange={(e) => handleCheck(e?.target?.checked, 'introduction_title')}
                        >
                          Tiêu đề
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  {filterConfig(configLiveChat, 'introduction_title')?.active && (
                    <Row>
                      <Col span={22} offset={2}>
                        <Form.Item>
                          <Input.TextArea
                            showCount
                            maxLength={100}
                            value={filterConfig(configLiveChat, 'introduction_title')?.value}
                            onChange={(e) => handleChange(e, 'introduction_title')}
                            disabled={!filterConfig(configLiveChat, 'introduction_form')?.active}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col span={22} offset={2}>
                      <Form.Item style={{ marginBottom: 0 }}>
                        <Checkbox
                          disabled={!filterConfig(configLiveChat, 'introduction_form')?.active}
                          checked={filterConfig(configLiveChat, 'introduction_content')?.active}
                          onChange={(e) => handleCheck(e?.target?.checked, 'introduction_content')}
                        >
                          Nội dung
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  {filterConfig(configLiveChat, 'introduction_content')?.active && (
                    <Row>
                      <Col span={22} offset={2}>
                        <Form.Item>
                          <Input.TextArea
                            showCount
                            maxLength={100}
                            value={filterConfig(configLiveChat, 'introduction_content')?.value}
                            onChange={(e) => handleChange(e, 'introduction_content')}
                            disabled={!filterConfig(configLiveChat, 'introduction_form')?.active}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col span={9} offset={1}>
                      <span style={{ color: '#127ace' }}>Thông tin khi bắt đầu chat</span>
                    </Col>
                    <Col span={2} offset={12}>
                      {/* <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        // checked={filterConfig(configLiveChat, 'form_chat_info')?.active}
                        checked
                        onChange={(checked) => handleCheck(checked, 'form_chat_info')}
                        disabled
                      /> */}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={22} offset={2}>
                      <Form.Item
                      // label=""
                      // name="Livechat_registration_form"
                      // valuePropName="checked"
                      // defaultChecked={configLiveChat.Livechat_registration_form}
                      >
                        {/* <Checkbox
                          disabled={!filterConfig(configLiveChat, 'form_chat_info')?.active}
                          checked={filterConfig(configLiveChat, 'button_chat_info')?.active}
                          onChange={(e) => handleCheck(e?.target?.checked, 'button_chat_info')}
                        > */}
                          {`Phím "Bắt đầu"`}
                        {/* </Checkbox> */}
                      </Form.Item>
                      <Form.Item style={{ marginBottom: 0 }}>
                        {/* <Checkbox
                          disabled={!filterConfig(configLiveChat, 'form_chat_info')?.active}
                          checked={filterConfig(configLiveChat, 'greeting_chat_opening')?.active}
                          onChange={(e) => handleCheck(e?.target?.checked, 'greeting_chat_opening')}
                        > */}
                          Lời chào mở đầu
                        {/* </Checkbox> */}
                      </Form.Item>
                    </Col>
                  </Row>
                  {filterConfig(configLiveChat, 'greeting_chat_opening')?.active && (
                    <Row>
                      <Col span={22} offset={2}>
                        <Form.Item>
                          <Input.TextArea
                            showCount
                            maxLength={100}
                            value={filterConfig(configLiveChat, 'greeting_chat_opening')?.value}
                            onChange={(e) => handleChange(e, 'greeting_chat_opening')}
                            // disabled={!filterConfig(configLiveChat, 'form_chat_info')?.active}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col span={9} offset={1}>
                      <span style={{ color: '#127ace' }}>Thông tin đăng ký</span>
                    </Col>
                    <Col span={2} offset={12}>
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={filterConfig(configLiveChat, 'form_register_info')?.active}
                        onChange={(checked) => handleCheck(checked, 'form_register_info')}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={22} offset={2}>
                      <Form.Item
                      // label=""
                      // name="Livechat_name_field_registration_form"
                      // valuePropName="checked"
                      // defaultChecked={configLiveChat.Livechat_name_field_registration_form}
                      >
                        <Checkbox
                          disabled={!filterConfig(configLiveChat, 'form_register_info')?.active}
                          checked={filterConfig(configLiveChat, 'fullname_register')?.active}
                          onChange={(e) => handleCheck(e?.target?.checked, 'fullname_register')}
                        >
                          Họ và tên
                        </Checkbox>
                      </Form.Item>
                      <Form.Item
                      // label=""
                      // name="Livechat_phone_field_registration_form"
                      // valuePropName="checked"
                      // defaultChecked={configLiveChat.Livechat_phone_field_registration_form}
                      >
                        <Checkbox
                          disabled={!filterConfig(configLiveChat, 'form_register_info')?.active}
                          checked={filterConfig(configLiveChat, 'phone_register')?.active}
                          onChange={(e) => handleCheck(e?.target?.checked, 'phone_register')}
                        >
                          Số điện thoại
                        </Checkbox>
                      </Form.Item>
                      <Form.Item
                      // label=""
                      // name="Livechat_email_field_registration_form"
                      // valuePropName="checked"
                      // defaultChecked={configLiveChat.Livechat_email_field_registration_form}
                      >
                        <Checkbox
                          disabled={!filterConfig(configLiveChat, 'form_register_info')?.active}
                          checked={filterConfig(configLiveChat, 'email_register')?.active}
                          onChange={(e) => handleCheck(e?.target?.checked, 'email_register')}
                        >
                          Email
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={9} offset={1}>
                      <span style={{ color: '#127ace' }}>Tin nhắn khi hoàn thành chat</span>
                    </Col>
                    <Col span={2} offset={12}>
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={filterConfig(configLiveChat, 'greeting_chat_finished')?.active}
                        onChange={(e) => handleCheck(e, 'greeting_chat_finished')}
                      />
                    </Col>
                  </Row>
                  {filterConfig(configLiveChat, 'greeting_chat_finished')?.active && (
                    <Row>
                      <Col span={23} offset={1}>
                        <Form.Item>
                          <Input.TextArea
                            value={filterConfig(configLiveChat, 'greeting_chat_finished')?.value}
                            onChange={(e) => handleChange(e, 'greeting_chat_finished')}
                            showCount
                            maxLength={100}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  <Row>
                    <Col span={9} offset={1}>
                      <span style={{ color: '#127ace' }}>Hiển thị thông báo khi offline</span>
                    </Col>
                    <Col span={2} offset={12}>
                      <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={filterConfig(configLiveChat, 'greeting_chat_offline')?.active}
                        onChange={(e) => handleCheck(e, 'greeting_chat_offline')}
                      />
                    </Col>
                  </Row>
                  {filterConfig(configLiveChat, 'greeting_chat_offline')?.active && (
                    <Row>
                      <Col span={23} offset={1}>
                        <Form.Item>
                          <Input.TextArea
                            value={filterConfig(configLiveChat, 'greeting_chat_offline')?.value}
                            onChange={(e) => handleChange(e, 'greeting_chat_offline')}
                            showCount
                            maxLength={100}
                          />
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
              switchRegisterInfo={filterConfig(configLiveChat, 'form_register_info')?.active}
              switchBeginChat={filterConfig(configLiveChat, 'form_chat_info')?.active}
              configLiveChat={configLiveChat}
              filterConfig={filterConfig}
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
