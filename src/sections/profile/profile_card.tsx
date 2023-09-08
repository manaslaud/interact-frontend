import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { User } from '@/types';
import React from 'react';
import Image from 'next/image';

interface Props {
  user: User;
}

const ProfileCard = ({ user }: Props) => {
  return (
    <div className="w-[360px] max-md:mx-auto mt-base_padding ml-base_padding h-base_md max-md:h-fit flex flex-col gap-4 text-white items-center pt-12 max-md:pt-4 px-4 bg-primary_gradient_end sticky max-md:static top-[90px] max-md:bg-transparent rounded-md z-10">
      <Image
        crossOrigin="anonymous"
        width={10000}
        height={10000}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
        className={'rounded-full max-md:mx-auto w-44 h-44 cursor-default'}
      />
      <div className="text-3xl max-md:text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary_gradient_start to-secondary_gradient_end">
        {user.name}
      </div>
      <div className="text-sm text-center">{user.bio || 'Professional Bio'}</div>
      <div className="w-full flex justify-center gap-6">
        <div className="flex gap-1">
          <div className="font-bold">{user.noFollowers}</div>
          <div>Follower{user.noFollowers != 1 ? 's' : ''}</div>
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
  );
};

export default ProfileCard;
