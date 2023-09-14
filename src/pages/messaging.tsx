import Sidebar from '@/components/common/sidebar';
import TabMenu from '@/components/common/tab_menu';
import SearchBar from '@/components/messaging/searchbar';
import socketService from '@/config/ws';
import GroupChat from '@/screens/messaging/chat/group';
import PersonalChat from '@/screens/messaging/chat/personal';
import Group from '@/screens/messaging/group';
import Personal from '@/screens/messaging/personal';
import Project from '@/screens/messaging/project';
import Request from '@/screens/messaging/request';
import NewGroup from '@/sections/messaging/new_group';
import { navbarOpenSelector } from '@/slices/feedSlice';
import {
  currentChatIDSelector,
  currentGroupChatIDSelector,
  messagingTabSelector,
  setMessagingTab,
} from '@/slices/messagingSlice';
import { userSelector } from '@/slices/userSlice';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import { PencilSimpleLine } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Messaging = () => {
  const active = useSelector(messagingTabSelector);

  const open = useSelector(navbarOpenSelector);
  const currentChatID = useSelector(currentChatIDSelector);
  const currentGroupChatID = useSelector(currentGroupChatIDSelector);
  const [chatType, setChatType] = useState('personal');

  const chats = useSelector(userSelector).chats;

  const [clickedOnNew, setClickedOnNew] = useState(false);
  const [clickedOnNewGroup, setClickedOnNewGroup] = useState(false);

  useEffect(() => {
    socketService.setupChats(chats);
  }, []);

  useEffect(() => {
    setChatType(String(new URLSearchParams(window.location.search).get('chat')));
  }, [window.location.search]);

  return (
    <BaseWrapper>
      <Sidebar index={-1} />
      <MainWrapper>
        <div
          className={`w-fit h-[calc(100vh-65px)] max-md:h-fit mx-auto flex max-md:flex-col ${
            open ? 'gap-2' : 'gap-16'
          } transition-ease-out-500 font-primary`}
        >
          {clickedOnNewGroup ? <NewGroup setShow={setClickedOnNewGroup} /> : <></>}
          {/* 100-(navbar+1) */}
          <div className="w-[37.5vw] max-md:w-screen h-full flex flex-col pt-4 pl-4 max-md:pl-0 gap-4 ">
            <div className="w-full flex items-center justify-between relative">
              <div className="text-3xl max-md:hidden font-extrabold text-gradient">Messaging</div>
              <PencilSimpleLine
                onClick={() => setClickedOnNew(prev => !prev)}
                className="cursor-pointer"
                color="white"
                size={32}
              />
              {clickedOnNew ? (
                <div className="w-1/3 flex flex-col gap-2 backdrop-blur-sm border-[1px] border-primary_btn bg-primary_comp text-white font-primary p-3 absolute translate-y-full -bottom-2 right-0 rounded-md z-50">
                  <div className="p-2 rounded-md hover:bg-primary_comp_hover active:bg-primary_comp_active transition-ease-300 cursor-pointer">
                    New Chat
                  </div>
                  <div
                    onClick={() => {
                      setClickedOnNewGroup(true);
                      setClickedOnNew(false);
                    }}
                    className="p-2 rounded-md hover:bg-primary_comp_hover active:bg-primary_comp_active transition-ease-300 cursor-pointer"
                  >
                    New Group
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            <SearchBar />
            <TabMenu
              items={['Personal', 'Group', 'Project', 'Request']}
              active={active}
              setReduxState={setMessagingTab}
              width="100%"
            />
            <div className="w-full">
              <div className={`${active === 0 ? 'block' : 'hidden'}`}>
                <Personal />
              </div>
              <div className={`${active === 1 ? 'block' : 'hidden'}`}>
                <Group />
              </div>
              <div className={`${active === 2 ? 'block' : 'hidden'} `}>
                <Project />
              </div>
              <div className={`${active === 3 ? 'block' : 'hidden'} `}>
                <Request />
              </div>
            </div>
          </div>
          <div
            className={`w-[37.5vw] max-md:w-screen h-full max-md:h-base max-md:fixed max-md:top-navbar p-2 max-md:p-0 ${
              currentChatID == '' && currentGroupChatID == '' ? 'hidden' : ''
            } max-md:z-30`}
          >
            {currentChatID == '' && currentGroupChatID == '' ? (
              <></>
            ) : (
              <>{chatType == 'group' ? <GroupChat /> : <PersonalChat />}</>
            )}
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Messaging;
