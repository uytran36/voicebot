import { BarChart } from 'bizcharts';
import styles from './styles.less';

const AmountOutbound = ({ rangeDate }) => {
  const data = [
    {
      value: 25,
      type: 'Máy bận',
    },
    {
      value: 50,
      type: 'Khách hàng từ chối',
    },
    {
      value: 75,
      type: 'Không bắt máy',
    },
    {
      value: 100,
      type: 'Lỗi hệ thống 1',
    },
    {
      value: 80,
      type: 'Lỗi hệ thống 2',
    },
  ];

  return (
    <BarChart
      color={'#FF4D4F'}
      data={data}
      xField={'value'}
      yField={'type'}
      title={{
        visible: true,
        text: 'Số lượng cuộc gọi',
        style: {
          fontFamily: 'Helvetica',
          textAlign: 'center',
          fontSize: '20px',
        },
      }}
      description={{
        visible: true,
        alignTo: 'left',
        text: 'Nguyên nhân',
        style: {
          fontSize: 16,
          fill: 'black',
          fontFamily: 'Helvetica',
          fontWeight: 'bold'
        },
      }}
    />
  );
};

export default AmountOutbound;
