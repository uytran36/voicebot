import { List, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './NoticeList.less';
import filterIcon from '@/assets/filter_icon.png';
import uncheckIcon from '@/assets/uncheck_icon.png';
import checkIcon from '@/assets/check_icon.png';
import unreadIcon from '@/assets/unread_icon.png';
import FilterNotice from './FilterNotice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleDown } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { NoticeIcon, NoticeMessage } from './utils';

const NoticeList = ({
  data = [],
  msgCount,
  onClick,
  onClear,
  onReadAll,
  readAllText,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore,
  callback,
  filters,
  toggleRecall,
}) => {
  const [filterMenu, setFilterMenu] = useState(false);
  const toggleFilterMenu = () => setFilterMenu(!filterMenu);
  if (!data || data.length === 0) {
    return (
      <div style={{ minHeight: '400px' }}>
        <div className={styles.topBar}>
          <img src={filterIcon} alt="" className={styles.filterBtn} onClick={toggleFilterMenu} />
          {filterMenu ? <FilterNotice callback={callback} values={filters} /> : <></>}
        </div>
        <div className={styles.notFound}>
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            alt="not found"
          />
          <div>{emptyText}</div>
        </div>
      </div>
    );
  }
  const loadMore = showViewMore ? (
    <div
      className={styles.loadMore}
      onClick={(e) => {
        if (onViewMore) {
          onViewMore(e);
        }
      }}
    >
      <FontAwesomeIcon icon={faAngleDoubleDown} size="small" style={{ marginRight: '5px' }} />{' '}
      {viewMoreText}
    </div>
  ) : null;
  return (
    <div style={{ minHeight: '400px' }}>
      <div className={styles.topBar}>
        <div
          className={msgCount !== 0 ? styles.readAllBtnActive : styles.readAllBtnInactive}
          onClick={msgCount !== 0 ? onReadAll : {}}
        >
          {msgCount === 0 ? (
            <img src={checkIcon} alt="" className={styles.readAllStatus} />
          ) : (
            <img src={uncheckIcon} alt="" className={styles.readAllStatus} />
          )}{' '}
          {readAllText}
        </div>
        <img src={filterIcon} alt="" className={styles.filterBtn} onClick={toggleFilterMenu} />
        {filterMenu ? <FilterNotice callback={callback} values={filters} /> : <></>}
        {/* {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null} */}
      </div>
      <List
        className={styles.list}
        dataSource={data}
        loadMore={loadMore}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          }); // eslint-disable-next-line no-nested-ternary

          const leftIcon = <NoticeIcon type={item.type} subtype={item.subtype} read={item.read} />;
          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => {
                !item.read ? onClick?.(item) : null;
              }}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description}>
                      <NoticeMessage subtype={item.subtype} messageData={item.messageData} />
                    </div>
                    <Button
                      type="primary"
                      className={item.read ? styles.disableBtn : styles.activeBtn}
                      disabled={item.read}
                      onClick={() => toggleRecall(true)}
                    >
                      Gọi lại
                    </Button>
                    <div className={styles.datetime}>
                      {moment(item.timestamp).diff(moment()) > 0
                        ? 'vừa xong'
                        : moment(item.timestamp).fromNow()}
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default NoticeList;
