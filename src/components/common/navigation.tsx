import React, { useState } from 'react';
import NavigationItem from './navigation_item';
import { BookmarkSimple, Chats, Envelope, HouseLine, RocketLaunch, Wrench } from '@phosphor-icons/react';

interface Props {
  index: number;
}

const Navigation = ({ index }: Props) => {
  const [active, setActive] = useState(index);
  return (
    <div className="w-navigation h-full pl-[120px] pr-6 py-6 flex flex-col gap-2 border-r-2">
      <NavigationItem index={1} title="Home" icon={<HouseLine size={24} />} active={active} setActive={setActive} />
      <NavigationItem
        index={2}
        title="Projects"
        icon={<RocketLaunch size={24} />}
        active={active}
        setActive={setActive}
      />
      <NavigationItem index={3} title="Workspace" icon={<Wrench size={24} />} active={active} setActive={setActive} />
      <NavigationItem index={4} title="Message" icon={<Chats size={24} />} active={active} setActive={setActive} />
      <NavigationItem
        index={5}
        title="Invitations"
        icon={<Envelope size={24} />}
        active={active}
        setActive={setActive}
      />
      <NavigationItem
        index={6}
        title="Bookmarks"
        icon={<BookmarkSimple size={24} />}
        active={active}
        setActive={setActive}
      />
    </div>
  );
};

export default Navigation;
