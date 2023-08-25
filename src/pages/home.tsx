import Navbar from '@/components/common/navbar';
import TabMenu from '@/components/common/tab_menu';
import Discover from '@/screens/home_screens/discover';
import Feed from '@/screens/home_screens/feed';
import { homeTabSelector, navbarOpenSelector, setHomeTab } from '@/slices/feedSlice';
import Protect from '@/utils/protect';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import SideWrapper from '@/wrappers/side';
import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const active = useSelector(homeTabSelector);
  const navbarOpen = useSelector(navbarOpenSelector);
  return (
    <BaseWrapper>
      <Navbar index={1} />
      <MainWrapper>
        <div
          className={`${
            navbarOpen ? 'w-base_open' : 'w-base_close'
          } max-lg:w-full flex flex-col gap-4 transition-ease-out-500`}
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
      <SideWrapper>
        <div></div>
      </SideWrapper>
    </BaseWrapper>
  );
};

export default Protect(Home);
