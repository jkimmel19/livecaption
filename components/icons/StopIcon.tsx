
import React from 'react';

interface StopIconProps extends React.SVGProps<SVGSVGElement> {}

const StopIcon: React.FC<StopIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="6" y="6" width="12" height="12"></rect>
  </svg>
);

export default StopIcon;
