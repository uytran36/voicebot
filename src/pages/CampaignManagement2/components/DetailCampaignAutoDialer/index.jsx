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
  DownloadOutlined,
} from '@ant-design/icons';
import Table from '@ant-design/pro-table';
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
} from '@/services/campaign-management';
import {
  requestHistoryCallCampaign,
  requestExportHistoryCallCampaign,
} from '@/services/call-center';
import General from './components/General';
import CampaignInfo from './components/CampaignInfo';
import styles from './styles.less';
import api from '@/api';
import { requestGetSipProfile } from '@/services/campaign-management';
import { openModal, closeModal, changeContentModal } from '@/components/ConfirmModal/openModal';
import ConfirmModal from '@/components/ConfirmModal';
import NoDataPermission from '@/components/NoDataPermission';
import { CAMPAIGN_MANAGEMENT, checkPermission } from '@/utils/permission';
import CallHistory from './components/CallHistory';

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
  const [reportCalling, setReportCalling] = useState({});
  const [reportHistory, setReportHistory] = useState([]);
  const [detailCampaign, setDetailCampaign] = useState({});
  const [fetchStatus, setFetchStatus] = useState(false);
  const [phoneCall, setPhoneCall] = useState('');
  const [rangeDate, setRangeDate] = useState({});
  const [data, setData] = useState([
    {
      day: '1/1',
      data: 12,
      type: 'Cuộc gọi thành công',
    },
    {
      day: '1/1',
      data: 24,
      type: 'Cuộc gọi thất bại',
    },
    {
      day: '1/1',
      data: 36,
      type: 'Cuộc gọi lỗi',
    },
    {
      day: '1/2',
      data: 21,
      type: 'Cuộc gọi thành công',
    },
    {
      day: '1/2',
      data: 32,
      type: 'Cuộc gọi thất bại',
    },
    {
      day: '1/2',
      data: 16,
      type: 'Cuộc gọi lỗi',
    },
    {
      day: '1/3',
      data: 14,
      type: 'Cuộc gọi thành công',
    },
    {
      day: '1/3',
      data: 33,
      type: 'Cuộc gọi thất bại',
    },
    {
      day: '1/3',
      data: 36,
      type: 'Cuộc gọi lỗi',
    },
    {
      day: '1/4',
      data: 14,
      type: 'Cuộc gọi thành công',
    },
    {
      day: '1/4',
      data: 33,
      type: 'Cuộc gọi thất bại',
    },
    {
      day: '1/4',
      data: 36,
      type: 'Cuộc gọi lỗi',
    },
    {
      day: '1/5',
      data: 14,
      type: 'Cuộc gọi thành công',
    },
    {
      day: '1/5',
      data: 12,
      type: 'Cuộc gọi thất bại',
    },
    {
      day: '1/5',
      data: 36,
      type: 'Cuộc gọi lỗi',
    },
    {
      day: '1/6',
      data: 14,
      type: 'Cuộc gọi thành công',
    },
    {
      day: '1/6',
      data: 3,
      type: 'Cuộc gọi thất bại',
    },
    {
      day: '1/6',
      data: 10,
      type: 'Cuộc gọi lỗi',
    },
  ]);
  const [listCampaign, setListCampaign] = useState([]);
  const [viewDetail, setViewDetail] = useState(false);

  // init state listCom

  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: tokenGateway,
  };
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
      const result = data[0];
      dataCall.callSuccess = result.total_established;
      dataCall.callFail = result.total_call - result.total_established;
      dataCall.callApproach = result.total_customer_success;
      dataCall.callNotApproach = result.total_customer - result.total_customer_success;
      dataCall.call5s = result.crr_duration_5s;
      dataCall.call15s = result.crr_duration_15s;
      dataCall.call30s = result.crr_duration_30s;
      dataCall.call31s = result.crr_duration_higher;
      dataCall.callDuration = result.crr_total_duration;
      dataCall.total_call = result.total_call;
      return setReportCalling(dataCall);
    }
  };

  const fetchDailySummaryReport = async (_data) => {
    try {
      const res = await requestReportCampaignSumary(headers, _data);
      if (res?.success) {
        // setReportCampaignSummary(res.data[0]);
        return formatReportDoughnut(res.data);
      }
      throw new Error(res?.error || 'ERROR!');
    } catch (err) {
      return console.error(err.toString());
    }
  };

  const fetchHistoryReportCalling = async (_data) => {
    try {
      // const res = await requestReportSessionCall(headers, _data);
      const res = await requestHistoryCallCampaign(headers, _data);
      if (res?.success && res?.data) {
        // setReportCampaignSummary(res.data[0]);
        return setReportHistory(res.data);
      }
      throw new Error(res?.error || 'ERROR!');
    } catch (err) {
      return console.error(err.toString());
    }
  };

  const fetchDetailCampaign = async (campaignId) => {
    try {
      const data = {
        headers,
        query: campaignId,
      };
      const res = await requestGetCampaigns(data);

      if (res?.success && res?.data[0]) {
        // setReportCampaignSummary(res.data[0]);
        setDetailCampaign(res.data[0]);
        return res?.data[0];
      }
      throw new Error(res?.error || 'ERROR!');
    } catch (err) {
      return console.error(err.toString());
    }
  };

  const getSipProfile = useCallback((pbxGateWay) => {
    requestGetSipProfile()
      .then((res) => {
        if (Array.isArray(res)) {
          res.forEach((item) => {
            if (item.gateway_uuid === pbxGateWay) {
              setPhoneCall(item.from_user);
            }
          });
          return null;
        }
        throw new Error('Response is not array');
      })
      .catch((err) => {
        console.error(err);
        message.warning('Không thể lấy được thông tin đầu số');
      });
  }, []);

  useEffect(async () => {
    if (match?.params?.id) {
      const campaign = await fetchDetailCampaign(match.params.id);
      if (campaign?.length === 1) {
        const data = {
          token: tokenHub,
          campaignID: campaign[0].campaign_id,
          fromDate: moment().subtract(1, 'months').startOf('day').toJSON(),
          toDate: moment().endOf('day').endOf('day').toJSON(),
        };
        const dataDetail = {
          scc_campaign_id: campaign[0].campaign_id,
          fromDate: moment().subtract(1, 'months').startOf('day').toJSON(),
          toDate: moment().endOf('day').endOf('day').toJSON(),
        };
        fetchDailySummaryReport(data);
        fetchHistoryReportCalling(dataDetail);
        getSipProfile(campaign[0].campaignStrategies.pbxGateWay);
      }
    }
  }, [fetchStatus]);

  useEffect(() => {
    if (
      checkPermission(currentUser?.permissions, CAMPAIGN_MANAGEMENT.allAutoCallCampaign) ||
      checkPermission(currentUser?.permissions, CAMPAIGN_MANAGEMENT.allAudoDialerCampaign)
    ) {
      setViewDetail(true);
    }
  }, []);

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
      fromDate: moment(date[0]).startOf('day').toJSON(),
      toDate: moment(date[1]).endOf('day').toJSON(),
    };

    setRangeDate({
      fromData: data.fromDate,
      toDate: data.toDate,
    });
  }, []);

  return (
    <>
      {viewDetail ? (
        <>
          <div className={styles.titleWrapper}>
            <Title level={2}>{detailCampaign?.name || ''}</Title>
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
            <Button icon={<PhoneOutlined />} onClick={() => callDemo(match?.params?.id)}>
              Chạy thử nghiệm
            </Button>
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
          >
            <CampaignInfo
              detailCampaign={detailCampaign}
              reportCalling={reportCalling}
              phoneCall={phoneCall}
            />
          </CardLayout>
          <CardLayout
            title="Tổng quan"
            icon={<PieChartFilled style={{ color: '#526eff' }} />}
            suffix={
              <RangePicker onChange={(e) => onSelectSumaryReport(e, detailCampaign.campaign_id)} />
            }
          >
            <General reportCalling={reportCalling} />
          </CardLayout>
          <CardLayout
            title="Lịch sử cuộc gọi"
            icon={<InfoCircleFilled style={{ color: '#526eff' }} />}
            suffix={
              <Space size={15}>
                {/* <RangePicker
                  onChange={onChangeDateReportDetail}
                  defaultValue={[dateReportDetail.fromDate, dateReportDetail.toDate]}
                /> */}
                <Button
                  style={{ background: '#127ace', color: '#fff' }}
                  icon={<DownloadOutlined style={{ color: '#fff' }} />}
                >
                  Tải xuống (excel)
                </Button>
              </Space>
            }
          >
            <CallHistory />
          </CardLayout>
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
      formRef.current = form;
    }
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
        const data = {
          name: campaignName,
          campaign_id: campaign.campaign_id,
        };
        const res = await requestDuplicateCampaign(headers, data);
        if (res?.success) {
          message.success('Sao chép chiến dịch thành công');

          handleChangeStateModal(false);
        } else {
          message.warning(
            `Sao chép chiến dịch thất bại, ${
              res?.error.includes('name')
                ? 'Lỗi tên'
                : res?.error.includes('exists')
                ? 'Tên campaign đã tồn tại'
                : res?.error
            }`,
          );
        }
      } catch (error) {
        return message.warning(`Sao chép chiến dịch thất bại. ${error}`);
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
