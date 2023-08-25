import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { User } from '@/types';
import Link from 'next/link';
import FollowBtn from '../common/follow_btn';

interface Props {
  user: User;
}

const UserCard = ({ user }: Props) => {
  return (
    <div className="w-full flex flex-col rounded-2xl px-2 py-5 transition-ease-300 cursor-pointer hover:scale-105 hover:bg-slate-100">
      <div className="flex justify-between w-full">
        <Link className="flex gap-2 w-fit" href={`/explore/user/${user.id}`}>
          <Image
            crossOrigin="anonymous"
            width={10000}
            height={10000}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
            className={'rounded-full w-12 h-12 cursor-pointer border-[1px] border-black'}
          />
          <div className="flex flex-col">
            <div className="text-lg font-bold">{user.name}</div>
            <div className="flex gap-4 text-sm">
              <div>@{user.username}</div>
              <div className="flex gap-2">
                <div>•</div>
                <div>
                  {user.noFollowers} Follower{user.noFollowers > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </Link>
        <FollowBtn toFollowID={user.id} />
      </div>
      <Link href={`/explore/user/${user.username}`} className="w-full pl-14">
        {user.tagline}
      </Link>
    </div>
  );
};

export default UserCard;
