import React from 'react';

const Eye = ({ ...props }) => {
  return (
    <span {...props}>
      <svg
        width="1em"
        height="1em"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="18" height="18" rx="3" fill="#CC0025" />
        <rect x="5" y="4" width="3" height="10" rx="1" fill="white" />
        <rect x="10" y="4" width="3" height="10" rx="1" fill="white" />
      </svg>
    </span>
  );
};

export default Eye;
