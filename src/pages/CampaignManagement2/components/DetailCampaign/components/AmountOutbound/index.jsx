import { StackedColumnChart } from 'bizcharts';
import styles from './styles.less';

const AmountOutbound = ({rangeDate, data}) => {

  return (
    <StackedColumnChart
      data={data}
      color={['#428DFF', '#FF9B2F', '#EE414A']}
      xField="day"
      yField="data"
      stackField="type"
      title={{
        visible: false,
        text: 'Số lượng cuộc gọi',
        style: {
          textAlign: 'top-left',
          fontWeight: 'bold',
          fontFamily: 'Roboto',
          fontSize: 16,
          color: 'rgba(0, 0, 0, 0.85)',
        },
      }}
      legend={{
        visible: true,
        custom: true,
        allowAllCanceled: true,
        position: 'top-center',
        items: [
          {
            value: 'Cuộc gọi thành công',
            name: 'Cuộc gọi thành công',
            marker: {
              symbol: 'square',
              style: { fill: '#428DFF', r: 5 },
            },
          },
          {
            value: 'Cuộc gọi thất bại',
            name: 'Cuộc gọi thất bại',
            marker: {
              symbol: 'square',
              style: { fill: '#FF9B2F', r: 5 },
            },
          },
          {
            value: 'Cuộc gọi lỗi',
            name: 'Cuộc gọi lỗi',
            marker: {
              symbol: 'square',
              style: { fill: '#EE414A', r: 5 },
            },
          },
        ],
      }}
    />
  );
};

export default AmountOutbound;
