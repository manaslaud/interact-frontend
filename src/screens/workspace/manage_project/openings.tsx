import { Opening, Project } from '@/types';
import { Pen, Plus, TrashSimple } from '@phosphor-icons/react';
import React, { useState } from 'react';
import Image from 'next/image';
import { PROJECT_PIC_URL } from '@/config/routes';

interface Props {
  project: Project;
}

const Openings = ({ project }: Props) => {
  const [clickedOnNewOpening, setClickedOnNewOpening] = useState(false);
  return (
    <div className="w-[50vw] max-md:w-screen mx-auto flex flex-col gap-8">
      <div
        onClick={() => setClickedOnNewOpening(true)}
        className="w-taskbar max-md:w-taskbar_md h-taskbar mx-auto bg-gradient-to-l from-primary_gradient_start to-primary_gradient_end px-4 max-md:px-2 py-3 rounded-lg cursor-pointer shadow-outer flex justify-between items-center"
      >
        <div className="flex gap-2 items-center pl-2">
          <div className="font-primary text-gray-200 text-lg">Create a new opening</div>
        </div>
        <Plus
          size={36}
          className="text-gray-200 flex-center rounded-full hover:bg-[#e9e9e933] p-2 transition-ease-300"
          weight="regular"
        />
      </div>

      {project.openings ? (
        <div className="w-full flex flex-col gap-2">
          {project.openings.map(opening => {
            return (
              <div
                key={opening.id}
                className="w-full font-primary text-white border-[1px] border-primary_btn rounded-lg p-8 max-md:p-4 flex items-center gap-12 max-md:gap-4 transition-ease-300"
              >
                <Image
                  crossOrigin="anonymous"
                  width={10000}
                  height={10000}
                  alt={'User Pic'}
                  src={`${PROJECT_PIC_URL}/${project.coverPic}`}
                  className={'w-[120px] h-[120px] max-md:w-[90px] max-md:h-[90px] rounded-lg object-cover'}
                />

                <div className="grow flex flex-col gap-4 max-md:gap-2">
                  <div className="flex items-start justify-between">
                    <div className="w-5/6 flex flex-col gap-1">
                      <div className="font-bold text-2xl max-md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-secondary_gradient_start to-secondary_gradient_end">
                        {opening.title}
                      </div>
                      <div className="text-lg max-md:text-sm">{project.title}</div>
                      <div className="max-md:text-sm">
                        {opening.noOfApplications} Application{opening.noOfApplications == 1 ? '' : 's'}
                      </div>
                      <div className="w-fit text-sm max-md:text-sm underline underline-offset-4 cursor-pointer">
                        View applications
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Pen size={24} />
                      <TrashSimple size={24} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}{' '}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Openings;
