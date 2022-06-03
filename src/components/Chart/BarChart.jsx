import React from 'react';
import PT from 'prop-types';
import { BarChart } from 'bizcharts';

RenderBarChart.propTypes = {
    data: PT.instanceOf(Array).isRequired,
    xField: PT.string.isRequired,
    yField: PT.string.isRequired,
}

/**
 * 
 * @param rest - Detail see at: https://bizcharts.net/product/BizCharts4/category/77/page/126
 * @returns {<React.Component>}
 */
export default function RenderBarChart({ data, xField, yField, ...rest }) {
  return <BarChart data={data} xField={xField} yField={yField} {...rest} />;
}
