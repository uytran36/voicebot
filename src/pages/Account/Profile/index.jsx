import React from 'react';
import PT from 'prop-types';
import { connect } from 'umi';
import { Row, Col, Typography } from 'antd';
import Main from './Components/Main';

Profile.propTypes = {
  dispatch: PT.func.isRequired,
  user: PT.shape({
    userId: PT.string,
    authToken: PT.string,
    currentUser: PT.instanceOf(Object),
    tokenGateway: PT.string,
  }).isRequired,
};

function Profile(props) {
  const { user, dispatch } = props;
  let { tokenGateway, currentUser } = user;

  const headers = {
    Authorization: `${tokenGateway}`,
  };

  const [componentKey, setKey] = React.useState(new Date().getTime());

  return (
    <Main
      dispatch={dispatch}
      currentUser={currentUser}
      headers={headers}
      key={componentKey}
      setKey={setKey}
    />
  );
}

export default connect(({ user }) => ({ user }))(Profile);
