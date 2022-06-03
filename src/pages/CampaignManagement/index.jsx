import React, { useState, useCallback, useEffect } from 'react';
import { connect, FormattedMessage, formatMessage } from 'umi';
import PT from 'prop-types';
import { LeftOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Card, message, Button } from 'antd';
import styles from './styles.less';
import Modal from '@/components/Modal';
import {
  requestGetCustomerByFilename,
  requestCreateScenarioes,
  requestCreateStrageties,
  requestCreateCampaigns,
  requestUpdateStrageties,
  requestUpdateScenario,
  requestOmniContactListNormalizations,
  requestUpdateCampaign,
  requestDeleteCampaign,
  requestCallDemo,
  requestExportReportCampaign
} from './service';
import Campaign from './components/Campaign';
import RenderStep1 from './components/Step1';
import RenderStep2 from './components/Step2';
import RenderStep3 from './components/Step3';
import RenderStep4 from './components/Step4';
import RenderStep5 from './components/Step5';
import CallDemo from './components/Form/CallDemo';
import DuplicateCampaign from './components/Form/DuplicateCampaign';
import { PageContainer } from '@ant-design/pro-layout';
import { checkPermission, VoiceBot } from '@/utils/permission';

CampaignManagement.propTypes = {
  dispatch: PT.func.isRequired,
  voicebot: PT.instanceOf(Object).isRequired,
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    userId: PT.string,
    authToken: PT.string,
    tokenGateway: PT.string,
    tokenHub: PT.string
  }).isRequired,
  campaign: PT.shape({
    nameCampaign: PT.string,
    scenario: PT.string,
    initialValues: PT.instanceOf(Object),
    openForm: PT.bool,
    showTableStep2: PT.bool,
    data: PT.instanceOf(Array),
    sipProfile: PT.array,
  }).isRequired,
};

function CampaignManagement({
  dispatch,
  voicebot,
  user: { currentUser, userId, authToken, tokenGateway, tokenHub },
  campaign,
  ...rest
}) {
  const [step, setStep] = useState(1);
  // const [showTable, setShowTable] = useState(false);
  const { nameCampaign, initialValues, sipProfile, data, openForm, showTableStep2 } = campaign;
  const [inputNumber, setInputNumber] = useState('1');
  const sipProfileData = sipProfile[0]?.gateway_uuid || 'd068731b-1feb-4f2d-a45d-70683aa38eda';
  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`,
  };
  const setNameCampaign = (_nameCampaign) => {
    dispatch({
      type: 'campaign/execution',
      payload: {
        nameCampaign: _nameCampaign,
      },
    });
  };

  const toggleForm = (state) => {
    dispatch({
      type: 'campaign/execution',
      payload: {
        openForm: state,
      },
    });
  };

  const classTitle = useCallback((title, stateStep, isUpdate) => {
    if (isUpdate) {
      const className = `${styles.title_active} ${styles.pointer}`;
      if (title === stateStep) {
        return `${className} ${styles['title-current-active']}`;
      }
      return className;
    }
    return title <= stateStep ? styles.title_active : styles.title_deactive;
  }, []);

  const onClickStep = useCallback(
    (stepChange, type) => {
      if (type === 'custom') {
        return setStep(stepChange);
      }
      if (stepChange - step > 1) return false;
      return setStep(stepChange);
    },
    [step],
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

  const handleChangeStateModal = useCallback(
    (stateModal) => {
      dispatch({
        type: 'modal/showModal',
        payload: stateModal,
      });
    },
    [dispatch],
  );

  const getRecord = useCallback(
    async (id) => {
      // console.log(record);
      try {
        if (!id) {
          throw new Error('Missing id');
        }
        const result = await requestGetCustomerByFilename(headers, {
          filter: {
            where: { xlsContactListHistory: id },
          },
        });
        result.pop();
        dispatch({
          type: 'campaign/execution',
          payload: {
            data: result,
            initialValues: {
              ...initialValues,
              omniContactListBase: id,
            },
            openForm: true,
          },
        });
        handleChangeStateModal(false);
        return true; // để kiểm tra fetch data oke hay k
      } catch (err) {
        // message.error(err.toString());
        return false;
      }
    },
    [authToken, dispatch, handleChangeStateModal, initialValues, userId],
  );

  const fetchListNormalizations = useCallback(
    async (record) => {
      try {
        const res = await requestOmniContactListNormalizations(headers, {
          filter: {
            where: { xlsContactListHistory: record.id },
          },
        });
        dispatch({
          type: 'campaign/execution',
          payload: {
            data: res,
          },
        });
      } catch (err) {
        // message.error(err.toString());
      }
    },
    [dispatch],
  );

  const handleCreateScenarioes = useCallback(
    async (values) => {
      const hide = message.loading('Đang thêm, vui lòng đợi');
      try {
        const res = await requestCreateScenarioes(headers, values);
        if (!res.error) {
          hide();
          message.success(`create #${res.scenarioes[0].scenario_name} successfuly`);
          dispatch({
            type: 'campaign/execution',
            payload: {
              initialValues: {
                ...initialValues,
                campaignScenario: res.scenarioes[0],
              },
              nameCampaign: values.scenario_name,
            },
          });
          onClickStep(4);
          return true;
        }
        throw new Error(res.error);
      } catch (err) {
        hide();
        // message.error(err.toString());
        return false;
      }
    },
    [dispatch, initialValues, onClickStep],
  );

  const handleCreateCampaign = useCallback(
    async (idScenario, idStrategy, idContactList, idGateway) => {
      const resCampaigns = await requestCreateCampaigns(headers, {
        campaignScenario: idScenario,
        campaignStrategies: idStrategy,
        omniContactListBase: idContactList,
        createby: currentUser?.username || 'unknown',
      });
      if (resCampaigns.success) {
        // message.success(`create campaigns successfuly`);
        // save campaign id call demo
        dispatch({
          type: 'campaign/fetchListCampaigns',
          payload: resCampaigns?.campaigns[0]?._id,
          headers,
        });
        return resCampaigns;
      }
      // throw new Error(resCampaigns.error);
      // message.error(resCampaigns.error);
      return {
        success: false,
      };
    },
    [currentUser?.username, dispatch],
  );

  const handleCreateStrageties = useCallback(
    async (values) => {
      const hide = message.loading('Đang thêm, vui lòng đợi');
      try {
        const res = await requestCreateStrageties(
          {},
          {
            ...values,
            // pbxGateWay: sipProfileData || 'd068731b-1feb-4f2d-a45d-70683aa38eda',
          },
        );
        if (res.success && res?.strategies?.length > 0) {
          hide();
          message.success(`create strageties successfuly`);
          dispatch({
            type: 'campaign/execution',
            payload: {
              initialValues: {
                ...initialValues,
                campaignStrategies: res.strategies[0],
              },
            },
          });
          // request create campaign
          const result = await handleCreateCampaign(
            initialValues.campaignScenario._id,
            res.strategies[0]._id,
            initialValues.omniContactListBase,
            // sipProfileData,
          );
          if (result.success) {
            message.success(`create campaigns successfully`);
            dispatch({
              type: 'campaign/execution',
              payload: {
                initialValues: {
                  ...initialValues,
                  _id: result?.campaigns[0]?._id,
                },
              },
            });
            onClickStep(5);
            return true;
          }
        }
        throw new Error(res.error);
      } catch (err) {
        hide();
        // message.error(err.toString());
        return false;
      }
    },
    [dispatch, handleCreateCampaign, initialValues, onClickStep, sipProfileData],
  );

  const handleUpdateStrageties = useCallback(
    async (values, id) => {
      const hide = message.loading('Đang update, vui lòng đợi');
      try {
        const res = await requestUpdateStrageties(headers, values, id);
        if (res.success) {
          hide();
          message.success(`update strageties thành công`);
          dispatch({
            type: 'campaign/execution',
            payload: {
              initialValues: {
                ...initialValues,
                campaignStrategies: res.strategies[0],
              },
            },
          });
          return true;
        }
        throw new Error(res.error);
      } catch (err) {
        hide();
        // message.error(err.toString());
        return false;
      }
    },
    [dispatch, initialValues],
  );

  const handleUpdateScenario = useCallback(
    async (values, id) => {
      const hide = message.loading('Đang update, vui lòng đợi');
      try {
        const res = await requestUpdateScenario(headers, values, id);
        if (initialValues._id) {
          await requestUpdateStrageties(
            headers,
            {
              st_name: values.scenario_name,
              updateby: currentUser?.username || 'unknown',
            },
            initialValues.campaignStrategies._id,
          );
        }
        if (res.success) {
          hide();
          message.success(`Update scenario thành công`);
          dispatch({
            type: 'campaign/execution',
            payload: {
              initialValues: {
                ...initialValues,
                campaignScenario: res.scenarioes[0],
              },
              nameCampaign: values.scenario_name,
            },
          });
          if (!initialValues._id) {
            onClickStep(4, 'custom');
          }
          return true;
        }
        throw new Error(res.error);
      } catch (err) {
        hide();
        // message.error(err.toString());
        return false;
      }
    },
    [currentUser, dispatch, initialValues, onClickStep],
  );

  const handleCreateNewListCustomer = () => {
    rest.history.push({
      pathname: '/campaign',
      state: { fromStep2Management: true },
    });
  };

  const getSipProfile = () => {
    dispatch({
      type: 'campaign/getSipProfile',
      headers,
    });
  };

  const updateCampaign = useCallback(
    async (dataCampaign, id) => {
      const hide = message.loading('Đang update, vui lòng đợi');
      try {
        const res = await requestUpdateCampaign(
          headers,
          { ...dataCampaign, updateby: currentUser?.username || 'unknown' },
          id,
        );
        if (res?.success && res?.campaigns) {
          hide();
          dispatch({
            type: 'campaign/fetchListCampaigns',
            payload: res?.campaigns[0]?._id,
            headers,
          });
          return res;
        }
        throw new Error(res.error || 'ERROR!');
      } catch (err) {
        hide();
        // message.error(err.toString());
        return {};
      }
    },
    [currentUser?.username, dispatch],
  );

  const deleteCampaign = async (id) => {
    const res = await requestDeleteCampaign(headers, id);
    return res;
  };

  const checkIsNumber = (str) => {
    return /^\d+$/.test(str);
  };

  const callDemo = (id, phoneNumber) => {
    if (phoneNumber && checkIsNumber(phoneNumber)) {
      requestCallDemo(headers, id, phoneNumber).then((res) => {
        if (res.status === 'OK') {
          return message.success('Call success');
        }
        return message.warning('Call fail');
      });
      return handleChangeStateModal(false);
    }
    return message.warning('Số điện thoại không hợp lệ');
  };

  const handleOnClickCallDemo = (id) => {
    handleChangeStateModal(true);
    handleChangeElementModal({
      title: <FormattedMessage id="pages.campaign-management.call.test.enter" />,
      content: <CallDemo id={id} callDemo={callDemo} />,
      footer: {
        footer: null,
        onCancel: () => handleChangeStateModal(false),
      },
    });
  };

  const handleOnClickExportReport = campaignID => {
    // const params = {
    //   // "token": "",
    //   // "campaignID": "ddb06de6-f24d-437c-a032-c4d9627b42b0",
    //   // "name": "Test-Report campaign-12-04-2021",
    //   // "format": "xlsx",
    //   // "type": "session"
    //   token: tokenHub,
    //   campaignID,
    //   type: "session"
    // }
    return requestExportReportCampaign(headers, tokenHub, campaignID).then(blob => {
      let link = document.createElement("a");
      link.href = URL.createObjectURL(new Blob([blob], { type: "application/vnd.ms-excel" }));
      link.download = '123.xlsx';
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    })
  };

  // ~ effects ~
  useEffect(() => {
    getSipProfile();
  }, []);

  // kiểm tra thêm mới khách hàng gọi ra
  useEffect(() => {
    // console.log(rest.location)
    if (rest?.location?.state?.id) {
      getRecord(rest.location.state.id);
      const state = { ...rest.location.state };
      delete state.id;
      rest.history.replace({ ...rest.history.location, state });
      onClickStep(2, 'custom');
      dispatch({
        type: 'campaign/execution',
        payload: {
          showTableStep2: true,
        },
      });
    }
  }, [dispatch, getRecord, onClickStep, rest.history, rest.location.state]);

  const duplicateCampaign = async (name) => {
    // console.log({ campaign });
    const {
      createtime,
      updateby,
      updatetime,
      _id,
      ...scenarioCopy
    } = campaign?.initialValues?.campaignScenario;
    scenarioCopy.ScenarioModel.scenario_name = name;
    const newScenario = { ...scenarioCopy, scenario_name: name };
    const tempStrategy = campaign?.initialValues?.campaignStrategies;
    delete tempStrategy.updateby;
    delete tempStrategy.updatetime;
    delete tempStrategy._id;
    const newStrategy = { ...tempStrategy, st_name: name };
    const resScenario = await requestCreateScenarioes(headers, newScenario);
    const resStrategy = await requestCreateStrageties(headers, newStrategy);
    const idScenario = (resScenario?.success && resScenario?.scenarioes[0]?._id) || '';
    const idStrategy = (resStrategy?.success && resStrategy?.strategies[0]?._id) || '';
    const idContactList = campaign?.initialValues?.omniContactListBase;

    const { success } = await handleCreateCampaign(
      idScenario,
      idStrategy,
      idContactList,
      sipProfileData,
    );
    if (success) {
      message.success(`create campaigns successfuly`);
      onClickStep(1);
    }
    handleChangeStateModal(false);
  };

  const handleClickDuplicateCampaign = () => {
    handleChangeStateModal(true);
    handleChangeElementModal({
      title: <FormattedMessage id="pages.campaign-management.campaign.name.enter" />,
      content: <DuplicateCampaign duplicateCampaign={duplicateCampaign} />,
      footer: {
        footer: null,
        onCancel: () => handleChangeStateModal(false),
      },
    });
  };

  return (
    // <PageContainer>
      <Card
        className={styles.card}
        title={
          openForm && (
            <div style={{ display: 'flex' }}>
              <Typography.Title
                className={styles.title_active}
                style={{ marginBottom: 0 }}
                level={3}
              >
                {initialValues?.campaign_id && (
                  <LeftOutlined
                    onClick={() => {
                      onClickStep(1, 'custom');
                      dispatch({
                        type: 'campaign/execution',
                        payload: {
                          openForm: false,
                          showTableStep2: false,
                          initialValues: {},
                          nameCampaign: '',
                          listBgMusic: [],
                        },
                      });
                    }}
                  />
                )}
                <FormattedMessage id="pages.campaign-management.title" />
              </Typography.Title>
            </div>
          )
        }
        bordered={false}
      >
        <Row className={styles.row} gutter={[24, 8]}>
          {!openForm && (
            <Col span={24}>
              <Campaign
                // handleChangeElementModal={handleChangeElementModal}
                // handleChangeStateModal={handleChangeStateModal}
                onClickStep={onClickStep}
                handleOnClickCallDemo={handleOnClickCallDemo}
                dispatch={dispatch}
                getRecord={fetchListNormalizations}
                updateCampaign={updateCampaign}
                deleteCampaign={deleteCampaign}
                user={currentUser}
                headers={headers}
              />
            </Col>
          )}
          {openForm && (
            <>
              <Col span={6} className={styles.col}>
                <Typography.Title
                  className={classTitle(1, step, Object.keys(initialValues).length > 0)}
                  onClick={() => {
                    if (step > 1) {
                      onClickStep(1);
                    }
                  }}
                  level={4}
                >
                  <FormattedMessage id="pages.campaign-management.step1" />
                </Typography.Title>
                <Typography.Title
                  className={classTitle(
                    2,
                    step,
                    Object.keys(initialValues).length > 0 && initialValues.omniContactListBase,
                  )}
                  onClick={async () => {
                    if (step > 2 && Object.keys(initialValues).length === 0) {
                      onClickStep(2);
                    } else if (
                      Object.keys(initialValues).length > 0 &&
                      initialValues.omniContactListBase
                    ) {
                      const isOpen = await getRecord(initialValues.omniContactListBase);
                      if (isOpen) {
                        dispatch({
                          type: 'campaign/execution',
                          payload: {
                            showTableStep2: true,
                          },
                        });
                      }
                      onClickStep(2, 'custom');
                    }
                  }}
                  level={4}
                >
                  <FormattedMessage id="pages.campaign-management.step2" />
                </Typography.Title>
                <Typography.Title
                  className={classTitle(
                    3,
                    step,
                    Object.keys(initialValues).length > 0 && initialValues.campaignScenario,
                  )}
                  onClick={() => {
                    if (step > 3) {
                      onClickStep(3);
                    } else if (
                      Object.keys(initialValues).length > 0 &&
                      initialValues.campaignScenario
                    ) {
                      onClickStep(3, 'custom');
                    }
                  }}
                  level={4}
                >
                  <FormattedMessage id="pages.campaign-management.step3" />
                </Typography.Title>
                <Typography.Title
                  className={classTitle(
                    4,
                    step,
                    Object.keys(initialValues).length > 0 && initialValues.campaignStrategies,
                  )}
                  onClick={() => {
                    if (step > 4) {
                      onClickStep(4);
                    } else if (
                      Object.keys(initialValues).length > 0 &&
                      initialValues.campaignStrategies
                    ) {
                      onClickStep(4, 'custom');
                    }
                  }}
                  level={4}
                >
                  <FormattedMessage id="pages.campaign-management.step4" />
                </Typography.Title>
                <Typography.Title
                  className={classTitle(
                    5,
                    step,
                    Object.keys(initialValues).length > 0 && initialValues._id,
                  )}
                  onClick={() => {
                    if (step > 5) {
                      onClickStep(5);
                    } else if (Object.keys(initialValues).length > 0 && initialValues._id) {
                      onClickStep(5, 'custom');
                    }
                  }}
                  level={4}
                >
                  <FormattedMessage id="pages.campaign-management.step5" />
                </Typography.Title>
              </Col>
              <Col span={18}>
                {step === 1 && (
                  <RenderStep1
                    dispatch={dispatch}
                    onClickStep={onClickStep}
                    initialValues={nameCampaign}
                    headers={headers}
                  />
                )}
                {step === 2 && (
                  <RenderStep2
                    handleChangeElementModal={handleChangeElementModal}
                    handleChangeStateModal={handleChangeStateModal}
                    data={data || []}
                    showTable={showTableStep2}
                    getRecord={getRecord}
                    userId={userId}
                    authToken={authToken}
                    onClickStep={onClickStep}
                    dispatch={dispatch}
                    campaign={campaign}
                    handleCreateNewList={handleCreateNewListCustomer}
                    // setShowTable={setShowTable}
                    initialValues={initialValues}
                    updateCampaign={updateCampaign}
                    headers={headers}
                  />
                )}
                {step === 3 && (
                  <RenderStep3
                    handleChangeElementModal={handleChangeElementModal}
                    handleChangeStateModal={handleChangeStateModal}
                    data={data}
                    nameCampaign={nameCampaign}
                    user={currentUser}
                    handleCreateScenarioes={handleCreateScenarioes}
                    handleUpdateScenario={handleUpdateScenario}
                    onClickStep={onClickStep}
                    dispatch={dispatch}
                    campaign={campaign}
                    initialValues={initialValues}
                    headers={headers}
                    permissionVoiceBot={VoiceBot}
                    checkPermission={checkPermission}
                  />
                )}
                {step === 4 && (
                  <RenderStep4
                    handleCreateStrageties={handleCreateStrageties}
                    handleUpdateStrageties={handleUpdateStrageties}
                    nameCampaign={nameCampaign}
                    userId={userId}
                    authToken={authToken}
                    dispatch={dispatch}
                    campaign={campaign}
                    user={currentUser}
                    initialValues={initialValues}
                    getSipProfile={getSipProfile}
                    onClickStep={onClickStep}
                  />
                )}
                {step === 5 && (
                  <RenderStep5
                    handleChangeElementModal={handleChangeElementModal}
                    handleChangeStateModal={handleChangeStateModal}
                    campaign={campaign}
                    updateCampaign={updateCampaign}
                    user={currentUser}
                    handleOnClickCallDemo={handleOnClickCallDemo}
                    handleClickDuplicateCampaign={handleClickDuplicateCampaign}
                    onClickStep={onClickStep}
                    headers={headers}
                    tokenHub={tokenHub}
                    handleOnClickExportReport={handleOnClickExportReport}
                  />
                )}
              </Col>
            </>
          )}
        </Row>
        <Modal />
      </Card>
    // </PageContainer>
  );
}

export default connect(({ voicebot, user, campaign }) => ({ voicebot, user, campaign }))(
  CampaignManagement,
);
