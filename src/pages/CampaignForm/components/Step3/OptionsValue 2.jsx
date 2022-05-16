import React from 'react';
import { TimePicker, Select, Form, notification } from 'antd';
import moment from 'moment';
import styles from './styles.less';

const { Option } = Select;

const Options = ({
  type,
  restField,
  name,
  detail,
  index,
  idx,
  removeYear,
  removeMonth,
  removeDayInMonth,
  removeWeekInYear,
  removeWeekInMonth,
  removeDayInWeek,
  removeHour,
}) => {
  const yearVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const monthVal = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const dayInMonthVal = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekInYearVal = Array.from({ length: 53 }, (_, i) => i + 1);

  return (
    <div className={styles['options']}>
      {type === 'year' && (
        <Form.Item noStyle {...restField} name={[name, detail]}>
          <Select style={{ width: 200 }} onChange={(value) => removeYear(value)}>
            {yearVal.map((item) => (
              <Option key={item + moment().year()} value={item + moment().year()}>
                {item + moment().year()}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'month' && (
        <Form.Item noStyle {...restField} name={[name, detail]}>
          <Select style={{ width: 200 }} onChange={(value) => removeMonth(value)}>
            {monthVal.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'dayInMonth' && (
        <Form.Item noStyle {...restField} name={[name, detail]}>
          <Select style={{ width: 200 }} onChange={(value) => removeDayInMonth(value)}>
            {dayInMonthVal.map((item) => (
              <Option value={item}>{item}</Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'dayInWeek' && (
        <Form.Item noStyle {...restField} name={[name, detail]}>
          <Select style={{ width: 200 }} onChange={(value) => removeDayInWeek(value)}>
            <Option key="mon" value="mon">
              Thứ hai
            </Option>
            <Option key="tue" value="tue">
              Thứ ba
            </Option>
            <Option key="wed" value="wed">
              Thứ tư
            </Option>
            <Option key="thu" value="thu">
              Thứ năm
            </Option>
            <Option key="fri" value="fri">
              Thứ sáu
            </Option>
            <Option key="sat" value="sat">
              Thứ bảy
            </Option>
            <Option key="sun" value="sun">
              Chủ nhật
            </Option>
          </Select>
        </Form.Item>
      )}
      {type === 'weekInYear' && (
        <Form.Item noStyle {...restField} name={[name, detail]}>
          <Select style={{ width: 200 }} onChange={(value) => removeWeekInYear(value)}>
            {weekInYearVal.map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'weekInMonth' && (
        <Form.Item noStyle {...restField} name={[name, detail]}>
          <Select style={{ width: 200 }} onChange={(value) => removeWeekInMonth(value)}>
            <Option key={1} value={1}>
              1
            </Option>
            <Option key={2} value={2}>
              2
            </Option>
            <Option key={3} value={3}>
              3
            </Option>
            <Option key={4} value={4}>
              4
            </Option>
            <Option key={5} value={5}>
              5
            </Option>
          </Select>
        </Form.Item>
      )}
      {type === 'hour' && (
        <Form.Item noStyle {...restField} name={[name, detail]}>
          <TimePicker
            style={{ width: 200 }}
            format="HH:mm"
            onChange={(value) => removeHour(value)}
          />
        </Form.Item>
      )}
      {type === '' && (
        <Form.Item noStyle {...restField} name={[name, detail]}>
          <Select style={{ width: 200 }}></Select>
        </Form.Item>
      )}
    </div>
  );
};

export default Options;
