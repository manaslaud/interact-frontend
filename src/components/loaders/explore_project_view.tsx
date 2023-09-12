import { X } from '@phosphor-icons/react';
import React from 'react';
interface Props {
  setClickedOnProject: React.Dispatch<React.SetStateAction<boolean>>;
  fadeIn: boolean;
}

const ProjectViewLoader = ({ setClickedOnProject, fadeIn }: Props) => {
  return (
    <div
      className={`w-screen h-screen text-white font-primary fixed top-0 left-0 z-50 flex bg-backdrop backdrop-blur-2xl ${
        fadeIn ? 'animate-fade_third' : ''
      }`}
    >
      <div className="animate-pulse delay-0 w-16 h-screen flex flex-col items-center py-3 justify-between max-md:fixed max-md:top-0 max-md:left-0">
        <div className="w-10 h-10 rounded-full bg-primary_comp_hover cursor-pointer" />
      </div>

      <div className="w-[calc(100vw-128px)] max-md:w-screen h-screen pt-3">
        <div className="w-full h-14 max-md:pl-[68px] flex flex-col gap-1">
          <div className="animate-pulse delay-75 font-semibold bg-primary_comp_hover w-32 h-5 rounded-sm"></div>
          <div className="animate-pulse delay-100 text-xs bg-primary_comp_hover w-24 h-4 rounded-sm"></div>
        </div>
        <div className="w-full h-[calc(100vh-56px)] max-md:overflow-y-auto flex max-md:flex-col">
          <div className="animate-pulse delay-200 bg-primary_comp w-3/4 max-md:w-full h-full max-md:h-96 rounded-tl-md max-md:rounded-none"></div>

          <div className="w-1/4 max-md:w-full h-full max-md:h-fit max-md:min-h-[calc(100vh-65px-384px)] overflow-y-auto p-4 bg-primary_comp_hover flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="animate-pulse delay-300 w-64 h-12 bg-primary_comp_active rounded-md"></div>
            </div>

            <div className="animate-pulse delay-400 w-full flex flex-col gap-1">
              <div className="w-full h-4 bg-primary_comp_active rounded-sm"></div>
              <div className="w-full h-4 bg-primary_comp_active rounded-sm"></div>
              <div className="w-full h-4 bg-primary_comp_active rounded-sm"></div>
              <div className="w-full h-4 bg-primary_comp_active rounded-sm"></div>
            </div>
            <div className="animate-pulse delay-500 w-full flex flex-wrap items-center gap-2">
              <div className="w-16 h-6 bg-primary_comp_active rounded-sm"></div>
              <div className="w-16 h-6 bg-primary_comp_active rounded-sm"></div>
              <div className="w-16 h-6 bg-primary_comp_active rounded-sm"></div>
              <div className="w-16 h-6 bg-primary_comp_active rounded-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-16 h-screen flex flex-col items-center justify-between py-3 max-md:fixed max-md:top-0 max-md:right-0">
        <div
          onClick={() => setClickedOnProject(false)}
          className="w-10 h-10 rounded-full flex-center bg-primary_comp_hover cursor-pointer"
        >
          <X color="white" size={24} weight="bold" />
        </div>
        <div className="w-10 h-10 rounded-full"></div>
      </div>
    </div>
  );
};

export default ProjectViewLoader;
