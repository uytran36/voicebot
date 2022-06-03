/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable no-else-return */
/* eslint-disable prefer-template */
/* eslint-disable no-var */
/* eslint-disable default-case */
/* eslint-disable react/prop-types */
/* eslint-disable lines-between-class-members */
import { Avatar, Col, Image, Layout, List, message, Row, Typography } from 'antd';
import _ from 'lodash';
import React from 'react';
import { connect } from 'umi';
import { bindActionCreators } from 'redux';
// import { actionGetListMessage, actionGetListRoom, actionGetRoomInfo } from '../../actions/index';
import { ArrowDownOutlined, LoadingOutlined, PlayCircleOutlined } from '@ant-design/icons';
// import InfiniteScroll from "react-infinite-scroller";
const { Content } = Layout;

function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text?.split(urlRegex);
  for (let i = 1; i < parts?.length; i += 2) {
    parts[i] = (
      <a key={'link' + i} target="_blank" rel="noopener noreferrer" href={parts[i]}>
        {parts[i]}
      </a>
    );
  }
  return parts;
}
const logAction = {
  APPROVED: 'chấp nhận tin nhắn',
  FORWARDED: 'chuyển tiếp tin nhắn',
  ALLOW: 'chấp nhận chuyển tiếp',
  DENIED: 'từ chối chuyển tiếp',
  CLOSED: 'đã chuyển tin sang trạng thái hoàn thành',
  LIVECHAT_CLOSED: 'đã rời khỏi cuộc trò chuyện',
};

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      messagesSearch: [],
      rooms: [],
      roomInfo: null,
      userId: null,
      authToken: null,
      websocket: null,
      data: [],
      loading: false,
      hasMore: true,
      files: [],
      week: [],
      imageReview: null,
      search: '',
      statusScroll: false,
      next: null,
      scrollHeight: 0,
    };
  }
  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.next !== null && nextProps.next !== this.state.next) {
      this.setState({ next: nextProps.next });
    }
    if (nextProps.files && nextProps.files !== this.state.files) {
      this.setState({ files: nextProps.files });
    }

    if (!_.isEmpty(nextProps.listMessage)) {
      this.setState({ messages: JSON.parse(nextProps.listMessage) });
    }
    if (_.isEmpty(nextProps.listMessage)) {
      this.setState({ messages: [] });
    }
    if (!_.isEmpty(nextProps.messagesSearch)) {
      this.setState({ messagesSearch: JSON.parse(nextProps.messagesSearch) });
    }

    // load more message
    if (
      (!_.isEmpty(this.state.messages) &&
        nextProps.listMesssage !== this.state.messages &&
        this.state.loading === true) ||
      (_.isEmpty(this.state.messages) && !this.props.loadingMessage && this.state.loading === true)
    ) {
      this.setState({ loading: false });
    }
    if (nextProps.websocket) {
      this.setState({ websocket: nextProps.websocket });
    }
  };
  componentDidUpdate = async (prevProps, prevState, snapshot) => {
    if (
      !_.isEmpty(this.state.messages) &&
      !this.props.statusScroll &&
      this.state.messages.length <= 30
    ) {
      let elment = document.getElementById(this.props.keyChat);
      elment.scrollTop = elment.scrollHeight - elment.clientHeight;
      this.props.handleStatusScroll(true);
      const myInterval = setInterval(() => {
        if (elment.scrollTop != elment.scrollHeight - elment.clientHeight) {
          elment.scrollTop = elment.scrollHeight - elment.clientHeight;
        } else {
          clearInterval(myInterval);
        }
      }, 100);
    }
    // if (
    //   this.state.messages !== null &&
    //   this.state.messages.length > 0 &&
    //   prevProps.listMessage &&
    //   this.state.messages.length > JSON.parse(prevProps.listMessage).length &&
    //   this.state.messages.length <= 30
    // ) {
    //   let elment = document.getElementById(this.props.keyChat);
    //   elment.scrollTop = elment.scrollHeight;
    //   this.props.handleStatusScroll(true);
    // }
  };
  filterSearch = (data) => {
    let tpm = null;
    let list = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      tpm = document.getElementById(element._id);
      list.push(tpm);
    }
    if (list.length > 0) {
      document.getElementById('chathub-widget-chatBot').scrollTop = list[0].offsetTop;
    }
  };
  componentDidMount() {
    this.dateWeek();
    this.setState({ messages: JSON.parse(this.props.listMessage) });
  }
  isURL = (str) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(str);
  };
  loadMoreMessage = () => {
    if (
      document.getElementById(this.props.keyChat).scrollTop === 0 &&
      !_.isEmpty(this.state.messages) &&
      this.state.next !== 'error'
    ) {
      this.setState({ loading: true });
      this.props.dispatch({
        type: 'rocketChat/loadMoreMessage',
        headers: {
          Authorization: this.props.authorization,
        },
        lastMessage: {
          message: this.state.messages[0],
        },
      });
    }
  };
  replacePayloadURL = (url) => {
    return url?.includes('https') ? url : url?.replace('http', 'https');
  };
  formatAMPM = (date) => {
    var dateNow = new Date();
    var _date = new Date(date?.$date || date);
    if (_date.toDateString() !== dateNow.toDateString()) {
      return this.converDate(_date);
    }
    var hours = _date.getHours();
    var minutes = _date.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours < 10 ? '0' + hours : hours;
    var strTime = hours + ':' + minutes;
    return strTime;
  };
  formatDate = (date) => {
    const dateNow = new Date();
    if (date.toDateString() !== dateNow.toDateString()) {
      return this.converDate(date);
    }
    const hours = date.getHours();
    let minutes = date.getMinutes();
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes}`;
    return strTime;
  };
  converDate = (time) => {
    var inWeek = this.state.week.findIndex((value) => value === time.toDateString());
    var hours = time.getHours();
    var minutes = time.getMinutes();
    minutes = minutes < 10 ? '0' + minutes : minutes;
    hours = hours < 10 ? '0' + hours : hours;
    var strTime = hours + ':' + minutes;
    if (inWeek > -1) {
      switch (inWeek) {
        case 0:
          return 'Th2 ' + strTime;
        case 1:
          return 'Th3 ' + strTime;
        case 2:
          return 'Th4 ' + strTime;
        case 3:
          return 'Th5 ' + strTime;
        case 4:
          return 'Th6 ' + strTime;
        case 5:
          return 'Th7 ' + strTime;
        case 6:
          return 'CN ' + strTime;
      }
    }
    if (typeof time == 'object') {
      return (
        `${time.getDate() / 10 >= 1 ? time.getDate() : '0' + time.getDate()}/${
          (time.getMonth() + 1) / 10 >= 1 ? time.getMonth() + 1 : `0${time.getMonth() + 1}`
        }/${time.getFullYear()}` +
        ' ' +
        strTime
      );
    }
    return '';
  };
  dateWeek = () => {
    let curr = new Date();
    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i;
      let day = new Date(curr.setDate(first)).toDateString();
      this.state.week.push(day);
    }
  };

  handleInfiniteOnLoad = () => {};

  renderLogAction = (item) => {
    return (
      item?.actionRoomDtos?.length > 0 &&
      item?.actionRoomDtos.map((itemAction) => {
        return (
          <Row key={item.mid}>
            <Col span={18} offset={3}>
              <div className="message-command">
                <div style={{ display: 'grid' }}>
                  <span>
                    {this.formatDate(
                      new Date(
                        typeof itemAction.timestamp === 'object'
                          ? itemAction.timestamp?.$date
                          : itemAction.timestamp,
                      ),
                    )}
                  </span>
                  <span>
                    {' '}
                    <span className="text-highlight">{itemAction.username}</span>{' '}
                    {logAction[itemAction.type]}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        );
      })
    );
  };

  render() {
    // console.log(this.props)
    let { messages, files } = this.state;
    let { typeRoom, roomInfoOffline, typeSocial, roomInfo } = this.props;
    let indexTmp = 0;
    let indexTmpUser = 0;
    const loader = (
      <LoadingOutlined
        style={{
          padding: '30px',
          position: 'relative',
          display: 'block',
          fontSize: '30px',
        }}
      />
    );
    return (
      <Content className="site-layout-background chat-content">
        <div
          id={this.props.keyChat}
          className="msg-content-container"
          onScroll={this.loadMoreMessage}
        >
          {this.state.loading ? loader : null}
          {roomInfo && messages && messages?.length > 0 ? (
            <List id="messageSoial">
              {roomInfo?.actionRoomDtos?.length > 0 ? (
                roomInfo?.actionRoomDtos[0]?.mid === null ? (
                  <Row>
                    <Col span={18} offset={3}>
                      <div className="message-command">
                        <div style={{ display: 'grid' }}>
                          <span>
                            {this.formatDate(
                              new Date(
                                typeof roomInfo.actionRoomDtos[0].timestamp === 'object'
                                  ? roomInfo.actionRoomDtos[0].timestamp?.$date
                                  : roomInfo.actionRoomDtos[0].timestamp,
                              ),
                            )}
                          </span>
                          <span>
                            {' '}
                            <span className="text-highlight">
                              {roomInfo.actionRoomDtos[0].username}
                            </span>{' '}
                            {logAction[roomInfo.actionRoomDtos[0].type]}
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                ) : null
              ) : null}
              {messages.map((item, index) => {
                let roomData = null;
                let flagLast = false;
                // tin nhắn của những account #
                if (item.senderId && roomInfo.customFields.dataInfoDto.id === item.senderId) {
                  // tin nhắn đầu tiên: set roomData (timestamp, tên visitor)
                  if (index == 0) {
                    indexTmp = index;
                    roomData = (
                      <>
                        <Row key={'time' + index}>
                          <Col span={18} offset={3}>
                            <div className="message-command">
                              {this.formatDate(
                                new Date(
                                  typeof item.timestamp === 'object'
                                    ? item.timestamp?.$date
                                    : item.timestamp,
                                ),
                              )}
                            </div>
                          </Col>
                        </Row>
                        <Row key={'username' + index}>
                          <Col span={1} />
                          <Col span={22}>
                            <p className="user-name-message">
                              {item.alias ? '' : roomInfo.customFields.dataInfoDto.name}
                            </p>
                          </Col>
                        </Row>
                      </>
                    );
                  }

              
                  // tin nhắn ở giữa của agent
                  if (index > 0 && messages[index].senderId !== messages[index - 1].senderId) {
                    // const diff =  - new Date(messages[index].timestamp);
                    // console.log(diff);
                    indexTmp = index;
                    roomData = (
                      <>
                        {/* Hiển thị thời gian chat */}
                        {/* <Row key={'time' + index}>
                          <Col span={18} offset={3}>
                            <div className="message-command">
                              {this.formatDate(
                                new Date(
                                  typeof item.timestamp === 'object'
                                    ? item.timestamp?.$date
                                    : item.timestamp,
                                ),
                              )}
                            </div>
                          </Col>
                        </Row> */}
                        {/* Hiển thị username  chat */}

                        <Row key={'username' + index}>
                          <Col span={1} />
                          <Col span={22}>
                            <p className="user-name-message">
                              {item.alias ? '' : roomInfo.customFields.dataInfoDto.name}
                            </p>
                          </Col>
                        </Row>
                      </>
                    );
                  }

                  if (index > 0) {
                    const diff =
                      Math.abs(
                        new Date(messages[index].timestamp) -
                          new Date(messages[index - 1].timestamp),
                      ) / 60000;

                    if (diff >= 15) {
                      indexTmp = index;
                      roomData = (
                        <>
                          {/* Hiển thị thời gian chat */}
                          <Row key={'time' + index}>
                            <Col span={18} offset={3}>
                              <div className="message-command">
                                {this.formatDate(
                                  new Date(
                                    typeof item.timestamp === 'object'
                                      ? item.timestamp?.$date
                                      : item.timestamp,
                                  ),
                                )}
                              </div>
                            </Col>
                          </Row>
                          {/* Hiển thị username  chat */}

                          <Row key={'username' + index}>
                            <Col span={1} />
                            <Col span={22}>
                              <p className="user-name-message">
                                {item.alias ? '' : roomInfo.customFields.dataInfoDto.name}
                              </p>
                            </Col>
                          </Row>
                        </>
                      );
                    }
                  }
                  // flag tin nhắn cuối của 1 loạt tin nhắn thuộc về 1 bên
                  if (
                    index > 0 &&
                    index < messages.length - 1 &&
                    messages[index].senderId !== messages[index + 1].senderId
                  ) {
                    flagLast = true;
                  }
                  if (
                    index > 0 &&
                    index < messages.length - 1
                  ) {
                    const diff =
                      Math.abs(
                        new Date(messages[index + 1].timestamp) -
                          new Date(messages[index].timestamp),
                      ) / 60000;
                    if (diff >= 15) {
                      flagLast = true;
                    }
                  }

                  // flag tin nhắn cuối của đoạn chat
                  if (index > 0 && messages.length - 1 === index) {
                    flagLast = true;
                  }

                  // tin nhắn có attach
                  if (
                    item.attachments &&
                    item.attachments.length > 0 &&
                    item.attachments[0].type !== null
                  ) {
                    // ảnh
                    return (
                      <div key={item.mid}>
                        {roomData}
                        <Row align="middle" id={item.mid}>
                          <Col span={1}>
                            {roomData ? (
                              roomInfo.type === 'LIVECHAT' ? (
                                <Avatar
                                  size="default"
                                  className="avatar-message"
                                  style={{
                                    backgroundColor: `#${Math.floor(
                                      roomInfo.customFields.dataInfoDto.name.charCodeAt(0) * 50000,
                                    ).toString(16)}`,
                                  }}
                                >
                                  {roomInfo.customFields.dataInfoDto.name.split(' ')[0].length < 8
                                    ? roomInfo.customFields.dataInfoDto.name.split(' ')[0]
                                    : roomInfo.customFields.dataInfoDto.name
                                        .split(' ')[0]
                                        .slice(0, 8)}
                                </Avatar>
                              ) : (
                                <Avatar
                                  size="default"
                                  className="avatar-message"
                                  src={roomInfo.customFields.dataInfoDto.profilePic}
                                />
                              )
                            ) : null}
                          </Col>
                          {item.attachments[0].type === 'sticker' ||
                          item.attachments[0].type === 'image' ||
                          item.attachments[0].type === 'gif' ? (
                            <Col span={22}>
                              <div className="message-customer-image">
                                <Image
                                  preview={true}
                                  width={170}
                                  // src={
                                  //   roomInfo.type !== 'LIVECHAT'
                                  //     ? item.attachments[0].payloadUrl
                                  //     : process.env.UMI_API_BASE_URL +
                                  //       '/smcc-chat-service/' +
                                  //       item.attachments[0].payloadUrl
                                  // }
                                  src={item?.attachments[0]?.payloadUrl}
                                />
                              </div>
                            </Col>
                          ) : item.attachments[0].type === 'video' ? (
                            <Col>
                              <div className="message-customer-image">
                                <video
                                  id="video"
                                  autoPlay={false}
                                  width={170}
                                  disablePictureInPicture={true}
                                  controls={true}
                                >
                                  <source src={item?.attachments[0]?.payloadUrl} type="video/mp4" />
                                </video>
                                {/* <PlayCircleOutlined className="icon-play-video-chat-agent" /> */}
                              </div>
                            </Col>
                          ) : item.attachments[0].type === 'audio' ? (
                            <Col>
                              <div className="message-customer-image">
                                <audio
                                  id="audio"
                                  autoPlay={false}
                                  width={170}
                                  disablePictureInPicture={true}
                                  controls={true}
                                >
                                  <source src={item?.attachments[0]?.payloadUrl} type="audio/mp3" />
                                </audio>
                                {/* <PlayCircleOutlined className="icon-play-video-chat-agent" /> */}
                              </div>
                            </Col>
                          ) : item.attachments[0].type === 'link' ? (
                            <Col span={22}>
                              <div
                                id={item.mid}
                                className={`message-${
                                  item.senderId === roomInfo.customFields.dataInfoDto.id
                                    ? 'customer'
                                    : 'agent'
                                } message-text--${
                                  item.senderId === roomInfo.customFields.dataInfoDto.id
                                    ? 'customer'
                                    : 'agent'
                                }-first`}
                              >
                                <a
                                  href={this.replacePayloadURL(item?.attachments[0]?.payloadUrl)}
                                  target="_blank"
                                >
                                  {item.attachments[0].title ? item.attachments[0].title : 'Link'}
                                </a>
                              </div>
                            </Col>
                          ) : item.attachments[0].type === 'file' ? (
                            <Col span={22}>
                              <div
                                id={item.mid}
                                className={`message-${
                                  item.senderId === roomInfo.customFields.dataInfoDto.id
                                    ? 'customer'
                                    : 'agent'
                                } message-text--${
                                  item.senderId === roomInfo.customFields.dataInfoDto.id
                                    ? 'customer'
                                    : 'agent'
                                }-first`}
                              >
                                <a
                                  href={this.replacePayloadURL(item?.attachments[0]?.payloadUrl)}
                                  target="_blank"
                                >
                                  {item.attachments[0].title
                                    ? item.attachments[0].title
                                    : 'File đính kèm'}
                                </a>
                              </div>
                            </Col>
                          ) : null}
                        </Row>
                        {item.text ? (
                          <Row>
                            <Col span={1} />
                            <Col span={22}>
                              <div
                                id={item.mid}
                                className={`message-${
                                  item.senderId === roomInfo.customFields.dataInfoDto.id
                                    ? 'customer'
                                    : 'agent'
                                } message-text--${
                                  item.senderId === roomInfo.customFields.dataInfoDto.id
                                    ? 'customer'
                                    : 'agent'
                                }-first`}
                              >
                                {urlify(item.text)}
                              </div>
                            </Col>
                          </Row>
                        ) : null}
                        {flagLast ? (
                          <Row>
                            <Col offset={1}>
                              <div className="message-text--customer-last-description">
                                {this.formatDate(
                                  new Date(
                                    typeof item.timestamp === 'object'
                                      ? item.timestamp?.$date
                                      : item.timestamp,
                                  ),
                                )}{' '}
                              </div>
                            </Col>
                          </Row>
                        ) : null}
                        {this.renderLogAction(item)}
                      </div>
                    );
                  }
                  return (
                    // note
                    <div key={item.mid}>
                      {roomData}
                      <Row>
                        <Col span={1}>
                          {roomData ? (
                            roomInfo.type === 'LIVECHAT' ? (
                              <Avatar
                                size="default"
                                className="avatar-message"
                                style={{
                                  backgroundColor: `#${Math.floor(
                                    roomInfo.customFields.dataInfoDto.name.charCodeAt(0) * 50000,
                                  ).toString(16)}`,
                                }}
                              >
                                {roomInfo.customFields.dataInfoDto.name.split(' ')[0].length < 8
                                  ? roomInfo.customFields.dataInfoDto.name.split(' ')[0]
                                  : roomInfo.customFields.dataInfoDto.name
                                      .split(' ')[0]
                                      .slice(0, 8)}
                              </Avatar>
                            ) : (
                              <Avatar
                                size="default"
                                className="avatar-message"
                                src={roomInfo.customFields.dataInfoDto.profilePic}
                              />
                            )
                          ) : null}
                        </Col>
                        <Col span={22}>
                          <div
                            id={item.mid}
                            className={`message-${
                              item.senderId === roomInfo.customFields.dataInfoDto.id
                                ? 'customer'
                                : 'agent'
                            } message-text--${
                              item.senderId === roomInfo.customFields.dataInfoDto.id
                                ? 'customer'
                                : 'agent'
                            }-first`}
                          >
                            {urlify(item.text)}
                          </div>
                        </Col>
                      </Row>
                      {flagLast ? (
                        <Row>
                          <Col offset={1}>
                            <div className="message-text--customer-last-description">
                              {this.formatDate(
                                new Date(
                                  typeof item.timestamp === 'object'
                                    ? item.timestamp?.$date
                                    : item.timestamp,
                                ),
                              )}{' '}
                            </div>
                          </Col>
                        </Row>
                      ) : null}
                      {this.renderLogAction(item)}
                    </div>
                  );
                } else {
                  // Tin nhắn của agent

                  //tin nhắn kết thúc
                  // if (item.t && item.t === 'agent_close_room') {
                  //   return (
                  //     <Row key={item.mid || null}>
                  //       <Col span={18} offset={3}>
                  //         <div className="message-command">
                  //           <div style={{ display: 'grid' }}>
                  //             <span>
                  //               {this.formatDate(
                  //                 new Date(
                  //                   typeof item.timestamp === 'object'
                  //                     ? item.timestamp?.$date
                  //                     : item.timestamp,
                  //                 ),
                  //               )}
                  //             </span>
                  //             <span>
                  //               Bạn đã chuyển tin nhắn sang trạng thái{' '}
                  //               <span className="text-highlight">Hoàn Thành</span>{' '}
                  //             </span>
                  //           </div>
                  //         </div>
                  //       </Col>
                  //     </Row>
                  //   );
                  // }
                  // tin nhắn của chuyển tiếp
                  // if (item.t && item.t === 'livechat_transfer_history') {
                  //   return (
                  //     <Row key={item.mid || null}>
                  //       <Col span={18} offset={3}>
                  //         <div className="message-command">
                  //           <div style={{ display: 'grid' }}>
                  //             <span>
                  //               {this.formatDate(
                  //                 new Date(
                  //                   typeof item.timestamp === 'object'
                  //                     ? item.timestamp?.$date
                  //                     : item.timestamp,
                  //                 ),
                  //               )}
                  //             </span>
                  //             <span>
                  //               {' '}
                  //               Bạn đã chuyển tiếp tin nhắn cho{' '}
                  //               <span className="text-highlight">{item.ufw}</span>
                  //             </span>
                  //           </div>
                  //         </div>
                  //         {/* <div className='message-command'>Yêu cầu của khách hàng đã đc giải quyết {this.formatDate(
                  //                 new Date(
                  //                   typeof item.timestamp === 'object'
                  //                     ? item.timestamp?.$date
                  //                     : item.timestamp,
                  //                 ),
                  //               )}</div> */}
                  //       </Col>
                  //     </Row>
                  //   );
                  // }
                  // if (item.t && item.t === 'receive_transition') {
                  //   return (
                  //     <Row key={item.mid || null}>
                  //       <Col span={18} offset={3}>
                  //         <div className="message-command">
                  //           <div style={{ display: 'grid' }}>
                  //             <span>
                  //               {this.formatDate(
                  //                 new Date(
                  //                   typeof item.timestamp === 'object'
                  //                     ? item.timestamp?.$date
                  //                     : item.timestamp,
                  //                 ),
                  //               )}
                  //             </span>
                  //             <span>
                  //               {' '}
                  //               <span className="text-highlight">Bạn</span> chấp nhận tin nhắn{' '}
                  //             </span>
                  //           </div>
                  //         </div>
                  //       </Col>
                  //     </Row>
                  //   );
                  // }

                  if (index > 0) {
                    const diff =
                      Math.abs(
                        new Date(messages[index].timestamp) -
                          new Date(messages[index - 1].timestamp),
                      ) / 60000;
                    if (diff >= 15) {
                      indexTmp = index;
                      roomData = (
                        <>
                          {/* Hiển thị thời gian chat */}
                          <Row key={'time' + index}>
                            <Col span={18} offset={3}>
                              <div className="message-command">
                                {this.formatDate(
                                  new Date(
                                    typeof item.timestamp === 'object'
                                      ? item.timestamp?.$date
                                      : item.timestamp,
                                  ),
                                )}
                              </div>
                            </Col>
                          </Row>
                        </>
                      );
                    }
                  }
                  // tin nhắn đầu tiên trong loạt tin nhắn mới
                  // if (index > 0 && messages[index].senderId !== messages[index - 1].senderId) {
                  //   indexTmp = index;
                  //   roomData = (
                  //     <>
                  //       {/* Hiển thị thời gian chat */}
                  //       <Row key={'time' + index}>
                  //         <Col span={18} offset={3}>
                  //           <div className="message-command">
                  //             {this.formatDate(
                  //               new Date(
                  //                 typeof item.timestamp === 'object'
                  //                   ? item.timestamp?.$date
                  //                   : item.timestamp,
                  //               ),
                  //             )}
                  //           </div>
                  //         </Col>
                  //       </Row>
                  //     </>
                  //   );
                  // }

                  // flag tin nhắn cuối trong loạt tin nhắn
                  if (
                    index > 0 &&
                    index < messages.length - 2 &&
                    messages[index].senderId !== messages[index + 1].senderId
                  ) {
                    flagLast = true;
                  }
                  if (
                    index > 0 &&
                    index < messages.length - 1
                  ) {
                    const diff =
                      Math.abs(
                        new Date(messages[index + 1].timestamp) -
                          new Date(messages[index].timestamp),
                      ) / 60000;
                    if (diff >= 15) {
                      flagLast = true;
                    }
                  }
                  // flag tin nhắn cuối cùng
                  if (index > 0 && messages.length - 1 === index) {
                    flagLast = true;
                  }
                  // if (index > 0 && )
                  // agent attachments
                  if (
                    item.attachments &&
                    item.attachments.length > 0 &&
                    item.attachments[0].type !== null
                  ) {
                    if (
                      item.attachments[0].type === 'image' ||
                      item.attachments[0].type === 'sticker' ||
                      item.attachments[0].type === 'gif'
                    ) {
                      return (
                        <div key={item.mid}>
                          {roomData}
                          <Row className="chat-text" id={item.mid}>
                            <div className="message-user-image">
                              <Image
                                preview={true}
                                width={170}
                                src={item?.attachments[0]?.payloadUrl}
                              />
                            </div>
                          </Row>
                          {flagLast ? (
                            <Row className="chat-text">
                              <div className="message-user-description message-text--user-last-description">
                                {this.formatDate(
                                  new Date(
                                    typeof item.timestamp === 'object'
                                      ? item.timestamp?.$date
                                      : item.timestamp,
                                  ),
                                )}
                              </div>
                            </Row>
                          ) : null}
                          {this.renderLogAction(item)}
                        </div>
                      );
                    }
                    if (item.attachments[0].type === 'video') {
                      return (
                        <div key={item.mid}>
                          {roomData}
                          <Row className="chat-text" id={item.mid}>
                            <div className="message-user-image">
                              <video
                                id="video"
                                autoPlay={false}
                                width={170}
                                disablePictureInPicture={true}
                                controls={true}
                              >
                                <source src={item?.attachments[0]?.payloadUrl} type="video/mp4" />
                              </video>
                            </div>
                          </Row>
                          {flagLast ? (
                            <Row className="chat-text">
                              <div className="message-user-description message-text--user-last-description">
                                {this.formatDate(
                                  new Date(
                                    typeof item.timestamp === 'object'
                                      ? item.timestamp?.$date
                                      : item.timestamp,
                                  ),
                                )}
                              </div>
                            </Row>
                          ) : null}
                          {this.renderLogAction(item)}
                        </div>
                      );
                    }
                    if (item.attachments[0].type === 'audio') {
                      return (
                        <div key={item.mid}>
                          {roomData}
                          <Row className="chat-text" id={item.mid}>
                            <div className="message-user-image">
                              <audio
                                id="audio"
                                autoPlay={false}
                                width={170}
                                disablePictureInPicture={true}
                                controls={true}
                              >
                                <source src={item?.attachments[0]?.payloadUrl} type="audio/mp3" />
                              </audio>
                            </div>
                          </Row>
                          {flagLast ? (
                            <Row className="chat-text">
                              <div className="message-user-description message-text--user-last-description">
                                {this.formatDate(
                                  new Date(
                                    typeof item.timestamp === 'object'
                                      ? item.timestamp?.$date
                                      : item.timestamp,
                                  ),
                                )}
                              </div>
                            </Row>
                          ) : null}
                          {this.renderLogAction(item)}
                        </div>
                      );
                    }
                    if (item.attachments[0].type === 'link') {
                      return (
                        <div key={item.mid}>
                          {roomData}
                          <Row className="chat-text" id={item.mid}>
                            <div className="message-user message-text--user-first">
                              <a
                                href={this.replacePayloadURL(item?.attachments[0]?.payloadUrl)}
                                target="_blank"
                              >
                                <span style={{ color: 'white' }}>{item.attachments[0].title}</span>
                                <span className="file-attachment--download mr-2">
                                  <ArrowDownOutlined style={{ color: 'white' }} />
                                </span>
                              </a>
                            </div>
                          </Row>
                          {flagLast ? (
                            <Row className="chat-text">
                              <div className="message-user-description message-text--user-last-description">
                                {this.formatDate(
                                  new Date(
                                    typeof item.timestamp === 'object'
                                      ? item.timestamp?.$date
                                      : item.timestamp,
                                  ),
                                )}
                              </div>
                            </Row>
                          ) : null}
                          {this.renderLogAction(item)}
                        </div>
                      );
                    }
                    if (item.attachments[0].type === 'file') {
                      return (
                        <div key={item.mid}>
                          {roomData}
                          <Row className="chat-text" id={item.mid}>
                            <div className="message-user message-text--user-first">
                              <a
                                href={this.replacePayloadURL(item?.attachments[0]?.payloadUrl)}
                                target="_blank"
                              >
                                <span style={{ color: 'white' }}>{item.attachments[0].title}</span>
                                <span className="file-attachment--download mr-2">
                                  <ArrowDownOutlined style={{ color: 'white' }} />
                                </span>
                              </a>
                            </div>
                          </Row>
                          {flagLast ? (
                            <Row className="chat-text">
                              <div className="message-user-description message-text--user-last-description">
                                {this.formatDate(
                                  new Date(
                                    typeof item.timestamp === 'object'
                                      ? item.timestamp?.$date
                                      : item.timestamp,
                                  ),
                                )}
                              </div>
                            </Row>
                          ) : null}
                          {this.renderLogAction(item)}
                        </div>
                      );
                    }

                    return (
                      // note
                      <div key={item.mid}>
                        {roomData}
                        <Row>
                          <Col span={1}>
                            {roomData ? (
                              roomInfo.type === 'LIVECHAT' ? (
                                <Avatar
                                  size="default"
                                  className="avatar-message"
                                  style={{
                                    backgroundColor: `#${Math.floor(
                                      roomInfo.customFields.dataInfoDto.name.charCodeAt(0) * 50000,
                                    ).toString(16)}`,
                                  }}
                                >
                                  {roomInfo.customFields.dataInfoDto.name.split(' ')[0].length < 8
                                    ? roomInfo.customFields.dataInfoDto.name.split(' ')[0]
                                    : roomInfo.customFields.dataInfoDto.name
                                        .split(' ')[0]
                                        .slice(0, 8)}
                                </Avatar>
                              ) : (
                                <Avatar
                                  size="default"
                                  className="avatar-message"
                                  src={roomInfo.customFields.dataInfoDto.profilePic}
                                />
                              )
                            ) : null}
                          </Col>
                          <Col span={22}>
                            <div
                              id={item.mid}
                              className={`message-${
                                item.senderId === roomInfo.customFields.dataInfoDto.id
                                  ? 'customer'
                                  : 'agent'
                              } message-text--${
                                item.senderId === roomInfo.customFields.dataInfoDto.id
                                  ? 'customer'
                                  : 'agent'
                              }-first`}
                            >
                              {urlify(item.text)}
                            </div>
                          </Col>
                        </Row>
                        {flagLast ? (
                          <Row>
                            <Col offset={1}>
                              <div className="message-text--user-last-description">
                                {this.formatDate(
                                  new Date(
                                    typeof item.timestamp === 'object'
                                      ? item.timestamp?.$date
                                      : item.timestamp,
                                  ),
                                )}{' '}
                              </div>
                            </Col>
                          </Row>
                        ) : null}
                        {this.renderLogAction(item)}
                      </div>
                    );
                  } else {
                    return (
                      // text agent
                      <div>
                        {roomData}
                        <Row className="chat-text">
                          <div id={item.mid} className={'message-user message-text--user-first'}>
                            {item.text}
                          </div>
                        </Row>
                        {flagLast ? (
                          <Row className="chat-text">
                            <div className="message-user-description message-text--user-last-description">
                              {this.formatDate(
                                new Date(
                                  typeof item.timestamp === 'object'
                                    ? item.timestamp?.$date
                                    : item.timestamp,
                                ),
                              )}
                            </div>
                          </Row>
                        ) : null}
                        {this.renderLogAction(item)}
                      </div>
                    );
                  }
                }
              })}
            </List>
          ) : !this.props.loadingMessage ? (
            loader
          ) : roomInfo?.actionRoomDtos ? (
            <>{this.renderLogAction(roomInfo)}</>
          ) : null}
        </div>
      </Content>
    );
  }
}

const mapStateToProps = ({ websocket, rocketChat, user }) => {
  return {
    websocket: websocket.socket,
    listRoom: rocketChat.listRoom,
    roomInfo: rocketChat.roomInfo,
    listMessage: rocketChat.listMessage,
    loadingMessage: rocketChat.loadingMessage,
    messagesSearch: rocketChat.listMessagesSearch,
    authorization: user.tokenGateway,
    next: rocketChat.keyNextMessage,
  };
};
// const mapDispatchToProps = (dispatch) => {
//   return {
//     getListMessage: bindActionCreators(actionGetListMessage, dispatch),
//     getListRoom: bindActionCreators(actionGetListRoom, dispatch),
//     getRoomInfo: bindActionCreators(actionGetRoomInfo, dispatch),
//   };
// };
export default connect(mapStateToProps)(Chat);
