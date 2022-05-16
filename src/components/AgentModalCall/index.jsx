import React, { useState } from 'react';
import { Input } from 'antd';
import PT from 'prop-types';
import All from './All';
import Missed from './Missed';
import Keyboard from '../Keyboard';
import style from './style.less';
import CheckWindownSize from '@/components/CheckWindownSize';
import { UserAgent } from 'sip.js';

Call.propTypes = {
  userAgent: PT.oneOfType([PT.instanceOf(Object), PT.null]).isRequired,
  getNumber: PT.func.isRequired,
  setStateSession: PT.func.isRequired,
};

function Call({ userAgent, getNumber, setStateSession }) {
  const [ult, setUlt] = useState('all');

  const handleCalling = (number) => {
    // make ringing....
    userAgent.call(`sip:${number}@sccpbx.com`);
    setStateSession('Initial');
    getNumber(number);
  };

  const size = CheckWindownSize();

  return (
    <>
      {/* <div span={24} className={style['title-container']}>
        <span>Bàn phím số</span>
      </div> */}
      <Keyboard handleCalling={handleCalling} />
    </>
    // <div className={style.body}>
    //   <div className={style.bodyWrapper} style={{ display: size.screen === 'md' || size.screen === 'sm' || size.screen === 'xs' ? 'block' : 'flex' }}>
    //     <div className={style.left}>
    //       <div className={style.header1}>
    //         <div
    //           className={style.button}
    //           style={ult === 'all' ? { background: '#0779FE', border: 'none' } : null}
    //           onClick={() => setUlt('all')}
    //         >
    //           <span>Tất cả</span>
    //         </div>
    //         <div
    //           className={style.button}
    //           style={ult === 'missed' ? { background: '#0779FE', border: 'none' } : null}
    //           onClick={() => setUlt('missed')}
    //         >
    //           <span>Cuộc gọi nhỡ</span>
    //         </div>
    //       </div>
    //       <div className={style.header2} style={{ padding: size.screen === 'lg' ? '0px 25px 30px 25px' : '0px 50px 30px 50px' }}>
    //         <div className={style.title} style={{ marginRight: size.screen === 'xxl' ? '100px' : '45px' }}>
    //           <span>Tất cả</span>
    //         </div>
    //         <div className={style.search}>
    //           <Input
    //             style={{
    //               background: 'transparent',
    //               color: '#fff',
    //               width: size.screen === 'xxl' ? '628px' : size.screen === 'xl' ? '384px' : size.screen === 'lg' ? '128px' : size.screen === 'md' ? '384px' : size.screen === 'sm' ? '284px' : '184px',
    //               height: '45px',
    //               borderRadius: '5px',
    //               fontSize: '15px',
    //             }}
    //             placeholder={"Tìm kiếm"}
    //           />
    //         </div>
    //       </div>
    //       {ult === 'all' && <All />}
    //       {ult === 'missed' && <Missed />}
    //     </div>
    //     <div className={style.right}>
    //       <Keyboard handleCalling={handleCalling}/>
    //     </div>
    //   </div>
    // </div>
  );
}

export default Call;
