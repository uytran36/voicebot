import React from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Switch, message } from 'antd';
import { history, connect, FormattedMessage, formatMessage } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import PT from 'prop-types';
import styles from './index.less';
import { requestSetAgentDisturb } from '@/services/call-center';
import api from '@/api';

const dumb = () => {};
const imageDefault = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

class AvatarDropdown extends React.Component {
  static propTypes = {
    dispatch: PT.func.isRequired,
    currentUser: PT.shape({
      avatarUrl: PT.string,
      name: PT.string,
      extension: PT.shape({
        doNotDisturb: PT.string,
      }),
    }),
    user: PT.shape({
      ext: PT.string,
      tokenGateway: PT.string,
    }),
    menu: PT.bool,
    websocket: PT.shape({
      onclose: PT.func,
    }),
    isSocketConnected: PT.bool,
  };

  static defaultProps = {
    menu: false,
    currentUser: {
      name: '',
      avatarUrl: imageDefault,
    },
    user: {
      ext: '',
    },
    websocket: {
      onclose: dumb,
    },
    isSocketConnected: false,
  };

  state = {
    isDoNotDisturb: false,
  };

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser) {
      this.setState({
        isDoNotDisturb: currentUser.extension?.doNotDisturb === 'true',
      });
    }
  }

  handleSetAgentDisturb = async () => {
    const { tokenGateway } = this.props.user;
    const { isDoNotDisturb } = this.state;
    try {
      const res = await requestSetAgentDisturb(
        {
          Authorization: tokenGateway,
        },
        {
          active: (!isDoNotDisturb).toString(),
        },
      );
      if (res.code === 200) {
        this.setState({
          isDoNotDisturb: res.response.message,
        });
        return null;
      }
      throw new Error('ERROR~');
    } catch (err) {
      message.warning(formatMessage({ id: 'component.avatar-dropdown.disturb.fail' }));
    }
  };

  onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch, websocket, isSocketConnected } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });

        if (websocket) {
          if (isSocketConnected) websocket.onclose();
          dispatch({
            type: 'websocket/socket_disconnect',
          });
        }
      }

      return;
    }

    // if (key === 'disturb') {
    //   this.handleSetAgentDisturb();
    //   return;
    // }

    // history.push(`/account/${key}`);
  };

  render() {
    const { currentUser, menu, user } = this.props;
    //const { isDoNotDisturb } = this.state;

    const endpoint = api.UMI_API_BASE_URL;
    const avatarUrl = currentUser?.url_image;

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="profile" className={`${styles.accountMenu}`}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={`${endpoint}${avatarUrl}` || imageDefault}
                alt="avatar"
              />
              <span className={`${styles.name} anticon`}>
                {/* {user?.ext ? `${currentUser.full_name} - [${user.ext}]` : currentUser.full_name} */}
                {currentUser.full_name}
              </span>
            </span>
          </Menu.Item>
        )}
        {/* {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            Personal Center
          </Menu.Item>
        )} */}
        {/* {menu && (
          <Menu.Item key="disturb">
            <span style={{ marginRight: '10px' }}>
              <FormattedMessage id="component.avatar-dropdown.disturb" />
            </span>
            <Switch checked={isDoNotDisturb} />
          </Menu.Item>
        )}
        {menu && <Menu.Divider />} */}
        <Menu.Divider />

        <Menu.Item key="logout">
          <LogoutOutlined />
          <FormattedMessage id="component.avatar-dropdown.logout" />
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={`${endpoint}${avatarUrl}` || imageDefault}
            alt="avatar"
          />
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user, websocket }) => ({
  websocket: websocket.socket,
  isSocketConnected: websocket.isConnected,
  currentUser: user.currentUser,
  user,
}))(AvatarDropdown);
