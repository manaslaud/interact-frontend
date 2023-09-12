import React from 'react';
import Sidebar from '@/components/common/sidebar';
import TabMenu from '@/components/common/tab_menu';
import { setWorkspaceTab, workspaceTabSelector } from '@/slices/feedSlice';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import { useSelector } from 'react-redux';
import YourProjects from '@/screens/workspace/your_projects';
import ContributingProjects from '@/screens/workspace/contributing_projects';
import Applications from '@/screens/workspace/applications';
import Protect from '@/utils/protect';

const Workspace = () => {
  const active = useSelector(workspaceTabSelector);
  return (
    <BaseWrapper>
      <Sidebar index={3} />
      <MainWrapper>
        <div className="w-full flex flex-col gap-4 py-base_padding">
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

export default Protect(Workspace);
