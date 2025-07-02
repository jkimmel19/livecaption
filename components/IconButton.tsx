
import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  label: string;
}

const IconButton: React.FC<IconButtonProps> = ({ children, label, className, ...props }) => {
  return (
    <button
      aria-label={label}
      className={`p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;
