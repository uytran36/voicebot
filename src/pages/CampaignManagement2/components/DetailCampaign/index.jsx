import React, { useState, useCallback, useEffect, useRef } from 'react';
import PT from 'prop-types';
import {
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  PieChartFilled,
  InfoCircleFilled,
  PhoneFilled,
  CopyOutlined,
  CloseCircleFilled,
} from '@ant-design/icons';
import {
  Typography,
  Popconfirm,
  Space,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Image,
} from 'antd';
import { connect, FormattedMessage } from 'umi';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import exportIcon from '@/assets/Union.svg';
import { PlayPause } from '@/components/Icons';
import {
  requestCallDemo,
  requestReportCampaignSumary,
  requestGetCampaigns,
  requestChangeStatus,
  requestCreateCampaigns,
  requestCreateCampaign,
  requestDeleteCampaign,
  requestUpdateCampaignConfig,
  new_campaign_script,
  update_campaign_script,
  requestDuplicateCampaign,
  requestGetStatisticsReport,
} from '@/services/campaign-management';
import {
  requestHistoryCallCampaign,
  requestExportHistoryCallCampaign,
} from '@/services/call-center';
import General from './components/General';
import CampaignInfo from './components/CampaignInfo';
import TimeConfig from './components/TimeConfig';
import AmountOutbound from './components/AmountOutbound';
import FailedErrorStatistic from './components/FailedErrorStatistic';
import styles from './styles.less';
import api from '@/api';
import { requestGetSipProfile } from '@/services/campaign-management';
import { openModal, closeModal, changeContentModal } from '@/components/ConfirmModal/openModal';
import ConfirmModal from '@/components/ConfirmModal';
import NoDataPermission from '@/components/NoDataPermission';
import { CAMPAIGN_MANAGEMENT, checkPermission, VoiceBot } from '@/utils/permission';
import CustomDatePicker from './components/ButtonDatePicker';

const { Title } = Typography;
const { RangePicker } = DatePicker;

function DetailCampaign(props) {
  const {
    history,
    match,
    user: { userId, authToken, tokenGateway, tokenHub, currentUser },
    dispatch,
  } = props;
  const formRef = useRef(null);
  const selectDate = useRef([]);
  const [reportCalling, setReportCalling] = useState({
    // total_call: {
    //   success: 1,
    //   failure: 1,
    //   total_calls: 2,
    // },
    // call_answer: {
    //   less_than_5s: 2,
    //   '5s-15s': 0,
    //   '15s-30s': 0,
    //   greater_than_30s: 0,
    //   total_call_duration: 0.05,
    // },
    // total_customer: {
    //   Receive: 2,
    //   not_received_yet: 0,
    //   total_customers: 0,
    // },
    // customer_buttons: {
    //   '1-': 3,
    //   '2-': 6,
    //   '2-1-': 1,
    //   '2-3-': 3,
    //   '2-3-1-': 1,
    //   '2-3-5-': 1,
    //   '2-3-6-': 1,
    //   '2-8': 1,
    //   '4-': 1,
    // },
    // average_call_duration: {
    //   total: 0.03333,
    // },
    // rate_dtmf: {
    //   '1-': 1.0,
    //   '2-': 1.0,
    //   '4-': 1.0,
    // },
  });
  const [detailCampaign, setDetailCampaign] = useState({});
  const [fetchStatus, setFetchStatus] = useState(false);
  const [phoneCall, setPhoneCall] = useState('');
  const [rangeDate, setRangeDate] = useState({});
  const [viewDetail, setViewDetail] = useState(false);

  // init state listCom

  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: tokenGateway,
  };

  //custom data picker
  let componentRef = React.createRef();
  const dateFormat = 'YYYY-MM-DD';
  const [paramsFilter, setParamsFilter] = useState({
    startDate: moment()
      .subtract(29, 'days')
      .format(dateFormat) /* moment()
      .startOf('day')
      .format(dateFormat) */,
    endDate: moment().startOf('day').format(dateFormat),
    typeChart: 'HOURS',
    dateDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'days'),
    monthDiff: moment(moment().endOf('day')).diff(moment(moment().startOf('day')), 'months'),
  });

  const handleChangeDatePicker = useCallback(
    (value) => {
      if (value?.length > 0) {
        const startDate = moment(value[0]).format(dateFormat);
        const endDate = moment(value[1]).format(dateFormat);
        const dateDiff = moment(endDate).diff(moment(startDate), 'days');
        const monthDiff = moment(endDate).diff(moment(startDate), 'months');
        /* return setParamsFilter({
          ...paramsFilter,
          startDate,
          endDate,
          dateDiff,
          monthDiff,
          typeChart:
            dateDiff === 0
              ? 'HOURS'
              : dateDiff > 0 && monthDiff < 1
              ? 'DAYS'
              : monthDiff < 12
              ? 'MONTHS'
              : 'YEARS',
        }); */
      }
      return null;
    },
    [paramsFilter],
  );

  const CardLayout = ({ title, icon, suffix, children, type }) => {
    return (
      <ProCard className={styles.procard}>
        <div className={styles.header}>
          <div className={styles.prefix}>
            <div className={type !== 'error' ? styles.icon : styles.iconError}>{icon}</div>
            <div className={type !== 'error' ? styles.title : styles.titleError}>
              <span>{title}</span>
            </div>
          </div>
          <div className={styles.suffix}>{suffix}</div>
        </div>
        <div className={styles.body}>{children}</div>
      </ProCard>
    );
  };

  const fetchDetailCampaign = async (campaignId) => {
    try {
      const data = {
        headers,
        query: campaignId,
      };
      const res = await requestGetCampaigns(data);

      if (res?.success && res?.data[0]) {
        setDetailCampaign(res.data[0]);
        return res?.data[0];
      }
      throw new Error(res?.error || 'ERROR!');
    } catch (err) {
      return console.error(err.toString());
    }
  };

  useEffect(async () => {
    fetchDetailCampaign(match.params.id);
    if (match?.params?.id) {
      let filter;
      if (rangeDate?.fromData !== undefined) {
        filter = {
          campaign_id: match.params.id,
          filter_data: {
            from_datetime: rangeDate.fromData,
            to_datetime: rangeDate.toDate,
          },
        };
      } else {
        filter = {
          campaign_id: match.params.id,
        };
      }

      const res = await requestGetStatisticsReport(headers, filter);
      if (res?.success) {
        setReportCalling(res?.data[0]);
      }
    }
  }, [rangeDate]);

  useEffect(() => {
    if (
      checkPermission(currentUser?.permissions, CAMPAIGN_MANAGEMENT.allAutoCallCampaign) ||
      checkPermission(currentUser?.permissions, CAMPAIGN_MANAGEMENT.allAudoDialerCampaign)
    ) {
      setViewDetail(true);
    }
  }, [currentUser]);

  const handleChangeStateModal = useCallback(
    (stateModal) => {
      dispatch({
        type: 'modal/showModal',
        payload: stateModal,
      });
    },
    [dispatch],
  );

  const handleChangeElementModal = useCallback(
    (objElement) => {
      dispatch({
        type: 'modal/changeElement',
        payload: objElement,
      });
    },
    [dispatch],
  );

  const onExportHistory = async (campaignID) => {
    try {
      const dataDetail = {
        scc_campaign_id: campaignID,
        fromDate: moment().subtract(1, 'months').startOf('day').toJSON(),
        toDate: moment().endOf('day').endOf('day').toJSON(),
      };
      const res = await requestExportHistoryCallCampaign(headers, dataDetail);
      if (res.success) {
        return window.open(`${api.REPORT_SERVICE}${res?.data['url-download']}`).focus();
      }
      return console.error(`Error export history call: ${res}`);
    } catch (error) {
      return console.error(`Error export history call: ${error}`);
    }
  };

  /**
   * @param {String} campaignId
   * @returns {Void}
   */
  const callDemo = useCallback(
    (campaignId) => {
      handleChangeStateModal(true);
      handleChangeElementModal({
        bodyStyle: { padding: '10px' },
        width: 300,
        title: <FormattedMessage id="pages.campaign-management.call.test.enter" />,
        content: (
          <ModalCallDemo
            formRef={formRef}
            headers={headers}
            campaignId={campaignId}
            handleChangeStateModal={handleChangeStateModal}
          />
        ),
        footer: {
          centered: true,
          // footer: null,
          onCancel: () => handleChangeStateModal(false),
          onOk: () => {
            formRef.current.submit(); // save form note
          },
        },
      });
    },
    [handleChangeElementModal, handleChangeStateModal, headers],
  );

  /**
   * @param {object}
   * @returns {Void}
   */
  const duplicateCampaign = useCallback(
    (campaign) => {
      handleChangeStateModal(true);
      handleChangeElementModal({
        bodyStyle: { padding: '10px' },
        width: 300,
        title: 'Sao chép cấu hình chiến dịch',
        content: (
          <ModalDuplicate
            formRef={formRef}
            headers={headers}
            campaign={campaign}
            handleChangeStateModal={handleChangeStateModal}
            requestCreateCampaign={requestCreateCampaign}
            new_campaign_script={new_campaign_script}
            update_campaign_script={update_campaign_script}
            requestUpdateCampaignConfig={requestUpdateCampaignConfig}
          />
        ),
        footer: {
          centered: true,
          // footer: null,
          onCancel: () => handleChangeStateModal(false),
          onOk: () => {
            formRef.current.submit(); // save form note
          },
        },
      });
    },
    [handleChangeElementModal, handleChangeStateModal, headers],
  );

  /**
   * Xu ly tao campaign
   * @param {string} idScenario
   * @param {string} idStrategy
   * @param {string} idContactList
   * @returns {object}
   */
  const handleCreateCampaign = useCallback(
    async (idScenario, idStrategy, idContactList) => {
      const resCampaigns = await requestCreateCampaigns(headers, {
        campaignScenario: idScenario,
        campaignStrategies: idStrategy,
        omniContactListBase: idContactList.map((elm) => ({ sessionId: elm })),
        createby: currentUser?.username || 'unknown',
      });
      if (resCampaigns.success) {
        // message.success(`create campaigns successfuly`);
        // save campaign id call demo
        return resCampaigns;
      }
      // throw new Error(resCampaigns.error);
      message.error(resCampaigns.error);
      return {
        success: false,
      };
    },
    [currentUser?.username, dispatch],
  );

  /**
   * Xu ly thay doi trang thai campaign
   * @param {object} campaign
   * @returns {void}
   */
  const handleChangeStatus = useCallback(
    async (record) => {
      const data = {
        campaign_id: record?.campaign_id,
        status: record?.status !== 'pending' ? 'pending' : 'running',
      };
      try {
        const res = await requestChangeStatus(headers, data);
        if (res?.success) {
          message.success('Update status thành công.');
          setFetchStatus(!fetchStatus);
          return null;
        }
        throw new Error('ERROR~');
      } catch (err) {
        console.error(err.toString());
        message.warning(`Update status không thành công. ${err}`);
        return null;
      }
    },
    [requestChangeStatus, fetchStatus],
  );

  const handleStopCampaign = useCallback(
    async (record) => {
      const data = {
        campaign_id: record?.campaign_id,
        status: 'stop',
      };
      try {
        const res = await requestChangeStatus(headers, data);
        if (res?.success) {
          message.success('Update status thành công.');
          setFetchStatus(!fetchStatus);
          return null;
        }
        throw new Error('ERROR~');
      } catch (err) {
        console.error(err.toString());
        message.warning(`Update status không thành công. ${err}`);
        return null;
      }
    },
    [requestChangeStatus, fetchStatus],
  );
  /**
   * Xu ly xoa campaign
   * @param {String} campaignId
   * @returns {Object} - response request
   */
  const deleteCampaign = useCallback(async (campaignId) => {
    const hide = message.loading('Đang delete, vui lòng đợi');
    try {
      const res = await requestDeleteCampaign(headers, campaignId);
      if (res?.success) {
        message.success(`Xoá chiến dịch thành công`);
        return history.push(`/config/campaign-management-2`);
      } else {
        message.error(`Xoá chiến dịch thất bại. ${res?.error}`);
      }
      hide();
    } catch (err) {
      hide();
      return console.error(err.toString());
    }
  }, []);

  /**
   * Xu ly xoa campaign
   * @param {String} campaignId
   * @returns {Object} - response request
   */
  const onSelectSumaryReport = useCallback(async (date, campaignID) => {
    const data = {
      token: tokenHub,
      campaignID,
      fromDate: date !== null ? moment(date[0]).startOf('day').toJSON() : undefined,
      toDate: date !== null ? moment(date[1]).endOf('day').toJSON() : undefined,
    };

    setRangeDate({
      fromData: data.fromDate,
      toDate: data.toDate,
    });

    // fetchDailySummaryReport(data);
  }, []);

  const disabledDate = (current, selectDate) => {
    if (selectDate.current?.length > 0) {
      const startDate = selectDate.current[0];
      const endDate = selectDate.current[1];
      if (
        (current.diff(startDate, 'days') <= 30 && moment().add(0, 'days') >= current) ||
        (current.diff(endDate, 'days') >= -30 && moment().add(0, 'days') >= current)
      ) {
        return false;
      } else {
        return true;
      }
    }
    return moment().add(0, 'days') <= current;
  };

  return (
    <>
      {viewDetail ? (
        <>
          <div className={styles.titleWrapper}>
            <Title level={2}>{detailCampaign?.name || ''}</Title>
            {(detailCampaign?.status === 'running' || detailCampaign?.status === 'pending') && (
              <Button className={styles.startBtn}>
                <Popconfirm
                  title="Bạn có chắc muốn hoàn thành chiến dịch này?"
                  onConfirm={() => handleStopCampaign(detailCampaign)}
                  okText="Yes"
                  cancelText="No"
                >
                  Hoàn thành chiến dịch
                </Popconfirm>
              </Button>
            )}
          </div>
          <Space style={{ marginBottom: 30 }}>
            <Button
              disabled={
                detailCampaign?.status === 'running' || detailCampaign?.status === 'pending'
                  ? false
                  : true
              }
              icon={
                <PlayPause
                  disabled
                  paused={detailCampaign?.status === 'running' ? 'paused' : 'play'}
                  style={{ color: '#000', marginTop: 2 }}
                />
              }
              onClick={() => handleChangeStatus(detailCampaign)}
            >
              {detailCampaign?.status === 'pending' ? 'Bắt đầu' : 'Tạm dừng'}
            </Button>
            {(api.ENV === 'local' || api.ENV === 'dev') && (
              <Button icon={<PhoneOutlined />} onClick={() => callDemo(match?.params?.id)}>
                Chạy thử nghiệm
              </Button>
            )}
            <Button
              icon={<EditOutlined />}
              onClick={() => history.push(`/config/campaign-management-2/${match?.params?.id}`)}
              disabled={detailCampaign?.status === 'running' ? true : false}
            >
              Chỉnh sửa
            </Button>
            <Button icon={<CopyOutlined />} onClick={() => duplicateCampaign(detailCampaign)}>
              Sao chép
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={() => {
                openModal(dispatch);
                changeContentModal(
                  {
                    title: '',
                    content: (
                      <ConfirmModal
                        description="Bạn có chắc chắn muốn xóa chiến dịch này?"
                        onConfirm={() => {
                          deleteCampaign(match?.params?.id);
                          closeModal(dispatch);
                        }}
                        onCancel={() => closeModal(dispatch)}
                      />
                    ),
                    width: 400,
                    footer: {
                      footer: null,
                      onCancel: () => {
                        closeModal(dispatch);
                      },
                    },
                    bodyStyle: {
                      padding: '20px 20px',
                    },
                  },
                  dispatch,
                );
              }}
              disabled={detailCampaign?.status === 'running' ? true : false}
            >
              Xoá
            </Button>
          </Space>
          <CardLayout
            title="Thông tin chiến dịch"
            icon={<InfoCircleFilled style={{ color: '#526eff' }} />}
            suffix={
              <>
                <CustomDatePicker
                  campaignId={match?.params?.id}
                  headers={headers}
                  ref={componentRef}
                  format={dateFormat}
                  /* value={[
                    moment(paramsFilter.startDate, dateFormat),
                    moment(paramsFilter.endDate, dateFormat),
                  ]} */
                  placeholder={['Từ ngày', 'Đến ngày']}
                  onChange={handleChangeDatePicker}
                />
              </>
            }
          >
            <CampaignInfo detailCampaign={detailCampaign} phoneCall={phoneCall} />
          </CardLayout>
          {api.ENV === 'local' || api.ENV === 'dev' ? (
            <>
              <CardLayout
                title="Tổng quan"
                icon={<PieChartFilled style={{ color: '#526eff' }} />}
                suffix={
                  <>
                    <RangePicker
                      onChange={(e) => onSelectSumaryReport(e, detailCampaign.campaign_id)}
                      defaultValue={[
                        rangeDate.fromData ? moment(rangeDate.fromData) : '',
                        rangeDate.toDate ? moment(rangeDate.toDate) : '',
                      ]}
                      disabledDate={(current) => disabledDate(current, selectDate)}
                      onCalendarChange={(e) => {
                        selectDate.current = e;
                      }}
                    />
                    <Button
                      className={styles['btn-export']}
                      type="primary"
                      icon={
                        <Image
                          className={styles['export-icon']}
                          preview={false}
                          alt="icon export"
                          src={exportIcon}
                        />
                      }
                    >
                      Export lịch sử cuộc gọi
                    </Button>
                  </>
                }
              >
                <General
                  reportCalling={reportCalling}
                  rangeDate={rangeDate}
                  headers={headers}
                  campaign_id={match.params.id}
                />
              </CardLayout>
              <CardLayout
                title="Số lượng cuộc gọi ra"
                icon={<PhoneFilled style={{ color: '#526eff' }} />}
              >
                <AmountOutbound
                  rangeDate={rangeDate}
                  headers={headers}
                  campaign_id={match.params.id}
                />
              </CardLayout>
              <CardLayout
                title="Thống kê cuộc gọi thất bại và lỗi"
                icon={<CloseCircleFilled style={{ color: '#FF4D4F' }} />}
                type="error"
              >
                <FailedErrorStatistic
                  rangeDate={rangeDate}
                  headers={headers}
                  campaign_id={match.params.id}
                />
              </CardLayout>
            </>
          ) : (
            <CardLayout
              title="Thời gian đã cấu hình"
              icon={<InfoCircleFilled style={{ color: '#526eff' }} />}
            >
              <TimeConfig detailCampaign={detailCampaign} />
            </CardLayout>
          )}
        </>
      ) : (
        <NoDataPermission />
      )}
    </>
  );
}

export default connect(({ user }) => ({ user }))(DetailCampaign);

ModalCallDemo.propTypes = {
  formRef: PT.oneOfType([PT.instanceOf(null), PT.object]).isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  campaignId: PT.string.isRequired,
  handleChangeStateModal: PT.func.isRequired,
};

function ModalCallDemo({ formRef, headers, campaignId, handleChangeStateModal }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (formRef) {
      // eslint-disable-next-line no-param-reassign
      formRef.current = form;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleFinish = useCallback(
    async ({ phoneNumber }) => {
      try {
        const res = await requestCallDemo(headers, campaignId, phoneNumber);
        if (res.success) {
          handleChangeStateModal(false);
          return message.success('Gọi thử nghiệm thành công.');
        }
        throw new Error('ERROR~');
      } catch (err) {
        console.error(err.toString());
        message.warning('Gọi thử nghiệm thất bại. ');
        return null;
      }
    },
    [campaignId, headers, handleChangeStateModal],
  );

  return (
    <Form layout="vertical" form={form} onFinish={handleFinish}>
      <Form.Item
        name="phoneNumber"
        label={<FormattedMessage id="pages.campaign-management.phone.number" />}
        rules={[
          {
            pattern: new RegExp('^[0-9]{10,11}$'),
            message: <FormattedMessage id="pages.campaign-management.invalid.phone.number" />,
            required: true,
          },
        ]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>
    </Form>
  );
}

ModalDuplicate.propTypes = {
  formRef: PT.oneOfType([PT.instanceOf(null), PT.object]).isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  campaign: PT.instanceOf(Object).isRequired,
  handleChangeStateModal: PT.func.isRequired,
  handleCreateCampaign: PT.func.isRequired,
};

function ModalDuplicate({
  formRef,
  headers,
  campaign,
  handleChangeStateModal,
  requestCreateCampaign,
  requestUpdateCampaignConfig,
  new_campaign_script,
  update_campaign_script,
}) {
  const [form] = Form.useForm();
  const [name, setName] = useState(`${campaign.name} (1)`);

  useEffect(() => {
    if (formRef) {
      // eslint-disable-next-line no-param-reassign
      formRef.current = form;
    }
    const data = {
      offset: 1,
      limit: 1000,
      filter_data: {
        campaign_type: [],
        status: [],
        unit: [],
        department: [],
        from_day: '',
        to_day: '',
      },
      search_name: campaign.name,
    };

    requestGetCampaigns({ headers, data })
      .then((res) => {
        const listCampaign = res.data.map((item) => item.name);
        let c = 1;
        while (listCampaign.includes(`${campaign.name} (${c})`)) {
          c++;
        }
        setName(`${campaign.name} (${c})`);
      })
      .catch((err) => console.log(err));

    formRef.current.setFieldsValue({ campaignName: name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, name]);

  const handleFinish = useCallback(
    async ({ campaignName }) => {
      try {
        // const data = {
        //   name: campaignName,
        //   type: campaign.type,
        //   data_id: campaign.data_id,
        //   data_type: campaign.data_type,
        // };
        const data = {
          name: campaignName,
          campaign_id: campaign.campaign_id,
        };
        const res = await requestDuplicateCampaign(headers, data);
        if (res?.success) {
          // if (campaign.script !== undefined) {
          //   const createScript = await new_campaign_script(headers, {
          //     campaign_id: res?.data[0]?.campaign_id,
          //   });
          //   if (createScript.success) {
          //     const resUpdateScript = await update_campaign_script(headers, {
          //       campaign_id: res?.data[0]?.campaign_id,
          //       configuration: campaign?.script?.configuration,
          //     });
          //     if (!resUpdateScript.success) {
          //       throw new Error(resUpdateScript.error);
          //     }
          //   } else {
          //     throw new Error(resUpdateScript.error);
          //   }
          // }

          // if (campaign.configuration !== undefined) {
          //   const resUpdateConfig = await requestUpdateCampaignConfig(headers, {
          //     campaign_id: res.data[0].campaign_id,
          //     ...campaign.configuration,
          //   });

          //   if (!resUpdateConfig.success) {
          //     throw new Error(resUpdateConfig.error);
          //   }
          // }
          message.success('Sao chép chiến dịch thành công');

          handleChangeStateModal(false);
        } else {
          // message.warning(
          //   `Sao chép chiến dịch thất bại, ${
          //     res?.error.includes('name')
          //       ? 'Lỗi tên'
          //       : res?.error.includes('exists')
          //       ? 'Tên campaign đã tồn tại'
          //       : res?.error
          //   }`,
          // );
        }
      } catch (error) {
        // return message.warning(`Sao chép chiến dịch thất bại. ${error}`);
      }
    },
    [campaign, headers, handleChangeStateModal],
  );

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={handleFinish}
      initialValues={{ campaignName: name }}
    >
      <Form.Item
        name="campaignName"
        label={<FormattedMessage id="pages.campaign-management.name" />}
        rules={[
          {
            message: 'Tên không được để trống',
            required: true,
          },
        ]}
      >
        <Input placeholder="Nhập tên chiến dịch" key={name} />
      </Form.Item>
    </Form>
  );
}
