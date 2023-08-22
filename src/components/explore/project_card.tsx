import { Project } from '@/types';
import React from 'react';

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
      className="w-52 h-80 cursor-pointer"
    >
      <div className="w-full h-52 bg-slate-200"></div>
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
