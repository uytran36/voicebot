import React from 'react';
import PT from 'prop-types';
import { useCallback, } from 'react';
import FormUpload from './form-upload';
import { signature } from '../../../../index';

AddExcel.propTypes = {
  headers: PT.shape({
    'X-Auth-Token': PT.string,
    'X-User-Id': PT.string,
    Authorization: PT.string,
  }).isRequired,
  onClose: PT.func.isRequired,
  history: PT.instanceOf(Object).isRequired,
};

function AddExcel({ headers, onClose, history }) {

  const handleCancel = useCallback(() => {
    onClose(false);
  }, [onClose]);

  const handleGoToDetail = useCallback((sessionId) => {
    history.push(`/config/data-call-management-2/`)
  }, [history]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 60, marginBottom: 60 }}>
      <FormUpload headers={headers} onCancel={handleCancel} goToDetail={handleGoToDetail} />
    </div>
  );
}

export { FormUpload };
export default AddExcel;
