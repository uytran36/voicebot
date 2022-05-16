import { Switch, Modal } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import './style.less';

const FaceBookPageItem = (props) => {
  const { name, lastModify, imageURL, active, id, activePage, accessToken, subcribePage } = props;
  const [activeSwitch, setActiveSwitch] = useState(active)

  const toggleModal = (e, id) => {
    Modal.confirm({
      title: 'Ngừng kích hoạt trang này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn sẽ không nhận được tin nhắn được gửi đến trang này',
      onOk() {
        activePage(e, id)
      },
      onCancel() {
        setActiveSwitch(true)
      },
      okText: "Ngừng kích hoạt",
      cancelText: "Huỷ",
    });
  }

  const onChangeSwitch = (e, id) => {
    setActiveSwitch(!activeSwitch)
    if (!e) {
      return toggleModal(e, id)
    }
    return subcribePage(id, accessToken, name, imageURL)
  }

  return (
    <div className="facebookItemContainer">
      <div className="contentWrapper">
        <div className="image">
          <img src={imageURL} alt="" />
        </div>
        <div className="content">
          <div className="title">{name}</div>
          <div className="moreInfo">
            Ngày sửa gần nhất: {moment(lastModify).format('DD/MM/YYYY')}
          </div>
        </div>
      </div>
      <div className="action">
        <Switch onClick={(e) => onChangeSwitch(e, id)} checked={activeSwitch} />
      </div>
    </div>
  );
};

export default FaceBookPageItem;
