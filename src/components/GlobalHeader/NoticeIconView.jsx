import React, { Component } from 'react';
import { connect } from 'umi';
import { Tag, message } from 'antd';
import groupBy from 'lodash/groupBy';
import moment from 'moment';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';
import { FaThemeisle } from 'react-icons/fa';

class GlobalHeaderRight extends Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 10,
      offset: 0,
      notiTypes: ['ACCOUNT', 'CONFIG', 'CALL', 'CHAT', 'CAMPAIN'],
      readTypes: ['READ', 'UNREAD'],
    };
  }
  componentDidMount() {
    const { dispatch, token } = this.props;

    if (dispatch) {
      const params = {
        notiTypes: ['ACCOUNT', 'CONFIG', 'CALL', 'CHAT', 'CAMPAIN'],
        readTypes: ['READ', 'UNREAD'],
        limit: 10,
        offset: 0,
      };
      // dispatch({
      //   type: 'global/fetchNotices',
      //   headers: {
      //     Authorization: token,
      //   },
      //   params: params,
      // });
    }
  }
  readAllNotice = () => {
    const { dispatch, token } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/readAllNotice',
        headers: {
          Authorization: token,
        },
        body: {
          limit: this.state.limit,
          offset: this.state.offset,
          notiTypes: this.state.notiTypes,
          readTypes: this.state.readTypes,
        },
      });
    }
  };
  changeReadState = (clickedItem) => {
    const { id } = clickedItem;
    const { dispatch, token } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: id,
        headers: {
          Authorization: token,
        },
        body: {
          limit: this.state.limit,
          offset: this.state.offset,
          notiTypes: this.state.notiTypes,
          readTypes: this.state.readTypes,
        },
      });
    }
  };
  handleNoticeClear = (title, key) => {
    const { dispatch } = this.props;
    message.success(`${'It is empty'} ${title}`);

    if (dispatch) {
      dispatch({
        type: 'global/clearNotices',
        payload: key,
      });
    }
  };
  handlePopUpClick = (clickedItem) => {
    const { id } = clickedItem;
    const { dispatch, token } = this.props;

    if (dispatch) {
      dispatch({
        type: 'global/changeNoticeReadState',
        payload: id,
        headers: {
          Authorization: token,
        },
        body: {
          limit: this.state.limit,
          offset: this.state.offset,
          notiTypes: this.state.notiTypes,
          readTypes: this.state.readTypes,
        },
      });
    }
  };

  getNoticeData = () => {
    const { notices = [] } = this.props;

    if (!notices || notices.length === 0 || !Array.isArray(notices)) {
      return {};
    }

    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };

      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0,
            }}
          >
            {newNotice.extra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, 'type');
  };

  getUnreadData = (noticeData) => {
    const unreadMsg = {};
    Object.keys(noticeData).forEach((key) => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter((item) => !item.read).length;
      }
    });
    return unreadMsg;
  };

  handleFiltersChange = (value) => {
    const params = {
      notiTypes: value.notiTypes || '',
      readTypes: value.readTypes || '',
      limit: 10,
      offset: 0,
    };
    this.setState(params);
  };

  handleLoadMore = () => {
    this.setState({ ...this.state, limit: this.state.limit + 10 });
  };

  componentDidUpdate(prevProps, prevState) {
    const { dispatch, token } = this.props;
    if (prevState != this.state) {
      dispatch({
        type: 'global/fetchNotices',
        headers: {
          Authorization: token,
        },
        params: this.state,
      });
    }
  }

  render() {
    const { currentUser, fetchingNotices, onNoticeVisibleChange } = this.props;
    const noticeData = this.getNoticeData();
    const unreadMsg = this.getUnreadData(noticeData);
    return (
      <NoticeIcon
        className={styles.action}
        count={currentUser && currentUser.unreadCount}
        onItemClick={(item) => {
          this.changeReadState(item);
        }}
        onReadAll={() => {
          this.readAllNotice();
        }}
        loading={fetchingNotices}
        readAllText="Đọc tất cả"
        clearText="Trống"
        viewMoreText="Xem thêm"
        onClear={this.handleNoticeClear}
        onPopupVisibleChange={onNoticeVisibleChange}
        onViewMore={() => message.info('Click on view more')}
        clearClose
        callback={this.handleFiltersChange}
        loadmore={this.handleLoadMore}
        filters={this.state}
        showViewMore={this.props.offset !== 0}
        popUpNotice={this.props.popUpNotice}
        handlePopUpClick={this.handlePopUpClick}
      >
        <NoticeIcon.Tab
          tabKey="notification"
          count={currentUser.unreadCount}
          // list={
          //   noticeData.notification !== undefined
          //     ? noticeData.notification.concat(noticeData.message)
          //     : []
          // }
          list={this.props.notices}
          title="Thông báo"
          emptyText="You've seen all the notifications"
          showViewMore
          showViewMore={this.props.offset !== 0}
        />
        {/* <NoticeIcon.Tab
          tabKey="message"
          count={unreadMsg.message}
          list={noticeData.message}
          title="news"
          emptyText="You have read all the messages"
          showViewMore
        /> */}
        {/* <NoticeIcon.Tab
          tabKey="event"
          title="Cài đặt"
          count={unreadMsg.event}
          list={noticeData.event}
        /> */}
      </NoticeIcon>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  token: user.tokenGateway,
  fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
  fetchingNotices: loading.effects['global/fetchNotices'],
  notices: global.notices,
  popUpNotice: global.popUpNotice,
  offset: global.offset,
}))(GlobalHeaderRight);
