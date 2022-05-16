import React, { useRef, useState, useCallback, useEffect } from 'react';
// import uniq from 'lodash/uniq';
import moment from 'moment';
import PT from 'prop-types';
import debounce from 'lodash/debounce';
import { Tag, Dropdown, Input, Form, DatePicker, Menu, message, Popconfirm } from 'antd';
import {
  MoreOutlined,
  PhoneOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import Table from '@ant-design/pro-table';
import styles from './styles.less';
import { FormattedMessage, Link } from 'umi';
import { requestGetCampaigns, requestChangeStatus } from '@/services/campaign-management';
import PlayPause from '@/components/Icons/PlayPauseVoicebot';
import SelectMultiple from '@/components/SelectMultiple';
import { requestDepartmentUnitList } from '@/services/user-management';
import api from '@/api';

const { RangePicker } = DatePicker;
const formatDateTime = 'DD/MM/YYYY HH:mm';
const formatDate = 'DD/MM/YYYY';

const fetchListCampaign = async (
  headers,
  { type, status, unit, department, name, from, to, current, pageSize },
) => {
  try {
    const data = {
      offset: current,
      limit: pageSize,
      filter_data: {
        campaign_type: type,
        status,
        unit,
        department,

        from_day: from !== '' ? moment(from).format('YYYY-MM-DD') : '',
        to_day: to !== '' ? moment(to).format('YYYY-MM-DD') : '',
      },
      search_name: name,
    };
    const res = await requestGetCampaigns({ headers, data });
    if (res.success) {
      return { data: res.data, total: res.length };
    }
    throw new Error(res.error || 'Error...');
  } catch (err) {
    return [];
  }
};

const statusFilterCampaign = {
  all: <FormattedMessage id="pages.campaign-management.status.all" />,
  running: <FormattedMessage id="pages.campaign-management.status.running" />,
  pending: <FormattedMessage id="pages.campaign-management.status.pending" />,
  completed: <FormattedMessage id="pages.campaign-management.status.completed" />,
  scheduled: <FormattedMessage id="pages.campaign-management.status.schedule" />,
};

const renderStyleStatus = (status) => {
  switch (status) {
    case 'pending':
      // return '#F6803B';
      return (
        <Tag color="orange">
          <FormattedMessage id="pages.campaign-management.status.pending" />
        </Tag>
      );
    case 'completed':
      // return '#16B14B';
      return (
        <Tag color="geekblue">
          <FormattedMessage id="pages.campaign-management.status.completed" />
        </Tag>
      );
    case 'running':
      // return '#001444';
      return (
        <Tag color="green">
          <FormattedMessage id="pages.campaign-management.status.running" />
        </Tag>
      );
    case 'new':
      // return '#001444';
      return (
        <Tag color="red">
          <FormattedMessage id="pages.campaign-management.status.new" />
        </Tag>
      );
    case 'waiting':
      return (
        <Tag color="default">
          <FormattedMessage id="pages.campaign-management.status.waiting" />
        </Tag>
      );
    case 'stop':
      // stop hiển thị trên màn hình tương tự như completed
      return (
        <Tag color="geekblue">
          <FormattedMessage id="pages.campaign-management.status.completed" />
        </Tag>
      );
    default:
      // return '#313541';
      return (
        <Tag color="default">
          <FormattedMessage id="pages.campaign-management.status.not_running" />
        </Tag>
      );
  }
};

CampaignList.propTypes = {
  headers: PT.shape({}).isRequired,
  clickAddCampaign: PT.func.isRequired,
  updateCampaign: PT.func.isRequired,
  callDemo: PT.func.isRequired,
  deleteCampaign: PT.func.isRequired,
  editCampaign: PT.func.isRequired,
  setStep: PT.func.isRequired,
  setMaxStep: PT.func.isRequired,
  actionRef: PT.shape({
    current: PT.instanceOf(Object),
  }).isRequired,
  configCampaignIVR: PT.bool.isRequired,
  configCampaignT2S: PT.bool.isRequired,
};

function CampaignList({
  headers,
  updateCampaign,
  deleteCampaign,
  editCampaign,
  duplicateCampaign,
  callDemo,
  actionRef,
  setStep,
  setMaxStep,
}) {
  const [valueSearch, setValueSearch] = useState({
    type: [],
    status: [],
    unit: [],
    department: [],
    from: '',
    to: '',
    name: '',
  });
  const [listUnit, setListUnit] = useState([]);
  const [listDepartment, setListDepartment] = useState([]);

  const timedifference = moment().utcOffset();
  /**
   * Function event change status
   * @param {Object} record
   * @returns {Void}
   */
  const handleChangeStatus = useCallback(
    (record) => async () => {
      const data = {
        campaign_id: record?.id,
        status: record.status !== 'pending' ? 'pending' : 'running',
      };
      try {
        const res = await requestChangeStatus(headers, data);
        if (res?.success) {
          message.success('Update status thành công.');
          actionRef.current?.reload();
          return null;
        }
        throw new Error('ERROR~');
      } catch (err) {
        console.error(err.toString());
        message.warning('Update status không thành công.');
        return null;
      }
    },
    [actionRef, requestChangeStatus],
  );

  /**
   * Function event call demo
   * @param {Object} record
   * @returns {Void}
   */
  const handleCallDemo = useCallback(
    (record) => () => {
      if (record.status !== 'new') {
        callDemo(record.id);
      }
    },
    [callDemo],
  );

  /**
   * Function event delete campaign
   * @param {Object} record
   * @returns {Void}
   */
  const handleDeleteCampaign = useCallback(
    (record) => async () => {
      if (record.status !== 'running') {
        try {
          const res = await deleteCampaign(record.id);
          if (res?.success) {
            actionRef.current?.reload();
            return null;
          } else {
            message.warning(`Xóa chiến dịch không thành công. ${res?.error}`);
            return null;
          }
        } catch (err) {}
      }
    },
    [actionRef, deleteCampaign],
  );

  /**
   * @param {Object Event} e - Event node
   * Fucntion event search campaign
   */
  const debounceSearch = debounce(
    debounce(
      (e) => {
        const { value } = e.target;
        if (value.length <= 50) {
          actionRef.current.reset();
          setValueSearch({ ...valueSearch, name: value });
        } else {
          message.warning('Đã vượt quá giới hạn tìm kiếm 50 ký tự!');
        }
      },
      500,
      {
        trailing: true,
        leading: false,
      },
    ),
  );

  const handleEditCampaign = useCallback(
    (record) => () => {
      if (record.status !== 'running') {
        editCampaign(record);
      }
    },
    [editCampaign],
  );

  const handleDuplicateCampaign = useCallback(
    (record) => () => {
      duplicateCampaign(record, actionRef);
    },
    [duplicateCampaign],
  );
  /**
   * Render menu dropdown
   * @param {Object} record
   * @returns {Node}
   */
  const menu = (record) => (
    <Menu>
      {(api.ENV === 'local' || api.ENV === 'dev') && (
        <Menu.Item key="1" disabled={record.status === 'new' ? true : false}>
          <div onClick={handleCallDemo(record)}>
            <PhoneOutlined style={{ marginRight: 5 }} />
            Chạy thử nghiệm
          </div>
        </Menu.Item>
      )}
      <Menu.Item key="2" disabled={record.status === 'running' ? true : false}>
        <div onClick={handleEditCampaign(record)}>
          <EditOutlined style={{ marginRight: 5 }} />
          Chỉnh sửa
        </div>
      </Menu.Item>
      <Menu.Item key="3">
        <div onClick={handleDuplicateCampaign(record)}>
          <CopyOutlined style={{ marginRight: 5 }} />
          Sao chép cấu hình
        </div>
      </Menu.Item>
      <Menu.Item key="4" disabled={record.status === 'running' ? true : false}>
        <Popconfirm
          title="Bạn có chắc muốn xóa chiến dịch này?"
          onConfirm={handleDeleteCampaign(record)}
          // onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <div>
            <DeleteOutlined style={{ marginRight: 5 }} />
            Xóa chiến dịch
          </div>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    setStep(0);
    setMaxStep(0);
  }, []);

  useEffect(() => {
    requestDepartmentUnitList(headers)
      .then((res) => {
        if (res.success) {
          let units = [];
          res.data[0].unit.forEach((i) => units.push(i));
          setListUnit(units.reduce((a, v) => ({ ...a, [v]: v }), {}));

          let departments = [];
          res.data[0].department.forEach((i) => departments.push(i));
          setListDepartment(departments.reduce((a, v) => ({ ...a, [v]: v }), {}));
        } else {
          throw new Error(`ERROR~`);
        }
      })
      .catch((err) => {
        setListUnit([]);
        setListDepartment([]);
      });
  }, [headers]);

  const listType = {
    autoCall: 'Chiến dịch Auto Call',
    autoDialer: 'Chiến dịch Auto Dialer',
    previewCall: 'Chiến dịch Preview',
  };

  const listStatus = {
    new: 'Chưa hoàn tất',
    running: 'Đang chạy',
    pending: 'Tạm dừng',
    completed: 'Hoàn thành',
    not_running: 'Chưa chạy',
    stop: 'Ngừng',
    waiting: 'Đang chờ',
  };

  const handleOkType = (values) => {
    setValueSearch({ ...valueSearch, type: values });
    return actionRef.current.reset();
  };

  const handleOkStatus = (values) => {
    setValueSearch({ ...valueSearch, status: values });
    return actionRef.current.reset();
  };

  const handleOkUnit = (values) => {
    setValueSearch({ ...valueSearch, unit: values });
    return actionRef.current.reset();
  };

  const handleOkDepartment = (values) => {
    setValueSearch({ ...valueSearch, department: values });
    return actionRef.current.reset();
  };

  return (
    <div>
      <Table
        rowKey={(record) => record._id}
        search={false}
        options={false}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
          size: 'default',
          // showSizeChanger: flalse,
        }}
        size="small"
        actionRef={actionRef}
        params={{
          type: valueSearch.type,
          status: valueSearch.status,
          unit: valueSearch.unit,
          department: valueSearch.department,
          from: valueSearch.from,
          to: valueSearch.to,
          name: valueSearch.name,
        }}
        request={async (params) => {
          const { data, total } = await fetchListCampaign(headers, params);
          const dataArray = data.map((item, index) => {
            return {
              ...item,
              index: (params.current - 1) * params.pageSize + (index + 1),
            };
          });
          return {
            data: dataArray,
            total,
          };
        }}
        headerTitle={
          <Form style={{ marginBottom: '0px', display: 'flex', gap: '10px' }}>
            <Form.Item
              style={{ display: 'list-item', marginBottom: '0px' }}
              name="type"
              label={
                <span>
                  <FormattedMessage
                    id="pages.campaign-management.table.type"
                    defaultMessage="Loại chiến dịch"
                  />
                </span>
              }
            >
              <SelectMultiple
                list={listType}
                callback={handleOkType}
                options={{ style: { width: 200 } }}
              />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: '0px', display: 'list-item' }}
              name="status"
              label={
                <span>
                  <FormattedMessage
                    id="pages.campaign-management.table.status"
                    defaultMessage="Trạng thái"
                  />
                </span>
              }
            >
              <SelectMultiple list={listStatus} callback={handleOkStatus} style={{ width: 150 }} />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: '0px', display: 'list-item' }}
              name="unit"
              label={
                <span>
                  <FormattedMessage
                    id="pages.campaign-management.table.unit"
                    defaultMessage="Đơn vị"
                  />
                </span>
              }
            >
              <SelectMultiple list={listUnit} callback={handleOkUnit} style={{ width: 150 }} />
            </Form.Item>

            <Form.Item
              style={{ marginBottom: '0px', display: 'list-item' }}
              name="department"
              label={
                <span>
                  <FormattedMessage
                    id="pages.campaign-management.table.department"
                    defaultMessage="Phòng ban"
                  />
                </span>
              }
            >
              <SelectMultiple
                list={listDepartment}
                callback={handleOkDepartment}
                style={{ width: 150 }}
              />
            </Form.Item>
            <Form.Item
              style={{ marginBottom: '0px', display: 'list-item' }}
              name="time"
              label={
                <span>
                  <FormattedMessage
                    id="pages.campaign-management.table.time"
                    defaultMessage="Thời gian"
                  />
                </span>
              }
            >
              <RangePicker
                disabled={false}
                placeholder={['Từ ngày', 'Đến ngày']}
                onChange={(value) => {
                  actionRef.current.reset();
                  if (value?.length > 0) {
                    setValueSearch({
                      ...valueSearch,
                      from: value[0].toJSON(),
                      to: value[1].toJSON(),
                    });
                    return null;
                  }
                  setValueSearch({
                    ...valueSearch,
                    from: '',
                    to: '',
                  });
                  return null;
                }}
              />
            </Form.Item>
          </Form>
        }
        toolBarRender={() => [
          <Input
            className={styles['toolbar-search']}
            key="search"
            placeholder="Nhập từ khóa"
            prefix={<SearchOutlined />}
            allowClear
            onChange={debounceSearch}
            // onChange={(e) => {
            //   if (e.target.value.length === 0) {
            //     handleInputOnChange('');
            //   }
            // }}
            // onPressEnter={(e) => handleInputOnChange(e.target.value)}
          />,
        ]}
        columns={[
          {
            title: <span style={{ fontWeight: 'bold' }}>#</span>,
            render: (_, record) => <span>{record.index}</span>,
            // width: 40,
          },
          {
            title: (
              <span style={{ fontWeight: 'bold' }}>
                <FormattedMessage id="pages.campaign-management.name" />
              </span>
            ),
            dataIndex: 'name',
            align: 'left',
            // width: 120,
            render: (text, record) =>
              record.status !== 'new' ? (
                <Link to={`/config/campaign-management-2/${record.id}/report`}>{text}</Link>
              ) : (
                <Link to={`/config/campaign-management-2/${record.id}`}>{text}</Link>
              ),
          },
          {
            title: (
              <span style={{ fontWeight: 'bold' }}>
                <FormattedMessage id="pages.campaign-management.table.type" />
              </span>
            ),
            dataIndex: 'type',
            align: 'left',
            // width: 100,
            render: (text) => (
              <>
                {text === 'autoCall' ? (
                  <>Auto Call</>
                ) : text === 'autoDialer' ? (
                  <>Auto Dialer</>
                ) : (
                  <>Preview Call</>
                )}
              </>
            ),
          },
          {
            title: (
              <span style={{ fontWeight: 'bold' }}>
                <FormattedMessage id="pages.campaign-management.created.time" />
              </span>
            ),
            dataIndex: 'create_at',
            align: 'center',
            render: (text) =>
              text !== '-' ? moment.utc(text).utcOffset(timedifference).format(formatDateTime) : '',
            // width: 100,
          },
          {
            title: (
              <span style={{ fontWeight: 'bold' }}>
                <FormattedMessage id="pages.campaign-management.creator" />
              </span>
            ),
            dataIndex: 'create_by',
            align: 'left',
            // width: 100,
          },
          {
            title: (
              <span style={{ fontWeight: 'bold' }}>
                <FormattedMessage id="pages.campaign-management.table.unit" />
              </span>
            ),
            dataIndex: 'unit',
            align: 'left',
            // width: 100,
          },
          {
            title: (
              <span style={{ fontWeight: 'bold' }}>
                <FormattedMessage id="pages.campaign-management.table.department" />
              </span>
            ),
            dataIndex: 'department',
            align: 'left',
            // width: 100,
          },
          ...((api.ENV === 'local' || api.ENV === 'dev') ? [
            {
              title: (
                <span style={{ fontWeight: 'bold' }}>
                  <FormattedMessage id="pages.campaign-management.start.time" />
                </span>
              ),
              dataIndex: ['campaignStrategies', 'st_begin'],
              align: 'center',
              render: (text) =>
                text !== '-' ? moment(text).subtract(7, 'hours').format(formatDate) : '',
              // width: 100,
            },
            {
              title: (
                <span style={{ fontWeight: 'bold' }}>
                  <FormattedMessage id="pages.campaign-management.finish.time" />
                </span>
              ),
              dataIndex: ['campaignStrategies', 'st_end'],
              align: 'center',
              render: (text) =>
                text !== '-' ? moment(text).subtract(7, 'hours').format(formatDate) : '',
              // width: 100,
            },
          ] : []),
          {
            title: (
              <span style={{ fontWeight: 'bold' }}>
                <FormattedMessage id="pages.campaign-management.status" />
              </span>
            ),
            dataIndex: 'status',
            align: 'center',
            // width: 100,
            render: (text, record) => renderStyleStatus(text),
          },
          {
            title: <span style={{ fontWeight: 'bold' }}>Hành động</span>,
            dataIndex: 'action',
            align: 'center',
            // width: 90,
            render: (_, record) => {
              return (
                <div className={styles.actionWrap}>
                  {(record.status === 'pending' || record.status === 'running') && (
                    <PlayPause
                      onClick={handleChangeStatus(record)}
                      paused={record?.status === 'running' ? 'paused' : 'play'}
                      style={{ color: '#fff', fontSize: 14, cursor: 'pointer' }}
                    />
                  )}
                </div>
              );
            },
          },
          {
            align: 'center',
            // width: 90,
            render: (text, record) => {
              return (
                <Dropdown trigger={['hover']} overlay={() => menu(record)}>
                  <MoreOutlined style={{ fontSize: 26, cursor: 'pointer' }} />
                </Dropdown>
              );
            },
          },
        ]}
        cardProps={{
          bodyStyle: { background: '#f0f2f5', paddingTop: 0 },
        }}
      />
    </div>
  );
}

export default CampaignList;
