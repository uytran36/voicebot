import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import {
  CopyOutlined,
  UploadOutlined,
  UserOutlined,
  CaretDownOutlined,
  CloseOutlined,
  SmileOutlined,
  MoreOutlined,
  PaperClipOutlined,
  PictureOutlined,
  SendOutlined,
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

Preview.propTypes = {
  configLiveChat: PT.any.isRequired,
  switchBeginChat: PT.bool.isRequired,
  switchRegisterInfo: PT.bool.isRequired,
};

function Preview(props) {
  const { configLiveChat, switchBeginChat, switchRegisterInfo } = props;
  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.header} style={{ background: configLiveChat.Livechat_title_color }}>
        <div className={styles.leftHeader}>
          <div className={styles.icon}>
            <UserOutlined style={{ fontSize: '18px', color: '#8c8c8c' }} />
          </div>
          <span>{configLiveChat.Livechat_title}</span>
        </div>
        <div className={styles.rightHeader}>
          <CloseOutlined style={{ color: '#fff', fontSize: '18px' }} />
        </div>
      </div>
      <div className={styles.content}>
        {(switchRegisterInfo || switchBeginChat) && (
          <>
            {switchBeginChat && configLiveChat.Livechat_conversation_start_greeting && (
              <div className={styles.chat}>
                <div className={styles.messageWrapper}>
                  <div className={styles.toWrapper}>
                    <div className={styles.avatar}>
                      <img src="/avatar_preview.png" alt="" />
                    </div>
                    <div
                      className={styles.to}
                      style={{ background: configLiveChat.Livechat_color_popup_agent, maxWidth: '100%' }}
                    >
                      <span style={{ color: configLiveChat.Livechat_color_text_agent }}>
                        {configLiveChat.Livechat_registration_form_message}
                      </span>
                    </div>
                  </div>
                  <div className={styles.time}>
                    <span>11:30</span>
                  </div>
                </div>
              </div>
            )}
            <div className={styles.formWrapper}>
              <div className={styles.titleForm}>
                <span>Chat với OnCX</span>
              </div>
              <div className={styles.noteForm}>
                <p>
                  {switchRegisterInfo &&
                    (configLiveChat.Livechat_name_field_registration_form ||
                      configLiveChat.Livechat_phone_field_registration_form ||
                      configLiveChat.Livechat_email_field_registration_form ||
                      configLiveChat.Livechat_age_field_registration_form) &&
                    `Vui lòng nhập thông tin của bạn để chúng tôi có thể kết nối với tổng đài viên.`}
                  {`
                Click vào "Bắt đầu" là bạn đã đồng ý với Điều khoản, Chính sách dữ liệu và cookie
                của OnCX.`}
                </p>
              </div>
              {switchRegisterInfo && configLiveChat.Livechat_name_field_registration_form && (
                <div className={styles.formItem}>
                  <div className={styles.label}>
                    <span>Tên</span>
                  </div>
                  <div className={styles.contentForm}>
                    <span>example</span>
                  </div>
                </div>
              )}
              {switchRegisterInfo && configLiveChat.Livechat_phone_field_registration_form && (
                <div className={styles.formItem}>
                  <div className={styles.label}>
                    <span>Số điện thoại</span>
                  </div>
                  <div className={styles.contentForm}>
                    <span>example</span>
                  </div>
                </div>
              )}
              {switchRegisterInfo && configLiveChat.Livechat_email_field_registration_form && (
                <div className={styles.formItem}>
                  <div className={styles.label}>
                    <span>Email</span>
                  </div>
                  <div className={styles.contentForm}>
                    <span>example</span>
                  </div>
                </div>
              )}
              {switchRegisterInfo && configLiveChat.Livechat_age_field_registration_form && (
                <div className={styles.formItem}>
                  <div className={styles.label}>
                    <span>Tuổi</span>
                  </div>
                  <div className={styles.contentForm}>
                    <span>example</span>
                  </div>
                </div>
              )}
              {switchBeginChat && configLiveChat.Livechat_registration_form && (
                <div className={styles.buttonBegin}>
                  <span>Bắt đầu</span>
                </div>
              )}
            </div>
          </>
        )}
        {!switchRegisterInfo && !switchBeginChat && (
          <>
            <div className={styles.chat}>
              <div className={styles.messageWrapper}>
                <div className={styles.toWrapper}>
                  <div className={styles.avatar}>
                    <img src="/avatar_preview.png" alt="" />
                  </div>
                  <div
                    className={styles.to}
                    style={{ background: configLiveChat.Livechat_color_popup_user }}
                  >
                    <span style={{ color: configLiveChat.Livechat_color_text_user }}>
                      Tôi cần hỗ trợ
                    </span>
                  </div>
                </div>
                <div className={styles.time}>
                  <span>11:30</span>
                </div>
              </div>
              <div className={styles.messageWrapper}>
                <div className={styles.fromWrapper}>
                  <div
                    className={styles.from}
                    style={{ background: configLiveChat.Livechat_color_popup_agent }}
                  >
                    <Paragraph
                      style={{ color: configLiveChat.Livechat_color_text_agent }}
                      // ellipsis={{ rows: 1 }}
                    >
                       Chào mừng bạn đến với hệ thống Voicebot Campaign
                    </Paragraph>
                  </div>
                </div>
                <div className={styles.fromTime}>
                  <span>11:30</span>
                </div>
              </div>
            </div>
            <div className={styles.timeNew}>
              <span>12:00</span>
            </div>
            <div className={styles.chat}>
              <div className={styles.messageWrapper}>
                <div className={styles.toWrapper}>
                  <div className={styles.avatar}>
                    <img src="/avatar_preview.png" alt="" />
                  </div>
                  <div
                    className={styles.to}
                    style={{ background: configLiveChat.Livechat_color_popup_user }}
                  >
                    <Paragraph
                      style={{ color: configLiveChat.Livechat_color_text_user }}
                      ellipsis={{ rows: 3 }}
                    >
                      Tôi muốn tìm hiểu về sản phẩm điện thoại bên bạn, vui lòng tư vấn giúp tôi
                    </Paragraph>
                  </div>
                </div>
                <div className={styles.time}>
                  <span>12:00</span>
                </div>
              </div>
              <div className={styles.messageWrapper} style={{ marginBottom: 10}}>
                <div className={styles.fromWrapper}>
                  <div
                    className={styles.from}
                    style={{ background: configLiveChat.Livechat_color_popup_agent }}
                  >
                    <span style={{ color: configLiveChat.Livechat_color_text_agent }}>
                      Cảm ơn bạn đã quan tâm
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.messageWrapper}>
                <div className={styles.fromWrapper}>
                  <div
                    className={styles.from}
                    style={{ background: configLiveChat.Livechat_color_popup_agent }}
                  >
                    <Paragraph
                      style={{ color: configLiveChat.Livechat_color_text_agent }}
                      ellipsis={{ rows: 2 }}
                    >
                      Bạn có thể cung cấp 1 vài thông tin để tôi có thể tư vấn sản phầm phù hợp cho
                      bạn
                    </Paragraph>
                  </div>
                </div>
                <div className={styles.fromTime}>
                  <span>12:00</span>
                </div>
              </div>
            </div>
            <div className={styles.input}>
              <div className={styles.chatBox}>
                <div className={styles.message}>
                  <Paragraph
                    style={{ color: '#bfbfbf', marginBottom: 0 }}
                    ellipsis={{ rows: 1 }}
                  >
                    Type a message
                  </Paragraph>
                </div>
                <Space>
                  <PictureOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />
                  <PaperClipOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />
                  <SmileOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />
                  <MoreOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />
                </Space>
              </div>
              <div className={styles.buttonWrapper}>
                <div className={styles.button}>
                  <SendOutlined style={{ color: '#fff', fontSize: 14 }} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Preview;
