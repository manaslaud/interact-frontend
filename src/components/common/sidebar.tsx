import React, { useEffect, useState } from 'react';
import SidebarItem from './sidebar_item';
import {
  ArrowLineLeft,
  Bell,
  BookmarkSimple,
  Envelope,
  Gear,
  HouseLine,
  RocketLaunch,
  UserCircle,
  Wrench,
} from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { navbarOpenSelector, setNavbarOpen } from '@/slices/feedSlice';
import useUserStateFetcher from '@/hooks/user_fetcher';
import BottomBar from './bottombar';
import { profilePicSelector } from '@/slices/userSlice';
interface Props {
  index: number;
}

const Sidebar = ({ index }: Props) => {
  const [active, setActive] = useState(index);

  const dispatch = useDispatch();
  const open = useSelector(navbarOpenSelector);

  const userFetcher = useUserStateFetcher();

  useEffect(() => {
    userFetcher();
  }, []);

  const profilePic = useSelector(profilePicSelector);

  return (
    <>
      <div
        className={`${
          open ? 'w-sidebar_open' : 'w-sidebar_close'
        } h-base bg-sidebar border-gray-300 border-r-[1px] dark:border-0 dark:bg-dark_sidebar backdrop-blur-sm pt-[40px] sticky top-navbar mt-navbar py-6 flex flex-col justify-between pl-[30px] transition-ease-out-500 max-md:hidden`}
      >
        <div className="w-full flex flex-col gap-2">
          <SidebarItem
            index={1}
            title="Home"
            icon={<HouseLine size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={2}
            title="Explore"
            icon={<RocketLaunch size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={3}
            title="Workspace"
            icon={<Wrench size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={5}
            title="Invitations"
            icon={<Envelope size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={6}
            title="Bookmarks"
            icon={<BookmarkSimple size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          {/* <SidebarItem
            index={8}
            title="Organizations"
            icon={<Buildings size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          /> */}
        </div>

        <div className="w-fit py-8 border-y-2 border-gray-300 dark:border-dark_primary_btn flex flex-col gap-2">
          <SidebarItem
            index={7}
            title="Profile"
            icon={<UserCircle size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={8}
            title="Notifications"
            icon={<Bell size={24} />}
            active={active}
            setActive={setActive}
            open={open}
          />
          <SidebarItem
            index={9}
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

export default Sidebar;
