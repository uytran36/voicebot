import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import Icon, {
  SwapRightOutlined,
  PlusCircleTwoTone,
  PlusOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import {
  Row,
  Col,
  Space,
  Form,
  Select,
  Divider,
  Checkbox,
  InputNumber,
  Typography,
  Radio,
  Tag,
} from 'antd';
import moment from 'moment';
import styles from './styles.less';
import OptionsValue from './OptionsValue';
import OptionsRange from './OptionsRange';
import MultipleDatePicker from './MultipleDatepicker';
import { requestGetExtensionNumber } from '@/services/campaign-management';
import api from '../../../../api';

Step3.propTypes = {
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
};
const { Title } = Typography;
const { Option } = Select;

const layoutTime = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24, offset: 4 },
    span: 24,
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24, offset: 4 },
  },
};

let layoutSetup;

if (api.ENV === 'local' || api.ENV === 'dev') {
  layoutSetup = {
    wrapperCol: {
      xxl: { span: 18, offset: 6 },
      xl: { span: 22, offset: 2 },
    },
  };
} else {
  layoutSetup = {
    labelCol: {
      xs: { span: 12 },
      sm: { span: 14, offset: 4 },
      md: { span: 14, offset: 0 },
      lg: { span: 19 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 7 },
      md: { span: 7 },
      lg: { span: 6 },
      xxl: { span: 18, offset: 6 },
      xl: { span: 22, offset: 2 },
    },
  };
}

const deleteIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M0.666992 4.16683H17.3337V5.8335H0.666992V4.16683Z"
      fill="#FF4D4F"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.33366 2.50016C7.11265 2.50016 6.90068 2.58796 6.7444 2.74424C6.58812 2.90052 6.50033 3.11248 6.50033 3.3335V4.16683H11.5003V3.3335C11.5003 3.11248 11.4125 2.90052 11.2562 2.74424C11.1 2.58796 10.888 2.50016 10.667 2.50016H7.33366ZM13.167 4.16683V3.3335C13.167 2.67045 12.9036 2.03457 12.4348 1.56573C11.9659 1.09689 11.33 0.833496 10.667 0.833496H7.33366C6.67062 0.833496 6.03473 1.09689 5.56589 1.56573C5.09705 2.03457 4.83366 2.67045 4.83366 3.3335V4.16683H2.33366V16.6668C2.33366 17.3299 2.59705 17.9658 3.06589 18.4346C3.53473 18.9034 4.17062 19.1668 4.83366 19.1668H13.167C13.83 19.1668 14.4659 18.9034 14.9348 18.4346C15.4036 17.9658 15.667 17.3299 15.667 16.6668V4.16683H13.167ZM4.00033 5.8335V16.6668C4.00033 16.8878 4.08812 17.0998 4.2444 17.2561C4.40068 17.4124 4.61265 17.5002 4.83366 17.5002H13.167C13.388 17.5002 13.6 17.4124 13.7562 17.2561C13.9125 17.0998 14.0003 16.8878 14.0003 16.6668V5.8335H4.00033Z"
      fill="#FF4D4F"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M8.16699 8.3335V15.0002H6.50033V8.3335H8.16699Z"
      fill="#FF4D4F"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.5003 8.3335V15.0002H9.83366V8.3335H11.5003Z"
      fill="#FF4D4F"
    />
  </svg>
);
const DeleteIcon = (props) => <Icon component={deleteIcon} {...props} />;

function Step3({
  form,
  headers,
  dataCampaign,
  initCount,
  initSelectedFilter,
  initCallTimeFilter,
  initIsSelected,
  initIsSelectedErr,
  initPlaybackValue,
  initYear,
  initMonth,
  initDayInMonth,
  initWeekInYear,
  initWeeKInMonth,
  initDayInWeek,
  initHour,
}) {
  const [sipProfiles, setSipProfiles] = useState([]);
  const [isSelected, setIsSelected] = useState(initIsSelected);
  const [isSelectedErr, setIsSelectedErr] = useState(initIsSelectedErr);
  const [callTimeFilter, setCallTimeFilter] = useState(
    initCallTimeFilter !== undefined ? initCallTimeFilter : [],
  );
  const [count, setCount] = useState(initCount !== undefined ? initCount : [0]);
  const [selectedFilter, setSelectedFilter] = useState(
    initSelectedFilter !== undefined ? initSelectedFilter : [],
  );
  const [playbackValue, setPlaybackValue] = useState(initPlaybackValue);
  const [callMethod, setCallMethod] = useState(0);
  const [year, setYear] = useState(initYear !== undefined ? initYear : []);
  const [month, setMonth] = useState(initMonth !== undefined ? initMonth : []);
  const [dayInMonth, setDayInMonth] = useState(initDayInMonth !== undefined ? initDayInMonth : []);
  const [weekInYear, setWeekInYear] = useState(initWeekInYear !== undefined ? initWeekInYear : []);
  const [weekInMonth, setWeekInMonth] = useState(
    initWeeKInMonth !== undefined ? initWeeKInMonth : [],
  );
  const [dayInWeek, setDayInWeek] = useState(initDayInWeek !== undefined ? initDayInWeek : []);
  const [hour, setHour] = useState(initHour !== undefined ? initHour : []);

  const OPTIONS = [
    { label: 'Năm', value: 'year' },
    { label: 'Tháng', value: 'month' },
    { label: 'Ngày trong tháng', value: 'dayInMonth' },
    { label: 'Ngày trong tuần', value: 'dayInWeek' },
    { label: 'Tuần trong năm', value: 'weekInYear' },
    { label: 'Tuần trong tháng', value: 'weekInMonth' },
    { label: 'Giờ', value: 'hour' },
  ];

  useEffect(() => {
    requestGetExtensionNumber(headers, { limit: 10, offset: 1 }).then((res) => {
      if (res?.success) {
        setSipProfiles(
          res?.data?.map((item) => {
            return { gateway_uuid: item?.phone_number, from_user: item?.phone_number };
          }),
        );
      }
    });
  }, []);

  const onChangeCallback = (checkedValues) => {
    if (checkedValues.length > 0) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
    if (checkedValues.includes('others')) {
      setIsSelectedErr(true);
    } else {
      setIsSelectedErr(false);
    }
  };

  const onChangeType = (idx, index, value) => {
    let arr = [...callTimeFilter];
    arr[idx][index] = value.value;
    setCallTimeFilter(arr);

    let array = [...selectedFilter];
    if (array[idx][index] === undefined) {
      array[idx].push(value.value);
    } else {
      array[idx][index] = value.value;
    }
    setSelectedFilter(array);
    let filters = form.getFieldValue("filters")
    filters[idx].filterItem[index] = {...filters[idx].filterItem[index], value: '', range: ''}
    form.setFieldsValue({filters})
  };

  const onClickRemove = (remove, name, idx, index) => {
    let arr = [...callTimeFilter];
    arr[idx].splice(index, 1);
    arr[idx].push('');
    setCallTimeFilter(arr);

    let arrSelectedFilter = [...selectedFilter];
    // arrSelectedFilter[idx].splice(index, 1);
    arrSelectedFilter[idx] = arrSelectedFilter[idx].filter((item) => item !== '');
    // setSelectedFilter(arrSelectedFilter);

    let array = [...count];
    array[idx] = array[idx] - 1;
    setCount(array);
    console.log(arrSelectedFilter);
    remove(name);
  };

  const onClickAddFilter = (add, idx) => {
    const arr = [...count];
    arr[idx] = arr[idx] + 1;
    setCount(arr);
    add();
  };

  const onClickAddTime = (add) => {
    let arr = [...callTimeFilter];
    arr.push(['', '', '', '', '', '', '', '']);
    setCallTimeFilter(arr);

    let array = [...selectedFilter];
    array.push([]);
    setSelectedFilter(array);

    let arrCount = [...count];
    arrCount.push(0);
    setCount(arrCount);

    let arrYear = [...year];
    arrYear.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    setYear(arrYear);

    let arrMonth = [...month];
    arrMonth.push([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    setMonth(arrMonth);

    let arrDayInMonth = [...dayInMonth];
    arrDayInMonth.push(Array.from({ length: 31 }, (_, i) => i + 1));
    setDayInMonth(arrDayInMonth);

    let arrWeekInYear = [...weekInYear];
    arrWeekInYear.push(Array.from({ length: 53 }, (_, i) => i + 1));
    setWeekInYear(arrWeekInYear);

    let arrWeekInMonth = [...weekInMonth];
    arrWeekInMonth.push([1, 2, 3, 4, 5]);
    setWeekInMonth(arrWeekInMonth);

    let arrDayInWeek = [...dayInWeek];
    arrDayInWeek.push(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);
    setDayInWeek(arrDayInWeek);

    let arrHour = [...hour];
    arrHour.push({ h: 0, m: 0 });
    setHour(arrHour);
    console.log(selectedFilter);
    add();
  };

  const onClickRemoveTime = (remove, field, idx) => {
    let arr = [...callTimeFilter];
    arr.splice(idx, 1);
    setCallTimeFilter(arr);

    let array = [...selectedFilter];
    array.splice(idx, 1);
    for (let i = 0; i < array.length; i++) {
      array[i] = array[i].filter((item) => item !== '');
    }
    setSelectedFilter(array);

    let arrCount = [...count];
    arrCount.splice(idx, 1);
    setCount(arrCount);

    let arrYear = [...year];
    arrYear.splice(idx, 1);
    setYear(arrYear);

    let arrMonth = [...month];
    arrMonth.splice(idx, 1);
    setMonth(arrMonth);

    let arrDayInMonth = [...dayInMonth];
    arrDayInMonth.splice(idx, 1);
    setDayInMonth(arrDayInMonth);

    let arrWeekInYear = [...weekInYear];
    arrWeekInYear.splice(idx, 1);
    setWeekInYear(arrWeekInYear);

    let arrWeekInMonth = [...weekInMonth];
    arrWeekInMonth.splice(idx, 1);
    setWeekInMonth(arrWeekInMonth);

    let arrDayInWeek = [...dayInWeek];
    arrDayInWeek.splice(idx, 1);
    setDayInWeek(arrDayInWeek);

    let arrHour = [...hour];
    arrHour.splice(idx, 1);
    setHour(arrHour);

    console.log(idx);

    remove(field.name);
  };

  const removeYear = (v, idx) => {
    const amount = v - moment().year();
    let arrYear = [...year];
    arrYear[idx] = Array.from({ length: 10 }, (_, i) => i).slice(amount);

    setYear(arrYear);
  };

  const removeMonth = (v, idx) => {
    const amount = v - 1;
    let arrMonth = [...month];
    arrMonth[idx] = Array.from({ length: 12 }, (_, i) => i + 1).slice(amount);
    setMonth(arrMonth);
  };

  const removeDayInMonth = (v, idx) => {
    const amount = v - 1;
    let arrDayInMonth = [...dayInMonth];
    arrDayInMonth[idx] = Array.from({ length: 31 }, (_, i) => i + 1).slice(amount);

    setDayInMonth(arrDayInMonth);
  };

  const removeWeekInYear = (v, idx) => {
    const amount = v - 1;
    let arrWeekInYear = [...weekInYear];
    arrWeekInYear[idx] = Array.from({ length: 53 }, (_, i) => i + 1).slice(amount);

    setWeekInYear(arrWeekInYear);
  };

  const removeWeekInMonth = (v, idx) => {
    const amount = v - 1;
    let arrWeekInMonth = [...weekInMonth];
    arrWeekInMonth[idx] = Array.from({ length: 5 }, (_, i) => i + 1).slice(amount);

    setWeekInMonth(arrWeekInMonth);
  };

  const removeDayInWeek = (v, idx) => {
    let listDay = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    const index = listDay.indexOf(v);
    let arrDayInWeek = [...dayInWeek];
    arrDayInWeek[idx] = listDay.slice(index);
    setDayInWeek(arrDayInWeek);
  };

  const removeHour = (v, idx) => {
    const h = moment(v).hour();
    const m = moment(v).minute();
    let arrHour = [...hour];
    arrHour[idx] = { h: h, m: m };
    setHour(arrHour);
  };

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag color="red" onMouseDown={onPreventMouseDown} closable={closable} onClose={onClose}>
        {label}
      </Tag>
    );
  };

  const onChangePlayback = (e) => {
    setPlaybackValue(e.target.value);
  };

  const handleChangeCallMethod = (e) => {
    setCallMethod(e.target.value);
  };

  return (
    <ProCard style={{ minHeight: '61vh' }}>
      <Row>
        <Col xs={24} sm={24} md={11}>
          <Title level={5} className={styles['title']}>
            Cài đặt cấu hình
          </Title>
          <Form.Item
            {...layoutTime}
            name="gateway_phone_number"
            label="Đầu số gọi ra"
            className={styles['form-item-block']}
          >
            <Select placeholder="Chọn đầu số">
              {sipProfiles?.map((sip) => (
                <Option key={sip.gateway_uuid} value={sip.gateway_uuid}>
                  {sip.from_user}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {dataCampaign?.type !== 'autoDialer' ? (
            <div className={styles['left-container']}>
              <Form.Item
                label="Thời lượng tối đa mỗi cuộc gọi"
                className={styles['form-item-wrapper']}
                labelAlign="left"
              >
                <Row className={styles['form-item']}>
                  <Col>
                    <Form.Item noStyle name="maximum_call_seconds">
                      <InputNumber min={0} max={180} />
                    </Form.Item>
                    <span className={styles['unit']}>giây</span>
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item
                label="Thời gian đổ chuông"
                className={styles['form-item-wrapper']}
                labelAlign="left"
              >
                <Row className={styles['form-item']}>
                  <Col>
                    <Form.Item noStyle name="ringing_call_seconds">
                      <InputNumber min={5} max={40} />
                    </Form.Item>
                    <span className={styles['unit']}>giây</span>
                  </Col>
                </Row>
              </Form.Item>
              <div>Thời gian phát lời thoại sau khi nhấc máy</div>
              <Radio.Group
                value={playbackValue}
                onChange={onChangePlayback}
                className={styles['checkbox-wrapper']}
              >
                <Space direction="vertical" className={styles['space-width']}>
                  <Radio value={1}>Ngay khi nhấc máy</Radio>
                  <Radio value={2} className={styles['radio-item']}>
                    <Row className={styles['combo-wrapper']}>
                      <Col>
                        <div>Sau khi nhấc máy</div>
                      </Col>

                      {playbackValue === 2 && (
                        <Col>
                          <Form.Item noStyle name="send_record_after">
                            <InputNumber min={1} max={5} />
                          </Form.Item>
                          <span className={styles['unit']}>giây</span>
                        </Col>
                      )}
                    </Row>
                  </Radio>
                </Space>
              </Radio.Group>

              {(api.ENV === 'dev' || api.ENV === 'local') && (
                <>
                  <Form.Item
                    label="Thiết lập gọi lại"
                    className={styles['form-item-block']}
                    name="call_back_configuration"
                    labelAlign="left"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                  >
                    <Checkbox.Group
                      onChange={onChangeCallback}
                      className={styles['checkbox-wrapper']}
                    >
                      <Col span={24}>
                        <Checkbox value="busy">Máy bận</Checkbox>
                      </Col>
                      <Col>
                        <Row className={styles['combo-wrapper']}>
                          <Col style={{ margin: 'auto 0px' }}>
                            <Checkbox value="pickup_less_than_seconds" className={styles['pickup']}>
                              Nhấc máy ít hơn
                            </Checkbox>
                          </Col>
                          <Col>
                            <Form.Item noStyle name="pickup_less_than_seconds">
                              <InputNumber min={0} />
                            </Form.Item>
                            <span className={styles['unit']}>giây</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Checkbox value="not_pickup">Không nhấc máy</Checkbox>
                      </Col>
                      <Col span={24}>
                        <Checkbox value="others">Lỗi khác</Checkbox>
                        <Form.Item noStyle name="others">
                          <Select mode="tags" disabled={!isSelectedErr}>
                            <Option key={'item01'}>Item 01</Option>
                            <Option key={'item02'}>Item 02</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Checkbox.Group>
                  </Form.Item>
                  <Form.Item
                    label="Số lần gọi lại"
                    className={styles['form-item-wrapper']}
                    labelAlign="left"
                  >
                    <Row className={styles['form-item']}>
                      <Col>
                        <Form.Item noStyle name="amount_call_back_times">
                          <InputNumber min={0} disabled={!isSelected} />
                        </Form.Item>
                        <span className={styles['unit']} style={{ paddingLeft: 7 }}>
                          lần
                        </span>
                      </Col>
                    </Row>
                  </Form.Item>
                  <Form.Item
                    label="Thời gian giữa 2 lần gọi lại"
                    className={styles['form-item-wrapper']}
                    labelAlign="left"
                  >
                    <Row className={styles['form-item']}>
                      <Col>
                        <Form.Item noStyle name="call_back_delay_minutes">
                          <InputNumber min={0} disabled={!isSelected} />
                        </Form.Item>
                        <span className={styles['unit']} style={{ marginLeft: 6 }}>
                          phút
                        </span>
                      </Col>
                    </Row>
                  </Form.Item>
                </>
              )}
            </div>
          ) : (
            <div className={styles['left-container']}>
              <div>Phương thức gọi</div>
              <Radio.Group style={{ display: 'block' }} onChange={handleChangeCallMethod}>
                <Space direction="vertical" style={{ display: 'block' }}>
                  <Radio value={1}>Predictive</Radio>
                  {callMethod === 1 && (
                    <div className={styles['predictive-wrapper']}>
                      <Form.Item
                        label="Số cuộc gọi đồng thời"
                        labelAlign="left"
                        style={{ display: 'space-between' }}
                        className={styles['form-item-wrapper']}
                      >
                        <div style={{ textAlign: 'right' }}>
                          <InputNumber min={1} max={500} />
                          <span className={styles['unit']} style={{ marginLeft: 6 }}>
                            cuộc
                          </span>
                        </div>
                      </Form.Item>
                      <Form.Item
                        label="Thời gian giữa các phiên gọi"
                        labelAlign="left"
                        style={{ marginBottom: 0 }}
                        className={styles['form-item-wrapper']}
                      >
                        <div style={{ textAlign: 'right' }}>
                          <InputNumber min={1} max={60} />
                          <span className={styles['unit']} style={{ marginLeft: 6 }}>
                            phút
                          </span>
                        </div>
                      </Form.Item>
                    </div>
                  )}
                  <Radio value={2}>Progressive</Radio>
                  {callMethod === 2 && (
                    <div className={styles['predictive-wrapper']}>
                      <Form.Item
                        label="Số cuộc gọi đồng thời"
                        labelAlign="left"
                        style={{ marginBottom: 0 }}
                        className={styles['form-item-wrapper']}
                        wrapperCol={{ span: 24 }}
                      >
                        <div style={{ textAlign: 'right' }}>
                          <InputNumber min={1} max={10} />
                          <span className={styles['unit']} style={{ marginLeft: 6 }}>
                            / Agent available
                          </span>
                        </div>
                      </Form.Item>
                    </div>
                  )}
                </Space>
              </Radio.Group>

              <Form.Item
                label="Tự động gọi lại"
                className={styles['form-item-block']}
                // name="call_back_configuration"
                labelAlign="left"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Checkbox.Group onChange={onChangeCallback} className={styles['checkbox-wrapper']}>
                  <Col span={24}>
                    <Checkbox value="busy">Máy bận</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="not_pickup">Không nhấc máy</Checkbox>
                  </Col>
                  <Col span={24}>
                    <Checkbox value="others">Lỗi khác</Checkbox>
                    <Form.Item noStyle name="others">
                      <Select mode="tags" disabled={!isSelectedErr}>
                        <Option key={'item01'}>Item 01</Option>
                        <Option key={'item02'}>Item 02</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item
                label="Điều kiện tạm dừng chiến dịch:"
                className={styles['form-item-wrapper']}
                labelAlign="left"
                {...layoutSetup}
              >
                <Form.Item noStyle>
                  <InputNumber min={1} />
                </Form.Item>
                <span className={styles['unit']} style={{ paddingLeft: 7 }}>
                  cuộc gọi nhỡ
                </span>
              </Form.Item>
              <Form.Item
                label="Thời gian chờ gọi lại"
                className={styles['form-item-wrapper']}
                labelAlign="left"
                {...layoutSetup}
              >
                <Form.Item noStyle>
                  <InputNumber min={0} />
                </Form.Item>
                <span className={styles['unit']} style={{ paddingLeft: 7 }}>
                  phút
                </span>
              </Form.Item>
              <Form.Item
                label="Số lần gọi lại"
                className={styles['form-item-wrapper']}
                labelAlign="left"
                {...layoutSetup}
              >
                <Form.Item noStyle name="amount_call_back_times">
                  <InputNumber min={0} disabled={!isSelected} />
                </Form.Item>
                <span className={styles['unit']} style={{ paddingLeft: 7 }}>
                  lần
                </span>
              </Form.Item>
              <Form.Item
                label="Thời gian giữa 2 lần gọi lại"
                className={styles['form-item-wrapper']}
                labelAlign="left"
                {...layoutSetup}
              >
                <Form.Item noStyle name="call_back_delay_minutes">
                  <InputNumber min={0} disabled={!isSelected} />
                </Form.Item>
                <span className={styles['unit']} style={{ paddingLeft: 7 }}>
                  phút
                </span>
              </Form.Item>
            </div>
          )}
        </Col>
        <Col xs={0} sm={0} md={1} offset={1}>
          <Divider className={styles['divider']} type="vertical" />
        </Col>
        <Col xs={24} sm={24} md={11}>
          <Title level={5}>Thời gian</Title>
          <div level={5}>Thời gian gọi</div>
          <Form.List name="filters">
            {(flds, { add, remove }, { errors }) => (
              <>
                {flds.map((field, idx) => (
                  <>
                    {idx !== 0 && <div>Hoặc</div>}
                    <div className={styles['filter-call-time']}>
                      {flds.length > 1 && (
                        <Row>
                          <Col span={8}></Col>
                          <Col span={7}></Col>
                          <Col span={1}></Col>
                          <Col span={7}></Col>
                          <Col className={styles['remove-filter-btn']} span={1}>
                            <CloseOutlined onClick={() => onClickRemoveTime(remove, field, idx)} />
                          </Col>
                        </Row>
                      )}
                      <Row>
                        <Col span={8}>Điều kiện</Col>
                        <Col span={7}>Từ</Col>
                        <Col span={1}></Col>
                        <Col span={7}>Đến</Col>
                        <Col span={1}></Col>
                      </Row>
                      <Form.List name={[field.name, 'filterItem']}>
                        {(fields, { add, remove }) => (
                          <>
                            {fields.length === 0 && onClickAddFilter(add, idx)}
                            {fields.map(({ key, name, ...restField }, index) => (
                              <Row className={styles['filter-row']}>
                                <Col span={8}>
                                  <Form.Item noStyle {...restField} name={[name, 'type']}>
                                    <Select
                                      labelInValue
                                      className={styles['select-filter']}
                                      onChange={(value) => onChangeType(idx, index, value)}
                                    >
                                      {OPTIONS.filter(
                                        (o) => !selectedFilter[idx].includes(o.value),
                                      ).map((item) => (
                                        <Option key={item.value} value={item.value}>
                                          {item.label}
                                        </Option>
                                      ))}
                                    </Select>
                                  </Form.Item>
                                </Col>
                                <Col span={7}>
                                  <OptionsValue
                                    type={callTimeFilter[idx][index]}
                                    restField={restField}
                                    name={name}
                                    detail="value"
                                    index={index}
                                    idx={idx}
                                    removeYear={(v) => removeYear(v, idx)}
                                    removeMonth={(v) => removeMonth(v, idx)}
                                    removeDayInMonth={(v) => removeDayInMonth(v, idx)}
                                    removeWeekInYear={(v) => removeWeekInYear(v, idx)}
                                    removeWeekInMonth={(v) => removeWeekInMonth(v, idx)}
                                    removeDayInWeek={(v) => removeDayInWeek(v, idx)}
                                    removeHour={(v) => removeHour(v, idx)}
                                  />
                                </Col>
                                <Col span={1}>
                                  <SwapRightOutlined className={styles['icon-arrow']} />
                                </Col>
                                <Col span={7}>
                                  <OptionsRange
                                    type={callTimeFilter[idx][index]}
                                    restField={restField}
                                    name={name}
                                    detail="range"
                                    index={index}
                                    idx={idx}
                                    year={year}
                                    month={month}
                                    dayInMonth={dayInMonth}
                                    weekInYear={weekInYear}
                                    weekInMonth={weekInMonth}
                                    dayInWeek={dayInWeek}
                                    hour={hour}
                                  />
                                </Col>
                                <Col span={1} className={styles['icon-add-del']}>
                                  {count[idx] < 7 && index === count[idx] - 1 && (
                                    <PlusCircleTwoTone
                                      className={styles['icon-plus-circle']}
                                      onClick={() => onClickAddFilter(add, idx)}
                                    />
                                  )}
                                  {(index < count[idx] - 1 || index === 6) && (
                                    <DeleteIcon
                                      onClick={() => onClickRemove(remove, name, idx, index)}
                                    />
                                  )}
                                </Col>
                              </Row>
                            ))}
                          </>
                        )}
                      </Form.List>
                    </div>
                  </>
                ))}
                <Form.Item noStyle>
                  <div className={styles['addTime']} onClick={() => onClickAddTime(add)}>
                    <Space>
                      <PlusOutlined />
                      <>Thêm thời gian</>
                    </Space>
                  </div>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            label="Ngày không gọi"
            className={styles['form-item-block']}
            name="bypass_datetime"
            labelAlign="left"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <MultipleDatePicker selectProps={{ style: { width: '100%' } }} />
          </Form.Item>
        </Col>
      </Row>
    </ProCard>
  );
}

export default Step3;
