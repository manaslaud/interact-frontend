import {
  setProfilePic,
  setReduxBio,
  setReduxLinks,
  setReduxName,
  setReduxTagline,
  userSelector,
} from '@/slices/userSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spline from '@splinetool/react-spline';
import Link from 'next/link';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL, USER_URL } from '@/config/routes';
import getDomainName from '@/utils/get_domain_name';
import getIcon from '@/utils/get_icon';
import { Camera, Plus, X } from '@phosphor-icons/react';
import Tags from '@/components/utils/edit_tags';
import Links from '@/components/utils/edit_links';
import { SERVER_ERROR } from '@/config/errors';
import patchHandler from '@/handlers/patch_handler';
import Toaster from '@/utils/toaster';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { resizeImage } from '@/utils/resize_image';
import Protect from '@/utils/protect';
import WidthCheck from '@/utils/widthCheck';
import { setOnboarding } from '@/slices/feedSlice';

const Onboarding = () => {
  const [clickedOnBuild, setClickedOnBuild] = useState(false);
  const user = useSelector(userSelector);
  const [name, setName] = useState(user.name);
  const [tagline, setTagline] = useState('');
  const [bio, setBio] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [userPic, setUserPic] = useState<File | null>();
  const [userPicView, setUserPicView] = useState(USER_PROFILE_PIC_URL + '/' + user.profilePic);

  const [step, setStep] = useState(1);

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    if (process.env.NODE_ENV != 'development') {
      const onboardingRedirect = sessionStorage.getItem('onboarding-redirect');
      if (!onboardingRedirect || !onboardingRedirect.startsWith('signup')) router.replace('/home');
      return () => {
        if (onboardingRedirect) sessionStorage.removeItem('onboarding-redirect');
      };
    }
  }, []);

  const handleSubmit = async () => {
    if (name.trim() == '') {
      Toaster.error('Name Cannot be empty', 'validation_toaster');
      return;
    }

    const toaster = Toaster.startLoad('Setting your Profile...');
    const formData = new FormData();
    if (userPic) formData.append('profilePic', userPic);
    if (name != user.name) formData.append('name', name);
    if (bio != user.bio) formData.append('bio', bio);
    if (tagline != user.tagline) formData.append('tagline', tagline);
    tags.forEach(tag => formData.append('tags', tag));
    links.forEach(link => formData.append('links', link));

    const URL = `${USER_URL}/me`;

    const res = await patchHandler(URL, formData, 'multipart/form-data');

    if (res.statusCode === 200) {
      const profilePic = res.data.user.profilePic;
      dispatch(setProfilePic(profilePic));
      if (name != user.name) dispatch(setReduxName(name));
      if (bio != user.bio) dispatch(setReduxBio(bio));
      if (tagline != user.tagline) dispatch(setReduxTagline(tagline));
      dispatch(setReduxLinks(links));
      dispatch(setOnboarding(true));
      if (user.isOrganization) router.replace('/organisation/home');
      else router.replace('/home');
      Toaster.stopLoad(toaster, 'Profile Ready!', 1);
    } else if (res.statusCode == 413) {
      Toaster.stopLoad(toaster, 'Image too large', 0);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Onboarding | Interact</title>
      </Head>
      <div className="w-screen h-screen">
        {!clickedOnBuild ? (
          <div className="glassMorphism animate-fade_1 page w-[40rem] max-md:w-[90%] h-64 max-md:h-72 px-8 py-10 font-primary flex flex-col justify-between rounded-lg shadow-xl hover:shadow-2xl transition-ease-300 absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col gap-2">
              <div className="text-5xl font-bold"> Build Your Organisation</div>
              <div>and get yourself discovered!</div>
            </div>

            <div className="w-full flex items-center justify-between gap-4">
              <Link href={'/home'} className="h-fit hover-underline-animation after:bg-black">
                maybe later
              </Link>
              <div
                onClick={() => setClickedOnBuild(true)}
                className={`text-lg py-2 font-medium px-4 backdrop-blur-xl hover:shadow-lg ${
                  clickedOnBuild ? 'cursor-default' : 'cursor-pointer'
                } transition-ease-300 rounded-xl`}
              >
                continue
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex justify-between font-primary items-center absolute top-0 left-0 px-24 max-md:px-4 animate-fade_half">
            <div className="w-1/2 max-md:w-full flex flex-col gap-4 backdrop-blur-xl rounded-xl shadow-xl p-8 animate-fade_half">
              <div className="text-5xl max-md:text-3xl font-bold">
                {step == 1
                  ? 'Name of the Organisation'
                  : step == 2
                  ? 'Add A Tagline'
                  : step == 3
                  ? 'Add A Short Bio'
                  : step == 4
                  ? 'Add Tags'
                  : step == 5
                  ? 'Add a Profile Picture'
                  : step == 6
                  ? 'Almost Done!'
                  : ''}
              </div>

              {step == 1 ? (
                <form
                  className="w-full"
                  onSubmit={el => {
                    el.preventDefault();
                    setStep(prev => prev + 1);
                  }}
                >
                  <input
                    className="w-full bg-[#ffffff40] border-[1px] text-lg max-md:text-base border-black rounded-lg p-2 focus:outline-none"
                    type="text"
                    maxLength={25}
                    value={name}
                    onChange={el => setName(el.target.value)}
                  />
                </form>
              ) : step == 2 ? (
                <form
                  className="w-full"
                  onSubmit={el => {
                    el.preventDefault();
                    setStep(prev => prev + 1);
                  }}
                >
                  <input
                    className="w-full bg-[#ffffff40] placeholder:text-[#202020c6] border-[1px] text-lg max-md:text-base border-black rounded-lg p-2 focus:outline-none"
                    type="text"
                    maxLength={25}
                    placeholder="A Professional Tagline"
                    value={tagline}
                    onChange={el => setTagline(el.target.value)}
                  />
                </form>
              ) : step == 3 ? (
                <>
                  <textarea
                    className="bg-[#ffffff40] h-[96px] min-h-[96px] max-h-64 placeholder:text-[#202020c6] border-[1px] border-black rounded-lg p-2 focus:outline-none"
                    maxLength={300}
                    placeholder="A descriptive Bio"
                    value={bio}
                    onChange={el => setBio(el.target.value)}
                  />
                </>
              ) : step == 4 ? (
                <>
                  <Tags tags={tags} setTags={setTags} blackBorder={true} />
                </>
              ) : step == 5 ? (
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
                  <div className="relative flex items-center gap-2 hover:bg-[#ffffff40] transition-ease-300 p-2 rounded-md">
                    {userPic ? (
                      <div className="w-full flex flex-col gap-4 p-4">
                        <Image
                          crossOrigin="anonymous"
                          width={10000}
                          height={10000}
                          alt={'User Pic'}
                          src={userPicView}
                          className={`rounded-full md:hidden max-md:mx-auto w-32 h-32 cursor-default`}
                        />
                        <div className="w-full flex items-center gap-2">
                          <label className="grow cursor-pointer" htmlFor="userPic">
                            {userPic.name}
                          </label>
                          <X
                            onClick={() => {
                              setUserPic(null);
                              setUserPicView(USER_PROFILE_PIC_URL + '/' + user.profilePic);
                            }}
                            className="cursor-pointer"
                            size={20}
                          />
                        </div>
                      </div>
                    ) : (
                      <label className="w-full flex items-center gap-2 cursor-pointer" htmlFor="userPic">
                        <Camera size={24} />
                        <div> Upload Profile Picture</div>
                      </label>
                    )}
                  </div>
                </>
              ) : step == 6 ? (
                <>
                  <div>Add links to your social</div>
                  <Links links={links} setLinks={setLinks} maxLinks={3} blackBorder={true} />
                </>
              ) : (
                <></>
              )}
              <div className="w-full flex items-center justify-between">
                {step != 1 ? (
                  <div
                    onClick={() => setStep(prev => prev - 1)}
                    className="w-fit text-lg py-2 font-medium px-4 shadow-md hover:bg-[#ffffff40] hover:shadow-lg transition-ease-500 rounded-xl cursor-pointer"
                  >
                    prev
                  </div>
                ) : (
                  <Link href={'/home'} className="h-fit hover-underline-animation after:bg-black">
                    finish this later
                  </Link>
                )}
                {step != 6 ? (
                  <div
                    onClick={() => setStep(prev => prev + 1)}
                    className="w-fit text-lg py-2 font-medium px-4 shadow-md hover:bg-[#ffffff40] hover:shadow-lg transition-ease-500 rounded-xl cursor-pointer"
                  >
                    continue
                  </div>
                ) : (
                  <div
                    onClick={handleSubmit}
                    className="w-fit text-lg py-2 font-medium px-4 shadow-md hover:bg-[#ffffff40] hover:shadow-lg transition-ease-500 rounded-xl cursor-pointer"
                  >
                    complete
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/3 h-3/4 p-6 gap-6 shadow-2xl font-primary flex flex-col items-center animate-fade_half backdrop-blur-xl max-md:hidden rounded-md">
              <Image
                crossOrigin="anonymous"
                width={10000}
                height={10000}
                alt={'User Pic'}
                src={userPicView}
                className={`rounded-full max-md:mx-auto w-44 h-44 cursor-default`}
              />
              <div className={`text-3xl text-center font-bold`}>{name}</div>

              <div className="font-medium text-center break-words">{tagline || 'Here goes the Tagline'}</div>

              <div className={`w-full ${bio == '' ? 'italic' : ''} text-sm text-center line-clamp-6`}>
                {bio || 'Space for you to describe the organisation'}
              </div>

              {tags.length > 0 ? (
                <div className={`w-full gap-2 flex flex-wrap items-center justify-center`}>
                  {tags.map(tag => {
                    return (
                      <div className={`flex-center text-sm px-4 py-1 border-[1px] border-black  rounded-md`} key={tag}>
                        {tag}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  className={`flex-center gap-2 text-sm px-2 py-1 border-[1px] border-dashed border-black  rounded-md`}
                >
                  <Plus /> <div>Tags</div>
                </div>
              )}

              {links.length > 0 ? (
                <div className={`w-full gap-2 flex flex-wrap items-center justify-center`}>
                  {links.map((link, index) => {
                    return (
                      <Link
                        href={link}
                        target="_blank"
                        key={index}
                        className="w-fit h-8 border-[1px] border-black rounded-lg text-sm px-2 py-4 flex items-center gap-2"
                      >
                        {getIcon(getDomainName(link), 24)}
                        <div className="capitalize">{getDomainName(link)}</div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div
                  className={`flex-center gap-2 text-sm px-2 py-1 border-[1px] border-dashed border-black  rounded-md`}
                >
                  <Plus /> <div>Links</div>
                </div>
              )}
            </div>
          </div>
        )}

        <Spline scene="https://prod.spline.design/L8OKRKq5ShawCG78/scene.splinecode" />
      </div>
    </>
  );
};

export default Protect(Onboarding);
