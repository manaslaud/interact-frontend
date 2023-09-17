import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { User } from '@/types';
import React, { useState } from 'react';
import Image from 'next/image';
import getDomainName from '@/utils/get_domain_name';
import Link from 'next/link';
import getIcon from '@/utils/get_icon';
import { useDispatch } from 'react-redux';
import { setExploreTab } from '@/slices/feedSlice';
import FollowBtn from '@/components/common/follow_btn';
import { Share, Warning } from '@phosphor-icons/react';
import ShareProfile from '../lowers/share_profile';
interface Props {
  user: User;
}

const ProfileCard = ({ user }: Props) => {
  const dispatch = useDispatch();
  const [numFollowers, setNumFollowers] = useState(user.noFollowers);
  const [clickedOnShare, setClickedOnShare] = useState(false);
  return (
    <>
      {clickedOnShare ? <ShareProfile user={user} setShow={setClickedOnShare} /> : <></>}

      <div className="w-[360px] overflow-y-auto overflow-x-hidden pb-4 max-md:mx-auto font-primary mt-base_padding max-md:mb-12 ml-base_padding h-base_md max-md:h-fit flex flex-col gap-4 text-white items-center pt-12 max-md:pb-8 max-md:pt-4 px-4 bg-[#84478023] backdrop-blur-md border-[1px] border-primary_btn sticky max-md:static top-[90px] max-md:bg-transparent rounded-md z-10">
        <Image
          crossOrigin="anonymous"
          width={10000}
          height={10000}
          alt={'User Pic'}
          src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
          className={'rounded-full max-md:mx-auto w-44 h-44 cursor-default'}
        />
        <div className="text-3xl max-md:text-2xl text-center font-bold text-gradient">{user.name}</div>
        <div className="text-sm text-center">{user.bio || 'Professional Bio'}</div>
        <div className="w-full flex justify-center gap-6">
          <div className="flex gap-1">
            <div className="font-bold">{numFollowers}</div>
            <div>Follower{numFollowers != 1 ? 's' : ''}</div>
          </div>
          <div className="flex gap-1">
            <div className="font-bold">{user.noFollowing}</div>
            <div>Following</div>
          </div>
        </div>
        <FollowBtn toFollowID={user.id} setFollowerCount={setNumFollowers} />
        <div className="w-full flex flex-col gap-8 mt-12">
          <div className="w-full flex flex-wrap items-center justify-center gap-2">
            {user.tags &&
              user.tags.map(tag => {
                return (
                  <Link
                    href={`/explore?search=` + tag}
                    onClick={() => dispatch(setExploreTab(2))}
                    className="flex-center text-sm px-4 py-1 border-[1px] border-primary_btn rounded-md"
                    key={tag}
                  >
                    {tag}
                  </Link>
                );
              })}
          </div>
          <div className="w-full h-fit flex flex-wrap items-center justify-center gap-4">
            {user.links &&
              user.links.map((link, index) => {
                return (
                  <Link
                    href={link}
                    key={index}
                    className="w-fit h-8 border-[1px] border-primary_btn rounded-lg text-sm px-2 py-4 flex items-center gap-2"
                  >
                    {getIcon(getDomainName(link), 24)}
                    <div className="capitalize">{getDomainName(link)}</div>
                  </Link>
                );
              })}
          </div>
        </div>
        <div className="w-fit absolute max-md:static top-4 right-4 flex gap-2">
          <div
            onClick={() => setClickedOnShare(true)}
            className="p-2 flex-center font-medium border-[1px] border-primary_btn bg-gradient-to-r hover:from-secondary_gradient_start hover:to-secondary_gradient_end transition-ease-300 rounded-full cursor-pointer"
          >
            <Share size={20} />
          </div>
          <div className="p-2 flex-center font-medium border-[1px] border-primary_btn bg-gradient-to-r hover:from-secondary_gradient_start hover:to-secondary_gradient_end transition-ease-300 rounded-full cursor-pointer">
            <Warning size={20} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
