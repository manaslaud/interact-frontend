import Link from 'next/link';
import React, { ReactNode } from 'react';

interface Props {
  title: string;
  icon: ReactNode;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}

const BottomBarItem = ({ title, icon, active, setActive, index }: Props) => {
  return (
    <Link
      href={`/${title.toLowerCase()}`}
      onClick={() => setActive(index)}
      className={`w-16 h-14 p-2 flex-center rounded-xl text-[#ffffffbc] ${
        active == index ? 'bg-[#d9c4e656]' : 'hover:bg-[#6e6e6e2b]'
      } relative items-center transition-ease-500`}
    >
      {icon}
    </Link>
  );
};

export default BottomBarItem;
