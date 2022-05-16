import React, { createContext, useState, useRef, useContext, useEffect } from 'react';
import { Form, Input } from 'antd';
import PT from 'prop-types'

const EditableContext = createContext(null);

export function RenderEditRowTable({ ...props } ) {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
}

RenderEditCellTable.propTypes = {
  title: PT.string,
  editable: PT.bool,
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  dataIndex: PT.string,
  record: PT.instanceOf(Object),
  handleSave: PT.func,
}

RenderEditCellTable.defaultProps = {
  title: '',
  editable: false,
  dataIndex: '',
  record: {},
  handleSave: () => {},
}

export function RenderEditCellTable({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
}