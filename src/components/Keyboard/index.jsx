import React, { useState, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import style from './style.less';

const Keyboard = ({ getValue, size }) => {

  return (
    <div className={style.body}>
      <div className={style['phone-number']}>
        <div className={style.number} onClick={() => getValue('1')}>
          <p data-size={size}>1</p>
        </div>
        <div className={style.number} onClick={() => getValue('2')}>
          <p className={style.num2} data-size={size}>
            2
          </p>
        </div>
        <div className={style.number} onClick={() => getValue('3')}>
          <p className={style.num3} data-size={size}>
            3
          </p>
        </div>
        <div className={style.number} onClick={() => getValue('4')}>
          <p className={style.num4} data-size={size}>
            4
          </p>
        </div>
        <div className={style.number} onClick={() => getValue('5')}>
          <p className={style.num5} data-size={size}>
            5
          </p>
        </div>
        <div className={style.number} onClick={() => getValue('6')}>
          <p className={style.num6} data-size={size}>
            6
          </p>
        </div>
        <div className={style.number} onClick={() => getValue('7')}>
          <p className={style.num7} data-size={size}>
            7
          </p>
        </div>
        <div className={style.number} onClick={() => getValue('8')}>
          <p className={style.num8} data-size={size}>
            8
          </p>
        </div>
        <div className={style.number} onClick={() => getValue('9')}>
          <p className={style.num9} data-size={size}>
            9
          </p>
        </div>
      </div>
      <div className={`${style['phone-number']}`}>
        <div className={style.number} onClick={() => getValue('*')}>
          <p data-size={size}>*</p>
        </div>
        <div className={style.number} onClick={() => getValue('0')}>
          <p className={style.num0} data-size={size}>
            0
          </p>
        </div>
        <div className={style.number} onClick={() => getValue('#')}>
          <p data-size={size}>#</p>
        </div>
      </div>
      {/* <div className={style['phone-number']}>
        <div className={style.number}>
          <p className={style.numcall} data-size={size} onClick={handleClickPhone}>
            <PhoneFilled twoToneColor="#52c41a" rotate={90} style={{ fontSize: 25, color: '#fff' }}/>
          </p>
        </div>
      </div> */}
    </div>
  );
};

Keyboard.propTypes = {
  getValue: PT.func.isRequired,
  size: PT.string,
};

Keyboard.defaultProps = {
  size: 'normal',
};

export default Keyboard;
