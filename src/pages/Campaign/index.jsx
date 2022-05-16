import React, { useState, useCallback } from 'react';
import PT from 'prop-types';
import { connect, formatMessage, FormattedMessage } from 'umi';
import { Row, Col, Typography, Card, Button, Select, Modal, message } from 'antd';
import styles from './styles.less';
// import UploadFile from './components/UploadFile';
import CreateNewDoc from './components/Step1';
import CreateMethodEnterFile from './components/Step2';
import UploadFile from './components/Step3';
import PreviewData from './components/Step4';

Campaign.propTypes = {
  dispatch: PT.func.isRequired,
  voicebot: PT.shape({
    isOpenForm: PT.bool,
  }).isRequired,
  location: PT.instanceOf(Object).isRequired,
  history: PT.instanceOf(Object).isRequired,
  user: PT.instanceOf(Object).isRequired,
};

function Campaign({ dispatch, voicebot: { isOpenForm }, user, location, history }) {
  const [step, setStep] = useState(1);
  const [valueForm, setValuesForm] = useState({});
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState({});
  const [dataFileExcel, setDataFileExcel] = useState([]);
  const [numRowToPreview, setNumRowToPreview] = useState(50);
  const [isOpenModal, setOpenModal] = useState(false);
  const { userId, authToken, tokenGateway } = user;
  const headers = {
    'X-Auth-Token': authToken,
    'X-User-Id': userId,
    Authorization: `Bearer ${tokenGateway}`,
  };

  const classTitle = useCallback(
    (title, stateStep) => (title <= stateStep ? 'title_active' : 'title_deactive'),
    [],
  );

  const onClickStep = useCallback(
    (stepChange) => {
      if (stepChange - step > 1) return false;
      return setStep(stepChange);
    },
    [step],
  );

  const getValues = useCallback(
    (values) => {
      if (step < 4) {
        onClickStep(step + 1);
      }
      setValuesForm({ ...valueForm, ...values });
    },
    [onClickStep, step, valueForm],
  );

  const handleSaveAll = useCallback((values) => {
    // console.log('submited ', values);
    message.success(`Lưu thành công`);
  }, []);

  const showModalCancel = (isOpen) => {
    setOpenModal(isOpen);
  };

  const confirmLoading = () => {
    setOpenModal(false);
    // setStep(1);
    history.push({
      pathname: 'config/standardized',
    });
  };
  
  const handleClickButton = useCallback(() => {
    history.push({
      pathname: 'config/standardized',
      state: {
        fileId: file.id,
        isCampaignManagement: location?.state?.isCampaignManagement,
        campaignID: location?.state?.campaignID,
      },
    });
  }, [file.id, history, location?.state?.isCampaignManagement, location?.state?.campaignID]);

  const footerForm = (
    <div
      className={`${styles['btn-group']} ${
        step > 1 ? styles['space-between'] : styles['flex-end']
      }`}
    >
      {step > 1 && (
        <div>
          <Button
            className={styles.btn}
            onClick={() => {
              if (step > 1) {
                onClickStep(step - 1);
              }
              if (location?.state?.isCampaignManagement) {
                history.push({
                  pathname: '/config/campaign-management-2',
                });
              }
            }}
          >
            {/* {useIntl().formatMessage({ id: "pages.campaign.back" })} */}
            <FormattedMessage id="pages.campaign.back" />
          </Button>
        </div>
      )}
      <div>
        <Button
          className={styles.btn}
          style={{ marginRight: 8 }}
          onClick={() => showModalCancel(true)}
        >
          {/* {useIntl().formatMessage({ id: "pages.campaign.cancel" })} */}
          <FormattedMessage id="pages.campaign.cancel" />
        </Button>
        {step === 4 ? (
          <Button
            className={styles.btn}
            type="primary"
            onClick={() => {
              handleSaveAll(valueForm);
              handleClickButton();
            }}
          >
            {/* {useIntl().formatMessage({ id: "pages.campaign.save" })} */}
            <FormattedMessage id="pages.campaign.save" />
          </Button>
        ) : (
          <Button className={styles.btn} type="primary" htmlType="submit">
            {/* {useIntl().formatMessage({ id: "pages.campaign.continue" })} */}
            <FormattedMessage id="pages.campaign.continue" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Card
      className={styles.card}
      title={
        <Typography.Title className={styles.title_active} level={3}>
          {/* {useIntl().formatMessage({ id: "pages.campaign.add.profile" })} */}
          <FormattedMessage id="pages.campaign.add.profile" />
        </Typography.Title>
      }
      bordered={false}
    >
      <Row className={styles.row}>
        <Col span={6} className={styles.col}>
          <Typography.Title
            className={styles[classTitle(1, step)]}
            // onClick={() => onClickStep(1)}
            level={4}
          >
            {/* {useIntl().formatMessage({ id: "pages.campaign.step1" })} */}
            <FormattedMessage id="pages.campaign.step1" />
          </Typography.Title>
          <Typography.Title
            className={styles[classTitle(2, step)]}
            // onClick={() => onClickStep(2)}
            level={4}
          >
            {/* {useIntl().formatMessage({ id: "pages.campaign.step2" })} */}
            <FormattedMessage id="pages.campaign.step2" />
          </Typography.Title>
          <Typography.Title
            className={styles[classTitle(3, step)]}
            // onClick={() => onClickStep(3)}
            level={4}
          >
            {/* {useIntl().formatMessage({ id: "pages.campaign.step3" })} */}
            <FormattedMessage id="pages.campaign.step3" />
          </Typography.Title>
          <Typography.Title
            className={styles[classTitle(4, step)]}
            // onClick={() => onClickStep(4)}
            level={4}
          >
            {/* {useIntl().formatMessage({ id: "pages.campaign.step4" })} */}
            <FormattedMessage id="pages.campaign.step4" />
          </Typography.Title>
        </Col>
        <Col span={18}>
          {step === 1 && (
            <CreateNewDoc getValues={getValues} valueForm={valueForm} user={user} headers={headers}>
              {footerForm}
            </CreateNewDoc>
          )}

          {step === 2 && (
            <CreateMethodEnterFile getValues={getValues} valueForm={valueForm}>
              {footerForm}
            </CreateMethodEnterFile>
          )}

          {step === 3 && (
            <UploadFile
              getValues={getValues}
              readFileExcel={setDataFileExcel}
              setFile={setFile}
              valueForm={valueForm}
              fileList={fileList}
              setFileList={setFileList}
              user={user}
            >
              {footerForm}
            </UploadFile>
          )}

          {step === 4 && (
            <PreviewData
              dataFileExcel={
                (dataFileExcel &&
                  dataFileExcel.length > 0 &&
                  dataFileExcel.slice(0, numRowToPreview)) ||
                []
              }
              file={file}
              history={history}
            >
              {/* SangTT9 comment preview row */}
              {/* <div className={styles.selectStep4}>
                <Typography.Title level={5} className={styles.span}>
                  Số hàng xem trước
                </Typography.Title>
                <Select
                  defaultValue={numRowToPreview}
                  onChange={(value) => setNumRowToPreview(value)}
                >
                  <Select.Option value={50}>50</Select.Option>
                  <Select.Option value={100}>100</Select.Option>
                  <Select.Option value={250}>250</Select.Option>
                  <Select.Option value={500}>500</Select.Option>
                  <Select.Option value={1000}>1000</Select.Option>
                </Select>
              </div> */}
              {footerForm}
            </PreviewData>
          )}
        </Col>
      </Row>

      <Modal visible={isOpenModal} onCancel={() => showModalCancel(false)} onOk={confirmLoading}>
        Bạn có chắc muốn huỷ không
      </Modal>
    </Card>
  );
}

export default connect(({ voicebot, user }) => ({ voicebot, user }))(Campaign);
