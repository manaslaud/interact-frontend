import { GroupChat, Project } from '@/types';
import { Plus } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import NewChat from '@/sections/workspace/manage_project/new_chat';
import ChatCard from '@/components/workspace/manage_project/chat_card';
import { PROJECT_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import Loader from '@/components/common/loader';
import GroupInfo from '@/sections/messaging/group_info';
import { initialGroupChat } from '@/types/initials';
import EditChat from '@/sections/workspace/manage_project/edit_chat';

interface Props {
  project: Project;
}

const Chats = ({ project }: Props) => {
  const [chats, setChats] = useState<GroupChat[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnAddChat, setClickedOnAddChat] = useState(false);
  const [clickedOnEditChat, setClickedOnEditChat] = useState(false);
  const [clickedEditChat, setClickedEditChat] = useState(initialGroupChat);

  const fetchChats = async () => {
    const URL = `${PROJECT_URL}/chats/${project.id}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setChats(res.data.chats);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [project.id]);

  return (
    <div className="w-full flex flex-col gap-6 px-2 pb-6">
      {clickedOnAddChat ? (
        <>
          <NewChat setShow={setClickedOnAddChat} project={project} setChats={setChats} />
        </>
      ) : (
        <></>
      )}
      <div
        onClick={() => setClickedOnAddChat(true)}
        className="w-taskbar max-md:w-taskbar_md h-taskbar mx-auto bg-gradient-to-l from-primary_gradient_start to-primary_gradient_end px-4 max-md:px-2 py-3 rounded-lg cursor-pointer shadow-outer flex justify-between items-center"
      >
        <div className="flex gap-2 items-center pl-2">
          <div className="font-primary text-gray-200 text-lg">Create a new Chat</div>
        </div>
        <Plus
          size={36}
          className="text-gray-200 flex-center rounded-full hover:bg-[#e9e9e933] p-2 transition-ease-300"
          weight="regular"
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {chats ? (
            <div className="flex justify-evenly px-4">
              <div className={`${clickedOnEditChat ? 'w-[40%]' : 'w-[720px]'} max-md:w-[720px] flex flex-col gap-4`}>
                {chats.map(chat => {
                  return (
                    <ChatCard
                      key={chat.id}
                      project={project}
                      chat={chat}
                      setClickedOnEditChat={setClickedOnEditChat}
                      clickedEditChat={clickedEditChat}
                      setClickedEditChat={setClickedEditChat}
                    />
                  );
                })}
              </div>
              {clickedOnEditChat ? (
                <EditChat chat={clickedEditChat} setStateChats={setChats} setShow={setClickedOnEditChat} />
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};

export default Chats;
