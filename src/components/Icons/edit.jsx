import React from 'react';

const Edit = ({ ...props }) => {
  return (
    <span {...props}>
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 20 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.890625" width="18.1821" height="18" rx="3" fill="#C6BE07" />
        <g clipPath="url(#clip0)">
          <path
            d="M4.19647 12.4997V15H6.60731L13.7209 7.62229L11.31 5.12195L4.19647 12.4997Z"
            fill="white"
          />
          <path
            d="M15.5789 4.7519L14.0777 3.19503C13.827 2.93499 13.4187 2.93499 13.168 3.19503L11.9915 4.4152L14.4024 6.91554L15.5788 5.69537C15.8296 5.43534 15.8296 5.01193 15.5789 4.7519Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <rect width="11.5704" height="12" fill="white" transform="translate(4.19647 3)" />
          </clipPath>
        </defs>
      </svg>
    </span>
  );
};

export default Edit;
