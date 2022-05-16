import React from 'react';
import PT from 'prop-types';
import { StackedColumnChart } from 'bizcharts';

Grouped.propTypes = {
  position: PT.string,
  data: PT.array
};

Grouped.defaultProps = {
  position: '',
  data: [],
};

function Grouped({ data, position, ...rest }) {
  return (
    <StackedColumnChart
      data={data}
      autoFit
      padding="auto"
      xField='xField'
      yField='yField'
      stackField='stackField'
      yAxis={{
        min: 0,
      }}
      legend={{
        visible: true,
        position: 'bottom',
      }}
      {...rest}
    />
  );
}

export default Grouped;
