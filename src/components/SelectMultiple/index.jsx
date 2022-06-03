import React, { useCallback, useState, memo, useRef, useLayoutEffect } from 'react';
// import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css';
import styles from './styles.less';
import { Select, Space, Divider, Button, Checkbox } from 'antd';
import PT from 'prop-types';

const { Option } = Select;

SelectMultiple.propTypes = {
  list: PT.instanceOf(Object).isRequired,
  callback: PT.func.isRequired,
  options: PT.instanceOf(Object),
};

SelectMultiple.defaultProps = {
  options: {},
};

const defaultCheckedList = [''];

const list1 = {
  success: 'Thành công',
  error: 'Thất bại',
  pending: 'Tạm dừng',
};

function DropdownRender({ children, menu, indeterminate, checkAll, onCheckAllChange }, forwardRef) {
  return (
    <div ref={forwardRef} className={styles['dropdown']}>
      <div className={styles['dropdown--item']}>
        <Space style={{ margin: '4px 10px' }}>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll} />
          Tất cả
        </Space>
      </div>
      <Divider style={{ margin: '4px 0' }} />
      {menu}
      {children}
    </div>
  );
}

const DropdownRenderWithRef = React.forwardRef(DropdownRender);

function SelectMultiple({ list = list1, callback, options }) {
  const dropdownRef = useRef();

  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [selectedName, setSelectedName] = useState('Tất cả');
  const [showDropDown, setShowDropDown] = useState(false);

  useLayoutEffect(() => {
    function handleClickOutsideSelect(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropDown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutsideSelect);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideSelect);
    };
  }, [dropdownRef]);

  const onChangeCheckbox = useCallback(
    (e, key) => {
      if (e.target.checked) {
        if (checkedList.length === Object.keys(list).length - 1) {
          setCheckAll(true);
          setIndeterminate(false);
        } else {
          setIndeterminate(true);
        }
        return setCheckedList([...checkedList, key].filter((e) => e));
      }
      setCheckAll(false);
      setIndeterminate(true);
      const newValue = checkedList.filter((item) => item !== key);
      if (newValue.length === 0) {
        setIndeterminate(false);
      }
      return setCheckedList(newValue);
    },
    [checkedList],
  );

  const onChangeAll = (e) => {
    if (e.target.checked) {
      setCheckedList(Object.keys(list));
      setCheckAll(true);
    } else {
      setCheckedList([]);
      setCheckAll(false);
    }
    setIndeterminate(false);
  };

  const handleClickOk = useCallback(() => {
    if (checkedList.length === 1) {
      setSelectedName(list[checkedList[0]]);
    }
    if (checkedList.length > 1) {
      setSelectedName('Nhiều tuỳ chọn');
    }
    if (checkedList.length === Object.keys(list).length) {
      setSelectedName('Tất cả');
    }
    if (checkedList.length === 0) {
      setSelectedName('Chọn');
    }
    setShowDropDown(false);
    callback(checkedList);
  }, [checkedList, callback]);

  const onClickSelect = () => {
    if (!showDropDown) {
      setShowDropDown(true);
    }
  };

  const renderListSelect = (data) => {
    let result = [];
    result = data.map((key) => (
      <Option key={key}>
        <Space>
          <Checkbox
            checked={checkedList.includes(key)}
            onChange={(e) => onChangeCheckbox(e, key)}
          />
          {list[key]}
        </Space>
      </Option>
    ));
    return result;
  };
  return (
    <Select
      open={showDropDown}
      onClick={onClickSelect}
      style={{ width: 180 }}
      value={selectedName}
      placeholder="Choose"
      maxTagCount={1}
      dropdownRender={(menu) => (
        <DropdownRenderWithRef
          ref={dropdownRef}
          menu={menu}
          indeterminate={indeterminate}
          checkAll={checkAll}
          onCheckAllChange={onChangeAll}
          
        >
          <Divider style={{ margin: '4px 0' }} />
          <div className={styles['button-group']}>
            <div style={{ color: '#144b7d', cursor: 'pointer' }} onClick={() => setShowDropDown(false)}>
              Cancel
            </div>
            <Button size="small" type="primary" onClick={handleClickOk}>
              Ok
            </Button>
          </div>
        </DropdownRenderWithRef>
      )}
      {...options}
    >
      {renderListSelect(Object.keys(list))}
    </Select>
  );
}

export default memo(SelectMultiple);
