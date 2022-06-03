import React, { useState, useCallback } from 'react';
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
  year,
  month,
  dayInMonth,
  weekInYear,
  weekInMonth,
  dayInWeek,
  hour,
}) => {
  const [selectedHour, setSelectedHour] = useState(0);

  const DAY_IN_WEEK = [
    { label: 'Thứ hai', value: 'mon' },
    { label: 'Thứ ba', value: 'tue' },
    { label: 'Thứ tư', value: 'wed' },
    { label: 'Thứ năm', value: 'thu' },
    { label: 'Thứ sáu', value: 'fri' },
    { label: 'Thứ bảy', value: 'sat' },
    { label: 'Chủ nhật', value: 'sun' },
  ];

  const rules = [
    {
      required: true,
      message: 'Không được để trống',
    },
    // ({ getFieldValue }) => ({
    //   async validator(_, value) {
    //     const filters = getFieldValue('filters');

    //     if (filters[idx]?.filterItem[index]?.value <= value) {
    //       return Promise.resolve();
    //     }
    //     return notification['error']({
    //       message: 'Lỗi',
    //       description: `Trường "Giá trị" phải nhỏ hơn "Khoảng"`,
    //     });
    //   },
    // }),
  ];


  const disabledHours = () => {
    let hours = [];
    for (let i = 0; i < hour[idx].h; i++) {
      hours.push(i);
    }
    console.log(hours)
    return hours;
  };

  const disabledMinutes = () => {
    let minutes = [];
    if (selectedHour === hour[idx].h) {
      for (let i = 0; i < hour[idx].m; i++) {
        minutes.push(i);
      }
      return minutes;
    }

    return minutes;
  };

  return (
    <div className={styles['options']}>
      {type === 'year' && (
        <Form.Item noStyle {...restField} name={[name, detail]} rules={rules}>
          <Select style={{ width: 200 }}>
            {year[idx].map((item) => (
              <Option key={item + moment().year()} value={item + moment().year()}>
                {item + moment().year()}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'month' && (
        <Form.Item noStyle {...restField} name={[name, detail]} rules={rules}>
          <Select style={{ width: 200 }}>
            {month[idx].map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'dayInMonth' && (
        <Form.Item noStyle {...restField} name={[name, detail]} rules={rules}>
          <Select style={{ width: 200 }}>
            {dayInMonth[idx].map((item) => (
              <Option value={item}>{item}</Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'dayInWeek' && (
        <Form.Item noStyle {...restField} name={[name, detail]}>
          <Select style={{ width: 200 }}>
            {DAY_IN_WEEK.filter((o) => dayInWeek[idx].includes(o.value)).map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'weekInYear' && (
        <Form.Item noStyle {...restField} name={[name, detail]} rules={rules}>
          <Select style={{ width: 200 }}>
            {weekInYear[idx].map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'weekInMonth' && (
        <Form.Item noStyle {...restField} name={[name, detail]} rules={rules}>
          <Select style={{ width: 200 }}>
            {weekInMonth[idx].map((item) => (
              <Option key={item} value={item}>
                {item}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'hour' && (
        <Form.Item noStyle {...restField} name={[name, detail]}>
          <TimePicker
            style={{ width: 200 }}
            format="HH:mm"
            onSelect={(time) => setSelectedHour(moment(time).hour())}
            disabledHours={disabledHours}
            disabledMinutes={disabledMinutes}
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
