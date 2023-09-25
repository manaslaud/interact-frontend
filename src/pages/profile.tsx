import TabMenu from '@/components/common/tab_menu';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Sidebar from '@/components/common/sidebar';
import React, { useEffect, useState } from 'react';
import { initialUser } from '@/types/initials';
import { USER_COVER_PIC_URL, USER_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { navbarOpenSelector } from '@/slices/feedSlice';
import Posts from '@/screens/profile/posts';
import Projects from '@/screens/profile/projects';
import { Membership, Project } from '@/types';
import ProfileCard from '@/sections/profile/profile_card';
import { Pen } from '@phosphor-icons/react';
import { resizeImage } from '@/utils/resize_image';
import ProfileCardLoader from '@/components/loaders/profile_card';
import { SERVER_ERROR } from '@/config/errors';

const Profile = () => {
  const [active, setActive] = useState(0);
  const [user, setUser] = useState(initialUser);
  const [projects, setProjects] = useState<Project[]>([]);
  const [collaboratingProjects, setCollaboratingProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const [tagline, setTagline] = useState('');
  const [coverPic, setCoverPic] = useState<File>();
  const [coverPicView, setCoverPicView] = useState('');
  const open = useSelector(navbarOpenSelector);

  const getUser = () => {
    const URL = `${USER_URL}/me`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setUser(res.data.user);
          const projects: Project[] = [];
          res.data.user.memberships?.map((membership: Membership) => {
            projects.push(membership.project);
          });
          setCollaboratingProjects(projects);
          setProjects(res.data.user.projects || []);
          setTagline(res.data.user.tagline);
          setCoverPicView(`${USER_COVER_PIC_URL}/${res.data.user.coverPic}`);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    getUser();
    const action = new URLSearchParams(window.location.search).get('action');
    if (action && action == 'edit') setClickedOnEdit(true);
  }, []);

  return (
    <BaseWrapper title="Profile">
      <Sidebar index={7} />
      <MainWrapper>
        <div className="w-full max-lg:w-full flex max-md:flex-col transition-ease-out-500 font-primary">
          {clickedOnEdit ? (
            <>
              <input
                type="file"
                className="hidden"
                id="coverPic"
                multiple={false}
                onChange={async ({ target }) => {
                  if (target.files && target.files[0]) {
                    const file = target.files[0];
                    if (file.type.split('/')[0] == 'image') {
                      const resizedPic = await resizeImage(file, 900, 500);
                      setCoverPicView(URL.createObjectURL(resizedPic));
                      setCoverPic(resizedPic);
                    } else Toaster.error('Only Image Files can be selected');
                  }
                }}
              />
              <label htmlFor="coverPic">
                <div className="w-12 h-12 absolute top-1 right-1 mt-navbar rounded-full z-20 flex-center bg-white transition-ease-200 cursor-pointer opacity-50 hover:opacity-75">
                  <Pen color="black" size={24} />
                </div>
              </label>
              <Image
                crossOrigin="anonymous"
                className={`${
                  open ? 'w-no_side_base_open' : 'w-no_side_base_close'
                } max-md:w-screen h-64 cursor-default fixed top-navbar fade-img transition-ease-out-500 object-cover`}
                width={10000}
                height={10000}
                alt="/"
                src={coverPicView}
              />
            </>
          ) : (
            <>
              {user.coverPic != '' ? (
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
              ) : (
                <></>
              )}
            </>
          )}

          {loading ? (
            <ProfileCardLoader />
          ) : (
            <ProfileCard
              clickedOnEdit={clickedOnEdit}
              setClickedOnEdit={setClickedOnEdit}
              user={user}
              setUser={setUser}
              tagline={tagline}
              coverPic={coverPic}
            />
          )}
          <div className={`grow flex flex-col gap-12 pt-12 max-md:pt-0`}>
            {clickedOnEdit ? (
              <input
                value={tagline}
                onChange={el => setTagline(el.target.value)}
                placeholder="Add a Professional One Liner"
                maxLength={25}
                className="w-full h-fit focus:outline-none font-bold text-5xl max-md:text-3xl text-center dark:text-white bg-transparent z-10"
              />
            ) : (
              <>
                {loading ? (
                  <></>
                ) : (
                  <>
                    {user.tagline != '' ? (
                      <div className="w-full h-fit font-bold text-5xl max-md:text-3xl text-center dark:text-white">
                        {user.tagline}
                      </div>
                    ) : (
                      <div
                        onClick={() => setClickedOnEdit(true)}
                        className="w-full h-fit font-bold text-5xl max-md:text-3xl text-center dark:text-white cursor-pointer z-10"
                      >
                        Add A Tagline
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            <TabMenu
              items={['Posts', 'Projects', 'Collaborating']}
              active={active}
              setState={setActive}
              width={'640px'}
            />

            <div className={`${active === 0 ? 'block' : 'hidden'}`}>
              <Posts posts={user.posts || []} />
            </div>
            <div className={`${active === 1 ? 'block' : 'hidden'}`}>
              <Projects projects={projects || []} setProjects={setProjects} displayOnProfile={true} />
            </div>
            <div className={`${active === 2 ? 'block' : 'hidden'} `}>
              <Projects projects={collaboratingProjects || []} />
            </div>
            <div className={`${active === 3 ? 'block' : 'hidden'} `}></div>
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Profile;
