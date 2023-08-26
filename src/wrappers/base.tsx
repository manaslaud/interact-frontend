import Navbar from '@/components/common/navbar';
import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

const BaseWrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="w-full">
      <Navbar />
      <div className="w-full flex"> {children}</div>
    </div>
  );
};

export default BaseWrapper;
