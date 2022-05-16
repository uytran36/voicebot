// import request from '@/utils/request';
// import api from '@/api';

// export async function exampleRequest(headers, data) {
//   return request(`${api.ACCESS_SERVICE}/smart-contact-center/livechat-settings`, {
//     method: 'PATCH',
//     headers,
//     data,
//   });
// }
import axios from 'axios';
import request from '@/utils/request';

const axiosInstance = axios.create({
  timeout: 18000,
});

const GET = ({
  API_PATH,
  userId,
  authToken,
  baseURL = process.env.REACT_APP_URL_ROCKETCHAT,
  params = {},
  authorization,
}) => {
  let xUserId = userId ? userId : '';
  let xAuthToken = authToken ? authToken : '';
  let Authorization = authorization ? authorization : '';

  return new Promise((resolve, rejects) => {
    request(`${baseURL + API_PATH}`, {
      method: 'GET',
      headers: {
        "X-Auth-Token": xAuthToken,
        "X-User-Id": xUserId,
        Authorization: Authorization,
      },
      params: params
    })
      .then((e) => {
        return resolve(e);
      })
      .catch((e) => {
        return rejects(e);
      });
  });
};

const GET2 = ({
  API_PATH,
  baseURL = process.env.UMI_API_BASE_URL,
  params = {},
  authorization,
}) => {
  return new Promise((resolve, rejects) => {
    request(`${baseURL + API_PATH}`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
      },
      params: params
    })
      .then((e) => {
        return resolve(e);
      })
      .catch((e) => {
        return rejects(e);
      });
  });
};
const POST = ({
  API_PATH,
  filter,
  baseURL = process.env.REACT_APP_URL_ROCKETCHAT,
  authorization,
}) => {
  let Authorization = authorization ? authorization : '';
  return new Promise((resolve, rejects) => {
    request(`${baseURL + API_PATH}`, {
      method: 'POST',
      headers: {
        Authorization: Authorization,
      },
      data: filter,
    })
      .then((e) => {
        return resolve(e);
      })
      .catch((e) => {
        return rejects(e);
      });
  });
};
const PATCH = ({
  API_PATH,
  filter,
  userId,
  authToken,
  baseURL = process.env.REACT_APP_URL_ROCKETCHAT,
  authorization,
}) => {
  let xUserId = userId ? userId : '';
  let xAuthToken = authToken ? authToken : '';
  let Authorization = authorization ? authorization : '';

  return new Promise((resolve, rejects) => {
    request(`${baseURL + API_PATH}`, {
      method: 'PATCH',
      headers: {
        "X-Auth-Token": xAuthToken,
        "X-User-Id": xUserId,
        Authorization: Authorization,
      },
      data: filter,
    })
      .then((e) => {
        return resolve(e);
      })
      .catch((e) => {
        return rejects(e);
      });
  });
};
function sendFile({ API_PATH, filter, userId, authToken, authorization }) {
  let xUserId = userId ? userId : '';
  let xAuthToken = authToken ? authToken : '';
  let Authorization = authorization ? authorization : '';

  const file = new FormData();
  file.append('file', filter.file);
  return new Promise((resolve, rejects) => {
    axiosInstance
      .post(API_PATH, file, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Auth-Token': xAuthToken,
          'X-User-Id': xUserId,
          Authorization: Authorization,
        },
      })
      .then((e) => {
        return resolve(e);
      })
      .catch((e) => {
        return rejects(e);
      });
  });
}
export { GET, POST, PATCH, sendFile, GET2 };
