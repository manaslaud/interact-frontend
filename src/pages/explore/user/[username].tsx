import TabMenu from '@/components/common/tab_menu';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Sidebar from '@/components/common/sidebar';
import React, { useEffect, useState } from 'react';
import { initialUser } from '@/types/initials';
import { EXPLORE_URL, USER_COVER_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { navbarOpenSelector } from '@/slices/feedSlice';
import Posts from '@/screens/profile/posts';
import Projects from '@/screens/profile/projects';
import { Membership, Project } from '@/types';
import { GetServerSidePropsContext } from 'next/types';
import ProfileCard from '@/sections/explore/profile_card';
import ProfileCardLoader from '@/components/loaders/profile_card';

interface Props {
  username: string;
}

const User = ({ username }: Props) => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState(initialUser);
  const [collaboratingProjects, setCollaboratingProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const open = useSelector(navbarOpenSelector);

  const getUser = () => {
    const URL = `${EXPLORE_URL}/users/${username}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setUser(res.data.user);
          const projects: Project[] = [];
          res.data.user.memberships.map((membership: Membership) => {
            projects.push(membership.project);
          });
          setCollaboratingProjects(projects);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message);
          else {
            Toaster.error('Internal Server Error');
            console.log(res);
          }
        }
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <BaseWrapper>
      <Sidebar index={2} />
      <MainWrapper>
        <div className="w-full max-lg:w-full flex max-md:flex-col transition-ease-out-500 font-primary">
          <Image
            crossOrigin="anonymous"
            width={10000}
            height={10000}
            alt={'User Pic'}
            src={`${USER_COVER_PIC_URL}/${user.coverPic}`}
            className={`${
              open ? 'w-no_side_base_open' : 'w-no_side_base_close'
            } max-md:w-screen h-64 cursor-default fixed top-navbar fade-img transition-ease-out-500 object-cover`}
          />
          {loading ? <ProfileCardLoader /> : <ProfileCard user={user} />}
          <div className={`grow flex flex-col gap-12 pt-12 max-md:pt-0`}>
            {user.tagline && user.tagline != '' ? (
              <div className="w-full h-24 font-bold text-5xl max-md:text-3xl text-center dark:text-white">
                {user.tagline}
              </div>
            ) : (
              <></>
            )}

            <TabMenu
              items={['Posts', 'Projects', 'Collaborating', 'Openings']}
              active={active}
              setState={setActive}
              width={'640px'}
            />

            <div className={`${active === 0 ? 'block' : 'hidden'}`}>
              <Posts posts={user.posts} />
            </div>
            <div className={`${active === 1 ? 'block' : 'hidden'}`}>
              <Projects projects={user.projects} />
            </div>
            <div className={`${active === 2 ? 'block' : 'hidden'} `}>
              <Projects projects={collaboratingProjects} />
            </div>
            <div className={`${active === 3 ? 'block' : 'hidden'} `}></div>
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default User;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { username } = context.query;

  return {
    props: { username },
  };
}
