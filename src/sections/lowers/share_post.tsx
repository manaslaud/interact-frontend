import Loader from '@/components/common/loader';
import { MESSAGING_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import postHandler from '@/handlers/post_handler';
import { Chat, Post } from '@/types';
import getDisplayTime from '@/utils/get_display_time';
import getMessagingUser from '@/utils/get_messaging_user';
import Toaster from '@/utils/toaster';
import Cookies from 'js-cookie';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Props {
  post: Post;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const SharePost = ({ post, setShow }: Props) => {
  const userID = Cookies.get('id');
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (userID === '') {
      Toaster.error('You are not logged In.');
      return;
    }

    const URL = `${MESSAGING_URL}/personal`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const chatsData: Chat[] = res.data.chats;

          setChats(chatsData || []);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message);
          else {
            Toaster.error('Internal Server Error');
            console.log(res);
          }
        }
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  }, [post]);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const handleSubmit = async () => {
    if (selectedChats.length == 0) {
      setShow(false);
      return;
    }
    const toaster = Toaster.startLoad('Sharing Post..');
    const URL = `/share/post/`;
    const formData = {
      content: message.trim() != '' ? message : 'Checkout this Post!',
      chats: selectedChats,
      postID: post.id,
    };
    const res = await postHandler(URL, formData);
    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Post Shared!', 1);
      setShow(false);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, 'Internal Server Error', 0);
        console.log(res);
      }
    }
  };

  const handleSelectChat = (chatID: string) => {
    if (selectedChats.includes(chatID)) setSelectedChats(prev => prev.filter(id => id != chatID));
    else setSelectedChats([...selectedChats, chatID]);
  };

  return (
    <>
      <div className="w-1/4 max-md:w-5/6 fixed backdrop-blur-lg bg-[#ffe1fc22] z-30 translate-x-1/2 -translate-y-1/4 top-64 right-1/2 flex flex-col font-Helvetica px-8 py-8 gap-2 border-2 border-primary_btn rounded-xl">
        <div className="text-xl text-center font-bold underline underline-offset-2">Share this Post</div>
        <div className="w-full max-h-base_md overflow-auto flex flex-col gap-2">
          <div className="w-full font-primary flex gap-1 text-white py-4 border-[#535353] border-b-[1px] max-md:px-4 max-md:py-4">
            <div className="w-[10%] max-md:w-[20%] h-full">
              <div className="rounded-full">
                <Image
                  crossOrigin="anonymous"
                  width={10000}
                  height={10000}
                  alt={'User Pic'}
                  src={`${USER_PROFILE_PIC_URL}/${post.user.profilePic}`}
                  className={'rounded-full w-8 h-8'}
                />
              </div>
            </div>
            <div className="w-[90%] max-md:w-[80%] flex flex-col gap-3">
              <div className="w-full h-fit flex justify-between">
                <div className="font-medium">{post.user.username}</div>
                <div className="text-xs">{getDisplayTime(post.postedAt, false)}</div>
              </div>
              <div className="w-full text-sm whitespace-pre-wrap mb-1 line-clamp-4">{post.content}</div>
            </div>
          </div>
          {loading ? (
            <Loader />
          ) : (
            <>
              {chats.length > 0 ? (
                <>
                  {chats.map(chat => {
                    return (
                      <div
                        key={chat.id}
                        onClick={() => {
                          handleSelectChat(chat.id);
                        }}
                        style={{
                          backgroundColor: selectedChats.includes(chat.id) ? '#ffe1fc22' : '',
                        }}
                        className="w-full flex gap-2 rounded-lg py-2 px-2 cursor-pointer transition-all ease-in-out duration-200 hover:bg-[#ffe1fc10]"
                      >
                        <Image
                          crossOrigin="anonymous"
                          width={10000}
                          height={10000}
                          alt={'User Pic'}
                          src={`${USER_PROFILE_PIC_URL}/${getMessagingUser(chat).profilePic}`}
                          className={'rounded-full w-12 h-12 cursor-pointer border-[1px] border-black'}
                        />
                        <div className="w-5/6 flex flex-col">
                          <div className="text-lg font-bold">{getMessagingUser(chat).name}</div>
                          <div className="text-sm">@{getMessagingUser(chat).username}</div>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
        <div className="w-full flex flex-col gap-1">
          <textarea
            className="bg-[#ffe1fc22] text-sm focus:outline-none p-2 rounded-xl min-h-[6rem] max-h-64"
            placeholder="Add a message"
            value={message}
            onChange={el => setMessage(el.target.value)}
          />
          <div
            onClick={handleSubmit}
            className="w-full text-center py-2 rounded-lg border-[1px] border-[#ffe1fc10] hover:bg-[#ffe1fc10] cursor-pointer transition-ease-200"
          >
            Send Message
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default SharePost;
