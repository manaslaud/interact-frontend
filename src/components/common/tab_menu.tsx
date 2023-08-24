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
    <div className="w-5/6 m-auto bg-slate-100 flex justify-around sticky top-0 z-10">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => dispatch(setReduxState(index))}
          className={`${active === index ? 'bg-slate-300' : 'bg-slate-200'} w-1/2 text-center cursor-pointer`}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default TabMenu;
