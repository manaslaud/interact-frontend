import { ActionCreatorWithPayload } from '@reduxjs/toolkit/dist/createAction';
import React from 'react';
import { useDispatch } from 'react-redux';

interface Props {
  items: string[];
  active: number;
  setReduxState: ActionCreatorWithPayload<number>;
}

const TabMenu = ({ items, active, setReduxState }: Props) => {
  const dispatch = useDispatch();
  return (
    <div className="w-[500px] h-[45px] p-1 rounded-lg bg-gradient-to-b from-[#633267] to-[#5B406B] shadow-outer mx-auto bg-slate-100 flex justify-around gap-1 sticky top-[88px] z-10">
      {/* 64+24=88 */}
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => dispatch(setReduxState(index))}
          className={`${
            active === index ? 'bg-[#0E0C2A59] shadow-inner' : ''
          } w-1/2 h-full font-primary font-medium flex-center text-lg text-white rounded-md transition-ease-300 cursor-pointer`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default TabMenu;
