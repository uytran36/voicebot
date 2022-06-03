import { memo } from 'react';
import { StackedColumnChart } from 'bizcharts';
import PT from 'prop-types';

TotalDialog.propTypes = {
  dataReport: PT.instanceOf(Object).isRequired,
};

function TotalDialog({ dataReport }) {
  const { listQuantityChat } = dataReport;
  const data = [
    { day: '1/1', data: 400, type: 'Đã hoàn thành' },
    { day: '1/1', data: 800, type: 'Đã giải quyết' },
    { day: '2/1', data: 300, type: 'Đã hoàn thành' },
    { day: '2/1', data: 1200, type: 'Đã giải quyết' },
    { day: '3/1', data: 800, type: 'Đã hoàn thành' },
    { day: '3/1', data: 350, type: 'Đã giải quyết' },
    { day: '4/1', data: 120, type: 'Đã hoàn thành' },
    { day: '4/1', data: 700, type: 'Đã giải quyết' },
    { day: '5/1', data: 1800, type: 'Đã hoàn thành' },
    { day: '5/1', data: 800, type: 'Đã giải quyết' },
    { day: '6/1', data: 1400, type: 'Đã hoàn thành' },
    { day: '6/1', data: 670, type: 'Đã giải quyết' },
    { day: '7/1', data: 1210, type: 'Đã hoàn thành' },
    { day: '7/1', data: 690, type: 'Đã giải quyết' },
    { day: '8/1', data: 700, type: 'Đã hoàn thành' },
    { day: '8/1', data: 80, type: 'Đã giải quyết' },
    { day: '9/1', data: 1350, type: 'Đã hoàn thành' },
    { day: '9/1', data: 650, type: 'Đã giải quyết' },
    { day: '10/1', data: 200, type: 'Đã hoàn thành' },
    { day: '10/1', data: 1000, type: 'Đã giải quyết' },
  ];
  return (
    <>
      <StackedColumnChart
        height={500}
        autoFit={true}
        data={listQuantityChat}
        color={['#bfbfbf', '#428dff']}
        xField="day"
        yField="data"
        stackField="type"
        padding="auto"
        maxColumnWidth={50}
        xAxis={{
          // visible: true,
          // grid: {
          //   visible: true,
          // },
          // line: {
          //   visible: true,
          // },
          // tickLine: {
          //   visible: true,
          // },
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
          tickCount: 6,
        }}
        legend={{
          visible: false,
          custom: true,
          allowAllCanceled: true,
          position: 'top-right',
          items: [
            {
              value: 'Đang giải quyết',
              name: 'Đang giải quyết',
              marker: {
                symbol: 'square',
                style: { fill: '#428dff', r: 5 },
              },
            },
            {
              value: 'Đã hoàn thành',
              name: 'Đã hoàn thành',
              marker: {
                symbol: 'square',
                style: { fill: '#bfbfbf', r: 5 },
              },
            },
          ],
        }}
      />
    </>
  );
}

export default memo(TotalDialog);
