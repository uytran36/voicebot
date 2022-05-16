import React, { useState, useCallback, useEffect } from 'react';
import moment from 'moment';
import PT from 'prop-types';
import { connect } from 'umi';
import {
  Card,
  Space,
  Divider,
  Typography,
  Button,
  Form,
  Input,
  DatePicker,
  Tooltip,
  Tag,
  Select,
  message,
  Popconfirm,
} from 'antd';
import {
  FacebookFilled,
  MailFilled,
  PhoneFilled,
  EditFilled,
  StarFilled,
  PlusCircleTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons';
import debounce from 'lodash/debounce';
import {
  UserFilled,
  CalendarFilled,
  LocationFilled,
  ZaloFilled,
  Gender,
  Alias,
  Description,
} from '@/components/Icons';
import styles from './styles.less';
import { requestUpdateCustomer, requestGetGroups, requestGetCustomer } from '@/services/crm';
import limitWords from '@/utils/limitWords';

const mapIcon = [
  {
    key: 'name',
    Icon: <UserFilled style={{ fontSize: '25px' }} />,
  },
  {
    key: 'dateOfBirth',
    Icon: <CalendarFilled style={{ fontSize: '25px' }} />,
  },
  {
    key: 'phones',
    Icon: <PhoneFilled style={{ fontSize: '25px', transform: 'rotate(90deg' }} />,
  },
  {
    key: 'email',
    Icon: <MailFilled style={{ fontSize: '20px' }} />,
  },
  {
    key: 'addresses',
    Icon: <LocationFilled style={{ fontSize: '22px' }} />,
  },
  {
    key: 'facebook',
    Icon: <FacebookFilled style={{ fontSize: '22px' }} />,
  },
  {
    key: 'zalo',
    Icon: <ZaloFilled style={{ fontSize: '25px' }} />,
  },
  {
    key: 'description',
    Icon: <Description style={{ fontSize: '20px' }} />,
  },
  {
    key: 'gender',
    Icon: <Gender style={{ fontSize: '20px' }} />,
  },
  {
    key: 'alias',
    Icon: <Alias style={{ fontSize: '20px' }} />,
  },
];

const onRequestGetGroups = async (offset, limit, options, headers = {}) => {
  try {
    const res = await requestGetGroups(
      {
        offset,
        limit,
        ...options,
      },
      headers,
    );
    if (res?.msg === 'SUCCESS') {
      // res.response.groups.pop();
      return res.response.data;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    return [];
  }
};

BaseInfo.propTypes = {
  crmDetail: PT.shape({
    customerDetail: PT.shape({
      id: PT.String,
      addresses: PT.string,
      age: PT.string,
      alias: PT.string,
      createdAt: PT.string,
      dateOfBirth: PT.string,
      description: PT.string,
      email: PT.string,
      facebook: PT.string,
      gender: PT.string,
      name: PT.string,
      updatedBy: PT.string,
      zalo: PT.string,
      phones: PT.instanceOf(Array),
      groups: PT.instanceOf(Array),
    }),
  }).isRequired,
  dispatch: PT.func.isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  permissions: PT.shape({
    manage: PT.bool.isRequired,
    update: PT.bool.isRequired,
    onlyView: PT.bool.isRequired,
  }).isRequired,
};

function BaseInfo({ dispatch, crmDetail: { customerDetail }, headers, permissions }) {
  const [isEdit, toggleEdit] = useState(false);
  const [isPhoneDefaul, togglePhoneDefault] = useState(-1);
  const [groups, setGroups] = useState([]);
  const [searchGroups, setSearchGroups] = useState('');
  const [valueSelected, setValueSelected] = useState([]);
  const [groupRenderTags, setGroupRenderTags] = useState([]);
  const { manage, update, onlyView } = permissions;

  const [formRef] = Form.useForm();

  const handleToggleEdit = useCallback(
    (state) => () => {
      toggleEdit(state);
    },
    [],
  );

  const handleClickStar = useCallback(
    ([index, key]) =>
      () => {
        togglePhoneDefault(index);
      },
    [],
  );

  const handleCancel = useCallback(() => {
    const result = customerDetail?.groups?.map((group) => ({ label: group.name, value: group.id }));
    if (result?.length > 0) {
      setGroupRenderTags([...result]);
    }
    toggleEdit(false);
    formRef?.resetFields();
  }, [customerDetail?.groups, formRef]);

  const handleOnCloseTag = useCallback(
    (tag) => () => {
      const result = groupRenderTags.filter((group) => group.value !== tag.value);
      setGroupRenderTags(result);
    },
    [groupRenderTags],
  );

  const handleOnFinish = useCallback(
    async (values) => {
      const data = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.toJSON() : '',
        groups: groupRenderTags.map((elm) => ({ id: elm.value, name: elm.label })),
        phones: values.phones.map((phone, index) => {
          if (index !== isPhoneDefaul) {
            return {
              ...phone,
              isFirstNumber: false,
            };
          }
          return {
            ...phone,
            isFirstNumber: true,
          };
        }),
      };
      try {
        const res = await requestUpdateCustomer(customerDetail.id, data, headers);
        if (res?.code === 200) {
          message.success('Cập nhật khách hàng thành công');
          // fetch data
          const cus = await requestGetCustomer(customerDetail.id, headers);
          dispatch({
            type: 'crmDetail/execution',
            payload: {
              customerDetail: cus.data || {},
            },
          });
          toggleEdit(false);
          return null;
        }
        throw new Error(res?.msg);
      } catch (err) {
        message.error(err.toString());
        return null;
      }
    },
    [groupRenderTags, isPhoneDefaul, customerDetail.id, headers, dispatch],
  );

  // fetch list groups from 0 - 100 record with searching.
  useEffect(() => {
    onRequestGetGroups(
      0,
      100,
      {
        // where: {
        //   or: [
        //     {
        //       name: { like: `${searchGroups}`, $options: 'i' },
        //     },
        //     {
        //       name: { regexp: `.*${searchGroups}.*`, $options: 'i' },
        //     },
        //     {
        //       description: { regexp: `.*${searchGroups}.*`, $options: 'i' },
        //     },
        //   ],
        // },
        search: searchGroups,
      },
      headers,
    ).then((data) => {
      setGroups(data);
    });
  }, [searchGroups, headers]);

  // set initial phones
  useEffect(() => {
    if (isEdit) {
      const result = customerDetail?.phones?.findIndex((phone) => phone?.isFirstNumber);
      togglePhoneDefault(result);
    }
  }, [customerDetail.phones, isEdit]);

  // set initial groups
  useEffect(() => {
    if (Array.isArray(customerDetail.groups)) {
      const result = customerDetail?.groups?.map((group) => ({
        label: group.name,
        value: group.id,
      }));
      if (result?.length > 0) {
        setGroupRenderTags([...result]);
        setValueSelected([...result]);
      }
    }
  }, [customerDetail.groups]);

  return (
    <Card className={styles['base-info-container']}>
      <Form
        initialValues={{
          ...customerDetail,
          dateOfBirth: customerDetail.dateOfBirth ? moment(customerDetail.dateOfBirth) : '',
        }}
        onFinish={handleOnFinish}
        form={formRef}
      >
        <div className={styles['base-info-header']}>
          <Typography.Title level={4}>Thông tin cơ bản</Typography.Title>
          {(manage || update) && (
            <Button
              shape="circle"
              type="link"
              icon={<EditFilled style={{ color: '#595959' }} />}
              onClick={handleToggleEdit(true)}
            />
          )}
        </div>
        <Space direction="vertical" size={24}>
          {mapIcon.map(({ key, Icon }) => {
            if (key !== 'phones') {
              if (isEdit && key === 'gender') {
                return (
                  <div key={key} className={styles['base-info-item']}>
                    {Icon}
                    <Form.Item noStyle name={key}>
                      <Select
                        style={{ width: '100%' }}
                        options={[
                          {
                            v: 'nam',
                            l: 'Nam',
                          },
                          {
                            v: 'nữ',
                            l: 'Nữ',
                          },
                          {
                            v: 'khác',
                            l: 'Khác',
                          },
                        ].map((elm) => ({ value: elm.v, label: elm.l }))}
                      />
                    </Form.Item>
                  </div>
                );
              }
              return (
                <div key={key} className={styles['base-info-item']}>
                  {Icon}
                  {isEdit && (
                    <Form.Item
                      style={{ margin: 0 }}
                      validateTrigger={['onSubmit']}
                      name={key}
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (key !== 'email') {
                              return Promise.resolve();
                            }
                            const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
                            console.log({ value, key, test: regexEmail.test(value) });
                            if (regexEmail.test(value)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Không phải định dạng email'));
                          },
                        }),
                      ]}
                    >
                      {key === 'dateOfBirth' ? (
                        <DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} disabledDate={(current) => {
                          return current && current > moment().endOf('day');
                        }} />
                      ) : key === 'description' ? (
                        <Input.TextArea />
                      ) : (
                        <Input />
                      )}
                    </Form.Item>
                  )}
                  {/* Render link fb... */}
                  {!isEdit && key === 'facebook' && (
                    <a
                      rel="noreferrer"
                      target="_blank"
                      style={{ wordBreak: 'break-word' }}
                      href={`${customerDetail?.facebook}`}
                    >
                      {customerDetail.facebook}
                    </a>
                  )}
                  {!isEdit && key !== 'facebook' && (
                    <span style={{ wordBreak: 'break-word', textTransform: 'capitalize' }}>
                      {key === 'dateOfBirth' && customerDetail?.dateOfBirth
                        ? moment(customerDetail.dateOfBirth).format('DD/MM/YYYY')
                        : customerDetail[key]}
                    </span>
                  )}
                </div>
              );
            }
            return (
              <div key={key} className={styles['base-info-item']}>
                {Icon}
                {isEdit && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Form.List noStyle name="phones">
                      {(fields, { add, remove }) => (
                        <React.Fragment>
                          {fields.map((field, index) => {
                            return (
                              <Space
                                key={field.key}
                                style={{ display: 'flex', marginBottom: 8 }}
                                align="baseline"
                              >
                                <Form.Item
                                  // noStyle
                                  {...field}
                                  name={[field.name, 'phone']}
                                  validateTrigger={['onSubmit']}
                                  rules={[
                                    () => ({
                                      validator(_, value) {
                                        const regexPhone = /((\+84|84|0)+([3|5|7|8|9]{1})+([0-9]{8}))|((1800|1900)+([0-9]{4}))\b/;
                                        console.log({ value, test: regexPhone.test(value) });
                                        if (regexPhone.test(value)) {
                                          return Promise.resolve();
                                        }
                                        return Promise.reject(
                                          new Error('Không phải định dạng số điện thoại'),
                                        );
                                      },
                                    }),
                                  ]}
                                >
                                  <Input />
                                </Form.Item>
                                <Tooltip title="Số điện thoại chính">
                                  <StarFilled
                                    style={{
                                      color: `${
                                        field.name === isPhoneDefaul ? '#FAAD14' : '#ADADAD'
                                      }`,
                                    }}
                                    onClick={handleClickStar([field.name, 'default'])}
                                  />
                                </Tooltip>
                                <Tooltip title="Xoá">
                                  <Button
                                    onClick={() => remove(field.name)}
                                    size="small"
                                    type="link"
                                    icon={<DeleteTwoTone twoToneColor="red" />}
                                  />
                                </Tooltip>
                              </Space>
                            );
                          })}
                          <Button
                            onClick={() => add()}
                            style={{ width: '60%' }}
                            icon={<PlusCircleTwoTone twoToneColor="#127ACE" />}
                            type="link"
                          >
                            Thêm số điện thoại
                          </Button>
                        </React.Fragment>
                      )}
                    </Form.List>
                  </div>
                )}
                {!isEdit && (
                  <Space align="baseline" direction="vertical">
                    {customerDetail?.phones?.map((phone, index) => (
                      <span key={index} style={{ wordBreak: 'break-word' }}>
                        {phone.phone}
                      </span>
                    ))}
                  </Space>
                )}
              </div>
            );
          })}
        </Space>
        <Divider dashed />
        <div>
          <Typography.Title level={4}>Nhóm</Typography.Title>

          {/* {Array.isArray(customerDetail.groups) && ( */}
          <Space wrap>
            {groupRenderTags?.map((group) => (
              <Tag
                color="processing"
                key={group.value}
                closable={isEdit}
                onClose={handleOnCloseTag(group)}
                // className={styles['group-tag']}
              >
                {/* {group.label} */}
                {limitWords(group?.label, group?.label?.length > 30 ? 3 : 4, ' ')}
              </Tag>
            ))}
            {isEdit && (
              <Popconfirm
                icon={false}
                onConfirm={() => setGroupRenderTags(valueSelected)}
                title={
                  <React.Fragment>
                    <Typography.Title level={3}>Thêm người dùng vào nhóm</Typography.Title>
                    <Select
                      dropdownStyle={{ zIndex: 1061 }}
                      style={{ width: '250px' }}
                      mode="multiple"
                      virtual
                      onSearch={debounce((search) => {
                        setSearchGroups(search);
                      })}
                      onChange={(_, option) => {
                        setValueSelected(option);
                      }}
                      value={valueSelected.map((elm) => elm.value)}
                      filterOption={false}
                      options={groups.map((group) => {
                        return { value: group.id, label: group.name };
                      })}
                    />
                  </React.Fragment>
                }
                // content={
                // }
              >
                <Tag>{<PlusCircleTwoTone />}</Tag>
              </Popconfirm>
            )}
          </Space>
          {/* )} */}
        </div>
        {isEdit && (
          <div className={styles['group-btn']}>
            <Button onClick={handleCancel}>Huỷ</Button>
            <Button htmlType="submit" type="primary">
              Lưu
            </Button>
          </div>
        )}
      </Form>
    </Card>
  );
}

export default connect(({ crmDetail }) => ({ crmDetail }))(BaseInfo);
