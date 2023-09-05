import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const MainWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <div className="grow mt-16 max-md:w-full transition-ease-500">
        <div className="bg-white h-[1px] w-full sticky top-16 z-10"></div>
        <div className="bg-[#070615ab] h-base w-full fixed top-16 backdrop-blur-md -z-10"></div>
        {children}
      </div>
    </>
  );
};

export default MainWrapper;
