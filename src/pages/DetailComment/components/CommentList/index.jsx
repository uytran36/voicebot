import React, {useState} from 'react';
import { Switch, Input } from 'antd';
import { FaExternalLinkAlt, FaRegSmile, FaRegStickyNote } from 'react-icons/fa';
import {
  LikeFilled,
  MessageFilled,
  EditOutlined,
  GifOutlined,
  CameraOutlined,
} from '@ant-design/icons';

import img2 from '../../test-img/image_2.png';
import img3 from '../../test-img/image_3.png';
import avt1 from '../../test-img/avt_1.png';
import avt2 from '../../test-img/avt_2.png';

import styles from './style.less';

function CommentList(props) {
  const [comment, setComment] = useState(null);
  const CommentCard = ({
    type,
    isParent,
    isLast,
    mail,
    id,
    name,
    time,
    content,
    like,
    reply,
    img,
    avt,
  }) => {
    return (
      <div className={isParent ? styles.commentItem : `${styles.commentItem} ${styles.toLeft}`}>
        {isParent ? null : <div className={styles.commentConnect} />}
        {isLast && <div className={styles.parentListLine} />}
        {type === 'customer' ? (
          <div className={styles.avatar}>{avt}</div>
        ) : (
          <div className={styles.avatarAgent}>{avt}</div>
        )}
        <div
          className={
            isParent
              ? `${styles.commentWrapper} ${styles.blue}`
              : `${styles.commentWrapper} ${styles.grey}`
          }
        >
          <div className={styles.header}>
            <span className={styles.headerText}>
              {type === 'me' && <span className={styles.meText}>Tôi:</span>}
              {name}
              {type !== 'customer' && (
                <span className={styles.headerMail}>{`(${mail}) - ${id}`}</span>
              )}
              {type !== 'me' && <span className={styles.headerTime}>{time}</span>}
              {type === 'agent' && <EditOutlined className={styles.headerIcon} />}
            </span>
            <div className={styles.showCmt}>
              Hiện bình luận:
              <Switch />
            </div>
          </div>
          {type === 'customer' && (
            <>
              <div className={styles.commentID}>
                ID: <span className={styles.blue}>{id}</span>
              </div>
              <div className={styles.comment_view_link}>
                <FaExternalLinkAlt />
                Xem bình luận tại bài viết
              </div>
            </>
          )}
          {type !== 'me' ? (
            <div className={styles.comment_content}>
              <p>{content}</p>
              {img}
            </div>
          ) : (
            <>
              <Input
                className={styles.input}
                placeholder="Trả lời: Giang Huong Le"
                suffix={
                  <div className={styles.inputIcon}>
                    <FaRegSmile />
                    <GifOutlined />
                    <CameraOutlined />
                    <FaRegStickyNote />
                  </div>
                }
                onPressEnter={handleEnter}
              />
              <span className={styles.inputDesc}>Ấn enter để gửi</span>
            </>
          )}
          {type === 'customer' && (
            <>
              <div className={styles.comment_like_reply}>
                <div className={styles.comment_feature}>
                  <LikeFilled className={styles.comment_feature_icon} />
                  Thích<span className={styles.comment_num}>{`(${like})`}</span>
                </div>
                <div className={styles.comment_feature}>
                  <MessageFilled className={styles.comment_feature_icon} />
                  Trả lời<span className={styles.comment_num}>{`(${reply})`}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const handleEnter = (e) => {
    console.log(e);
    setComment(e.target.value);
  };
  return (
    <>
      <div className={styles.commentListWrapper}>
        <div className={styles.listLine} />
        <CommentCard
          type="customer"
          isParent
          mail="xyz"
          time="02/11/2021 15:43:02"
          id="33940"
          name="Giang Huong Le"
          content="Sao mà mình cho cháu uống mà cháu đều kêu mệt sau mỗi lần uống"
          img={<img src={img2} alt="" />}
          avt={<img src={avt1} alt="" />}
          like={2}
          reply={2}
        />
        <CommentCard
          type="agent"
          isParent={false}
          mail="huongnt256@fpt.com.vn"
          time="02/11/2021 15:43:02"
          id="35768"
          name="HuongNT256"
          content="Chào bạn Giang Huong Le ,
          Bạn vui lòng cho nhà thuốc xin thêm thông tin cụ thể về độ tuổi, liều lượng và thời gian bé sử dụng để tiện hỗ trợ hoặc bạn vui lòng liên hệ tổng đài miễn phí 18006928 để được hỗ trợ ạ.
          Thân mến!"
          img={<img src={img3} alt="" />}
          avt="H"
        />
        {comment && (
          <CommentCard
            type="agent"
            isParent={false}
            mail="hadt53@fpt.com.vn"
            time="02/11/2021 15:43:02"
            id="35768"
            name="HaDT"
            content={comment}
            img={<img src={img3} alt="" />}
            avt="H"
          />
        )}
        <CommentCard
          type="me"
          isParent={false}
          id="33945"
          name="HaDT"
          mail="hadt53@fpt.com.vn"
          avt="H"
          // content="Cháu nhà mình cũng thế"
        />
        <CommentCard
          type="customer"
          isLast
          isParent={false}
          time="02/11/2021 15:43:02"
          id="33945"
          name="Phan Thuỳ Linh"
          content="Cháu nhà mình cũng thế"
          avt={<img src={avt2} alt="" />}
          like={2}
          reply={0}
        />
      </div>
    </>
  );
}

export default CommentList;
