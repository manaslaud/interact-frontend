import React, { useEffect, useState } from 'react';
import NavigationItem from './navbar_item';
import { BookmarkSimple, Chats, Envelope, HouseLine, RocketLaunch, Wrench } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';
import { navbarOpenSelector, setNavbarOpen } from '@/slices/feedSlice';
import useUserStateFetcher from '@/hooks/user_fetcher';
interface Props {
  index: number;
}

const Navigation = ({ index }: Props) => {
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
      } h-full py-6 flex flex-col pl-[30px] gap-2 border-r-2 transition-ease-out-500 max-md:hidden`}
    >
      <NavigationItem
        index={1}
        title="Home"
        icon={<HouseLine size={24} />}
        active={active}
        setActive={setActive}
        open={open}
      />
      <NavigationItem
        index={2}
        title="Explore"
        icon={<RocketLaunch size={24} />}
        active={active}
        setActive={setActive}
        open={open}
      />
      <NavigationItem
        index={3}
        title="Workspace"
        icon={<Wrench size={24} />}
        active={active}
        setActive={setActive}
        open={open}
      />
      <NavigationItem
        index={4}
        title="Message"
        icon={<Chats size={24} />}
        active={active}
        setActive={setActive}
        open={open}
      />
      <NavigationItem
        index={5}
        title="Invitations"
        icon={<Envelope size={24} />}
        active={active}
        setActive={setActive}
        open={open}
      />
      <NavigationItem
        index={6}
        title="Bookmarks"
        icon={<BookmarkSimple size={24} />}
        active={active}
        setActive={setActive}
        open={open}
      />
      <NavigationItem
        index={7}
        title="Notifications"
        icon={<BookmarkSimple size={24} />}
        active={active}
        setActive={setActive}
        open={open}
      />
      <NavigationItem
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

export default Navigation;
