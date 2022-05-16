import React, { useCallback } from 'react';
import RoleForm from './role-form'

export function renderModalRoleForm(props) {

  const {
    setStateModal,
  } = props

  return () => {
    setStateModal(true, {
      footer: null,
      onCancel: () => setStateModal(false, {}),
      bodyStyle: { padding: '16px 10px' },
      content: <RoleForm props={props}
      />
    });
    return <div />;
  };
}
