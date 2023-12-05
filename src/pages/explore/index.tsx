import Sidebar from '@/components/common/sidebar';
import TabMenu from '@/components/common/tab_menu';
import SearchBar from '@/components/explore/searchbar';
import Openings from '@/screens/explore/openings';
import Projects from '@/screens/explore/projects';
import Users from '@/screens/explore/users';
import ProfileCompletion from '@/sections/home/profile_completion';
import { exploreTabSelector, setExploreTab } from '@/slices/feedSlice';
import WidthCheck from '@/utils/wrappers/widthCheck';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React from 'react';
import { useSelector } from 'react-redux';

const Explore = () => {
  const active = useSelector(exploreTabSelector);
  const initialSearch = new URLSearchParams(window.location.search).get('search');
  return (
    <BaseWrapper title="Explore">
      <Sidebar index={2} />
      <MainWrapper>
        <div
          className={`w-full max-lg:w-full flex flex-col items-center gap-4 transition-ease-out-500 pt-20 pb-base_padding`}
        >
          <TabMenu items={['Projects', 'Openings', 'Users']} active={active} setReduxState={setExploreTab} />
          <SearchBar initialValue={initialSearch && initialSearch != '' ? initialSearch : ''} />
          <div className={`w-full ${active === 0 ? 'block' : 'hidden'}`}>
            <Projects />
          </div>
          <div className={`w-full ${active === 1 ? 'block' : 'hidden'}`}>
            <Openings />
          </div>
          <div className={`w-full ${active === 2 ? 'block' : 'hidden'} `}>
            <Users />
          </div>
        </div>
        <ProfileCompletion />
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Explore;
