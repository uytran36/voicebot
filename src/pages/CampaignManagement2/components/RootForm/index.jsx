/* eslint-disable camelcase */
import React, { useCallback, useEffect } from 'react';
import PT from 'prop-types';
import { Form, message } from 'antd';
import { flatToTreeData } from '../Step2/utils';
import {
  requestCreateScenarioes,
  requestCreateStrageties,
} from '@/services/campaign-management';
import { maskSlider } from '../Step2/hardCode';
import validator, { scenarioIntroductionValidate, scenarioDtmfValidate, step1Validate } from './validator';

// SCENARIOES
async function onCreateScenarioes(headers, values) {
  const hide = message.loading('Đang thêm, vui lòng đợi');
  try {
    const res = await requestCreateScenarioes(headers, values);
    if (!res.error) {
      hide();
      message.success(`Tạo mới #${res.scenarioes[0].scenario_name} thành công.`);
      return res;
    }
    throw new Error(res.error);
  } catch (err) {
    hide();
    console.error(err);
    message.warning('Có lỗi trong quá trình tạo mới.');
    return null;
  }
}

// STRAGETIES
async function onCreateStrageties(headers, values) {
  const hide = message.loading('Đang thêm, vui lòng đợi.');
  try {
    const res = await requestCreateStrageties(headers, values);
    if (res.success && res?.strategies?.length > 0) {
      hide();
      message.success(`Tạo mới strageties thành công.`);
      return res;
    }
    throw new Error(res.error);
  } catch (err) {
    hide();
    console.error(err);
    message.warning('Có lỗi trong quá trình tạo mới.');
    return null;
  }
}

RootForm.propTypes = {
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  currentStep: PT.oneOfType([PT.string, PT.number]).isRequired,
  setStep: PT.func.isRequired,
};

const formatDate = 'YYYY-MM-DD';
const formatTime = 'HH:mm';

function RootForm({
  children,
  currentStep,
  setStep,
  headers,
  campaign2,
  dispatch,
  onCreateCampaign,
  user,
  setMaxStep,
  currentUser,
}) {
  const [form] = Form.useForm(); // antd form v4;

  const handleSetupScenario = useCallback(
    (formValues) => {
      const { vocal, speed, wait_time_dtmf_sec, max_replay } = formValues;
      const { campaignScenario, campaignName, background_music } = campaign2;

      try {
        validator(scenarioIntroductionValidate)(campaignScenario.introdution);
        validator(scenarioDtmfValidate)({ dtmf: campaignScenario.dtmf });
      } catch (err) {
        console.error(err);
        message.warning('Không thể tạo mới scenario.');
        return null;
      }

      const dataProps = {
        is_replay: !!max_replay,
        max_replay,
        background_music: '',
        speed: maskSlider[speed] || '0',
        vocal,
        wait_time_dtmf_sec,
      };
      // setup data for introdution
      const introduction = {
        ...campaignScenario.introdution,
        ...dataProps,
      };
      // setup data for dtmf
      const dtmf = campaignScenario.dtmf.map((elm) => {
        return {
          ...elm,
          ...dataProps,
        };
      });
      const dtmfConverted = flatToTreeData([...dtmf], 'dtmf');
      return {
        scenario_name: campaignName,
        ScenarioModel: {
          scenario_name: campaignName,
          background_music,
          is_background_music: `${!!background_music}`,
          introduction: { ...introduction, dtmf: dtmfConverted || [] },
        },
      };
    },
    [campaign2],
  );

  const handleSetupStragetie = useCallback(
    (values) => {
      const {
        callTime,
        st_thoidiem,
        call_back,
        st_ringtime_sec,
        st_minpickuptime,
        st_callback_delay,
        st_callback_retry,
        st_maxcalltime_sec,
        ...other
      } = values;

      const opts = {
        st_callback_busy: !!call_back?.includes('st_callback_busy'),
        st_callback_pickuptime: !!call_back?.includes('st_callback_pickuptime'),
        st_callback_timeoutcall: !!call_back?.includes('st_callback_timeoutcall'),
        st_ringtime_sec: parseInt(st_ringtime_sec, 10),
        st_minpickuptime: parseInt(st_minpickuptime, 10),
        st_callback_delay: parseInt(st_callback_delay, 10),
        st_callback_retry: parseInt(st_callback_retry, 10),
        st_maxcalltime_sec: parseInt(st_callback_retry, 10),
      };

      return {
        ...other,
        ...opts,
        st_name: campaign2.campaignName,
        st_begin: `${callTime[0]?.format(formatDate)}:00:00:00`,
        st_end: `${callTime[1]?.format(formatDate)}:23:59:59`,
        st_thoidiem: st_thoidiem?.map((elm) => {
          return {
            from: elm.from[0].format(formatTime),
            to: elm.from[1].format(formatTime),
          };
        }) || [{}],
      };
    },
    [campaign2.campaignName],
  );

  const handleOnFinish = useCallback(
    async (values) => {
      if (currentStep === 0) {
        try {
          validator(step1Validate) ({
            campaignName: campaign2?.campaignName,
            omniContactID: campaign2?.omniContactID,
          })
        } catch(err) {
          message.warning('Bạn chưa nhập đủ thông tin.')
          console.error({err})
          return null;
        }
        dispatch({
          type: 'campaign2/execution',
          payload: {
            campaignName: values.name,
          },
        });
        setStep(currentStep + 1);
        setMaxStep(1);
        return null;
      }

      if (currentStep === 1) {
        const data = handleSetupScenario(values);
        const res = await onCreateScenarioes(headers, data);
        if (res) {
          setStep(currentStep + 1);
          setMaxStep(2);
          dispatch({
            type: 'campaign2/saveCampaignScenario',
            payload: {
              id: res.scenarioes[0]._id,
            },
          });
        }
        return null;
      }

      if (currentStep === 2) {
        const data = handleSetupStragetie(values);
        const res = await onCreateStrageties(headers, {
          ...data,
          createby: currentUser?.username || 'unknown',
        });
        if (res) {
          dispatch({
            type: 'campaign2/saveCampaignStragetie',
            payload: {
              id: res.strategies[0]._id,
            },
          });
          await onCreateCampaign(headers, {
            strategyID: res.strategies[0]._id,
            contactListBaseID: campaign2.omniContactID,
            scenarioID: campaign2.campaignScenario.id,
          });
          setStep(currentStep + 1);
          setMaxStep(3);
        }
        return null;
      }

      return null;
    },
    [
      campaign2.omniContactID,
      campaign2.campaignScenario.id,
      headers,
      currentStep,
      dispatch,
      setStep,
      handleSetupScenario,
      onCreateCampaign,
      handleSetupStragetie,
      currentUser?.username,
    ],
  );

  useEffect(() => {
    if (children) {
      // console.log('hiji');
      form.resetFields();
    }
  }, [form, children]);

  return (
    <Form
      initialValues={{
        name: campaign2.campaignName,
        vocal: campaign2.voiceSelect,
        wait_time_dtmf_sec: '1',
        max_replay: '1',
        st_maxcalltime_sec: '1',
        st_ringtime_sec: '1',
        st_minpickuptime: '1',
        st_callback_timeoutcall: false,
        st_callback_busy: false,
        st_callback_pickuptime: false,
        st_callback_delay: '1',
        st_callback_retry: '1',
      }}
      form={form}
      onFinish={handleOnFinish}
    >
      {children}
    </Form>
  );
}

export default React.memo(RootForm);
