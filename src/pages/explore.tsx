import Navbar from '@/components/common/navbar';
import TabMenu from '@/components/tab_menu';
import { Openings } from '@/screens/explore_screens/openings';
import Projects from '@/screens/explore_screens/projects';
import Users from '@/screens/explore_screens/users';
import Protect from '@/utils/protect';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import SideWrapper from '@/wrappers/side';
import React, { useState } from 'react';

const Explore = () => {
  const [active, setActive] = useState(0);
  return (
    <BaseWrapper>
      <Navbar index={2} />
      <MainWrapper>
        <div className="w-full flex flex-col gap-4">
          <TabMenu items={['Projects', 'Openings', 'Users']} active={active} setActive={setActive} />
          {(() => {
            switch (active) {
              case 0:
                return <Projects />;
              case 1:
                return <Openings />;
              case 2:
                return <Users />;
              default:
                return <></>;
            }
          })()}
        </div>
      </MainWrapper>
      <SideWrapper>
        <div></div>
      </SideWrapper>
    </BaseWrapper>
  );
};

export default Protect(Explore);
