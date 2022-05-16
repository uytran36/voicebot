import React from 'react';
import { Space, Row, Col } from 'antd';
import { LeftOutlined, EditOutlined } from '@ant-design/icons';
import { FaExternalLinkAlt, FaUserAlt } from 'react-icons/fa';

import CustomerInfo from './components/CustomerInfo';
import CommentList from './components/CommentList';

import PT from 'prop-types';

import styles from './style.less';
import img1 from './test-img/image.png';

DetailComment.propTypes = {
  history: PT.shape({
    goBack: PT.func,
  }).isRequired,
};

function DetailComment(props) {
  const { history } = props;
  return (
    <div className={styles.detailComment}>
      <div className={styles.textTitle}>
        <LeftOutlined onClick={() => history.goBack()} className={styles.leftIcon} />
        <span>Chi tiết bình luận</span>
      </div>
      <div className={styles.body}>
        <div className={styles.news_listComment}>
          <div className={styles.news}>
            <div className={styles.news_title}>
              <div className={styles.news_title_label}>Nguồn:</div>
              <div className={styles.news_title_result}>Facebook</div>
            </div>
            <div className={styles.news_body}>
              <div className={styles.news_body_title}>Nhà thuốc FPT Long Châu</div>
              <div className={styles.news_body_time}>01/11/2021 12:00:00</div>
              <div className={styles.news_body_content_wrapper}>
                <div className={styles.news_body_content}>
                  CÁCH ĐUỔI KIẾN BA KHOANG "CỰC ÊM", CHẲNG TỐN SỨC! 🐜GIẢM 10% tinh dầu:
                  https://bit.ly/3mFRfwC Long Châu liên tục nghe "lời kêu cứu" của cả nhà về việc bị
                  kiến ba khoang tấn công nên sẵn đây Long Châu xin giới thiệu top tinh dầu thiên
                  nhiên đuổi bay côn trùng vô cùng hiệu quả...
                </div>
                <div className={styles.news_body_content_img}>
                  <img src={img1} alt="" />
                </div>
              </div>
              <div className={styles.news_body_view_link}>
                <FaExternalLinkAlt />
                Xem toàn bộ bài viết trên Facebook
              </div>
            </div>
          </div>
          <div className={styles.listComment}>
            <CommentList />
          </div>
        </div>
        <div className={styles.customerInfo}>
          <CustomerInfo />
        </div>
      </div>
    </div>
  );
}

export default DetailComment;
