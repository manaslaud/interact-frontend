import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const BaseWrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="w-full flex h-screen">{children}</div>;
};

export default BaseWrapper;
