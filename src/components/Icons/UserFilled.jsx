import React from 'react';

const UserFilled = ({ ...props }) => (
  <span className={`anticon ${props.className ? props.className : ''}`} {...props}>
    <svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 1.4668C7.5187 1.4668 5.5 3.4855 5.5 5.9668C5.5 8.4481 7.5187 10.4668 10 10.4668C12.4813 10.4668 14.5 8.4481 14.5 5.9668C14.5 3.4855 12.4813 1.4668 10 1.4668Z"
        // fill="#595959"
      />
      <path
        d="M15.5989 13.4066C14.3669 12.1557 12.7336 11.4668 11 11.4668H9C7.2664 11.4668 5.63313 12.1557 4.40113 13.4066C3.17517 14.6514 2.5 16.2946 2.5 18.0335C2.5 18.3096 2.72387 18.5335 3 18.5335H17C17.2761 18.5335 17.5 18.3096 17.5 18.0335C17.5 16.2946 16.8248 14.6514 15.5989 13.4066Z"
        // fill="#595959"
      />
    </svg>
  </span>
);

export default UserFilled;
