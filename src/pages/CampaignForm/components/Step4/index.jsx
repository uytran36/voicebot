import React from 'react';
import PT from 'prop-types';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import moment from 'moment';
import styles from './styles.less';

Step4.propTypes = {
  clickCampaignList: PT.func.isRequired,
  clickViewCampaign: PT.func.isRequired,
  createTimeCampaign:  PT.string.isRequired,
};

function Step4({ clickCampaignList, clickViewCampaign, createTimeCampaign }) {
  return (
    <Space size={30} direction="vertical" className={styles.bodyWrapper}>
      <div className={styles.iconSuccess}>
        <CheckOutlined />
      </div>
      <div className={styles.successMessage}>
        <Space direction="vertical">
          <span className={styles.text}>Chúc mừng bạn đã tạo chiến dịch thành công</span>
          <span className={styles.createdAt}>{`Thời gian tạo: ${moment(createTimeCampaign).format('DD/MM/YYYY, HH:mm') || ''}`}</span>
        </Space>
      </div>
      <div className={styles.buttonWrapper}>
        <Space>
          <Button onClick={clickCampaignList}>Danh sách chiến dịch</Button>
          <Button onClick={clickViewCampaign} style={{ background: '#127ace', color: '#fff' }}>
            Xem chiến dịch
          </Button>
        </Space>
      </div>
    </Space>
  );
}

export default Step4;
