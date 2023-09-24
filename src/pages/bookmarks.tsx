import TabMenu from '@/components/common/tab_menu';
import { bookmarksTabSelector, setBookmarksTab } from '@/slices/feedSlice';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import SideWrapper from '@/wrappers/side';
import Sidebar from '@/components/common/sidebar';
import React from 'react';
import { useSelector } from 'react-redux';
import Posts from '@/screens/bookmarks/posts';
import Projects from '@/screens/bookmarks/projects';
import Protect from '@/utils/protect';
import Openings from '@/screens/bookmarks/openings';

const Bookmarks = () => {
  const active = useSelector(bookmarksTabSelector);
  return (
    <BaseWrapper title="Bookmarks">
      <Sidebar index={6} />
      <MainWrapper>
        <div className="w-full flex flex-col gap-4">
          <TabMenu items={['Posts', 'Projects', 'Openings']} active={active} setReduxState={setBookmarksTab} />
          <div className={`${active === 0 ? 'block' : 'hidden'}`}>
            <Posts />
          </div>
          <div className={`${active === 1 ? 'block' : 'hidden'}`}>
            <Projects />
          </div>
          <div className={`${active === 2 ? 'block' : 'hidden'}`}>
            <Openings />
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Protect(Bookmarks);
