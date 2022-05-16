import React, { useCallback, useState } from 'react';
import PT from 'prop-types';
import { Button, Form, message } from 'antd';
import { formatMessage } from 'umi';
import { requestCheckNameCampaign } from '../../service';
import FormAddNewCampaign from '../Form/addNewCampaign';

RenderStep1.propTypes = {
  onClickStep: PT.func.isRequired,
  dispatch: PT.func.isRequired,
  initialValues: PT.string.isRequired,
  headers: PT.instanceOf(Object).isRequired,
};

RenderStep1.defaultProps = {
  data: [],
  showTable: false,
  campaign: {},
  initialValues: {},
};

const tailLayout = {
  wrapperCol: { offset: 4, span: 10 },
};

function RenderStep1({ dispatch, onClickStep, initialValues, headers }) {
  const [error, setError] = useState({});

  const handleOnCancel = useCallback(() => {
    dispatch({
      type: 'campaign/execution',
      payload: {
        openForm: false,
        nameCampaign: '',
        initialValues: {},
        data: [],
        showTableStep2: false,
      }
    })
  }, [dispatch])

  const handleGetValues = useCallback(async (values) => {
    try {
      const res = await requestCheckNameCampaign(headers, values.name);
      if(res?.success && res?.scenarioes?.length === 0) {
        dispatch({
          type: 'campaign/execution',
          payload: {
            nameCampaign: values.name,
          }
        })
        onClickStep(2)
        setError({
          type: 'success',
        })
      }
      setError({
        type: 'error',
        message: 'Tên chiến dịch đã tồn tại'
      })
    } catch(err) {
      // message.error(err.toString())
    }
  }, [dispatch, onClickStep])

  return (
    <FormAddNewCampaign getValues={handleGetValues} initialValues={initialValues} error={error}>
      <Form.Item
        style={{
          marginTop: 8,
          marginRight: 16,
          display: 'flex',
          // justifyContent: 'flex-start',
          // alignItems: 'center',
        }}
        // {...tailLayout}
      >
        <Button
          onClick={handleOnCancel}
        >
          {formatMessage({ id: 'pages.campaign-management.exit' })}
        </Button>
        <Button  type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
          {formatMessage({ id: 'pages.campaign-management.save' })}
        </Button>
      </Form.Item>
    </FormAddNewCampaign>
  );
}

export default RenderStep1;
