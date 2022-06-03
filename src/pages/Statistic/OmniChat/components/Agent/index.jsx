import { DonutChart, StackedBarChart } from 'bizcharts';

function Agent(props) {
  const data = [
    { agent: 'ThucPT3', data: 61, type: 'Đang giải quyết' },
    { agent: 'ThucPT3', data: 72, type: 'Đã hoàn thành' },
    { agent: 'SangTT9', data: 11, type: 'Đang giải quyết' },
    { agent: 'SangTT9', data: 112, type: 'Đã hoàn thành' },
    { agent: 'HaDT53', data: 100, type: 'Đang giải quyết' },
    { agent: 'HaDT53', data: 200, type: 'Đã hoàn thành' },
    { agent: 'QuanTH20', data: 123, type: 'Đang giải quyết' },
    { agent: 'QuanTH20', data: 248, type: 'Đã hoàn thành' },
    { agent: 'NguyetNB2', data: 190, type: 'Đang giải quyết' },
    { agent: 'NguyetNB2', data: 89, type: 'Đã hoàn thành' },
    { agent: 'MinhPD11', data: 345, type: 'Đang giải quyết' },
    { agent: 'MinhPD11', data: 658, type: 'Đã hoàn thành' },
    { agent: 'TriLM22', data: 129, type: 'Đang giải quyết' },
    { agent: 'TriLM22', data: 67, type: 'Đã hoàn thành' },
    { agent: 'HuongNT256', data: 190, type: 'Đang giải quyết' },
    { agent: 'HuongNT256', data: 227, type: 'Đã hoàn thành' },
  ];
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DonutChart
          data={[
            { type: 'Available', value: 75 },
            { type: 'Busy', value: 10 },
            { type: 'Offline', value: 15 },
          ]}
          title={{
            visible: true,
            text: 'Số lượng Agent',
            style: {
              textAlign: 'center',
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
              customHtml: () => 'agent',
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
          color={['#1ee0ac', '#f6bb23', '#ee414a']}
          angleField="value"
          colorField="type"
          pieStyle={{ stroke: 'white', lineWidth: 2 }}
          legend={{
            position: 'bottom',
            custom: true,
            allowAllCanceled: true,
            items: [
              {
                value: 'Available',
                name: 'Available',
                marker: {
                  symbol: 'square',
                  style: { fill: '#1ee0ac', r: 5 },
                },
              },
              {
                value: 'Busy',
                name: 'Busy',
                marker: {
                  symbol: 'square',
                  style: { fill: '#f6bb23', r: 5 },
                },
              },
              {
                value: 'Offline',
                name: 'Offline',
                marker: {
                  symbol: 'square',
                  style: { fill: '#ee414a', r: 5 },
                },
              },
            ],
          }}
        />
        <StackedBarChart
          height={500}
          autoFit={true}
          data={data}
          color={['#1ee0ac', '#6376ff']}
          xField="data"
          yField="agent"
          stackField="type"
          padding="auto"
          title={{
            visible: true,
            text: 'Số lượng chat từng agent',
            style: {
              textAlign: 'center',
              fontWeight: 'bold',
              fontFamily: 'Roboto',
              fontSize: 16,
              color: 'rgba(0, 0, 0, 0.85)',
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
              visible: true,
            },
            label: {
              visible: true,
              autoRotate: true,
              autoHide: true,
            },
          }}
          legend={{
            custom: true,
            allowAllCanceled: true,
            position: 'bottom',
            items: [
              {
                value: 'Đang giải quyết',
                name: 'Đang giải quyết',
                marker: {
                  symbol: 'square',
                  style: { fill: '#1ee0ac', r: 5 },
                },
              },
              {
                value: 'Đã hoàn thành',
                name: 'Đã hoàn thành',
                marker: {
                  symbol: 'square',
                  style: { fill: '#6376ff', r: 5 },
                },
              },
            ],
          }}
          // open below cmt if data is too large
          // scrollbar={{
          //   type: "vertical"
          // }}
        />
      </div>
    </>
  );
}

export default Agent;
