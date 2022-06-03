import React from 'react';
import PT from 'prop-types';
import { connect, FormattedMessage } from 'umi';
import NoDataPermission from '@/components/NoDataPermission';
import { checkPermission, USER_MANAGEMENT } from '@/utils/permission';
import styles from './styles.less';
import Table from './Components/Table';

function Extension(props) {
  const { dispatch, user } = props;
  let { userId, authToken, tokenGateway, currentUser } = user;

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
      {true ? (
        <Table dispatch={dispatch} currentUser={currentUser} headers={headers} />
      ) : (
        <NoDataPermission />
      )}
    </React.Fragment>
  );
}

export default connect(({ user }) => ({ user }))(Extension);
