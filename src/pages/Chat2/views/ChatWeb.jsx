import Icon, { CloseOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { Button, Layout, notification, Typography, Spin, Modal } from "antd";
import React from "react";
import ImageGallery from "react-image-gallery";
import { connect } from "umi";
// import { bindActionCreators } from "redux";
// import * as Action from "../actions/index";
import Chat from "../components/Chat/Chat.jsx";
import HeaderChat from "../components/Header/HeaderChat.jsx";
import Infomation from "../components/Information/Infomation.jsx";
import NavbarWeb from "../components/Navbar/Navbar.jsx";
import TextInputWeb from "../components/TextInput/TextInputWeb.jsx";
import * as IdModal from "../constants/IdModal";
import * as TYPE_ROOM_WIDGET from "../constants/TypeRoomWidget";
import logo from "../assets/icon/imageStart.png";

class ChatWeb extends React.Component {
  init = () => {};
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      messageCurren: 0,
      rooms: [],
      userInfo: null,
      roomInfo: null,
      roomInfoOffline: null,
      // websocket: null,
      statusBot: [],
      loading: false,
      hasMore: true,
      search: "",
      files: [],
      activeRoom: -1,
      activeRoomLock: false,
      typeSocial: this.props.typeSocial ? this.props.typeSocial : TYPE_ROOM_WIDGET.CHATALL,
      typeRoom: this.props.typeRoom ? this.props.typeRoom : TYPE_ROOM_WIDGET.WAITING,
      typeMessage: this.props.typeMessage ? this.props.typeMessage : TYPE_ROOM_WIDGET.ALL,
      enterChat: true,
      statusScroll: false,
      notification: null,
      showInformation: true,
      loadingFile: true,
      images: [],
      indexReview: 0,
      visibleReview: false,
      isLoginSocket: false,
      isForward: false,
      reload: false,
      loadInit: false,
      loadDataRoomInfo: false,
      showVideo: {},
    };
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEmpty(nextProps.listRoom)) {
      let rooms = JSON.parse(nextProps.listRoom);
      this.setState({ rooms: rooms });
    }
    if (!_.isEmpty(nextProps.userInfo)) {
      this.setState({ userInfo: nextProps.userInfo });
    }
    if (_.isEmpty(nextProps.listRoom)) {
      this.setState({ rooms: [] });
      this.props.dispatch({
        type: 'rocketChat/setRoomInfo',
        payload: {
          data: null,
        }
      });
    }
    // if (
    //   nextProps.websocket &&
    //   nextProps.websocket.url &&
    //   !this.state.websocket
    // ) {
    //   this.setState({ ...this.state, websocket: nextProps.websocket });
    // }
    if (nextProps.groupImageVideo && nextProps.groupImageVideo.length > 0) {
      let images = [];
      for (let i = 0; i < nextProps.groupImageVideo.length; i++) {
        let element = null;
        if (nextProps.groupImageVideo[i].type.search("video") !== -1) {
          element = new Object({
            id: nextProps.groupImageVideo[i]._id,
            original: nextProps.groupImageVideo[i].url,
            thumbnail: nextProps.groupImageVideo[i].url,
            renderItem: () => this._renderVideo(nextProps.groupImageVideo[i]),
            renderThumbInner: () =>
              this._renderVideoThumbInner(nextProps.groupImageVideo[i]),
          });
        } else {
          element = new Object({
            id: nextProps.groupImageVideo[i]._id,
            original:
              process.env.REACT_APP_URL_ROCKETCHAT +
              nextProps.groupImageVideo[i].path,
            thumbnail:
              process.env.REACT_APP_URL_ROCKETCHAT +
              nextProps.groupImageVideo[i].path,
          });
        }

        images.push(element);
      }
      this.setState({ ...this.state, images: images });
    }
  }
  // componentWillMount() {
  //   if (
  //     this.props.token &&
  //     this.props.websocket &&
  //     this.props.websocket.url !== undefined &&
  //     !this.state.isLoginSocket
  //   ) {
  //     // this.props.loginSocket({
  //     //     authToken: this.props.token,
  //     //     socket: this.props.websocket
  //     // });
  //     // this.setState({ isLoginSocket: true })
  //   }
  // }
  // componentDidUpdate(nextProps) {
  //   if (
  //     nextProps.reLoad &&
  //     this.props.token &&
  //     this.props.websocket &&
  //     this.props.websocket.url !== undefined &&
  //     !this.state.isLoginSocket
  //   ) {
  //     // this.props.loginSocket({
  //     //     authToken: this.props.token,
  //     //     socket: this.props.websocket
  //     // });
  //     // this.setState({ isLoginSocket: true })
  //   }
  // }
  handleActiveRooom = (value) => {
    // this.props.setRoomInfo({
    //   room: null,
    // });
    this.props.dispatch({
      type: 'rocketChat/setRoomInfo',
      payload: {
        data: null,
      }
    });
  };
  _renderVideo = (item) => {
    return (
      <div className="video-wrapper">
        <video
          id="video"
          className="image-gallery-image"
          autoPlay={false}
          width={170}
          controls
        >
          <source
            src={
              process.env.REACT_APP_URL_ROCKETCHAT +
              "/file-upload/" +
              item._id +
              "/" +
              item.name
            }
            type="video/mp4"
          />
        </video>
      </div>
    );
  };
  _renderVideoThumbInner = (item) => {
    return (
      <div className="video-wrapper">
        <video
          id="video"
          className="image-gallery-thumbnail-image"
          autoPlay={false}
          width={170}
        >
          <source
            src={
              process.env.REACT_APP_URL_ROCKETCHAT +
              "/file-upload/" +
              item._id +
              "/" +
              item.name
            }
            type="video/mp4"
          />
        </video>
        <PlayCircleOutlined className="icon-play-video" />
      </div>
    );
  };
  handleEnterChat = (value) => {
    this.setState({
      enterChat: value,
    });
  };
  handleCancelReViewImage = (value) => {
    this.setState({
      visibleReview: value,
    });
  };
  handleShowReViewImage = (item) => {
    let id = item.file ? item.file._id : item._id;
    let index = this.state.images.findIndex((value) => value.id === id);
    this.setState({
      visibleReview: true,
      indexReview: index,
    });
  };
  handleStatusScroll = (value) => {
    this.setState({
      ...this.state,
      statusScroll: value,
    });
  };
  handleChangeTypeSocial = async (value) => {
    await this.setState({
      ...this.state,
      activeRoomLock: false,
      statusScroll: false,
      activeRoom: -1,
      roomInfo: null,
      showInfomation: true,
      typeSocial: value,
      loadingFile: true,
    });
  };
  handleChangeTypeRoom = async (value) => {
    await this.setState({
      ...this.state,
      activeRoom: -1,
      roomInfo: null,
      typeRoom: value,
      typeSocial: TYPE_ROOM_WIDGET.CHATALL,
      showInfomation: true,
      statusScroll: false,
      activeRoomLock: false,
      showInformation: true,
      loadingFile: true,
    });
  };
  handleChangeTypeMessage = async (value) => {
    this.setState({
      typeMessage: value,
    });
  };
  handleActiveRoomLock = async (value) => {
    if (this.state.typeRoom === TYPE_ROOM_WIDGET.LIVECHAT_ONLINE) {
      // await this.props.resetState();
      await this.dispatch({
        type: 'rocketChat/resetState'
      })
      await this.setState({
        activeRoomLock: value,
        statusScroll: false,
      });
    }
  };
  getRoomInfoOffline = (room) => {
    this.setState({
      ...this.state,
      roomInfoOffline: room,
      roomInfo: null,
    });
  };
  handleToggleStatusBot = async (value) => {
    let roomInfo = this.state.roomInfo;
    roomInfo.customFields.botStatus = value;
    // await this.props.toggleBotRoom({
    //   roomId: this.props.roomInfo._id,
    //   botStatus: value,
    // });
    await this.props.dispatch({
      type: 'rocketChat/toggleBotRoom',
      payload: {
        roomId: {
          roomId: this.props.roomInfo._id,
          botStatus: value,
        }
      }
    });
    // await this.props.updateListRoomByBot(roomInfo);
    await this.props.dispatch({
      type: 'rocketChat/updateListRoomByBot',
      payload: {
        roomData: roomInfo
      }
    })
  };
  handleShowInformation = async (value) => {
    await this.setState({
      ...this.state,
      showInformation: value,
    });
  };
  handleLoadingFile = async (value) => {
    await this.setState({
      ...this.state,
      loadingFile: value,
      roomInfo: null,
    });
  };
  checkMuted = ({ rooms, roomInfo, userInfo, typeRoom, typeSocial }) => {
    if (roomInfo && roomInfo.t === "p") {
      if (rooms && userInfo) {
        let checked = roomInfo?.muted?.indexOf(userInfo.username);
        return checked === -1 ? false : true;
      } else return false;
    } else return false;
  };

  render() {
    let {
      rooms,
      isLoginSocket,
      enterChat,
      images,
      statusScroll,
      typeSocial,
      typeRoom,
      typeMessage,
      activeRoomLock,
      roomInfoOffline,
      showInformation,
      loadingFile,
    } = this.state;
    let {
      userInfo,
      roomInfo,
      activeRoom,
      // websocket,
      customerInfo,
      groupImageVideo,
      groupFile,
      visitorsInfo,
    } = this.props;
    let options = {
      rooms,
      userInfo,
      roomInfo,
      // websocket,
      typeSocial,
      typeRoom,
      typeMessage,
      activeRoom,
      enterChat,
      statusScroll,
      activeRoomLock,
      roomInfoOffline,
      showInformation,
      customerInfo,
      loadingFile,
      groupImageVideo,
      groupFile,
      visitorsInfo,
      muted: this.checkMuted({
        rooms,
        roomInfo,
        userInfo,
        typeRoom,
        typeSocial,
      }),
      handleChangeTypeSocial: this.handleChangeTypeSocial,
      handleChangeTypeRoom: this.handleChangeTypeRoom,
      handleChangeTypeMessage: this.handleChangeTypeMessage,
      getRoomInfoOffline: this.getRoomInfoOffline,
      handleActiveRooom: this.handleActiveRooom,
      handleActiveRoomLock: this.handleActiveRoomLock,
      handleEnterChat: this.handleEnterChat,
      handleStatusScroll: this.handleStatusScroll,
      handleShowReViewImage: this.handleShowReViewImage,
      handleLoadingFile: this.handleLoadingFile,
      // getCrmCustomerInfo: this.props.getCrmCustomerInfo,
      // loginSocket: this.props.loginSocket,
    };
    return (
      <>
        <Layout className="chat-container">
          <NavbarWeb {...options} />
          <Layout className="site-layout">
            {roomInfo ? (
              <>
                {" "}
                <HeaderChat {...options} />
                <Chat {...options} keyChat={IdModal.CHATBOT} />
                {typeMessage !== TYPE_ROOM_WIDGET.RESOLVED &&
                // eslint-disable-next-line react/prop-types
                typeRoom !== TYPE_ROOM_WIDGET.WAITING && roomInfo?.livechatSession?.liveChatClose !== true ? (
                  <TextInputWeb {...options} keyChat={IdModal.CHATBOT} />
                ) : null}
              </>
            ) : null}
          </Layout>
          {roomInfo ? (
            <>
              <Infomation {...options} />{" "}
            </>
          ) : null}
        </Layout>
        <Modal
          visible={this.state.visibleReview}
          wrapClassName="modal-review-image"
          footer={null}
          forceRender={false}
          onCancel={() => this.handleCancelReViewImage(false)}
          closeIcon={<CloseOutlined style={{ color: "#FFFFFF" }} />}
        >
          <ImageGallery
            items={images}
            showPlayButton={false}
            startIndex={this.state.indexReview}
            showFullscreenButton={false}
          />
        </Modal>
      </>
    );
  }
}
const mapStateToProps = ({ rocketChat, user }) => {
  return {
    // websocket: websocket.socket,
    // userId: websocket.chathub_widget_userId,
    // authToken: websocket.chathub_widget_authToken,
    // loginFail: websocket.loginFail,
    // loginSuccess: websocket.loginSuccess,
    listRoom: rocketChat.listRoom,
    listRoomOffline: rocketChat.listRoomOffline,
    roomInfo: rocketChat.roomInfo,
    groupImageVideo: rocketChat.groupImageVideo,
    groupFile: rocketChat.groupFile,
    listMessage: rocketChat.listMessage,
    loading: rocketChat.loading,
    userInfo: rocketChat.userInfo,
    activeRoom: rocketChat.activeRoom,
    notification: rocketChat.notification,
    statusBot: rocketChat.statusBot,
    calling: rocketChat.calling,
    linkCalling: rocketChat.link_calling,
    customerInfo: rocketChat.customerInfo,
    visitorsInfo: rocketChat.visitorsInfo,
    typeRoom: rocketChat.typeRoom,
    typeSocial: rocketChat.typeSocial,
    typeMessage: rocketChat.typeMessage
  };
};

export default connect(mapStateToProps)(ChatWeb);
