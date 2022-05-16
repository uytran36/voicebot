import React, { useState, useEffect } from 'react';
import PT from 'prop-types';
import {
  Row,
  Col,
  Typography,
  Button,
  Form,
  Space,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Upload,
  Rate,
  Checkbox,
  Input,
  ConfigProvider,
  //Avatar,
  message,
  Image,
  Popover,
  Modal,
} from 'antd';
import { FormattedMessage } from 'umi';
import { UploadOutlined } from '@ant-design/icons';
import styles from './styles.less';
import api from '@/api';

Avatar.propTypes = {
  avatarUrl: PT.string,
  status: PT.string,
};

Avatar.defaultProps = {
  status: 'offline',
  avatarUrl: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
};

export default function Avatar({
  avatarUrl,
  status,
  isEdit,
  previewImage,
  setPreViewImage,
  isShowButtons,
  setIsShowButtons,
}) {
  const endpoint = api.UMI_API_BASE_URL;

  const handleUpload = ({ fileList }) => {
    setPreViewImage(fileList[0].originFileObj);
    if (!isShowButtons) setIsShowButtons(true);
  };

  if (previewImage) previewImage = URL.createObjectURL(previewImage);
  const showImage = isEdit ? previewImage || `${endpoint}${avatarUrl}` : `${endpoint}${avatarUrl}`;

  return (
    <div className={`${styles['avatar-hoder']}`}>
      <div className={styles[`status-img-${status}`]}>
        <img src={showImage} />
      </div>

      {isEdit && (
        <Upload
          onChange={handleUpload}
          beforeUpload={() => false}
          multiple={false}
          maxCount={1}
          name="file"
          fileList={[]}
        >
          <Button icon={<UploadOutlined />}>
            <Typography.Text>
              <FormattedMessage
                defaultMessage="Username"
                id="pages.account.profile.change-avatar"
              />
            </Typography.Text>
          </Button>
        </Upload>
      )}
    </div>
  );
}
