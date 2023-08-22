import Navbar from '@/components/common/navbar';
import TabMenu from '@/components/tab_menu';
import Discover from '@/screens/home_screens/discover';
import Feed from '@/screens/home_screens/feed';
import Protect from '@/utils/protect';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import SideWrapper from '@/wrappers/side';
import React, { useState } from 'react';

const Home = () => {
  const [active, setActive] = useState(0);
  return (
    <BaseWrapper>
      <Navbar index={1} />
      <MainWrapper>
        <div className="w-full flex flex-col gap-4">
          <TabMenu items={['Feed', 'Discover']} active={active} setActive={setActive} />
          {active == 0 ? <Feed /> : active == 1 ? <Discover /> : <></>}
        </div>
      </MainWrapper>
      <SideWrapper>
        <div></div>
      </SideWrapper>
    </BaseWrapper>
  );
};

export default Protect(Home);
