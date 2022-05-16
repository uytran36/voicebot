import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './styles.less';
import PropTypes from 'prop-types';
import { requestGetLogCallEvent } from '@/services/call-center';
import { message, Tag } from 'antd';
import moment from 'moment';
// import Timer from 'react-compound-timer';

LogCall.propTypes = {
  logCall: PropTypes.instanceOf(Array).isRequired,
  dataCallInterface: PropTypes.shape({
    session_id: PropTypes.string,
    cid_number: PropTypes.string,
    agent_id: PropTypes.string,
    agent: PropTypes.string,
  }).isRequired,
  headers: PropTypes.instanceOf(Object).isRequired,
  callManagement: PropTypes.instanceOf(Object).isRequired,
};

function LogCall({ callManagement, headers }) {
  const { dataCallInterface, answeringTime, ringingTime, numberCall, callId } = callManagement;
  // const [log, setLog] = useState([]);

  // useEffect(() => {
  //   if (dataCallInterface && Object.keys(dataCallInterface).length > 0) {
  //     requestGetLogCallEvent(
  //       {
  //         sessionId: dataCallInterface.session_id,
  //       },
  //       headers,
  //     )
  //       .then((res) => {
  //         if (res.success) {
  //           return setLog(res.data);
  //         }
  //         console.error('ERROR~', res);
  //         return message.warning('Không thể hiển thị log cuộc gọi.');
  //       })
  //       .catch((err) => {
  //         console.error(err.toString());
  //         return message.warning('Không thể hiển thị log cuộc gọi.');
  //       });
  //   }
  // }, [dataCallInterface]);

  return (
    <div className={styles.logWrapper}>
      <div className={styles.log}>
        <Tag color="default">Call ID</Tag>
        {/* <span>{log[1]?.session_id}</span> */}
        <span>{callId}</span>
      </div>
      <div className={styles.log}>
        <Tag color="default">DID</Tag>
        {/* <span>{log[1]?.did}</span> */}
        <span>{numberCall}</span>
      </div>
      <div className={styles.log}>
        <Tag color="default">Ngày gọi</Tag>
        {/* <span>{log[1]?.date ? moment(log[1].date).format('DD/MM/YYYY') : ''}</span> */}
        <span>{ringingTime ? moment(ringingTime).format('DD/MM/YYYY') : ''}</span>
      </div>
      <div className={styles.log}>
        <Tag color="processing">Nhà mạng</Tag>
        {/* <span>{log[1]?.tel_carrier}</span> */}
        <span>{''}</span>
      </div>
      <div className={styles.log}>
        <Tag color="error">TG khởi tạo</Tag>
        <span style={{ color: '#f5222d' }}>
          {/* {log[1]?.create_time ? moment(log[1].create_time).format('HH:mm:ss') : ''} */}
          {ringingTime ? moment(ringingTime).format('HH:mm:ss') : ''}
        </span>
      </div>
      <div className={styles.log}>
        <Tag color="success">TG bắt đầu</Tag>
        <span style={{ color: '#52c41a' }}>
          {/* {log[1]?.answer_time ? moment(log[1].answer_time).format('HH:mm:ss') : ''} */}
          {answeringTime ? moment(answeringTime).format('HH:mm:ss') : ''}
        </span>
      </div>
      {/* <div className={styles.log}>
        <Tag>Đàm thoại</Tag>
        <Timer
          startImmediately={false}
          formatValue={(value) => `${value < 10 ? `0${value}` : value} `}
          initialTime={55000}
        >
          {(control) => {
            return (
              <div className={styles.counter}>
                <span>
                  <Timer.Hours />
                </span>
                <span>
                  <Timer.Minutes />
                </span>
                <span>
                  <Timer.Seconds />
                </span>
              </div>
            );
          }}
        </Timer>
      </div>
      <div className={styles.log}>
        <Tag>TG cước</Tag>
        <span>{log[1].did}</span>
      </div> */}
      <div className={styles.log}>
        <Tag color="processing">TG chờ</Tag>
        <span style={{ color: '#1890ff' }}>
          {/* {`${
            log[1]?.create_time && log[1]?.answer_time
              ? Math.round(
                  moment(log[1]?.answer_time).diff(moment(log[1]?.create_time), 'millisecond') /
                    1000,
                )
              : ''
          } (s)`} */}
          {`${
            answeringTime && ringingTime
              ? Math.round(moment(answeringTime).diff(moment(ringingTime), 'millisecond') / 1000)
              : ''
          } (s)`}
        </span>
      </div>
    </div>
  );
}

export default connect(({ callManagement }) => ({
  callManagement,
}))(LogCall);
