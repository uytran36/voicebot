import React, { useState, useCallback } from 'react';
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
} from 'antd';
import { LeftOutlined, CloudUploadOutlined } from '@ant-design/icons';
import autoCallIcon from '@/assets/autocall.svg';
import previewCallIcon from '@/assets/previewcall.svg';
import autoDialerIcon from '@/assets/autodialer.svg';
import check from '@/assets/check.png';
import api from '@/api';
import {
  requestCreateCampaign,
  requestGetListExcel,
  requestDownLoadFileError,
  requestSaveValidatedExcel,
  requestDownloadTemplateExcel,
} from '@/services/campaign-management';
import RenderProgress, { STATUS } from './result';
import styles from './styles.less';
import fileDownload from 'js-file-download';

AddCampaign.propTypes = {
  setClickAddCampaign: PT.func.isRequired,
  setClickContinue: PT.func.isRequired,
  dispatch: PT.func.isRequired,
  headers: PT.shape({
    Authorization: PT.string,
  }).isRequired,
};

const { Title } = Typography;
const { Option } = Select;
const { Meta } = Card;

function AddCampaign({ setClickAddCampaign, dispatch, setClickContinue, headers }) {
  const [nameCampaign, setNameCampaign] = useState('');
  const [typeData, setTypeData] = useState(1);
  const [typeCampaign, setTypeCampaign] = useState(1);
  const [infoFile, setInfoFile] = useState({});
  const [ws, setWs] = useState(null);
  const [fileName, setFileName] = useState('');
  const [listExcel, setListExcel] = useState([]);
  const [listApi, setListApi] = useState([]);
  const [statusFile, setStatusFile] = useState('');
  const [idUploaded, setIdUploaded] = useState('');

  useState(async () => {
    const dataExcel = {
      pagination_enable: false,
      pagination_current: 1,
      pagination_size: 3,
      data_type: 'excel',
    };

    const resExcel = await requestGetListExcel(headers, dataExcel);
    if (resExcel.success) {
      setListExcel(resExcel.data[0].data);
    }

    const dataAPI = {
      pagination_enable: false,
      pagination_current: 1,
      pagination_size: 3,
      data_type: 'api',
    };

    const resAPI = await requestGetListExcel(headers, dataAPI);
    if (resAPI.success) {
      setListApi(resAPI.data[0].data);
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
    [],
  );

  const handleDownLoadFileError = useCallback(
    (url) => async () => {
      const res = await requestDownLoadFileError(headers, url);
      fileDownload(res, 'error_file.xlsx');
    },
    [],
  );

  const handleDownloadTemplateExcel = async () => {
    const res = await requestDownloadTemplateExcel(headers);
    fileDownload(res, 'template.xlsx');
  };

  const onChangeRadio = (e) => {
    console.log('radio checked', e.target.value);
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
      name: nameCampaign,
      type: typeCampaign === 1 ? 'autoCall' : typeCampaign === 2 ? 'previewCall' : 'autoDialer',
      data_id: idUploaded,
    };
    if (typeData !== 2 || idUploaded !== '') {
      const res = await requestCreateCampaign(headers, data);
      if (res.success) {
        message.success('Create campaign successfully!');
        dispatch({
          type: 'campaign2/saveCampaignInfo',
          payload: res.data[0],
        });
        setClickContinue(true);
      } else {
        message.error('Cannot create campaign!');
      }
    }
    if (idUploaded === '' && typeData === 2) {
      message.error('Cannot create campaign, please check file!');
    }
  };

  return (
    <>
      <Row>
        <Col flex="50px" className={styles['col-header']}>
          <LeftOutlined onClick={() => setClickAddCampaign(false)} />
        </Col>
        <Col flex="auto">
          <Title level={3}>Thêm chiến dịch</Title>
        </Col>
      </Row>
      <div className={styles['header-title']}>
        <h3>
          <b>Tên chiến dịch</b>
        </h3>
        <Input className={styles['name-campaign']} onChange={onChangeName} />

        <h3 className={styles['campaign-title']}>
          <b>Loại chiến dịch</b>
        </h3>
        <Row>
          <Col>
            <Card
              onClick={() => setTypeCampaign(1)}
              className={typeCampaign === 1 ? styles['card-selected'] : styles['card-not-selected']}
            >
              <Row>
                <Col span={8}></Col>
                <Col span={8}>
                  <Image
                    width={80}
                    preview={false}
                    height={80}
                    alt="avatar call"
                    src={autoCallIcon}
                  />
                </Col>
                <Col span={8}>
                  {typeCampaign === 1 && (
                    <Meta
                      className={styles['meta-img-type']}
                      avatar={<Image src={check} width={20} height={20} preview={false} />}
                    />
                  )}
                </Col>
              </Row>
              <p>Chiến dịch Auto Call</p>
            </Card>
          </Col>
          <Col>
            <Card
              onClick={() => setTypeCampaign(2)}
              className={typeCampaign === 2 ? styles['card-selected'] : styles['card-not-selected']}
            >
              <Row>
                <Col span={8}></Col>
                <Col span={8}>
                  <Image
                    width={80}
                    preview={false}
                    height={80}
                    alt="avatar call"
                    src={previewCallIcon}
                  />
                </Col>
                <Col span={8}>
                  {typeCampaign === 2 && (
                    <Meta
                      className={styles['meta-img-type']}
                      avatar={<Image src={check} width={20} height={20} preview={false} />}
                    />
                  )}
                </Col>
              </Row>
              <p>Chiến dịch Preview Call</p>
            </Card>
          </Col>
          <Col>
            <Card
              onClick={() => setTypeCampaign(3)}
              className={typeCampaign === 3 ? styles['card-selected'] : styles['card-not-selected']}
            >
              <Row>
                <Col span={8}></Col>
                <Col span={8}>
                  <Image
                    width={80}
                    preview={false}
                    height={80}
                    alt="avatar call"
                    src={autoDialerIcon}
                  />
                </Col>
                <Col span={8}>
                  {typeCampaign === 3 && (
                    <Meta
                      className={styles['meta-img-type']}
                      avatar={<Image src={check} width={20} height={20} preview={false} />}
                    />
                  )}
                </Col>
              </Row>
              <p>Chiến dịch Auto Dialer</p>
            </Card>
          </Col>
        </Row>

        <h3 className={styles['campaign-title']}>
          <b>Dữ liệu gọi ra</b>
        </h3>
        <Radio.Group onChange={onChangeRadio} value={typeData}>
          <Space direction="vertical">
            <Radio value={1}>Get API</Radio>
            {typeData === 1 && (
              <Card>
                <Select className={styles['select-list-data']} onChange={handleChangeGetApi}>
                  {listApi.map((item) => (
                    <Option value={item.id}>{item.name}</Option>
                  ))}
                </Select>
              </Card>
            )}
            <Radio value={2}>Tải lên file excel</Radio>
            {typeData === 2 && (
              <Card>
                <Upload {...propUploads}>
                  <Button type="default" icon={<CloudUploadOutlined />}>
                    Upload danh sách khách hàng
                  </Button>
                </Upload>
                <p>
                  Bạn có thể tải về file dữ liệu mẫu với định dạng chuẩn{' '}
                  <a onClick={handleDownloadTemplateExcel}>Tại đây</a>
                </p>

                <Button
                  key="check"
                  type="primary"
                  onClick={validateFileUpload}
                  disabled={Object.keys(infoFile).length === 0 ? true : false}
                >
                  Kiểm tra dữ liệu
                </Button>
              </Card>
            )}
            <Radio value={3}>Chọn danh sách có sẵn</Radio>
            {typeData === 3 && (
              <Card>
                <Select className={styles['select-list-data']} onChange={handleChangeList}>
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
  );
}

export default AddCampaign;
