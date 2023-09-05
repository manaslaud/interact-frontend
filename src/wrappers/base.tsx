import Navbar from '@/components/common/navbar';
import React, { ReactNode } from 'react';
import { ReactSVG } from 'react-svg';

interface WrapperProps {
  children: ReactNode;
}

const BaseWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="w-full">
      <Navbar />
      <div className="w-full flex">{children}</div>
      <ReactSVG className="fixed -z-50 top-0 right-0" src="/assets/base.svg" />
    </div>
  );
};

export default BaseWrapper;
