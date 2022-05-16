import React, { useState, useCallback } from 'react';
import PT from 'prop-types';
import { Col, Row, DatePicker, Typography, Button } from 'antd';
import styles from './styles.less';
import moment from 'moment';

CustomeDatePicker.propTypes = {
  onChange: PT.func,
  defaultValue: PT.instanceOf(Array),
  onCheckOverlap: PT.func,
};

CustomeDatePicker.defaultProps = {
  onChange: () => {},
  defaultValue: [],
  onCheckOverlap: () => {},
};

export const CON = {
  date: 'ngay',
  month: 'thang',
  year: 'nam',
  hour: 'gio',
};

function CustomeDatePicker({ onChange, defaultValue, onCheckOverlap, ...rest }) {
  const [valueDate, setValueDate] = useState(defaultValue);
  const [isSelect, toggleSelect] = useState('custom');
  const [isOpenPanel, toggleOpenPanel] = useState(false);

  const handleOnChange = useCallback((date) => {
    if (date && date[0] && date[1]) {
      const { _data } = moment.duration(date[1].diff(date[0]));
      if (_data.years >= 1) {
        onCheckOverlap([CON.month, CON.year]);
      } else {
        if (_data.months >= 1) {
          onCheckOverlap([CON.month, CON.year]);
        } else {
          if (_data.days >= 1) {
            onCheckOverlap([CON.date, CON.month]);
          } else {
            onCheckOverlap([CON.hour, CON.date]);
          }
        }
      }
    }
    setValueDate(date);
    toggleSelect('custom');
  }, []);

  const handleSelectToday = useCallback(() => {
    const today = moment();
    setValueDate([today, today]);
    toggleSelect('today');
    onCheckOverlap([CON.hour, CON.date]);
  }, []);

  const handleSelectSubtractDay = useCallback(
    (number = 1, type) =>
      () => {
        const today = moment();
        const yesterday = moment().subtract(number, 'days');
        if (number == 1) {
          setValueDate([yesterday, yesterday]);
          onCheckOverlap([CON.hour, CON.date]);
        } else {
          setValueDate([yesterday, today]);
          onCheckOverlap([CON.date, CON.month]);
        }
        toggleSelect(type);
      },
    [],
  );

  const handleSelectCurrentMonth = useCallback(() => {
    const today = moment();
    const firtDayOfMonth = moment().startOf('month');
    setValueDate([firtDayOfMonth, today]);
    toggleSelect('month');
    if (today === firtDayOfMonth) {
      onCheckOverlap([CON.hour, CON.date]);
    } else {
      onCheckOverlap([CON.date, CON.month]);
    }
  }, []);

  const handleSelectLastMonth = useCallback(() => {
    const firtDayOfMonth = moment().subtract(1, 'months').startOf('month');
    const endDayOfMonth = moment().subtract(1, 'months').endOf('month');
    setValueDate([firtDayOfMonth, endDayOfMonth]);
    toggleSelect('lastmonth');
    onCheckOverlap([CON.date, CON.month])
  }, []);

  const handleSelectCurrentYear = useCallback(() => {
    const today = moment();
    const firtDayOfYear = moment().startOf('year');
    setValueDate([firtDayOfYear, today]);
    toggleSelect('years');
    onCheckOverlap([CON.month, CON.year])
  }, []);

  const handleSelectLastYear = useCallback(() => {
    const firtDayOfYear = moment().subtract(1, 'years').startOf('year');
    const lastDayOfYear = moment().subtract(1, 'years').endOf('year');
    setValueDate([firtDayOfYear, lastDayOfYear]);
    toggleSelect('lastyears');
    onCheckOverlap([CON.month, CON.year])
  }, []);

  const handleOnOke = useCallback(() => {
    if (onChange) {
      onChange(valueDate);
    }
    toggleOpenPanel(false);
  }, [onChange, valueDate]);

  return (
    <DatePicker.RangePicker
      disabled={false}
      // allowClear={false}
      placeholder={['Từ ngày', 'Đến ngày']}
      value={valueDate}
      onCalendarChange={handleOnChange}
      onChange={onChange}
      open={isOpenPanel}
      onOpenChange={toggleOpenPanel}
      renderExtraFooter={() => (
        <div className={styles['group-btn']}>
          <Button size="small" onClick={() => toggleOpenPanel(false)}>
            Huỷ
          </Button>
          <Button size="small" onClick={handleOnOke} type="primary">
            Ok
          </Button>
        </div>
      )}
      panelRender={(panelNode) => {
        return (
          <Row gutter={[16, 0]}>
            <Col span={4} className={styles['date-picker-panel-menu']}>
              <Typography.Paragraph
                onClick={handleSelectToday}
                className={isSelect === 'today' && styles.active}
              >
                Hôm nay
              </Typography.Paragraph>
              <Typography.Paragraph
                onClick={handleSelectSubtractDay(1, 'yesterday')}
                className={isSelect === 'yesterday' && styles.active}
              >
                Hôm qua
              </Typography.Paragraph>
              <Typography.Paragraph
                onClick={handleSelectSubtractDay(6, '7days')}
                className={isSelect === '7days' && styles.active}
              >
                7 ngày qua
              </Typography.Paragraph>
              <Typography.Paragraph
                onClick={handleSelectSubtractDay(29, '30days')}
                className={isSelect === '30days' && styles.active}
              >
                30 ngày qua
              </Typography.Paragraph>
              <Typography.Paragraph
                onClick={handleSelectCurrentMonth}
                className={isSelect === 'month' && styles.active}
              >
                Tháng này
              </Typography.Paragraph>
              <Typography.Paragraph
                onClick={handleSelectLastMonth}
                className={isSelect === 'lastmonth' && styles.active}
              >
                Tháng trước
              </Typography.Paragraph>
              <Typography.Paragraph
                onClick={handleSelectCurrentYear}
                className={isSelect === 'years' && styles.active}
              >
                Năm này
              </Typography.Paragraph>
              <Typography.Paragraph
                onClick={handleSelectLastYear}
                className={isSelect === 'lastyears' && styles.active}
              >
                Năm trước
              </Typography.Paragraph>
              <Typography.Paragraph className={isSelect === 'custom' && styles.active}>
                Tuỳ chọn
              </Typography.Paragraph>
            </Col>
            <Col span={20}>{panelNode}</Col>
          </Row>
        );
      }}
      {...rest}
    />
  );
}

export default CustomeDatePicker;
