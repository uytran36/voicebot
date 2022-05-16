import { BellOutlined } from '@ant-design/icons';
import { Badge, Spin, Tabs } from 'antd';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import React from 'react';
import classNames from 'classnames';
import NoticeList from './NoticeList';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import SettingNotifyList from './SettingNotifyList';
import { openPopUp } from './utils';
const { TabPane } = Tabs;

const NoticeIcon = (props) => {
  const getNotificationBox = () => {
    const {
      children,
      onReadAll,
      loading,
      onClear,
      onTabChange,
      onItemClick,
      onViewMore,
      clearText,
      readAllText,
      viewMoreText,
      callback,
      filters,
      loadmore,
      popUpNotice,
      handlePopUpClick,
    } = props;

    React.useEffect(() => {
      if (popUpNotice) {
        openPopUp({ handlePopUpClick, popUpNotice });
      }
    }, [popUpNotice]);

    if (!children) {
      return null;
    }

    const panes = [];
    React.Children.forEach(children, (child) => {
      if (!child) {
        return;
      }

      const { list, title, count, tabKey, showClear, showViewMore } = child.props;

      const len = list && list.length ? list.length : 0;
      const msgCount = count;
      const readAll = count === 0 ? 'Không có thông báo mới' : `${readAllText} (${msgCount})`;
      // const tabTitle = msgCount > 0 ? `${title} (${msgCount})` : title;
      panes.push(
        <TabPane tab={title} key={tabKey} forceRender={true}>
          <NoticeList
            {...child.props}
            onReadAll={onReadAll}
            readAllText={readAll}
            msgCount={msgCount}
            clearText={clearText}
            viewMoreText={viewMoreText}
            data={list}
            onClear={() => {
              onClear?.(title, tabKey);
            }}
            onClick={(item) => {
              onItemClick?.(item, child.props);
            }}
            onViewMore={() => loadmore()}
            showClear={showClear}
            showViewMore={showViewMore}
            title={title}
            callback={callback}
            filters={filters}
            loadmore
          />
        </TabPane>,
      );
      panes.push(
        <TabPane tab="Cài đặt" key="setting">
          <SettingNotifyList />
        </TabPane>,
      );
    });
    return (
      <Spin spinning={loading} delay={300}>
        <Tabs className={styles.tabs} onChange={onTabChange}>
          {panes}
        </Tabs>
      </Spin>
    );
  };

  const { className, count, bell } = props;
  const [visible, setVisible] = useMergedState(false, {
    value: props.popupVisible,
    onChange: props.onPopupVisibleChange,
  });
  const noticeButtonClass = classNames(className, styles.noticeButton);
  const notificationBox = getNotificationBox();
  const NoticeBellIcon = bell || <BellOutlined className={styles.icon} />;
  const trigger = (
    <span
      className={classNames(noticeButtonClass, {
        opened: visible,
      })}
    >
      <Badge
        count={count}
        style={{
          boxShadow: 'none',
        }}
        className={styles.badge}
      >
        {NoticeBellIcon}
      </Badge>
    </span>
  );

  if (!notificationBox) {
    return trigger;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      overlay={notificationBox}
      overlayClassName={styles.popover}
      trigger={['click']}
      visible={visible}
      onVisibleChange={setVisible}
    >
      {trigger}
    </HeaderDropdown>
  );
};

NoticeIcon.defaultProps = {
  emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg',
};

NoticeIcon.Tab = NoticeList;
export default NoticeIcon;
