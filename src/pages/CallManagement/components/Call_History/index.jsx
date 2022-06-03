import React, { useState, useRef, useEffect } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import styles from './styles.less';
import {
  Card,
  Row,
  Col,
  message,
  Tag,
  Form,
  Input,
  Select,
  Typography,
  Button,
  Space,
  DatePicker,
} from 'antd';
import Table from '@ant-design/pro-table';
import { CloseOutlined, PhoneFilled, SearchOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import Timer from 'react-compound-timer';
import { requestGetUserList } from '@/services/user-management';
import { statusCall, STATUS_CALL, DIRECTION_CALL } from '@/constants/call-center';
import {
  requestGetPbxExtensions,
  requestExportHistoryCall,
  requestHistoryCall,
} from '@/services/call-center';
import { CallHistoryTableHeader } from '../../const';
import SelectMultiple from '@/components/SelectMultiple';
import { Export } from '@/components/Icons';
import api from '@/api';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;
const listStatusCall = { all: 'Tất cả', missCall: 'Cuộc gọi nhỡ', ...statusCall };

CallHistory.propTypes = {
  isSupervisor: PT.bool.isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  user: PT.shape({
    ext: PT.string,
  }).isRequired,
  keyTabCallcenter: PT.string,
  isAllCallHistory: PT.bool.isRequired,
  currentUser: PT.object.isRequired,
};

CallHistory.defaultProps = {
  keyTabCallcenter: '',
};

function CallHistory(props) {
  const { isSupervisor, headers, user, keyTabCallcenter, isAllCallHistory, currentUser } = props;
  const [detail, setDetail] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [valueSearch, setValueSearch] = useState('');
  const [listAgent, setListAgent] = useState({});
  const [filter, setFilter] = useState({
    ext: user?.ext,
    hangup_cause: '',
    // duration: '',
    missed_call: false,
  });
  const [filterCall, setFilterCall] = useState({
    status: '',
    direction: '',
    agent_username: '',
  });
  // const [listPbxExtension, setListPbxExtension] = useState([]);
  const [dateSelect, setDateSelect] = useState({
    startDate: '',
    endDate: '',
  });
  const [params, setParams] = useState({});
  const actionRef = useRef();

  // useEffect(() => {
  //   requestGetPbxExtensions(headers)
  //     .then((res) => {
  //       if (res.success) {
  //         return setListPbxExtension([{ extension: 'Tất cả' }, ...res.data]);
  //       }
  //       throw new Error('ERROR~');
  //     })
  //     .catch((err) => {
  //       setListPbxExtension([]);
  //       console.error(err);
  //     });
  //   return setFilter({ ...filter, hangup_cause: '', missed_call: false });
  // }, []);
  useEffect(() => {
    const _params = {
      fields: {
        name: 1,
        username: 1,
        emails: 1,
        roles: 1,
        status: 1,
        avatarETag: 1,
        active: 1,
        moreData: 1,
        ipPhone: 1,
        phone: 1,
      },
      query: { $or: [{ name: { $regex: '', $options: 'i' } }] },
      sort: {},
      size: 1000,
      page: 0,
    };
    isAllCallHistory
      ? requestGetUserList(headers, _params)
          .then((res) => {
            if (res?.users && res?.users.length > 0) {
              const result = Object.assign(
                {},
                ...res?.users.map(
                  (item) =>
                    item?.ipPhone && { [item.username]: `${item.username} - ${item.ipPhone}` },
                ),
              );
              return setListAgent(result);
            }
            throw new Error('ERROR~');
          })
          .catch((err) => {
            setListAgent([]);
            console.error(err);
          })
      : currentUser?.ipPhone &&
        setListAgent({
          [currentUser.username]: `${currentUser.username} - ${currentUser.ipPhone}`,
        });
  }, [headers, isAllCallHistory]);

  const handleSearch = debounce(
    (e) => {
      const { value } = e.target;
      setValueSearch(value);
    },
    500,
    {
      trailing: true,
      leading: false,
    },
  );

  const list3 = {
    local: 'Nội bộ',
    inbound: 'Cuộc gọi vào',
    outbound: 'Cuộc gọi ra',
  };

  const onSelectStatus = async (e) => {
    // eslint-disable-next-line camelcase
    const hangup_cause = e === 'all' || e === 'missCall' ? '' : e;
    // eslint-disable-next-line camelcase
    const missed_call = e === 'missCall' || false;
    await setFilter({ ...filter, hangup_cause, missed_call });
    actionRef.current.reset();
  };

  const onSelectAgent = async (e) => {
    await setFilter({ ...filter, ext: e === 'Tất cả' ? '' : e });
    return actionRef.current.reset();
  };

  const handleOkDirection = (direction) => {
    setFilterCall({ ...filterCall, direction: direction.join() });
    return actionRef.current.reset();
  };

  const handleOkStatus = (status) => {
    setFilterCall({ ...filterCall, status: status.join() });
    return actionRef.current.reset();
  };

  const handleOkAgent = (agentUsername) => {
    setFilterCall({ ...filterCall, agent_username: agentUsername.join() });
    return actionRef.current.reset();
  };

  const handleOnChangeDate = (date) => {
    if (date?.length > 0) {
      setDateSelect({
        startDate: moment(date[0]).format('YYYY-MM-DD'),
        endDate: moment(date[1]).format('YYYY-MM-DD'),
      });
      return actionRef.current.reset();
    }
    setDateSelect({});
    return null;
  };

  const onExportHistory = async () => {
    try {
      let { limit, page, search, ...cloneParams } = params;
      if (cloneParams.status.length === 0) {
        cloneParams.status = Object.keys(STATUS_CALL);
      }
      if (cloneParams.direction.length === 0) {
        cloneParams.direction = Object.keys(DIRECTION_CALL);
      }
      if (cloneParams.agentName.length === 0) {
        cloneParams.agentName = Object.keys(listAgent);
      }
      const exportParams = { ...cloneParams, subId: user.wsId };

      const res = await requestExportHistoryCall(headers, exportParams);
      return console.error(`Error export history call: ${res}`);
    } catch (error) {
      return console.error(`Error export history call: ${error}`);
    }
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles['form-container']}>
        <Form className={styles.formLeft}>
          <Form.Item label="Kết quả">
            <Select
              defaultValue={filter.hangup_cause === '' ? 'Tất cả' : filter.hangup_cause}
              style={{ width: '12rem', marginRight: 20 }}
              // options={() => {
              //   let result = [];
              //   result = Object.keys(statusCall).map((item) => ({
              //     label: statusCall[item],
              //     value: item,
              //   }));
              //   return result
              // }}
              onChange={onSelectStatus}
            >
              {Object.keys(listStatusCall).map((item, index) => (
                <Option value={item} key={index}>
                  {listStatusCall[item]}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Agent">
            <Select defaultValue="Tất cả" style={{ width: '12rem' }} onChange={onSelectAgent}>
              {listPbxExtension.map((item) => (
                <Option key={item.extension} value={item.extension}>
                  {item.extension}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <div>
          <Input
            prefix={<SearchOutlined />}
            // onPressEnter={handleSubmitSearch}
            placeholder="Nhập từ khóa"
            onChange={handleSearch}
          />
        </div>
      </div> */}
      <Row>
        <Col span={detail ? 19 : 24}>
          <Table
            size="small"
            scroll={{ x: 992 }}
            search={false}
            options={false}
            columns={CallHistoryTableHeader}
            actionRef={actionRef}
            pagination={{ size: 'default', showTotal: false }}
            rowKey={(record) => record.xml_cdr_uuid}
            params={{ search: valueSearch, keyTabCallcenter }}
            headerTitle={
              // <Form name="horizontal_login" layout="inline">
              //   <Form.Item label="Hướng cuộc gọi">
              //     <SelectMultiple list={list3} callback={handleOkDirection}/>
              //   </Form.Item>
              //   <Form.Item label="Kết quả">
              //     <Select
              //       defaultValue={filter.hangup_cause === '' ? 'Tất cả' : filter.hangup_cause}
              //       style={{ width: '12rem', marginRight: 20 }}
              //       onChange={onSelectStatus}
              //     >
              //       {Object.keys(listStatusCall).map((item, index) => (
              //         <Option value={item} key={index}>
              //           {listStatusCall[item]}
              //         </Option>
              //       ))}
              //     </Select>
              //   </Form.Item>
              //   <Form.Item label="Agent">
              //     <Select defaultValue="Tất cả" style={{ width: '12rem' }} onChange={onSelectAgent}>
              //       {listPbxExtension.map((item) => (
              //         <Option key={item.extension} value={item.extension}>
              //           {item.extension}
              //         </Option>
              //       ))}
              //     </Select>
              //   </Form.Item>
              // </Form>
              // <div
              //   style={{
              //     display: 'flex',
              //     justifyContent: 'space-between',
              //     flexWrap: 'wrap',
              //     // width: '50rem',
              //   }}
              // >
              <Space size={[16, 16]} wrap>
                <Form layout={'vertical'}>
                  <Form.Item label="Hướng cuộc gọi">
                    <SelectMultiple list={DIRECTION_CALL} callback={handleOkDirection} />
                  </Form.Item>
                </Form>
                <Form layout={'vertical'}>
                  <Form.Item label="Kết quả">
                    <SelectMultiple list={STATUS_CALL} callback={handleOkStatus} />
                  </Form.Item>
                </Form>
                <Form layout={'vertical'}>
                  <Form.Item label="Agent">
                    <SelectMultiple list={listAgent} callback={handleOkAgent} />
                  </Form.Item>
                </Form>
                <Form layout={'vertical'}>
                  <Form.Item label="Thời gian">
                    <RangePicker onChange={(value) => handleOnChangeDate(value)} />
                  </Form.Item>
                </Form>
              </Space>
              // </div>
            }
            toolBarRender={() => [
              <Form layout={'vertical'} key="input">
                <Form.Item label={<span></span>}>
                  <Input
                    key="input"
                    prefix={<SearchOutlined />}
                    // onPressEnter={handleSubmitSearch}
                    placeholder="Nhập từ khóa"
                    onChange={handleSearch}
                  />
                </Form.Item>
              </Form>,
              <Form layout={'vertical'} key="export˝">
                <Form.Item label={<span></span>}>
                  <Button type="primary" icon={<Export />} onClick={onExportHistory}>
                    Export
                  </Button>
                </Form.Item>
              </Form>,

              // <Input
              //   key="input"
              //   prefix={<SearchOutlined />}
              //   // onPressEnter={handleSubmitSearch}
              //   placeholder="Nhập từ khóa"
              //   onChange={handleSearch}
              // />,
            ]}
            request={async ({ current, pageSize, search }) => {
              const _params = {
                limit: pageSize,
                page: current - 1,
                search,
                // sortfield: 'start_stamp',
                // sorttype: 'DESC',
                status: filterCall?.status?.length > 2 ? filterCall.status : '',
                direction: filterCall?.direction?.length > 2 ? filterCall.direction : '',
                agentName: filterCall?.agent_username?.length > 2 ? filterCall.agent_username : '',
                startDate: dateSelect.startDate || '',
                endDate: dateSelect.endDate || '',
              };
              setParams(_params);
              try {
                const res = await requestHistoryCall(headers, _params);
                if (res?.status === 200 && res?.data) {
                  return {
                    data: res.data,
                    total: res?.totalPage * res.data?.length,
                  };
                }
              } catch (err) {
                // message.error(err.toString());
                return {
                  data: [],
                  total: 0,
                };
              }
            }}

            // onRow={(record, index) => {
            //   return {
            //     onClick: () => {
            //       setDetail(true);
            //       setDataDetail(record);
            //     },
            //   };
            // }}
          />
        </Col>
        {detail && (
          <Col span={5}>
            <Card
              title={<span style={{ fontSize: 18, fontWeight: 'bold' }}>Nguyễn Thu Hương</span>}
              style={{ height: '100%' }}
              extra={<CloseOutlined onClick={() => setDetail(false)} />}
            >
              <div className={styles.bodyHeader}>
                <span>
                  {dataDetail.caller_id_number} - {dataDetail.caller_destination}
                </span>
              </div>
              <div className={styles.bodyContent}>
                <div className={styles.detail}>
                  <PhoneFilled style={{ color: '#16B14B', fontSize: '27px', marginRight: 10 }} />
                  <div className={styles.content}>
                    <a href={`/${dataDetail.record_path}`}>{dataDetail.record_name}</a>
                    <h4>Ghi chú: Mua sản phẩm A</h4>
                  </div>
                </div>
                {/* <div className={styles.detail}>
                  <PhoneFilled style={{ color: '#16B14B', fontSize: '27px', marginRight: 10 }}/>
                  <div className={styles.content}>
                    <h4>Cuộc gọi đến, 0 phút 15 giây</h4>
                    <h4>Ghi chú: Mua sản phẩm A</h4>
                  </div>
                </div> */}
                {/* <div className={styles.detail}>
                  <PhoneFilled style={{ color: '#16B14B', fontSize: '27px', marginRight: 10 }}/>
                  <div className={styles.content}>
                    <h4>Cuộc gọi đến, 0 phút 15 giây</h4>
                    <h4>Ghi chú: Mua sản phẩm A</h4>
                  </div>
                </div>
                <div className={styles.detail}>
                  <PhoneFilled style={{ color: '#16B14B', fontSize: '27px', marginRight: 10 }}/>
                  <div className={styles.content}>
                    <h4>Cuộc gọi đến, 0 phút 15 giây</h4>
                    <h4>Ghi chú: Mua sản phẩm A</h4>
                  </div>
                </div> */}
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default CallHistory;
