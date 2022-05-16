import React from 'react';
import { Timeline, Row, Col } from 'antd';
import style from './style.less';

const History = () => {
  const mock = [
    {
      content: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.',
      dateTime: '08/03/2021',
      time: '11:00',
      type: 'outgoing',
      duration: 12,
      status: 'done',
    },
    {
      content: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.',
      dateTime: '08/03/2021',
      time: '12:00',
      type: 'outgoing',
      duration: 12,
      status: 'not-done',
    },
    {
      content: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.',
      dateTime: '08/03/2021',
      time: '13:00',
      type: 'outgoing',
      duration: 12,
      status: 'done',
    },
    {
      content: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.',
      dateTime: '08/03/2021',
      time: '15:00',
      type: 'outgoing',
      duration: 12,
      status: 'done',
    },
    // {
    //   content: 'Lorem ipsum dolor sit amet, consecte adipiscing elit.',
    //   dateTime: '08/03/2021',
    //   time: '15:00',
    //   type: 'outgoing',
    //   duration: 12,
    //   status: 'done',
    // },
  ];

  return (
    <div className={style['timeline-wrapper']}>
      <Timeline>
        {mock.map((item) => (
          <Timeline.Item color={item.status === 'done' ? 'green' : 'blue'}>
            <div>
              {item.dateTime} {item.time}
            </div>
            <Row>
              <Col span={21}>
                {item.type === 'outgoing' ? (
                  <div style={{ color: '#1DAEFF' }}>Cuộc gọi ra</div>
                ) : (
                  <div style={{ color: '#24FF89' }}>Cuộc gọi vào</div>
                )}
                <div>{item.content}</div>
              </Col>
              <Col span={3}>{item.duration}</Col>
            </Row>
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  );
};

export default History;
