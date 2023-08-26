import Sidebar from '@/components/common/sidebar';
import TabMenu from '@/components/common/tab_menu';
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
      <Sidebar index={2} />
      <MainWrapper>
        <div
          className={`${
            navbarOpen ? 'w-base_open' : 'w-base_close'
          } max-lg:w-full flex flex-col gap-4 transition-ease-out-500`}
        >
          <TabMenu items={['Projects', 'Openings', 'Users']} active={active} setReduxState={setExploreTab} />
          <div className={`${active === 0 ? 'block' : 'hidden'}`}>
            <Projects />
          </div>
          <div className={`${active === 1 ? 'block' : 'hidden'}`}>
            <Openings />
          </div>
          <div className={`${active === 2 ? 'block' : 'hidden'} `}>
            <Users />
          </div>
        </div>
      </MainWrapper>
      <SideWrapper>
        <div></div>
      </SideWrapper>
    </BaseWrapper>
  );
};

export default Protect(Explore);
