import React from 'react';
import PT from 'prop-types';
import { Form, Skeleton, message } from 'antd';
import { requestGetUserInfo } from '@/services/user-management';

RenderRootForm.propTypes = {
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  onFinish: PT.func.isRequired,
  userId: PT.string,
};

RenderRootForm.defaultProps = {
  userId: '',
};

function RenderRootForm({ children, userId, headers, onFinish, ...props }) {
  const [refForm] = Form.useForm();
  const [detailUser, setDetailUser] = React.useState({});
  const [isReady, toggleReady] = React.useState(false);

  React.useEffect(() => {
    if (headers && userId.length > 0) {
      requestGetUserInfo(headers, { user_id: userId })
        .then((res) => {
          if (res.success) {
            setDetailUser(res.data[0]);
            refForm.resetFields();
            return toggleReady(true);
          }
          throw new Error('ERROR~');
        })
        .catch((err) => {
          setDetailUser({});
          toggleReady(true);
          message.warning('Không thể hiển thị chi tiết người dùng.');
        });
    } else {
      toggleReady(true);
    }
  }, [headers, refForm, userId]);

  const onFinishForm = React.useCallback(
    (values) => {
      if (userId.length > 0) {
        onFinish(values, userId);
        return null;
      }
      onFinish(values);
      return null;
    },
    [onFinish, userId],
  );

  return (
    <Form
      form={refForm}
      layout="vertical"
      initialValues={{
        ...detailUser,
      }}
      onFinish={onFinishForm}
      {...props}
    >
      {isReady ? children : <Skeleton />}
    </Form>
  );
}

export default RenderRootForm;
