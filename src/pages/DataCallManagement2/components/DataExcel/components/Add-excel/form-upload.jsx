/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useCallback, useEffect } from 'react';
import PT from 'prop-types';
import debounce from 'lodash/debounce';
import { connect } from 'umi';
import { Form, Input, Upload, Button, message, Checkbox, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '@/api';
import {
  requestContactNormalizations,
  requestImportFile,
  CM_SERVICE,
} from '@/services/campaign-management';
import {
  requestSaveValidatedExcel
} from '@/services/datacall-management';
import fileDownload from 'js-file-download';


import {
  requestDownloadLink,
} from '@/services/datacall-management';

import styles from './styles.less';
import RenderProgress, { STATUS } from './result';

export const onGetContactNomalizations = async (headers, params = {}) => {
  try {
    const res = await requestContactNormalizations(headers, {
      filter: params,
    });
    if (Array.isArray(res) && res.length > 0) {
      return res;
    }
    throw new Error('ERROR~');
  } catch (err) {
    console.error(err);
    return [];
  }
};

RenderFormUpload.propTypes = {
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    // Authorization: PT.string,
    Authorization: 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJxZWQ5Z2RZSXlaVDY2WGplNDhOb3lTb1hncGZhWkNEX3RjX2V4Tmozb1pJIn0.eyJleHAiOjE2NDE5NTk0MTksImlhdCI6MTY0MTk1NTgxOSwianRpIjoiMDVmOTIyYjMtY2IzNC00NjFhLTg0ZjQtYTM3OGRkNGMwMmNhIiwiaXNzIjoiaHR0cHM6Ly8xNzIuMjcuMjI4LjIzODo4NDQzL2F1dGgvcmVhbG1zL0RldlZvaWNlQm90Q2FtcGFpZ24iLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiMjU1ODJhZmYtNTQ2Ni00ZTYzLWIzMzctMzQ0YTY3Mzk3ZThhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZmFzdGFwaS1iYWNrZW5kIiwic2Vzc2lvbl9zdGF0ZSI6ImU2NDRlYTQxLTM3MDUtNDk3YS04ZTE3LTQ5NzNjYTdhM2U5OCIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtZGV2dm9pY2Vib3RjYW1wYWlnbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6ImU2NDRlYTQxLTM3MDUtNDk3YS04ZTE3LTQ5NzNjYTdhM2U5OCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IkR1b25nIE5oYW4iLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJuaGFuZGQzIiwiZ2l2ZW5fbmFtZSI6IkR1b25nIiwiZmFtaWx5X25hbWUiOiJOaGFuIiwiZW1haWwiOiJuaGFuZGQzQGZwdC5jb20udm4ifQ.S0zKx7sG73zRYpIKvVgC2c7-P0gCFMPESaA7RM4SaHPcSN6f0fzc7AOX08aMSo9Ohb5FWZf4mGtoj_mEvhWXXkqH_gni8WYejcLZcHFaVtWLhqcfX76x9STjyktqXiacA1W1gAxO7eH3Qui3ClvXC_JZNj211IsGSksqFMF4Gd5Ji9Jr-9KEqj-I7tV7Jx7fSbey5P4WJWDsosUh7GXZp8mkELwkBpZfYfRAsrIT0-naHFqoTDPmv0EcvHqet9DHLlCC-e34DgLIRxTs4foHiTCBeM8Y15F_N5FTDFG8K5_J2-rNC2YW9TVmBfd_fOqpOhdGdqqrQ-hLkcP00_YUyg'
  }).isRequired,
  onCancel: PT.func,
  dispatch: PT.func.isRequired,
  goToDetail: PT.func.isRequired,
};

RenderFormUpload.defaultProps = {
  onPreviewData: () => { },
  onCancel: () => { },
};

function RenderFormUpload({ headers, onCancel, dispatch, goToDetail }) {
  const [error, setError] = useState({});
  const [fileName, setFileName] = useState('');
  const [ws, setWs] = useState(null);
  const [allowDownload, setAllowDownload] = useState(false);
  const [infoFile, setInfoFile] = useState({});

  const [statusFile, setStatusFile] = useState('');
  const [idUploaded, setIdUploaded] = useState('');

  const onCheckboxAllowDownload = (e) => {
    setAllowDownload(e.target.checked)
  }

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

  const handleDownLoadFileError = useCallback(
    (url) => async () => {
      const res = await requestDownloadLink(headers, url);
      fileDownload(res, 'error_file.xlsx');
    },
    [],
  );

  const handleImportFile = useCallback(
    (id, setSlideNumber, toggleException) => async () => {
      const res = await requestSaveValidatedExcel(headers, { call_data_id: id, download_enable: allowDownload });
      if (res.success) {
        toggleException();
        setSlideNumber(4);
      }
    },
    [],
  );

  const propUploads = {
    name: 'file',
    action: `${api.UMI_API_BASE_URL}/campaign/upload_excel_data`,
    accept:
      '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    headers,
    data: {
      name: fileName,
      download_enable: allowDownload,
    },
    process: {
      type: 'cirlce',
    },
    beforeUpload: (file) => {
      if (file.size > 10485760) {
        message.error(`File ${file.name} có dung lương lớn hơn 10Mb.`);
        return Upload.LIST_IGNORE;
      }
      if (fileName.length === 0) {
        message.warning('Hãy nhập tên file trước.');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: (info) => {
      setInfoFile(info);
    },
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
                    <div style={{ justifyContent: 'center' }} className={styles['button-group']}>
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
                    <div style={{ justifyContent: 'center' }} className={styles['button-group']}>
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

                // if (!file?.response?.success) {
                //   return (
                //     <div style={{ justifyContent: 'center' }} className={styles['button-group']}>
                //       <Button
                //         onClick={() => {
                //           handleChangeStateModal(false);
                //         }}
                //       >
                //         Đóng
                //       </Button>
                //       <Button type="primary">
                //         Tải file mẫu
                //       </Button>
                //     </div>
                //   );
                // }

                if (status === STATUS.IMPORT_SUCCESS) {
                  return (
                    <div style={{ justifyContent: 'center' }} className={styles['button-group']}>
                      <Button
                        onClick={() => {
                          handleChangeStateModal(false);
                          onCancel()
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
            // onCancel: () => handleChangeStateModal(false),
          },
        });
      }
      return file;
    });
    if (infoFile.file.status === 'error') {
      // hide()
      message.error('ERROR!');
      console.log('error load file', infoFile.file.status);
    }
  };


  const handleDownloadFileExample = async () => {
    const res = await requestDownloadLink(headers, `${api.UMI_API_BASE_URL}/campaign/download_excel_template`);
    fileDownload(res, 'template.xlsx');
  }

  const handleChangeFileName = debounce(async (e) => {
    const { value } = e.target;
    try {
      const res = await onGetContactNomalizations(headers, {
        where: { 'xlsContactObject.name': value },
      });
      if (res.length === 0) {
        setError({
          type: 'success',
        });
        setFileName(value);
        return null;
      }
      throw new Error('ERROR~');
    } catch (err) {
      setError({
        type: 'error',
        message: 'Tên chiến dịch đã tồn tại',
      });
      console.error(err);
      return null;
    }
  }, 500);

  React.useEffect(() => {
    const socket = new WebSocket(`wss://oncx-reportws.fptdata.com`);
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <Form
      labelCol={{ sm: { span: 6 }, md: { span: 4 } }}
      wrapperCol={{ sm: { span: 18 }, md: { span: 20 } }}
    >
      <Form.Item
        label="Tên file"
        help={error.message}
        validateStatus={error.type}
        rules={[
          {
            required: true,
            message: 'Required',
          },
        ]}
      >
        <Input allowClear onChange={handleChangeFileName} />
      </Form.Item>
      <Form.Item label="Chọn file">
        <Upload {...propUploads}>
          <Button
            type="default"
            icon={<UploadOutlined />}
          // disabled={fileName.length === 0 || error.type === 'error'}
          >
            Tải lên file Excel
          </Button>
        </Upload>
      </Form.Item>
      <Form.Item label="">
        <Checkbox onChange={onCheckboxAllowDownload}>Cho phép người khác tải về file dữ liệu</Checkbox>
      </Form.Item>
      <p>
        Bạn có thể tải về file dữ liệu mẫu với định dạng chuẩn{' '}
        <span onClick={handleDownloadFileExample} style={{ color: "blue" }}>
          Tại đây
        </span>
      </p>
      <Col span={14} offset={5}>
        <Button style={{ marginRight: 10 }} onClick={onCancel}>Huỷ</Button>
        <Button key="check"
          type="primary"
          onClick={validateFileUpload}
          disabled={(Object.keys(infoFile).length === 0)}
        >
          Kiểm tra dữ liệu
        </Button>
      </Col>
    </Form >
  );
}

export default connect()(RenderFormUpload);
