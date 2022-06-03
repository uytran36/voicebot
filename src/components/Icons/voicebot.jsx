import React from 'react';

const VoiceBot = ({ ...props }) => {
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
          fill="url(#bg)"
        />
        <path
          d="M27.0264 20.7495C26.6381 20.7495 26.3238 21.0638 26.3238 21.4522C26.3238 24.9394 23.4871 27.7762 19.9998 27.7762C16.5125 27.7762 13.6758 24.9394 13.6758 21.4522C13.6758 21.0638 13.3615 20.7495 12.9732 20.7495C12.5848 20.7495 12.2705 21.0638 12.2705 21.4522C12.2705 25.477 15.3637 28.7893 19.2971 29.1459V30.5869H15.7838C15.3954 30.5869 15.0811 30.9012 15.0811 31.2895C15.0811 31.6779 15.3954 31.9922 15.7838 31.9922H24.2158C24.6042 31.9922 24.9185 31.6779 24.9185 31.2895C24.9185 30.9012 24.6042 30.5869 24.2158 30.5869H20.7025V29.1459C24.6359 28.7893 27.7291 25.477 27.7291 21.4522C27.7292 21.0638 27.4149 20.7495 27.0264 20.7495Z"
          fill="url(#part1)"
        />
        <path
          d="M19.9997 8.00781C17.2878 8.00781 15.0811 10.2146 15.0811 12.9265V21.4522C15.0811 24.1641 17.2878 26.3709 19.9997 26.3709C22.7116 26.3709 24.9184 24.1641 24.9184 21.4522V12.9265C24.9184 10.2146 22.7116 8.00781 19.9997 8.00781Z"
          fill="url(#part2)"
        />
        <defs>
          <linearGradient
            id="bg"
            x1="20"
            y1="40"
            x2="20"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FFBEF9" />
            <stop offset="1" stopColor="#FFF1FF" />
          </linearGradient>
          <linearGradient
            id="part1"
            x1="19.9998"
            y1="31.9922"
            x2="19.9998"
            y2="20.7495"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A93AFF" />
            <stop offset="1" stopColor="#FF81FF" />
          </linearGradient>
          <linearGradient
            id="part2"
            x1="19.9997"
            y1="26.3709"
            x2="19.9997"
            y2="8.00781"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#A93AFF" />
            <stop offset="1" stopColor="#FF81FF" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
};

export default VoiceBot;
