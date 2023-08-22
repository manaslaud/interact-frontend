import React, { useState } from 'react';
import NavigationItem from './navbar_item';
import { BookmarkSimple, Chats, Envelope, HouseLine, RocketLaunch, Wrench } from '@phosphor-icons/react';
interface Props {
  index: number;
}

const Navigation = ({ index }: Props) => {
  const [active, setActive] = useState(index);
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`${
        open ? 'w-navbar_open' : 'w-navbar_close'
      } h-full py-6 flex flex-col items-center gap-2 border-r-2 transition-ease-200`}
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
      <div onClick={() => setOpen(prev => !prev)}>Toggle</div>
    </div>
  );
};

export default Navigation;
