import { OpeningBookmark } from '@/types';
import React, { useState } from 'react';
import { ArrowArcLeft } from '@phosphor-icons/react';
import { initialOpening } from '@/types/initials';
import OpeningCard from '@/components/explore/opening_card';
import OpeningView from '../explore/opening_view';

interface Props {
  bookmark: OpeningBookmark;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  fetchBookmarks?: () => void;
}

const Openings = ({ bookmark, setClick, fetchBookmarks }: Props) => {
  const [clickedOnOpening, setClickedOnOpening] = useState(false);
  const [clickedOpening, setClickedOpening] = useState(initialOpening);
  return (
    <div className="w-full px-2">
      <div className="flex items-center gap-2">
        <ArrowArcLeft
          onClick={() => {
            if (fetchBookmarks) fetchBookmarks();
            setClick(false);
          }}
          color="white"
          className="cursor-pointer"
          size={32}
        />
        <div className="font-medium text-xl cursor-default">{bookmark.title}</div>
      </div>
      {bookmark.openingItems.length > 0 ? (
        <div className="flex justify-evenly px-4">
          <div className={`${clickedOnOpening ? 'w-[40%]' : 'w-[720px]'} max-md:w-[720px] flex flex-col gap-4`}>
            {bookmark.openingItems.map(openingItem => {
              return (
                <OpeningCard
                  key={openingItem.openingID}
                  opening={openingItem.opening}
                  clickedOpening={clickedOpening}
                  setClickedOnOpening={setClickedOnOpening}
                  setClickedOpening={setClickedOpening}
                />
              );
            })}
          </div>
          {clickedOnOpening ? (
            <OpeningView opening={clickedOpening} setShow={setClickedOnOpening} setOpening={setClickedOpening} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div>No openings found</div>
      )}
    </div>
  );
};

export default Openings;
