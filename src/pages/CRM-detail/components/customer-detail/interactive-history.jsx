import React, { useState, useCallback, useEffect, useRef } from 'react';
import PT from 'prop-types';
import moment from 'moment';
import Table from '@ant-design/pro-table';
import { Tag, Card, Timeline, DatePicker, Button, Tooltip, List } from 'antd';
import styles from './styles.less';
import { Export } from '@/components/Icons';
import {
  tagName,
  allInteractiveTableHeader,
  chatTableHeader,
  campaignTableHeader,
  callCenterTableHeader,
  sourceHistory,
} from './const';
import { requestHistoryCallSupervisor } from '@/services/call-center';
// import { requestGetHistoryChat } from '@/services/chat';
import {
  exportHistoryCustomer,
  requestHistoryCustomer,
  requestFetchHistoryCustomerChat,
  exportHistoryChatCustomer,
} from '@/services/crm';
import api from '@/api';
// import { PhoneCall } from '@/components/Icons';
import { ZaloIcon, MessagerIcon, LiveChatIcon, CallIcon } from '@/components/Icons';

const formatDate = 'DD/MM/YYYY HH:mm';
// const recordTimeline = 10;

async function handleFetchHistoryTimeline(phones = '', page, headers = {}) {
  try {
    const res = await requestHistoryCallSupervisor(headers, {
      sort: { start_stamp: -1 },
      page,
      limit: 100,
      phone: phones.toString() || '',
    });
    if (res.success) {
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function handleFetchHistoryOmniChat(params, headers = {}) {
  try {
    const res = await requestFetchHistoryCustomerChat(headers, params);
    if (res?.msg === 'SUCCESS') {
      // if (isSetState) setHistories(res.data);
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function handleFetchHistoryCustomer(params, headers = {}) {
  try {
    const res = await requestHistoryCustomer(headers, params);
    if (res.code === 200) {
      return res.response;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    return {
      data: [],
      totalRecord: 0,
    };
  }
}

TimeLineInteractive.propTypes = {
  timelines: PT.instanceOf(Array).isRequired,
  tagSelected: PT.string.isRequired,
  children: PT.oneOfType([PT.node, PT.arrayOf(PT.node)]),
};

TimeLineInteractive.defaultProps = {
  children: <span />,
};

function TimeLineInteractive({ timelines, tagSelected, children }) {
  const validateCalling = (timeline) => {
    if (timeline?.callType === 'inbound') {
      return {
        title: (
          <p>
            Cuộc gọi vào -{' '}
            <span style={{ color: '#127ace', fontWeight: 600 }}>{timeline?.caller_id_number}</span>
          </p>
        ),
        subTitle: timeline?.CallQueueHistory?.note ? timeline.CallQueueHistory.note[0]?.text : '',
        icon: <CallIcon />,
        time: moment(timeline.start_stamp).isValid()
          ? moment(timeline.start_stamp).format(formatDate)
          : '',
      };
    }
    return {
      title: (
        <p>
          Cuộc gọi ra -{' '}
          <span style={{ color: '#127ace', fontWeight: 600 }}>{timeline?.caller_id_number}</span>
        </p>
      ),
      subTitle: timeline?.CallQueueHistory?.note ? timeline.CallQueueHistory.note[0]?.text : '',
      icon: <CallIcon />,
      time: moment(timeline.start_stamp).isValid()
        ? moment(timeline.start_stamp).format(formatDate)
        : '',
    };
  };

  const validateChat = (timeline) => {
    return {
      title: (
        <p>
          {timeline.source} -{' '}
          <span style={{ color: '#127ace', fontWeight: 600 }}>{timeline?.agent_name}</span>
        </p>
      ),
      subTitle: timeline.note,
      icon:
        timeline?.source === sourceHistory.zalo ? (
          <ZaloIcon />
        ) : timeline?.source === sourceHistory.livechat ? (
          <LiveChatIcon />
        ) : (
          <MessagerIcon />
        ),
      time: moment(timeline.createdAt).isValid()
        ? moment(timeline.createdAt).format(formatDate)
        : '',
    };
  };

  const validateHistory = (timeline) => {
    return {
      title: (
        <p>
          {timeline?.source === sourceHistory.callcenter && timeline?.callType === 'inbound'
            ? 'Cuộc gọi vào'
            : timeline?.source === sourceHistory.callcenter && timeline?.callType === 'outbound'
            ? 'Cuộc gọi ra'
            : timeline.source}{' '}
          -{' '}
          <span style={{ color: '#127ace', fontWeight: 600 }}>
            {timeline?.source === sourceHistory.callcenter
              ? timeline?.agent_id
              : timeline?.agent_name}
          </span>
        </p>
      ),
      subTitle: timeline.note, // có thể hiển thị note.
      icon:
        timeline?.source === sourceHistory.zalo ? (
          <ZaloIcon />
        ) : timeline?.source === sourceHistory.livechat ? (
          <LiveChatIcon />
        ) : timeline?.source === sourceHistory.facebook ? (
          <MessagerIcon />
        ) : (
          <CallIcon />
        ),
      time: moment(timeline.createdAt).isValid()
        ? moment(timeline.createdAt).format(formatDate)
        : '',
    };
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <Timeline mode="left" className={styles.scroll}>
        {timelines.map((timeline, index) => {
          const { title, subTitle, icon, time } =
            tagSelected === tagName.all
              ? validateHistory(timeline)
              : tagSelected === tagName.chat
              ? validateChat(timeline)
              : validateCalling(timeline);
          return (
            <Timeline.Item
              key={index}
              label={<span className={styles.timelineTitleLeft}>{time}</span>}
              dot={icon}
              position="left"
            >
              <div className={styles.timelineTitleRight}>
                {title}
                <p className={styles.timelineSubTitle}>{subTitle}</p>
              </div>
            </Timeline.Item>
          );
        })}
        {children}
      </Timeline>
    </div>
  );
}

// async function onFetchHistoryCallSupervisor(params, headers = {}) {
//   try {
//     const res = await requestHistoryCallSupervisor(headers, params);
//     if (res.success) {
//       return res.data;
//     }
//     throw new Error('ERROR~');
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// }

InteractiveHistory.propTypes = {
  phones: PT.array.isRequired,
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  customer: PT.shape({
    facebook: PT.string,
    zalo: PT.string,
    id: PT.string,
  }).isRequired,
  wsId: PT.string.isRequired,
  permissions: PT.shape({
    manage: PT.bool.isRequired,
    update: PT.bool.isRequired,
    onlyView: PT.bool.isRequired,
  }).isRequired,
};

function InteractiveHistory({ phones, headers, customer, wsId, permissions }) {
  const { facebook, zalo, id: customerId } = customer;
  const [tagSelected, toggleTag] = useState('');
  const [columns, setColumns] = useState([]);
  const [histories, setHistories] = useState([]);
  const [pageTimeLine, setPageTimeLine] = useState(0);
  const [paginateTimeline, setPaginateTimeline] = useState(1);
  const [isShowLoadMore, toggleHideLoadMore] = useState(true);
  const [valueDate, setValueDate] = useState([moment().startOf('year'), moment()]);
  // const [total, setTotal] = useState(0);
  // console.log(valueDate);
  const actionRef = useRef();
  const { manage, update, onlyView } = permissions;

  const handleToggleTag = useCallback(
    (tag) => () => {
      toggleTag(tag);
      // whenever tag change, we must reset some state
      setHistories([]);
      setPaginateTimeline(1);
    },
    [],
  );

  // const handleFetchHistoryCallSupervisor = useCallback(async (_phones = '', _headers = {}) => {
  //   try {
  //     const result = await onFetchHistoryCallSupervisor(
  //       {
  //         sort: { xml_cdr_uuid: 1 },
  //         page: 0,
  //         limit: 100,
  //         phone: _phones.toString() || '',
  //       },
  //       _headers,
  //     );
  //     setHistories(result);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, []);

  const handleExportData = useCallback(
    (_phones) => async () => {
      if (tagSelected === tagName.chat) {
        const params = {
          startDate: valueDate?.length > 0 ? valueDate[0].toISOString() : moment().toISOString(),
          endDate: valueDate?.length > 0 ? valueDate[1].toISOString() : moment().toISOString(),
          cusid: customerId,
          subId: wsId,
        };
        const res = await exportHistoryChatCustomer(headers, params);
        return;
      }
      if (tagSelected === tagName.all) {
        const params = {
          startDate: valueDate?.length > 0 ? valueDate[0].toISOString() : moment().toISOString(),
          endDate: valueDate?.length > 0 ? valueDate[1].toISOString() : moment().toISOString(),
          customerId,
          subId: wsId,
        };
        const res = await exportHistoryCustomer(headers, params);
        return;
      }
      return window
        .open(
          `${
            api.REPORT_SERVICE
          }/call-center/customer-history-call/export?phone=${_phones?.toString()}`,
        )
        .focus();
    },
    [customerId, facebook, headers, phones, tagSelected, valueDate, wsId, zalo],
  );

  const handleLoadMore = useCallback(
    (currentPage = 1) =>
      () => {
        setPaginateTimeline(currentPage + 1);
      },
    [],
  );
  useEffect(() => {
    toggleTag(tagName.all);
  }, []);

  // useEffect(() => {
  //   const node = document.querySelector('.ant-timeline');
  //   if (node) {
  //     node.addEventListener('scroll', () => {
  //       const perc = (node.scrollTop / (node.scrollHeight - node.clientHeight)) * 100;
  //       if (perc >= 100) {
  //         // handle get more data
  //         // handleFetchHistoryTimeline(phones);
  //       }
  //     });
  //   }
  // }, []);

  useEffect(() => {
    const params = {
      limit: 10 * paginateTimeline,
      startDate: valueDate?.length > 0 ? valueDate[0].toISOString() : moment().toISOString(),
      endDate: valueDate?.length > 0 ? valueDate[1].toISOString() : moment().toISOString(),
      offset: 0,
      // facebook,
      // zalo,
      // phone: phones.toString() || '',
      // sort: { createAt: -1 },
      customerId: customerId,
    };
    switch (tagSelected) {
      case tagName.all: {
        const cols = allInteractiveTableHeader.map((col) => {
          return {
            align: 'left',
            width: 100,
            ...col,
            title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>{col.title}</span>,
          };
        });
        setColumns(cols);
        // setHistories([]);

        handleFetchHistoryCustomer(params, headers).then((result) => {
          setHistories(result?.data);
          // setTotal(result.totalRecord);
          if (params.limit >= result.totalRecord) {
            toggleHideLoadMore(false)
          };
        });
        actionRef.current.reload();
        // handleFetchHistoryCallSupervisor(phones);
        break;
      }
      case tagName.chat: {
        const cols = chatTableHeader.map((col) => {
          return {
            align: 'left',
            width: 100,
            ...col,
            title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>{col.title}</span>,
          };
        });
        setColumns(cols);
        delete params.customerId;
        delete params.offset;
        handleFetchHistoryOmniChat({
          ...params,
          page: 0,
          cusid: customerId
        }, headers).then((result) => {
          if(result.code === 200) {
            setHistories(result.response.data);
            if (params.limit >= result.response.totalRecord) {
              toggleHideLoadMore(false)
            };
          }
        });
        actionRef.current.reload();
        break;
      }
      case tagName.call: {
        const cols = callCenterTableHeader.map((col) => {
          return {
            align: 'left',
            width: 100,
            ...col,
            title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>{col.title}</span>,
          };
        });
        setColumns(cols);
        // handleFetchHistoryCallSupervisor(phones);
        handleFetchHistoryTimeline(phones, pageTimeLine, headers).then((result) => {
          if (result) {
            setHistories(result.data);
          }
        });
        actionRef.current.reload();
        break;
      }
      case tagName.campaign: {
        const cols = campaignTableHeader.map((col) => {
          return {
            align: 'left',
            width: 100,
            ...col,
            title: <span style={{ color: '#1A1A1A', fontWeight: 'bold' }}>{col.title}</span>,
          };
        });
        setColumns(cols);
        setHistories([]);
        actionRef.current.reload();
        break;
      }
      default: {
        setColumns([]);
        setHistories([]);
        break;
      }
    }
  }, [
    customerId,
    facebook,
    headers,
    pageTimeLine,
    paginateTimeline,
    phones,
    tagSelected,
    zalo,
    valueDate,
  ]);

  return (
    <Card
      headStyle={{ borderBottom: 'none' }}
      title="Lịch sử tương tác"
      extra={
        <div>
          <Tag
            className={styles['interactive-tag']}
            color={tagName.all === tagSelected && 'processing'}
            onClick={handleToggleTag(tagName.all)}
          >
            Tất cả tương tác
          </Tag>
          <Tag
            className={styles['interactive-tag']}
            color={tagName.chat === tagSelected && 'processing'}
            onClick={handleToggleTag(tagName.chat)}
          >
            Kênh chat
          </Tag>
          <Tag
            className={styles['interactive-tag']}
            color={tagName.call === tagSelected && 'processing'}
            onClick={handleToggleTag(tagName.call)}
          >
            Call center
          </Tag>
          <Tag
            className={styles['interactive-tag']}
            color={tagName.campaign === tagSelected && 'processing'}
            onClick={handleToggleTag(tagName.campaign)}
          >
            Voicebot campaign
          </Tag>
        </div>
      }
      bodyStyle={{ padding: '0 24px 24px 24px' }}
    >
      <div className={styles['interactive-table-toolbar']}>
        <DatePicker.RangePicker value={valueDate} onChange={(e) => setValueDate(e)} />
        {(manage || update) && (
          <Button type="primary" icon={<Export />} onClick={handleExportData(phones)}>
            Export dữ liệu
          </Button>
        )}
      </div>
      {histories.length > 0 && (
        <TimeLineInteractive timelines={histories} tagSelected={tagSelected}>
          {isShowLoadMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
              <Button onClick={handleLoadMore(paginateTimeline)} size="small" type="link">
                Xem thêm
              </Button>
            </div>
          )}
        </TimeLineInteractive>
      )}
      <Table
        search={false}
        options={false}
        scroll={{ x: 992 }}
        cardProps={{
          bodyStyle: {
            padding: 0,
          },
        }}
        pagination={{
          defaultPageSize: 10,
          showTotal: false,
          size: 'default',
          // showSizeChanger: false,
        }}
        request={async ({ current, pageSize, search }) => {
          try {
            if (tagSelected === tagName.all) {
              const params = {
                // page: current,
                limit: pageSize,
                // facebook,
                // zalo,
                // phone: phones.toString() || '',
                // sort: { createAt: -1 },
                startDate: valueDate[0].toISOString(),
                endDate: valueDate[1].toISOString(),
                offset: current - 1,
                customerId,
              };
              const result = await handleFetchHistoryCustomer(params, headers);
              return {
                data: result.data,
                total: result.totalRecord,
              };
            }
            if (tagSelected === tagName.call) {
              const params = {
                sort: { start_stamp: -1 },
                page: current,
                limit: pageSize,
                phone: phones.toString() || '',
              };
              const result = await requestHistoryCallSupervisor(params, headers);
              if (result.code === 200) {
                return {
                  data: result.response.data,
                  total: result.response.totalRecord,
                };
              }
              throw new Error('ERROR~');
            }
            if (tagSelected === tagName.chat) {
              const params = {
                page: current - 1,
                limit: pageSize,
                // facebook,
                // zalo,
                // phone: phones.toString() || '',
                // sort: { createAt: -1 },
                cusid: customerId,
                startDate: valueDate[0].toISOString(),
                endDate: valueDate[1].toISOString(),
              };
              const result = await handleFetchHistoryOmniChat(params, headers);
              if (result.code === 200) {
                return {
                  data: result.response.data,
                  total: result.response.totalRecord,
                };
              }
              throw new Error('ERROR~');
            }
            throw new Error('ERROR~');
          } catch (error) {
            console.error(error.toString());
            return {
              data: [],
              total: 0,
            };
          }
        }}
        size="small"
        columns={columns}
        actionRef={actionRef}
        // dataSource={(tagSelected !== tagName.all && histories) || []}
      />
    </Card>
  );
}

export default InteractiveHistory;
