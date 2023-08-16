import { userSelector } from '@/slices/userSlice';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import Plus from '@phosphor-icons/react/dist/icons/Plus';

const NewPost = () => {
  let profilePic = useSelector(userSelector).profilePic;

  useEffect(() => {
    profilePic = profilePic == '' ? 'default.jpg' : profilePic;
  }, []);
  return (
    <div className="w-full h-16 px-4 py-3 border-2 rounded-xl transition-ease-200 hover:shadow-md flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Image
          crossOrigin="anonymous"
          className="w-8 h-8 rounded-full cursor-pointer"
          width={10000}
          height={10000}
          alt="user"
          src={`${USER_PROFILE_PIC_URL}/${profilePic}`}
        />
        <div className="font-primary text-gray-400">Create a new post</div>
      </div>
      <Plus
        size={32}
        className="text-gray-400 flex-center rounded-full hover:bg-[#478EE133] p-2 hover:text-[#478EE1] transition-ease-200 cursor-pointer"
        weight="regular"
      />
    </div>
  );
};

export default NewPost;
