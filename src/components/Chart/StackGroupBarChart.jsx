/* eslint-disable react/prop-types */
/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */
import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coordinate, Legend, Slider } from 'bizcharts';
import PT from 'prop-types';

Stackedcolumn.propTypes = {
  rows: PT.instanceOf(Array).isRequired,
  axis: PT.shape({
    x: PT.string,
    y: PT.string,
  }).isRequired,
  color: PT.oneOfType([
    PT.string, // colorString, fieldString
    PT.array, // [fieldString, colorString | colorString[] | colorAttributeCallback : func]
  ]),
  legend: PT.instanceOf(Object), // Detail api https://bizcharts.net/product/bizcharts/category/7/page/29
};

Stackedcolumn.defaultProps = {
  color: '',
  legend: {},
};

export default function Stackedcolumn({ rows, axis, color, children, legend, ...rest }) {
  return (
    <Chart scale={{ scrollY: true }} height={400} data={rows} autoFit>
      <Axis name={axis.x} position={'right'} />
      <Axis
        name={axis.y}
        label={{
          offset: 12,
        }}
      />
      <Coordinate transpose scale={[1, -1]} />
      <Legend {...legend} />

      <Geom
        type="interval"
        position={`${axis.y}*${axis.x}`}
        color={color}
        style={{
          stroke: '#fff',
          lineWidth: 1,
        }}
        adjust={[
          {
            type: 'dodge',
            dodgeBy: 'type',
            marginRatio: 0,
          },
          {
            type: 'stack',
          },
        ]}
        {...rest}
      />

      {children && typeof children === 'function' && (
        <Tooltip>
          {(field, items, ...args) => {
            return children(field, items, rows, ...args);
          }}
        </Tooltip>
      )}
    </Chart>
  );
}
