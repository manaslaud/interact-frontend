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

const Comment = ({ notification, type }: Props) => {
  return (
    <NotificationWrapper notification={notification}>
      <Image
        crossOrigin="anonymous"
        width={10000}
        height={10000}
        alt={'User Pic'}
        src={`${USER_PROFILE_PIC_URL}/${notification.sender.profilePic}`}
        className={'rounded-full w-12 h-12 border-[1px] border-black'}
      />
      <div className="gap-2">
        <Link className="font-bold" href={`/explore/user/${notification.sender.username}`}>
          {notification.sender.name}
        </Link>{' '}
        commented on your {type}
        {type === 'project' ? <> {notification.project.title}.</> : '.'}
      </div>
    </NotificationWrapper>
  );
};

export default Comment;
