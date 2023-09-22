import React from 'react';

interface Props {
  width?: string;
}

const ProfileCardLoader = ({ width = '360px' }: Props) => {
  const variants = ['w-[360px]', 'w-[24vw]'];
  return (
    <div
      className={`w-[${width}] overflow-y-auto overflow-x-hidden pb-4 max-md:mx-auto font-primary mt-base_padding max-md:mb-12 ml-base_padding h-base_md max-md:h-fit flex flex-col gap-4 dark:text-white items-center pt-12 max-md:pb-8 max-md:pt-4 px-4 shadow-md dark:shadow-none bg-[#ffffff2d] dark:bg-[#84478023] backdrop-blur-md border-[1px] border-gray-300 dark:border-dark_primary_btn sticky max-md:static top-[90px] max-md:bg-transparent rounded-md z-10`}
    >
      <div
        className={
          'animate-pulse delay-0 rounded-full max-md:mx-auto bg-white dark:bg-dark_primary_comp_hover w-44 h-44 cursor-default'
        }
      />
      <div className="animate-pulse delay-75 w-2/3 text-3xl h-10 rounded-lg bg-white dark:bg-dark_primary_comp_hover max-md:text-2xl text-center font-bold"></div>
      <div className="animate-pulse delay-100 w-3/5 flex flex-col gap-1">
        <div className="w-full h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
        <div className="w-full h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
        <div className="w-full h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
      </div>
      <div className="animate-pulse delay-150 w-full flex justify-center gap-6">
        <div className="w-1/3 h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
        <div className="w-1/3 h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
      </div>
      <div className="animate-pulse delay-200 w-full flex flex-col gap-8 mt-12">
        <div className="w-full flex flex-wrap items-center justify-center gap-2">
          <div className="w-16 h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
          <div className="w-16 h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
          <div className="w-16 h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
        </div>
        <div className="animate-pulse delay-300 w-full h-fit flex flex-wrap items-center justify-center gap-4">
          <div className="w-fit h-8 px-2 py-4 flex items-center gap-2">
            <div className="w-24 h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
            <div className="w-24 h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
            <div className="w-24 h-4 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCardLoader;
