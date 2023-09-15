import CommentBox from '@/components/common/comment_box';
import Loader from '@/components/common/loader';
import PostComponent from '@/components/home/post';
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
  setNoComments: React.Dispatch<React.SetStateAction<number>>;
}

const CommentPost = ({ post, setShow, setNoComments }: Props) => {
  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  return (
    <>
      <div className="w-[80%] h-[90%] max-md:w-5/6 max-md:overflow-y-auto fixed backdrop-blur-lg text-white bg-[#ffe1fc22] z-30 translate-x-1/2 -translate-y-1/4 top-56 right-1/2 flex max-md:flex-col font-primary p-8 max-md:p-4 gap-2 border-2 border-primary_btn rounded-xl">
        <div className="w-1/3 max-md:w-full h-full max-md:h-fit">
          <PostComponent post={post} showLowerPost={false} />
        </div>
        <div className="w-2/3 max-md:w-full h-full max-md:h-fit">
          <CommentBox item={post} type="post" setNoComments={setNoComments} />
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className=" bg-backdrop w-screen h-screen fixed top-0 right-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default CommentPost;
