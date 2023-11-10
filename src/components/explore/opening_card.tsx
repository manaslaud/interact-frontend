import { Opening } from '@/types';
import React from 'react';
import Image from 'next/image';
import { PROJECT_PIC_URL } from '@/config/routes';
import getDisplayTime from '@/utils/get_display_time';

interface Props {
  opening: Opening;
  clickedOpening?: Opening;
  setClickedOnOpening?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedOpening?: React.Dispatch<React.SetStateAction<Opening>>;
}

const OpeningCard = ({ opening, clickedOpening, setClickedOnOpening, setClickedOpening }: Props) => {
  return (
    <div
      onClick={() => {
        if (setClickedOpening) setClickedOpening(opening);
        if (setClickedOnOpening) setClickedOnOpening(true);
      }}
      className={`w-full ${
        opening.id == clickedOpening?.id
          ? 'bg-white dark:bg-[#ffffff2b]'
          : 'hover:bg-gray-100 dark:hover:bg-transparent'
      } font-primary dark:text-white border-[1px] border-primary_btn dark:border-dark_primary_btn rounded-lg p-4 flex items-center gap-4 transition-ease-300 cursor-pointer`}
    >
      <Image
        crossOrigin="anonymous"
        width={10000}
        height={10000}
        alt={'User Pic'}
        src={`${PROJECT_PIC_URL}/${opening.project.coverPic}`}
        className={'w-[140px] h-[140px] max-md:w-[90px] max-md:h-[90px] rounded-lg object-cover'}
      />

      <div className="grow flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div className="w-5/6 flex flex-col gap-1">
            <div className="font-bold text-2xl max-md:text-lg text-gradient">{opening.title}</div>
            <div className="font-medium text-lg max-md:text-sm">{opening.project.title}</div>
          </div>
          <div className="text-sm opacity-60 max-md:text-xs">{getDisplayTime(opening.createdAt, false)}</div>
        </div>

        <div className="w-full flex flex-wrap gap-2">
          {opening.tags &&
            opening.tags // Splicing causes array mutation
              .filter((tag, index) => {
                return index >= 0 && index < 3;
              })
              .map(tag => {
                return (
                  <div
                    key={tag}
                    className="flex-center p-1 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg"
                  >
                    {tag}
                  </div>
                );
              })}
          {opening.tags && opening.tags.length - 3 > 0 ? (
            <div className="flex-center p-2 font-primary text-xs dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-xl">
              + {opening.tags.length - 3}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpeningCard;
