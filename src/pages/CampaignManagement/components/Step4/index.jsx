import React, { useState, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import { CloseOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  DatePicker,
  TimePicker,
  Button,
  InputNumber,
  Checkbox,
  Typography,
  Tag,
  Space,
  Select
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi';
import CheckWindowSize from '@/components/CheckWindownSize';
import Utils from '../../../../utils/utilsCalendar';
import styles from './styles.less';

const { Option } = Select;
const formatDate = 'YYYY-MM-DD';
const formatTime = 'HH:mm';

const config = {
  rules: [
    {
      type: 'object',
      required: true,
      message: <FormattedMessage id="pages.campaign-management.times.empty" />,
    },
  ],
};

RenderStep4.propTypes = {
  handleCreateStrageties: PT.func.isRequired,
  handleUpdateStrageties: PT.func.isRequired,
  user: PT.instanceOf(Object).isRequired,
  initialValues: PT.instanceOf(Object).isRequired,
  nameCampaign: PT.string.isRequired,
  onClickStep: PT.func.isRequired,
  campaign: PT.shape({
    sipProfile: PT.instanceOf(Array),
  }).isRequired,
};

function RenderStep4({
  handleCreateStrageties,
  user,
  onClickStep,
  handleUpdateStrageties,
  initialValues,
  nameCampaign,
  campaign: { sipProfile },
}) {
  const dateNow = new Date(Date.now());
  const month = dateNow.getMonth() + 1;
  const year = dateNow.getFullYear();
  const [state, setState] = useState({
    month,
    year,
    currentMonth: Utils.getMonth(dateNow.getMonth() + 1, year),
    prevMonth: Utils.getMonth(month === 1 ? 12 : month - 1, month === 1 ? year - 1 : year),
    nextMonth: Utils.getMonth(month === 12 ? 1 : month + 1, month === 12 ? year + 1 : year),
  });
  const [pickupTime, setPickupTime] = useState(1);

  const handleOnChangePickuptime = (value) => {
    setPickupTime(value);
  };

  const handleOnFinish = useCallback(
    (values) => {
      const data = {
        ...values,
        st_minpickuptime: pickupTime,
        st_begin: `${values?.st_begin?.format(formatDate)}:00:00:00`,
        st_end: `${values?.st_end?.format(formatDate)}:23:59:59`,
        st_thoidiem: values?.st_thoidiem?.map((elm) => {
          return {
            from: elm.from.format(formatTime),
            to: elm.to.format(formatTime),
          };
        }) || [{}],
        createby: user?.username || 'unknown',
        updateby: user?.username || 'unknown',
      };
      if (Object.keys(initialValues).length > 0 && initialValues.campaignStrategies) {
        data.st_name = initialValues.campaignStrategies.st_name;
        handleUpdateStrageties(data, initialValues.campaignStrategies._id);
        return null;
      }
      data.st_name = initialValues?.campaignScenario?.scenario_name || nameCampaign;
      handleCreateStrageties(data);
      return null;
    },
    [handleCreateStrageties, handleUpdateStrageties, initialValues, nameCampaign, pickupTime, user],
  );

  const handleOnChangeCalender = useCallback(
    (value, mode) => {
      if (value) {
        const mm = value.month() + 1;
        const yy = value.year();
        if (state.month !== mm || state.year !== yy) {
          setState({
            month: mm,
            year: yy,
            currentMonth: Utils.getMonth(mm, yy),
            prevMonth: Utils.getMonth(mm === 1 ? 12 : mm - 1, mm === 1 ? yy - 1 : yy),
            nextMonth: Utils.getMonth(mm === 12 ? 1 : mm + 1, mm === 12 ? yy + 1 : yy),
          });
        }
      }
    },
    [state.month, state.year],
  );

  const handleOnChangeDay = useCallback((date, dateString) => {
    if (date) {
      const mm = date.month() + 1;
      const yy = date.year();
      if (state.month !== mm || state.year !== yy) {
        setState({
          month: mm,
          year: yy,
          currentMonth: Utils.getMonth(mm, yy),
          prevMonth: Utils.getMonth(mm === 1 ? 12 : mm - 1, mm === 1 ? yy - 1 : yy),
          nextMonth: Utils.getMonth(mm === 12 ? 1 : mm + 1, mm === 12 ? yy + 1 : yy),
        });
      }
    }
  });

  const disabledDate = useCallback((current) => {
    return current && current < moment().subtract(1, 'day').endOf('day');
  });
  const dateRender = useCallback((current) => {
    let lunarDate = null;
    let lunarMonth = null;
    if (state.month > 1 && state.month < 12) {
      if (current.month() === state.month - 1) {
        lunarDate = state.currentMonth[current.date() - 1].day;
        lunarMonth = state.currentMonth[current.date() - 1].month;
      }
      if (current.month() === state.month) {
        lunarDate = state.nextMonth[current.date() - 1].day;
        lunarMonth = state.nextMonth[current.date() - 1].month;
      }
      if (current.month() === state.month - 2) {
        lunarDate = state.prevMonth[current.date() - 1].day;
        lunarMonth = state.prevMonth[current.date() - 1].month;
      }
    } else if (state.month === 1) {
      if (current.month() === state.month - 1) {
        lunarDate = state.currentMonth[current.date() - 1].day;
        lunarMonth = state.currentMonth[current.date() - 1].month;
      } else if (current.month() === 1) {
        lunarDate = state.nextMonth[current.date() - 1].day;
        lunarMonth = state.nextMonth[current.date() - 1].month;
      } else {
        lunarDate = state.prevMonth[current.date() - 1].day;
        lunarMonth = state.prevMonth[current.date() - 1].month;
      }
    } else if (current.month() === state.month - 1) {
      lunarDate = state.currentMonth[current.date() - 1].day;
      lunarMonth = state.currentMonth[current.date() - 1].month;
    } else if (current.month() === 0) {
      lunarDate = state.nextMonth[current.date() - 1].day;
      lunarMonth = state.nextMonth[current.date() - 1].month;
    } else {
      lunarDate = state.prevMonth[current.date() - 1].day;
      lunarMonth = state.prevMonth[current.date() - 1].month;
    }
    return (
      <div className="ant-picker-cell-inner">
        <span>{current.date() ? current.date() : null}</span>
        <span
          style={{
            color: 'blue',
            fontSize: '9px',
            float: 'right',
            marginRight: '2px',
            marginTop: '4px',
          }}
        >
          {lunarDate ? (lunarDate === 1 ? `${lunarDate}/${lunarMonth}` : lunarDate) : null}
        </span>
      </div>
    );
  });
  const size = CheckWindowSize();
  return (
    <div className={styles.containder}>
      <Row gutter={8}>
        <Col span={24}>
          <Typography.Title level={3}>
            {<FormattedMessage id="pages.campaign-management.campaign.config" />}
          </Typography.Title>
        </Col>
        <Col span={24}>
          <Form
            onFinish={handleOnFinish}
            initialValues={{
              st_callback_busy: initialValues?.campaignStrategies?.st_callback_busy || false,
              st_callback_pickuptime:
                initialValues?.campaignStrategies?.st_callback_pickuptime || false,
              st_callback_timeoutcall:
                initialValues?.campaignStrategies?.st_callback_timeoutcall || false,
              st_thoidiem: initialValues?.campaignStrategies?.st_thoidiem?.map((elm) => {
                if (Object.keys(elm).length > 0) {
                  return {
                    from: moment(elm.from, formatTime),
                    to: moment(elm.to, formatTime),
                  };
                }
                return {};
              }),
              st_begin: initialValues?.campaignStrategies?.st_begin
                ? moment(initialValues?.campaignStrategies?.st_begin, formatDate)
                : moment(new Date().toJSON() || formatDate),
              st_end: initialValues?.campaignStrategies?.st_end
                ? moment(initialValues?.campaignStrategies?.st_end, formatDate)
                : moment(new Date().toJSON() || formatDate),
              st_maxcalltime_sec: initialValues?.campaignStrategies?.st_maxcalltime_sec || 1,
              st_ringtime_sec: initialValues?.campaignStrategies?.st_ringtime_sec || 1,
              st_callback_retry: initialValues?.campaignStrategies?.st_callback_retry || 1,
              st_callback_delay: initialValues?.campaignStrategies?.st_callback_delay || 1,
              pbxGateWay: initialValues?.campaignStrategies?.pbxGateWay || sipProfile[0]?.gateway_uuid
            }}
          >
            <Row>
              <Col
                span={
                  (size.screen === 'xl' && size.width <= 1319) ||
                    size.screen === 'lg' ||
                    size.screen === 'md' ||
                    size.screen === 'sm' ||
                    size.screen === 'xs'
                    ? 24
                    : 12
                }
                flex="auto"
              >
                {/* <div style={{ marginBottom: 24 }}>
                  <Typography.Text>
                    {<FormattedMessage id="pages.campaign-management.prefix.phone.number.call.out" />}
                  </Typography.Text>
                  <Tag style={{ marginLeft: 10 }} color="blue">
                    {campaign?.sipProfile[0]?.from_user || '02873002222'}
                  </Tag>
                </div> */}
                <Form.Item
                  label={
                    <span style={{ fontWeight: 'bold' }}>
                      {<FormattedMessage id="pages.campaign-management.prefix.phone.number.call.out" />}
                    </span>
                  }
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 8 }}
                  style={{ marginBottom: '5px' }}
                  labelAlign='left'
                  name='pbxGateWay'
                >
                  <Select>
                    {
                      sipProfile?.map(item => (
                        <Option key={item.gateway_uuid} value={item.gateway_uuid}>{item.from_user}</Option>
                      ))
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  label={
                    <span style={{ fontWeight: 'bold' }}>
                      {<FormattedMessage id="pages.campaign-management.campaign.time.start" />}
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  style={{ marginBottom: 0 }}
                >
                  <Form.Item
                    label={<FormattedMessage id="pages.campaign-management.from.day" />}
                    style={{ display: 'inline-flex', width: 'calc(50% - 8px)' }}
                    name="st_begin"
                    {...config}
                  >
                    <DatePicker
                      format={formatDate}
                      disabledDate={disabledDate}
                      dateRender={dateRender}
                      onPanelChange={handleOnChangeCalender}
                      onChange={handleOnChangeDay}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<FormattedMessage id="pages.campaign-management.to.day" />}
                    style={{ display: 'inline-flex', width: 'calc(50% - 8px)' }}
                    name="st_end"
                    {...config}
                  >
                    <DatePicker
                      format={formatDate}
                      disabledDate={disabledDate}
                      dateRender={dateRender}
                      onPanelChange={handleOnChangeCalender}
                      onChange={handleOnChangeDay}
                    />
                  </Form.Item>
                </Form.Item>

                <Form.Item
                  label={
                    <span style={{ fontWeight: 'bold' }}>
                      {<FormattedMessage id="pages.campaign-management.time.no.call" />}
                    </span>
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  style={{ marginBottom: 0 }}
                >
                  <Form.Item
                    label={<FormattedMessage id="pages.campaign-management.from.time" />}
                    style={{ display: 'inline-flex', width: 'calc(50% - 8px)' }}
                    {...config}
                  >
                    <DatePicker
                      format={formatDate}
                      disabledDate={disabledDate}
                      dateRender={dateRender}
                      onPanelChange={handleOnChangeCalender}
                      onChange={handleOnChangeDay}
                    />
                  </Form.Item>
                  <Form.Item
                    label={<FormattedMessage id="pages.campaign-management.to.time" />}
                    style={{ display: 'inline-flex', width: 'calc(50% - 8px)' }}
                    {...config}
                  >
                    <DatePicker
                      format={formatDate}
                      disabledDate={disabledDate}
                      dateRender={dateRender}
                      onPanelChange={handleOnChangeCalender}
                      onChange={handleOnChangeDay}
                    />
                  </Form.Item>
                </Form.Item>

                <div
                  style={{
                    padding: '0 0 8px',
                    lineHeight: 1.5715,
                    textAlign: 'left',
                    whiteSpace: 'initial',
                  }}
                >
                  <label style={{ fontWeight: 'bold' }}><FormattedMessage id="pages.campaign-management.recall.times.call" /></label>
                </div>
                <Form.List labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} name="st_thoidiem">
                  {(fields, { add, remove }) => {
                    return (
                      <>
                        {fields.map((field) => (
                          <Space key={field.key} align="baseline">
                            <Form.Item
                              noStyle
                              shouldUpdate={(prevValues, curValues) =>
                                prevValues.from !== curValues.from || prevValues.to !== curValues.to
                              }
                            >
                              {() => (
                                <Form.Item
                                  {...field}
                                  label={
                                    <FormattedMessage id="pages.campaign-management.from.time" />
                                  }
                                  name={[field.name, 'from']}
                                  fieldKey={[field.fieldKey, 'from']}
                                  {...config}
                                >
                                  <TimePicker format={formatTime} />
                                </Form.Item>
                              )}
                            </Form.Item>
                            <Form.Item
                              {...field}
                              label={<FormattedMessage id="pages.campaign-management.to.time" />}
                              name={[field.name, 'to']}
                              fieldKey={[field.fieldKey, 'to']}
                              {...config}
                            >
                              <TimePicker format={formatTime} />
                            </Form.Item>

                            <CloseOutlined onClick={() => remove(field.name)} />
                          </Space>
                        ))}

                        <Form.Item>
                          <Button
                            type="primary"
                            onClick={() => add()}
                            block
                            style={{ height: 'auto' }}
                          >
                            <span style={{ display: 'block', whiteSpace: 'normal' }}>
                              {<FormattedMessage id="pages.campaign-management.add.call.time" />}
                            </span>
                          </Button>
                        </Form.Item>
                      </>
                    );
                  }}
                </Form.List>
                <Form.Item
                  label={<FormattedMessage id="pages.campaign-management.max.time.each.call" />}
                  colon={false}
                  labelCol={{ span: (size.width < 1320 && size.screen === 'xl') || size.screen === 'lg' ? 5 : size.screen === 'md' || size.screen === 'sm' || size.screen === 'xs' ? 24 : 8 }}
                  wrapperCol={{ span: 16 }}
                  labelAlign="left"

                >
                  <Form.Item
                    name="st_maxcalltime_sec"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: 'Is required',
                      },
                    ]}
                  >
                    <InputNumber min={1} max={60} />
                  </Form.Item>
                  <span style={{ marginLeft: 10 }}>
                    {<FormattedMessage id="pages.campaign-management.minutes" />}
                  </span>
                </Form.Item>
              </Col>
              <Col
                span={
                  (size.screen === 'xl' && size.width <= 1319) ||
                    size.screen === 'lg' ||
                    size.screen === 'md' ||
                    size.screen === 'sm' ||
                    size.screen === 'xs'
                    ? 24
                    : 12
                }
                offset={
                  (size.screen === 'xl' && size.width <= 1319) ||
                    size.screen === 'lg' ||
                    size.screen === 'md' ||
                    size.screen === 'sm' ||
                    size.screen === 'xs'
                    ? 0
                    : 2
                }
                flex="auto"
              >
                <div>
                  <span>{<FormattedMessage id="pages.campaign-management.config.recall" />}</span>
                </div>
                <Form.Item name="st_callback_busy" valuePropName="checked">
                  <Checkbox>{<FormattedMessage id="pages.campaign-management.busy.call" />}</Checkbox>
                </Form.Item>
                <Form.Item
                  name="st_callback_pickuptime"
                  valuePropName="checked"
                  label={
                    <Checkbox>
                      <span style={{ color: '#000' }}>
                        <FormattedMessage id="pages.campaign-management.catch.less.than" />
                      </span>
                    </Checkbox>
                  }
                  colon={false}
                  labelCol={{ span: size.width >= 1320 && size.screen === 'xl' ? 24 : (size.width < 1320 && size.screen === 'xl') || size.screen === 'lg' ? 5 : size.screen === 'md' || size.screen === 'sm' || size.screen === 'xs' ? 24 : 7 }}
                  wrapperCol={{
                    span:
                      size.width <= 1715 && size.screen === 'xxl'
                        ? 8
                        : size.width >= 1320 && size.screen === 'xl'
                          ? 24
                          : 4.5,
                  }}
                  labelAlign="left"
                >
                  <div>
                    <InputNumber
                      value={pickupTime}
                      onChange={handleOnChangePickuptime}
                      min={1}
                      max={60}
                    />{' '}
                    <FormattedMessage id="pages.campaign-management.seconds" />
                  </div>
                </Form.Item>
                <Form.Item name="st_callback_timeoutcall" valuePropName="checked">
                  <Checkbox>{<FormattedMessage id="pages.campaign-management.no.catch" />}</Checkbox>
                </Form.Item>

                <Form.Item
                  label={<FormattedMessage id="pages.campaign-management.time.ring.bell" />}
                  colon={false}
                  labelCol={{ span: size.width >= 1320 && size.screen === 'xl' ? 24 : (size.width < 1320 && size.screen === 'xl') || size.screen === 'lg' ? 5 : size.screen === 'md' || size.screen === 'sm' || size.screen === 'xs' ? 24 : 7 }}
                  wrapperCol={{
                    span:
                      size.width <= 1790 && size.screen === 'xxl'
                        ? 7
                        : size.width >= 1320 && size.screen === 'xl'
                          ? 24
                          : size.screen === 'md' || size.screen === 'sm' || size.screen === 'xs' ? 24 : 7,
                  }}
                  labelAlign="left"
                  name="st_ringtime_sec"
                  rules={[
                    {
                      required: true,
                      message: 'Is required',
                    },
                  ]}
                >
                  <InputNumber min={1} max={60} />
                  <span style={{ marginLeft: 10 }}>
                    {formatMessage({ id: 'pages.campaign-management.seconds' })}
                  </span>
                </Form.Item>
                <Form.Item
                  label={<FormattedMessage id="pages.campaign-management.recall.times" />}
                  colon={false}
                  labelCol={{
                    span:
                      size.width > 1730 ? 7 :
                        size.width <= 1730 && size.screen === 'xxl'
                          ? 7
                          : size.width >= 1320 && size.screen === 'xl'
                            ? 24
                            : size.screen === 'md' || size.screen === 'sm' || size.screen === 'xs' ? 24 : 5,
                  }}
                  wrapperCol={{ span: size.width >= 1320 && size.screen === 'xl' ? 24 : 4 }}
                  name="st_callback_retry"
                  rules={[
                    {
                      required: true,
                      message: 'Is required',
                    },
                  ]}
                  labelAlign="left"
                >
                  <InputNumber min={1} max={60} />
                </Form.Item>
                <Form.Item
                  label={
                    <FormattedMessage id="pages.campaign-management.recall.times.between.two.recalls" />
                  }
                  colon={false}
                  labelCol={{
                    span:
                      size.width > 1828 ? 7 :
                        size.width <= 1828 && size.screen === 'xxl'
                          ? 7
                          : size.width >= 1320 && size.screen === 'xl'
                            ? 24
                            : size.screen === 'md' || size.screen === 'sm' || size.screen === 'xs' ? 24 : 5,
                  }}
                  wrapperCol={{ span: size.width >= 1320 && size.screen === 'xl' ? 24 : 24 }}
                  labelAlign="left"
                >
                  <Form.Item
                    name="st_callback_delay"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: 'Is required',
                      },
                    ]}
                  >
                    <InputNumber min={1} max={60} />
                  </Form.Item>
                  <span style={{ marginLeft: 10 }}>
                    {<FormattedMessage id="pages.campaign-management.minutes" />}
                  </span>
                </Form.Item>
              </Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button style={{ marginRight: 5 }} onClick={() => onClickStep(3)}>
                {<FormattedMessage id="pages.campaign-management.back" />}
              </Button>
              <Button type="primary" htmlType="submit">
                {Object.keys(initialValues).length > 0 && initialValues.campaignStrategies ? (
                  <FormattedMessage id="pages.campaign-management.update" />
                ) : (
                  <FormattedMessage id="pages.campaign-management.continue" />
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default RenderStep4;
