import React from 'react';
import { Project } from '@/types';
import Image from 'next/image';
import { PROJECT_PIC_URL } from '@/config/routes';

interface Props {
  index: number;
  project: Project;
  setClickedOnProject: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedProjectIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ProjectCard = ({ index, project, setClickedOnProject, setClickedProjectIndex }: Props) => {
  return (
    <div
      onClick={() => {
        setClickedOnProject(true);
        setClickedProjectIndex(index);
      }}
      className="w-[280px] h-96 relative group cursor-pointer"
    >
      <div className="w-full absolute top-0 hidden group-hover:flex animate-fade_third justify-end">
        <div className="w-4 h-4 rounded-full bg-black"></div>
      </div>
      <div className="w-full h-[280px] absolute top-0 left-0 opacity-0 group-hover:opacity-20 transition-ease-300 bg-black"></div>
      <Image
        crossOrigin="anonymous"
        className="w-full h-[280px] object-cover"
        src={`${PROJECT_PIC_URL}/${project.coverPic}`}
        alt="Project Cover"
        width={10000}
        height={10000}
      />
      <div className="w-full flex flex-col">
        <div className="w-full flex items-center justify-between">
          <div>{project.title}</div>
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-black"></div>
            <div className="w-4 h-4 rounded-full bg-black"></div>
            <div className="w-4 h-4 rounded-full bg-black"></div>
          </div>
        </div>
        <div className="line-clamp-3">{project.tagline}</div>
      </div>
    </div>
  );
};

export default ProjectCard;
