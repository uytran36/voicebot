import React, { useCallback, useState } from 'react';
import debounce from 'lodash/debounce';
import PT from 'prop-types';
import { FormattedMessage } from 'umi';
import { ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { Form, Select } from 'antd';

FormForwardUser.propTypes = {
  onSearchUserToForward: PT.func.isRequired,
  onSubmitFormForward: PT.func.isRequired,
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
};

export default function FormForwardUser({ onSearchUserToForward, children, onSubmitFormForward }) {
  const [dataSelect, setDataSelect] = useState([]);
  const [valueSearch, setValueSearch] = useState('');

  const debounceSearch = debounce(
    async (value) => {
      if (value.length > 0) {
        const result = await onSearchUserToForward(value);
        if (result.length > 0) {
          setDataSelect(result);
        }
      }
    },
    500,
    {
      trailing: true,
      leading: false,
    },
  );

  const onFinish = useCallback(
    async (values) => {
      onSubmitFormForward(values);
    },
    [onSubmitFormForward],
  );

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item
        label={
          <FormattedMessage defaultMessage="Forward to user" id="pages.omnichannel.form.forward" />
        }
        name="userId"
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage defaultMessage="Required" id="form.select.search.required" />
            ),
          },
        ]}
      >
        <Select
          placeholder={
            <FormattedMessage
              defaultMessage="Search to select"
              id="form.select.search.placeholder"
            />
          }
          filterOption={false}
          defaultActiveFirstOption={false}
          showArrow={false}
          notFoundContent={null}
          showSearch
          value={valueSearch}
          onSearch={debounceSearch}
          onChange={(value) => setValueSearch(value)}
        >
          {dataSelect.map((item) => (
            <Select.Option key={item._id} value={item._id}>
              {item.username}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <ProFormTextArea
        // width="md"
        label={
          <FormattedMessage
            defaultMessage="Leave a comment (optional)"
            id="pages.omnichannel.form.optional"
          />
        }
        name="comment"
      />
      {children}
    </Form>
  );
}
