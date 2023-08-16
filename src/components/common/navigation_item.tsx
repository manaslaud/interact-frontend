import React, { ReactNode } from 'react';

interface Props {
  title: string;
  icon: ReactNode;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  index: number;
}

const NavigationItem = ({ title, icon, active, setActive, index }: Props) => {
  return (
    <a
      href={`/${title.toLowerCase()}`}
      onClick={() => setActive(index)}
      className={`w-full h-10 p-[8.5px] ${
        active == index ? 'text-[#4278c8] bg-[#3d6cb33a]' : 'text-gray-500 hover:bg-[#00000012]'
      } flex gap-4 font-primary font-medium items-center rounded-lg`}
    >
      {icon}
      <div>{title}</div>
    </a>
  );
};

export default NavigationItem;
