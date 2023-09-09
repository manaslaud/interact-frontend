import Sidebar from '@/components/common/sidebar';
import TabMenu from '@/components/common/tab_menu';
import SearchBar from '@/components/messaging/searchbar';
import socketService from '@/config/ws';
import PersonalChat from '@/screens/messaging/chat/personal';
import Organisation from '@/screens/messaging/organisation';
import Personal from '@/screens/messaging/personal';
import Project from '@/screens/messaging/project';
import Request from '@/screens/messaging/request';
import { navbarOpenSelector } from '@/slices/feedSlice';
import { currentChatIDSelector, messagingTabSelector, setMessagingTab } from '@/slices/messagingSlice';
import { userSelector } from '@/slices/userSlice';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Messaging = () => {
  const active = useSelector(messagingTabSelector);

  const open = useSelector(navbarOpenSelector);
  const currentChatID = useSelector(currentChatIDSelector);

  const chatSlices = useSelector(userSelector).chats;

  useEffect(() => {
    const chatIDS = chatSlices.map(slice => slice.chatID);
    socketService.setupChats(chatIDS);
  }, []);

  return (
    <BaseWrapper>
      <Sidebar index={-1} />
      <MainWrapper>
        <div
          className={`w-fit h-[calc(100vh-65px)] mx-auto flex max-md:flex-col ${
            open ? 'gap-2' : 'gap-16'
          } transition-ease-out-500 font-primary`}
        >
          {/* 100-(navbar+1) */}
          <div className="w-[37.5vw] max-md:w-screen h-full flex flex-col pt-4 pl-4 max-md:pl-0 gap-4">
            <div className="text-3xl max-md:hidden font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary_gradient_start to-secondary_gradient_end">
              Messaging
            </div>
            <SearchBar />
            <TabMenu
              items={['Personal', 'Organisation', 'Project', 'Request']}
              active={active}
              setReduxState={setMessagingTab}
              width="100%"
            />
            <div className="w-full">
              <div className={`${active === 0 ? 'block' : 'hidden'}`}>
                <Personal />
              </div>
              <div className={`${active === 1 ? 'block' : 'hidden'}`}>
                <Organisation />
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
              currentChatID == '' ? 'hidden' : ''
            } max-md:z-50`}
          >
            {currentChatID != '' ? <PersonalChat /> : <></>}
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Messaging;
