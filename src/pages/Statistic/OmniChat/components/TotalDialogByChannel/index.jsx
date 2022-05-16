import { memo } from 'react';
import { StackedColumnChart } from 'bizcharts';
import { DonuteChart } from '@/components/Chart';
import PT from 'prop-types';

TotalDialogByChannel.propTypes = {
  dataReport: PT.instanceOf(Object).isRequired,
  statFacebook: PT.bool.isRequired,
  statZalo: PT.bool.isRequired,
  statLivechat: PT.bool.isRequired,
};

function TotalDialogByChannel({ dataReport, statFacebook, statZalo, statLivechat }) {
  const { listQuantityConversation, totalConversation } = dataReport;

  const data = [
    { day: '3/6', data: 300, type: 'Livechat' },
    { day: '3/6', data: 400, type: 'Zalo' },
    { day: '3/6', data: 500, type: 'Messenger' },
    { day: '2/1', data: 400, type: 'Livechat' },
    { day: '2/1', data: 800, type: 'Zalo' },
    { day: '2/1', data: 900, type: 'Messenger' },
    { day: '3/1', data: 900, type: 'Livechat' },
    { day: '3/1', data: 800, type: 'Zalo' },
    { day: '3/1', data: 700, type: 'Messenger' },
    { day: '4/1', data: 550, type: 'Livechat' },
    { day: '4/1', data: 1200, type: 'Zalo' },
    { day: '4/1', data: 900, type: 'Messenger' },
    { day: '5/1', data: 350, type: 'Livechat' },
    { day: '5/1', data: 150, type: 'Zalo' },
    { day: '5/1', data: 270, type: 'Messenger' },
    { day: '6/1', data: 650, type: 'Livechat' },
    { day: '6/1', data: 800, type: 'Zalo' },
    { day: '6/1', data: 1300, type: 'Messenger' },
    { day: '7/1', data: 200, type: 'Livechat' },
    { day: '7/1', data: 400, type: 'Zalo' },
    { day: '7/1', data: 500, type: 'Messenger' },
    { day: '8/1', data: 120, type: 'Livechat' },
    { day: '8/1', data: 460, type: 'Zalo' },
    { day: '8/1', data: 780, type: 'Messenger' },
    { day: '9/1', data: 210, type: 'Livechat' },
    { day: '9/1', data: 1100, type: 'Zalo' },
    { day: '9/1', data: 170, type: 'Messenger' },
    { day: '10/1', data: 1210, type: 'Livechat' },
    { day: '10/1', data: 1100, type: 'Zalo' },
    { day: '10/1', data: 200, type: 'Messenger' },
  ];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DonuteChart
          data={[
            { type: 'Livechat', value: 0 },
            { type: 'Zalo', value: 0 },
            { type: 'Messenger', value: 0 },
          ].filter((item) => {
            let arr = [];
            statFacebook && arr.push('Messenger');
            statZalo && arr.push('Zalo');
            statLivechat && arr.push('Livechat');
            return arr.includes(item.type);
          })}
          title={{
            visible: true,
            text: 'Số lượng hội thoại theo các kênh',
            style: {
              // textAlign: 'center',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
              fontSize: 16,
              color: 'rgba(0, 0, 0, 0.85)',
            },
          }}
          width={500}
          height={500}
          autoFit={true}
          innerRadius={0.6}
          radius={0.8}
          label={{
            visible: false,
          }}
          statistic={{
            title: {
              style: {
                height: '30px',
              },
              customHtml: () => 'hội thoại',
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
          color={['#6376ff', '#1ee0ac', '#f6bb23']}
          angleField="value"
          colorField="type"
          pieStyle={{ stroke: 'white', lineWidth: 2 }}
          legend={false}
        />
        <StackedColumnChart
          height={500}
          autoFit={true}
          data={listQuantityConversation}
          color={['#6376ff', '#1ee0ac', '#f7bb23']}
          xField="day"
          yField="data"
          stackField="channel"
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
              visible: true,
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
            visible: true,
            custom: true,
            allowAllCanceled: true,
            position: 'top-right',
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

export default memo(TotalDialogByChannel);
