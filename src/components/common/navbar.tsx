import { Bell, MagnifyingGlass } from '@phosphor-icons/react';
import React, { useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import { unreadNotificationsSelector } from '@/slices/feedSlice';
import useUserStateFetcher from '@/hooks/user_fetcher';

const Navbar = () => {
  let profilePic = useSelector(userSelector).profilePic;

  const userStateFetcher = useUserStateFetcher();

  const notifications = useSelector(unreadNotificationsSelector);
  useEffect(() => {
    userStateFetcher();
    profilePic = profilePic == '' ? 'default.jpg' : profilePic;
  }, []);
  return (
    <div className="w-full h-navbar px-[120px] flex items-center justify-between py-2 border-b-2">
      <ReactSVG src="/logo.svg" />
      <div className="flex gap-[12px] ">
        <div className="w-8 h-8 rounded-full flex-center border-2 border-[#D4D9E1] hover:bg-[#00000010] cursor-pointer">
          <MagnifyingGlass size={18} className="text-[#67788E]" />
        </div>
        <div className="w-8 h-8 relative rounded-full flex-center border-2 border-[#D4D9E1] hover:bg-[#00000010] cursor-pointer">
          <div className="absolute top-0 right-0 rounded-full bg-[#9f9f9f] w-5 h-5 flex-center translate-x-1/2 -translate-y-1/2">
            {notifications}
          </div>
          <Bell size={18} className="text-[#67788E]" />
        </div>
        <Image
          crossOrigin="anonymous"
          className="w-8 h-8 rounded-full cursor-pointer"
          width={10000}
          height={10000}
          alt="user"
          src={`${USER_PROFILE_PIC_URL}/${profilePic}`}
        />
      </div>
    </div>
  );
};

export default Navbar;
