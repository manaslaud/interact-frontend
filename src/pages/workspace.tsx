import React from 'react';
import Navbar from '@/components/common/navbar';
import TabMenu from '@/components/common/tab_menu';
import { setWorkspaceTab, workspaceTabSelector } from '@/slices/feedSlice';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import SideWrapper from '@/wrappers/side';
import { useSelector } from 'react-redux';
import YourProjects from '@/screens/workspace_screens/your_projects';
import ContributingProjects from '@/screens/workspace_screens/contributing_projects';
import Applications from '@/screens/workspace_screens/applications';

const Workspace = () => {
  const active = useSelector(workspaceTabSelector);
  return (
    <BaseWrapper>
      <Navbar index={3} />
      <MainWrapper>
        <div className="w-full flex flex-col gap-4">
          <TabMenu
            items={['Your Projects', 'Contributing', 'Applied At']}
            active={active}
            setReduxState={setWorkspaceTab}
          />
          <div className={`${active === 0 ? 'block' : 'hidden'}`}>
            <YourProjects />
          </div>
          <div className={`${active === 1 ? 'block' : 'hidden'}`}>
            <ContributingProjects />
          </div>
          <div className={`${active === 2 ? 'block' : 'hidden'}`}>
            <Applications />
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Workspace;
