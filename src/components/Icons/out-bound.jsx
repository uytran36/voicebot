import React from 'react';

const OutBound = ({ ...props }) => {
  return (
    <span {...props}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z"
          fill="url(#bg-out)"
        />
        <path
          d="M15.8066 28.2946H15.1153V25.4114C15.7036 25.2028 16.1703 24.7357 16.3789 24.1474H11.6592C11.4245 24.1474 11.1938 24.1303 10.968 24.0978V28.9859C10.968 29.3676 11.2774 29.6771 11.6592 29.6771H15.8066C16.1883 29.6771 16.4978 29.3677 16.4978 28.9859C16.4978 28.6041 16.1884 28.2946 15.8066 28.2946ZM26.8659 17.2353C26.937 17.2353 27.0092 17.2243 27.0804 17.2011L31.3199 15.8187C31.6828 15.7003 31.8811 15.3102 31.7627 14.9472C31.6444 14.5843 31.2541 14.386 30.8913 14.5043L26.6518 15.8868C26.2888 16.0051 26.0906 16.3953 26.2089 16.7582C26.3041 17.05 26.5749 17.2353 26.8659 17.2353ZM22.7188 10.323C22.337 10.323 22.0275 10.6325 22.0275 11.0143C22.0275 13.6822 19.857 15.8528 17.189 15.8528H11.6592C9.75352 15.8528 8.20312 17.4032 8.20312 19.3089C8.20312 21.2146 9.75352 22.765 11.6592 22.765H17.189C19.857 22.765 22.0275 24.9355 22.0275 27.6035C22.0275 27.9852 22.337 28.2947 22.7188 28.2947C23.1006 28.2947 23.41 27.9853 23.41 27.6035V11.0142C23.41 10.6325 23.1006 10.323 22.7188 10.323ZM31.3199 22.7989L27.0804 21.4165C26.7174 21.2982 26.3273 21.4964 26.209 21.8594C26.0906 22.2224 26.2889 22.6125 26.6519 22.7309L30.8913 24.1133C30.9625 24.1365 31.0348 24.1475 31.1058 24.1475C31.3969 24.1475 31.6677 23.9621 31.7628 23.6704C31.8811 23.3075 31.6828 22.9173 31.3199 22.7989ZM26.1748 18.6176C26.1748 18.3004 25.959 18.0239 25.6513 17.9471L24.7923 17.7324V20.8854L25.6513 20.6707C25.9589 20.5938 26.1748 20.3173 26.1748 20.0002V18.6176Z"
          fill="url(#part-out)"
        />
        <defs>
          <linearGradient
            id="bg-out"
            x1="20"
            y1="40"
            x2="20"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#ADDCFF" />
            <stop offset="0.5028" stopColor="#EAF6FF" />
            <stop offset="1" stopColor="#EAF6FF" />
          </linearGradient>
          <linearGradient
            id="part-out"
            x1="20.0001"
            y1="29.6771"
            x2="20.0001"
            y2="10.323"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5558FF" />
            <stop offset="1" stopColor="#00C0FF" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
};

export default OutBound;