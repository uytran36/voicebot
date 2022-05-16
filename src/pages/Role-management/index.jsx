import React from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import NoDataPermission from '@/components/NoDataPermission';
import { checkPermission, USER_MANAGEMENT } from '@/utils/permission';
import Title from './components/Title';
import Table from './components/Table';

RoleManagement.propTypes = {
  dispatch: PT.func.isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
    currentUser: PT.instanceOf(Object),
    tokenGateway: PT.string,
  }).isRequired,
  history: PT.shape({
    push: PT.func,
  }).isRequired,
};

function RoleManagement(props) {
  const {
    user: { tokenGateway, currentUser },
    history,
  } = props;

  const headers = React.useMemo(
    () => ({
      Authorization: tokenGateway, 
    }),
    [tokenGateway],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const isViewRoleAndPermission = React.useMemo(
    () => checkPermission(currentUser?.permissions, USER_MANAGEMENT['viewRoleAndPermission']),
    [currentUser?.permissions],
  );

  const isManageAndDecentralizeUsers = React.useMemo(
    () =>
      checkPermission(currentUser?.permissions, USER_MANAGEMENT['manageAndDecentralizeUsers']) ||
      checkPermission(
        currentUser?.permissions,
        USER_MANAGEMENT['manageAndDecentralizeUsersInUnit'],
      ),
    [currentUser?.permissions],
  );

  return (
    <React.Fragment>
      <Title
        history={history}
        viewPermission={/* isViewRoleAndPermission || */ isManageAndDecentralizeUsers}
      />
      {
        /* isViewRoleAndPermission || */ isManageAndDecentralizeUsers ? (
          <Table headers={headers} isManageAndDecentralizeUsers={isManageAndDecentralizeUsers} />
        ) : (
          <NoDataPermission />
        )
      }
    </React.Fragment>
  );
}

export default connect(({ user }) => ({ user }))(RoleManagement);
