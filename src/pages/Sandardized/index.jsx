import React, { useState, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import { connect, FormattedMessage } from 'umi';
import { LeftOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Card, Typography, Col, Row, Button, message, Upload } from 'antd';
import Table from './Components/Table';
import RawTable from './Components/RawTable';
import NormalizationsTable from './Components/NormalizationsTable';
import styles from './styles.less';
import api from '@/api';
import { checkPermission, VoiceBot } from '@/utils/permission';

Sandardized.propTypes = {
  // dispatch: PT.func.isRequired,
  // user: PT.shape({
  //   authToken: PT.string,
  //   userId: PT.string,
  // }).isRequired,
  user: PT.shape({
    currentUser: PT.instanceOf(Object).isRequired
  }).isRequired,
  settings: PT.shape({
    primaryColor: PT.string,
  }).isRequired,
  history: PT.instanceOf(Object).isRequired,
  location: PT.instanceOf(Object).isRequired,
};

function Sandardized({
  // dispatch,
  user,
  history,
  location,
  settings: { primaryColor },
}) {
  const [showDetail, setShowDetail] = useState(false);
  const [showRawTable, toggleRawTable] = useState(true);
  const [dataRowOfRawTable, setDataRowOfRawTable] = useState({});
  const [type, setType] = useState(null);
  const [action, setAction] = useState('');

  const handleOnClickToShowDetail = useCallback((record, _action = '') => {
    setShowDetail(true);
    setDataRowOfRawTable(record);
    setAction(_action);
  }, []);

  const handleRedirectToManagementCampaign = useCallback(() => {
    if (location?.state?.fileId && location?.state?.isCampaignManagement) {
      if (location.state?.campaignID) {
        history.push({
          // pathname: '/campaign-management',
          pathname: `/config/campaign-management-2/${location.state.campaignID}`,
          state: { fileId: location.state.fileId, campaignID: location.state.campaignID },
        });
        return null;
      }
      history.push({
        // pathname: '/campaign-management',
        pathname: '/config/campaign-management-2',
        state: { fileId: location.state.fileId },
      });
      return null;
    }
    setShowDetail(false);
    toggleRawTable(false);
    return null;
  }, [history, location]);

  useEffect(() => {
    if (location?.state?.fileId) {
      setDataRowOfRawTable({ id: location.state.fileId });
      setShowDetail(true);
      setAction('edit');
    }
  }, [location]);

  const propUpload2 = {
    name: 'file',
    action: `${api.CM_SERVICE}/api/v1/import-files-excel-dnc`,
    accept:
      '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    headers: {
      'X-Auth-Token': user.authToken,
      'X-User-Id': user.userId,
      authorization: `Bearer ${localStorage.getItem('tokenGateway') || ''}`,
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`, 5);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => {
        console.log(percent);
      },
    },
  };

  return (
    <Card>
      {!showDetail && (
        <Row>
          <Col span={24}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className={`${styles.wrapHeader} ${styles.tab}`}>
                <Button
                  type={showRawTable ? 'primary' : 'default'}
                  // className={`${styles.title} ${ ? styles.active : styles.unactive}`}
                  onClick={() => toggleRawTable(true)}
                >
                  Dữ liệu thô
                </Button>
                <Button
                  type={!showRawTable ? 'primary' : 'default'}
                  // className={`${styles.title} ${!showRawTable ? styles.active : styles.unactive}`}
                  onClick={() => toggleRawTable(false)}
                >
                  Dữ liệu chuẩn hóa
                </Button>
              </div>
              <div className={`${styles.tab}`}>
                <Upload {...propUpload2} className={styles.upload}>
                  <Button icon={<UploadOutlined />} danger hidden={checkPermission(user?.currentUser.permissions, VoiceBot.configVoicebot)}>
                    <span>
                      <FormattedMessage id="pages.campaign.file.choose.dnc" />
                    </span>
                  </Button>
                </Upload>
                <Button
                  type="primary"
                  onClick={() => {
                    history.push({
                      pathname: '/campaign',
                    });
                  }}
                  icon={<PlusOutlined />}
                >
                  Thêm dữ liệu gọi
                </Button>
              </div>
            </div>
          </Col>
          <Col span={24}>
            {showRawTable ? (
              <RawTable handleOnClickToShowDetail={handleOnClickToShowDetail} setType={setType} history={history} />
            ) : (
              <NormalizationsTable
                handleOnClickToShowDetail={handleOnClickToShowDetail}
                setType={setType}
                history={history}
              />
            )}
          </Col>
        </Row>
      )}
      {showDetail && (
        <Row gutter={[16, 8]} className={styles['fade-in']}>
          <Col span={24}>
            <div className={styles.wrapHeader}>
              <span className={styles['back-btn']} onClick={() => setShowDetail(false)}>
                <LeftOutlined /> Quay lại
              </span>
              <Typography.Title className={styles.title} level={3}>
                Chuẩn hoá dữ liệu
              </Typography.Title>
              <div>
                <Typography.Text className={styles.subTitle}>
                  Để chuẩn hoá dữ liệu, bạn sử dụng chuột di chuyển trường dữ liệu từ &#34;Bảng dữ
                  liệu thô&#34; sang cột tương ứng ở &#34;Bảng dữ liệu chuẩn&#34;
                </Typography.Text>
                <br />
                <Typography.Text className={styles.subTitle}>
                  * Trường &#34;Số điện thoại&#34; là bắt buộc
                </Typography.Text>
              </div>
            </div>
          </Col>
          <Col span={24}>
            <Table
              setShowDetail={setShowDetail}
              idContactBase={dataRowOfRawTable.id}
              handleRedirectToManagementCampaign={handleRedirectToManagementCampaign}
              type={type}
              action={action}
            />
          </Col>
        </Row>
      )}
    </Card>
  );
}

export default connect(({ user, settings }) => ({ user, settings }))(Sandardized);
