import React, { Fragment, useState, useCallback } from 'react';
import { Input, Button, Popover, message } from 'antd';
import { PhoneFilled } from '@ant-design/icons';
import PT from 'prop-types';
import Numbpad from '../Icons/numpad';
import styles from './index.less';
import Keyboard from '../Keyboard';
import { connect } from 'umi';
// import { requestGetOmniContactListNormalizationEditInfo } from '@/pages/CallManagement/service';

const Suffix = ({ getValue, children }) => {
  return (
    <Fragment>
      <Popover
        placement="bottom"
        trigger="click"
        arrowPointAtCenter={false}
        title={
          <div className={styles['suffix-list-dropdown']}>
            <div className={styles['title-dropdown']}>
              <span>Không có trong danh bạ</span>
              {/** Render list contact in here */}
            </div>
          </div>
        }
        content={<Keyboard size="small" getValue={getValue} />}
      >
        <Button style={{ border: 'none' }} type="link" icon={<Numbpad />} />
      </Popover>
      {children}
    </Fragment>
  );
};

Suffix.propTypes = {
  getValue: PT.func.isRequired,
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
};

Diapad.propTypes = {
  call: PT.func.isRequired,
  isShowPhoneCall: PT.bool.isRequired,
  handleSendDTMF: PT.func.isRequired,
  callManagement: PT.instanceOf(Object).isRequired,
};

function Diapad({ call, isShowPhoneCall, handleSendDTMF, callManagement }) {
  const [valueInput, setValueInput] = useState('');
  const [infoCus, setInfoCus] = useState({});

  const getValue = useCallback(
    (number) => {
      setValueInput(`${valueInput}${number}`);
      if (callManagement.answeringTime) {
        handleSendDTMF(number);
      }
    },
    [setValueInput, valueInput, callManagement, handleSendDTMF],
  );

  const handleCall = useCallback(() => {
    message.loading('Đang thực hiện cuộc gọi.');
    call(valueInput, {
      earlyMedia: true,
      // alwaysAcquireMediaFirst: true,
      // inviteWithoutSdp: true,
    });
  }, [valueInput, call]);

  // const handleInputChange = useCallback(async e => {
  //   const {value} = e.target;
  //   try {
  //     const res = await requestGetOmniContactListNormalizationEditInfo(headers, value);
  //     if(res.sdt && res.ho_va_ten) {
  //       setInfoCus(res);
  //     }
  //   } catch(err) {
  //     message.error(err.toString());
  //     setInfoCus({});
  //   }
  // }, [headers])

  return (
    <Input
      allowClear
      value={valueInput}
      onChange={(e) => setValueInput(`${e.target.value}`)}
      className={styles.input}
      placeholder="Nhập tên hoặc số"
      suffix={
        <Suffix getValue={getValue}>
          <Button
            disabled={!isShowPhoneCall}
            onClick={isShowPhoneCall && handleCall}
            className={`${styles['btn-phone']} ${!isShowPhoneCall && styles['btn-disable']}`}
            shape="circle"
            icon={<PhoneFilled />}
          />
        </Suffix>
      }
    />
  );
}

export default React.memo(Diapad);
