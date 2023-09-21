import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Chat } from '@/types';
import getMessagingUser from '@/utils/get_messaging_user';
import { ArrowArcLeft } from '@phosphor-icons/react';
import { useDispatch } from 'react-redux';
import { setCurrentChatID } from '@/slices/messagingSlice';

interface Props {
  chat: Chat;
}

const ChatHeader = ({ chat }: Props) => {
  const dispatch = useDispatch();
  return (
    <div className="w-full h-[72px] dark:text-white font-primary flex justify-between gap-2 items-center border-b-[1px] dark:border-dark_primary_btn pb-2">
      <div className="flex gap-2 items-center">
        <ArrowArcLeft onClick={() => dispatch(setCurrentChatID(''))} className="md:hidden" size={24} />
        <Image
          crossOrigin="anonymous"
          width={10000}
          height={10000}
          alt={'User Pic'}
          src={`${USER_PROFILE_PIC_URL}/${getMessagingUser(chat).profilePic}`}
          className={'rounded-full w-12 h-12'}
        />
        <div className="flex flex-col">
          <div className="text-lg font-medium">{getMessagingUser(chat).name}</div>
          <div className="text-xs">@{getMessagingUser(chat).username}</div>
        </div>
      </div>
      <div className="text-xs cursor-pointer pr-2">•••</div>
    </div>
  );
};

export default ChatHeader;
