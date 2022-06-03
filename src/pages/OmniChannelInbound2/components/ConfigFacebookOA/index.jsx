import React, { useEffect, useState, useRef, useCallback } from 'react';
import PT from 'prop-types';
import {
  Row,
  Col,
  Typography,
  Button,
  Form,
  Input,
  Image,
  message,
  Card,
  Divider,
  Empty,
} from 'antd';
import './style.less';
import {
  requestGetFacebookSetting,
  requestConfigFacebookSetting,
  requestGetFacebookInfo,
  requestUpdateConfigSetting,
  requestGetListPageFacebook,
  requestGetListPageFacebookSubcribe,
  requestSubcribePageFacebook,
  requestUnsubcribePageFacebook,
  requestGetAccessToken,
} from '../../service';
import { CloseOutlined } from '@ant-design/icons';
import LoginFB from '@/components/LoginFB';

import FaceBookPageItem from '../FaceBookPageItem';
import ModalStep1 from './components/ModalStep1';
import ModalStep2 from './components/ModalStep2';
import ModalStep3 from './components/ModalStep3';
import ModalStep4 from './components/ModalStep4';
import ModalSubcribePage from './components/ModalSubcribePage';

const { Title, Paragraph } = Typography;

const client_id = process.env.CLIENT_ID_FB || '212228450857992';
const redirect_uri =
  process.env.REDIRECT_URI_FB ||
  'https://oncx-portal.smartcontactcenter.xyz/omni_inbound/config_livechat_2';
const client_secret = process.env.CLIENT_SECRET_FB || '484e18436f6901ae260654041482341c';

ConfigFacebookOA.propTypes = {
  headers: PT.instanceOf(Object).isRequired,
  handleClickBack: PT.func.isRequired,
  dispatch: PT.func.isRequired,
};

//   'EAADBBUlstAgBAFW79YVwcEOygcTtZACKiZBKQxa6oWoz4Mi2y9Ekidsh1aXhtc51hl8GMmYi7CUA82kVad9ZAqXm50ZC1tmMdArMwHI2SFtwqIxh0ZAb525KQSnDrQgZAdMNXBQhUECDrHcQndZBCbUnldqxawkZA1ePhqZCpo52E9idFT4ZB74QnUefMGpZAd6mRZAy5IBEQEM7GV3ZAijFvb5i2av9lAeMWAFQxbiN0l8Ut1wZDZD';

function ConfigFacebookOA(props) {
  const { handleClickBack, headers, dispatch, location } = props;
  const [accessToken, setAccessToken] = useState('');
  const [listPageSubcribe, setListPageSubcribe] = useState([]);
  const closeModal = () => {
    dispatch({ type: 'modal/showModal', payload: false });
  };

  const renderModalPageFacebook = async (token) => {
    const res = await requestGetListPageFacebook(headers, {
      accessToken: token,
    });
    if (res?.code === 200 && res?.response?.pages?.length > 0) {
      dispatch({
        type: 'modal/changeElement',
        payload: {
          title: (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#000000',
                  }}
                >
                  Kết nối với Fanpage
                </div>
              </div>
              <CloseOutlined
                onClick={() => {
                  closeModal();
                  getListPageSubcribe();
                }}
              />
            </div>
          ),
          bodyStyle: {
            padding: '15px 20px',
          },
          content: (
            <ModalSubcribePage
              list={res.response.pages}
              accessToken={token}
              clickCancel={closeModal}
              getListPageSubcribe={getListPageSubcribe}
              clickLogin={() => {
                closeModal();
                showModalStep2();
              }}
            />
          ),
          width: 550,
          footer: {
            footer: null,
            onCancel: closeModal,
          },
        },
      });
    }
  };

  const getListPageSubcribe = async () => {
    const res = await requestGetListPageFacebookSubcribe(headers);
    if (res?.code === 200 && res?.response?.data?.length > 0) {
      setListPageSubcribe(res.response.data);
    }
  };

  const getAccessToken = async (code) => {
    const params = {
      client_id,
      redirect_uri,
      client_secret,
      code,
    };
    const res = await requestGetAccessToken(params);
    if (res?.access_token) {
      setAccessToken(res.access_token);
      return renderModalPageFacebook(res.access_token);
    }
    return null;
  };

  useEffect(() => {
    getListPageSubcribe();
    if (location?.query?.code) {
      getAccessToken(location?.query?.code);
    }
  }, []);
  const showModalStep1 = () => {
    dispatch({ type: 'modal/showModal', payload: true });
    dispatch({
      type: 'modal/changeElement',
      payload: {
        title: (
          <div className="header-modal-wrapper">
            <span>Tiếp tục với Facebook Quang Anh?</span>
            <CloseOutlined onClick={closeModal} />
          </div>
        ),
        bodyStyle: {
          padding: '15px 20px',
        },
        content: (
          <ModalStep1
            clickCancel={closeModal}
            clickLogin={() => {
              closeModal();
              showModalStep2();
            }}
          />
        ),
        width: 550,
        footer: {
          footer: null,
          onCancel: closeModal,
        },
      },
    });
  };

  const showModalStep2 = () => {
    dispatch({ type: 'modal/showModal', payload: true });
    dispatch({
      type: 'modal/changeElement',
      payload: {
        title: (
          <div className="header-modal-wrapper">
            <span>Bạn muốn sử dụng Trang nào cùng OnCX?</span>
            <CloseOutlined onClick={closeModal} />
          </div>
        ),
        bodyStyle: {
          padding: '15px 20px',
        },
        content: (
          <ModalStep2
            clickCancel={closeModal}
            clickContinue={() => {
              closeModal();
              showModalStep3();
            }}
          />
        ),
        width: 550,
        footer: {
          footer: null,
          onCancel: closeModal,
        },
      },
    });
  };

  const showModalStep3 = () => {
    dispatch({ type: 'modal/showModal', payload: true });
    dispatch({
      type: 'modal/changeElement',
      payload: {
        title: (
          <div className="header-modal-wrapper">
            <span>OnCX được phép làm gì?</span>
            <CloseOutlined onClick={closeModal} />
          </div>
        ),
        bodyStyle: {
          padding: '15px 20px',
        },
        content: (
          <ModalStep3
            clickDone={() => {
              closeModal();
              showModalStep4();
            }}
            clickBack={() => {
              closeModal();
              showModalStep2();
            }}
            clickCancel={closeModal}
          />
        ),
        width: 550,
        footer: {
          footer: null,
          onCancel: closeModal,
        },
      },
    });
  };

  const showModalStep4 = () => {
    dispatch({ type: 'modal/showModal', payload: true });
    dispatch({
      type: 'modal/changeElement',
      payload: {
        title: (
          <div className="header-modal-wrapper">
            <span>Bạn hiện đã liên kết OnCX với Facebook</span>
            <CloseOutlined onClick={closeModal} />
          </div>
        ),
        bodyStyle: {
          padding: '15px 20px',
        },
        content: <ModalStep4 clickFinish={closeModal} />,
        width: 550,
        footer: {
          footer: null,
          onCancel: closeModal,
        },
      },
    });
  };

  const activePage = useCallback(
    async (active, pageId) => {
      if (active) {
        const res = await requestSubcribePageFacebook(headers, {
          pageId,
          accessToken,
        });
        if (res?.code === 200) {
          return message.success('Kích hoạt thành công');
        }
        return message.warning('Kích hoạt thất bại');
      }
      const res = await requestUnsubcribePageFacebook(headers, { pageId });
      if (res?.code === 200) {
        return message.success('Ngưng kích hoạt thành công');
      }
      return message.warning('Ngưng kích hoạt thất bại');
    },
    [accessToken, headers],
  );

  const subcribePage = useCallback(
    async (pageId, accessToken, pageName, avatarUrl) => {
      console.log(pageId, accessToken, pageName, avatarUrl);
      const res = await requestSubcribePageFacebook(headers, [{
        pageId,
        accessToken,
        pageName,
        avatarUrl,
      }]);
      if (res?.code === 200) {
        return message.success('Kích hoạt thành công')
      }
      return message.warning('Kích hoạt thất bại')
    },
    [headers],
  );

  return (
    <div className="wrapper">
      <div className="content">
        <div className="header">
          <h3>Tất cả các Trang ({listPageSubcribe.length})</h3>
          <h3>Kích hoạt</h3>
        </div>
        <Divider />
        <div className="list">
          {listPageSubcribe.length > 0 ? (
            listPageSubcribe.map((item, index) => (
              <FaceBookPageItem
                key={index}
                name={item.name}
                lastModify={item.createdDate}
                imageURL={item.avatarUrl}
                active={item.active}
                activePage={activePage}
                id={item.pageId}
                accessToken={item.accessTokenPage}
                subcribePage={subcribePage}
              />
            ))
          ) : (
            <Empty
              imageStyle={{
                height: 70,
              }}
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              description={
                <p className="empty">
                  Vui lòng kết nối với Fanpage để trải nghiệm Omni Chat Social
                </p>
              }
            />
          )}
        </div>
      </div>
      <div className="action">
        {/* <Button type="primary" onClick={showModalStep1}>
          Thêm kết nối
        </Button> */}
        <LoginFB />
        <a
          href="https://www.facebook.com/settings?tab=business_tools&ref=settings"
          target="_blank"
          rel="noopener"
        >
          <Button disabled={listPageSubcribe.length === 0}>Tùy chọn quyền truy cập</Button>
        </a>
      </div>
    </div>
  );
}

export default ConfigFacebookOA;
