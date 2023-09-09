import Navbar from '@/components/common/navbar';
import React, { ReactNode } from 'react';
import { ReactSVG } from 'react-svg';

interface WrapperProps {
  children: ReactNode;
}

const BaseWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="w-full flex">{children}</div>
      <ReactSVG className="w-screen h-screen fixed -z-50 top-0 right-0" src="/assets/test.svg" />
      {/* <div className="w-screen h-screen main_bg fixed -z-50 top-0 right-0"></div> */}
    </>
  );
};

export default BaseWrapper;
