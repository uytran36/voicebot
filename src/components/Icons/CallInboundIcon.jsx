import React from 'react';

const CallInboundIcon = ({ ...props }) => (
  <span className={`anticon ${props.className ? props.className : ''}`} {...props}>
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0)">
        <path d="M10.6665 1.3335V5.3335H14.6665" stroke="#F6BB23" strokeLinecap="square" />
        <path d="M15.3332 0.666748L10.6665 5.33341" stroke="#F6BB23" strokeLinecap="square" />
        <path
          d="M14.6665 11.28V13.28C14.6672 13.4657 14.6292 13.6494 14.5548 13.8195C14.4804 13.9897 14.3713 14.1424 14.2345 14.2679C14.0977 14.3934 13.9362 14.489 13.7603 14.5485C13.5844 14.6079 13.398 14.63 13.2131 14.6133C11.1617 14.3904 9.19113 13.6894 7.45979 12.5666C5.84901 11.5431 4.48335 10.1774 3.45979 8.56665C2.33311 6.82745 1.63195 4.84731 1.41313 2.78665C1.39647 2.60229 1.41838 2.41649 1.47746 2.24107C1.53654 2.06564 1.63151 1.90444 1.7563 1.76773C1.8811 1.63102 2.033 1.52179 2.20232 1.447C2.37164 1.37221 2.55469 1.33349 2.73979 1.33332H4.73979C5.06333 1.33013 5.37699 1.4447 5.6223 1.65567C5.86761 1.86664 6.02784 2.15961 6.07313 2.47998C6.15754 3.12003 6.31409 3.74847 6.53979 4.35332C6.62949 4.59193 6.6489 4.85126 6.59573 5.10057C6.54256 5.34988 6.41903 5.57872 6.23979 5.75998L5.39313 6.60665C6.34216 8.27568 7.7241 9.65761 9.39313 10.6066L10.2398 9.75998C10.4211 9.58074 10.6499 9.45722 10.8992 9.40405C11.1485 9.35087 11.4078 9.37029 11.6465 9.45998C12.2513 9.68568 12.8797 9.84223 13.5198 9.92665C13.8436 9.97234 14.1394 10.1355 14.3508 10.385C14.5622 10.6345 14.6746 10.953 14.6665 11.28Z"
          stroke="#F6BB23"
          strokeLinecap="square"
        />
      </g>
      <defs>
        <clipPath id="clip0">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  </span>
);

export default CallInboundIcon;
