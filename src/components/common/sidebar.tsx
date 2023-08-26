import React, { useEffect, useState } from 'react';
import SidebarItem from './sidebar_item';
import { BookmarkSimple, Chats, Envelope, HouseLine, RocketLaunch, Wrench } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { navbarOpenSelector, setNavbarOpen } from '@/slices/feedSlice';
import useUserStateFetcher from '@/hooks/user_fetcher';
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

  return (
    <div
      className={`${
        open ? 'w-navbar_open' : 'w-navbar_close'
      } h-screen pt-[64px] sticky top-0 py-6 flex flex-col pl-[30px] gap-2 border-r-2 transition-ease-out-500 max-md:hidden`}
    >
      {/* 40+24=64 */}
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
        index={4}
        title="Message"
        icon={<Chats size={24} />}
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
      <SidebarItem
        index={7}
        title="Notifications"
        icon={<BookmarkSimple size={24} />}
        active={active}
        setActive={setActive}
        open={open}
      />
      <SidebarItem
        index={8}
        title="Organizations"
        icon={<BookmarkSimple size={24} />}
        active={active}
        setActive={setActive}
        open={open}
      />
      <div onClick={() => dispatch(setNavbarOpen(!open))}>Toggle</div>
    </div>
  );
};

export default Sidebar;
