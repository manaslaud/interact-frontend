import React, { useState } from 'react';
// import { MeStopTyping, MeTyping, sendEvent } from '@/utils/ws';
import { Chat, GroupChat } from '@/types';
import Cookies from 'js-cookie';
import socketService from '@/config/ws';
import postHandler from '@/handlers/post_handler';
import Toaster from '@/utils/toaster';

interface Props {
  chat: Chat;
}

const ChatTextarea = ({ chat }: Props) => {
  const [height, setHeight] = useState('auto');
  const [value, setValue] = useState('');

  const MAX_HEIGHT = 128;
  const INITIAL_HEIGHT = 48;

  const userID = Cookies.get('id');

  const handleChange = (event: any) => {
    const newValue = event.target.value;

    if (value === '' && newValue.length === 1) socketService.sendTypingStatus(getSelf(chat), chat.id, 1);
    else if (newValue === '') socketService.sendTypingStatus(getSelf(chat), chat.id, 0);

    setValue(newValue);
    setHeight('auto');
    if (event.target.scrollHeight <= MAX_HEIGHT) {
      setHeight(`${event.target.scrollHeight}px`);
    } else {
      setHeight(`${MAX_HEIGHT}px`);
    }
  };

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      if (event.shiftKey === true) {
        if (event.target.scrollHeight <= MAX_HEIGHT) {
          setHeight(`${event.target.scrollHeight}px`);
        }
      } else {
        handleSubmit();
        setHeight(`${INITIAL_HEIGHT}px`);
      }
    }
  };

  const getSelf = (chat: Chat) => {
    if (userID === chat.createdByID) return chat.createdBy;
    return chat.acceptedBy;
  };

  const handleSubmit = async () => {
    if (value.trim() == '') return;
    socketService.sendMessage(value, chat.id, userID || '', getSelf(chat));
    socketService.sendTypingStatus(getSelf(chat), chat.id, 0);

    setValue('');

    const URL = `/messaging/content/`;
    const formData = {
      content: value,
      chatID: chat.id,
    };

    const res = await postHandler(URL, formData);

    if (res.statusCode === 201) {
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else {
        Toaster.error('Internal Server Error');
        console.log(res);
      }
    }
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      // style={{ height: height, resize: 'none' }}
      placeholder="Message..."
      className="w-full h-[64px] min-h-[64px] max-h-[132px] backdrop-blur-md bg-[#c578bf10] rounded-xl p-4 dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn overflow-auto focus:outline-none"
    />
  );
};

export default ChatTextarea;
