/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import { message, Button, Steps, Row, Col } from 'antd';
import { connect } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import Step1 from './components/Step1';
import Step2 from './components/Step2/AutoCall';
import AutoDialerScript from './components/Step2/AutoDialer';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import RootForm from './components/RootForm';
import styles from './styles.less';
import api from '@/api';
import {
  requestGetCampaigns,
  requestUpdateCampaign,
  requestUpdateCampaignConfig,
} from '@/services/campaign-management';
import PreConfig from './components/PreConfig';
import { LeftOutlined } from '@ant-design/icons';
import {
  new_campaign_script,
  getSampleScriptById,
  getScriptById,
} from '@/services/campaign-management';
import { nodeType } from './components/Step2/AutoCall/customizedComponent/CustomFlowElement/customNode';
import { requestGetExtensionNumber } from '@/services/campaign-management';

CampaignForm.propTypes = {
  dispatch: PT.func.isRequired,
  tokenGateway: PT.string.isRequired,
  userId: PT.string.isRequired,
  authToken: PT.string.isRequired,
  currentUser: PT.instanceOf(Object).isRequired,
  campaign2: PT.shape({
    campaignName: PT.string,
    omniContactID: PT.arrayOf(PT.string),
    campaignScenario: PT.object,
    campaignStrategies: PT.object,
  }).isRequired,
  match: PT.shape({
    params: PT.object,
  }).isRequired,
  history: PT.shape({
    push: PT.func,
  }).isRequired,
};

function CampaignForm({
  dispatch,
  history,
  match,
  tokenGateway,
  userId,
  currentUser,
  campaign2,
  setClickAddCampaign,
}) {
  const [preConfig, setPreConfig] = useState(true);
  const [dataCampaign, setDataCampaign] = useState({});
  const [step, setStep] = useState(0);
  const [headers, setHeaders] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [isSelected, setIsSelected] = useState(false);
  const [isSelectedErr, setIsSelectedErr] = useState(false);
  const [callTimeFilter, setCallTimeFilter] = useState([['', '', '', '', '', '', '', '']]);
  const [count, setCount] = useState([0]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [playbackValue, setPlaybackValue] = useState(1);
  const [year, setYear] = useState([]);
  const [month, setMonth] = useState([]);
  const [dayInMonth, setDayInMonth] = useState([]);
  const [weekInYear, setWeekInYear] = useState([]);
  const [weekInMonth, setWeekInMonth] = useState([]);
  const [dayInWeek, setDayInWeek] = useState([]);
  const [hour, setHour] = useState([]);
  const [maxEnableStep, setMaxEnableStep] = useState(0);

  const [cloneScript, setCloneScript] = useState();
  const campaignId = dataCampaign?.campaign_id || match?.params?.id;
  const isEdit = match?.params?.id !== undefined ? true : false;

  const OPTIONS = [
    { label: 'Năm', value: 'year', key: 'year' },
    { label: 'Tháng', value: 'month', key: 'month' },
    { label: 'Ngày trong tháng', value: 'dayInMonth', key: 'dayInMonth' },
    { label: 'Ngày trong tuần', value: 'dayInWeek', key: 'dayInWeek' },
    { label: 'Tuần trong năm', value: 'weekInYear', key: 'weekInYear' },
    { label: 'Tuần trong tháng', value: 'weekInMonth', key: 'weekInMonth' },
    { label: 'Ngày', value: 'date', key: 'date' },
    { label: 'Giờ', value: 'hour', key: 'hour' },
  ];

  const DAY_IN_WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const onStepChange = useCallback(
    (currentStep) => {
      if (currentStep <= maxEnableStep) {
        setStep(currentStep);
      }
    },
    [campaignId, step, maxEnableStep],
  );

  const handleBackStep = useCallback(() => {
    if (step >= 1) {
      setStep(step - 1);
    }
    if (step === 0) {
      history.push('/config/campaign-management-2');
    }
  }, [history, step]);

  /**
   * @function Promise - Get omni contact list
   * @param {String} id - id xls contact list history
   * @param {Object} options - query api
   * @param {number} options.limit - records per page
   * @param {number} options.offset - bypass record
   * @return {Object} - data, total
   */

  /**
   * @param {Object} [data] - request body
   * @param {String} [data.runner_status] - current status
   * @param {Stringg} [data.updateby] - user update
   * @param {String} campaignId
   * @returns {Object} - response request
   */
  const updateCampaign = useCallback(
    async (data, _campaignId) => {
      const hide = message.loading('Đang update, vui lòng đợi');
      try {
        const res = await requestUpdateCampaign(
          headers,
          { ...data, updateby: currentUser?.username || 'unknown' },
          _campaignId,
        );
        if (res?.success && res?.campaigns) {
          hide();
          message.success(`Update successfuly`);
          dispatch({
            type: 'campaign/fetchListCampaigns',
            payload: res?.campaigns[0]?._id,
            headers,
          });
          return res;
        }
        throw new Error(res?.error || 'ERROR!');
      } catch (err) {
        hide();
        message.error(err.toString());
        return {};
      }
    },
    [currentUser?.username, dispatch, headers],
  );

  const handleFormFinish = useCallback(
    async (values) => {
      try {
        if (step === 0) {
          jumpToStep(1);
        }

        if (step === 1 && dataCampaign?.type === 'autoCall') {
          jumpToStep(2);
        }

        if (
          (step === 2 && dataCampaign?.type === 'autoCall') ||
          (step === 1 && dataCampaign?.type !== 'autoCall')
        ) {
          const filterList = values.filters || [];
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
              if (itm.type.value === 'date') {
                val = moment(itm.value).format('DD/MM/YYYY');
                range = moment(itm.range).format('DD/MM/YYYY');
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
            campaign_id: campaignId,
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
            send_record_after:
              values.send_record_after === undefined ? 0 : values.send_record_after,
            execution_datetime: dataFilter,
            bypass_datetime:
              values.bypass_datetime !== undefined
                ? values?.bypass_datetime.map((item) => item + 'T00:00:00Z')
                : [],
          };

          if (
            values.call_back_configuration === undefined ||
            values.call_back_configuration?.length === 0
          ) {
            delete data.call_back_configuration;
          }

          if (filterList.length === 0) {
            delete data.execution_datetime;
          }

          const res = await requestUpdateCampaignConfig(headers, data);
          if (res?.success) {
            jumpToStep(3);
          } else {
            throw new Error(res?.error);
          }
        }
      } catch (err) {
        // message.warning(
        //   `Không thể cập nhật campaign. ${
        //     err.toString().includes('maximum_call_seconds')
        //       ? 'Trường Thời lượng tối đa mỗi cuộc gọi không được để trống!'
        //       : err.toString().includes('ringing_call_seconds')
        //       ? 'Trường Thời gian đổ chuông không được để trống!'
        //       : err.toString().includes('send_record_after')
        //       ? 'Trường Thời gian phát lời loại không được để trống!'
        //       : err.toString().includes('execution_datetime')
        //       ? 'Trường Thời gian gọi không được để trống!'
        //       : err.toString()
        //   }`,
        // );
        // console.error({ err });
        return null;
      }
      return null;
    },
    [campaign2, currentUser?.username, headers, initialValues, step, updateCampaign],
  );

  useEffect(() => {
    setHeaders({
      Authorization: tokenGateway,
    });
  }, [userId, tokenGateway]);

  const isEmpty = (obj) => {
    return obj === undefined || Object.keys(obj).length === 0;
  };

  useEffect(() => {
    const data = dataCampaign;
    let enableStep = 0;
    //enable step
    if (dataCampaign?.type === 'autoCall') {
      if (isEmpty(data?.configuration) && !isEmpty(data?.script?.configuration)) enableStep = 2; //TH2
      setStep(enableStep);
      if (!isEmpty(data?.configuration)) setMaxEnableStep(3);
      //TH3 - step 0 + max 3
      else setMaxEnableStep(enableStep);
    } else {
      if (isEmpty(data?.configuration) && !isEmpty(data?.script?.configuration)) enableStep = 1; //TH2
      setStep(enableStep);
      if (!isEmpty(data?.configuration)) setMaxEnableStep(2);
      //TH3 - step 0 + max 3
      else setMaxEnableStep(enableStep);
    }

    //Sau khi tạo chiến dịch mới
    //TH1 - dừng ở bước 1 - chưa tạo kịch bản => về bước 0 - max = 0
    //TH2 - dừng ở bước 2 - không lưu kịch bản => về bước 0 - max = 0
    //TH3 - dừng ở bước 3 - đã có kịch bản + chưa có cấu hình => về bước 2 cấu hình  - max = 2
    //TH3 - cấu hỉnh hoàn tất - về bước 0 - max = 3

    //Các trường hợp dừng khi tạo hoặc chỉnh sửa chiến dịch
    //TH1 - dừng ở bước 1 - chưa tạo kịch bản => bắt đầu xem từ màn chọn kịch bản như tạo mới
    //TH2 - dừng ở bước 2 - không lưu kịch bản => bắt đầu xem từ chọn kịch bản như tạo mới
    //TH3 - dừng ở bước 3 - đã có kịch bản + chưa có cấu hình => bắt đầu xem từ màn cấu hình, có thể quay lại bước trước đó
    //TH4 - cấu hỉnh hoàn tất => bắt đầu xem từ màn chọn kịch bản, có thể chọn các bước sau đó
  }, [dataCampaign?.data_id]);

  useEffect(() => {
    if (Object.keys(headers).length > 0 && campaignId !== undefined) {
      requestGetCampaigns({ headers, query: campaignId })
        .then((res) => {
          if (res.success) {
            setDataCampaign(res.data[0]);

            //kich ban
            const script = res?.data[0]?.script?.configuration;
            if (script?.nodes !== undefined) setCloneScript(script);

            if (res?.data[0]?.configuration !== undefined) {
              const data = res.data[0].configuration;
              let init;
              if (data.call_back_configuration !== null) {
                init = {
                  gateway_phone_number: data?.gateway_phone_number,
                  maximum_call_seconds: data?.maximum_call_seconds,
                  ringing_call_seconds: data?.ringing_call_seconds,
                  call_back_configuration: Object.keys(data?.call_back_configuration).filter(
                    (item) => data?.call_back_configuration[item] !== false,
                  ),
                  amount_call_back_times: data?.call_back_configuration?.amount_call_back_times,
                  call_back_delay_minutes: data?.call_back_configuration?.call_back_delay_minutes,
                  filters: data?.execution_datetime.map((item) => {
                    const value = Object.entries(item).map((val) => {
                      const option = OPTIONS.filter((o) => o.value === val[0])[0];
                      return {
                        type: option,
                        value: option.value === 'hour' ? moment(val[1][0], 'HH:mm') : val[1][0],
                        range: option.value === 'hour' ? moment(val[1][1], 'HH:mm') : val[1][1],
                      };
                    });
                    return {
                      filterItem: value,
                    };
                  }),
                  bypass_datetime: data?.bypass_datetime?.map((item) => item.split('T')[0]),
                  pickup_less_than_seconds: data?.call_back_configuration?.pickup_less_than_seconds,
                  others: data?.call_back_configuration?.others,
                  send_record_after: data?.send_record_after,
                };
              } else {
                init = {
                  gateway_phone_number: data?.gateway_phone_number,
                  maximum_call_seconds: data?.maximum_call_seconds,
                  ringing_call_seconds: data?.ringing_call_seconds,
                  amount_call_back_times: data?.call_back_configuration?.amount_call_back_times,
                  call_back_delay_minutes: data?.call_back_configuration?.call_back_delay_minutes,
                  filters: data?.execution_datetime.map((item) => {
                    const value = Object.entries(item).map((val) => {
                      const option = OPTIONS.filter((o) => o.value === val[0])[0];
                      return {
                        type: option,
                        value: option.value === 'hour' ? moment(val[1][0], 'HH:mm') : val[1][0],
                        range: option.value === 'hour' ? moment(val[1][1], 'HH:mm') : val[1][1],
                      };
                    });
                    return {
                      filterItem: value,
                    };
                  }),
                  bypass_datetime: data?.bypass_datetime?.map((item) => item.split('T')[0]),
                  pickup_less_than_seconds: data?.call_back_configuration?.pickup_less_than_seconds,
                  others: data?.call_back_configuration?.others,
                  send_record_after: data?.send_record_after,
                };
              }

              if (init?.others?.length === 0) {
                init = {
                  ...init,
                  call_back_configuration: init.call_back_configuration.filter(
                    (v) => v !== 'others',
                  ),
                };
              }
              if (init?.pickup_less_than_seconds === 0) {
                init = {
                  ...init,
                  call_back_configuration: init.call_back_configuration.filter(
                    (v) => v !== 'pickup_less_than_seconds',
                  ),
                };
              }
              if (init?.send_record_after === 0) {
                init.send_record_after = 1;
              }

              setInitialValues(init);

              //set init state cho step 3
              setCount(init.filters.map((item) => item.filterItem.length));
              const selected = init.filters.map((item) => {
                const data = item.filterItem.map((v) => {
                  return v.type.value;
                });
                return data;
              });

              setSelectedFilter(selected);

              let arr = [...selected];
              for (let item of arr) {
                while (item.length < 8) {
                  item.push('');
                }
              }
              setCallTimeFilter(arr);

              if (init?.call_back_configuration?.includes('others')) {
                setIsSelected(true);
                setIsSelectedErr(true);
              }
              if (init?.call_back_configuration?.includes('not_pickup')) {
                setIsSelected(true);
              }
              if (data?.send_record_after !== 0) {
                setPlaybackValue(2);
              }

              let arrYear = data?.execution_datetime.map((item) => {
                if (item.year !== undefined) {
                  const amount = item.year[0] - moment().year();
                  let arr = [];
                  for (let i = amount; i <= 10; i++) {
                    arr.push(i);
                  }
                  return arr;
                }
                return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
              });
              setYear(arrYear);

              let arrMonth = data?.execution_datetime.map((item) => {
                if (item.month !== undefined) {
                  const amount = item.month[0];
                  let arr = [];
                  for (let i = amount; i <= 12; i++) {
                    arr.push(i);
                  }
                  return arr;
                }
                return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
              });
              setMonth(arrMonth);

              let arrDayInMonth = data?.execution_datetime.map((item) => {
                if (item.dayInMonth !== undefined) {
                  const amount = item.dayInMonth[0];
                  let arr = [];
                  for (let i = amount; i <= 31; i++) {
                    arr.push(i);
                  }
                  return arr;
                }
                return [Array.from({ length: 31 }, (_, i) => i + 1)];
              });
              setDayInMonth(arrDayInMonth);

              let arrWeekInYear = data?.execution_datetime.map((item) => {
                if (item.weekInYear !== undefined) {
                  const amount = item.weekInYear[0];
                  let arr = [];
                  for (let i = amount; i <= 53; i++) {
                    arr.push(i);
                  }
                  return arr;
                }
                return [Array.from({ length: 53 }, (_, i) => i + 1)];
              });
              setWeekInYear(arrWeekInYear);

              let arrWeekInMonth = data?.execution_datetime.map((item) => {
                if (item.weekInMonth !== undefined) {
                  const amount = item.weekInMonth[0];
                  let arr = [];
                  for (let i = amount; i <= 5; i++) {
                    arr.push(i);
                  }
                  return arr;
                }
                return [1, 2, 3, 4, 5];
              });
              setWeekInMonth(arrWeekInMonth);

              let arrDayInWeek = data?.execution_datetime.map((item) => {
                if (item.dayInWeek !== undefined) {
                  const i = DAY_IN_WEEK.indexOf(item.dayInWeek[0]);
                  let arr = DAY_IN_WEEK.slice(i);
                  return arr;
                }
                return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
              });
              setDayInWeek(arrDayInWeek);

              let arrHour = data?.execution_datetime.map((item) => {
                if (item.hour !== undefined) {
                  const h = parseInt(item.hour[0].split(':')[0]);
                  const m = parseInt(item.hour[0].split(':')[1]);
                  return { h: h, m: m };
                }
                return { h: 0, m: 0 };
              });
              setHour(arrHour);
              return null;
            } else {
              requestGetExtensionNumber(headers, { limit: 10, offset: 1 }).then((res) => {
                if (res?.success) {
                  const init = {
                    gateway_phone_number: res?.data[0]?.phone_number,
                    maximum_call_seconds: 60,
                    ringing_call_seconds: 10,
                    send_record_after: 1,
                  };
                  setInitialValues(init);
                }
              });
            }
            // throw new Error('ERROR~');
          }
        })
        .catch((err) => {
          message.error(err);
          // history.push('/config/campaign-management-2');
          return null;
        });
    }
  }, [dispatch, headers, history, campaignId, step, preConfig]);

  useEffect(
    () => () => {
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
    },
    [dispatch],
  );

  const createNewScript = async () => {
    const res = await new_campaign_script(headers, {
      campaign_id: campaignId,
    });
    if (res?.success) {
      const defaultData = {
        nodes: [
          {
            type: 'node',
            size: '167*40',
            shape: 'custom-node',
            nodeCustomizeType: nodeType.Bot,
            color: '#C7E7FF',
            icon: '/icons/FlowIcon/bot.png',
            text: 'Welcome',
            x: 100,
            y: 55,
            id: '0',
            border: '#127ACE',
            colorFocus: '#45ACFF',
            iconFocus: '/icons/FlowIcon/bot-fill.png',
          },
        ],
      };
      setCloneScript(defaultData);
      jumpToStep(1);
    }
  };

  const cloneScriptById = async (id, actionType) => {
    let res;
    if (actionType === 'sample')
      res = await getSampleScriptById(headers, {
        sample_script_id: id,
      });
    else
      res = await getScriptById(headers, {
        script_id: id,
      });

    const createScript = await new_campaign_script(headers, {
      campaign_id: campaignId,
    });

    if (res?.success && createScript.success) {
      setCloneScript(res.data[0].configuration);
      jumpToStep(1);
    }
  };

  const jumpToStep = (step) => {
    if (step > maxEnableStep) setMaxEnableStep(step);
    setStep(step);
  };

  const handleClickViewCampaign = (id) => {
    window.location = `${api.UMI_API_URL}/config/campaign-management-2/${id}/report`;
  };

  return (
    <>
      {preConfig ? (
        <PreConfig
          preConfig={preConfig}
          setPreConfig={setPreConfig}
          setClickAddCampaign={setClickAddCampaign}
          dispatch={dispatch}
          headers={headers}
          dataCampaign={dataCampaign}
          setDataCampaign={setDataCampaign}
          isEdit={isEdit}
        />
      ) : (
        <PageContainer
          header={{
            title: (
              <Row>
                <Col span={8}>
                  <LeftOutlined onClick={() => setPreConfig(true)} style={{ marginLeft: 25 }} />
                </Col>
                <Col span={8} style={{ fontSize: 25, textAlign: 'center' }}>
                  {isEdit ? 'Chỉnh sửa' : 'Tạo'} chiến dịch
                </Col>
                <Col span={8}></Col>
              </Row>
            ),
            ghost: false,
            breadcrumb: false,
            className: styles['page-contain-header'],
          }}
          fixedHeader
          content={
            <>
              {dataCampaign?.type === 'autoCall' ? (
                <Step step={step} onChange={onStepChange} />
              ) : (
                <StepAutoDialer step={step} onChange={onStepChange} />
              )}
            </>
          }
        >
          <RootForm campaign2={campaign2} onFinish={handleFormFinish} initialValues={initialValues}>
            {step === 0 && (
              <>
                {dataCampaign?.type === 'autoCall' ? (
                  <>
                    <Step1
                      createNewScript={createNewScript}
                      cloneScriptById={cloneScriptById}
                      headers={headers}
                      showElertPopUp={maxEnableStep >= 1 ? true : false}
                    />
                  </>
                ) : (
                  <>
                    <AutoDialerScript
                      goBack={handleBackStep}
                      headers={headers}
                      campaignId={campaignId}
                    />
                  </>
                )}
              </>
            )}
            {step === 1 && (
              <>
                {dataCampaign?.type === 'autoCall' ? (
                  <>
                    <Step2
                      goBack={handleBackStep}
                      headers={headers}
                      cloneScript={cloneScript}
                      campaignId={campaignId}
                    />
                  </>
                ) : (
                  <>
                    <Step3
                      headers={headers}
                      campaign2={initialValues}
                      dataCampaign={dataCampaign}
                      dispatch={dispatch}
                      initCount={count}
                      initSelectedFilter={selectedFilter}
                      initCallTimeFilter={callTimeFilter}
                      initIsSelected={isSelected}
                      initIsSelectedErr={isSelectedErr}
                      initPlaybackValue={playbackValue}
                      initYear={year}
                      initMonth={month}
                      initDayInMonth={dayInMonth}
                      initWeekInYear={weekInYear}
                      initWeeKInMonth={weekInMonth}
                      initDayInWeek={dayInWeek}
                      initHour={hour}
                    />
                    <Row>
                      <Col span={12} className={styles['btn-back']}>
                        <Button onClick={handleBackStep} disabled={step === 0 ? true : false}>
                          Quay lại
                        </Button>
                      </Col>
                      <Col span={12} className={styles['btn-next']}>
                        <Button type="primary" htmlType="submit">
                          Lưu & tiếp tục
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </>
            )}
            {step === 2 && (
              <>
                {dataCampaign?.type === 'autoCall' ? (
                  <>
                    <Step3
                      headers={headers}
                      campaign2={initialValues}
                      dataCampaign={dataCampaign}
                      dispatch={dispatch}
                      initCount={count}
                      initSelectedFilter={selectedFilter}
                      initCallTimeFilter={callTimeFilter}
                      initIsSelected={isSelected}
                      initIsSelectedErr={isSelectedErr}
                      initPlaybackValue={playbackValue}
                      initYear={year}
                      initMonth={month}
                      initDayInMonth={dayInMonth}
                      initWeekInYear={weekInYear}
                      initWeeKInMonth={weekInMonth}
                      initDayInWeek={dayInWeek}
                      initHour={hour}
                    />
                    <Row>
                      <Col span={12} className={styles['btn-back']}>
                        <Button onClick={handleBackStep} disabled={step === 0 ? true : false}>
                          Quay lại
                        </Button>
                      </Col>
                      <Col span={12} className={styles['btn-next']}>
                        <Button type="primary" htmlType="submit">
                          Lưu & tiếp tục
                        </Button>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <Step4
                      headers={headers}
                      clickCampaignList={() =>
                        (window.location = `${api.UMI_API_URL}/config/campaign-management-2`)
                      }
                      clickViewCampaign={() => handleClickViewCampaign(campaignId)}
                    />
                  </>
                )}
              </>
            )}

            {step === 3 && (
              <Step4
                headers={headers}
                clickCampaignList={() =>
                  (window.location = `${api.UMI_API_URL}/config/campaign-management-2`)
                }
                clickViewCampaign={() => handleClickViewCampaign(campaignId)}
              />
            )}
          </RootForm>
        </PageContainer>
      )}
    </>
  );
}

export default connect(({ user, campaign2 }) => ({
  authToken: user.authToken,
  userId: user.userId,
  tokenGateway: user.tokenGateway,
  currentUser: user.currentUser,
  campaign2,
}))(CampaignForm);

Step.propTypes = {
  step: PT.oneOfType([PT.number, PT.string]).isRequired,
  onChange: PT.func.isRequired,
};

function Step({ step, onChange }) {
  return (
    <Steps
      className={styles['steps']}
      current={step || 0}
      onChange={onChange}
      labelPlacement="vertical"
      responsive={true}
    >
      <Steps.Step
        title={<span style={{ whiteSpace: 'nowrap' }}>Chọn kịch bản</span>}
        // disabled={step >= 1 || !campaign2.campaignScenario.id}
      />
      <Steps.Step
        title={<span className={styles['span-title']}>Xây dựng kịch bản</span>}
        // disabled={step >= 1 || !campaign2.campaignScenario.id}
      />
      <Steps.Step
        title={<span className={styles['span-title']}>Cài đặt cấu hình</span>}
        // disabled={step >= 2 || !campaign2.campaignStrategies.id}
      />
      <Steps.Step
        title={<span className={styles['span-title']}>Hoàn thành</span>}
        // disabled={step === 3 || !initialValueEdit.campaignID}
      />
    </Steps>
  );
}

function StepAutoDialer({ step, onChange }) {
  return (
    <Steps
      className={styles['steps']}
      current={step || 0}
      onChange={onChange}
      labelPlacement="vertical"
      responsive={true}
    >
      <Steps.Step
        title={<span className={styles['span-title']}>Xây dựng kịch bản</span>}
        // disabled={step >= 1 || !campaign2.campaignScenario.id}
      />
      <Steps.Step
        title={<span className={styles['span-title']}>Cài đặt cấu hình</span>}
        // disabled={step >= 2 || !campaign2.campaignStrategies.id}
      />
      <Steps.Step
        title={<span className={styles['span-title']}>Hoàn thành</span>}
        // disabled={step === 3 || !initialValueEdit.campaignID}
      />
    </Steps>
  );
}

export { Step1, Step3, Step4, RootForm };
