import React from 'react';

const Import = ({ ...props }) => (
  <span className={`anticon ${props.className ? props.className : ''}`} {...props}>
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 36 36"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#import0)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20.9409 8.02304C25.0015 4.23637 30.4385 2.49886 36.0003 2.5L35.9997 5.5C31.0423 5.49899 26.388 7.04543 22.9869 10.2171C19.6071 13.3688 17.3169 18.2628 17.3164 25.2633L14.3164 25.2631C14.3169 17.5683 16.8589 11.8296 20.9409 8.02304Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.9901 2.58398H3.9892C1.78006 2.58398 -0.0108032 4.37484 -0.0108032 6.58398V30.4182C-0.0108032 32.6273 1.78006 34.4182 3.9892 34.4182H27.8077C30.0168 34.4182 31.8077 32.6273 31.8077 30.4182V17.9189H28.8077V30.4182C28.8077 30.9705 28.36 31.4182 27.8077 31.4182H3.9892C3.43691 31.4182 2.9892 30.9705 2.9892 30.4182V6.58398C2.9892 6.0317 3.43691 5.58398 3.9892 5.58398H19.9901V2.58398Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.6999 26.6356L8.60535 20.4981L10.7341 18.3843L15.9103 23.5969L22.0989 18.9716L23.8949 21.3746L16.6623 26.7802C16.0635 27.2277 15.2266 27.1661 14.6999 26.6356Z"
          fill="black"
        />
      </g>
    </svg>
  </span>
);

export default Import;
