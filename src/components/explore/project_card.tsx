import React from 'react';
import { Project } from '@/types';
import Image from 'next/image';
import { PROJECT_PIC_URL } from '@/config/routes';
import { Bookmark, BookmarkSimple, Circle, CircleDashed, HeartStraight } from '@phosphor-icons/react';

interface Props {
  index: number;
  project: Project;
  size?: number;
  setClickedOnProject: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedProjectIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ProjectCard = ({ index, project, size = 72, setClickedOnProject, setClickedProjectIndex }: Props) => {
  const variants = ['w-72', 'w-64', 'w-56', 'h-72', 'h-64', 'h-56'];
  return (
    <div
      onClick={() => {
        setClickedOnProject(true);
        setClickedProjectIndex(index);
      }}
      className={`w-${size} h-${size} rounded-lg relative group cursor-pointer`}
    >
      <div className="w-full h-full absolute top-0 hidden group-hover:flex animate-fade_third justify-end z-[6] rounded-lg p-1">
        {/* <BookmarkSimple size={24} color="white" className="opacity-75" /> */}
      </div>
      <div className="w-full h-full rounded-lg absolute top-0 left-0 bg-gradient-to-b from-[#00000084] z-[5] to-transparent opacity-0 group-hover:opacity-100 transition-ease-300"></div>
      <Image
        crossOrigin="anonymous"
        className="w-full h-full rounded-lg object-cover absolute top-0 left-0 "
        src={`${PROJECT_PIC_URL}/${project.coverPic}`}
        alt="Project Cover"
        width={10000}
        height={10000}
      />
      <div className="w-full glassMorphism text-white rounded-b-lg font-primary absolute bottom-0 right-0 flex flex-col px-4 py-2">
        <div className="text-xl">{project.title}</div>
        <div className="w-full flex items-center justify-between">
          <div className="text-sm">{project.user.name}</div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs">
              <HeartStraight size={16} />
              <div>{project.noLikes}</div>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <CircleDashed size={16} />
              <div>{project.totalNoViews}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
