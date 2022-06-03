import React from 'react';
import PT from 'prop-types';
import { FormattedMessage, history } from 'umi';
// import moment from 'moment';
import { Typography, Input, Form, Button, message, Col, Row } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { requestUpdateUser, uploadImage } from '@/services/user-management';
import Avatar from './Avatar';
import styles from './styles.less';

const updateUser = async (header, data) => {
  const hide = message.loading('Đang cập nhật');
  try {
    const res = await requestUpdateUser(header, data, 'update-my-profile');
    if (res.success) {
      hide();
      message.success('Cập nhật thông tin thành công');
      return data;
    }
    throw new Error((res && res?.error?.msg) || 'Có lỗi khi cập nhật');
  } catch (err) {
    hide();
    message.error(err.toString());
    return false;
  }
};

Main.propTypes = {
  currentUser: PT.instanceOf(Object).isRequired,
  headers: PT.shape({
    Authorization: PT.string,
  }).isRequired,
  dispatch: PT.func.isRequired,
};

function Main(props) {
  const { dispatch, currentUser, headers } = props;
  const [form] = Form.useForm();
  const isEdit = true;
  const [previewImage, setPreViewImage] = React.useState('');
  const [isShowButtons, setIsShowButtons] = React.useState(false);

  const onChangeAnyInput = () => {
    if (!isShowButtons) setIsShowButtons(true);
  };

  const saveInfo = async () => {
    const values = await form.validateFields();

    let formData = new FormData();
    formData.append('file', previewImage);
    const changedImage = await uploadImage(headers, formData);

    const cloneValues = { ...values };
    delete cloneValues.email;
    delete cloneValues.role_id;
    const result = await updateUser(headers, cloneValues);

    const showImage = changedImage?.data[0]?.image_url || currentUser?.url_image;
    if (result) {
      dispatch({
        type: 'user/save',
        payload: {
          currentUser: {
            ...currentUser,
            ...result,
            url_image: showImage,
          },
        },
      });
      history.goBack();
    }
  };

  return (
    <div className={`${styles.main}`}>
      <div className={`${styles['profile-header']}`}>
        <div className={`${styles['account-detail__title']}`}>
          <Typography.Title level={3}>Thông tin tài khoản</Typography.Title>
          {isEdit && isShowButtons ? (
            <div style={{ justifyContent: 'flex-end' }}>
              <Button
                className={`${styles['submit-btn']}`}
                type="primary"
                onClick={() => saveInfo()}
                style={{ marginRight: '10px' }}
              >
                Lưu
              </Button>
              <Button onClick={() => props.setKey(new Date().getTime())}>Hủy</Button>
            </div>
          ) : null}
        </div>
      </div>

      <Avatar
        key={isEdit}
        previewImage={previewImage}
        setPreViewImage={setPreViewImage}
        isEdit={isEdit}
        isShowButtons={isShowButtons}
        setIsShowButtons={setIsShowButtons}
        status={currentUser.status}
        avatarUrl={currentUser?.url_image}
        roles={currentUser.roles || []}
      />
      <Form
        form={form}
        initialValues={{
          ...currentUser,
        }}
      >
        <Row className={`${styles['account-detail']}`}>
          {/*  <Form.Item name="user_id" style={{ display: true }} /> */}

          <Col span={11}>
            {(isEdit || currentUser.full_name) && (
              <div className={`${styles['account-detail-hoder']}`}>
                <div className={`${styles['account-detail__title']}`}>
                  <Typography.Text>
                    <FormattedMessage defaultMessage="Họ và tên" id="pages.user-management.name" />
                  </Typography.Text>
                  {isEdit ? (
                    <Form.Item name="full_name" className={styles['account-detail__input']}>
                      <Input onChange={onChangeAnyInput} style={{ width: '100%' }} disabled />
                    </Form.Item>
                  ) : (
                    <Typography.Text>{currentUser?.full_name}</Typography.Text>
                  )}
                </div>
              </div>
            )}

            {(isEdit || currentUser.employee_code) && (
              <div className={`${styles['account-detail-hoder']}`}>
                <div className={`${styles['account-detail__title']}`}>
                  <Typography.Text>
                    <FormattedMessage defaultMessage="Mã nhân viên" id="pages.user-management.id" />
                  </Typography.Text>
                  {isEdit ? (
                    <Form.Item name="employee_code" className={styles['account-detail__input']}>
                      <Input onChange={onChangeAnyInput} style={{ width: '100%' }} disabled />
                    </Form.Item>
                  ) : (
                    <Typography.Text>{currentUser.employee_code || ''}</Typography.Text>
                  )}
                </div>
              </div>
            )}

            {(isEdit || currentUser.unit) && (
              <div className={`${styles['account-detail-hoder']}`}>
                <div className={`${styles['account-detail__title']}`}>
                  <Typography.Text>
                    <FormattedMessage defaultMessage="Đơn vị" id="pages.user-management.unit" />
                  </Typography.Text>
                  {isEdit ? (
                    <Form.Item name="unit" className={styles['account-detail__input']}>
                      <Input onChange={onChangeAnyInput} style={{ width: '100%' }} disabled />
                    </Form.Item>
                  ) : (
                    <Typography.Text>{currentUser?.unit}</Typography.Text>
                  )}
                </div>
              </div>
            )}

            {(isEdit || currentUser.department) && (
              <div className={`${styles['account-detail-hoder']}`}>
                <div className={`${styles['account-detail__title']}`}>
                  <Typography.Text>
                    <FormattedMessage
                      defaultMessage="Phòng ban"
                      id="pages.user-management.department"
                    />
                  </Typography.Text>
                  {isEdit ? (
                    <Form.Item name="department" className={styles['account-detail__input']}>
                      <Input onChange={onChangeAnyInput} style={{ width: '100%' }} disabled />
                    </Form.Item>
                  ) : (
                    <Typography.Text>{currentUser?.department}</Typography.Text>
                  )}
                </div>
              </div>
            )}

            {(isEdit || currentUser.branch) && (
              <div className={`${styles['account-detail-hoder']}`}>
                <div className={`${styles['account-detail__title']}`}>
                  <Typography.Text>
                    <FormattedMessage
                      defaultMessage="Chi nhánh"
                      id="pages.user-management.branch"
                    />
                  </Typography.Text>
                  {isEdit ? (
                    <Form.Item name="branch" className={styles['account-detail__input']}>
                      <Input onChange={onChangeAnyInput} style={{ width: '100%' }} disabled />
                    </Form.Item>
                  ) : (
                    <Typography.Text>{currentUser?.branch}</Typography.Text>
                  )}
                </div>
              </div>
            )}
          </Col>

          <Col span={11} offset={2}>
            {(isEdit || currentUser.position_ftel) && (
              <div className={`${styles['account-detail-hoder']}`}>
                <div className={`${styles['account-detail__title']}`}>
                  <Typography.Text>
                    <FormattedMessage
                      defaultMessage="Chức vụ Ftel"
                      id="pages.user-management.position"
                    />
                  </Typography.Text>
                  {isEdit ? (
                    <Form.Item name="position_ftel" className={styles['account-detail__input']}>
                      <Input onChange={onChangeAnyInput} style={{ width: '100%' }} />
                    </Form.Item>
                  ) : (
                    <Typography.Text>{currentUser?.position_ftel}</Typography.Text>
                  )}
                </div>
              </div>
            )}

            {(isEdit || currentUser.branch_number) && (
              <div className={`${styles['account-detail-hoder']}`}>
                <div className={`${styles['account-detail__title']}`}>
                  <Typography.Text>
                    <FormattedMessage
                      defaultMessage="Số máy nhánh"
                      id="pages.user-management.extension"
                    />
                  </Typography.Text>
                  {isEdit ? (
                    <Form.Item
                      name="branch_number"
                      className={styles['account-detail__input']}
                      rules={[
                        {
                          pattern: '^[0-9]+$',
                          message: 'Wrong format!',
                        },
                      ]}
                    >
                      <Input onChange={onChangeAnyInput} style={{ width: '100%' }} />
                    </Form.Item>
                  ) : (
                    <Typography.Text>{currentUser.branch_number || ''}</Typography.Text>
                  )}
                </div>
              </div>
            )}

            {(isEdit || currentUser.phone_number) && (
              <div className={`${styles['account-detail-hoder']}`}>
                <div className={`${styles['account-detail__title']}`}>
                  <Typography.Text>
                    <FormattedMessage
                      defaultMessage="Số điện thoại"
                      id="pages.user-management.phone"
                    />
                  </Typography.Text>
                  {isEdit ? (
                    <Form.Item
                      name="phone_number"
                      className={styles['account-detail__input']}
                      rules={[
                        () => ({
                          validator(_, value) {
                            const regexPhone = /(((\+|)84)|0)+([0-9]{9,10})\b/;
                            if (regexPhone.test(value)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Không phải định dạng số điện thoại'));
                          },
                        }),
                      ]}
                    >
                      <Input onChange={onChangeAnyInput} style={{ width: '100%' }} />
                    </Form.Item>
                  ) : (
                    <Typography.Text>{currentUser?.phone_number}</Typography.Text>
                  )}
                </div>
              </div>
            )}

            {(isEdit || currentUser.email) && (
              <div className={`${styles['account-detail-hoder']}`}>
                <div className={`${styles['account-detail__title']}`}>
                  <Typography.Text>
                    <FormattedMessage
                      defaultMessage="Tài khoản"
                      id="pages.user-management.username"
                    />
                  </Typography.Text>
                  {isEdit ? (
                    <Form.Item name="email" className={styles['account-detail__input']}>
                      <Input onChange={onChangeAnyInput} style={{ width: '100%' }} disabled />
                    </Form.Item>
                  ) : (
                    <Typography.Text>{currentUser?.email}</Typography.Text>
                  )}
                </div>
              </div>
            )}

            {(isEdit || currentUser.role_id) && (
              <div className={`${styles['account-detail-hoder']}`}>
                <div className={`${styles['account-detail__title']}`}>
                  <Typography.Text>
                    <FormattedMessage defaultMessage="Vai trò" id="pages.user-management.role" />
                  </Typography.Text>
                  {isEdit ? (
                    <>
                      <Form.Item
                        name="role_id"
                        className={styles['account-detail__input']}
                        style={{ display: 'none' }}
                      ></Form.Item>
                      <Input
                        onChange={onChangeAnyInput}
                        style={{ width: '100%' }}
                        disabled
                        defaultValue={currentUser?.role_name}
                      />
                    </>
                  ) : (
                    <Typography.Text>{currentUser?.role_name}</Typography.Text>
                  )}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default Main;
