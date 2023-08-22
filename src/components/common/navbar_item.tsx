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
      className={`${open ? 'w-5/6' : 'w-10'} h-10 p-[8.5px] ${
        active == index ? 'text-[#4278c8] bg-[#3d6cb33a]' : 'text-gray-500 hover:bg-[#00000012]'
      } flex gap-4 font-primary font-medium items-center ${open ? 'rounded-lg' : 'rounded-full'} transition-ease-200`}
    >
      {icon}
      {open ? <div>{title}</div> : <></>}{' '}
    </Link>
  );
};

export default NavigationItem;
