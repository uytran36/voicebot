import React from 'react';
import { TimePicker, Select, Form } from 'antd';
import moment from 'moment';
import styles from './styles.less';

const { Option } = Select;

const Options = ({ type, defaultValue }) => {
  const DAY_IN_WEEK = [
    { label: 'Thứ hai', value: 'mon' },
    { label: 'Thứ ba', value: 'tue' },
    { label: 'Thứ tư', value: 'wed' },
    { label: 'Thứ năm', value: 'thu' },
    { label: 'Thứ sáu', value: 'fri' },
    { label: 'Thứ bảy', value: 'sat' },
    { label: 'Chủ nhật', value: 'sun' },
  ];

  return (
    <div className={styles['options']}>
      {type === 'year' && (
        <Form.Item noStyle>
          <Select defaultValue={defaultValue} disabled className={styles['select-value']}></Select>
        </Form.Item>
      )}
      {type === 'month' && (
        <Form.Item noStyle>
          <Select defaultValue={defaultValue} disabled className={styles['select-value']}></Select>
        </Form.Item>
      )}
      {type === 'dayInMonth' && (
        <Form.Item noStyle>
          <Select defaultValue={defaultValue} disabled className={styles['select-value']}></Select>
        </Form.Item>
      )}
      {type === 'dayInWeek' && (
        <Form.Item noStyle>
          <Select defaultValue={defaultValue} disabled className={styles['select-value']}>
            {DAY_IN_WEEK.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}
      {type === 'weekInYear' && (
        <Form.Item noStyle>
          <Select defaultValue={defaultValue} disabled className={styles['select-value']}></Select>
        </Form.Item>
      )}
      {type === 'weekInMonth' && (
        <Form.Item noStyle>
          <Select defaultValue={defaultValue} disabled className={styles['select-value']}></Select>
        </Form.Item>
      )}
      {type === 'hour' && (
        <Form.Item noStyle>
          <TimePicker
            defaultValue={() => moment(defaultValue, 'HH:mm')}
            disabled
            className={styles['select-value']}
            format="HH:mm"
          />
        </Form.Item>
      )}
      {(type === '' || type === undefined) && (
        <Form.Item noStyle>
          <Select defaultValue={defaultValue} disabled className={styles['select-value']}></Select>
        </Form.Item>
      )}
    </div>
  );
};

export default Options;
