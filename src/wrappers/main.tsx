import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const MainWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <div className="grow mt-navbar max-md:w-screen max-md:pb-bottomBar transition-ease-500">
        <div className="bg-white h-[1px] w-full sticky top-16 z-10"></div>
        <div className="bg-main h-base w-full fixed top-16 backdrop-blur-md -z-10"></div>
        {children}
      </div>
    </>
  );
};

export default MainWrapper;
