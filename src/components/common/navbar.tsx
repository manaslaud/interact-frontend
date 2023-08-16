import { Bell, MagnifyingGlass } from '@phosphor-icons/react';
import React, { useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';

const Navbar = () => {
  let profilePic = useSelector(userSelector).profilePic;

  useEffect(() => {
    profilePic = profilePic == '' ? 'default.jpg' : profilePic;
  }, []);
  return (
    <div className="w-full h-navbar px-[120px] flex items-center justify-between py-2 border-b-2">
      <ReactSVG src="/logo.svg" />
      <div className="flex gap-[12px] ">
        <div className="w-8 h-8 rounded-full flex-center border-2 border-[#D4D9E1] hover:bg-[#00000010] cursor-pointer">
          <MagnifyingGlass size={18} className="text-[#67788E]" />
        </div>
        <div className="w-8 h-8 rounded-full flex-center border-2 border-[#D4D9E1] hover:bg-[#00000010] cursor-pointer">
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
