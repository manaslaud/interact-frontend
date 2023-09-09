import { Message } from '@/types';
import React from 'react';
import Image from 'next/image';
import { POST_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useRouter } from 'next/router';

interface Props {
  message: Message;
}

const SharedPostMessage = ({ message }: Props) => {
  const userID = Cookies.get('id');
  const router = useRouter();
  return (
    <div
      key={message.id}
      className={`w-full flex gap-2 font-Helvetica ${message.userID === userID ? 'flex-row-reverse' : ''}`}
    >
      <Image
        crossOrigin="anonymous"
        width={10000}
        height={10000}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${message.user.profilePic}`}
        className={'rounded-full w-8 h-8 cursor-pointer border-[1px] border-black'}
      />
      <div className={`w-1/3 flex flex-wrap gap-2 ${message.userID === userID ? 'flex-row-reverse' : ''}`}>
        <div className="w-fit max-w-[27rem] flex flex-col text-sm cursor-default rounded-xl px-4 py-2 bg-[#c578bf36] gap-4">
          <div
            onClick={() => {
              router.push(`/explore/post/${message.postID}`);
            }}
            className={`w-56 ${message.post.images?.length > 0 ? 'h-40' : 'h-fit'} flex flex-col cursor-pointer gap-2`}
          >
            {message.post.images?.length > 0 ? (
              <Image
                crossOrigin="anonymous"
                width={10000}
                height={10000}
                alt={'Post Pic'}
                src={`${POST_PIC_URL}/${message.post.images[0]}`}
                className={'rounded-lg w-full h-3/4 border-[1px] border-black object-cover'}
              />
            ) : (
              <></>
            )}
            <div className={`text-xs ${message.post.images?.length > 0 ? 'line-clamp-2' : 'line-clamp-6'}`}>
              {message.post.content}
            </div>
          </div>
          {message.content != '' ? (
            <div className="border-t-[1px] border-black pt-2 border-dashed">{message.content}</div>
          ) : (
            <></>
          )}
        </div>
        <div
          className={` flex items-center gap-1 text-xs self-end ${message.userID === userID ? 'flex-row-reverse' : ''}`}
        >
          <div>•</div>
          <div> {moment(message.createdAt).format('hh:mm A')}</div>
        </div>
      </div>
    </div>
  );
};

export default SharedPostMessage;
