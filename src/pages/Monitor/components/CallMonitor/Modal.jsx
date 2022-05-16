import React from 'react';
import { FormattedMessage } from 'umi';
import { Col, Form, Input, Select, Tabs } from 'antd';
import PT from 'prop-types';
import styles from './styles.less';
import { PauseOutlined, BarsOutlined, EditOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
import {
  MicroSvg,
  NoMessageSvg,
  NoMicroSvg,
  PhoneHangSvg,
  PhoneSvg,
  TurnOffVoiceSvg,
  ForwardSvg,
} from '../../svg';
import { logData, forwardData } from './index';
import { NoteForm, onSaveNote } from '@/components/NoteCall';
import Timer from 'react-compound-timer';
import { SessionState } from 'sip.js';
import { requestGetListExtensionOnline } from '@/services/call-center';
import TransferButton from '@/components/TransferButton';

const { TabPane } = Tabs;
const { Option } = Select;

export function CallModal(props) {
  const {
    visible,
    setVisible,
    stateSession,
    info,
    valueNotes,
    handleHold,
    handleUnhold,
    handleUnmute,
    handleTransfer,
    handleDecline,
    handleHangup,
    isMute,
    isHold
  } = props;
  return (
    <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
      <h4>Tương tác cuộc gọi</h4>
      <div className={styles.calltime}>
        <div className={styles.top}>
          <p style={{ fontWeight: 'bold' }}>{info?.callNumber}</p>
          <p style={{ fontWeight: 'bold', color: '#4999DA' }}>
            {stateSession === SessionState.Established ? (
              <div className={styles.counter} style={{ fontWeight: 'bold', color: '#4999DA' }}>
                <span>
                  <Timer.Hours />
                </span>
                <span>
                  <Timer.Minutes />
                </span>
                <span>
                  <Timer.Seconds />
                </span>
              </div>
            ) : (
              <span>Đang kết nối</span>
            )}
          </p>
        </div>
        <div className={styles.iconContainer}>
          <div className={styles.icon} style={{ background: isMute ? '#2aa5e7' : '#127ace' }}>
            <PauseOutlined style={{ color: 'white' }} />
          </div>
          <div className={styles.icon} style={{ background: isHold ? '#2aa5e7' : '#127ace' }}>
            <MicroSvg onClick={isHold ? handleUnhold : handleHold} />
          </div>
          <TransferButton size="small" handleSelectStaff={handleTransfer} />
          {/* <div className={styles.icon} style={{ background: '#127ace' }}> */}
            {/* <ForwardSvg /> */}
          {/* </div> */}
          <div className={styles.icon} style={{ background: '#ff4d4f' }}>
            <PhoneHangSvg onClick={handleHangup} />
          </div>
        </div>
      </div>
      <Tabs
        type="card"
        defaultActiveKey="callInterface"
        style={{ width: '100%', marginTop: '5px' }}
      >
        <TabPane
          tab={
            <span>
              <BarsOutlined />
              Log cuộc gọi
            </span>
          }
          key="callLog"
        >
          {logData.map((log, idx) => {
            return <p key={idx} style={{ fontSize: '12px' }}>{`${log.time}: ${log.message}`}</p>;
          })}
        </TabPane>
        <TabPane
          tab={
            <span>
              <EditOutlined />
              Ghi chú
            </span>
          }
          key="callNote"
        >
          {/* <Col span={24}>
            <Form.Item
              style={{ width: '100%' }}
              name="name"
              hasFeedback
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage id="pages.call-observe.name" defaultMessage="Họ tên" />
                </span>
              }
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              style={{ width: '100%' }}
              name="phoneNumber"
              hasFeedback
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage
                    id="pages.call-observe.phone-number"
                    defaultMessage="Số điện thoai"
                  />
                </span>
              }
            >
              <Input value={info?.callNumber} disabled />
            </Form.Item>
            <Form.Item
              style={{ width: '100%' }}
              name="email"
              hasFeedback
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage id="pages.call-observe.email" defaultMessage="Email" />
                </span>
              }
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ width: '100%' }}
              name="adress"
              hasFeedback
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage id="pages.call-observe.adress" defaultMessage="Địa chỉ" />
                </span>
              }
            >
              <Input />
            </Form.Item>
          </Col> */}
          <NoteForm valueNotes={valueNotes} />
        </TabPane>
      </Tabs>
    </Modal>
  );
}

export function CallForwardModal({ visible, setVisible, info, onTransfer, headers }) {
  const [disable, setDisable] = React.useState(true);
  const [ipPhoneSelected, setIpPhone] = React.useState('');

  const [listPbxExtension, setListPbxExtension] = React.useState([]);

  const onChange = (value) => {
    setIpPhone(value);
    setDisable(false);
  };

  React.useEffect(() => {
    requestGetListExtensionOnline(headers)
      .then((res) => {
        if (res.success) {
          setListPbxExtension(
            res.data.map((elm) => ({
              ipPhone: elm.ipPhone,
              name: elm.name || elm.username,
            })),
          );
          return null;
        }
        throw new Error('ERROR~');
      })
      .catch((err) => {
        console.log(err);
      });
  }, [headers]);

  return (
    <Modal
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={() => {
        onTransfer(info, ipPhoneSelected);
      }}
      okText="Chuyển tiếp"
      cancelText="Hủy"
      okButtonProps={{ disabled: disable }}
    >
      <h4>Tương tác cuộc gọi</h4>
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={onChange}
      >
        {listPbxExtension.map((data, idx) => {
          return <Option key={idx} value={data.ipPhone}>{`${data.name}-${data.ipPhone}`}</Option>;
        })}
      </Select>
      ,
    </Modal>
  );
}

export function ListenModal(props) {
  const { visible, setVisible, stateSession, info, valueNotes } = props;
  return (
    <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
      <h4>Tương tác cuộc gọi</h4>
      <div className={styles.calltime}>
        <div className={styles.top}>
          <p style={{ fontWeight: 'bold' }}>{info?.callNumber}</p>
          <p style={{ fontWeight: 'bold', color: '#4999DA' }}>{info?.timeLast}</p>
        </div>
        <div className={styles.iconContainer}>
          <div className={styles.icon} style={{ background: '#127ACE' }}>
            <PauseOutlined style={{ color: 'white' }} />
          </div>
          <div className={styles.icon} style={{ background: '#127ACE' }}>
            <NoMicroSvg />
          </div>
          <div className={styles.icon} style={{ background: '#127ace' }}>
            <NoMessageSvg />
          </div>
          <div className={styles.icon} style={{ background: '#127ace' }}>
            <TurnOffVoiceSvg />
          </div>
        </div>
      </div>
      <Tabs
        type="card"
        defaultActiveKey="callInterface"
        style={{ width: '100%', marginTop: '5px' }}
      >
        <TabPane tab="Log cuộc gọi" key="callLog">
          {logData.map((log, idx) => {
            return <p key={idx} style={{ fontSize: '12px' }}>{`${log.time}: ${log.message}`}</p>;
          })}
        </TabPane>
        <TabPane tab="Ghi chú" key="callNote">
          <Col span={24}>
            <Form.Item
              style={{ width: '100%' }}
              name="name"
              hasFeedback
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage id="pages.call-observe.name" defaultMessage="Họ tên" />
                </span>
              }
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              style={{ width: '100%' }}
              name="phoneNumber"
              hasFeedback
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage
                    id="pages.call-observe.phone-number"
                    defaultMessage="Số điện thoai"
                  />
                </span>
              }
            >
              <Input value={info?.callNumber} disabled />
            </Form.Item>
            <Form.Item
              style={{ width: '100%' }}
              name="email"
              hasFeedback
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage id="pages.call-observe.email" defaultMessage="Email" />
                </span>
              }
            >
              <Input />
            </Form.Item>
            <Form.Item
              style={{ width: '100%' }}
              name="adress"
              hasFeedback
              label={
                <span style={{ color: '#000' }}>
                  <FormattedMessage id="pages.call-observe.adress" defaultMessage="Địa chỉ" />
                </span>
              }
            >
              <Input />
            </Form.Item>
          </Col>
        </TabPane>
      </Tabs>
    </Modal>
  );
}

CallModal.propTypes = {
  visible: PT.bool.isRequired,
  setVisible: PT.func.isRequired,
  info: PT.object,
};

ListenModal.propTypes = {
  visible: PT.bool.isRequired,
  setVisible: PT.func.isRequired,
  info: PT.object,
};

CallForwardModal.propTypes = {
  visible: PT.bool.isRequired,
  setVisible: PT.func.isRequired,
  onTransfer: PT.func.isRequired,
  info: PT.object.isRequired,
};
