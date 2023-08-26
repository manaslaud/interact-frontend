import React from 'react';
import Image from 'next/image';
import { PROJECT_PIC_URL } from '@/config/routes';
import moment from 'moment';
import Link from 'next/link';
import { Notification } from '@/types';
import CircleDashed from '@phosphor-icons/react/dist/icons/CircleDashed';

interface Props {
  notification: Notification;
  status: number;
}

const ApplicationUpdate = ({ notification, status }: Props) => {
  return (
    <div className="relative">
      {!notification.isRead ? <CircleDashed size={20} className="absolute top-0 right-0" weight="duotone" /> : <></>}
      <div className="w-full bg-[#f6f6f6] flex px-4 py-4 rounded-xl items-center justify-between font-Helvetica transition-all duration-200 ease-in-out hover:bg-[#ebebeb]">
        <div className="flex items-center gap-3">
          <Image
            crossOrigin="anonymous"
            width={10000}
            height={10000}
            alt={'User Pic'}
            src={`${PROJECT_PIC_URL}/${notification.opening.project.coverPic}`}
            className={'rounded-xl w-12 h-16 cursor-default border-[1px] border-black'}
          />
          <div className="gap-2 text-lg cursor-default">
            Your Application for {notification.opening.title} at{' '}
            <Link href={`/explore/project/${notification.opening.project.id}`} className="font-bold">
              {notification.opening.project.title}
            </Link>{' '}
            was {status === 0 ? 'Rejected' : 'Accepted'}
          </div>
        </div>
        <div className="text-xs w-1/4 text-right">{moment(notification.createdAt).fromNow()}</div>
      </div>
    </div>
  );
};

export default ApplicationUpdate;
