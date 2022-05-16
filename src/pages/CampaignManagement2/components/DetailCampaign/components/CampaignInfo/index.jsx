import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import { Row, Col, Form, Divider, Tag } from 'antd';
import moment from 'moment';
import { FormattedMessage } from 'umi';
import styles from './styles.less';
import api from '@/api';

const voices = {
  leminh: 'Lê Minh (Giọng nam)',
  banmai: 'Ban Mai (Giọng nữ)',
  thuminh: 'Thu Minh (Giọng nữ)',
  giahuy: 'Gia Huy (Giọng nam)',
  myan: 'Mỹ An (Giọng nữ)',
  lannhi: 'Lan Nhi (Giọng nữ)',
  linhsan: 'Linh San (Giọng nữ)',
  ngoclam: 'Ngọc Lam (Giọng nữ)',
  minhquang: 'Minh Quang (Giọng nam)',
};

const typeCampaign = {
  autoCall: 'Auto Call',
  autoDialer: 'Auto Dialer',
  previewCall: 'Preview Call',
};

const fakeData = {
  amountOutboundCall: 123,
  timeCall: '08/11/2020 08:00 - 08/11/2020 08:00',
  timeMaxCall: 5,
  timeRing: 5,
  amountCallback: 5,
  timeCallBetween: 5,
};

function CampaignInfo({ detailCampaign }) {
  const [listVoice, setListVoice] = useState([]);

  useEffect(() => {
    const nodes = detailCampaign?.script?.configuration?.nodes;
    if (nodes !== undefined) {
      let list = [...listVoice];
      for (let item of nodes) {
        if (item?.info?.details?.voice !== undefined) {
          list.push(item?.info?.details?.voice);
        }
      }
      const uniqueArray = list.filter(function (item, pos) {
        return list.indexOf(item) == pos;
      });
      setListVoice(uniqueArray);
    }
  }, []);

  const renderStyleStatus = (status) => {
    switch (status) {
      case 'pending':
        // return '#F6803B';
        return (
          <Tag color="orange">
            <FormattedMessage id="pages.campaign-management.status.pending" />
          </Tag>
        );
      case 'completed':
        // return '#16B14B';
        return (
          <Tag color="geekblue">
            <FormattedMessage id="pages.campaign-management.status.completed" />
          </Tag>
        );
      case 'running':
        // return '#001444';
        return (
          <Tag color="green">
            <FormattedMessage id="pages.campaign-management.status.running" />
          </Tag>
        );
      case 'new':
        // return '#001444';
        return (
          <Tag color="red">
            <FormattedMessage id="pages.campaign-management.status.new" />
          </Tag>
        );
      case 'waiting':
        return (
          <Tag color="default">
            <FormattedMessage id="pages.campaign-management.status.waiting" />
          </Tag>
        );
      case 'stop':
        // stop hiển thị trên màn hình tương tự như completed
        return (
          <Tag color="geekblue">
            <FormattedMessage id="pages.campaign-management.status.completed" />
          </Tag>
        );
      default:
        // return '#313541';
        return (
          <Tag color="default">
            <FormattedMessage id="pages.campaign-management.status.not_running" />
          </Tag>
        );
    }
  };

  return (
    <Form labelAlign="left" className={styles.formWrapper}>
      <Row>
        <Col span={11}>
          <Form.Item
            className={styles.formItem}
            label="Trạng thái"
            labelCol={{ span: 10 }}
            wrapperCol={{ offset: 1 }}
          >
            {renderStyleStatus(detailCampaign?.status)}
          </Form.Item>
          <Form.Item
            className={styles.formItem}
            label="Loại chiến dịch"
            labelCol={{ span: 10 }}
            wrapperCol={{ offset: 1 }}
          >
            <span>{typeCampaign[detailCampaign?.type]}</span>
          </Form.Item>
          <Form.Item
            className={styles.formItem}
            label="Đầu số gọi ra"
            labelCol={{ span: 10 }}
            wrapperCol={{ offset: 1 }}
          >
            <span>{detailCampaign?.configuration?.gateway_phone_number}</span>
          </Form.Item>
          <Form.Item
            className={styles.formItem}
            label="Giọng đọc"
            labelCol={{ span: 10 }}
            wrapperCol={{ offset: 1 }}
          >
            <span>
              {listVoice.map((item, index) => {
                return index < listVoice.length - 1 ? `${voices[item]}, ` : voices[item];
              }) || 'Lê Minh (Giọng nam)'}
            </span>
          </Form.Item>
          {(api.ENV === 'local' || api.ENV === 'dev') && (
            <>
              <Form.Item
                className={styles.formItem}
                label="Số cuộc gọi ra"
                labelCol={{ span: 10 }}
                wrapperCol={{ offset: 1 }}
              >
                <span>{fakeData.amountOutboundCall}</span>
              </Form.Item>
              <Form.Item
                className={styles.formItem}
                label="Thời gian thực hiện cuộc gọi"
                labelCol={{ span: 10 }}
                wrapperCol={{ offset: 1 }}
              >
                <div className={styles.timeStartCall}>
                  {/* <h4>{`${moment(detailCampaign?.campaignStrategies?.st_begin)
                .subtract(7, 'hours')
                .format('DD/MM/YYYY')} - ${moment(detailCampaign?.campaignStrategies?.st_end)
                .subtract(7, 'hours')
                .format('DD/MM/YYYY')}`}</h4>
                 */}
                  <h4>{fakeData.timeCall}</h4>
                </div>
              </Form.Item>
            </>
          )}
        </Col>
        <Col span={1} offset={1}>
          <Divider style={{ height: '15rem' }} type="vertical" />
        </Col>
        <Col span={11}>
          <Form.Item
            className={styles.formItem}
            label="Thời lượng tối đa mỗi cuộc gọi"
            labelCol={{ span: 10 }}
            wrapperCol={{ offset: 1 }}
          >
            <span>{`${detailCampaign?.configuration?.maximum_call_seconds} giây`}</span>
          </Form.Item>
          <Form.Item
            className={styles.formItem}
            label="Thời gian đổ chuông"
            labelCol={{ span: 10 }}
            wrapperCol={{ offset: 1 }}
          >
            <span>{`${detailCampaign?.configuration?.ringing_call_seconds} giây`}</span>
          </Form.Item>
          {(api.ENV === 'local' || api.ENV === 'dev') && (
            <>
              <Form.Item
                className={styles.formItem}
                label="Số lần gọi lại"
                labelCol={{ span: 10 }}
                wrapperCol={{ offset: 1 }}
              >
                {detailCampaign?.call_back_configuration?.amount_call_back_times !== undefined && (
                  <span>{`${detailCampaign?.call_back_configuration?.amount_call_back_times} lần`}</span>
                )}
              </Form.Item>
              <Form.Item
                className={styles.formItem}
                label="Thời gian giữa 2 lần gọi lại"
                labelCol={{ span: 10 }}
                wrapperCol={{ offset: 1 }}
              >
                {detailCampaign?.call_back_configuration?.call_back_delay_minutes !== undefined && (
                  <span>{`${detailCampaign?.call_back_configuration?.call_back_delay_minutes} phút`}</span>
                )}
              </Form.Item>
            </>
          )}
        </Col>
      </Row>
    </Form>
  );
}

export default CampaignInfo;
