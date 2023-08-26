import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import moment from 'moment';
import Link from 'next/link';
import { Notification } from '@/types';
import CircleDashed from '@phosphor-icons/react/dist/icons/CircleDashed';

interface Props {
  notification: Notification;
  type: string;
}

const Liked = ({ notification, type }: Props) => {
  return (
    <div className="relative">
      {!notification.isRead ? <CircleDashed size={20} className="absolute top-0 right-0" weight="duotone" /> : <></>}
      <Link
        href={`/explore/${type}/${type == 'post' ? notification.post.id : notification.project.id}`}
        className="w-full bg-[#f6f6f6] flex px-4 py-4 rounded-xl items-center justify-between font-Helvetica transition-all duration-200 ease-in-out hover:bg-[#ebebeb]"
      >
        <div className="flex items-center gap-3">
          <Image
            crossOrigin="anonymous"
            width={10000}
            height={10000}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${notification.sender.profilePic}`}
            className={'rounded-full w-12 h-12 cursor-default border-[1px] border-black'}
          />
          <div className="gap-2 text-lg cursor-default">
            <Link className="font-bold" href={`/explore/user/${notification.sender.id}`}>
              {notification.sender.name}
            </Link>{' '}
            liked your {type}
            {type === 'project' ? <> {notification.project.title}.</> : '.'}
          </div>
        </div>
        <div className="text-xs w-1/4 text-right">{moment(notification.createdAt).fromNow()}</div>
      </Link>
    </div>
  );
};

export default Liked;
