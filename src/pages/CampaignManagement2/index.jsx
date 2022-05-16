/* eslint-disable no-extra-boolean-cast */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { Input, Form, Typography, message, Button, Steps, Row, Col } from 'antd';
import { connect, FormattedMessage } from 'umi';
import CampaignList from './components/CampaignList';
import { PlusOutlined } from '@ant-design/icons';
import styles from './styles.less';
import {
  requestDeleteCampaign,
  requestCreateCampaign,
  requestGetCampaigns,
  new_campaign_script,
  update_campaign_script,
  requestUpdateCampaignConfig,
  requestDuplicateCampaign,
} from '@/services/campaign-management';
import EditCampaign from '../CampaignForm/EditCampaign';
import NoDataPermission from '@/components/NoDataPermission';
import { CAMPAIGN_MANAGEMENT, checkPermission, VoiceBot } from '@/utils/permission';
import AgentCM from './AgentCM';

const { Title } = Typography;
const { Step } = Steps;

CampaignManagement.propTypes = {
  dispatch: PT.func.isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
    currentUser: PT.instanceOf(Object),
  }).isRequired,
  history: PT.shape({
    push: PT.func,
    replace: PT.func,
    location: PT.instanceOf(Object),
  }).isRequired,
  location: PT.instanceOf(Object).isRequired,
  campaign2: PT.shape({
    campaignName: PT.string,
    omniContactID: PT.arrayOf(PT.string),
    campaignScenario: PT.object,
    campaignStrategies: PT.object,
  }).isRequired,
};

function CampaignManagement({
  dispatch,
  user: { userId, authToken, tokenGateway, currentUser, accessToken, refreshToken },
  history,
  campaign2,
}) {
  const formRef = useRef(null);
  const tableRef = useRef(null);
  const [isClickAddCampaign, setClickAddCampaign] = useState(false);
  const [isClickContinue, setClickContinue] = useState(false);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(step);
  const [headers, setHeaders] = useState({});
  const [initialValues, setInitialValue] = useState({});
  const [viewCampaignManagement, setViewCampaignManagement] = useState(false);

  useEffect(() => {
    setHeaders({
      Authorization: tokenGateway,
    });
  }, [authToken, currentUser?.permissions, tokenGateway, userId, accessToken, refreshToken]);

  useEffect(() => {
    if (
      checkPermission(currentUser?.permissions, CAMPAIGN_MANAGEMENT.viewAutoCallCampaignOnly) ||
      checkPermission(currentUser?.permissions, CAMPAIGN_MANAGEMENT.allAutoCallCampaign) ||
      checkPermission(currentUser?.permissions, CAMPAIGN_MANAGEMENT.viewAudoDialerCampaignOnly) ||
      checkPermission(currentUser?.permissions, CAMPAIGN_MANAGEMENT.allAudoDialerCampaign)
    ) {
      setViewCampaignManagement(true);
    }
  }, []);

  const refreshAllState = useCallback(() => {
    setInitialValue({});
    dispatch({
      type: 'campaign2/execution',
      payload: {
        campaignName: '',
        omniContactID: '',
        background_music: '',
        voiceSelect: '',
        campaignScenario: {
          id: '',
          introdution: {},
          dtmf: [],
        },
        campaignStrategies: {
          id: '',
        },
      },
    });
  }, [dispatch]);

  const handleBackStep = useCallback(() => {
    if (step >= 1) {
      setStep(step - 1);
    }
  }, [step, refreshAllState]);

  const onChange = (current) => {
    // Tạo mới phải step by step
    if (step < current && maxStep >= current) {
      setStep(current);
      return null;
    }
    if (step > current) {
      setStep(step - 1);
      return null;
    }
    return null;
    // setStep(current);
  };

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

  /**
   * @param {Object} [data] - request body
   * @param {String} [data.runner_status] - current status
   * @param {Stringg} [data.updateby] - user update
   * @param {String} campaignId
   * @returns {Object} - response request
   */
  const updateCampaign = useCallback(
    async (data, campaignId) => {
      const hide = message.loading('Đang update, vui lòng đợi');
      try {
        // const res = await requestUpdateCampaign(
        //   headers,
        //   { ...data, updateby: currentUser?.username || 'unknown' },
        //   campaignId,
        // );
        // if (res?.success && res?.campaigns) {
        //   hide();
        //   message.success(`Update successfuly`);
        //   dispatch({
        //     type: 'campaign/fetchListCampaigns',
        //     payload: res?.campaigns[0]?._id,
        //     headers,
        //   });
        //   return res;
        // }
        // throw new Error(res.error || 'ERROR!');
      } catch (err) {
        // hide();
        // message.error(err.toString());
        // return {};
      }
    },
    [currentUser?.username, dispatch, headers],
  );

  /**
   * @param {String} campaignId
   * @returns {Object} - response request
   */
  const deleteCampaign = useCallback(
    async (campaignId) => {
      const hide = message.loading('Đang delete, vui lòng đợi');
      try {
        hide();
        const res = await requestDeleteCampaign(headers, campaignId);
        if (res?.success) {
          message.success(`Delete successfully`);
        }
        return res;
      } catch (err) {
        // hide();
        // message.error(err.toString());
        // return {};
      }
    },
    [headers],
  );

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
   * @function Promise - Get omni contact list
   * @param {String} id - id xls contact list history
   * @param {Object} options - query api
   * @param {number} options.limit - records per page
   * @param {number} options.offset - bypass record
   * @return {Object} - data, total
   */

  const handleFormFinish = useCallback(
    async (values) => {
      console.log(values);
      try {
        if (step === 0) {
          setStep(1);
        }

        if (step === 1) {
          const filterList = values.filters;
          const dataFilter = [];
          for (let item of filterList) {
            const filterItem = item.filterItem;
            let entries = [];
            for (let itm of filterItem) {
              let val, range;
              if (itm.type.value === 'hour') {
                val = moment(itm.value).format('HH:mm');
                range = moment(itm.range).format('HH:mm');
              }

              if (itm.type.value !== 'date' && itm.type.value !== 'hour') {
                val = itm.value;
                range = itm.range;
              }
              entries.push([itm.type.value, [val, range]]);
            }
            const obj = Object.fromEntries(entries);

            dataFilter.push(obj);
          }

          const data = {
            campaign_id: campaign2.campaignInfo.campaign_id,
            gateway_phone_number: values?.gateway_phone_number,
            maximum_call_seconds: values?.maximum_call_seconds,
            ringing_call_seconds: values?.ringing_call_seconds,
            call_back_configuration: {
              busy: values?.call_back_configuration?.includes('busy') ? true : false,
              pickup_less_than_seconds: values?.call_back_configuration?.includes(
                'pickup_less_than_seconds',
              )
                ? values.pickup_less_than_seconds
                : 0,
              not_pickup: values?.call_back_configuration?.includes('not_pickup') ? true : false,
              others: values?.call_back_configuration?.includes('others') ? values.others : [],
              amount_call_back_times: values?.amount_call_back_times,
              call_back_delay_minutes: values?.call_back_delay_minutes,
            },
            send_record_after: values?.send_record_after,
            execution_datetime: dataFilter,
            bypass_datetime:
              values.bypass_datetime !== undefined
                ? values?.bypass_datetime.map((item) => item + 'T00:00:00Z')
                : [],
          };

          const res = await requestUpdateCampaignConfig(headers, data);
          if (res?.success) {
            setStep(2);
          } else {
            throw new Error(res?.error);
          }
        }
      } catch (err) {
        message.warning('Không thể tạo mới campaign.');
        connsole.error(err);
        return null;
      }
    },
    [step, campaign2, dispatch, headers, currentUser?.username],
  );

  const editCampaign = useCallback(
    (record) => {
      history.push(`/config/campaign-management-2/${record.id}`);
    },
    [history],
  );

  const duplicateCampaign = useCallback(
    (data, actionRef) => {
      handleChangeStateModal(true);
      handleChangeElementModal({
        bodyStyle: { padding: '10px' },
        width: 300,
        title: <FormattedMessage id="pages.campaign-management.campaign.duplicate.campaign" />,
        content: (
          <ModalDuplicate
            formRef={formRef}
            headers={headers}
            handleChangeStateModal={handleChangeStateModal}
            campaign={data}
            requestGetCampaigns={requestGetCampaigns}
            requestCreateCampaign={requestCreateCampaign}
            new_campaign_script={new_campaign_script}
            update_campaign_script={update_campaign_script}
            requestUpdateCampaignConfig={requestUpdateCampaignConfig}
            requestDuplicateCampaign={requestDuplicateCampaign}
            actionRef={actionRef}
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

  const content = (
    <Steps
      style={{ margin: '0 auto', minWidth: '10rem', maxWidth: '79rem' }}
      current={step}
      onChange={onChange}
      labelPlacement="vertical"
      responsive={true}
    >
      <Step
        title={<span style={{ whiteSpace: 'nowrap' }}>Chọn kịch bản</span>}
        // disabled={step >= 1 || !campaign2.campaignScenario.id}
      />
      <Step
        title={<span style={{ whiteSpace: 'nowrap' }}>Xây dựng kịch bản</span>}
        // disabled={step >= 1 || !campaign2.campaignScenario.id}
      />
      <Step
        title={<span style={{ whiteSpace: 'nowrap' }}>Cài đặt cấu hình</span>}
        // disabled={step >= 2 || !campaign2.campaignStrategies.id}
      />
      <Step
        title={<span style={{ whiteSpace: 'nowrap' }}>Hoàn thành</span>}
        // disabled={step === 3 || !initialValueEdit.campaignID}
      />
    </Steps>
  );

  const clickCampaignList = () => {
    setClickAddCampaign(false);
    setClickContinue(false);
  };

  return !isClickAddCampaign && !isClickContinue ? (
    <>
      {viewCampaignManagement ? (
        <>
          {currentUser.role_name === 'Agent' ? (
            <AgentCM />
          ) : (
            <>
              <Row style={{ marginLeft: 0 }}>
                <Col span={4}>
                  <Title level={3}>Quản lý chiến dịch</Title>
                </Col>
                <Col span={4} offset={16}>
                  <Row style={{ marginRight: 0, justifyContent: 'right' }}>
                    <Button
                      type="primary"
                      onClick={() => setClickAddCampaign(true)}
                      className={styles['btn-add']}
                    >
                      <PlusOutlined style={{ marginRight: '10px' }} />
                      Thêm chiến dịch
                    </Button>
                  </Row>
                </Col>
              </Row>

              <CampaignList
                clickAddCampaign={() => {
                  setClickAddCampaign(true);
                  setStep(0);
                }}
                headers={headers}
                currentUser={currentUser}
                actionRef={tableRef}
                updateCampaign={updateCampaign}
                callDemo={callDemo}
                deleteCampaign={deleteCampaign}
                editCampaign={editCampaign}
                duplicateCampaign={duplicateCampaign}
                setStep={setStep}
                setMaxStep={setMaxStep}
              />
            </>
          )}
        </>
      ) : (
        <NoDataPermission />
      )}
    </>
  ) : (
    <EditCampaign setClickAddCampaign={setClickAddCampaign} />
  );
}

export default connect(({ user, campaign2 }) => ({ user, campaign2 }))(CampaignManagement);

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

  // useEffect(() => {
  //   if (formRef) {
  //     // eslint-disable-next-line no-param-reassign
  //     formRef.current = form;
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [form]);

  const handleFinish = useCallback(
    async ({ phoneNumber }) => {
      try {
        // const res = await requestCallDemo(headers, campaignId, phoneNumber);
        // if (res.success) {
        //   handleChangeStateModal(false);
        //   return message.success('Gọi thử nghiệm thành công.');
        // }
        // throw new Error('ERROR~');
      } catch (err) {
        // console.error(err.toString());
        // message.warning('Gọi thử nghiệm thất bại. ');
        // return null;
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

function ModalDuplicate({
  formRef,
  headers,
  handleChangeStateModal,
  campaign,
  requestGetCampaigns,
  requestCreateCampaign,
  new_campaign_script,
  update_campaign_script,
  requestUpdateCampaignConfig,
  requestDuplicateCampaign,
  actionRef,
}) {
  const [form] = Form.useForm();
  const [name, setName] = useState(`${campaign.name} (1)`);
  const [detailCampaign, setDetailCampaign] = useState({});

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
      search_name: campaign?.name,
    };

    requestGetCampaigns({ headers, data })
      .then((res) => {
        const listCampaign = res.data.map((item) => item.name);

        let c = 1;
        while (listCampaign.includes(`${campaign?.name} (${c})`)) {
          c++;
        }
        setName(`${campaign?.name} (${c})`);
        formRef.current.setFieldsValue({ campaignName: `${campaign?.name} (${c})` });
      })
      .catch((err) => console.log(err));

    requestGetCampaigns({ headers, query: campaign.id })
      .then((res) => {
        if (res.success) {
          setDetailCampaign(res.data[0]);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, name]);

  const handleFinish = useCallback(
    async ({ campaignName }) => {
      try {
        // const data = {
        //   name: campaignName,
        //   type: campaign?.type,
        //   data_id: campaign?.data_id,
        //   data_type: detailCampaign?.data_type,
        // };
        const data = {
          name: campaignName,
          campaign_id: campaign?.id,
        };
        const res = await requestDuplicateCampaign(headers, data);
        if (res?.success) {
          // if (
          //   detailCampaign.script !== undefined &&
          //   Object.keys(detailCampaign?.script?.configuration)?.length !== 0
          // ) {
          //   const createScript = await new_campaign_script(headers, {
          //     campaign_id: res?.data[0]?.campaign_id,
          //   });
          //   if (createScript.success) {
          //     const resUpdateScript = await update_campaign_script(headers, {
          //       campaign_id: res?.data[0]?.campaign_id,
          //       configuration: detailCampaign?.script?.configuration,
          //     });
          //     if (!resUpdateScript.success) {
          //       throw new Error(resUpdateScript.error);
          //     }
          //   } else {
          //     throw new Error(resUpdateScript.error);
          //   }
          // }

          // if (detailCampaign.configuration !== undefined) {
          //   const resUpdateConfig = await requestUpdateCampaignConfig(headers, {
          //     campaign_id: res.data[0].campaign_id,
          //     ...campaign.configuration,
          //   });

          //   if (!resUpdateConfig.success) {
          //     throw new Error(resUpdateConfig.error);
          //   }
          // }
          message.success('Sao chép chiến dịch thành công');
          actionRef.current?.reload();
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
        handleChangeStateModal(false);
        // return message.warning(`Sao chép chiến dịch thất bại. ${error}`);
      }
    },
    [campaign, headers, handleChangeStateModal, detailCampaign],
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
        <Input placeholder="Nhập tên chiến dịch" />
      </Form.Item>
    </Form>
  );
}
