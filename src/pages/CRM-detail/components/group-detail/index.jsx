import React, { useState, useCallback } from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import Table from './Table';
import { Typography, Form, Input, Button, message } from 'antd';
import { EditFilled } from '@ant-design/icons';
import styles from './styles.less';
import { requestUpdateGroup, requestGetGroup } from '@/services/crm';
import { LeftOutlined } from '@ant-design/icons';

async function onRequestUpdateGroup(groupId, body, headers = {}) {
  const hide = message.loading('Đang cập nhật...');
  try {
    const res = await requestUpdateGroup(groupId, body, headers);
    if (res?.msg === 'SUCCESS') {
      hide();
      message.success('Cập nhật thành công.');
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    hide();
    message.warning('Cập nhật thất bại.');
    console.error(err);
    return null;
  }
}

GroupDetail.propTypes = {
  dispatch: PT.func.isRequired,
  groupsDetail: PT.shape({
    createdAt: PT.string,
    createdBy: PT.string,
    description: PT.string,
    memberCount: PT.oneOfType([PT.string, PT.number]),
    members: PT.instanceOf(Array),
    name: PT.string,
    updatedAt: PT.string,
    updatedBy: PT.string,
  }).isRequired,
  groupId: PT.string.isRequired,
  history: PT.instanceOf(Object).isRequired,
  wsId: PT.string.isRequired,
  headers: PT.shape({
    Authorization: PT.string,
  }).isRequired,
  permissions: PT.shape({
    manage: PT.bool.isRequired,
    update: PT.bool.isRequired,
    onlyView: PT.bool.isRequired,
  }).isRequired,
};

function GroupDetail({ dispatch, groupsDetail, groupId, history, wsId, headers, permissions }) {
  const [isEdit, toggleEdit] = useState(false);
  const { manage, update, onlyView } = permissions;

  const handleToggleEdit = useCallback(
    (state) => () => {
      toggleEdit(state);
    },
    [],
  );

  const handleFinish = useCallback(
    async (values) => {
      if (values.name === undefined) {
        values.name = '';
      }
      if (values.description === undefined) {
        values.description = '';
      }
      const result = await onRequestUpdateGroup(groupId, values, headers);
      if (result) {
        const res = await requestGetGroup(groupId, headers);
        if (res?.msg === 'SUCCESS') {
          const { data } = res.response;
          dispatch({
            type: 'crmDetail/execution',
            payload: {
              groupsDetail: data,
            },
          });
        }
        toggleEdit(false);
      }
    },
    [dispatch, groupId],
  );

  return (
    <React.Fragment>
      <div className={styles['header-container']}>
        {(manage || update) && (
          <EditFilled className={styles['header-icon']} onClick={handleToggleEdit(true)} />
        )}
        {!isEdit && (
          <div>
            <Typography.Title
              level={3}
              onClick={() => history.push('/customer-relationship-management/customer-management')}
            >
              <LeftOutlined />
              {groupsDetail.name}
            </Typography.Title>
            <Typography.Text>{groupsDetail.description}</Typography.Text>
          </div>
        )}
        {isEdit && (
          <Form
            layout="horizontal"
            labelAlign="left"
            labelCol={{ sm: { span: 4 }, md: { span: 3 } }}
            wrapperCol={{ sm: { span: 20 }, md: { span: 21 } }}
            onFinish={handleFinish}
            initialValues={groupsDetail}
          >
            <Form.Item label="Tên nhóm" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <Input.TextArea />
            </Form.Item>
            <div className={styles['group-btn']}>
              <Button onClick={handleToggleEdit(false)}>Huỷ</Button>
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
            </div>
          </Form>
        )}
      </div>
      <Table wsId={wsId} groupId={groupId || ''} headers={headers} permissions={permissions} />
    </React.Fragment>
  );
}

export default connect(({ crmDetail, user }) => ({
  groupsDetail: crmDetail.groupsDetail,
  wsId: user.wsId,
}))(GroupDetail);
