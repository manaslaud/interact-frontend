import { Opening } from '@/types';
import React from 'react';
import Image from 'next/image';
import { PROJECT_PIC_URL } from '@/config/routes';
import { BookmarkSimple, BookmarksSimple } from '@phosphor-icons/react';
import moment from 'moment';

interface Props {
  opening: Opening;
  clickedOpening: Opening;
  setClickedOnOpening: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedOpening: React.Dispatch<React.SetStateAction<Opening>>;
}

const OpeningCard = ({ opening, clickedOpening, setClickedOnOpening, setClickedOpening }: Props) => {
  return (
    <div
      onClick={() => {
        setClickedOpening(opening);
        setClickedOnOpening(true);
      }}
      className={`w-full ${
        opening.id == clickedOpening.id ? 'bg-[#ffffff2b]' : ''
      } font-primary text-white border-[1px] border-primary_btn rounded-lg p-8 flex items-center gap-12 transition-ease-300 cursor-pointer`}
    >
      <Image
        crossOrigin="anonymous"
        width={10000}
        height={10000}
        alt={'User Pic'}
        src={`${PROJECT_PIC_URL}/${opening.project.coverPic}`}
        className={'w-[120px] h-[120px] rounded-lg object-cover'}
      />

      <div className="grow flex flex-col">
        <div className="flex items-center justify-between">
          <div className="w-5/6 font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-secondary_gradient_start to-secondary_gradient_end">
            {opening.title}
          </div>
          <BookmarkSimple size={24} />
        </div>
        <div className="text-lg">{opening.project.title}</div>
        <div className="text-lg">Delhi, India</div>
        <div className="text-sm opacity-60">{moment(opening.createdAt).fromNow()}</div>
      </div>
    </div>
  );
};

export default OpeningCard;
