import ProjectCard from '@/components/explore/project_card';
import { ProjectBookmark } from '@/types';
import React, { useState } from 'react';
import ProjectView from '../../sections/explore/project_view';
import { ArrowArcLeft } from '@phosphor-icons/react';
import { useSelector } from 'react-redux';
import { navbarOpenSelector } from '@/slices/feedSlice';

interface Props {
  bookmark: ProjectBookmark;
  setClick: React.Dispatch<React.SetStateAction<boolean>>;
  fetchBookmarks?: () => void;
}

const Projects = ({ bookmark, setClick, fetchBookmarks }: Props) => {
  const [clickedOnProject, setClickedOnProject] = useState(false);
  const [clickedProjectIndex, setClickedProjectIndex] = useState(-1);

  const [fadeInProject, setFadeInProject] = useState(true);

  const open = useSelector(navbarOpenSelector);

  return (
    <div className="w-full m-auto flex flex-col gap-4 font-primary text-white pt-8">
      <div className="flex items-center gap-2 px-16">
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
      {bookmark.projectItems.length > 0 ? (
        <div
          className={`w-full grid ${
            open ? 'grid-cols-3' : 'grid-cols-4'
          } gap-1 transition-ease-out-500 justify-items-center`}
        >
          {clickedOnProject ? (
            <ProjectView
              projectSlugs={bookmark.projectItems.map(projectItem => projectItem.project.slug)}
              clickedProjectIndex={clickedProjectIndex}
              setClickedProjectIndex={setClickedProjectIndex}
              setClickedOnProject={setClickedOnProject}
              fadeIn={fadeInProject}
              setFadeIn={setFadeInProject}
            />
          ) : (
            <></>
          )}
          {bookmark.projectItems.map((projectItem, index) => {
            return (
              <ProjectCard
                key={projectItem.id}
                index={index}
                project={projectItem.project}
                setClickedOnProject={setClickedOnProject}
                setClickedProjectIndex={setClickedProjectIndex}
              />
            );
          })}
        </div>
      ) : (
        <div>No projects found</div>
      )}
    </div>
  );
};

export default Projects;
