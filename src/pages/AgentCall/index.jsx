import React, { useCallback, useState } from 'react';
import { Modal, Button, Row, Col } from 'antd';
import { CloseOutlined, MinusOutlined, BorderOutlined, PhoneOutlined } from '@ant-design/icons';
import ModalRinging from './components/ModalRinging';
import ModalAnswer from './components/ModalAnswer';
import Call from './components/Call';
import style from './style.less';
import CheckWindowSize from '@/components/CheckWindownSize';


/**
 *            CHÚ Ý
 * folder này hiện có thể xóa :D
 * chúng ta sẽ sử dụng tại folder `Components`
 *
 *
 */





function TestAgentCall () {
  const [visible, setVisible] = useState(false);
  const [visibleCall, setVisibleCall] = useState(false);
  const [visibleMainCall, setVisibleMainCall] = useState(false);

  const handleClickCall = useCallback(() => {
    setVisible(false);
    setVisibleCall(true);
  }, []);
  const size = CheckWindowSize();
  console.log(size.screen);

  return (
    <div className={style.contentWrapper}>
      <Button type="primary" onClick={() => setVisible(true)} style={{ marginRight: '10px' }}>
        Open Agent Call
      </Button>
      {/* Modal ringing */}
      <Modal
        visible={visible}
        centered
        footer={null}
        closable={false}
        width={700}
        bodyStyle={{ padding: '0px 0px' }}
      >
        <div className={style.iconWrapper}>
          <MinusOutlined
            style={{ color: '#fff', fontSize: 13 }}
            onClick={() => setVisible(false)}
          />
          <BorderOutlined style={{ marginLeft: 25, color: '#fff', fontSize: 13 }} />
          <CloseOutlined
            style={{ marginLeft: 25, color: '#fff', fontSize: 13 }}
            onClick={() => setVisible(false)}
          />
        </div>
        <ModalRinging handleClickCall={handleClickCall} />
      </Modal>

      {/* Modal answer */}
      <Modal
        visible={visibleCall}
        centered
        footer={null}
        closable={false}
        width={1400}
        bodyStyle={{ padding: '0px 0px' }}
      >
        <div className={style.iconWrapper}>
          <MinusOutlined
            style={{ color: '#fff', fontSize: 13 }}
            onClick={() => setVisibleCall(false)}
          />
          <BorderOutlined style={{ marginLeft: 25, color: '#fff', fontSize: 13 }} />
          <CloseOutlined
            style={{ marginLeft: 25, color: '#fff', fontSize: 13 }}
            onClick={() => setVisibleCall(false)}
          />
        </div>
        <ModalAnswer />
      </Modal>

      {/* Modal history call */}
      <Button type="primary" onClick={() => setVisibleMainCall(true)}>
        <PhoneOutlined />
      </Button>
      <Modal
        visible={visibleMainCall}
        centered
        footer={null}
        closeIcon={
          <CloseOutlined style={{ color: '#fff' }} onClick={() => setVisibleMainCall(false)} />
        }
        width={size.screen === 'xxl' ? 1400 : size.screen === 'xl' ? 1100 : size.screen === 'lg' ? 800 : size.screen === 'md' ? 600 : size.screen === 'sm' ? 500 : 400}
        bodyStyle={{ padding: '0px 0px' }}
      >
        <Call />
      </Modal>
    </div>
  );
};

export default TestAgentCall
