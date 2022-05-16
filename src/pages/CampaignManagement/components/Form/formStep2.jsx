import React, { useState, useEffect, useCallback } from 'react';
import PT from 'prop-types';
import { Form, Input, InputNumber, message } from 'antd';
import { requestCheckDataDNC } from '@/pages/Sandardized/service';

RenderFormStep2.propTypes = {
  data: PT.instanceOf(Object).isRequired,
  headers: PT.instanceOf(Object).isRequired,
  filtered: PT.instanceOf(Array).isRequired,
  getValues: PT.func.isRequired,
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
};

const isFieldNum = ['age', 'money'];

const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 6,
  },
}

const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 6,
  },
};

const config = {
  rules: [{
    required: true,
    message: 'Is required',
  },]
}

function RenderFormStep2({ data, filtered, children, getValues, headers }) {
  const [formItems, setFormItems] = useState([]);
  const [errorInput, setErrorInput] = useState([]);

  useEffect(() => {
    const keyFiltered = Object.keys(data).filter((key) => {
      if(key === 'id' || key === '_id') {
        return false;
      }
      return !filtered.includes(key);
    });

    setFormItems(keyFiltered);
  }, [data, filtered]);

  const handleOnFinish = useCallback(async _values => {
    const values = {..._values}
    values.sdt = values.sdt.replace('+84', '0');
    values.sdt = values.sdt.replace('(+84)', '0');
    if(
      values.sdt.charAt(0) === '8' &&
      values.sdt.charAt(1) === '4' &&
      values.sdt.length === 11
    ) {
      values.sdt = values.sdt.replace('84', '0');
    }
    // request kiểm tra DNC
    try {
      const res = await requestCheckDataDNC(headers, [{msisdn: values.sdt}])
      if (res.error) {
        throw new Error('No response.');
      }
      // sdt không tồm tại trong DoNotCall.
      // return null => cho phép update
      if (!res || res.length === 0) {
        setErrorInput([])
        return getValues({...data, ...values,})
      }
      setErrorInput([{
        message: 'SDT thuộc danh sách DNC, vui lòng kiểm tra lại.',
        type: 'error',
        field: 'sdt'
      }])
      return null;
    } catch(err) {
      console.error(err.toString())
      message.error('Can not update, please check networ waterfall');
    }
  }, [getValues, data, headers])
  return <Form {...layout} initialValues={data} onFinish={handleOnFinish}>
    {formItems.map((elm, index) => {
      const arrError = errorInput.filter(errInput => errInput.field === elm)
      if(arrError.length > 0) {
        config.validateStatus = arrError[0].type || '';
        config.help = arrError[0].message || '';
      } else {
        config.validateStatus = '';
        config.help = '';
      }
      if (isFieldNum.includes(elm)) {
        return (
          <Form.Item key={index} name={elm} label={elm} {...config}>
            <InputNumber />
          </Form.Item>
        );
      }
      return (
        <Form.Item key={index} name={elm} label={elm} {...config}>
          <Input />
        </Form.Item>
      );
    })}
    <Form.Item {...tailLayout}>
      {children}
    </Form.Item>
  </Form>;
}

export default RenderFormStep2;
