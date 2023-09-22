import React from 'react';
import { Opening } from '@/types';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setExploreTab } from '@/slices/feedSlice';

interface Props {
  openings: Opening[];
  slug: string;
}

const Openings = ({ openings, slug }: Props) => {
  const dispatch = useDispatch();
  return (
    <>
      {openings && openings.length > 0 ? (
        <div className="w-full flex flex-col gap-2">
          <div className="text-lg font-medium">Open Positions</div>
          <div className="w-full flex flex-col gap-2">
            {openings.map(opening => {
              return (
                <div
                  key={opening.id}
                  className="w-full flex-center dark:bg-dark_primary_comp_active py-4 border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-lg"
                >
                  {opening.title}
                </div>
              );
            })}
            <Link
              href={`/explore?project=${slug}`}
              onClick={() => dispatch(setExploreTab(1))}
              className="w-full p-4 flex-center font-medium border-[1px] border-primary_btn  dark:border-dark_primary_btn bg-gradient-to-r dark:from-dark_secondary_gradient_start dark:to-dark_secondary_gradient_end transition-ease-300 rounded-lg"
            >
              Apply
            </Link>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Openings;
