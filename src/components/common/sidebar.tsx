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
  const [theme, setTheme] = useState(String(localStorage.getItem('theme')) == 'dark' ? 'dark' : 'light');

  const dispatch = useDispatch();
  const open = useSelector(navbarOpenSelector);

  const userFetcher = useUserStateFetcher();

  useEffect(() => {
    userFetcher();
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

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

      <label className="flex cursor-pointer select-none items-center">
        <div>Toggle Theme</div>
        <div className="relative">
          <input type="checkbox" onChange={toggleTheme} className="sr-only" />
          <div
            className={`box block h-8 w-14 rounded-full ${
              theme == 'dark' ? 'bg-blue-300' : 'bg-black'
            } transition-ease-300`}
          ></div>
          <div
            className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${
              theme == 'dark' ? 'translate-x-full' : ''
            }`}
          ></div>
        </div>
      </label>
      <div onClick={() => dispatch(setNavbarOpen(!open))}>Toggle</div>
    </div>
  );
};

export default Sidebar;
