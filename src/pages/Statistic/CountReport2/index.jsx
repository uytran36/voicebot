import React, { useCallback, useEffect, useState } from 'react';
import { connect, FormattedMessage, formatMessage } from 'umi';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Form,
  List,
  Card,
  Button,
  Select,
  Typography,
  DatePicker,
  Table,
  Row,
  Col,
  message,
} from 'antd';
import moment from 'moment';
import { PieChartFilled } from '@ant-design/icons';
import styles from './styles.less';

import General from './components/General';
import Chart from './components/Chart';

import { requestReportDayOutbound, requestReportMonthOutbound } from './service';

const { Option } = Select;
const { RangePicker } = DatePicker;

// Voice Outbound Threadhold config
const THRESHOLD = {
  CHARACTER_T2S: 10800000,
  REQUEST_T2S: 54000,
  CALL: 27000,
  CALL_TIME: 1620000,
};

const CardLayout = ({ title, icon, suffix, children, styleContainer }) => {
  return (
    <div className={styles.container} style={styleContainer}>
      <div className={styles.header}>
        <div className={styles.prefix}>
          {icon && <div className={styles.icon}>{icon}</div>}
          <div className={styles.title}>{title}</div>
        </div>
        <div className={styles.suffix}>{suffix}</div>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

const CountReport2 = ({ user }) => {
  const [rangeDate, setRangeDate] = useState({
    fromDate: moment().startOf('month'),
    toDate: moment(),
  });
  const { userId, authToken, tokenGateway, tokenHub } = user;
  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`,
  };
  const [dataReportMonth, setDataReportMonth] = useState({});
  const [dataChartCalling, setDataChartCalling] = useState([]);
  const [dataChartTimeCalled, setDataChartTimeCalled] = useState([]);
  const [dataChartRequestT2S, setDataChartRequestT2S] = useState([]);
  const [dataChartCharactersT2S, setDataChartCharactersT2S] = useState([]);

  const queryReportMonthOutBound = useCallback(
    (date) => {
      if (!date) {
        return null;
      }
      return requestReportMonthOutbound(headers, {
        date,
        token: tokenHub,
      }).then((res) => {
        if (res?.success === true && Array.isArray(res.data)) {
          const result = res.data[0] || {};
          setDataReportMonth(result);
        }
      });
    },
    [headers, tokenHub],
  );

  useEffect(() => {
    queryReportMonthOutBound(moment().format('YYYY-MM-DDTHH:mm:ss.000Z'));
  }, []);

  useEffect(() => {
    queryReportDayOutBound(rangeDate, 1);
    queryReportDayOutBound(rangeDate, 2);
    queryReportDayOutBound(rangeDate, 3);
    queryReportDayOutBound(rangeDate, 4);
  }, []);

  const handleDataCall = useCallback(
    (data) => {
      const newData = [];
      data.map((element) => {
        newData.push(
          {
            day: moment(element.date).format('DD/MM'),
            data: element.totalCalled - element.totalCallConnected,
            type: 'Không kết nối',
          },
          {
            day: moment(element.date).format('DD/MM'),
            data: element.totalCallConnected,
            type: 'Có kết nối',
          },
        );
      });
      setDataChartCalling(newData);
    },
    [rangeDate],
  );

  const handleDataTimeCall = useCallback(
    (data) => {
      const newData = [];
      data.forEach((element) => {
        newData.push({
          day: moment(element.date).format('DD/MM'),
          data: element.totalTimeCalled,
        });
      });
      setDataChartTimeCalled(newData);
    },
    [rangeDate],
  );

  const handleDataRequest = useCallback(
    (data) => {
      const newData = [];
      data.forEach((element) => {
        newData.push({
          day: moment(element.date).format('DD/MM'),
          data: element.totalRequestT2S,
        });
      });
      setDataChartRequestT2S(newData);
    },
    [rangeDate],
  );

  const handleDataCharacter = useCallback(
    (data) => {
      const newData = [];
      data.forEach((element) => {
        newData.push({
          day: moment(element.date).format('DD/MM'),
          data: element.totalCharactersT2S,
        });
      });
      setDataChartCharactersT2S(newData);
    },
    [rangeDate],
  );

  const queryReportDayOutBound = useCallback(
    async (dates, titleNumber) => {
      const res = await requestReportDayOutbound(headers, { ...dates, token: tokenHub });
      if (res?.success === true && Array.isArray(res.data)) {
        switch (titleNumber) {
          case 1:
            return handleDataCall(res.data);
          case 2:
            return handleDataTimeCall(res.data);
          case 3:
            return handleDataRequest(res.data);
          case 4:
            return handleDataCharacter(res.data);
          default:
            break;
        }
      }
    },
    [headers, tokenHub],
  );

  const handleRangePickerOnChange = useCallback(
    (dates, titleNumber) => {
      if (dates) {
        const [fromDate, toDate] = dates;
        queryReportDayOutBound(
          {
            fromDate: moment(fromDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
            toDate: moment(toDate).format('YYYY-MM-DDTHH:mm:ss.000Z'),
          },
          titleNumber,
        );
        return null;
      }
    },
    [queryReportDayOutBound],
  );

  const handleDatePickerOnChange = useCallback(
    (date) => {
      if (date) {
        queryReportMonthOutBound(moment(date).format('YYYY-MM-DDTHH:mm:ss.000Z'));
        return null;
      }
      setDataReportMonth({});
    },
    [queryReportMonthOutBound],
  );

  return (
    <>
      <CardLayout
        title={<span style={{ color: '#127ace', fontWeight: 600, fontSize: 16 }}>Tổng quan</span>}
        icon={<PieChartFilled style={{ color: '#526eff' }} />}
        suffix={
          <DatePicker defaultValue={moment()} picker="month" onChange={handleDatePickerOnChange} />
        }
        styleContainer={{ marginTop: 0 }}
      >
        <General threshold={THRESHOLD} data={dataReportMonth} />
      </CardLayout>
      <CardLayout
        title={<span style={{ fontWeight: 600, fontSize: 16 }}>Số lượng cuộc gọi</span>}
        icon={false}
        suffix={
          <RangePicker
            onChange={(date) => handleRangePickerOnChange(date, 1)}
            defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
          />
        }
        styleContainer={{ background: '#fff', padding: '20px 20px' }}
      >
        <div className={styles.chartWrapper}>
          <Chart
            donutData={[
              {
                type: 'Có kết nối',
                value: dataReportMonth.totalCallConnected,
              },
              {
                type: 'Không kết nôí',
                value: dataReportMonth.totalCalled - dataReportMonth.totalCallConnected,
              },
              {
                type: 'Còn lại',
                value:
                  THRESHOLD.CALL -
                  dataReportMonth.totalCallConnected -
                  (dataReportMonth.totalCalled - dataReportMonth.totalCallConnected),
              },
            ]}
            donutColor={['#1EE0AC', '#F6BB23', '#BFBFBF']}
            ratioReport={dataChartCalling}
            barColor={['#F6BB23', '#1EE0AC']}
            donutItem={[
              {
                name: 'Có kết nối',
                value: 'Có kết nối',
                color: '#1EE0AC',
              },
              {
                name: 'Không kết nối',
                value: 'Không kết nối',
                color: '#F6BB23',
              },
              {
                name: 'Còn lại',
                value: 'Còn lại',
                color: '#BFBFBF',
              },
            ]}
            unit="Cuộc"
            type="stackedColumn"
          />
        </div>
      </CardLayout>
      <CardLayout
        title={<span style={{ fontWeight: 600, fontSize: 16 }}>Thời gian thoại</span>}
        icon={false}
        suffix={
          <RangePicker
            onChange={(date) => handleRangePickerOnChange(date, 2)}
            defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
          />
        }
        styleContainer={{ background: '#fff', padding: '20px 20px' }}
      >
        <div className={styles.chartWrapper}>
          <Chart
            donutData={[
              {
                type: 'Đã sử dụng',
                value: dataReportMonth?.totalTimeCalled,
              },
              {
                type: 'Còn lại',
                value: THRESHOLD.CALL_TIME - dataReportMonth?.totalTimeCalled,
              },
            ]}
            donutColor={['#428DFF', '#BFBFBF']}
            ratioReport={dataChartTimeCalled}
            barColor="#428DFF"
            donutItem={[
              {
                name: 'Đã sử dụng',
                value: 'Đã sử dụng',
                color: '#428DFF',
              },
              {
                name: 'Còn lại',
                value: 'Còn lại',
                color: '#BFBFBF',
              },
            ]}
            unit="phút"
            type="column"
          />
        </div>
      </CardLayout>
      <CardLayout
        title={<span style={{ fontWeight: 600, fontSize: 16 }}>API đã yêu cầu</span>}
        icon={false}
        suffix={
          <RangePicker
            onChange={(date) => handleRangePickerOnChange(date, 3)}
            defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
          />
        }
        styleContainer={{ background: '#fff', padding: '20px 20px' }}
      >
        <div className={styles.chartWrapper}>
          <Chart
            donutData={[
              {
                type: 'Đã sử dụng',
                value: dataReportMonth?.totalRequestT2S,
              },
              {
                type: 'Còn lại',
                value: THRESHOLD.REQUEST_T2S - dataReportMonth?.totalRequestT2S,
              },
            ]}
            donutColor={['#07C2DE', '#BFBFBF']}
            ratioReport={dataChartRequestT2S}
            barColor="#07C2DE"
            donutItem={[
              {
                name: 'Đã sử dụng',
                value: 'Đã sử dụng',
                color: '#07C2DE',
              },
              {
                name: 'Còn lại',
                value: 'Còn lại',
                color: '#BFBFBF',
              },
            ]}
            unit="API"
            type="column"
          />
        </div>
      </CardLayout>
      <CardLayout
        title={<span style={{ fontWeight: 600, fontSize: 16 }}>Số ký tự T2S</span>}
        icon={false}
        suffix={
          <RangePicker
            onChange={(date) => handleRangePickerOnChange(date, 4)}
            defaultValue={[rangeDate.fromDate, rangeDate.toDate]}
          />
        }
        styleContainer={{ background: '#fff', padding: '20px 20px' }}
      >
        <div className={styles.chartWrapper}>
          <Chart
            donutData={[
              {
                type: 'Đã sử dụng',
                value: dataReportMonth?.totalCharactersT2S,
              },
              {
                type: 'Còn lại',
                value: THRESHOLD.CHARACTER_T2S - dataReportMonth?.totalCharactersT2S,
              },
            ]}
            donutColor={['#FFA000', '#BFBFBF']}
            ratioReport={dataChartCharactersT2S}
            barColor="#FFA000"
            donutItem={[
              {
                name: 'Đã sử dụng',
                value: 'Đã sử dụng',
                color: '#FFA000',
              },
              {
                name: 'Còn lại',
                value: 'Còn lại',
                color: '#BFBFBF',
              },
            ]}
            unit="kí tự"
            type="column"
          />
        </div>
      </CardLayout>
    </>
  );
};
export default connect(({ user }) => ({ user }))(CountReport2);
