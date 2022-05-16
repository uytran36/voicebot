/* eslint-disable default-case */
const Id = async (dispatch, socket, response) => {
  if (!response.hasOwnProperty('error')) {
    switch (response.msg) {
      case 'result': {
        break;
      }
      case 'added': {
        break;
      }
      case 'changed': {
        switch (response.collection) {
          case 'stream-room-messages': {
            const dataRoom = response.fields.args[0];
            dispatch({
              type: 'rocketChat/updateListMessage',
              payload: {
                data: dataRoom,
                socket,
              }
            });
            if (dataRoom.attachments) {
              if (dataRoom.token) {
                dispatch({
                  type: 'rocketChat/getChannelFile',
                  payload: {
                    roomId: dataRoom.rid,
                  }
                });
              } else {
                // dispatch({
                //   type: 'rocketChat/getGroupFile',
                //   payload: {
                //     roomId: dataRoom.rid,
                //   }
                // });
              }
            }
            break;
          }
          case 'stream-notify-user': {
            if (response.fields.eventName.indexOf('rooms-changed') > -1) {
              const dataRoom = response.fields.args[1];
              dispatch({
                type: 'rocketChat/updateListRoom',
                payload: {
                  data: dataRoom,
                  status: response.fields.args[0],
                }
              });
            }
            if (response.fields.eventName.indexOf('userData') > -1) {
              if (response.fields.args[0].diff.statusLivechat) {
                dispatch({
                  type: 'websocket/status_livechat',
                  payload: {
                    statusLivechat: response.fields.args[0].diff.statusLivechat,
                  }
                });
              }
            }
            if (response.fields.eventName.indexOf('subscriptions-changed') > -1) {
              if (response.fields.args[0] === 'removed') {
                dispatch({
                  type: 'rocketChat/updateListRoom',
                  payload: {
                    data: response.fields.args[1],
                    status: response.fields.args[0],
                  }
                });
              }
              dispatch({
                type: 'rocketChat/updateListSubscription',
                payload: {
                  data: response.fields.args[1],
                  status: response.fields.args[0],
                }
              });
              dispatch({
                type: 'rocketChat/updateCountUnreadRealtime',
                payload: {
                  data: response.fields.args[0],
                }
              });
            }

            if (response.fields.eventName.indexOf('notification') > -1) {
              dispatch({
                type: 'rocketChat/updateCountUnreadRealtime',
                payload: {
                  data: response.fields.args[0],
                }
              });
            }
            break;
          }
          default:
            break;
        }
      }
    }
  } else {
    // throw err
  }
};
export default Id;
