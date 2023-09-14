import { GroupChat } from '@/types';
import Cookies from 'js-cookie';
import React from 'react';
import Image from 'next/image';
import getDisplayTime from '@/utils/get_display_time';
import { useDispatch, useSelector } from 'react-redux';
import {
  currentChatIDSelector,
  currentGroupChatIDSelector,
  setCurrentChatID,
  setCurrentGroupChatID,
} from '@/slices/messagingSlice';
import { useRouter } from 'next/router';

interface Props {
  chat: GroupChat;
}

const GroupChatCard = ({ chat }: Props) => {
  const userID = Cookies.get('id');
  const dispatch = useDispatch();

  const currentChatID = useSelector(currentGroupChatIDSelector);
  const router = useRouter();

  const handleClick = () => {
    dispatch(setCurrentChatID(''));
    dispatch(setCurrentGroupChatID(chat.id));
    router.push({
      pathname: router.pathname,
      query: { ...router.query, chat: 'group' },
    });
  };

  // const imgURL = chat.project?chat.project.coverPic?chat.coverPic;

  return (
    <div
      onClick={handleClick}
      className={`w-full font-primary text-white ${
        chat.id == currentChatID ? 'bg-primary_comp_hover' : ''
      } border-[1px] border-primary_btn rounded-lg flex gap-4 px-5 py-4 cursor-pointer transition-ease-300`}
    >
      {/* <Image
        crossOrigin="anonymous"
        width={10000}
        height={10000}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${profilePic}`}
        className={'rounded-full w-14 h-14 cursor-pointer border-[1px] border-black'}
      /> */}
      <div className="w-full flex flex-col gap-1">
        <div className="w-full flex items-center justify-between">
          <div className="text-xl font-semibold">{chat.title}</div>
          <div className="flex flex-col font text-xs">
            {chat.latestMessage ? getDisplayTime(chat.latestMessage.createdAt, false) : ''}
            {/* {chat.latestMessage.userID != userID && getLastReadMessageID() != chat.latestMessage.id ? (
              <>Unread</>
            ) : (
              <></>
            )} */}
          </div>
        </div>
        {chat.latestMessage ? (
          <div className="w-full line-clamp-2 font-light">
            <span className="mr-2 font-medium">
              • {chat.latestMessage.userID == userID ? 'You' : `${chat.latestMessage.user.username}`}
            </span>
            {chat.latestMessage.content}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default GroupChatCard;
