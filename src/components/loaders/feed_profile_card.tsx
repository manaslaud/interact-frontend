import React from 'react';

const ProfileCardLoader = () => {
  return (
    <div
      className={`w-[24vw] h-[75vh] pb-4 max-md:mb-12 shadow-md dark:shadow-none gap-4 pt-12 max-md:pb-8 max-md:pt-4 px-4 transition-ease-500 max-md:h-fit sticky top-[90px] overflow-y-hidden overflow-x-hidden max-md:mx-auto font-primary flex flex-col dark:text-white items-center bg-gray-100 dark:bg-[#84478023] backdrop-blur-md border-[1px] dark:border-dark_primary_btn max-md:hidden max-md:bg-transparent rounded-md z-10`}
    >
      <div
        className={
          'animate-pulse delay-0 rounded-full max-md:mx-auto dark:bg-dark_primary_comp_hover w-44 h-44 cursor-default'
        }
      />
      <div className="animate-pulse delay-75 w-2/3 text-3xl h-10 rounded-lg dark:bg-dark_primary_comp_hover max-md:text-2xl text-center font-bold"></div>
      <div className="animate-pulse delay-100 w-3/5 flex flex-col gap-1">
        <div className="w-full h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
        <div className="w-full h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
        <div className="w-full h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
      </div>
      <div className="animate-pulse delay-150 w-full flex justify-center gap-6">
        <div className="w-1/3 h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
        <div className="w-1/3 h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
      </div>
      <div className="animate-pulse delay-200 w-full flex flex-col gap-8 mt-12">
        <div className="w-full flex flex-wrap items-center justify-center gap-2">
          <div className="w-16 h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
          <div className="w-16 h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
          <div className="w-16 h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
        </div>
        <div className="animate-pulse delay-300 w-full h-fit flex flex-wrap items-center justify-center gap-4">
          <div className="w-fit h-8 px-2 py-4 flex items-center gap-2">
            <div className="w-24 h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
            <div className="w-24 h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
            <div className="w-24 h-4 dark:bg-dark_primary_comp_hover rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardLoader;
