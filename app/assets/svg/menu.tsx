import React from 'react';

const MenuSvg = ({ openNavigation }:{ openNavigation:boolean }) => {
  return (
    <svg
      className="overflow-visible"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className="transition-all origin-center fill-foreground"
        x="2"
        y={openNavigation ? "11" : "5"}
        width="20"
        height="2"
        rx="1"
        fill="white"
        transform={openNavigation ? "rotate(45 0 0)" : "rotate(0)"}
      />
      <rect
        className="transition-all origin-center fill-foreground"
        x="2"
        y={openNavigation ? "11" : "11"}
        width="20"
        height="2"
        rx="1"
        fill="white"
        opacity={openNavigation ? "0" : "1"}
      />
      <rect
        className="transition-all origin-center fill-foreground"
        x="2"
        y={openNavigation ? "11" : "17"}
        width="20"
        height="2"
        rx="1"
        fill="white"
        transform={openNavigation ? "rotate(-45 0 0)" : "rotate(0)"}
      />
    </svg>
  );
};

export default MenuSvg;
