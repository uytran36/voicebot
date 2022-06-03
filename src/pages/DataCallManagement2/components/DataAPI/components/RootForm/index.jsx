import React, { useCallback } from 'react';
import PT from 'prop-types';
import { Form, Col, Input, Select, Button, Typography } from 'antd';
import ModalTestLoad from "./modalTestLoad";

RenderRootForm.propTypes = {
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  onFinish: PT.func.isRequired,
  initialValues: PT.instanceOf(Object),
};

RenderRootForm.defaultProps = {
  initialValues: {},
};

const { Title } = Typography;
const { Option } = Select;

const strategies = [
  {
    no_authentication: {

      url: "",

    },
    basic_authentication: ""
  },
];

function RenderRootForm({ children, onFinish, initialValues, setStateModal, isEdit, headers, ...props }) {
  const [refForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const onFinishForm = useCallback(
    (values) => {
      onFinish({
        ...values,
      });
      return null;
    },
    [onFinish],
  );

  const onClickTestLoad = () => {
    setIsModalVisible(true);
  }

  const onChangeStrategy = (value) => {
    if (value === 'no_authentication') {
      refForm.setFieldsValue({
        configuration: '{\n"url": ""\n}',
      });
    } else {
      refForm.setFieldsValue({
        configuration: '',
      });
    }
  };

  return (
    <>
      <Form
        form={refForm}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        initialValues={initialValues}
        onFinish={onFinishForm}
        {...props}
      >
        <Col span={4} offset={10}>
          {isEdit ? <Title level={5}> Sửa API</Title> : <Title level={5}> Thêm API</Title>}
        </Col>

        <Form.Item
          name="name"
          label="Tên"
          rules={[
            {
              required: true,
              message: 'Tên không được để trống',
            },
            {
              maxLength: 30,
              message: 'Tên đã đạt đến số kí tự tối đa',
            },
            {
              pattern: new RegExp(/^[^\]|\\/:;"'<>,&.?~`#!(${%)\-_@^*+=}[]+$/),
              message: 'Tên không được chứa kí tự đặc biệt',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="API Type"
          initialValue="Rest API"
          rules={[
            {
              required: true,
              message: 'API Type không được để trống',
            },
          ]}
        >
          <Select onChange={null}>
            <Option value="Rest API">REST API</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="strategy"
          label="Strategy"
          initialValue="no_authentication"
          rules={[
            {
              required: true,
              message: 'API Type không được để trống',
            },
          ]}
        >
          <Select onChange={onChangeStrategy}>
            <Option value="no_authentication">no_authentication</Option>
            <Option value="basic_authentication">basic_authentication</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="configuration"
          label="Config"
          rules={[
            {
              required: true,
              message: 'Config không được để trống',
            },
          ]}
        >
          <Input.TextArea value={initialValues?.configuration} style={{ height: 120 }} />
        </Form.Item>
        <Col span={14} offset={5}>
          <Button type="primary" style={{ marginRight: 20 }} htmlType="submit">
            Hoàn tất
          </Button>
          ,
          <Button onClick={onClickTestLoad} type="dashed" style={{ marginRight: 20 }}>
            Test Load
          </Button>
          ,<Button onClick={() => setStateModal(false, {})}>Hủy</Button>
        </Col>
      </Form>
      {isModalVisible ? <ModalTestLoad
        configuration={refForm.getFieldValue('configuration')}
        strategy={refForm.getFieldValue('strategy')}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        headers={headers} /> : <></>}

    </>
  );
}

export default RenderRootForm;
