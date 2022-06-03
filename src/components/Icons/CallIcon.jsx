import React from 'react';

const CallIcon = ({ ...props }) => (
  <span className={`anticon ${props.className ? props.className : ''}`} {...props}>
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill="#00AF3B" />
      <path
        d="M18.2814 21.7183C16.3724 19.8093 15.9414 17.9004 15.8442 17.1355C15.817 16.924 15.8898 16.712 16.0411 16.5617L17.5859 15.0176C17.8131 14.7905 17.8535 14.4366 17.6831 14.1642L15.2235 10.3449C15.035 10.0432 14.6481 9.93435 14.33 10.0935L10.3814 11.9531C10.1242 12.0798 9.97292 12.3531 10.0021 12.6383C10.209 14.6038 11.0659 19.4355 15.8142 24.1841C20.5624 28.9327 25.3935 29.7893 27.36 29.9962C27.6452 30.0254 27.9185 29.8741 28.0452 29.6169L29.9048 25.6683C30.0634 25.3509 29.9552 24.965 29.6548 24.7762L25.8355 22.3172C25.5633 22.1467 25.2094 22.1868 24.9821 22.4138L23.438 23.9586C23.2877 24.1099 23.0756 24.1827 22.8642 24.1555C22.0993 24.0583 20.1904 23.6272 18.2814 21.7183Z"
        fill="white"
      />
      <path
        d="M25.8615 20.6896C25.4806 20.6896 25.1719 20.3808 25.1719 20C25.1686 17.1447 22.8548 14.8308 19.9995 14.8275C19.6186 14.8275 19.3098 14.5188 19.3098 14.1379C19.3098 13.757 19.6186 13.4482 19.9995 13.4482C23.6162 13.4522 26.5472 16.3832 26.5512 20C26.5512 20.3808 26.2424 20.6896 25.8615 20.6896Z"
        fill="white"
      />
      <path
        d="M29.3098 20.6896C28.9289 20.6896 28.6202 20.3809 28.6202 20C28.6148 15.2411 24.7583 11.3846 19.9995 11.3793C19.6186 11.3793 19.3098 11.0705 19.3098 10.6897C19.3098 10.3088 19.6186 10 19.9995 10C25.5198 10.0061 29.9934 14.4797 29.9995 20C29.9995 20.1829 29.9268 20.3583 29.7975 20.4876C29.6681 20.617 29.4927 20.6896 29.3098 20.6896Z"
        fill="white"
      />
    </svg>
  </span>
);

export default CallIcon;
