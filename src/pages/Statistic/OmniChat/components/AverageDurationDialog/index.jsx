import { memo } from 'react';
import { LineChart } from 'bizcharts';
import { DonuteChart } from '@/components/Chart';
import PT from 'prop-types';

AverageDurationDialog.propTypes = {
  dataReport: PT.instanceOf(Object).isRequired,
  typeAverage: PT.string.isRequired,
  statFacebook: PT.bool.isRequired,
  statZalo: PT.bool.isRequired,
  statLivechat: PT.bool.isRequired,
};

function AverageDurationDialog({ dataReport, typeAverage, statFacebook, statZalo, statLivechat }) {
  const { listProcessingTimeAvg, listWaitingTimeAvg, listConversationTimeAvg } = dataReport;

  const data = [
    { day: '1/1', data: 1, channel: 'Livechat' },
    { day: '1/1', data: 2, channel: 'Zalo' },
    { day: '1/1', data: 4, channel: 'Messenger' },
    { day: '2/1', data: 5, channel: 'Livechat' },
    { day: '2/1', data: 6, channel: 'Zalo' },
    { day: '2/1', data: 6, channel: 'Messenger' },
    { day: '3/1', data: 7, channel: 'Livechat' },
    { day: '3/1', data: 8, channel: 'Zalo' },
    { day: '3/1', data: 2, channel: 'Messenger' },
    { day: '4/1', data: 3, channel: 'Livechat' },
    { day: '4/1', data: 5, channel: 'Zalo' },
    { day: '4/1', data: 5, channel: 'Messenger' },
    { day: '5/1', data: 10, channel: 'Livechat' },
    { day: '5/1', data: 7, channel: 'Zalo' },
    { day: '5/1', data: 9, channel: 'Messenger' },
    { day: '6/1', data: 1, channel: 'Livechat' },
    { day: '6/1', data: 5, channel: 'Zalo' },
    { day: '6/1', data: 3, channel: 'Messenger' },
    { day: '7/1', data: 4, channel: 'Livechat' },
    { day: '7/1', data: 4, channel: 'Zalo' },
    { day: '7/1', data: 7, channel: 'Messenger' },
    { day: '8/1', data: 8, channel: 'Livechat' },
    { day: '8/1', data: 9, channel: 'Zalo' },
    { day: '8/1', data: 9, channel: 'Messenger' },
    { day: '9/1', data: 6, channel: 'Livechat' },
    { day: '9/1', data: 5, channel: 'Zalo' },
    { day: '9/1', data: 4, channel: 'Messenger' },
    { day: '10/1', data: 3, channel: 'Livechat' },
    { day: '10/1', data: 10, channel: 'Zalo' },
    { day: '10/1', data: 7, channel: 'Messenger' },
  ];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DonuteChart
          data={[
            { type: 'Thời gian chờ TB', value: 0 },
            { type: 'Thời gian xử lý TB', value: 0 },
          ]}
          title={{
            visible: false,
          }}
          width={500}
          height={500}
          statistic={{
            title: {
              style: {
                height: '30px',
              },
              customHtml: () => 'phút',
              // offsetX: 31,
              offsetY: 30,
            },
            content: {
              style: {
                color: '#127ace',
              },
              offsetY: -30,
            },
          }}
          padding="auto"
          color={['#f6bb23', '#428dff']}
          angleField="value"
          colorField="type"
          legend={{
            position: 'bottom',
            custom: true,
            allowAllCanceled: true,
            items: [
              {
                value: 'Thời gian chờ TB',
                name: 'Thời gian chờ TB',
                marker: {
                  symbol: 'square',
                  style: { fill: '#f6bb23', r: 5 },
                },
              },
              {
                value: 'Thời gian xử lý TB',
                name: 'Thời gian xử lý TB',
                marker: {
                  symbol: 'square',
                  style: { fill: '#428dff', r: 5 },
                },
              },
            ],
          }}
        />
        <LineChart
          // width={700}
          height={500}
          autoFit={true}
          data={
            typeAverage === 'conversation'
              ? listConversationTimeAvg
              : typeAverage === 'waiting'
              ? listWaitingTimeAvg
              : listProcessingTimeAvg
          }
          color={['#6376ff', '#1ee0ac', '#f6bb23']}
          xField="day"
          yField="data"
          seriesField="channel"
          padding="auto"
          meta={{
            day: {
              range: [0, 1],
            },
          }}
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
            title: {
              visible: true,
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
          point={{
            visible: true,
            shape: 'hollow-circle',
          }}
          legend={{
            position: 'bottom',
            custom: true,
            allowAllCanceled: true,
            items: [
              {
                value: 'Messenger',
                name: 'Messenger',
                marker: {
                  symbol: 'square',
                  style: { fill: '#f6bb23', r: 5 },
                },
              },
              {
                value: 'Zalo',
                name: 'Zalo',
                marker: {
                  symbol: 'square',
                  style: { fill: '#1ee0ac', r: 5 },
                },
              },
              {
                value: 'Livechat',
                name: 'Livechat',
                marker: {
                  symbol: 'square',
                  style: { fill: '#6376ff', r: 5 },
                },
              },
            ].filter((item) => {
              let arr = [];
              statFacebook && arr.push('Messenger');
              statZalo && arr.push('Zalo');
              statLivechat && arr.push('Livechat');
              return arr.includes(item.name);
            }),
          }}
        />
      </div>
    </>
  );
}

export default memo(AverageDurationDialog);
