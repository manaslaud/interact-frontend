import { SERVER_ERROR } from '@/config/errors';
import { MESSAGING_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { currentChatIDSelector } from '@/slices/messagingSlice';
import { initialChat, initialUser } from '@/types/initials';
import Toaster from '@/utils/toaster';
import { Chat, Message, TypingStatus, User } from '@/types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '@/components/common/loader';
import { groupBy } from 'lodash';
import ChatHeader from '@/sections/messaging/chats/personal_header';
import ScrollableFeed from 'react-scrollable-feed';
import MessageGroup from '@/sections/messaging/chats/message_group';
import ChatTextarea from '@/components/messaging/chat_textarea';
import Cookies from 'js-cookie';
import socketService from '@/config/ws';

const PersonalChat = () => {
  const [chat, setChat] = useState<Chat>(initialChat);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingStatus, setTypingStatus] = useState<TypingStatus>({ user: initialUser, chatID: '' });

  const chatID = useSelector(currentChatIDSelector);
  const userID = Cookies.get('id');

  const fetchChat = async () => {
    setLoading(true);
    const URL = `${MESSAGING_URL}/${chatID}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setChat(res.data.chat);
      await fetchMessages();
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const fetchMessages = async () => {
    const URL = `${MESSAGING_URL}/content/${chatID}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setMessages(res.data.messages || []);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  const handleAccept = async () => {
    const URL = `${MESSAGING_URL}/accept/${chatID}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setChat({ ...chat, accepted: true });
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    if (chatID != '') {
      fetchChat();
      socketService.setupChatWindowRoutes(setMessages, typingStatus, setTypingStatus);
    }
  }, [chatID]);

  const messagesByDate = groupBy(messages, message => new Date(message.createdAt).toLocaleDateString());

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  return (
    <div className="w-full h-full border-2 max-md:border-0 dark:border-dark_primary_btn rounded-lg max-md:rounded-none p-3 relative max-md:backdrop-blur-2xl max-md:z-50">
      {chatID == '' ? (
        <></>
      ) : (
        <>
          {loading ? (
            <Loader />
          ) : (
            <>
              <ChatHeader chat={chat} />
              <div className="w-full h-[calc(100%-72px)] max-h-full flex flex-col gap-6 overflow-hidden">
                <ScrollableFeed>
                  {Object.keys(messagesByDate)
                    .reverse()
                    .map(date => {
                      return <MessageGroup key={date} date={date} messages={messagesByDate[date]} />;
                    })}
                  {typingStatus.chatID == chat.id && typingStatus.user.id !== '' && typingStatus.user.id != userID ? (
                    <div className="w-fit dark:text-white text-sm cursor-default border-[1px] dark:border-dark_primary_btn rounded-xl px-4 py-2">
                      {typingStatus.user.username} is typing...
                    </div>
                  ) : (
                    <></>
                  )}
                </ScrollableFeed>
              </div>
              <div className="flex w-[calc(100%-16px)] max-md:w-[99%] items-end gap-2 absolute max-md:sticky bottom-2 right-1/2 translate-x-1/2 max-md:translate-x-0">
                {chat.accepted || chat.createdByID == userID ? (
                  <ChatTextarea chat={chat} />
                ) : (
                  <>
                    <div
                      onClick={handleAccept}
                      className="w-full h-12 rounded-md dark:text-white font-primary flex-center text-xl font-medium dark:bg-dark_primary_comp dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active cursor-pointer transition-ease-300"
                    >
                      Accept Chat
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PersonalChat;
