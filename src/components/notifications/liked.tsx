import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import moment from 'moment';
import Link from 'next/link';
import { Notification } from '@/types';
import CircleDashed from '@phosphor-icons/react/dist/icons/CircleDashed';
import NotificationWrapper from '@/wrappers/notification';

interface Props {
  notification: Notification;
  type: string;
}

const Liked = ({ notification, type }: Props) => {
  return (
    <NotificationWrapper notification={notification}>
      <Image
        crossOrigin="anonymous"
        width={10000}
        height={10000}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${notification.sender.profilePic}`}
        className={'rounded-full w-10 h-10 cursor-default border-[1px] border-black'}
      />
      <div className="gap-2 cursor-default">
        <Link className="font-bold" href={`/explore/user/${notification.sender.username}`}>
          {notification.sender.name}
        </Link>{' '}
        liked your {type}
        {type === 'project' ? <> {notification.project.title}.</> : '.'}
      </div>
    </NotificationWrapper>
  );
};

export default Liked;
