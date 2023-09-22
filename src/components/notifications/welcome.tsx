import { Notification } from '@/types';
import NotificationWrapper from '@/wrappers/notification';
import React from 'react';

interface Props {
  notification: Notification;
}

const Welcome = ({ notification }: Props) => {
  return (
    <NotificationWrapper notification={notification}>
      <div className="w-full text-center flex-center gap-4">
        <div className="w-full text-xl font-bold font-Helvetica text-center cursor-default">Welcome!🎉</div>
        <div className="">🥳 Woohoo! You made it to Interact!</div>
      </div>
    </NotificationWrapper>
  );
};

export default Welcome;
