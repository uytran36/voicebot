/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable prefer-template */
/* eslint-disable lines-between-class-members */
import React from 'react';
import reqwest from 'reqwest';
import { connect } from 'umi';
// import { bindActionCreators } from 'redux';
// import * as ActionSaga from '../../actions/index';
import {
  Layout,
  Row,
  Col,
  Button,
  Modal,
  AutoComplete,
  Input,
  Typography,
  Select,
  Badge,
  Avatar,
  Spin,
  notification,
} from 'antd';
import Icon, {
  ArrowDownOutlined,
  DownloadOutlined,
  DownOutlined,
  ExclamationCircleFilled,
  ExclamationCircleOutlined,
  PhoneFilled,
  SearchOutlined,
  UpOutlined,
  UserOutlined,
} from '@ant-design/icons';
import * as IdSocket from '../../constants/IdSocket.js';
import * as API from '../../constants/Api.js';
import * as TYPE_ROOM_WIDGET from '../../constants/TypeRoomWidget.js';
const { Header } = Layout;
const { Option } = Select;
const IconTransfer = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2.8178 20.3348C1.35117 22.2858 0.666992 24 0.666992 24C0.666992 22.448 0.734561 20.9773 0.879721 19.5979C1.71305 11.679 5.10356 6.76923 12.9477 6.76923V0L24.0003 11.0769L12.9477 21.5385V14.7692C12.2488 14.7692 11.5823 14.8302 10.9477 14.9424C7.1403 15.615 4.47784 18.1266 2.8178 20.3348ZM3.37786 16.7132C5.59856 14.6301 8.7605 12.7692 12.9477 12.7692H14.9477V16.8916L21.1341 11.036L14.9477 4.83593V8.76923H12.9477C8.91827 8.76923 6.53568 10.198 5.03823 12.5392C4.31765 13.6658 3.76658 15.0588 3.37786 16.7132Z"
      fill="black"
      fillOpacity="0.65"
    />
  </svg>
);
const IconRollBackTransfer = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.9001 23.8715L7.58197 19.6677H2.85241C1.54931 19.6677 0.5 18.6373 0.5 17.3837V2.28397C0.5 1.03039 1.54931 0 2.85241 0H20.9479C22.2509 0 23.3003 1.03039 23.3003 2.28397V17.3837C23.3003 18.6373 22.2509 19.6677 20.9479 19.6677H16.2183L11.9001 23.8715ZM15.3372 17.6164H21.1805V2.05131H2.61975V17.6164H8.4631L11.9001 20.9624L15.3372 17.6164Z"
      fill="black"
      fillOpacity="0.65"
    />
    <path
      d="M12.4317 7.024C11.473 7.03035 10.5257 7.2392 9.64874 7.63759C8.77174 8.03598 7.98365 8.61543 7.33333 9.34L5 7V13H10.8333L8.5 10.6C9.10421 9.89335 9.87817 9.36221 10.7445 9.05969C11.6109 8.75716 12.5392 8.69384 13.4368 8.87606C14.3344 9.05828 15.1698 9.47965 15.8594 10.0981C16.5491 10.7165 17.0688 11.5102 17.3667 12.4L19 11.872C18.5271 10.4644 17.6414 9.24235 16.465 8.37409C15.2887 7.50584 13.8795 7.03415 12.4317 7.024Z"
      fill="black"
      fillOpacity="0.65"
    />
  </svg>
);
const IconSearch = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21.6504 20.1775L14.6942 13.2212C15.7736 11.8257 16.3576 10.1194 16.3576 8.32478C16.3576 6.17656 15.5192 4.16228 14.0031 2.64353C12.487 1.12478 10.4674 0.289062 8.32185 0.289062C6.17631 0.289062 4.15667 1.12746 2.6406 2.64353C1.12185 4.1596 0.286133 6.17656 0.286133 8.32478C0.286133 10.4703 1.12453 12.49 2.6406 14.006C4.15667 15.5248 6.17363 16.3605 8.32185 16.3605C10.1165 16.3605 11.8201 15.7766 13.2156 14.6998L20.1718 21.6533C20.1922 21.6738 20.2165 21.6899 20.2431 21.701C20.2698 21.712 20.2983 21.7177 20.3272 21.7177C20.3561 21.7177 20.3846 21.712 20.4113 21.701C20.4379 21.6899 20.4622 21.6738 20.4826 21.6533L21.6504 20.4882C21.6708 20.4678 21.687 20.4436 21.6981 20.4169C21.7091 20.3902 21.7148 20.3617 21.7148 20.3328C21.7148 20.304 21.7091 20.2754 21.6981 20.2487C21.687 20.2221 21.6708 20.1979 21.6504 20.1775ZM12.5647 12.5676C11.429 13.7007 9.92363 14.3248 8.32185 14.3248C6.72006 14.3248 5.2147 13.7007 4.07899 12.5676C2.94595 11.4319 2.32185 9.92656 2.32185 8.32478C2.32185 6.72299 2.94595 5.21496 4.07899 4.08192C5.2147 2.94888 6.72006 2.32478 8.32185 2.32478C9.92363 2.32478 11.4317 2.94621 12.5647 4.08192C13.6977 5.21763 14.3218 6.72299 14.3218 8.32478C14.3218 9.92656 13.6977 11.4346 12.5647 12.5676Z"
      fill="black"
      fillOpacity="0.65"
    />
  </svg>
);
class HeaderChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleTransfer: false,
      visibleResolve: false,
      visibleRollBackTransfer: false,
      users: [],
      messages: [],
      indexSearch: 0,
      valueSearch: '',
      visibleSearchChat: false,
      valueTransfe: {
        value: null,
        username: null,
        note: '',
      },
      limitMessage: 0,
    };
  }
  handleCancelTransfer = (e) => {
    this.setState({ visibleTransfer: false });
  };
  handleResolve = (value) => {
    this.setState({ visibleResolve: value });
  };
  handleRollBackTransfer = (value) => {
    this.setState({ visibleRollBackTransfer: value });
  };
  handleTransfer = () => {
    this.setState({ visibleTransfer: true });
    this.props.dispatch({
      type: 'rocketChat/getListUser',
      payload: {
        params: {
          page: 0,
          size: 100,
          status: 'online',
          id: this.props.currentUser.id,
        },
      },
      headers: {
        Authorization: this.props.authorization,
      },
    });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.listUser && nextProps.listUser !== this.state.users) {
      this.setState({ ...this.state, users: nextProps.listUser });
    }
    if (nextProps.limitMessage && nextProps.limitMessage !== this.state.limitMessage) {
      this.setState({ ...this.state, limitMessage: nextProps.limitMessage });
    }
  }
  isSearchChat = (value) => {
    let hl = document.querySelectorAll('#highlight');
    if (hl && hl.length > 0) {
      for (let index = 0; index < hl.length; index++) {
        const element = hl[index];
        element.className = 'none';
      }
    }
    this.setState({ visibleSearchChat: value });
  };
  handleSearchChat = (e) => {
    let value = e.target.value;
    let hl = document.querySelectorAll('#highlight');
    if (hl && hl.length > 0) {
      for (let index = 0; index < hl.length; index++) {
        const element = hl[index];
        element.className = 'none';
      }
    }
    if (value) {
      this.fetchData(value, this.props.roomInfo.id, (res) => {
        if (res.response.messagesPage.messages) {
          this.setState({
            messages: res.response.messagesPage.messages,
            valueSearch: value,
            indexSearch: 0,
          });
          // console.log(res.response.messagesPage.messages);
          this.filterSearch(res.response.messagesPage.messages, 0, value);
        }
      });
    } else {
      this.setState({ indexSearch: 0, messages: [] });
    }
  };

  filterSearch = (data, offset, value) => {
    let tpm = null;
    let list = [];
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      tpm = document.getElementById(element.mid);
      tpm.innerHTML = element.text;
      list.push(tpm);
    }
    if (list.length > 0) {
      list[offset].scrollIntoView();
      var innerHTML = list[offset].innerHTML;
      var class_Name = list[offset].className;
      var brUser = class_Name.indexOf('message-customer');

      let classNameHl = brUser > -1 ? 'highlight user' : 'highlight agent';
      let words = innerHTML?.split(' ');
      if (words?.length > 0) {
        for (let index = 0; index < words.length; index++) {
          let element = words[index];
          var indexTmp = element
            .toLocaleLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .indexOf(
              value
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .toLocaleLowerCase(),
            );
          if (indexTmp > -1) {
            words[index] =
              "<span id='highlight' class='" + classNameHl + "'>" + element + '</span>';
          }
        }
        list[offset].innerHTML = words.join(' ');
      }
    }
  };
  downSearch = () => {
    if (this.state.indexSearch > 0) {
      let hl = document.querySelectorAll('#highlight');
      if (hl && hl.length > 0) {
        for (let index = 0; index < hl.length; index++) {
          const element = hl[index];
          element.className = 'none';
        }
      }
      this.setState({ indexSearch: this.state.indexSearch - 1 });
      this.filterSearch(this.state.messages, this.state.indexSearch - 1, this.state.valueSearch);
    }
  };
  upSearch = () => {
    if (this.state.indexSearch < this.state.messages.length - 1) {
      let hl = document.querySelectorAll('#highlight');
      if (hl && hl.length > 0) {
        for (let index = 0; index < hl.length; index++) {
          const element = hl[index];
          element.className = 'none';
        }
      }
      this.setState({ indexSearch: this.state.indexSearch + 1 });
      this.filterSearch(this.state.messages, this.state.indexSearch + 1, this.state.valueSearch);
    }
  };
  fetchData = (searchText, roomId, callback) => {
    reqwest({
      url:
        process.env.UMI_API_BASE_URL +
        '/api/smcc-chat-service/message?roomId=' +
        roomId +
        '&q=' +
        searchText +
        '&limit=' +
        this.state.limitMessage,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      headers: {
        Authorization: this.props.authorization,
      },
      success: (res) => {
        callback(res);
      },
    });
  };
  handleClickRollBackTransfer = async ({ roomInfo, rooms, typeSocial, typeRoom, typeMessage }) => {
    await this.props.dispatch({
      type: 'rocketChat/rollBackForward',
      payload: {
        params: {
          roomId: roomInfo.id,
        },
      },
      headers: {
        Authorization: this.props.authorization,
      },
    });
    await this.setState({
      visibleRollBackTransfer: false,
    });
    let _rooms = await this.removeRoom(rooms, roomInfo);
    await this.props.dispatch({
      type: 'rocketChat/updateListRoomCompleted',
      payload: {
        data: JSON.stringify(_rooms),
        typeSocial,
        typeRoom,
        typeMessage,
      },
    });
    if (_rooms && _rooms.length > 0) {
      let room = _rooms[0];
      await this.props.dispatch({
        type: 'rocketChat/loadHistory',
        payload: {
          params: {
            roomId: room.id,
            conversationId: room.conversationId,
            limit: 30,
          },
        },
        headers: {
          Authorization: this.props.authorization,
        },
      });
      let elment = document.getElementById('chathub-widget-chatBot');
      elment.scrollTop = elment.scrollHeight;

      this.props.dispatch({
        type: 'rocketChat/setRoomInfo',
        payload: {
          data: room,
        },
      });

      await this.props.handleStatusScroll(false);
    } else {
      this.props.dispatch({
        type: 'rocketChat/setRoomInfo',
        payload: {
          data: null,
        },
      });
    }
  };
  handleClickTranfer = async ({
    valueTransfe,
    roomInfo,
    userInfo,
    rooms,
    typeSocial,
    typeRoom,
    typeMessage,
  }) => {
    await this.props.dispatch({
      type: 'rocketChat/forwardUser',
      payload: {
        params: {
          to: valueTransfe.value,
          roomId: roomInfo.id,
        },
      },
    });
    await this.setState({
      visibleTransfer: false,
    });
    if (typeMessage === TYPE_ROOM_WIDGET.PROCESSING) {
      let _rooms = await this.removeRoom(rooms, roomInfo);
      // await this.props.updateListRoom({
      //   data: JSON.stringify(_rooms),
      //   typeSocial,
      //   typeRoom,
      //   typeMessage,
      // });
      await this.props.dispatch({
        type: 'rocketChat/updateListRoomCompleted',
        payload: {
          data: JSON.stringify(_rooms),
          typeSocial,
          typeRoom,
          typeMessage,
        },
      });
      if (_rooms && _rooms.length > 0) {
        let room = _rooms[0];
        // await this.props.loadHistory({
        //   socket: this.props.websocket,
        //   roomId: room.id,
        // });
        await this.props.dispatch({
          type: 'rocketChat/loadHistory',
          payload: {
            params: {
              roomId: room.id,
              conversationId: room.conversationId,
              limit: 30,
            },
          },
          headers: {
            Authorization: this.props.authorization,
          },
        });
        let elment = document.getElementById('chathub-widget-chatBot');
        elment.scrollTop = elment.scrollHeight;
        // this.props.setRoomInfo({
        //   room: room,
        // });
        this.props.dispatch({
          type: 'rocketChat/setRoomInfo',
          payload: {
            data: room,
          },
        });
        // this.props.streamRoomMessage({
        //   socket: this.props.websocket,
        //   roomId: room.id,
        // });
        this.props.dispatch({
          type: 'websocket/streamRoomMessage',
          payload: {
            socket: this.props.websocket,
            roomId: room.id,
          },
        });
        await this.props.handleStatusScroll(false);
        if (room.t === 'p') {
          // this.props.getGroupFile(room.id);
          this.props.dispatch({
            type: 'rocketChat/getGroupFile',
            payload: {
              roomId: room.id,
            },
          });
          // this.props.getCmVisitorsInfo({
          //   params: { user_id: room.customFields.id },
          // });
          this.props.dispatch({
            type: 'rocketChat/getCmVisitorInfo',
            payload: {
              params: { user_id: room.customFields.id },
            },
          });
        } else {
          // this.props.getChannelFile(room.id);
          // this.props.dispatch({
          //   type: 'rocketChat/getChannelFile',
          //   payload: {
          //     roomId: room.id,
          //   },
          // });
          // // this.props.getCmVisitorsInfo({ params: { user_id: room.v.id } });
          // this.props.dispatch({
          //   type: 'rocketChat/getCmVisitorInfo',
          //   payload: {
          //     params: { user_id: room.senderId },
          //   },
          // });
        }
      } else {
        // this.props.setRoomInfo({
        //   room: null,
        // });
        this.props.dispatch({
          type: 'rocketChat/setRoomInfo',
          payload: {
            data: null,
          },
        });
      }
    }
  };
  handleClickResolve = async ({ roomInfo, rooms, typeSocial, typeRoom, typeMessage }) => {
    if (roomInfo) {
      // await this.props.doneRoom({
      //   options: {
      //     roomId: roomInfo.id,
      //     roomType:
      //       roomInfo.customFields && roomInfo.customFields.isFacebook
      //         ? "facebook"
      //         : "zalo",
      //   },
      // });
      await this.props.dispatch({
        type: 'rocketChat/doneRoom',
        payload: {
          params: {
            roomId: roomInfo.id,
          },
        },
        headers: {
          Authorization: this.props.authorization,
        },
      });
      // xóa room thủ công, không cập nhật noti mới
      let _rooms = await this.removeRoom(rooms, roomInfo);
      await this.props.dispatch({
        type: 'rocketChat/updateListRoomCompleted',
        payload: {
          data: JSON.stringify(_rooms),
          typeSocial,
          typeRoom,
          typeMessage,
        },
      });

      // thay bằng update room bằng api
      // await this.props.dispatch({

      // })
      this.setState({
        visibleResolve: false,
      });
      if (_rooms && _rooms.length > 0) {
        let room = _rooms[0];
        // await this.props.loadHistory({
        //   socket: this.props.websocket,
        //   roomId: room.id,
        // });
        await this.props.dispatch({
          type: 'rocketChat/loadHistory',
          payload: {
            params: {
              roomId: room.id,
              conversationId: room.conversationId,
              limit: 30,
            },
          },
          headers: {
            Authorization: this.props.authorization,
          },
        });
        let elment = document.getElementById('chathub-widget-chatBot');
        elment.scrollTop = elment.scrollHeight;
        // this.props.setRoomInfo({
        //   room: room,
        // });
        this.props.dispatch({
          type: 'rocketChat/setRoomInfo',
          payload: {
            data: room,
          },
        });
        // this.props.streamRoomMessage({
        //   socket: this.props.websocket,
        //   roomId: room.id,
        // });
        this.props.dispatch({
          type: 'websocket/streamRoomMessage',
          payload: {
            socket: this.props.websocket,
            roomId: room.id,
          },
        });
        await this.props.handleStatusScroll(false);
        if (room.t === 'p') {
          // this.props.getGroupFile(room.id);
          this.props.dispatch({
            type: 'rocketChat/getGroupFile',
            payload: {
              roomId: room.id,
            },
          });
          // this.props.getCmVisitorsInfo({
          //   params: { user_id: room.customFields.id },
          // });
          this.props.dispatch({
            type: 'rocketChat/getCmVisitorInfo',
            payload: {
              params: { user_id: room.customFields.id },
            },
          });
        } else {
          // this.props.getChannelFile(room.id);
          // this.props.dispatch({
          //   type: 'rocketChat/getChannelFile',
          //   payload: {
          //     roomId: room.id,
          //   },
          // });
          // // this.props.getCmVisitorsInfo({ params: { user_id: room.v.id } });
          // this.props.dispatch({
          //   type: 'rocketChat/getCmVisitorInfo',
          //   payload: {
          //     params: { user_id: room.senderId },
          //   },
          // });
        }
      } else {
        // this.props.setRoomInfo({
        //   room: null,
        // });
        this.props.dispatch({
          type: 'rocketChat/setRoomInfo',
          payload: {
            data: null,
          },
        });
      }
    }
  };
  removeRoom = (listRoom, data) => {
    let checkRoom = _.findIndex(listRoom, { id: data.id });
    if (checkRoom > -1) {
      listRoom.splice(checkRoom, 1);
      return listRoom;
    }
  };
  render() {
    let { roomInfo, userInfo, muted, typeRoom, rooms, typeSocial, typeMessage } = this.props;
    let {
      visibleTransfer,
      visibleResolve,
      visibleRollBackTransfer,
      users,
      valueTransfe,
      visibleSearchChat,
      indexSearch,
      messages,
    } = this.state;
    return (
      <>
        <Header className="site-layout-background chat-header">
          {roomInfo ? (
            <Row className="row-header">
              {visibleSearchChat ? (
                <Col span={24} className="col-header-search">
                  <Input
                    id="input-search-chat"
                    className="input-search-header"
                    onPressEnter={this.handleSearchChat}
                    prefix={<SearchOutlined className="icon-search-header" />}
                    suffix={
                      messages && messages.length > 0
                        ? indexSearch + 1 + '/' + messages.length
                        : null
                    }
                  />
                  <Button
                    id="btn-search-chat-up"
                    onClick={this.upSearch}
                    className="button-up-header"
                    icon={<UpOutlined />}
                  />
                  <Button
                    id="btn-search-chat-down"
                    onClick={this.downSearch}
                    className="button-down-header"
                    icon={<DownOutlined />}
                  />
                  <Button
                    id="btn-search-chat-cancel"
                    className="button-search-header"
                    onClick={() => this.isSearchChat(false)}
                  >
                    Hủy
                  </Button>
                </Col>
              ) : (
                <>
                  <Col>
                    <Badge size={8} offset={[-3, 32]} dot status="success">
                      {roomInfo?.customFields?.dataInfoDto?.profilePic ? (
                        <Avatar size={40} src={roomInfo.customFields.dataInfoDto.profilePic} />
                      ) : (
                        <Avatar
                          size={40}
                          style={{
                            backgroundColor: `#${Math.floor(
                              roomInfo.customFields.dataInfoDto.name.charCodeAt(0) * 50000,
                            ).toString(16)}`,
                          }}
                        >
                          {roomInfo.customFields.dataInfoDto.name.split(' ')[0].length < 8
                            ? roomInfo.customFields.dataInfoDto.name.split(' ')[0]
                            : roomInfo.customFields.dataInfoDto.name.split(' ')[0].slice(0, 8)}
                        </Avatar>
                      )}
                    </Badge>
                  </Col>
                  <Col style={{ lineHeight: '0px', alignSelf: 'center' }} span={14}>
                    {roomInfo.customFields &&
                    roomInfo.customFields.dataInfoDto &&
                    roomInfo.customFields.dataInfoDto.name ? (
                      <Typography.Paragraph className="header-name" ellipsis={true}>
                        {roomInfo.customFields.dataInfoDto.name}
                      </Typography.Paragraph>
                    ) : null}
                  </Col>
                  <Col className="col-header">
                    <Button
                      id="btn-search-chat"
                      className="button-header button-search"
                      onClick={() => this.isSearchChat(true)}
                      icon={<Icon component={IconSearch} className="icon-button-header" />}
                    />
                    {typeMessage !== TYPE_ROOM_WIDGET.RESOLVED &&
                    typeRoom !== TYPE_ROOM_WIDGET.WAITING &&
                    roomInfo.status !== TYPE_ROOM_WIDGET.RESOLVED ? (
                      (roomInfo?.forward !== null && roomInfo?.forward?.status == true) ? (
                        <>
                          <Button
                            id="btn-rollback-transfer"
                            disabled={muted}
                            className="button-header button-search"
                            onClick={() => this.handleRollBackTransfer(true)}
                            icon={
                              <Icon
                                component={IconRollBackTransfer}
                                className="icon-button-header"
                              />
                            }
                          />
                          <Button
                            id="btn-resolve"
                            disabled
                            onClick={() => this.handleResolve(true)}
                            className="button-resolve-disabled"
                          >
                            Hoàn thành
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            id="btn-transfer"
                            disabled={muted}
                            className="button-header button-search"
                            onClick={this.handleTransfer}
                            icon={<Icon component={IconTransfer} className="icon-button-header" />}
                          />
                          <Button
                            id="btn-resolve"
                            disabled={muted}
                            onClick={() => this.handleResolve(true)}
                            className="button-resolve"
                          >
                            Hoàn thành
                          </Button>
                        </>
                      )
                    ) : null}
                  </Col>
                </>
              )}
            </Row>
          ) : null}
        </Header>
        <Modal
          className="modal-icon"
          wrapClassName="wrap-modal-fw-agent"
          width={382}
          height={214}
          title={null}
          visible={visibleTransfer}
          onCancel={this.handleCancelTransfer}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          footer={null}
          closable={false}
        >
          <Row>
            <Col span={24}>
              <Typography.Text>Chuyển tiếp</Typography.Text>
            </Col>
            <Col span={24}>
              <Select
                style={{ width: '100%' }}
                onChange={(e) => {
                  let _user = users.find((value) => value.username === e);
                  this.setState({
                    ...this.state,
                    valueTransfe: {
                      ...this.state.valueTransfe,
                      value: e,
                      username: _user.username,
                    },
                  });
                }}
              >
                {users && users.length > 0 ? (
                  users.map((value) => {
                    return (
                      <Option key={value._id} value={value.username}>
                        <div>
                          <UserOutlined />
                          <span> {value.username}</span>
                        </div>
                      </Option>
                    );
                  })
                ) : (
                  <div className="spin">
                    <Spin />
                  </div>
                )}
              </Select>
            </Col>
          </Row>
          <Row className="row-btn">
            <Col>
              <Button
                id="btn-cancel-tranfer"
                className="btn-cancel"
                key="cancel"
                onClick={this.handleCancelTransfer}
              >
                Hủy
              </Button>
            </Col>
            <Col>
              <Button
                id="btn-click-tranfer"
                key="flow"
                className="btn-flow"
                disabled={this.state.disibleBtnForward}
                onClick={() =>
                  this.handleClickTranfer({
                    valueTransfe,
                    roomInfo,
                    userInfo,
                    rooms,
                    typeSocial,
                    typeRoom,
                    typeMessage,
                  })
                }
              >
                Chuyển
              </Button>
            </Col>
          </Row>
        </Modal>
        <Modal
          className="modal-icon"
          wrapClassName="wrap-modal-rs-agent"
          width={382}
          height={214}
          title={null}
          visible={visibleResolve}
          onCancel={() => this.handleResolve(false)}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          footer={null}
          closable={false}
        >
          <Row>
            <Col span={24}>
              <ExclamationCircleFilled style={{ color: '#FAAD14', marginRight: '9px' }} />
              <Typography.Text>Xác nhận giải quyết yêu cầu khách hàng ?</Typography.Text>
            </Col>
          </Row>
          <Row className="row-resolve">
            <Col span={24}>
              <Button
                id="btn-cancel-resolve"
                className="btn-cancel"
                key="cancel"
                onClick={() => this.handleResolve(false)}
              >
                Hủy
              </Button>
              <Button
                id="btn-click-resolve"
                key="flow"
                className="btn-flow"
                disabled={this.state.disibleBtnForward}
                onClick={() =>
                  this.handleClickResolve({
                    roomInfo,
                    rooms,
                    typeSocial,
                    typeRoom,
                    typeMessage,
                  })
                }
              >
                Hoàn tất
              </Button>
            </Col>
          </Row>
        </Modal>
        <Modal
          className="modal-icon"
          wrapClassName="wrap-modal-rfw-agent"
          width={384}
          height={148}
          title={null}
          visible={visibleRollBackTransfer}
          onCancel={() => this.handleRollBackTransfer(false)}
          okButtonProps={{ hidden: true }}
          cancelButtonProps={{ hidden: true }}
          footer={null}
          closable={false}
        >
          <Row>
            <Col span={3}>
              <ExclamationCircleOutlined
                style={{ color: '#FAAD14', marginRight: '9px', fontSize: '21px' }}
              />
            </Col>
            <Col span={21}>
              <Row style={{ marginBottom: '8px' }}>
                <Typography.Text style={{ fontSize: '16px' }}>
                  Thu hồi tin nhắn chuyển tiếp
                </Typography.Text>
              </Row>
              <Row>
                <Typography.Text style={{ fontSize: '14px' }}>
                  Tin nhắn sẽ được chuyển về tin nhắn đã nhận của bạn. Bạn có chắc chắn muốn thu
                  hồi?
                </Typography.Text>
              </Row>
            </Col>
          </Row>
          <Row className="row-rollback">
            <Col span={24}>
              <Button
                id="btn-cancel-resolve"
                className="btn-cancel"
                key="cancel"
                onClick={() => this.handleRollBackTransfer(false)}
              >
                Hủy
              </Button>
              <Button
                id="btn-click-resolve"
                key="flow"
                className="btn-flow"
                disabled={this.state.disibleBtnForward}
                onClick={() =>
                  this.handleClickRollBackTransfer({
                    roomInfo,
                    rooms,
                    typeSocial,
                    typeRoom,
                    typeMessage,
                  })
                }
              >
                Thu hồi
              </Button>
            </Col>
          </Row>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = ({ websocket, rocketChat, user }) => {
  return {
    listUser: rocketChat.listUser,
    websocket: websocket.socket,
    authorization: user.tokenGateway,
    limitMessage: rocketChat.limitMessage,
    currentUser: user.currentUser,
  };
};

export default connect(mapStateToProps)(HeaderChat);
