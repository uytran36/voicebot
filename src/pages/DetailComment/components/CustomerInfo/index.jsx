import React, { useState } from 'react';
import { Timeline, Input } from 'antd';
import { EditOutlined, MailOutlined } from '@ant-design/icons';
import { FaFacebookSquare, FaMapMarkerAlt, FaPhone, FaUserAlt } from 'react-icons/fa';
import styles from './style.less';

function CustomerInfo(props) {
  const [isEdit, setIsEdit] = useState(false);
  return (
    <>
      <div className={styles.customerInfo_title}>
        Thông tin khách hàng{' '}
        <EditOutlined onClick={() => setIsEdit(!isEdit)} style={{ color: '#127ace' }} />
      </div>
      <div className={styles.customerList}>
        <div className={styles.customerInfoWrapper}>
          <div className={styles.iconWrapper}>
            <FaUserAlt />
          </div>
          <div className={styles.customerFieldWrapper}>
            <div className={styles.customerField}>Họ và tên</div>
            {isEdit ? (
              <Input className={styles.input} defaultValue="Giang Huong Le" />
            ) : (
              <div className={styles.customerItem}>Giang Huong Le</div>
            )}
          </div>
        </div>
        <div className={styles.customerInfoWrapper}>
          <div className={styles.iconWrapper}>
            <FaPhone />
          </div>
          <div className={styles.customerFieldWrapper}>
            <div className={styles.customerField}>Số điện thoại</div>
            {isEdit ? (
              <Input className={styles.input} defaultValue="0960123456" />
            ) : (
              <div className={styles.customerItem}>0960123456</div>
            )}
          </div>
        </div>
        <div className={styles.customerInfoWrapper}>
          <div className={styles.iconWrapper}>
            <MailOutlined />
          </div>
          <div className={styles.customerFieldWrapper}>
            <div className={styles.customerField}>Email</div>
            {isEdit ? (
              <Input className={styles.input} defaultValue="huonggiang@gmail.com" />
            ) : (
              <div className={styles.customerItem}>huonggiang@gmail.com</div>
            )}
          </div>
        </div>
        <div className={styles.customerInfoWrapper}>
          <div className={styles.iconWrapper}>
            <FaFacebookSquare />
          </div>
          <div className={styles.customerFieldWrapper}>
            <div className={styles.customerField}>Facebook</div>
            {isEdit ? (
              <Input className={styles.input} defaultValue="Facebook.com/huonggiang" />
            ) : (
              <div className={styles.customerItem}>Facebook.com/huonggiang</div>
            )}
          </div>
        </div>
        <div className={styles.customerInfoWrapper}>
          <div className={styles.iconWrapper}>
            <FaFacebookSquare />
          </div>
          <div className={styles.customerFieldWrapper}>
            <div className={styles.customerField}>Zalo</div>
            {isEdit ? (
              <Input className={styles.input} defaultValue="0960123456" />
            ) : (
              <div className={styles.customerItem}>Giang Huong Le</div>
            )}
          </div>
        </div>
        <div className={styles.customerInfoWrapper}>
          <div className={styles.iconWrapper}>
            <FaMapMarkerAlt />
          </div>
          <div className={styles.customerFieldWrapper}>
            <div className={styles.customerField}>Địa chỉ</div>
            {isEdit ? (
              <Input className={styles.input} defaultValue="17 Duy Tân, Cầu Giấy, Hà Nội" />
            ) : (
              <div className={styles.customerItem}>17 Duy Tân, Cầu Giấy, Hà Nội</div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.noteWrapper}>
        <div className={styles.noteTitle}>Ghi chú</div>
        <div className={styles.note}>Khách hàng chưa thanh toán tiền mạng</div>
      </div>
      <div className={styles.interactionHistory}>
        <div className={styles.interactionHistoryTitle}>Lịch sử tương tác</div>
        <div className={styles.interactionHistoryList}>
          <Timeline>
            <Timeline.Item>
              <div className={styles.timelineText}>
                <div className={styles.bold}>30/04/2021 08:22</div>
                <div>
                  <span className={styles.black}>Bình luận - </span>
                  <span className={styles.bold}>Website</span>
                </div>
                <div className={styles.gray}>
                  Sao mà mình cho cháu uống mà cháu đều kêu mệt sau mỗi lần uống
                </div>
              </div>
            </Timeline.Item>
            <Timeline.Item>
              <div className={styles.timelineText}>
                <div className={styles.bold}>30/04/2021 08:20</div>
                <div>
                  <span className={styles.black}>Cuộc gọi đến - </span>
                  <span className={styles.bold}>HuongNT256</span>
                </div>
                <div className={styles.gray}>
                  Lorem ipsum dolor sit amet, consecte adipiscing elit.
                </div>
              </div>
            </Timeline.Item>
          </Timeline>
        </div>
      </div>
    </>
  );
}

export default CustomerInfo;
