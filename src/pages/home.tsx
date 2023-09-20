import Sidebar from '@/components/common/sidebar';
import TabMenu from '@/components/common/tab_menu';
import Discover from '@/screens/home/discover';
import Feed from '@/screens/home/feed';
import { homeTabSelector, setHomeTab } from '@/slices/feedSlice';
import Protect from '@/utils/protect';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const active = useSelector(homeTabSelector);
  return (
    <BaseWrapper>
      <Sidebar index={1} />
      <MainWrapper>
        <div
          className={`w-full max-lg:w-full flex flex-col items-center relative gap-4 transition-ease-out-500 px-9 max-md:px-2 py-base_padding`}
        >
          <TabMenu items={['Feed', 'Discover']} active={active} setReduxState={setHomeTab} />
          <div className={`${active === 0 ? 'block' : 'hidden'}`}>
            <Feed />
          </div>
          <div className={`${active === 1 ? 'block' : 'hidden'}`}>
            <Discover />
          </div>
        </div>
      </MainWrapper>
      {/* <SideWrapper>
        <div></div>
      </SideWrapper> */}
    </BaseWrapper>
  );
};

export default Protect(Home);
