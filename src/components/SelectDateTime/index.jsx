import React, { useCallback, useState, memo } from 'react';
import { Radio } from 'antd';
import moment from 'moment';
import PT from 'prop-types';

SelectDateTime.propTypes = {
  startDate: PT.func.isRequired,
  endDate: PT.func.isRequired,
  callback: PT.func.isRequired,
  selectedValue: PT.string.isRequired,
  dateDiff: PT.number.isRequired,
  monthDiff: PT.number.isRequired,
};

function SelectDateTime({
  selectedValue,
  startDate,
  endDate,
  callback,
  dateDiff,
  monthDiff,
}) {
  const handleChangeTime = useCallback(
    (e) => {
      callback(e.target.value);
    },
    [callback],
  );
  // console.log(moment(startDate).day() , monthDiff);
  return (
    <Radio.Group value={selectedValue} onChange={handleChangeTime}>
      <Radio.Button value="HOURS" disabled={dateDiff > 0}>
        Giờ
      </Radio.Button>
      <Radio.Button
        value="DAYS"
        disabled={(monthDiff > 0)}
      >
        {' '}
        Ngày
      </Radio.Button>
      <Radio.Button value="MONTHS" disabled={dateDiff === 0}>
        Tháng
      </Radio.Button>
      <Radio.Button value="YEARS" disabled={monthDiff < 1}>
        Năm
      </Radio.Button>
    </Radio.Group>
  );
}

export default memo(SelectDateTime);
