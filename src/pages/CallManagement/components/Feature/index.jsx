import React, { useState } from 'react';
import styles from './styles.less';
import { Select } from 'antd';
import {
  PhoneFilled,
  CloseOutlined,
  AudioOutlined,
  FormOutlined,
  PauseOutlined,
  UnorderedListOutlined,
  ForwardOutlined,
  EyeOutlined,
  CustomerServiceOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  AudioMutedOutlined
} from '@ant-design/icons';
import PropTypes from 'prop-types';

Feature.propTypes = {
  handleClickLogInterface: PropTypes.func.isRequired,
  handleClickNote: PropTypes.func.isRequired,
  logInterface: PropTypes.bool.isRequired,
  note: PropTypes.bool.isRequired,
  keyTab: PropTypes.number.isRequired
};

const { Option } = Select;

function Feature({ handleClickLogInterface, logInterface, handleClickNote, note, keyTab }) {
  const [forward, setForward] = useState(false);

  const handleClickForward = () => {
    setForward(!forward);
  };

  return (
    <>
      {forward && (
        <div className={styles.forwardContainer}>
          <div className={styles.title}>
            <span>Chuyển tiếp</span>
          </div>
          <Select className={styles.select} placeholder="Chọn Agent">
            <Option value="nguyen thu huong">Nguyễn Thu Hương</Option>
            <Option value="le ha quang anh">Lê Hà Quang Anh</Option>
            <Option value="le minh tri">Lê Minh Trí</Option>
          </Select>
          <div className={styles.close}>
            <CloseOutlined
              style={{ color: '#3D3D3D', fontSize: '16px', cursor: 'pointer' }}
              onClick={() => setForward(false)}
            />
          </div>
        </div>
      )}
      <div className={styles.footer}>
        <div className={styles.feature}>
          <PhoneFilled style={{ color: '#16B14B', fontSize: '26px', cursor: 'pointer' }} />
          <h4>Nhận cuộc gọi</h4>
        </div>
        <div className={styles.feature}>
          <AudioOutlined style={{ color: '#3D3D3D', fontSize: '26px', cursor: 'pointer' }} />
          <h4>Tắt tiếng</h4>
        </div>
        <div className={styles.feature} onClick={handleClickForward}>
          <ForwardOutlined
            style={{ color: forward ? '#DFDFDF' : '#3D3D3D', fontSize: '26px', cursor: 'pointer' }}
          />
          <h4 style={{ color: forward ? '#DFDFDF' : '#3D3D3D' }}>Chuyển tiếp</h4>
        </div>
        <div className={styles.feature}>
          <PauseOutlined style={{ color: '#3D3D3D', fontSize: '26px', cursor: 'pointer' }} />
          <h4>Giữ máy</h4>
        </div>
        <div className={styles.feature}>
          <CloseOutlined style={{ color: '#ED6060', fontSize: '26px', cursor: 'pointer' }} />
          <h4>Ngắt kết nối</h4>
        </div>
        {
          keyTab === 1 && (
            <>
              <div className={styles.feature}>
                <EyeOutlined style={{ color: '#3D3D3D', fontSize: '26px', cursor: 'pointer' }} />
                <h4>Nghe lén</h4>
              </div>
              <div className={styles.feature}>
                <UsergroupAddOutlined style={{ color: '#3D3D3D', fontSize: '26px', cursor: 'pointer' }} />
                <h4>Trò chuyện với cả hai</h4>
              </div>
              <div className={styles.feature}>
                <CustomerServiceOutlined style={{ color: '#3D3D3D', fontSize: '26px', cursor: 'pointer' }} />
                <h4>Trò chuyện với agent</h4>
              </div>
              <div className={styles.feature}>
                <UserAddOutlined style={{ color: '#3D3D3D', fontSize: '26px', cursor: 'pointer' }} />
                <h4>Trò chuyện với khách hàng</h4>
              </div>
              <div className={styles.feature}>
                <AudioMutedOutlined style={{ color: '#3D3D3D', fontSize: '26px', cursor: 'pointer' }} />
                <h4>Tắt tiếng nghe lén</h4>
              </div>
            </>
          )
        }
        <div className={styles.feature} onClick={handleClickLogInterface}>
          <UnorderedListOutlined
            style={{
              color: logInterface ? '#DFDFDF' : '#3D3D3D',
              fontSize: '26px',
              cursor: 'pointer',
            }}
          />
          <h4 style={{ color: logInterface ? '#DFDFDF' : '#000' }}>Log tương tác</h4>
        </div>
        <div className={styles.feature} onClick={handleClickNote}>
          <FormOutlined
            style={{ color: note ? '#DFDFDF' : '#3D3D3D', fontSize: '26px', cursor: 'pointer' }}
          />
          <h4 style={{ color: note ? '#DFDFDF' : '#000' }}>Ghi chú</h4>
        </div>
      </div>
    </>
  );
}

export default Feature;
