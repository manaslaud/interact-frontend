import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const MainWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <div className="grow mt-16 max-md:w-full bg-[#070615ab] transition-ease-500">
        <div className="bg-white h-[1px] w-full sticky top-16 z-10"></div>
        {children}
      </div>
    </>
  );
};

export default MainWrapper;
