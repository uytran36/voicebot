/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useCallback, useMemo } from 'react';
import PT from 'prop-types';
import { Button, Upload, Row, Col, message, Typography, Space } from 'antd';
import { UploadOutlined, FileTextOutlined, DeleteOutlined, LeftOutlined } from '@ant-design/icons';
import api from '@/api';
import { connect } from 'umi';
import { ImportFail, ImportSuccess } from './import-message';
import styles from './styles.less';
import { requestImportCustomer } from '@/services/crm';
import { ModalUpdateContext } from '@/contexts/modal.context';

ImportCustomer.propTypes = {
  dispatch: PT.func.isRequired,
  onToggleBack: PT.func.isRequired,
  userId: PT.string.isRequired,
  authToken: PT.string.isRequired,
  tokenGateway: PT.string.isRequired,
  wsId: PT.string.isRequired,
};

function ImportCustomer({ dispatch, onToggleBack, userId, authToken, tokenGateway, wsId }) {
  const setStateModal = React.useContext(ModalUpdateContext);

  // const [fileCustomer, setFileCustomer] = useState([]);
  const [fileRecord, setFileRecord] = useState([]);

  const headers = useMemo(
    () => ({
      'X-Auth-Token': authToken,
      'X-User-Id': userId,
      Authorization: `${tokenGateway}`,
    }),
    [authToken, tokenGateway, userId],
  );

  /**
   * isRepace
   * 1: replace
   * 2: chi lay record dung
   * 0: trả lỗi
   */
  const handleAcceptReplaceFile = useCallback(
    (fileReplace, subId, action = 0) => async () => {
      const hide = message.loading('Đang đã xử, vui lòng đợi');
      const formData = new FormData();
      formData.append('subId ', subId);
      formData.append('file', fileReplace);
      formData.append('isReplace', action);

      try {
        const res = await requestImportCustomer(formData, headers);
        if (res.status) {
          setStateModal(false, {});
          hide();
          message.success('Đã xử lý thành công.');
          return null;
        }
        throw new Error('ERROR~');
      } catch (err) {
        hide();
        message.warning('Xử lý thất bại.');
        console.error(err);
        return null;
      }
    },
    [setStateModal, headers],
  );

  const upload = {
    name: 'file',
    action: `${api.CRM_SERVICE}/customer/import`,
    accept:
      '.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    headers,
    data: {
      subId: wsId,
      isReplace: 0,
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => `${parseFloat(percent.toFixed(2))}%`,
    },
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <DeleteOutlined onClick={() => console.log('deleted')} />,
    },
    onChange: (info) => {
      if (info.file.status === 'error') {
        console.log('error load file', info.file.status);
        return null;
      }
      let fileList = [...info.fileList];
      fileList = fileList.slice(-1);
      setFileRecord(fileList);
      if (info.file.status === 'done' && info.file.response) {
        const { status, msg, detail, case: caseResponse, url } = info.file.response;
        if (status) {
          setStateModal(true, {
            bodyStyle: { padding: '10px' },
            width: 500,
            title: false,
            content: (
              <ImportSuccess
                title="Import dữ liệu thành công"
                subTitle=""
                handleChangeStateModal={setStateModal}
                setFileRecord={setFileRecord}
                onToggleBack={onToggleBack}
              />
            ),
            centered: true,
            footer: null,
            onCancel: () => {
              setStateModal(false, {});
              setFileRecord([]);
            },
          });
        } else if (caseResponse === 2) {
          /**
           * caseResponse
           * 1: thanh cong
           * 2: import loi
           * 3: import trung
           */
          setStateModal(true, {
            bodyStyle: { padding: '10px' },
            width: 900,
            title: false,
            content: (
              <ImportFail
                title="Import dữ liệu không thành công"
                // subTitle={`

                // File bạn vừa tải lên có thể gặp 1 số vấn đề sau
                //   Sai định dạng: Sai thông tin các trường header
                //   Thiếu thông tin bắt buộc: Trường dữ liệu "Tên khách hàng" và/hoặc "Số điện thoại 1" bị bỏ trống
                // `}
                subTitle={
                  <div style={{ textAlign: 'left' }}>
                    <ul>
                      <li>
                        <p style={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.85)' }}>
                          File bạn vừa tải lên có thể gặp 1 số vấn đề sau:
                        </p>
                      </li>
                      <li>
                        <p>
                          Sai định dạng:{' '}
                          <span style={{ color: 'red' }}>Sai thông tin các trường header</span>
                        </p>
                      </li>
                      <li>
                        <p>
                          Thiếu thông tin bắt buộc:{' '}
                          <span style={{ color: 'red' }}>
                            Trường dữ liệu &quot;Tên khách hàng&quot; và/hoặc &quot;Số điện thoại
                            1&quot; bị bỏ trống
                          </span>
                        </p>
                      </li>
                    </ul>
                  </div>
                }
                extra={
                  <Space>
                    <Button
                      onClick={() => {
                        setStateModal(false, {});
                        setFileRecord([]);
                      }}
                    >
                      Huỷ
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => window.open(`${api.UMI_API_BASE_URL}/api/files/${url}`).focus()}
                    >
                      Tải về file nhận diện lỗi
                    </Button>
                  </Space>
                }
              />
            ),
            centered: true,
            footer: null,
            onCancel: () => {
              setStateModal(false, {});
              setFileRecord([]);
            },
          });
        } else {
          setStateModal(true, {
            bodyStyle: { padding: '10px' },
            width: 900,
            title: false,
            centered: true,
            footer: null,
            content: (
              <ImportFail
                title=""
                status="warning"
                subTitle={`${detail.length} dữ liệu trùng với dữ liệu trên hệ thống`}
                extra={
                  <Space>
                    <Button onClick={handleAcceptReplaceFile(info.file.originFileObj, wsId, 2)}>
                      Chỉ import dữ liệu không trùng
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleAcceptReplaceFile(info.file.originFileObj, wsId, 1)}
                    >
                      Replace
                    </Button>
                  </Space>
                }
              />
            ),
            onCancel: () => {
              setStateModal(false, {});
              setFileRecord([]);
            }
          });
        }
      }
      return null;
    },
  };

  return (
    <>
      <Typography.Title level={3} onClick={() => onToggleBack(false)} style={{ cursor: 'pointer' }}>
        <LeftOutlined />
        Import khách hàng
      </Typography.Title>
      <Row justify="center" align="middle" style={{ marginTop: '66px' }}>
        <Col>
          <div className={styles['upload-container']}>
            <span>Tải lên file Excel</span>
            <Upload {...upload} iconRender={() => <FileTextOutlined />} fileList={fileRecord}>
              <Button type="default" icon={<UploadOutlined />}>
                Tải lên file Excel
              </Button>
            </Upload>
          </div>
          <p>
            Bạn có thể tải về file dữ liệu mẫu với định dạng chuẩn{' '}
            <a href={`${api.UMI_API_BASE_URL}/api/files/template/Import_CRM.xlsx`} target="_blank">
              Tại đây
            </a>
          </p>
        </Col>
      </Row>
    </>
  );
}

export default connect(({ user }) => ({
  userId: user.userId,
  wsId: user.wsId,
  authToken: user.authToken,
  tokenGateway: user.tokenGateway,
}))(ImportCustomer);
