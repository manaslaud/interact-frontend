import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const SideWrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="w-navbar_open h-full pr-[120px] py-6 flex flex-col gap-2 border-l-2">{children}</div>;
};

export default SideWrapper;
