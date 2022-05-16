import React, { useState, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import debounce from 'lodash/debounce';
import DataSet from '@antv/data-set';
import { connect } from 'umi';
import { Col, Row, Input, Button, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Export } from '@/components/Icons';
import { TableAdvance, constant } from './components/Table';
import styles from './styles.less';
import CustomeDatePicker from '@/components/CustomDatePicker';
import { StackGroupBarChart } from '@/components/Chart';
import { requestGetReportHistoryChat, requestExportReportHistoryChat } from '@/services/chat';
import moment from 'moment';
import { clone } from '@umijs/deps/compiled/lodash';
import { checkPermission, OMNI_CHAT_INBOUND } from '@/utils/permission';

const fetchReportHistoryChat = async (headers = {}, params = {}) => {
  try {
    const res = await requestGetReportHistoryChat(headers, params);
    if (res.code === 200) {
      return res.response.data;
    }
    throw new Error('Can not fetch api.');
  } catch (err) {
    console.error(err);
    return [];
  }
};

const ds = new DataSet();

AgentReport.propTypes = {
  user: PT.shape({
    authToken: PT.string,
    userId: PT.string,
    tokenGateway: PT.string,
    wsId: PT.string,
    currentUser: {
      permissions: PT.array,
    }
  }).isRequired,
};

const today = moment();

function AgentReport({ user }) {
  const [valueSearch, setValueSearch] = useState('');
  const [dateSelect, setDateSelect] = useState([today, today]);
  const [antvDataSet, setAntvDataSet] = useState(ds.createView());
  const [dataTable, setDataTable] = useState([]);
  const [reportFacebook, setReportFacebook] = useState(false);
  const [reportZalo, setReportZalo] = useState(false);
  const [reportLivechat, setReportLivechat] = useState(false);

  const headers = React.useMemo(() => {
    return {
      // 'X-Auth-Token': user.authToken,
      // 'X-User-Id': user.userId,
      Authorization: `${user.tokenGateway}`,
    };
  }, [user.authToken, user.tokenGateway, user.userId]);

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

  useEffect(() => {
    setReportFacebook(
      checkPermission(user?.currentUser?.permissions, OMNI_CHAT_INBOUND.accessFacebookReport),
    );
    setReportZalo(
      checkPermission(user?.currentUser?.permissions, OMNI_CHAT_INBOUND.accessZaloReport),
    );
    setReportLivechat(
      checkPermission(user?.currentUser?.permissions, OMNI_CHAT_INBOUND.accessLivechatReport),
    );
  }, [user?.currentUser?.permissions]);

  const handleExportData = useCallback(async () => {
    try {
      const res = await requestExportReportHistoryChat(headers, {
        beginDate: dateSelect[0].format('YYYY-MM-DD'),
        closedDate: dateSelect[1].format('YYYY-MM-DD'),
        subId: user.wsId
      });
      console.log(res);
    } catch (err) {
      console.log(err)
    }
  }, [dateSelect, headers]);

  useEffect(() => {
    fetchReportHistoryChat(headers, {
      beginDate: dateSelect[0].format('YYYY-MM-DD'),
      closedDate: dateSelect[1].format('YYYY-MM-DD'),
      page: 0,
      limit: 1000,
      agentName: valueSearch
    }).then((result) => {
      setDataTable(result);
      const convert = result.map((elm) => ({
        username: elm.username,
        fb_inprogess: elm.report.FACEBOOK.processing,
        fb_done: elm.report.FACEBOOK.resolve,
        zalo_inprogess: elm.report.ZALO.processing,
        zalo_done: elm.report.ZALO.resolve,
        livechat_inprogess: elm.report.LIVECHAT.processing,
        livechat_done: elm.report.LIVECHAT.resolve,
      }));
      const dv = ds.createView().source(convert);
      dv.transform({
        type: 'fold',
        fields: [
          'fb_inprogess',
          'zalo_inprogess',
          'livechat_inprogess',
          'fb_done',
          'livechat_done',
          'zalo_done',
        ],
        key: 'key',
        value: 'value',
      }).transform({
        type: 'map',
        callback: (obj) => {
          // console.log(obj)
          const cloneObj = obj;
          if (cloneObj.key.indexOf('fb') !== -1) {
            if (cloneObj.key.indexOf('fb_done') === -1) {
              cloneObj.level = 'Messenger';
            } else {
              cloneObj.level = 'Hoàn thành';
            }
            cloneObj.type = 'Messenger';
          }
          if (cloneObj.key.indexOf('zalo') !== -1) {
            if (cloneObj.key.indexOf('zalo_done') === -1) {
              cloneObj.level = 'Zalo';
            } else {
              cloneObj.level = 'Hoàn thành';
            }
            cloneObj.type = 'Zalo';
          }
          if (cloneObj.key.indexOf('livechat') !== -1) {
            if (cloneObj.key.indexOf('livechat_done') === -1) {
              cloneObj.level = 'Livechat';
            } else {
              cloneObj.level = 'Hoàn thành';
            }
            cloneObj.type = 'Livechat';
          }
          return cloneObj;
        },
      });
      setAntvDataSet(dv);
    });
  }, [dateSelect, headers, valueSearch]);

  return (
    <Row className={styles['report-agent']} gutter={[0, 40]}>
      <Col className={styles['report-agent-history-chart']}>
        {/* chart lịch sử chat */}
        <div>
          <Typography.Title level={5}>Lịch sử chat</Typography.Title>
          <CustomeDatePicker
            disabled={false}
            placeholder={['Từ ngày', 'Đến ngày']}
            defaultValue={[today, today]}
            onChange={(value) => {
              if (value?.length > 0) {
                setDateSelect([value[0], value[1]]);
                return null;
              }
              setDateSelect([today, today]);
              return null;
            }}
          />
        </div>
        {/* chart lịch sử chat */}
      </Col>
      {/* table lịch sử chat của agent */}
      <Col span={24}>
        <StackGroupBarChart
          rows={antvDataSet.rows}
          axis={{ x: 'value', y: 'username' }}
          color={['level', ['#F6BB23', '#1EE0AC', '#6376FF', '#CCC']]}
          legend={{
            position: 'top',
          }}
        >
          {(username, items, rows, ...args) => {
            if (items?.length) {
              const {
                data: { type },
              } = items[0];

              const legendItems = args[2].view
                .getController('legend')
                .components[0].component.getItems();
              const legendMap = legendItems.reduce((pre, cur) => {
                const preCopy = pre;
                const { value, marker } = cur;
                preCopy[value] = marker;
                return preCopy;
              }, {});
              const tooltipItems = rows.filter((item) => {
                return item.username === username && item.type === type;
              });
              return (
                <div>
                  {/* <h5 style={{ marginBottom: -8 }}>
                    <b>{username}</b>
                  </h5> */}
                  <ul>
                    {tooltipItems.map((t) => {
                      return (
                        <li key={t.key} style={{ margin: 8 }}>
                          <span
                            className="g2-tooltip-marker"
                            style={{ backgroundColor: legendMap[t.level].style.fill }}
                          />
                          {t.type === t.level
                            ? `${t.level} - Đang giải quyết`
                            : `${t.type} - ${t.level}`}
                          : {t.value}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }
            return <span />;
          }}
        </StackGroupBarChart>
      </Col>
      <Col span={24}>
        <TableAdvance
          headerTitle={<Typography.Title level={5}>Lịch sử chat của Agent</Typography.Title>}
          toolBarRender={() => [
            <Input
              key="input"
              prefix={<SearchOutlined />}
              placeholder="Nhập từ khóa"
              onChange={handleSearch}
              allowClear
            />,
            <Button key="export" type="primary" icon={<Export />} onClick={handleExportData}>
              Export
            </Button>,
          ]}
          params={{ filterDate: dateSelect, agentName: valueSearch }}
          request={async ({ current, pageSize, filterDate, agentName }) => {
            const params = {
              limit: pageSize,
              page: current - 1,
              beginDate: filterDate[0].format('YYYY-MM-DD'),
              closedDate: filterDate[1].format('YYYY-MM-DD'),
              agentName,
            };
            try {
              const res = await requestGetReportHistoryChat(headers, params);
              if (res.code === 200) {
                const result = [];
                res?.response.data.forEach((data) => {
                  result.push({
                    name: data.username,
                    phone: data.phone,
                    fb_processing: data.report.FACEBOOK.processing,
                    fb_resolve: data.report.FACEBOOK.resolve,
                    fb_percent: data.report.FACEBOOK.percent,
                    zalo_processing: data.report.ZALO.processing,
                    zalo_resolve: data.report.ZALO.resolve,
                    zalo_percent: data.report.ZALO.percent,
                    livechat_processing: data.report.LIVECHAT.processing,
                    livechat_resolve: data.report.LIVECHAT.resolve,
                    livechat_percent: data.report.LIVECHAT.percent,
                  });
                });
                return {
                  data: result,
                  total: 10 * (res?.response.totalPage + 1),
                };
              }
              throw new Error('Can not fetch api.');
            } catch (err) {
              console.error(err);
              return {
                data: [],
                total: 0,
              };
            }
          }}
          columns={constant.AgentHistoryTableHeader.filter(item => {
            let arr = [];
            !reportFacebook && arr.push('Facebook');
            !reportZalo && arr.push('Zalo');
            !reportLivechat && arr.push('Livechat');
            return !arr.includes(item.title)
          })}
        />
      </Col>
    </Row>
  );
}

export default connect(({ user }) => ({ user }))(AgentReport);
