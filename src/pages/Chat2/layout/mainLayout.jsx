import React, { Component } from 'react';
import { connect } from 'umi';
import ChatWeb from '../views/ChatWeb';
import { Spin } from 'antd';

class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      isLoginSocket: false,
      reLoad: false,
      loginToPass: false,
      websocket: null,
    };
  }
  componentDidMount() {
    this.setState({ reLoad: !this.state.reLoad });
  }
  // componentDidUpdate() {
  //   if (
  //     this.props.token &&
  //     this.props.authorization &&
  //     this.state?.websocket?.url &&
  //     !this.state.isLoginSocket &&
  //     this.props.isConnected
  //   ) {
  //     // this.props.loginSocket({
  //     //   authToken: this.props.token,
  //     //   socket: this.props.websocket,
  //     //   authorization: this.props.authorization
  //     // });
  //     this.props.dispatch({
  //       type: 'websocket/loginSocket',
  //       payload: {
  //         socket: this.props.websocket,
  //         authorization: this.props.authorization,
  //       },
  //     });
  //     this.setState({ isLoginSocket: true });
  //   }
  // }

  reLoad() {
    this.setState({ reLoad: !this.state.reLoad });
  }
  disconnectWs() {
    if (this.props?.websocket?.url) {
      this.props.websocket.onclose();
    }
  }
  setLogin = () => {
    this.setState({ isLoginSocket: true });
  };
  setStep = (step) => {
    this.setState({ step: step });
  };
  // componentWillReceiveProps(nextProps) {
  //   if (!this.props.token && !this.state.loginToPass && nextProps.authToken) {
  //     this.setState({ loginToPass: true });
  //   }
  //   if (nextProps.websocket) {
  //     this.setState({ websocket: nextProps.websocket });
  //   }
  // }

  render() {
    // let { userId, authToken, userInfo, authorization } = this.props;
    let { userInfo, authorization } = this.props;
    return (
      <div className={`widget-container`}>
        {userInfo && authorization ? (
          <ChatWeb reLoad={this.state.reLoad} authorization={authorization} />
        ) : (
          <div className="spin">
            <Spin />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ rocketChat, user }) => {
  return {
    listRoom: rocketChat.listRoom,
    userInfo: user.currentUser,
    // websocket: websocket,
    // authToken: websocket.chathub_widget_authToken,
    // userId: websocket.chathub_widget_userId,
    // isConnected: websocket.isConnected,
  };
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(MainLayout);
