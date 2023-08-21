import Navbar from '@/components/common/navbar';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import SideWrapper from '@/wrappers/side';
import React from 'react';

const Base = () => {
  return (
    <BaseWrapper>
      <Navbar index={-1} />
      <MainWrapper>
        <div></div>
      </MainWrapper>
      <SideWrapper>
        <div></div>
      </SideWrapper>
    </BaseWrapper>
  );
};

export default Base;
