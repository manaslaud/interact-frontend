import Notifications from '@/sections/notifications';
import { unreadNotificationsSelector } from '@/slices/feedSlice';
import { Chat, Notification, User } from '@phosphor-icons/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const notifications = useSelector(unreadNotificationsSelector);
  const [clickedOnNotifications, setClickedOnNotifications] = useState(false);
  return (
    <div className="w-full h-[40px] border-b-2 fixed top-0 flex justify-between px-4 items-center bg-white z-30">
      {clickedOnNotifications ? <Notifications setShow={setClickedOnNotifications} /> : <></>}
      <div>Interact</div>
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-[#d3d3d3] flex items-center justify-center">
          <Chat size={24} weight="duotone" />
        </div>
        <div
          onClick={() => setClickedOnNotifications(prev => !prev)}
          className="w-9 h-9 rounded-full bg-[#d3d3d3] flex items-center justify-center relative cursor-pointer"
        >
          <div className="w-4 h-4 animate-pulse rounded-full absolute top-0 right-0 flex items-center justify-center text-xs bg-black text-white">
            {notifications}
          </div>
          <Notification size={24} weight="duotone" />
        </div>
        <div className="w-9 h-9 rounded-full bg-[#d3d3d3] flex items-center justify-center">
          <User size={24} weight="duotone" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
