import React, { useState } from 'react';
import Image from 'next/image';
import { Opening, Project } from '@/types';
import { PROJECT_PIC_URL } from '@/config/routes';
import { Pen, TrashSimple } from '@phosphor-icons/react';
import EditOpening from '@/sections/workspace/manage_project/edit_opening';
import { userSelector } from '@/slices/userSlice';
import { useSelector } from 'react-redux';
import Link from 'next/link';

interface Props {
  opening: Opening;
  project: Project;
  setProject?: React.Dispatch<React.SetStateAction<Project>>;
}

const OpeningCard = ({ opening, project, setProject }: Props) => {
  const [clickedOnEdit, setClickedOnEdit] = useState(false);
  const user = useSelector(userSelector);
  return (
    <>
      {clickedOnEdit ? (
        <EditOpening setShow={setClickedOnEdit} opening={opening} project={project} setProject={setProject} />
      ) : (
        <></>
      )}
      <div className="w-full font-primary text-white border-[1px] border-primary_btn rounded-lg p-8 max-md:p-4 flex items-center gap-12 max-md:gap-4 transition-ease-300">
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
              {project.userID == user.id || user.managerProjects.includes(project.id) ? (
                <>
                  {opening.noOfApplications > 0 ? (
                    <Link
                      href={`/workspace/manage/applications/${opening.id}`}
                      className="w-fit text-[#15bffd] text-sm max-md:text-sm underline underline-offset-4"
                    >
                      View applications
                    </Link>
                  ) : (
                    <div className="w-fit text-white text-sm max-md:text-sm underline underline-offset-4 cursor-default">
                      No applications
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
            <div className="flex gap-3">
              <Pen onClick={() => setClickedOnEdit(true)} className="cursor-pointer" size={24} />
              {project.userID == user.id || user.managerProjects.includes(project.id) ? (
                <TrashSimple className="cursor-pointer" size={24} color="#ea333e" weight="fill" />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OpeningCard;
