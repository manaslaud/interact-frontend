import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const MainWrapper: React.FC<WrapperProps> = ({ children }) => {
  return <div className="grow max-md:w-full">{children}</div>;
};

export default MainWrapper;
