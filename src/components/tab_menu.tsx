import React from 'react';

interface Props {
  items: string[];
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
}

const TabMenu = ({ items, active, setActive }: Props) => {
  return (
    <div className="w-5/6 m-auto bg-slate-100 flex justify-around">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => setActive(index)}
          className={`${active === index ? 'bg-slate-300' : 'bg-slate-200'} w-1/2 text-center cursor-pointer`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default TabMenu;
