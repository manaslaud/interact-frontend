import Navbar from '@/components/common/navbar';
import Navigation from '@/components/common/navigation';
import React from 'react';

const Base = () => {
  return (
    <>
      <Navbar />
      <div className="w-full flex h-base">
        <Navigation index={-1} />
        <div className="w-base h-base overflow-auto flex flex-col gap-8 px-6 py-4"></div>
        <div className="w-navigation h-full pr-[120px] py-6 flex flex-col gap-2 border-l-2"></div>;
      </div>
    </>
  );
};

export default Base;
