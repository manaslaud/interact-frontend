import { Notification } from '@/types';
import getDisplayTime from '@/utils/get_display_time';
import { CircleDashed } from '@phosphor-icons/react';
import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
  notification: Notification;
}

const NotificationWrapper: React.FC<WrapperProps> = ({ children, notification }) => {
  return (
    <div className="w-full relative">
      {!notification.isRead ? (
        <CircleDashed size={16} color="white" className="absolute top-0 right-0" weight="duotone" />
      ) : (
        <></>
      )}
      <div className="w-full flex items-center justify-between gap-4 p-3 text-white hover:bg-[#ae8abd39] rounded-xl font-primary transition-ease-200">
        <div className="flex items-center gap-3">{children}</div>
        <div className="text-xxs">{getDisplayTime(notification.createdAt, false)}</div>
      </div>
    </div>
  );
};

export default NotificationWrapper;
