import React from 'react';

const Talk = ({ ...props }) => (
  <span {...props}>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.02431 1.94434H7.00776C4.21583 1.94434 1.94531 4.1739 1.94531 6.91547C1.94531 8.03431 2.33431 9.12065 3.04608 9.99568L2.30948 11.678C2.24878 11.8162 2.315 11.976 2.45294 12.0329C2.5026 12.0546 2.55777 12.06 2.61019 12.0519L5.31108 11.5859C5.85181 11.7782 6.42013 11.8758 6.99397 11.8731C9.7859 11.8731 12.0564 9.6435 12.0564 6.90193C12.0619 4.16848 9.80797 1.94705 7.02431 1.94434ZM7.78741 7.21054V5.736H9.28903V7.2316C9.28903 8.24271 8.32371 8.3691 8.32371 8.3691L8.195 8.07419C8.195 8.07419 8.62403 8.011 8.70984 7.67396C8.79565 7.42119 8.62403 7.21054 8.62403 7.21054H7.78741ZM4.99869 5.736V7.21054H5.83531C5.83531 7.21054 6.00692 7.42119 5.92112 7.67396C5.83531 8.011 5.40627 8.07419 5.40627 8.07419L5.53498 8.3691C5.53498 8.3691 6.50031 8.24271 6.50031 7.2316V5.736H4.99869Z"
        fill="white"
      />
    </svg>
  </span>
);

export default Talk;