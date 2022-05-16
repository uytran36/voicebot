import React, { useCallback, useState } from 'react';
import PT from 'prop-types';
// import { CloudUploadOutlined, UploadOutlined } from '@ant-design/icons';
import { Typography, Button, message, Col, Row } from 'antd';
import { formatMessage, FormattedMessage } from 'umi';
import styles from './styles.less';
import RenderListCustomer from '../Form/listCustomer';
import { requestGetListCustomer, requestUpdateOmniContactList } from '../../service';
import Table from './Table';
import RenderFormStep2 from '../Form/formStep2';
import { requestDeleteOmniContactListNormalization } from '../../service';
import { Upload1, Upload2 } from '@/components/Icons';
import { filterField } from '@/constants/filter-data-excel';

RenderStep2.propTypes = {
  handleChangeElementModal: PT.func.isRequired,
  handleChangeStateModal: PT.func.isRequired,
  handleCreateNewList: PT.func.isRequired,
  onClickStep: PT.func.isRequired,
  // setShowTable: PT.func.isRequired,
  dispatch: PT.func.isRequired,
  getRecord: PT.func.isRequired,
  showTable: PT.bool,
  data: PT.instanceOf(Array),
  campaign: PT.instanceOf(Object),
  initialValues: PT.instanceOf(Object),
  userId: PT.string.isRequired,
  authToken: PT.string.isRequired,
  updateCampaign: PT.func.isRequired,
  headers: PT.instanceOf(Object).isRequired,
};

RenderStep2.defaultProps = {
  data: [],
  showTable: false,
  campaign: {},
  initialValues: {},
};

function RenderStep2({
  handleChangeElementModal,
  handleChangeStateModal,
  getRecord,
  showTable,
  data,
  userId,
  authToken,
  onClickStep,
  dispatch,
  campaign: { nameCampaign },
  handleCreateNewList,
  initialValues,
  updateCampaign,
  headers
}) {
  const [isOpenForm, toggle] = useState(false);
  const [rowSelected, setRowSelected] = useState({});

  const handleClickContinues = () => {
    onClickStep(3);
  };

  const setIdListCustomer = useCallback(
    (id) => {
      dispatch({
        type: 'campaign/execution',
        payload: {
          initialValues: {
            ...initialValues,
            omniContactListBase: id,
          },
        },
      });
    },
    [dispatch, initialValues],
  );

  const handleGetRecord = useCallback(async (record) => {
    const isOpen = await getRecord(record.id)
    if(isOpen) {
      dispatch({
        type: 'campaign/execution',
        payload: {
          showTableStep2: true,
        },
      });
    }
  }, [dispatch, getRecord])

  const handleClickCloudUpload = useCallback(async () => {
    try {
      const res = await requestGetListCustomer(headers);
      if (res.length > 0) {
        handleChangeStateModal(true);
        handleChangeElementModal({
          title: <FormattedMessage id="pages.campaign-management.customer.list" />,
          bodyStyle: {
            padding: '12px 24px 16px 24px',
          },
          content: (
            <RenderListCustomer
              getRecord={handleGetRecord}
              handleChangeStateModal={handleChangeStateModal}
              data={res}
              setIdListCustomer={setIdListCustomer}
            />
          ),
          footer: {
            footer: null,
            onCancel: () => handleChangeStateModal(false),
          },
        });
      }
    } catch (err) {
      // message.error(err.toString());
    }
  }, [authToken, handleChangeElementModal, handleChangeStateModal, handleGetRecord, setIdListCustomer, userId]);

  const toggleTable = useCallback((state) => {
    dispatch({
      type: 'campaign/execution',
      payload: {
        showTableStep2: state
      }
    })
  }, [dispatch])

  const handleCancelForm = useCallback(() => {
    toggle(false);
    setRowSelected({});
  }, []);

  const getValues = useCallback(
    async (values) => {
      try {
        const res = await requestUpdateOmniContactList(headers, [values]);
        if (res && res.status) {
          message.success(`Sửa bản ghi thành công`);
          getRecord(initialValues.omniContactListBase);
          handleCancelForm();
        } else {
          message.warn(res.msg)
          throw new Error(`Sửa bản ghi thất bại`);
        }
      } catch (err) {
        // message.error(err.toString());
      }
    },
    [initialValues, getRecord, handleCancelForm],
  );

  const deleteOmniContact = useCallback(
    async (record) => {
      try {
        const res = await requestDeleteOmniContactListNormalization({}, record.id);
        if (res && res.error) {
          throw new Error(res?.error?.message || 'Error');
        }
        getRecord(initialValues.omniContactListBase);
        message.success('Đã xoá thành công!');
      } catch (err) {
        // message.error(err.toString());
      }
    },
    [getRecord, initialValues],
  );

  const handleUpdate = useCallback(async () => {
    const res = await updateCampaign({
      omniContactListBase: initialValues.omniContactListBase,
    }, initialValues._id)
    if(res?.success) {
      message.success('Update danh sách khách hàng thành công.')
    }
  }, [initialValues, updateCampaign])

  // open form edit
  if (isOpenForm) {
    return (
      <div>
        <RenderFormStep2 data={rowSelected} filtered={filterField} getValues={getValues} headers={headers}>
          <div>
            <Button style={{ marginRight: 8 }} onClick={handleCancelForm}>
              {<FormattedMessage id="pages.campaign-management.cancel" />}
            </Button>
            <Button htmlType="submit" type="primary">
              {<FormattedMessage id="pages.campaign-management.submit" />}
            </Button>
          </div>
        </RenderFormStep2>
      </div>
    );
  }

  return (
    <Row gutter={[8, 32]} className={styles.wrapper}>
      <Col span={24} className={styles.header}>
        <Typography.Title level={3}>
          {`${formatMessage({id: "pages.campaign-management.name"})}: ${nameCampaign}`}
        </Typography.Title>
        {data.length > 0 && (
          <Typography.Title level={4}>
            <span className={styles.title}>
              {<FormattedMessage id="pages.campaign-management.call.customer.list" />}
            </span>
            <span>
              {data[0]?.xlsContactObject?.tentailieu || ''}
            </span>

          </Typography.Title>
        )}
      </Col>
      {!showTable && (
        <>
          <Col xs={24} md={12} lg={9} onClick={handleClickCloudUpload}>
            <div className={`${styles.col} ${styles['border-col']}`} >
              <Upload1 className={styles['col-icon']} />
              <span>{<FormattedMessage id="pages.campaign-management.available.list" />}</span>
            </div>
          </Col>
          <Col xs={24} md={12} lg={9} onClick={handleCreateNewList}>
            <div className={styles.col} >
              <Upload2 className={styles['col-icon']} />
              <span>{<FormattedMessage id="pages.campaign-management.new.list" />}</span>
            </div>
          </Col>
        </>
      )}
      {showTable && (
        <Col span={24}>
          <Table
            data={data}
            setRowSelected={setRowSelected}
            toggle={toggle}
            filtered={filterField}
            deleteOmniContact={deleteOmniContact}
          />
          <div
            style={{
              float: 'right',
              marginTop: 24,
            }}
          >
            <Button style={{ marginRight: 8 }} onClick={() => toggleTable(false)}>
              {<FormattedMessage id="pages.campaign-management.cancel" />}
            </Button>
            {initialValues.omniContactListBase && initialValues.campaign_id ?
            <Button onClick={handleUpdate} type="primary">
              {<FormattedMessage id="pages.campaign-management.update" />}
            </Button> :
            <Button onClick={handleClickContinues} type="primary">
              {<FormattedMessage id="pages.campaign-management.continue" />}
            </Button>
          }
          </div>
        </Col>
      )}
    </Row>
  );
}

export default RenderStep2;
