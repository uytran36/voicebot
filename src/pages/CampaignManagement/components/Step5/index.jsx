import React, { useState, useEffect, useRef } from 'react';
import { formatMessage, FormattedMessage } from 'umi';
import { Row, Col, Typography, Button, Modal, Tag, Divider, Form, Input, message } from 'antd';
import { PauseCircleOutlined, PlayCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import { Doughnut } from 'react-chartjs-2';
import moment from 'moment';
import Table from '@ant-design/pro-table';
import PT from 'prop-types';
import styles from './styles.less';
import {
  requestCallDemo,
  requestReportCampaignSumary,
  requestReportSessionCall,
} from '../../service';
import { Phone, HeadPhone, Preview } from '@/components/Icons';
import api from '@/api'

Step5.propTypes = {
  updateCampaign: PT.func.isRequired,
  handleOnClickCallDemo: PT.func.isRequired,
  handleOnClickExportReport: PT.func.isRequired,
  handleClickDuplicateCampaign: PT.func.isRequired,
  onClickStep: PT.func.isRequired,
  user: PT.shape({
    username: PT.string,
  }).isRequired,
  campaign: PT.shape({
    initialValues: PT.instanceOf(Object),
    sipProfile: PT.instanceOf(Array),
  }).isRequired,
  headers: PT.instanceOf(Object).isRequired,
  tokenHub: PT.string.isRequired,
};

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

function Step5({
  campaign,
  updateCampaign,
  user,
  handleOnClickCallDemo,
  onClickStep,
  handleClickDuplicateCampaign,
  headers,
  tokenHub,
  handleOnClickExportReport
}) {
  const [isOpenModal, setOpenModal] = useState(false);
  const [inputNumber, setInputNumber] = useState(false);
  const [reportCalling, setReportCalling] = useState({});
  const [reportCampaignSUmmary, setReportCampaignSummary] = useState({});
  const actionRef = useRef();

  const handleClickReCall = (id, number) => {
    requestCallDemo(headers, id, number).then((res) => {
      if (res.success === 'OK' || res.status === 'OK') {
        return message.success('Call success');
      }
      return message.warning('Call fail');
    });
  };

  const confirmLoading = (values) => {
    setOpenModal(false);
    // move to parent
    // requestCallDemo(campaign?.initialValues?._id, inputNumber).then((res) => {
    //   if (res.success === 'OK') {
    //     return message.success('Call success');
    //   }
    //   return message.warning('Call fail');
    // });
    handleClickReCall(campaign?.initialValues?._id, inputNumber);
  };

  const onClickUpdateCampaign = async (status) => {
    const res = await updateCampaign(
      { runner_status: status, updateby: user?.username || 'unknown' },
      campaign?.initialValues?._id,
    );
    const messageText = status === 'SCHEDULED' ? 'Bắt đầu chiến dịch' : 'Tạm dừng chiến dịch';
    if (res?.success) {
      return message.success(`${messageText} thành công`);
    }
    return message.warning(`${messageText} thất bại`);
  };

  const formatReportDoughnut = (data) => {
    const dataCall = {
      callSuccess: 0,
      callInprogress: 0,
      callFail: 0,
      callApproach: [],
      callNotApproach: [],
      totalCall: [],
      totalRetryCall: 0,
      call5s: 0,
      call15s: 0,
      call30s: 0,
      call31s: 0,
    };
    if (data.length > 0) {
      // doi logic 31/03/2021
      // data.map((item) => {
      //   // item?.crr_is_answer ? dataCall.callSuccess++ : dataCall.callFail++;
      //   dataCall?.totalCall.push(item.sdt);
      //   dataCall.totalRetryCall += item.crr_retry;
      //   if (item?.crr_is_answer) {
      //     dataCall.callSuccess += 1;
      //     if (!dataCall?.callApproach.includes(item.sdt)) {
      //       dataCall.callApproach.push(item.sdt);
      //     }
      //   }
      //   // if (item?.crr_is_err) dataCall.callFail += 1;
      //   if (item?.crr_duration_5s > 0) dataCall.call5s += 1;
      //   if (item?.crr_duration_15s > 0) dataCall.call15s += 1;
      //   if (item?.crr_duration_30s > 0) dataCall.call30s += 1;
      //   if (item?.crr_duration_higher > 0) dataCall.call31s += 1;
      // });
      // const tempDataNotApproach = dataCall?.totalCall.filter(
      //   (x) => !dataCall.callApproach.includes(x),
      // );
      // dataCall.callFail = dataCall.totalRetryCall - dataCall.callSuccess
      // dataCall.callNotApproach = Array.from(new Set(tempDataNotApproach));
      const result = data[0];
      dataCall.callSuccess = result.total_established
      dataCall.callFail = result.total_call - result.total_established
      dataCall.callApproach = result.total_customer_success
      dataCall.callNotApproach = result.total_customer - result.total_customer_success
      dataCall.call5s = result.crr_duration_5s
      dataCall.call15s = result.crr_duration_15s
      dataCall.call30s = result.crr_duration_30s
      dataCall.call31s = result.crr_duration_higher
      return setReportCalling(dataCall);
    }
  };

  const fetchDailySummaryReport = async (_data) => {
    try {
      const res = await requestReportCampaignSumary(headers, _data);
      if (res && res.success) {
        setReportCampaignSummary(res.data[0]);
        formatReportDoughnut(res.data);
        return null;
      }
      throw new Error(res?.error || 'ERROR!');
    } catch (err) {
      // message.error(err.toString());
      return null;
    }
  };

  useEffect(() => {
    if (campaign?.initialValues?.campaign_id) {
      // fake
      // fetchDailySummaryReport({
      //   token: 'string',
      //   campaignID: '604088b6d38a301b254e2811',
      // });
      fetchDailySummaryReport({ token: tokenHub, campaignID: campaign.initialValues.campaign_id });
      actionRef.current.reload();
    }
  }, [campaign?.initialValues]);

  return (
    <div className={styles.container}>
      <Row>
        <Typography.Title className={styles.title} level={3}>
          {<FormattedMessage id="pages.campaign-management.campaign.name" />}:{' '}
          {campaign?.initialValues?.campaignScenario?.scenario_name || 'Unknow'}
        </Typography.Title>
      </Row>
      <Row>
        <Button
          onClick={() => onClickUpdateCampaign('SCHEDULED')}
          className={styles.btn_play}
          type="primary"
          icon={<PlayCircleOutlined />}
          disabled={['SCHEDULED', 'RUNNING'].includes(campaign?.initialValues?.runner_status)}
        >
          {' '}
          {<FormattedMessage id="pages.campaign-management.start" />}
        </Button>
        <Button
          onClick={() => onClickUpdateCampaign('PENDING')}
          danger
          type="primary"
          icon={<PauseCircleOutlined />}
          disabled={['PENDING', 'COMPLETED'].includes(campaign?.initialValues?.runner_status)}
        >
          {' '}
          {<FormattedMessage id="pages.campaign-management.pause" />}
        </Button>
      </Row>
      <Row>
        <Tag color="processing" onClick={handleClickDuplicateCampaign}>
          {<FormattedMessage id="pages.campaign-management.campaign.copy" />}
        </Tag>
        <Tag color="processing" onClick={() => onClickStep(2)}>
          {<FormattedMessage id="pages.campaign-management.campaign.edit" />}
        </Tag>
        <Tag color="processing" onClick={() => handleOnClickCallDemo(campaign?.initialValues?._id)}>
          {<FormattedMessage id="pages.campaign-management.call.test" />}
        </Tag>
        {/* <Tag color="processing" onClick={() => handleOnClickExportReport(campaign?.initialValues?.campaign_id)}>
          {<FormattedMessage id="pages.campaign-management.export.report" />}
        </Tag> */}
        <Tag color="processing">
          <a className={styles.color_tag} href={`${api.REPORT_SERVICE}/v1/report/campaign/export?token=${tokenHub}&campaignID=${campaign?.initialValues?.campaign_id}&type=session`} target="_blank" rel="noreferrer">{<FormattedMessage id="pages.campaign-management.export.report" />}</a>

        </Tag>
      </Row>
      <Divider />
      <Row>
        <Typography.Title className={styles.title} level={3}>
          {<FormattedMessage id="pages.campaign-management.overview" />}
        </Typography.Title>
      </Row>
      <div className={styles.container_chart}>
        <div className={styles.doughnut}>
          <Doughnut
            height={250}
            data={{
              labels: [
                formatMessage({ id: 'pages.campaign-management.lift' }),
                formatMessage({ id: 'pages.campaign-management.processing' }),
                formatMessage({ id: 'pages.campaign-management.unsuccessful' }),
              ],
              datasets: [
                {
                  // data: [50, 30, 20],
                  data: [
                    reportCalling?.callSuccess,
                    reportCalling?.callInprogress,
                    reportCalling?.callFail,
                  ],
                  // data,
                  backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
                },
              ],
            }}
            options={{
              responsive: true,
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: formatMessage({ id: 'pages.campaign-management.total.calls' }),
                // text: title,
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
              },
            }}
          />
        </div>
        <div className={styles.doughnut}>
          <Doughnut
            height={230}
            data={{
              labels: [
                formatMessage({ id: 'pages.campaign-management.approached' }),
                formatMessage({ id: 'pages.campaign-management.non-accessible' }),
              ],
              // labels,
              datasets: [
                {
                  // data: [80, 20],
                  data: [
                    // doi logic 31/03/2021
                    // reportCalling?.callApproach?.length,
                    // reportCalling?.callNotApproach?.length,
                    reportCalling?.callApproach,
                    reportCalling?.callNotApproach,
                  ],
                  // data,
                  backgroundColor: ['#36A2EB', '#FF6384'],
                },
              ],
            }}
            options={{
              responsive: true,
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: formatMessage({ id: 'pages.campaign-management.total.customers' }),
                // text: title,
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
              },
            }}
          />
        </div>
        <div className={styles.doughnut}>
          <Doughnut
            height={250}
            data={{
              labels: [
                formatMessage({ id: 'pages.campaign-management.under.5s' }),
                formatMessage({ id: 'pages.campaign-management.5s.15s' }),
                formatMessage({ id: 'pages.campaign-management.15s.30s' }),
                formatMessage({ id: 'pages.campaign-management.over.30s' }),
              ],
              datasets: [
                {
                  // data: [
                  //   reportCampaignSUmmary?.crr_duration_5s,
                  //   reportCampaignSUmmary?.crr_duration_15s,
                  //   reportCampaignSUmmary?.crr_duration_30s,
                  //   reportCampaignSUmmary?.crr_duration_higher,
                  // ],
                  data: [
                    reportCalling?.call5s,
                    reportCalling?.call15s,
                    reportCalling?.call30s,
                    reportCalling?.call31s,
                  ],
                  backgroundColor: ['#36A2EB', '#FFCE56', '#8BBF49', '#e05f5f'],
                },
              ],
            }}
            options={{
              responsive: true,
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: formatMessage({ id: 'pages.campaign-management.duration.call' }),
                // text: title,
              },
              animation: {
                animateScale: true,
                animateRotate: true,
              },
              tooltips: {
                enabled: true,
              },
            }}
          />
        </div>
      </div>
      <Divider />
      <Row>
        <Typography.Title className={styles.title} level={3}>
          {<FormattedMessage id="pages.campaign-management.campaign.info" />}
        </Typography.Title>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item
            label={
              <label className={styles.label}>
                {<FormattedMessage id="pages.campaign-management.prefix.phone.number.call.out" />}
              </label>
            }
          >
            {campaign?.sipProfile[0]?.from_user || '02873002222'}
          </Form.Item>
          <Form.Item
            label={
              <label className={styles.label}>
                {<FormattedMessage id="pages.campaign-management.voice" />}
              </label>
            }
          >
            {voices[
              campaign?.initialValues?.campaignScenario?.ScenarioModel?.introduction?.vocal
            ] || 'Lê Minh (Giọng nam)'}
          </Form.Item>
          <Form.Item
            label={
              <label className={styles.label}>
                {<FormattedMessage id="pages.campaign-management.campaign.time" />}
              </label>
            }
          >
            {`${moment(campaign?.initialValues?.campaignStrategies?.st_begin)
              .subtract(7, 'hours')
              .format('DD/MM/YYYY')} - ${moment(campaign?.initialValues?.campaignStrategies?.st_end)
              .subtract(7, 'hours')
              .format('DD/MM/YYYY')}`}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <label className={styles.label}>
                {<FormattedMessage id="pages.campaign-management.max.time.each.call" />}
              </label>
            }
          >
            {campaign?.initialValues?.campaignStrategies?.st_maxcalltime_sec}
          </Form.Item>
          <Form.Item
            label={
              <label className={styles.label}>
                {<FormattedMessage id="pages.campaign-management.recall" />}
              </label>
            }
          >
            {campaign?.initialValues?.campaignStrategies?.st_callback_retry}
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Row>
        <Col span={24}>
          <Typography.Title className={styles.title} level={3}>
            {<FormattedMessage id="pages.campaign-management.call.history" />}
          </Typography.Title>
        </Col>
        <Col span={24}>
          <Table
            search={false}
            options={false}
            // pagination={{
            //   showTotal: false,
            //   defaultPageSize: 10,
            // }}
            pagination={{
              defaultPageSize: 10,
              showTotal: false,
              size: 'default',
              // showSizeChanger: false,
            }}
            size="small"
            actionRef={actionRef}
            scroll={{ x: 1200 }}
            rowKey={(record) => record.id}
            request={async () => {
              try {
                const campaignID = campaign?.initialValues?.campaign_id;
                if (campaignID) {
                  const res = await requestReportSessionCall(headers, {
                    token: tokenHub,
                    campaignID,
                    // campaignID: '604088b6d38a301b254e2811'
                  });
                  if (res && res.success) {
                    return {
                      data: res.data || [],
                      total: res.length,
                    };
                  }
                  throw new Error(res?.error || 'ERROR!');
                } else {
                  return true;
                }
              } catch (err) {
                // message.error(err.toString());
                return {
                  data: [],
                  total: 0,
                };
              }
            }}
            columns={[
              {
                title: <FormattedMessage id="pages.campaign-management.call.id" />,
                dataIndex: 'session_id',
                key: 'session_id',
                align: 'center',
                width: 100,
              },
              {
                title: <FormattedMessage id="pages.campaign-management.number.switchboards" />,
                dataIndex: 'gateway_phonenumber',
                key: 'gateway_phonenumber',
                align: 'center',
                width: 80,
              },
              {
                title: <FormattedMessage id="pages.campaign-management.customer.name" />,
                dataIndex: 'ho_va_ten',
                key: 'ho_va_ten',
                align: 'center',
                width: 80,
              },
              {
                title: <FormattedMessage id="pages.campaign-management.customer.phone.number" />,
                dataIndex: 'sdt',
                key: 'sdt',
                align: 'center',
                width: 80,
              },
              {
                title: <FormattedMessage id="pages.campaign-management.call.time" />,
                dataIndex: 'start_time',
                key: 'start_time',
                align: 'center',
                width: 80,
                render: (text) => moment(text).format('DD/MM/YYYY HH:mm:ss'),
              },
              {
                title: <FormattedMessage id="pages.campaign-management.call.duration" />,
                dataIndex: 'duration_sec',
                key: 'duration_sec',
                align: 'center',
                width: 80,
              },
              // {
              //   title: <FormattedMessage id="pages.campaign-management.recall" />,
              //   dataIndex: 'calltime_sec',
              //   key: 'calltime_sec',
              //   align: 'center',
              //   width: 80,
              // },
              {
                title: <FormattedMessage id="pages.campaign-management.status" />,
                dataIndex: 'call_status',
                key: 'call_status',
                align: 'center',
                width: 80,
                render: (text) => (
                  <span
                    style={{
                      color:
                        text === 'Thành Công'
                          ? '#16B14B'
                          : text === 'Thất bại'
                          ? '#EF0000'
                          : '#F6803B',
                    }}
                  >
                    {text}
                  </span>
                ),
              },
              {
                title: <FormattedMessage id="pages.campaign-management.action" />,
                align: 'center',
                width: 80,
                render: (_, record) => (
                  <div>
                    <Phone
                      className={styles.icon}
                      style={{ marginRight: 5 }}
                      onClick={() => handleClickReCall(campaign?.initialValues?._id, record?.sdt)}
                    />
                    <HeadPhone className={styles.icon} style={{ marginRight: 5 }} />
                    <Preview className={styles.icon} />
                  </div>
                ),
              },
            ]}
          />
        </Col>
      </Row>
      <Modal visible={isOpenModal} onCancel={() => setOpenModal(false)} onOk={confirmLoading}>
        <Form.Item
          style={{ paddingTop: '30px' }}
          label={<FormattedMessage id="pages.campaign-management.call.test.enter" />}
          rules={[
            {
              pattern: new RegExp('^[0-9]{3,11}$'),
              message: 'Phone invalid',
            },
          ]}
        >
          <Input onChange={(e) => setInputNumber(e.target.value)} />
        </Form.Item>
      </Modal>
    </div>
  );
}

export default Step5;
