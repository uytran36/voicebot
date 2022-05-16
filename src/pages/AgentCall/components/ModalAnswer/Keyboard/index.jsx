import React, {useState, useCallback} from 'react';
import { Button, Row, Input } from 'antd';
import { CloseSquareOutlined, PhoneOutlined } from '@ant-design/icons';
import style from './style.less';

const Keyboard = () => {
  const [numArr, setNumArr] = useState([]);
  const handleClickNumber = useCallback(number => {
    numArr.push(number);
    setNumArr([...numArr]);
  }, [numArr]);
  const handleDelete = useCallback(() => {
    numArr.pop();
    setNumArr([...numArr]);
  }, [numArr]);
  // console.log(numArr);
  return (
    <div className={style.body}>
      <div className={style.bodyWrapper}>
        <div className={style.header}>
          <span>Bàn phím số</span>
        </div>
        <div className={style.keyboard}>
          <div className={style.keyboardWrapper}>
            <div className={style.inputWrapper}>
              <div className={style.input}>
                <Input style={{ background: 'transparent',  color: '#fff', fontSize: '20px', width: '130px' }} value={numArr.join('')} bordered={false} />
              </div>
              {numArr.length > 0 && <CloseSquareOutlined style={{ color: '#fff', fontSize: '20px' }} onClick={() => handleDelete()} />}
            </div>
            <div className={style.row}>
              <div className={style.key} onClick={() => handleClickNumber('1')}>
                <h3>1</h3>
              </div>
              <div className={style.key} onClick={() => handleClickNumber('2')}>
                <h3>2</h3>
                <span>ABC</span>
              </div>
              <div className={style.key} style={{ marginRight: 0 }} onClick={() => handleClickNumber('3')}>
                <h3>3</h3>
                <span>DEF</span>
              </div>
            </div>
            <div className={style.row}>
              <div className={style.key} onClick={() => handleClickNumber('4')}>
                <h3>4</h3>
                <span>GHI</span>
              </div>
              <div className={style.key} onClick={() =>handleClickNumber('5')}>
                <h3>5</h3>
                <span>JKL</span>
              </div>
              <div className={style.key} style={{ marginRight: 0 }} onClick={() => handleClickNumber('6')}>
                <h3>6 </h3>
                <span>MNO</span>
              </div>
            </div>
            <div className={style.row}>
              <div className={style.key} onClick={() => handleClickNumber('7')}>
                <h3>7</h3>
                <span>PQRS</span>
              </div>
              <div className={style.key} onClick={() => handleClickNumber('8')}>
                <h3>8</h3>
                <span>TUV</span>
              </div>
              <div className={style.key} style={{ marginRight: 0 }} onClick={() => handleClickNumber('9')}>
                <h3>9</h3>
                <span>WXYZ</span>
              </div>
            </div>
            <div className={style.row}>
              <div className={style.star} onClick={() => handleClickNumber('*')}>
                <h3>*</h3>
              </div>
              <div className={style.key} onClick={() => handleClickNumber('0')}>
                <h3>0</h3>
                <span>+</span>
              </div>
              <div className={style.hash} style={{ marginRight: 0 }} onClick={() => handleClickNumber('#')}>
                <h3>#</h3>
              </div>
            </div>
          </div>
        </div>
        <div className={style.phone}>
          <div className={style.phoneWrapper}>
            <PhoneOutlined style={{ fontSize: 25, color: '#fff' }}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
