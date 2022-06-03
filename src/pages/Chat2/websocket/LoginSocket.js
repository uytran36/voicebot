/* eslint-disable default-case */
const LoginSocket = async (dispatch, socket, response) => {
  if (!response.hasOwnProperty('error')) {
    switch (response.msg) {
      case 'result': {
        await dispatch({
          type: 'websocket/socket_login',
          payload: {
            socket,
            userId: response.result.id,
            authToken: response.result.token,
          }
        });
        await dispatch({
          type: 'rocketChat/getMe',
          payload: {
            userId: response.result.id,
            authToken: response.result.token,
            socket,
          }
        });
        await dispatch({
          type: 'websocket/subscriptionServer',
          payload: {
            params: {
              socket: socket
            }
          },
        });
        await dispatch({
          type: 'rocketChat/updateCountUnreadRealtime',
        });
        break;
      }
    }
  } else {
    // throw err
  }
};

export default LoginSocket;
