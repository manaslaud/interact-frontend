import Notifications from '@/sections/navbar/notifications';
import { unreadNotificationsSelector } from '@/slices/feedSlice';
import { Bell, ChatCircleDots } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { userSelector } from '@/slices/userSlice';
import ProfileDropdown from '@/sections/navbar/profile_dropdown';

const Navbar = () => {
  const notifications = useSelector(unreadNotificationsSelector);
  const [clickedOnNotifications, setClickedOnNotifications] = useState(false);
  const [clickedOnProfile, setClickedOnProfile] = useState(false);
  let profilePic = useSelector(userSelector).profilePic;

  useEffect(() => {
    profilePic = profilePic == '' ? 'default.jpg' : profilePic;
  }, []);
  return (
    <>
      <div className={`${clickedOnNotifications ? '' : 'hidden'}`}>
        <Notifications setShow={setClickedOnNotifications} />
      </div>
      <div className={`${clickedOnProfile ? '' : 'hidden'}`}>
        <ProfileDropdown setShow={setClickedOnProfile} />
      </div>
      <div className="w-full h-navbar bg-navbar glassMorphism backdrop-blur-sm fixed top-0 flex justify-between px-4 items-center z-20">
        <ReactSVG src="/onboarding_logo.svg" />
        <div className="flex items-center gap-4 z-0">
          <ChatCircleDots color="white" className="cursor-pointer max-md:w-8 max-md:h-8" size={36} weight="regular" />
          <div
            onClick={() => {
              setClickedOnProfile(false);
              setClickedOnNotifications(prev => !prev);
            }}
            className="flex-center relative cursor-pointer"
          >
            {notifications > 0 ? (
              <div className="w-4 h-4 animate-pulse rounded-full absolute top-0 right-0 flex items-center justify-center text-xs bg-black text-white">
                {notifications}
              </div>
            ) : (
              <></>
            )}
            <Bell className="cursor-pointer max-md:w-8 max-md:h-8" color="white" size={36} weight="regular" />
          </div>
          <Image
            crossOrigin="anonymous"
            className="w-9 h-9 max-md:w-8 max-md:h-8 rounded-full cursor-pointer"
            onClick={() => {
              setClickedOnNotifications(false);
              setClickedOnProfile(prev => !prev);
            }}
            width={10000}
            height={10000}
            alt="user"
            src={`${USER_PROFILE_PIC_URL}/${profilePic}`}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
