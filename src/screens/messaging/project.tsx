import Loader from '@/components/common/loader';
import GroupChatCard from '@/components/messaging/group_chat_card';
import { SERVER_ERROR } from '@/config/errors';
import { MESSAGING_URL, PROJECT_PIC_URL } from '@/config/routes';
import socketService from '@/config/ws';
import getHandler from '@/handlers/get_handler';
import { userSelector } from '@/slices/userSlice';
import { GroupChat, Project } from '@/types';
import { sortGroupChats } from '@/utils/sort_chats';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { ArrowArcLeft } from '@phosphor-icons/react';

const Project = () => {
  const [chats, setChats] = useState<GroupChat[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [displayChats, setDisplayChats] = useState<GroupChat[]>([]);
  const [filteredChats, setFilteredChats] = useState<GroupChat[]>([]);
  const [loading, setLoading] = useState(true);

  const currentChats = useSelector(userSelector).chats;

  const fetchChats = async () => {
    setLoading(true);
    const URL = `${MESSAGING_URL}/project`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setChats(sortGroupChats(res.data.chats || []));
      setProjects(res.data.projects || []);
      setFilteredChats(res.data.chats || []);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const filterChats = (search: string | null) => {
    if (!search || search == '') setFilteredChats(chats);
    else
      setFilteredChats(
        chats.filter(chat => {
          if (chat.title.match(new RegExp(search, 'i'))) return true;
          else if (chat.project.title.match(new RegExp(search, 'i'))) return true;
          return false;
        })
      );
  };

  useEffect(() => {
    fetchChats();
    socketService.setupGroupChatListRoutes(setChats);
  }, [currentChats]);

  useEffect(() => {
    filterChats(new URLSearchParams(window.location.search).get('search'));
  }, [window.location.search]);

  return (
    <div className="w-full flex flex-col gap-2 p-2">
      {loading ? (
        <Loader />
      ) : (
        <>
          {!new URLSearchParams(window.location.search).get('search') ? (
            <>
              {chats.length > 0 ? (
                <>
                  {displayChats.length > 0 ? (
                    <>
                      <div className="">
                        <ArrowArcLeft
                          className="cursor-pointer"
                          onClick={() => {
                            setDisplayChats([]);
                          }}
                          color="white"
                          size={32}
                        />
                      </div>
                      {displayChats.map(chat => {
                        return <GroupChatCard key={chat.id} chat={chat} />;
                      })}
                    </>
                  ) : (
                    <>
                      {projects.map(project => {
                        return (
                          <div
                            key={project.id}
                            onClick={() => {
                              setDisplayChats(chats.filter(chat => chat.projectID == project.id));
                            }}
                            className="w-full font-primary hover:bg-primary_comp_hover text-white border-[1px] border-primary_btn rounded-lg p-4 flex items-center gap-6 max-md:gap-4 transition-ease-300 cursor-pointer"
                          >
                            <Image
                              crossOrigin="anonymous"
                              width={10000}
                              height={10000}
                              alt={'User Pic'}
                              src={`${PROJECT_PIC_URL}/${project.coverPic}`}
                              className={'w-[90px] h-[90px] max-md:w-[60px] max-md:h-[60px] rounded-lg object-cover'}
                            />

                            <div className="grow flex flex-col gap-4 max-md:gap-2">
                              <div className="font-bold text-2xl max-md:text-lg text-gradient">{project.title}</div>
                              {/* <div className="text-lg max-md:text-sm">{project.chats.length}</div> */}
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </>
              ) : (
                <div>No Chats found</div>
              )}
            </>
          ) : (
            <>
              {filteredChats.length > 0 ? (
                <>
                  {filteredChats.map(chat => {
                    return <GroupChatCard key={chat.id} chat={chat} />;
                  })}
                </>
              ) : (
                <div>No Chats found</div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Project;
