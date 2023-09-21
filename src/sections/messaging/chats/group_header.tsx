import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Chat, GroupChat } from '@/types';
import getMessagingUser from '@/utils/get_messaging_user';
import { ArrowArcLeft, Info } from '@phosphor-icons/react';
import { useDispatch } from 'react-redux';
import { setCurrentChatID } from '@/slices/messagingSlice';

interface Props {
  chat: GroupChat;
  setClickedOnInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatHeader = ({ chat, setClickedOnInfo }: Props) => {
  const dispatch = useDispatch();
  return (
    <div className="w-full h-[72px] dark:text-white font-primary flex justify-between gap-2 items-center border-b-[1px] dark:border-dark_primary_btn pb-2">
      <div className="flex gap-2 items-center">
        <ArrowArcLeft onClick={() => dispatch(setCurrentChatID(''))} className="md:hidden" size={24} />
        <div className="rounded-full w-12 h-12 dark:bg-dark_primary_comp_hover"></div>
        <div className="flex flex-col">
          <div className="text-lg font-medium">{chat.title}</div>
          {/* <div className="text-xs">@{getMessagingUser(chat).username}</div> */}
        </div>
      </div>
      <Info onClick={() => setClickedOnInfo(true)} className="cursor-pointer" size={32} />
    </div>
  );
};

export default ChatHeader;
