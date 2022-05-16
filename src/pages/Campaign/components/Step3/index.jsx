import React, { useCallback, memo, useState } from 'react';
import PT from 'prop-types';
import { UploadOutlined } from '@ant-design/icons';
import { Form, Space, Typography, Button, Upload, message, Row, Col } from 'antd';
import { formatMessage, FormattedMessage } from 'umi';
import XLSX from 'xlsx';
import styles from './styles.less';
import api from '@/api';
import { checkPermission, VoiceBot } from '@/utils/permission';

UploadFile.propTypes = {
  getValues: PT.func.isRequired,
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]).isRequired,
  readFileExcel: PT.func.isRequired,
  setFile: PT.func.isRequired,
  setFileList: PT.func.isRequired,
  user: PT.instanceOf(Object).isRequired,
  fileList: PT.instanceOf(Array).isRequired,
};

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

function convertData(data) {
  const data8 = new Uint8Array(data);
  const arr = [];
  for (let i = 0; i !== data8.length; i += 1) {
    arr[i] = String.fromCharCode(data8[i]);
  }
  const bstr = arr.join('');
  return XLSX.read(bstr, { type: 'binary' });
}

// async function importExcel(fileExcel) {
//   const result = [];
//   const dataConvert = await convertData(fileExcel);
//   const sheetName = dataConvert.SheetNames.map(name => name);
//   const worksheet = sheetName.map(item => dataConvert.Sheets[item]);
//   worksheet.forEach(elm => {
//     result.push(...XLSX.utils.sheet_to_json(elm, {raw: false, defval: '-'}))
//   });
//   return result;
// }

function UploadFile({
  getValues,
  children,
  readFileExcel,
  setFile,
  fileList,
  setFileList,
  user,
  valueForm,
}) {
  const handleOnFinish = useCallback(() => {
    getValues({ file: fileList[0].originFileObj });
  }, [getValues, fileList]);

  const propUpload = {
    name: 'file',
    action: `${api.CM_SERVICE}/api/v1/import-files-excel`,
    accept:
      '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
    headers: {
      'X-Auth-Token': user.authToken,
      'X-User-Id': user.userId,
      Authorization: `Bearer ${localStorage.getItem('tokenGateway') || ''}`,
    },
    data: {
      tentailieu: valueForm?.nameFile,
    },
    beforeUpload: (file) => {
      if (file.size > 10485760) {
        message.error(`File ${file.name} có dung lương lớn hơn 10Mb`);
        return false;
      }
      return true;
    },
    onChange: (info) => {
      let list = [...info.fileList];
      list = list.slice(-1);

      list = list.map((file) => {
        if (file.response && file.response.status) {
          setFile(file.response);
          readFileExcel(file?.response?.fields?.filter((elm) => elm));
          message.success('Upload success', 5);
        } else {
          readFileExcel([]);
        }
        return file;
      });
      setFileList(list);
      // if (info.file.status === 'done' && info.file.response.status === true) {
      //   setFileList(list);
      //   setFile(info.file.response)
      //   readFileExcel(info?.file?.response?.fields?.filter(elm => elm))
      //   // hide()
      //   message.success('Upload success')
      //   // Comment read file from FE
      //   // const reader = new FileReader();
      //   // if (reader) {
      //   //   reader.readAsArrayBuffer(info.file.originFileObj);
      //   //   reader.onload = async () => {
      //   //     const data = await importExcel(reader.result);
      //   //     readFileExcel(data);
      //   //   };
      //   // }
      // }
      if (info.file.status === 'error') {
        // hide()
        message.error('ERROR!');
        // console.log('error load file', info.file.status);
      }
    },
    // progress: {
    //   strokeColor: {
    //     '0%': '#108ee9',
    //     '100%': '#87d068',
    //   },
    //   strokeWidth: 3,
    //   format: percent => `${parseFloat(percent.toFixed(2))}%`,
    // },
    onRemove: () => {
      setFileList([]);
    },
    fileList,
  };

  return (
    <Form {...layout} onFinish={handleOnFinish} className={styles.form} layout="vertical">
      <Typography.Title level={3} className={styles.title}>
        {/* {formatMessage({ id: "pages.campaign.upload" })} */}
        <FormattedMessage id="pages.campaign.upload" />
      </Typography.Title>
      <Typography.Paragraph className={styles.subTitle}>
        <Typography.Text className={styles.content}>
          {/* {formatMessage({ id: "pages.campaign.tutorial" })} */}
          <FormattedMessage id="pages.campaign.tutorial" />
        </Typography.Text>
        <br />
        <Typography.Text className={styles.content}>
          {/* {formatMessage({ id: "pages.campaign.tutorial2" })} */}
          <FormattedMessage id="pages.campaign.tutorial2" />
        </Typography.Text>
      </Typography.Paragraph>
      {/* <Space size={150}> */}
      <Row>
        <Col span={8}>
          <Form.Item>
            <Upload {...propUpload}>
              <Button hidden={checkPermission(user?.currentUser?.permissions, VoiceBot.importDataCalling)}>
                <UploadOutlined /> <FormattedMessage id="pages.campaign.file.choose" />
              </Button>
            </Upload>
          </Form.Item>
        </Col>
      </Row>


      {/* </Space> */}
      {children}
    </Form>
  );
}

export default memo(UploadFile);
