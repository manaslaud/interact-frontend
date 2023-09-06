import { Opening } from '@/types';
import { BookmarkSimple, Share } from '@phosphor-icons/react';
import moment from 'moment';
import React from 'react';

interface Props {
  opening: Opening;
}

const OpeningView = ({ opening }: Props) => {
  return (
    <div className="sticky top-[158px] w-[55%] max-h-[70vh] overflow-y-auto flex flex-col gap-6 px-12 py-10 font-primary text-white border-[1px] border-primary_btn rounded-lg">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-secondary_gradient_start to-secondary_gradient_end">
            {opening.title}
          </div>
          <div className="flex gap-4">
            <Share size={32} />
            <BookmarkSimple size={32} />
          </div>
        </div>
        <div className="flex gap-2 text-sm">
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
      <div className="w-[120px] p-2 flex-center font-medium border-[1px] border-primary_btn bg-gradient-to-r hover:from-secondary_gradient_start hover:to-secondary_gradient_end transition-ease-300 rounded-lg cursor-pointer">
        Apply
      </div>
    </div>
  );
};

export default OpeningView;
