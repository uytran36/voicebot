import React from 'react';
import RootForm from './index';
import {
  createAPIData,
  createAPIDataExport,
  updateAPIData,
  updateAPIDataExport,
} from '../DataTable/function';

export function renderModalAPIForm({ headers, initialValues, isEdit, cb, setStateModal, type }) {
  const handleCreateNewAPIData = async (values) => {
    const data = {
      name: values?.name,
      type: values?.type,
      strategy: values?.strategy,
      configuration: JSON.parse(values?.configuration),
    };
    if (type === 'import') {
      const success = await createAPIData(headers, data);
      if (success) {
        cb();
      }
    } else {
      const success = await createAPIDataExport(headers, data);
      if (success) {
        cb();
      }
    }
  };

  const handleUpdateAPIData = async (values) => {
    const data = {
      id: initialValues?.id,
      name: values?.name,
      type: values?.type,
      strategy: values?.strategy,
      configuration: JSON.parse(values?.configuration),
    };
    if (type === 'import') {
      const success = await updateAPIData(headers, data);
      if (success) {
        cb();
      }
    } else {
      const success = await updateAPIDataExport(headers, data);
      if (success) {
        cb();
      }
    }
   
  };

  return () => {
    setStateModal(true, {
      footer: null,
      onCancel: () => setStateModal(false, {}),
      bodyStyle: { padding: '16px 10px' },
      content: (
        <RootForm
          headers={headers}
          initialValues={initialValues}
          onFinish={isEdit ? handleUpdateAPIData : handleCreateNewAPIData}
          isEdit={isEdit}
          setStateModal={setStateModal}
        ></RootForm>
      ),
    });
    return <div />;
  };
}
