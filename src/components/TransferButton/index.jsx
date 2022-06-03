import React, { useState, useCallback } from 'react';
import PT from 'prop-types';
import { UserOutlined } from '@ant-design/icons';
import { Tooltip, Button, Popover, Form, Select } from 'antd';
import styles from './styles.less';
import Forward from '../Icons/forward';
import { requestGetRegstrations } from '@/services/call-center';
import { connect } from 'umi';

const { Option } = Select;

TransferButton.propTypes = {
  handleSelectStaff: PT.func.isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
    currentUser: PT.instanceOf(Object),
    tokenGateway: PT.string,
    ext: PT.string,
  }).isRequired,
};

/**
 * @param {Function<Boolean>} handleSelectStaff
 * @param {Object} props - props button
 */
function TransferButton({ user, handleSelectStaff, ...props }) {
  const [visible, toggle] = useState(false);
  const [optionForward, setOptionForward] = useState([]);
  const { tokenGateway, currentUser, ext } = user;
  const headers = React.useMemo(() => ({
    Authorization: `${tokenGateway}`,
  }), [tokenGateway]);

  const fetListExtOnline = useCallback(async () => {
    const params = {
      page: 0,
      size: 100,
      status: 'online',
      id: currentUser?.id,
    };
    const res = await requestGetRegstrations(headers, params);
    if (res?.message === 'SUCCESS' && res?.users) {
      setOptionForward(res.users);
    }
  }, [headers, currentUser?.id]);

  return (
    <Tooltip title="Transfer">
      <Popover
        placement="bottomRight"
        visible={visible}
        onVisibleChange={(state) => {
          if (state) {
            fetListExtOnline();
          }
          toggle(state)
        }}
        content={
          <Form
            colon={false}
            layout="vertical"
            onFinish={(value) => {
              if (handleSelectStaff(value.staff)) {
                toggle(false);
              }
            }}
          >
            <Form.Item label="Chuyển tiếp" name="staff">
              <Select style={{ width: '20rem' }} placeholder="Chọn agent">
                {optionForward.map((item) => {
                  if (item?.ipPhone && item.ipPhone !== ext)
                    return (
                      <Option value={item.ipPhone} key={item.ipPhone}>
                        <span>
                          <UserOutlined style={{ marginRight: 10 }} />
                          {`${item.ipPhone} - ${item.name}`}
                        </span>
                      </Option>
                    );
                })}
              </Select>
            </Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button
                style={{ background: '#fff', color: '#000', marginRight: 10 }}
                onClick={() => toggle(false)}
              >
                Hủy
              </Button>
              <Button htmlType="submit" style={{ background: '#71afe2', color: '#fff' }}>
                Chuyển
              </Button>
            </div>
          </Form>
        }
        trigger="click"
      >
        <Button
          shape="circle"
          // type="primary"
          className={`${styles.button} ${styles.transfer}`}
          icon={<Forward style={{ color: '#fff' }} />}
          {...props}
        />
      </Popover>
    </Tooltip>
  );
}

export default connect(({ user }) => ({ user }))(TransferButton);
