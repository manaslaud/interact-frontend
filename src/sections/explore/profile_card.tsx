import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { User } from '@/types';
import React, { useState } from 'react';
import Image from 'next/image';
import getDomainName from '@/utils/get_domain_name';
import Link from 'next/link';
import getIcon from '@/utils/get_icon';
import { useDispatch, useSelector } from 'react-redux';
import { setExploreTab } from '@/slices/feedSlice';
import FollowBtn from '@/components/common/follow_btn';
import { Chat, Share, Warning } from '@phosphor-icons/react';
import ShareProfile from '../lowers/share_profile';
import { userSelector } from '@/slices/userSlice';
import SendMessage from './send_message';
import { setCurrentChatID } from '@/slices/messagingSlice';
import { useRouter } from 'next/router';
import Connections from './connections_view';
interface Props {
  user: User;
}

const ProfileCard = ({ user }: Props) => {
  const dispatch = useDispatch();
  const [numFollowers, setNumFollowers] = useState(user.noFollowers);
  const [clickedOnShare, setClickedOnShare] = useState(false);
  const [clickedOnChat, setClickedOnChat] = useState(false);

  const [clickedOnFollowers, setClickedOnFollowers] = useState(false);
  const [clickedOnFollowing, setClickedOnFollowing] = useState(false);

  const chatSlices = useSelector(userSelector).personalChatSlices;

  const router = useRouter();

  const handleChat = () => {
    var check = false;
    var chatID = '';
    chatSlices.forEach(chat => {
      if (chat.userID == user.id) {
        chatID = chat.chatID;
        check = true;
        return;
      }
    });
    if (check) {
      dispatch(setCurrentChatID(chatID));
      router.push('/messaging');
    } else setClickedOnChat(true);
  };
  return (
    <>
      {clickedOnShare ? <ShareProfile user={user} setShow={setClickedOnShare} /> : <></>}
      {clickedOnChat ? <SendMessage user={user} setShow={setClickedOnChat} /> : <></>}

      {clickedOnFollowers ? <Connections type="followers" user={user} setShow={setClickedOnFollowers} /> : <></>}
      {clickedOnFollowing ? <Connections type="following" user={user} setShow={setClickedOnFollowing} /> : <></>}

      <div className="w-[360px] overflow-y-auto overflow-x-hidden pb-4 max-md:mx-auto font-primary mt-base_padding max-md:mb-12 ml-base_padding h-base_md max-md:h-fit flex flex-col gap-4 dark:text-white items-center pt-12 max-md:pb-8 max-md:pt-4 px-4 bg-[#ffffff2d] dark:bg-[#84478023] backdrop-blur-md shadow-md dark:shadow-none border-[1px] border-gray-300 dark:border-dark_primary_btn sticky max-md:static top-[90px] max-md:bg-transparent rounded-md z-10">
        <Image
          crossOrigin="anonymous"
          width={10000}
          height={10000}
          alt={'User Pic'}
          src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
          className={'rounded-full max-md:mx-auto w-44 h-44 cursor-default'}
        />
        <div className="text-3xl max-md:text-2xl text-center font-bold text-gradient">{user.name}</div>
        <div className="text-sm text-center">{user.bio}</div>
        <div className="w-full flex justify-center gap-6">
          <div onClick={() => setClickedOnFollowers(true)} className="flex gap-1 cursor-pointer">
            <div className="font-bold">{numFollowers}</div>
            <div>Follower{numFollowers != 1 ? 's' : ''}</div>
          </div>
          <div onClick={() => setClickedOnFollowing(true)} className="flex gap-1 cursor-pointer">
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
        </div>
        <div className="dark:text-white w-fit absolute max-md:static top-4 right-4 flex gap-2">
          <div className="hover:text-white p-2 flex-center font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gradient-to-r hover:from-dark_secondary_gradient_start hover:to-dark_secondary_gradient_end rounded-full cursor-pointer">
            <Chat onClick={handleChat} size={18} />
          </div>
          <div
            onClick={() => setClickedOnShare(true)}
            className="hover:text-white p-2 flex-center font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gradient-to-r hover:from-dark_secondary_gradient_start hover:to-dark_secondary_gradient_end rounded-full cursor-pointer"
          >
            <Share size={18} />
          </div>
          <div className="hover:text-white md:hidden p-2 flex-center font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gradient-to-r hover:from-dark_secondary_gradient_start hover:to-dark_secondary_gradient_end rounded-full cursor-pointer">
            <Warning size={18} />
          </div>
        </div>
        <div className="hover:text-white absolute max-md:hidden top-4 left-4 p-2 flex-center font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gradient-to-r hover:from-dark_secondary_gradient_start hover:to-dark_secondary_gradient_end rounded-full cursor-pointer">
          <Warning size={18} />
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
