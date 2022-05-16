import React from 'react';
import PT from 'prop-types';
import { connect, FormattedMessage } from 'umi';
import NoDataPermission from '@/components/NoDataPermission';
import { checkPermission, USER_MANAGEMENT } from '@/utils/permission';
import styles from './styles.less';
import Table from './Components/Table';

RenderUserManagement.propTypes = {
  dispatch: PT.func.isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
    currentUser: PT.instanceOf(Object),
    tokenGateway: PT.string,
  }).isRequired,
};

function RenderUserManagement(props) {
  const { dispatch, user } = props;
  let { userId, authToken, tokenGateway, currentUser } = user;

  const isViewUserProfile = React.useMemo(
    () => checkPermission(user?.currentUser?.permissions, USER_MANAGEMENT['user-view']),
    [user?.currentUser?.permissions],
  );

  const isManageAndDecentralizeUsers = React.useMemo(
    () =>
      checkPermission(
        user?.currentUser?.permissions,
        USER_MANAGEMENT['manageAndDecentralizeUsers'],
      ) ||
      checkPermission(
        user?.currentUser?.permissions,
        USER_MANAGEMENT['manageAndDecentralizeUsersInUnit'],
      ) ||
      checkPermission(user?.currentUser?.permissions, USER_MANAGEMENT['manageUsersInDepartment']),
    [user?.currentUser?.permissions],
  );

  const headers = React.useMemo(
    () => ({
      'X-Auth-Token': authToken,
      'X-User-Id': userId,
      Authorization: `${tokenGateway}`,
    }),
    [authToken, tokenGateway, userId],
  );

  return (
    <React.Fragment>
      <div className={styles.searchWrapper}>
        <div className={styles.title} style={{ marginLeft: 0 }}>
          <span>
            <FormattedMessage
              id="pages.user-management.title"
              defaultMessage="Danh sách người dùng"
            />
          </span>
        </div>
      </div>
      {isViewUserProfile || isManageAndDecentralizeUsers ? (
        <Table dispatch={dispatch} currentUser={currentUser} headers={headers} />
      ) : (
        <NoDataPermission />
      )}
    </React.Fragment>
  );
}

export default connect(({ user }) => ({ user }))(RenderUserManagement);
