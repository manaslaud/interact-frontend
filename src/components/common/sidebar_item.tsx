import Link from 'next/link';
import React, { ReactNode } from 'react';

interface Props {
  title: string;
  icon: ReactNode;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  open: boolean;
}

const SidebarItem = ({ title, icon, active, setActive, index, open }: Props) => {
  return (
    <Link
      href={`/${title.toLowerCase()}`}
      onClick={() => setActive(index)}
      className={`${open ? 'w-[280px]' : 'w-10 '} h-10 p-[8.5px] rounded-xl text-[#ffffffbc] ${
        active == index ? 'bg-[#0e0c2a59]' : 'hover:bg-[#00000012]'
      } relative font-primary font-medium items-center ${open ? '' : ''} transition-ease-out-500`}
    >
      {icon}
      {open ? <div className="absolute top-1/2 left-[64px] -translate-y-1/2 animate-fade_half">{title}</div> : <></>}
    </Link>
  );
};

export default SidebarItem;
