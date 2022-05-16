import React from 'react';
import PT from 'prop-types';
import { Result, Button } from 'antd';

ImportSuccess.propTypes = {
  title: PT.oneOfType([PT.string, PT.node]).isRequired,
  subTitle: PT.oneOfType([PT.string, PT.node]).isRequired,
  handleChangeStateModal: PT.func.isRequired,
  setFileRecord: PT.func.isRequired,
  onToggleBack: PT.func.isRequired,
};

export function ImportSuccess({ title, subTitle, handleChangeStateModal, setFileRecord, onToggleBack }) {
  return (
    <Result
      status="success"
      title={title}
      subTitle={subTitle}
      extra={[
        <Button
          key="console"
          onClick={() => {
            handleChangeStateModal(false, {});
            setFileRecord([]);
          }}
        >
          Tiếp tục import
        </Button>,
        <Button type="primary" key="buy" onClick={() => {
          handleChangeStateModal(false, {});
          setFileRecord([]);
          onToggleBack(false)
        }}>
          Xem dữ liệu
        </Button>,
      ]}
    />
  );
}

ImportFail.propTypes = {
  title: PT.oneOfType([PT.string, PT.node]).isRequired,
  subTitle: PT.oneOfType([PT.string, PT.node]).isRequired,
};

export function ImportFail({ title, subTitle, ...props }) {
  return (
    <Result
      status="error"
      title={title}
      subTitle={subTitle}
      {...props}
      // extra={[
      //   <Button key="console">Tiếp tục import</Button>,
      //   <Button type="primary" key="buy">
      //     Xem dữ liệu
      //   </Button>,
      // ]}
    />
  );
}
