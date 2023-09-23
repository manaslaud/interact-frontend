import { GroupChat, Project } from '@/types';
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
import { Pen } from '@phosphor-icons/react';
import { userSelector } from '@/slices/userSlice';

interface Props {
  project: Project;
  chat: GroupChat;
  setClickedOnEditChat: React.Dispatch<React.SetStateAction<boolean>>;
  clickedEditChat: GroupChat;
  setClickedEditChat: React.Dispatch<React.SetStateAction<GroupChat>>;
}

const ChatCard = ({ project, chat, setClickedOnEditChat, clickedEditChat, setClickedEditChat }: Props) => {
  const user = useSelector(userSelector);
  const handleClick = () => {
    setClickedEditChat(chat);
    setClickedOnEditChat(true);
  };
  return (
    <div
      onClick={handleClick}
      className={`w-full font-primary dark:text-white ${
        chat.id == clickedEditChat.id
          ? 'bg-primary_comp_hover dark:bg-dark_primary_comp_hover'
          : 'bg-white hover:bg-primary_comp dark:bg-transparent dark:hover:bg-dark_primary_comp'
      } border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg flex gap-4 px-5 py-4 cursor-pointer transition-ease-300`}
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
          {project.userID == user.id || user.managerProjects.includes(project.id) ? (
            <div className="flex flex-col font text-xs">
              <Pen size={24} />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div className="w-full line-clamp-2 font-light">
          <span className="mr-2 font-medium">
            • {chat.memberships?.length || 0} Member{chat.memberships?.length == 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
