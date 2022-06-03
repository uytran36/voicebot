import React from 'react';

const Delete = ({ ...props }) => (
  <span {...props}>
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 18 18"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* <path
        d="M0.440796 3C0.440796 1.34315 1.78394 0 3.4408 0H14.4685C16.1253 0 17.4685 1.34315 17.4685 3V15C17.4685 16.6569 16.1253 18 14.4685 18H3.4408C1.78394 18 0.440796 16.6569 0.440796 15V3Z"
        fill="#1169B0"
      /> */}
      <path
        d="M13.8435 3.75H11.2827V3.3125C11.2827 2.58879 10.6561 2 9.88586 2H8.02346C7.25327 2 6.62666 2.58879 6.62666 3.3125V3.75H4.06586C3.42403 3.75 2.90186 4.24066 2.90186 4.84375V6.375C2.90186 6.61661 3.11033 6.8125 3.36746 6.8125H3.62191L4.02416 14.7499C4.05969 15.4509 4.67253 16 5.41936 16H12.49C13.2368 16 13.8497 15.4509 13.8852 14.7499L14.2874 6.8125H14.5419C14.799 6.8125 15.0075 6.61661 15.0075 6.375V4.84375C15.0075 4.24066 14.4853 3.75 13.8435 3.75ZM7.55786 3.3125C7.55786 3.07127 7.76674 2.875 8.02346 2.875H9.88586C10.1426 2.875 10.3515 3.07127 10.3515 3.3125V3.75H7.55786V3.3125ZM3.83306 4.84375C3.83306 4.72314 3.9375 4.625 4.06586 4.625H13.8435C13.9718 4.625 14.0763 4.72314 14.0763 4.84375V5.9375C13.9328 5.9375 4.42766 5.9375 3.83306 5.9375V4.84375ZM12.955 14.7083C12.9432 14.942 12.7389 15.125 12.49 15.125H5.41936C5.17041 15.125 4.96612 14.942 4.95431 14.7083L4.55416 6.8125H13.3552L12.955 14.7083Z"
        // fill="white"
      />
      <path
        d="M8.95468 14.25C9.2118 14.25 9.42028 14.0541 9.42028 13.8125V8.125C9.42028 7.88339 9.2118 7.6875 8.95468 7.6875C8.69755 7.6875 8.48907 7.88339 8.48907 8.125V13.8125C8.48907 14.0541 8.69752 14.25 8.95468 14.25Z"
        // fill="white"
      />
      <path
        d="M11.2827 14.25C11.5398 14.25 11.7483 14.0541 11.7483 13.8125V8.125C11.7483 7.88339 11.5398 7.6875 11.2827 7.6875C11.0256 7.6875 10.8171 7.88339 10.8171 8.125V13.8125C10.8171 14.0541 11.0255 14.25 11.2827 14.25Z"
        // fill="white"
      />
      <path
        d="M6.62667 14.25C6.8838 14.25 7.09227 14.0541 7.09227 13.8125V8.125C7.09227 7.88339 6.8838 7.6875 6.62667 7.6875C6.36954 7.6875 6.16107 7.88339 6.16107 8.125V13.8125C6.16107 14.0541 6.36952 14.25 6.62667 14.25Z"
        // fill="white"
      />
    </svg>
  </span>
);

export default Delete;
