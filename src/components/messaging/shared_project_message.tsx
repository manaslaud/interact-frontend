import { Message } from '@/types';
import React from 'react';
import Image from 'next/image';
import { PROJECT_PIC_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useRouter } from 'next/router';

interface Props {
  message: Message;
}

const SharedProjectMessage = ({ message }: Props) => {
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
        <div className="w-fit max-w-[27rem] flex flex-col text-sm cursor-default rounded-xl px-4 py-2 bg-primary_comp_hover gap-4">
          <div
            onClick={() => {
              router.push(`/explore/project/${message.projectID}`);
            }}
            className="w-56 h-40 flex flex-col cursor-pointer"
          >
            <Image
              crossOrigin="anonymous"
              width={10000}
              height={10000}
              alt={'Project Pic'}
              src={`${PROJECT_PIC_URL}/${message.project.coverPic}`}
              className={'rounded-lg w-full h-3/4 border-[1px] border-black object-cover'}
            />
            <div className="flex flex-col">
              <div className="text-xl font-bold">{message.project.title}</div>
              <div className="text-xs">{message.project.tagline}</div>
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

export default SharedProjectMessage;
