import { USER_PROFILE_PIC_URL, USER_URL } from '@/config/routes';
import { User } from '@/types';
import React, { useState } from 'react';
import Image from 'next/image';
import Tags from '@/components/utils/edit_tags';
import Toaster from '@/utils/toaster';
import { resizeImage } from '@/utils/resize_image';
import { ArrowArcLeft, Check, Pen } from '@phosphor-icons/react';
import { useDispatch } from 'react-redux';
import patchHandler from '@/handlers/patch_handler';
import { setProfilePic, setReduxName } from '@/slices/userSlice';
import Links from '@/components/utils/edit_links';
import getDomainName from '@/utils/get_domain_name';
import getIcon from '@/utils/get_icon';
import Link from 'next/link';
import { setExploreTab } from '@/slices/feedSlice';
import isArrEdited from '@/utils/check_array_edited';
import Connections from '../explore/connections_view';
import { SERVER_ERROR } from '@/config/errors';

interface Props {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  clickedOnEdit: boolean;
  setClickedOnEdit: React.Dispatch<React.SetStateAction<boolean>>;
  tagline: string;
  coverPic?: File;
}

const ProfileCard = ({ user, setUser, clickedOnEdit, setClickedOnEdit, tagline, coverPic }: Props) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [tags, setTags] = useState(user.tags || []);
  const [links, setLinks] = useState(user.links || []);
  const [userPic, setUserPic] = useState<File>();
  const [userPicView, setUserPicView] = useState<string>(`${USER_PROFILE_PIC_URL}/${user.profilePic}`);

  const [mutex, setMutex] = useState(false);

  const [clickedOnFollowers, setClickedOnFollowers] = useState(false);
  const [clickedOnFollowing, setClickedOnFollowing] = useState(false);

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Updating your Profile...');
    const formData = new FormData();
    if (coverPic) formData.append('coverPic', coverPic);
    if (userPic) formData.append('profilePic', userPic);
    if (name != user.name) formData.append('name', name);
    if (bio != user.bio) formData.append('bio', bio);
    if (tagline != user.tagline) formData.append('tagline', tagline);
    if (isArrEdited(tags, user.tags)) tags.forEach(tag => formData.append('tags', tag));
    if (isArrEdited(links, user.links)) links.forEach(link => formData.append('links', link));

    const URL = `${USER_URL}/me`;

    const res = await patchHandler(URL, formData, 'multipart/form-data');

    if (res.statusCode === 200) {
      const profilePic = res.data.user.profilePic;
      const coverPic = res.data.user.coverPic;
      setUser(prev => ({ ...prev, name, bio, tags, links, tagline, profilePic, coverPic }));
      dispatch(setProfilePic(profilePic));
      dispatch(setReduxName(name));
      Toaster.stopLoad(toaster, 'Profile Updated', 1);
      setClickedOnEdit(false);
    } else if (res.statusCode == 413) {
      Toaster.stopLoad(toaster, 'Image/s too large', 0);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
    setMutex(false);
  };
  return (
    <>
      {clickedOnFollowers ? <Connections type="followers" user={user} setShow={setClickedOnFollowers} /> : <></>}
      {clickedOnFollowing ? <Connections type="following" user={user} setShow={setClickedOnFollowing} /> : <></>}
      <div className="w-[360px] overflow-y-auto overflow-x-hidden pb-4 max-md:mx-auto font-primary mt-base_padding max-md:mb-12 ml-base_padding h-base_md max-md:h-fit flex flex-col gap-4 dark:text-white items-center pt-12 max-md:pb-8 max-md:pt-4 px-4 bg-[#ffffff2d] dark:bg-[#84478023] backdrop-blur-md shadow-md dark:shadow-none border-[1px] border-gray-300  dark:border-dark_primary_btn sticky max-md:static top-[90px] max-md:bg-transparent rounded-md z-10">
        {clickedOnEdit ? (
          <>
            <input
              type="file"
              className="hidden"
              id="userPic"
              multiple={false}
              onChange={async ({ target }) => {
                if (target.files && target.files[0]) {
                  const file = target.files[0];
                  if (file.type.split('/')[0] == 'image') {
                    const resizedPic = await resizeImage(file, 500, 500);
                    setUserPicView(URL.createObjectURL(resizedPic));
                    setUserPic(resizedPic);
                  } else Toaster.error('Only Image Files can be selected');
                }
              }}
            />
            <label className="relative" htmlFor="userPic">
              <div className="w-44 h-44 max-md:w-32 max-md:h-32 absolute top-0 right-0 rounded-full flex-center bg-white transition-ease-200 cursor-pointer opacity-0 hover:opacity-50">
                <Pen color="black" size={32} />
              </div>
              <Image
                crossOrigin="anonymous"
                className="w-44 h-44 rounded-full object-cover transition-ease-200 cursor-pointer max-md:w-32 max-md:h-32"
                width={10000}
                height={10000}
                alt="/"
                src={userPicView}
              />
            </label>
          </>
        ) : (
          <Image
            crossOrigin="anonymous"
            width={10000}
            height={10000}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
            className={'rounded-full max-md:mx-auto w-44 h-44 cursor-default'}
          />
        )}
        {clickedOnEdit ? (
          <div>
            <div className="text-sm ml-1 font-medium">Name</div>
            <input
              maxLength={25}
              value={name}
              onChange={el => setName(el.target.value)}
              placeholder="Interact User"
              className="w-full focus:outline-none border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg  text-3xl p-2 max-md:text-2xl text-center font-bold bg-transparent"
            />
          </div>
        ) : (
          <div className="text-3xl max-md:text-2xl text-center font-bold text-gradient">{user.name}</div>
        )}
        {clickedOnEdit ? (
          <div className="w-full">
            <div className="text-sm ml-1 font-medium">Bio</div>
            <textarea
              value={bio}
              onChange={el => setBio(el.target.value)}
              placeholder="add a professional bio"
              maxLength={300}
              className="w-full min-h-[72px] max-h-[200px] focus:outline-none border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg p-2 text-sm bg-transparent"
            />
          </div>
        ) : (
          <div
            onClick={() => {
              if (user.bio == '') setClickedOnEdit(true);
            }}
            className={`text-sm text-center ${user.bio == '' ? 'cursor-pointer' : 'cursor-default'}`}
          >
            {user.bio || 'Add a professional bio'}
          </div>
        )}
        {clickedOnEdit ? (
          <></>
        ) : (
          <div className="w-full flex justify-center gap-6">
            <div onClick={() => setClickedOnFollowers(true)} className="flex gap-1 cursor-pointer">
              <div className="font-bold">{user.noFollowers}</div>
              <div>Follower{user.noFollowers != 1 ? 's' : ''}</div>
            </div>
            <div onClick={() => setClickedOnFollowing(true)} className="flex gap-1 cursor-pointer">
              <div className="font-bold">{user.noFollowing}</div>
              <div>Following</div>
            </div>
          </div>
        )}
        <div className="w-full flex flex-col gap-8 mt-12">
          {clickedOnEdit ? (
            <div className="w-full flex flex-col gap-2 ml-1">
              <div className="text-sm font-medium cursor-default">Tags ({tags.length || 0}/5)</div>
              <Tags tags={tags} setTags={setTags} />
            </div>
          ) : (
            <div className="w-full flex flex-wrap items-center justify-center gap-2">
              {user.tags &&
                user.tags.map(tag => {
                  return (
                    <Link
                      href={`/explore?search=` + tag}
                      target="_blank"
                      onClick={() => dispatch(setExploreTab(2))}
                      className="flex-center text-sm px-4 py-1 border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-md cursor-pointer"
                      key={tag}
                    >
                      {tag}
                    </Link>
                  );
                })}
            </div>
          )}
          {clickedOnEdit ? (
            <Links links={links} setLinks={setLinks} maxLinks={3} />
          ) : (
            <div className="w-full h-fit flex flex-wrap items-center justify-center gap-4">
              {user.links &&
                user.links.map((link, index) => {
                  return (
                    <Link
                      href={link}
                      target="_blank"
                      key={index}
                      className="w-fit h-8 border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg text-sm px-2 py-4 flex items-center gap-2"
                    >
                      {getIcon(getDomainName(link), 24)}
                      <div className="capitalize">{getDomainName(link)}</div>
                    </Link>
                  );
                })}
            </div>
          )}
        </div>

        {clickedOnEdit ? (
          <div
            onClick={() => {
              setClickedOnEdit(false);
            }}
            className="dark:text-white absolute top-4 left-4 p-2 flex-center font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gradient-to-r dark:hover:from-dark_secondary_gradient_start dark:hover:to-dark_secondary_gradient_end transition-ease-300 rounded-full cursor-pointer"
          >
            <ArrowArcLeft size={24} />
          </div>
        ) : (
          <></>
        )}
        <div
          onClick={() => {
            clickedOnEdit ? handleSubmit() : setClickedOnEdit(true);
          }}
          className="dark:text-white hover:text-white absolute max-md:static top-4 right-4 p-2 flex-center font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gradient-to-r hover:from-dark_secondary_gradient_start hover:to-dark_secondary_gradient_end rounded-full cursor-pointer"
        >
          {clickedOnEdit ? <Check size={24} /> : <Pen size={24} />}
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
