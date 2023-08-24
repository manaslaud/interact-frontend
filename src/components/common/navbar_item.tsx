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

const NavigationItem = ({ title, icon, active, setActive, index, open }: Props) => {
  return (
    <Link
      href={`/${title.toLowerCase()}`}
      onClick={() => setActive(index)}
      className={`${open ? 'w-[280px] rounded-full' : 'w-10 rounded-full'} h-10 p-[8.5px] ${
        active == index ? 'text-[#4278c8] bg-[#3d6cb33a]' : 'text-gray-500 hover:bg-[#00000012]'
      } relative font-primary font-medium items-center ${open ? '' : ''} transition-ease-out-500`}
    >
      {icon}
      {open ? <div className="absolute top-1/2 left-[40px] -translate-y-1/2 animate-fade_half">{title}</div> : <></>}
    </Link>
  );
};

export default NavigationItem;
