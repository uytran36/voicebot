import React from 'react';
import { Form, Input } from 'antd';

function AddNewGroup() {
    return (
        <React.Fragment>
            <Form.Item rules={[{
                required: true,
                message: 'Tên nhóm không được để rỗng'
            }]} label='Tên nhóm' name='name'>
                <Input />
            </Form.Item>
            <Form.Item label='Mô tả' name='description'>
                <Input.TextArea />
            </Form.Item>
        </React.Fragment>
    )
}

export default AddNewGroup