import React, { useState } from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { User } from '@/types';
import Link from 'next/link';
import FollowBtn from '../common/follow_btn';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';

interface Props {
  user: User;
  forTrending?: boolean;
}

const UserCard = ({ user, forTrending = false }: Props) => {
  const [noFollowers, setNoFollowers] = useState(user.noFollowers);
  const loggedInUser = useSelector(userSelector);
  return (
    <Link
      href={`${user.username != loggedInUser.username ? `/explore/user/${user.username}` : '/profile'}`}
      className={`w-full font-primary dark:text-white border-[1px] dark:border-dark_primary_btn dark:bg-transparent dark:hover:bg-transparent rounded-lg flex flex-col ${
        !forTrending
          ? 'px-5 py-4 bg-gray-100 hover:bg-white border-primary_btn gap-4'
          : 'px-2 py-3 hover:bg-primary_comp gap-2'
      } transition-ease-300`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 w-fit">
          <Image
            crossOrigin="anonymous"
            width={10000}
            height={10000}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
            className={`rounded-full ${!forTrending ? 'w-14 h-14' : 'w-10 h-10'}`}
          />
          <div className="flex flex-col font-light">
            <div className={`text-lg ${!forTrending ? 'text-lg font-semibold' : 'text-base font-medium'}`}>
              {user.name}
            </div>
            <div className={`flex gap-4 ${!forTrending ? 'text-sm' : 'text-xs'}`}>
              <div>@{user.username}</div>
              {!forTrending ? (
                <>
                  <div className="max-md:hidden">•</div>
                  <div className="max-md:hidden">
                    {noFollowers} Follower{noFollowers > 1 ? 's' : ''}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div
          onClick={el => {
            el.preventDefault();
            el.stopPropagation();
          }}
        >
          <FollowBtn toFollowID={user.id} setFollowerCount={setNoFollowers} smaller={forTrending} />
        </div>
      </div>
      {user.tagline && user.tagline != '' ? (
        <div className={`w-full ${!forTrending ? 'text-sm pl-16' : 'text-xs pl-12'}`}>{user.tagline}</div>
      ) : (
        <></>
      )}
    </Link>
  );
};

export default UserCard;
