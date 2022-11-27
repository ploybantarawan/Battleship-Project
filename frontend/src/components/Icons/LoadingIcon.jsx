import React from "react";

const LoadingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64px"
    height="64px"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid"
  >
    <g>
      <path
        d="M50 15A35 35 0 1 0 74.74873734152916 25.251262658470843"
        fill="none"
        stroke="#E8175D"
        strokeWidth="12"
      ></path>
      <path d="M49 3L49 27L61 15L49 3" fill="#E8175D" stroke="#E8175D"></path>
      <animateTransform
        attributeName="transform"
        type="rotate"
        repeatCount="indefinite"
        dur="1s"
        values="0 50 50;360 50 50"
        keyTimes="0;1"
      ></animateTransform>
    </g>
  </svg>
);

export default LoadingIcon;
