import { Notification } from '@/types';
import CircleDashed from '@phosphor-icons/react/dist/icons/CircleDashed';
import React from 'react';

interface Props {
  notification: Notification;
}

const Welcome = ({ notification }: Props) => {
  return (
    <div className="relative">
      {!notification.isRead ? <CircleDashed size={20} className="absolute top-0 right-0" weight="duotone" /> : <></>}
      <div className="w-full  flex flex-col px-4 py-4 rounded-xl items-center justify-between font-Helvetica transition-all duration-200 ease-in-out hover:bg-[#ebebeb]">
        <div className="w-full text-xl font-bold font-Helvetica text-center cursor-default">Welcome!🎉</div>
        <div className="">🥳 Woohoo! You made it to Interact!</div>
      </div>
    </div>
  );
};

export default Welcome;
