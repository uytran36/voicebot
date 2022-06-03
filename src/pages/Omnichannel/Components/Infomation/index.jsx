import React, { useState, useCallback } from 'react';
import PT from 'prop-types';
import { connect, FormattedMessage } from 'umi';
import { CloseOutlined } from '@ant-design/icons';
import { Card, Button, message } from 'antd';
import FormForwardUser from '../Form/formForwardUser';
import styles from './styles.less';
import { requestListUserToForward, requestForwardLivechatRoom } from '@/pages/Omnichannel/services';

// custom component
const FormFooter = ({ children, setShowForm }) => {
  return (
    <div className={styles['form-footer']}>
      <Button onClick={() => setShowForm(false)}>Cancel</Button>
      {children}
    </div>
  );
};

FormFooter.propTypes = {
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  setShowForm: PT.func.isRequired,
};

Infomation.propTypes = {
  dispatch: PT.func.isRequired,
  omnichannel: PT.shape({
    rowSelected: PT.instanceOf(Object),
    isShowForm: PT.bool,
  }).isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
  }).isRequired,
};

function Infomation({
  dispatch,
  user: { userId, authToken },
  omnichannel: { rowSelected, isShowForm },
}) {
  const [contentForm, setContentForm] = useState(<div />);

  const setShowForm = (stateForm) =>
    dispatch({
      type: 'omnichannel/execution',
      payload: {
        isShowForm: true,
      },
    });
    
  // event
  const onClickToClose = () => {
    dispatch({
      type: 'omnichannel/execution',
      payload: {
        isShowInfo: false,
      },
    });
  };

  const onSearchUserToForward = useCallback(
    async (value) => {
      const res = await requestListUserToForward(
        {
          userId,
          authToken,
        },
        {
          conditions: {
            _id: {
              $ne: rowSelected?.servedBy?._id,
            },
            status: {
              $ne: 'offline',
            },
            statusLivechat: 'available',
          },
          term: value,
        },
      );
      if (res.success) {
        return res.items;
      }
      return [];
    },
    [authToken, rowSelected, userId],
  );

  const onSubmitFormForward = useCallback(
    async (values) => {
      const res = await requestForwardLivechatRoom(
        {
          userId,
          authToken,
        },
        {
          ...values,
          roomId: rowSelected._id,
        },
      );
      if (res.success) {
        return message.success('🎉 🎉 🎉 Forward chat successfully');
      }
      return message.error('Forward chat failed');
    },
    [authToken, rowSelected, userId],
  );

  return (
    <Card title="Visitor Info" extra={<CloseOutlined onClick={onClickToClose} />}>
      {isShowForm ? (
        contentForm
      ) : (
        <>
          <div className={styles.wraper}>
            <div className={styles.header}>Room</div>
            <div className={styles.content}>{rowSelected?.fname}</div>
          </div>
          <div className={styles.wraper}>
            <div className={styles.header}>Client</div>
            <div className={styles.content}>{rowSelected?.v?.username}</div>
          </div>
          <div className={styles.wraper}>
            <div className={styles.header}>Agent</div>
            <div className={styles.content}>{rowSelected?.servedBy?.username}</div>
          </div>
          <div className={styles.wraper}>
            <Button
              onClick={() => {
                setShowForm(true);
                setContentForm(
                  <FormForwardUser
                    onSubmitFormForward={onSubmitFormForward}
                    onSearchUserToForward={onSearchUserToForward}
                  >
                    <FormFooter setShowForm={setShowForm}>
                      <Button type="primary" htmlType="submit">
                        <FormattedMessage
                          defaultMessage="Forward"
                          id="pages.omnichannel.button.forward"
                        />
                      </Button>
                    </FormFooter>
                  </FormForwardUser>,
                );
              }}
            >
              <FormattedMessage defaultMessage="Forward" id="pages.omnichannel.button.forward" />
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

export default connect(({ omnichannel, user }) => ({ omnichannel, user }))(Infomation);
