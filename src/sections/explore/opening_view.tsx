import LowerOpening from '@/components/lowers/lower_opening';
import { Opening } from '@/types';
import { initialOpening } from '@/types/initials';
import { ArrowArcLeft } from '@phosphor-icons/react';
import moment from 'moment';
import React, { useState } from 'react';
import ApplyOpening from './apply_opening';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';

interface Props {
  opening: Opening;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setOpening: React.Dispatch<React.SetStateAction<Opening>>;
}

const OpeningView = ({ opening, setShow, setOpening }: Props) => {
  const [clickedOnApply, setClickedOnApply] = useState(false);
  const applications = useSelector(userSelector).applications;
  return (
    <div className="sticky max-md:fixed top-[158px] max-md:top-navbar max-md:right-0 w-[55%] max-md:w-full max-h-[70vh] max-md:max-h-screen max-md:h-base max-md:z-50 max-md:backdrop-blur-2xl max-md:backdrop-brightness-90 overflow-y-auto flex flex-col gap-6 max-md:gap-8 px-12 py-10 font-primary text-white border-[1px] max-md:border-0 border-primary_btn rounded-lg max-md:rounded-none max-md:animate-fade_third z-10">
      {clickedOnApply ? <ApplyOpening opening={opening} setShow={setClickedOnApply} setOpening={setOpening} /> : <></>}
      <div className="flex flex-col gap-2 max-md:gap-6">
        <ArrowArcLeft
          className="cursor-pointer"
          size={24}
          onClick={() => {
            setShow(false);
            setOpening(initialOpening);
          }}
        />
        <div className="flex max-md:flex-col justify-between items-center max-md:items-start max-md:gap-2">
          <div className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-secondary_gradient_start to-secondary_gradient_end">
            {opening.title}
          </div>
          <LowerOpening opening={opening} />
        </div>
        <div className="flex gap-2 text-sm max-md:flex-wrap">
          <div>{opening.project.title}</div>
          <div>•</div>
          <div>Delhi, India</div>
          <div>•</div>
          <div>{moment(opening.createdAt).fromNow()}</div>
          <div>•</div>
          <div>
            {opening.noOfApplications} application{opening.noOfApplications == 1 ? '' : 's'}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-secondary_gradient_start to-secondary_gradient_end">
            About this role
          </div>
        </div>
        <div className="">{opening.description}</div>
        <div className="w-full flex flex-wrap gap-2">
          {opening.tags &&
            opening.tags.map(tag => {
              return (
                <div
                  key={tag}
                  className="flex-center p-2 font-primary text-xs text-white border-[1px] border-primary_btn rounded-xl"
                >
                  {tag}
                </div>
              );
            })}
        </div>
      </div>
      {applications?.includes(opening.id) ? (
        <div className="w-[120px] p-2 flex-center font-medium border-[1px] border-primary_btn bg-gradient-to-r from-secondary_gradient_start to-secondary_gradient_end rounded-lg cursor-default">
          Applied
        </div>
      ) : (
        <div
          onClick={() => setClickedOnApply(true)}
          className="w-[120px] p-2 flex-center font-medium border-[1px] border-primary_btn bg-gradient-to-r hover:from-secondary_gradient_start hover:to-secondary_gradient_end transition-ease-300 rounded-lg cursor-pointer"
        >
          Apply
        </div>
      )}
    </div>
  );
};

export default OpeningView;
