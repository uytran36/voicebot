import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, SelectLang, useIntl, connect, FormattedMessage } from 'umi';
import PT from 'prop-types';
import { GithubOutlined } from '@ant-design/icons';
import React from 'react';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';

UserLayout.propTypes = {
  route: PT.shape({
    routes: PT.instanceOf(Array),
  }).isRequired,
  children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]),
  location: PT.shape({
    pathname: PT.string,
  }).isRequired,
};

UserLayout.defaultProps = {
  children: <div />,
};

function UserLayout(props) {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          {/* <SelectLang /> */}
        </div>
        <div className={styles.content}>
          {/* <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Smart Contact Center</span>
              </Link>
            </div>
            <div className={styles.desc}>
              <FormattedMessage
                id="pages.layouts.userLayout.title"
                defaultMessage="Welcome to Smart Contact Center"
              />
            </div>
          </div> */}
          {children}
        </div>
      </div>
    </HelmetProvider>
  );
}

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
