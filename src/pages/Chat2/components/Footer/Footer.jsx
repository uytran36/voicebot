import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Layout } from 'antd';

const { Footer } = Layout;

class FooterLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
    };
  }
  
  render() {
    return <Footer style={{ textAlign: 'center' }}>SCC Widget ©2020 Created by Trieu Tran</Footer>;
  }
}

export default FooterLayout;
