import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const MainWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="flex flex-col grow mt-[64px] backdrop-blur-sm max-md:w-full bg-[#070615ab] transition-ease-500">
      <div className="bg-white h-[1px] w-full sticky top-16 z-10"></div>
      {children}
    </div>
  );
};

export default MainWrapper;
