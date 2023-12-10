import Sidebar from '@/components/common/sidebar';
import TabMenu from '@/components/common/tab_menu';
import Discover from '@/screens/home/discover';
import Feed from '@/screens/home/feed';
import ProfileCompletion from '@/sections/home/profile_completion';
import { homeTabSelector, onboardingSelector, setHomeTab } from '@/slices/feedSlice';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Onboarding from '@/components/common/onboarding';
import { userSelector } from '@/slices/userSlice';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Home = () => {
  const active = useSelector(homeTabSelector);
  const onboarding = useSelector(onboardingSelector);
  const user = useSelector(userSelector);

  const router = useRouter(); //TODO use window.location instead of router

  useEffect(() => {
    if (user.isOrganization) router.replace('/organisation/home');
  }, []);

  return (
    <BaseWrapper title="Home">
      <Sidebar index={1} />
      <MainWrapper>
        {onboarding && user.id != '' ? <Onboarding /> : <></>}
        <div className="w-full flex flex-col items-center relative gap-4 px-9 max-md:px-2 pt-20 pb-base_padding">
          <TabMenu items={['Feed', 'Discover']} active={active} setReduxState={setHomeTab} />
          <div className={`${active === 0 ? 'block' : 'hidden'}`}>
            {user.id != '' ? (
              <Feed />
            ) : (
              <Link
                href={'/signup'}
                className="w-4/5 mx-auto h-fit px-12 max-md:px-8 py-8 rounded-md dark:text-white font-primary border-gray-300 dark:border-dark_primary_btn border-[1px] bg-white dark:bg-dark_primary_comp hover:shadow-lg dark:hover:shadow-2xl flex-center flex-col gap-2 cursor-pointer transition-ease-500"
              >
                <div className="text-xl max-md:text-lg font-medium text-center">
                  <span className="text-2xl font-semibold max-md:block">Fresh to the scene?</span> Complete your sign up
                  now!
                </div>
                <div className="text-lg max-md:text-base text-center">
                  Follow users to see their posts, and explore trending posts on the{' '}
                  <span className="font-bold text-xl max-md:text-lg text-gradient">Discover</span> page! 🚀
                </div>
              </Link>
            )}
          </div>
          <div className={`${active === 1 ? 'block' : 'hidden'}`}>
            <Discover />
          </div>
          <ProfileCompletion />
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Home;
