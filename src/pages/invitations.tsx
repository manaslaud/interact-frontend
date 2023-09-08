import Sidebar from '@/components/common/sidebar';
import TabMenu from '@/components/common/tab_menu';
import SearchBar from '@/components/explore/searchbar';
import Openings from '@/screens/explore/openings';
import Projects from '@/screens/explore/projects';
import Users from '@/screens/explore/users';
import { exploreTabSelector, invitationsTabSelector, setExploreTab, setInvitationsTab } from '@/slices/feedSlice';
import Protect from '@/utils/protect';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React from 'react';
import { useSelector } from 'react-redux';

const Invitations = () => {
  const active = useSelector(invitationsTabSelector);
  const initialSearch = new URLSearchParams(window.location.search).get('search');
  return (
    <BaseWrapper>
      <Sidebar index={4} />
      <MainWrapper>
        <div className={`w-full max-lg:w-full flex flex-col gap-4 transition-ease-out-500 py-base_padding`}>
          <TabMenu
            items={['Projects', 'Organisations', 'Messenger']}
            active={active}
            setReduxState={setInvitationsTab}
          />
          <SearchBar initialValue={initialSearch && initialSearch != '' ? initialSearch : ''} />
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
    </BaseWrapper>
  );
};

export default Protect(Invitations);
