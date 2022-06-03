import React from 'react';
import { Button } from 'antd';

const redirectUrl =
  process.env.REDIRECT_URI_FB ||
  'https://oncx-portal.smartcontactcenter.xyz/omni_inbound/config_livechat_2';
const clientId = process.env.CLIENT_ID_FB || '212228450857992';
class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  loadFbLoginApi() {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '212228450857992',
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: 'v11.0', // use version 2.1
        display: 'page',
      });
    };

    console.log('Loading fb api');
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  componentDidMount() {
    this.loadFbLoginApi();
  }

  testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function (response) {
      console.log('Successful login for: ' + response);
    });
  }

  statusChangeCallback = (response) => {
    console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
      this.testAPI();
    } else if (response.status === 'not_authorized') {
      console.log('Please log into this app.');
    } else {
      console.log('Please log into this facebook.');
    }
  };

  checkLoginState = () => {
    FB.getLoginStatus(
      function (response) {
        this.statusChangeCallback(response);
      }.bind(this),
      {
        scope:
          'public_profile,email,manage_pages,publish_pages,read_page_mailboxes,pages_messaging,pages_messaging_subscriptions,ads_read,page_events,instagram_basic,instagram_manage_messages,instagram_manage_comments,pages_show_list',
      },
    );
  };

  handleFBLogin = () => {
    // FB.login(this.checkLoginState());
    // FB.login(function (response) {
    //   if (response.authResponse) {
    //     console.log('Welcome!  Fetching your information.... ');
    //     FB.api('/me', function (response) {
    //       console.log('Good to see you, ' + response.name + '.');
    //     });
    //   } else {
    //     console.log('User cancelled login or did not fully authorize.');
    //   }
    // });
  };

  render() {
    return (
      <a
        href={`https://www.facebook.com/v2.8/dialog/oauth?client_id=${clientId}&response_type=code&redirect_uri=${redirectUrl}&scope=pages_show_list%2Cpages_messaging%2Cpages_read_engagement%2Cpages_manage_metadata&state=5eb78a0c-4aaf-40dc-990f-1c2580ccf84a`}
      >
        <Button type="primary">Thêm kết nối</Button>
      </a>
    );
  }
}

export default LoginComponent;

// https://www.facebook.com/v3.2/dialog/oauth?auth_type=rerequest&client_id=212228450857992&redirect_uri=https://localhost:8001/mainpage&state=eyJyZWRpcmVjdF90byI6Imh0dHBzOi8vcGFnZXMuZm0iLCJjb3VudHJ5IjoiVk4iLCJsb2NhbGUiOiJ2aSJ9&scope=public_profile,email,manage_pages,publish_pages,read_page_mailboxes,pages_messaging,pages_messaging_subscriptions,ads_read,page_events,instagram_basic,instagram_manage_messages,instagram_manage_comments,pages_show_list

// https://www.facebook.com/v3.2/dialog/oauth?auth_type=rerequest&client_id=1733556690196497&redirect_uri=https://pages.fm/api/v1https://www.facebook.com/v11.0/dialog/oauth?app_id=216109273770941&cbt=1632840792153&channel_url=https://staticxx.facebook.com/x/connect/xd_arbiter/?version=46#cb=f2c30e02b687528&domain=localhost&is_canvas=false&origin=https%3A%2F%2Flocalhost%3A8001%2Ff20fc491b5f99c8&relation=opener&client_id=216109273770941&display=popup&domain=localhost&e2e={}&fallback_redirect_uri=https://localhost:8001/mainpage&locale=en_US&logger_id=f22b6a7b7c47974&origin=1&redirect_uri=https://staticxx.facebook.com/x/connect/xd_arbiter/?version=46#cb=f35aebc447835c&domain=localhost&is_canvas=false&origin=https%3A%2F%2Flocalhost%3A8001%2Ff20fc491b5f99c8&relation=opener&frame=f3a9b1acf96fe8&response_type=token,signed_request,graph_domain&sdk=joey&version=v11.0

// https://localhost:8999/connect/facebook?code=AQCRCbSOdD8PKl6S3Ybdz1QknShjAL_YccGGQH_vR4aAExvZppSosPFZC0e-jURIy9SxhXb7SSb05n0dCrSgeQt1ItDyiQkU56Vi67zemhS8Pacd7AgrNNXa-tTN_o4PT5QLl4jAAX08i7oV7K1EGhqbYlraiJBdy45RovyqL1wjuoGuCBsXWXG7CYUshGAq6IktphenQIEB8mbjN3Cd5rM4SwSBw6JnL8oejVm8OgjXlRkFkycSpgQrpqwgWv6ZB46DCyTeNVUNR9UZW8hQ3AP2pSLIymfPQw94YXDMnCw7pw0J_rX6IosI9L0wo56SvyX-Hv08yTiDZdFKxFSimn9brfbun41DMPsqv1JXwmstDE_sbtIFw37ul-sL4Q4Y_q9DRYy7HpTl5kbkJUSKGBNS&state=5eb78a0c-4aaf-40dc-990f-1c2580ccf84a#_=_
