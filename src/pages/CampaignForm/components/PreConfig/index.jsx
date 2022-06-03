import React, { useState, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import {
  Row,
  Col,
  Input,
  Typography,
  Card,
  Image,
  Radio,
  Select,
  Button,
  Space,
  Upload,
  message,
  Spin,
  Checkbox,
  InputNumber,
} from 'antd';
import { LeftOutlined, CloudUploadOutlined } from '@ant-design/icons';
import autoCallIcon from '@/assets/autocall.svg';
import previewCallIcon from '@/assets/previewcall.svg';
import autoDialerIcon from '@/assets/autodialer.svg';
import check from '@/assets/check.png';
import api from '@/api';
import {
  requestUpdateCampaign,
  requestCreateCampaign,
  requestGetListExcel,
  requestDownLoadFileError,
  requestSaveValidatedExcel,
  requestDownloadTemplateExcel,
  requestGetListAPI,
  requestCheckPayment,
} from '@/services/campaign-management';
import RenderProgress, { STATUS } from './result';
import styles from './styles.less';
import fileDownload from 'js-file-download';
import { history, connect } from 'umi';
import NoDataPermission from '@/components/NoDataPermission';
import { CAMPAIGN_MANAGEMENT, checkPermission, VoiceBot } from '@/utils/permission';
import axios from 'axios';

PreConfig.propTypes = {
  setPreConfig: PT.func.isRequired,

  dispatch: PT.func.isRequired,
  headers: PT.shape({
    Authorization: PT.string,
  }).isRequired,
};

const { Title } = Typography;
const { Option } = Select;
const { Meta } = Card;

function PreConfig({
  setPreConfig,
  dispatch,
  headers,
  dataCampaign,
  setDataCampaign,
  isEdit,
  setClickAddCampaign,
  preConfig,
  user: { currentUser },
}) {
  const [loading, setLoading] = useState(false);
  const [nameCampaign, setNameCampaign] = useState(dataCampaign?.name);
  const [typeData, setTypeData] = useState(
    dataCampaign?.data_type === 'api' ? 1 : dataCampaign?.data_type === 'excel' ? 3 : 2,
  );
  const [typeCampaign, setTypeCampaign] = useState(
    dataCampaign?.type === 'autoDialer' ? 3 : dataCampaign?.type === 'previewCall' ? 2 : 1,
  );
  const [infoFile, setInfoFile] = useState({});
  const [ws, setWs] = useState(null);
  const [fileName, setFileName] = useState('');
  const [listExcel, setListExcel] = useState([]);
  const [listApi, setListApi] = useState([]);
  const [statusFile, setStatusFile] = useState('');
  const [idUploaded, setIdUploaded] = useState(dataCampaign?.data_id);
  const [viewPreConfig, setViewPreConfig] = useState(false);
  const [isCheckPayment, setIsCheckPayment] = useState(
    dataCampaign?.check_payment?.state ? true : false,
  );
  const [listCheckPayment, setListCheckPayment] = useState([]);
  const [idCheckPayment, setIdCheckPayment] = useState(dataCampaign?.check_payment?.name || '');
  const [isCheckFetchNewDataAPI, setIsCheckFetchNewDataAPI] = useState(
    dataCampaign?.get_call_data_several_times ? true : false,
  );
  const [timeCallSeveral, setTimeCallSeveral] = useState(
    dataCampaign?.call_data_several_times?.several_times || 60,
  );

  useEffect(async () => {
    const dataExcel = {
      pagination_enable: false,
      pagination_current: 1,
      pagination_size: 3,
      data_type: 'excel',
    };

    if (typeData === 1) {
      const dataAPI = {
        limit: 10,
        offset: 1,
      };

      const resAPI = await requestGetListAPI(headers, dataAPI);
      if (resAPI?.success) {
        setListApi(resAPI.data);
      }

      const resCheckPayment = await requestCheckPayment(headers);
      if (resCheckPayment?.success) {
        setListCheckPayment(resCheckPayment.data);
      }
    }

    if (typeData === 3) {
      const resExcel = await requestGetListExcel(headers, dataExcel);
      if (resExcel.success) {
        setListExcel(resExcel.data[0].data);
      }
    }

    if (typeData !== 1) {
      setIsCheckPayment(false);
      setIdCheckPayment('');
    }
  }, [headers, typeData]);

  useEffect(() => {
    setNameCampaign(dataCampaign?.name);
    setTypeCampaign(
      dataCampaign?.type === 'autoDialer' ? 3 : dataCampaign?.type === 'previewCall' ? 2 : 1,
    );
    setTypeData(
      dataCampaign?.data_type === 'Rest API' ? 1 : dataCampaign?.data_type === 'excel' ? 3 : 2,
    );
    setIdUploaded(dataCampaign?.data_id);
    setIsCheckFetchNewDataAPI(dataCampaign?.call_data_several_times?.state ? true : false);
    setTimeCallSeveral(
      dataCampaign?.call_data_several_times?.several_times
        ? dataCampaign?.call_data_several_times?.several_times
        : 60,
    );
    setIsCheckPayment(dataCampaign?.check_payment?.state ? true : false);
    setIdCheckPayment(dataCampaign?.check_payment?.name);
  }, [dataCampaign, preConfig]);

  useEffect(() => {
    if (
      checkPermission(currentUser?.permissions, CAMPAIGN_MANAGEMENT.allAutoCallCampaign) ||
      checkPermission(currentUser?.permissions, CAMPAIGN_MANAGEMENT.allAudoDialerCampaign)
    ) {
      setViewPreConfig(true);
    }
  }, []);

  const onChangeName = (e) => {
    setNameCampaign(e.target.value);
  };
  const handleChangeElementModal = useCallback(
    (objElement) => {
      dispatch({
        type: 'modal/changeElement',
        payload: objElement,
      });
    },
    [dispatch],
  );

  const handleChangeStateModal = useCallback(
    (stateModal) => {
      dispatch({
        type: 'modal/showModal',
        payload: stateModal,
      });
    },
    [dispatch],
  );

  const handleImportFile = useCallback(
    (id, setSlideNumber, toggleException) => async () => {
      const res = await requestSaveValidatedExcel(headers, { call_data_id: id });
      if (res.success) {
        toggleException();
        setSlideNumber(4);
        setIdUploaded(id);
      }
    },
    [headers],
  );

  const handleDownLoadFileError = useCallback(
    (url) => async () => {
      const res = await axios({
        url,
        method: 'GET',
        headers,
        responseType: 'blob', // Important
      });
      fileDownload(res.data, 'error_file.xlsx');
    },
    [headers],
  );

  const handleDownloadTemplateExcel = async () => {
    const res = await axios({
      url: `${api.UMI_API_BASE_URL}/campaign/download_excel_template`,
      method: 'GET',
      headers,
      responseType: 'blob', // Important
    });
    fileDownload(res.data, 'template.xlsx');
  };

  const onChangeRadio = (e) => {
    setTypeData(e.target.value);
  };

  const handleChangeGetApi = (value) => {
    setIdUploaded(value);
  };

  const handleChangeList = (value) => {
    setIdUploaded(value);
  };

  const validateFileUpload = () => {
    let list = [...infoFile.fileList];
    list = list.slice(-1);
    list.forEach((file) => {
      if (file?.response) {
        if (file.response.success === true) {
          setStatusFile('success');
          setIdUploaded(file.response.data[0].id);
        } else {
          setStatusFile('error');
        }
        handleChangeElementModal({
          bodyStyle: { padding: '10px' },
          width: 600,
          content: (
            <RenderProgress
              ws={ws}
              typeStatus={
                file?.response?.error === '' && file?.response?.success === false
                  ? STATUS.VALIDATE_ERROR_FORMAT
                  : file?.response?.error.includes('existed')
                  ? STATUS.VALIDATE_DUPLICATE_NAME
                  : file?.response?.error.includes('length')
                  ? STATUS.VALIDATE_ERROR_TYPE
                  : STATUS.VALIDATING
              }
              exception={!file?.response?.success ? 'exception' : ''}
              defaultPercent={!file?.response?.success ? 100 : 0}
              onCancel={() => {
                handleChangeStateModal(false);
              }}
              statusFile={statusFile}
              err={file?.response?.error}
              detail={file?.response?.data[0]?.error_detail}
            >
              {(status, options) => {
                if (status === STATUS.VALIDATE_SUCCESS) {
                  return (
                    <div className={styles['button-group']}>
                      <Button
                        type="primary"
                        onClick={() => {
                          handleChangeStateModal(false);
                        }}
                      >
                        Import dữ liệu
                      </Button>
                    </div>
                  );
                }

                if (status === STATUS.VALIDATE_ERROR_FORMAT) {
                  return (
                    <div className={styles['button-group']}>
                      <Button
                        onClick={() => {
                          handleChangeStateModal(false);
                        }}
                      >
                        Huỷ
                      </Button>
                      <Button onClick={handleDownLoadFileError(options?.url)}>
                        Tải về file nhận diện lỗi
                      </Button>
                      <Button
                        type="primary"
                        onClick={handleImportFile(
                          file?.response?.data[0]?.id,
                          options.setSlideNumber,
                          options.toggleException,
                        )}
                      >
                        Chỉ import dữ liệu hợp lệ
                      </Button>
                    </div>
                  );
                }
                if (status === STATUS.IMPORT_SUCCESS) {
                  return (
                    <div className={styles['button-group']}>
                      <Button
                        onClick={() => {
                          handleChangeStateModal(false);
                        }}
                      >
                        Trở về
                      </Button>
                    </div>
                  );
                }
                return '';
              }}
            </RenderProgress>
          ),
          footer: {
            centered: true,
            footer: null,
          },
        });
      }
      return file;
    });
    if (infoFile.file.status === 'error') {
      message.error('ERROR!');
      console.log('error load file', infoFile.file.status);
    }
  };

  const propUploads = {
    name: 'file',
    action: `${api.UMI_API_BASE_URL}/campaign/upload_excel_data`,
    accept:
      '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    headers,
    data: {
      name: fileName,
      download_enable: true,
    },
    process: {
      type: 'cirlce',
    },
    beforeUpload: (file) => {
      setFileName(file.name);
      if (file.size > 10485760) {
        message.error(`File ${file.name} có dung lương lớn hơn 10Mb.`);
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: (info) => {
      setInfoFile(info);
    },
  };

  const onClickContinue = async () => {
    const data = {
      campaign_id: dataCampaign.campaign_id,
      name: nameCampaign,
      type: typeCampaign === 1 ? 'autoCall' : typeCampaign === 2 ? 'previewCall' : 'autoDialer',
      data_id: idUploaded,
      data_type: typeData === 1 ? 'api' : 'excel',
      call_data_several_times: {
        state: isCheckFetchNewDataAPI ? true : false,
        several_times: isCheckFetchNewDataAPI ? timeCallSeveral : 60,
      },
      check_payment: {
        state: isCheckPayment,
        name: isCheckPayment ? listCheckPayment.filter((item) => item === idCheckPayment)[0] : '',
      },
    };

    if (typeData !== 2 || idUploaded !== '') {
      if (isEdit || dataCampaign.campaign_id !== undefined) {
        setLoading(true);
        const res = await requestUpdateCampaign(headers, data);
        if (res?.success) {
          setLoading(false);
          message.success('Update campaign successfully!');
          dispatch({
            type: 'campaign2/saveCampaignInfo',
            payload: res.data[0],
          });
          setPreConfig(false);
        } else {
          setLoading(false);
          // message.error(`Cannot update campaign! ${res?.error}`);
        }
      } else {
        setLoading(true);
        const res = await requestCreateCampaign(headers, data);

        if (res?.success) {
          setLoading(false);
          message.success('Create campaign successfully!');
          setDataCampaign(res?.data[0]);
          setPreConfig(false);
        } else {
          setLoading(false);
          // message.error(`Cannot create campaign! ${res?.error}`);
        }
      }
    }
    if (idUploaded === '' && typeData === 2) {
      message.error('Error, please check file!');
    }
  };

  const onClickBack = () => {
    if (isEdit) {
      history.goBack();
    } else {
      setClickAddCampaign(false);
    }
  };

  const onClickFetchNewDataAPI = (e) => {
    setIsCheckFetchNewDataAPI(e.target.checked);
  };

  const onClickCheckPayment = (e) => {
    setIsCheckPayment(e.target.checked);
  };

  const handleChangeCheckPayment = (value) => {
    setIdCheckPayment(value);
  };

  const onChangeNumber = (value) => {
    setTimeCallSeveral(value);
  };
  return (
    <Spin tip="Vui lòng chờ" spinning={loading}>
      {viewPreConfig ? (
        <>
          <Row>
            <Col flex="30px" className={styles['col-header']}>
              <LeftOutlined onClick={onClickBack} />
            </Col>
            <Col flex="auto">
              <Title level={3}>{isEdit ? 'Sửa' : 'Tạo'} chiến dịch</Title>
            </Col>
          </Row>
          <div className={styles['header-title']}>
            <h3>
              <b>Tên chiến dịch</b>
            </h3>
            <Input
              className={styles['name-campaign']}
              onChange={onChangeName}
              value={nameCampaign}
            />

            <h3 className={styles['campaign-title']}>
              <b>Loại chiến dịch</b>
            </h3>
            <Row>
              <Col>
                <div
                  onClick={() => setTypeCampaign(1)}
                  className={
                    typeCampaign === 1 ? styles['card-selected'] : styles['card-not-selected']
                  }
                >
                  <Row>
                    <Col span={8}></Col>
                    <Col span={8}></Col>
                    <Col span={8}>
                      <Meta
                        className={styles['meta-img-type']}
                        avatar={
                          <Image
                            src={check}
                            width={20}
                            height={20}
                            preview={false}
                            style={typeCampaign !== 1 && { display: 'none' }}
                          />
                        }
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8}></Col>
                    <Col span={8}>
                      <Image
                        preview={false}
                        alt="avatar call"
                        className={styles['img-campaign']}
                        src={autoCallIcon}
                      />
                    </Col>
                    <Col span={8}></Col>
                  </Row>
                  <p>Chiến dịch Auto Call</p>
                </div>
              </Col>
              {(api.ENV === 'local' || api.ENV === 'dev') && (
                <>
                  <Col>
                    <div
                      onClick={() => setTypeCampaign(2)}
                      className={
                        typeCampaign === 2 ? styles['card-selected'] : styles['card-not-selected']
                      }
                    >
                      <Row>
                        <Col span={8}></Col>
                        <Col span={8}></Col>
                        <Col span={8}>
                          <Meta
                            className={styles['meta-img-type']}
                            avatar={
                              <Image
                                src={check}
                                width={20}
                                height={20}
                                preview={false}
                                style={typeCampaign !== 2 && { display: 'none' }}
                              />
                            }
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}></Col>
                        <Col span={8}>
                          <Image
                            preview={false}
                            alt="avatar call"
                            className={styles['img-campaign']}
                            src={previewCallIcon}
                          />
                        </Col>
                        <Col span={8}></Col>
                      </Row>
                      <p>Chiến dịch Preview Call</p>
                    </div>
                  </Col>
                  <Col>
                    <div
                      onClick={() => setTypeCampaign(3)}
                      className={
                        typeCampaign === 3 ? styles['card-selected'] : styles['card-not-selected']
                      }
                    >
                      <Row>
                        <Col span={8}></Col>
                        <Col span={8}></Col>
                        <Col span={8}>
                          <Meta
                            className={styles['meta-img-type']}
                            avatar={
                              <Image
                                src={check}
                                width={20}
                                height={20}
                                preview={false}
                                style={typeCampaign !== 3 && { display: 'none' }}
                              />
                            }
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col span={8}></Col>
                        <Col span={8}>
                          <Image
                            preview={false}
                            alt="avatar call"
                            className={styles['img-campaign']}
                            src={autoDialerIcon}
                          />
                        </Col>
                        <Col span={8}></Col>
                      </Row>
                      <p>Chiến dịch Auto Dialer</p>
                    </div>
                  </Col>
                </>
              )}
            </Row>

            <h3 className={styles['campaign-title']}>
              <b>Dữ liệu gọi ra</b>
            </h3>
            <Radio.Group onChange={onChangeRadio} value={typeData}>
              <Space direction="vertical">
                <Radio value={1}>Get API</Radio>
                {typeData === 1 && (
                  <Card className={styles['get-api-wrapper']}>
                    <Select
                      className={styles['select-list-data']}
                      value={listApi.map((item) => item?.id).includes(idUploaded) ? idUploaded : ''}
                      onChange={handleChangeGetApi}
                    >
                      {listApi.map((item) => (
                        <Option value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                    <Row>
                      <Col span={10}>
                        <Checkbox
                          onChange={onClickFetchNewDataAPI}
                          checked={isCheckFetchNewDataAPI}
                        >
                          Tự động request dữ liệu mới
                        </Checkbox>
                      </Col>
                      <Col span={14}>
                        <InputNumber
                          disabled={!isCheckFetchNewDataAPI}
                          value={timeCallSeveral}
                          min="0.1"
                          step="0.1"
                          onChange={onChangeNumber}
                          stringMode
                          style={{ marginRight: 8 }}
                        />
                        phút
                      </Col>
                    </Row>
                    <Row>
                      <Col span={10}>
                        <Checkbox onChange={onClickCheckPayment} checked={isCheckPayment}>
                          Check payment
                        </Checkbox>
                      </Col>
                      {isCheckPayment && (
                        <Col span={14}>
                          <Select
                            style={{ width: '20vw' }}
                            onChange={handleChangeCheckPayment}
                            value={listCheckPayment.includes(idCheckPayment) ? idCheckPayment : ''}
                          >
                            {listCheckPayment.map((item) => (
                              <Option value={item}>{item}</Option>
                            ))}
                          </Select>
                        </Col>
                      )}
                    </Row>
                  </Card>
                )}
                <Radio value={2}>Tải lên file excel</Radio>
                {typeData === 2 && (
                  <div className={styles['upload-file']}>
                    <Upload {...propUploads}>
                      <Button type="default" icon={<CloudUploadOutlined />}>
                        Upload danh sách khách hàng
                      </Button>
                    </Upload>
                    <div className={styles['text']}>
                      Bạn có thể tải về file dữ liệu mẫu với định dạng chuẩn{' '}
                      <a onClick={handleDownloadTemplateExcel}>Tại đây</a>
                    </div>

                    <Button
                      key="check"
                      type="primary"
                      onClick={validateFileUpload}
                      disabled={Object.keys(infoFile).length === 0 ? true : false}
                    >
                      Kiểm tra dữ liệu
                    </Button>
                  </div>
                )}
                <Radio value={3}>Chọn danh sách có sẵn</Radio>
                {typeData === 3 && (
                  <Card>
                    <Select
                      className={styles['select-list-data-excel']}
                      value={
                        listExcel.map((item) => item?.id).includes(idUploaded) ? idUploaded : ''
                      }
                      onChange={handleChangeList}
                    >
                      {listExcel.map((item) => (
                        <Option value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  </Card>
                )}
              </Space>
            </Radio.Group>
          </div>
          <Button type="primary" className={styles['btn-continue']} onClick={onClickContinue}>
            Tiếp tục
          </Button>
        </>
      ) : (
        <NoDataPermission />
      )}
    </Spin>
  );
}

export default connect(({ campaign2, user }) => ({
  campaign2,
  user,
}))(PreConfig);
