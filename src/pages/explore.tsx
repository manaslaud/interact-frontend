import Navbar from '@/components/common/navbar';
import TabMenu from '@/components/tab_menu';
import { Openings } from '@/screens/explore_screens/openings';
import Projects from '@/screens/explore_screens/projects';
import Users from '@/screens/explore_screens/users';
import { exploreTabSelector, navbarOpenSelector, setExploreTab } from '@/slices/feedSlice';
import Protect from '@/utils/protect';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import SideWrapper from '@/wrappers/side';
import React from 'react';
import { useSelector } from 'react-redux';

const Explore = () => {
  const active = useSelector(exploreTabSelector);
  const navbarOpen = useSelector(navbarOpenSelector);
  return (
    <BaseWrapper>
      <Navbar index={2} />
      <MainWrapper>
        <div className={`${navbarOpen ? 'w-base_open' : 'w-base_close'} flex flex-col gap-4 transition-ease-200`}>
          <TabMenu items={['Projects', 'Openings', 'Users']} active={active} setReduxState={setExploreTab} />
          {active == 0 ? <Projects /> : active == 1 ? <Openings /> : active == 2 ? <Users /> : <></>}
        </div>
      </MainWrapper>
      <SideWrapper>
        <div></div>
      </SideWrapper>
    </BaseWrapper>
  );
};

export default Protect(Explore);
