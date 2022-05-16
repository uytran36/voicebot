import React, { useCallback, useState, memo } from 'react';
// import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css';
// import './index.css';
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

function SelectMultiple({ list = list1, callback, options }) {
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [selectedName, setSelectedName] = useState('Tất cả');
  const [showDropDown, setShowDropDown] = useState(false);

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
    // <Space
    //   direction="vertical"
    //   style={{
    //     width: '100%',
    //   }}
    // >
    <Select
      open={showDropDown}
      onClick={onClickSelect}
      style={{ width: 180 }}
      value={selectedName}
      placeholder="Choose"
      maxTagCount={1}
      dropdownRender={(menu) => (
        <div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              padding: 2,
              justifyContent: 'flex-start',
            }}
          >
            <Space style={{ margin: '4px 10px' }}>
              <Checkbox
                checked={checkAll}
                indeterminate={indeterminate}
                onChange={(e) => onChangeAll(e)}
              />
              Tất cả
            </Space>
          </div>

          <Divider style={{ margin: '4px 0' }} key="1" />
          {menu}
          <Divider style={{ margin: '4px 0' }} key="2" />
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              padding: 4,
              justifyContent: 'space-between',
            }}
          >
            <div style={{ color: '#144b7d' , cursor: 'pointer'}} onClick={() => setShowDropDown(false)}>Cancel</div>
            <Button size="small" type="primary" onClick={handleClickOk}>
              Ok
            </Button>
          </div>
        </div>
      )}
      {...options}
    >
      {renderListSelect(Object.keys(list))}
    </Select>
    // </Space>
  );
}

export default memo(SelectMultiple);
