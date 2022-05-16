import { LineChart } from 'bizcharts';
import PT from 'prop-types';

LineChart.propTypes = {
  options: PT.instanceOf(Object),
  data: PT.instanceOf(Array).isRequired,
  xField: PT.string.isRequired,
  yField: PT.string.isRequired,
};

function RenderLineChart({ data, xField, yField, min, max, ...rest}) {
  return (
    <LineChart
      height={500}
      autoFit={true}
      data={data}
      xField={xField}
      yField={yField}
      seriesField="status"
      padding="auto"
      meta={{
        day: {
          range: [0, 1],
        },
      }}
      lineSize={10}
      xAxis={{
        visible: true,
        grid: {
          visible: true,
        },
        line: {
          visible: true,
        },
        tickLine: {
          visible: false,
        },
        label: {
          visible: true,
          autoRotate: true,
          autoHide: true,
        },
      }}
      yAxis={{
        visible: true,
        grid: {
          visible: true,
        },
        line: {
          visible: true,
        },
        tickLine: {
          visible: false,
        },
        label: {
          visible: true,
          autoRotate: true,
          autoHide: true,
        },
        title: {
          visible: false,
          offset: 12,
        },
        min: min,
        max: max,
        tickCount: 10,
      }}
      point={{
        visible: true,
        shape: 'hollow-circle',
      }}
      {...rest}
     />
  );
}

export default RenderLineChart
