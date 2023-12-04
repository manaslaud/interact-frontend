import React, { useEffect, useState } from 'react';
import SidebarItem from './sidebar_item';
import {
  ArrowLineLeft,
  Bell,
  BookmarkSimple,
  ChatTeardrop,
  ClockCounterClockwise,
  Envelope,
  Gear,
  HouseLine,
  IdentificationCard,
  NoteBlank,
  RocketLaunch,
  UserCircle,
  Wrench,
} from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { navbarOpenSelector, setNavbarOpen } from '@/slices/feedSlice';
import useUserStateFetcher from '@/hooks/user_fetcher';
import BottomBar from './bottombar';
import { userSelector } from '@/slices/userSlice';

interface Props {
  index: number;
}

const OrgSidebar = ({ index }: Props) => {
  const [active, setActive] = useState(index);

  const dispatch = useDispatch();
  const open = useSelector(navbarOpenSelector);

  const user = useSelector(userSelector);

  const userFetcher = useUserStateFetcher();

  useEffect(() => {
    if (user.id != '') userFetcher();
  }, []);

  return (
    <>
      <div
        className={`${
          open ? 'w-sidebar_open' : 'w-sidebar_close'
        } h-base bg-sidebar border-gray-300 border-r-[1px] dark:border-0 dark:bg-dark_sidebar backdrop-blur-sm pt-[40px] fixed mt-navbar py-6 flex flex-col justify-between pl-[30px] transition-ease-out-500 max-lg:hidden`}
      >
        <div className="w-full flex flex-col gap-2">
          <SidebarItem
            index={1}
            org={true}
            title="Home"
            icon={<HouseLine size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={2}
            org={true}
            title="Posts"
            icon={<NoteBlank size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={3}
            org={true}
            title="Projects"
            icon={<RocketLaunch size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={4}
            org={true}
            title="Tasks"
            icon={<Wrench size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={5}
            org={true}
            title="Chats"
            icon={<ChatTeardrop size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={6}
            org={true}
            title="Members"
            icon={<IdentificationCard size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={7}
            org={true}
            title="History"
            icon={<ClockCounterClockwise size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
        </div>

        <div className="w-fit py-8 border-y-2 border-gray-300 dark:border-dark_primary_btn flex flex-col gap-2">
          <SidebarItem
            index={8}
            org={true}
            title="Profile"
            icon={<UserCircle size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={9}
            org={true}
            title="Notifications"
            icon={<Bell size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={10}
            org={true}
            title="Bookmarks"
            icon={<BookmarkSimple size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={11}
            org={true}
            title="Settings"
            icon={<Gear size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
        </div>

        <ArrowLineLeft
          onClick={() => dispatch(setNavbarOpen(!open))}
          className={`cursor-pointer ml-2 mt-2 ${
            open ? 'rotate-0' : '-rotate-180'
          } text-gray-500 dark:text-white transition-ease-500`}
          size={24}
        />
      </div>
      <BottomBar index={index} />
    </>
  );
};

export default OrgSidebar;
