import React, { useCallback } from 'react';
import PT from 'prop-types';
import styles from './styles.less';

RenderLayoutNumber.propTypes = {
  clickNumber: PT.func.isRequired,
  nodeTreeSelected: PT.instanceOf(Object).isRequired,
}

export default function RenderLayoutNumber({ clickNumber, nodeTreeSelected }) {
  const handleClickNumber = useCallback(num => {
    clickNumber(num, nodeTreeSelected)
  }, [clickNumber, nodeTreeSelected])

  return (
    <div className={styles.wrapper__num}>
      <div className={styles.row}>
        <span onClick={() => handleClickNumber('1')}>1</span>
        <span onClick={() => handleClickNumber('2')}>2</span>
        <span onClick={() => handleClickNumber('3')}>3</span>
      </div>
      <div className={styles.row}>
        <span onClick={() => handleClickNumber('4')}>4</span>
        <span onClick={() => handleClickNumber('5')}>5</span>
        <span onClick={() => handleClickNumber('6')}>6</span>
      </div>
      <div className={styles.row}>
        <span onClick={() => handleClickNumber('7')}>7</span>
        <span onClick={() => handleClickNumber('8')}>8</span>
        <span onClick={() => handleClickNumber('9')}>9</span>
      </div>
      <div className={styles.row}>
        <span onClick={() => handleClickNumber('*')}>*</span>
        <span onClick={() => handleClickNumber('0')}>0</span>
        <span onClick={() => handleClickNumber('#')}>#</span>
      </div>
    </div>
  );
}
