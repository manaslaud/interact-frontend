import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const MainWrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="grow h-screen overflow-auto px-6 py-4">{children}</div>;
};

export default MainWrapper;
