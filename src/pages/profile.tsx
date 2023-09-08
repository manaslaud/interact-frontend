import TabMenu from '@/components/common/tab_menu';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Sidebar from '@/components/common/sidebar';
import React, { useEffect, useState } from 'react';
import { initialUser } from '@/types/initials';
import { USER_COVER_PIC_URL, USER_PROFILE_PIC_URL, USER_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { navbarOpenSelector } from '@/slices/feedSlice';
import Posts from '@/screens/profile/posts';
import Projects from '@/screens/profile/projects';
import { Membership, Project } from '@/types';

const Profile = () => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState(initialUser);
  const [collaboratingProjects, setCollaboratingProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const open = useSelector(navbarOpenSelector);

  const getUser = () => {
    const URL = `${USER_URL}/me`;
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
      <Sidebar index={-1} />
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
          <div className="w-[360px] max-md:mx-auto mt-base_padding ml-base_padding h-base_md max-md:h-fit flex flex-col gap-4 text-white items-center pt-12 max-md:pt-4 px-4 bg-primary_gradient_end sticky max-md:static top-[90px] max-md:bg-transparent rounded-md z-10">
            <Image
              crossOrigin="anonymous"
              width={10000}
              height={10000}
              alt={'User Pic'}
              src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
              className={'rounded-full max-md:mx-auto w-44 h-44 cursor-default'}
            />
            <div className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary_gradient_start to-secondary_gradient_end">
              {user.name}
            </div>
            <div className="text-sm text-center">{user.bio || 'Professional Bio'}</div>
            <div className="w-full flex justify-center gap-6">
              <div className="flex gap-1">
                <div className="font-bold">{user.noFollowers}</div>
                <div>Followers</div>
              </div>
              <div className="flex gap-1">
                <div className="font-bold">{user.noFollowing}</div>
                <div>Following</div>
              </div>
            </div>
            <div className="w-full flex flex-wrap items-center gap-2">
              {user.tags &&
                user.tags.map(tag => {
                  return <div key={tag}>tag</div>;
                })}
            </div>
          </div>
          <div className={`grow flex flex-col gap-12 pt-12 max-md:pt-0`}>
            <div className="w-full h-12 max-md:h-fit font-bold text-5xl max-md:text-3xl text-center text-white">
              {user.tagline || 'Add a Professional One Liner'}
            </div>

            <TabMenu
              items={['Posts', 'Projects', 'Collaborating', 'Openings']}
              active={active}
              setState={setActive}
              width={640}
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

export default Profile;
