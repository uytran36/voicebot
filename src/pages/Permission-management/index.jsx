import React from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import NoDataPermission from '@/components/NoDataPermission';
import Table from './components/Table';
import Title from './components/Title';
import { checkPermission, USER_MANAGEMENT } from '@/utils/permission';

PermissionManagement.propTypes = {
  dispatch: PT.func.isRequired,
  user: PT.shape({
    currentUser: PT.instanceOf(Object),
    tokenGateway: PT.string,
  }).isRequired,
  history: PT.shape({
    push: PT.func,
  }).isRequired,
};

function PermissionManagement(props) {
  const {
    user: { tokenGateway, currentUser },
    history
  } = props;

  const isViewRoleAndPermission = React.useMemo(() => checkPermission(currentUser.permissions, USER_MANAGEMENT.viewRoleAndPermission), [currentUser.permissions]);
  const isManageAndDecentralizeUsers = React.useMemo(() => checkPermission(currentUser.permissions, USER_MANAGEMENT.manageAndDecentralizeUsers), [currentUser.permissions]);

  const headers = React.useMemo(() => ({
    Authorization: tokenGateway,
  }), [tokenGateway]);

  if (isViewRoleAndPermission || isManageAndDecentralizeUsers) {
    return (
      <React.Fragment>
        <Title history={history} viewPermission={isViewRoleAndPermission || isManageAndDecentralizeUsers} />
        <Table headers={headers} currentUser={currentUser} />
      </React.Fragment>
    )
  }
  return <NoDataPermission />
}

export default connect(({ user }) => ({ user }))(PermissionManagement)
