import React from 'react';
import UserCardLoader from './user_card';

const TrendingCardLoader = () => {
  return (
    <div
      className={`w-[24vw] h-[75vh] pb-4 shadow-md dark:shadow-none gap-6 pt-4 px-4 transition-ease-500 sticky top-[150px] overflow-y-hidden overflow-x-hidden font-primary flex flex-col dark:text-white bg-[#ffffff2d] dark:bg-[#84478023] backdrop-blur-md border-[1px] border-gray-300 dark:border-dark_primary_btn max-lg:hidden rounded-md`}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="animate-pulse delay-75 w-3/4 text-3xl h-12 rounded-lg bg-white dark:bg-dark_primary_comp_hover text-center font-bold"></div>
        <div className="animate-pulse delay-150 w-full flex flex-wrap gap-2">
          <div className="w-24 h-5 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
          <div className="w-24 h-5 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
          <div className="w-24 h-5 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
          <div className="w-24 h-5 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
          <div className="w-24 h-5 bg-white dark:bg-dark_primary_comp_hover rounded-sm"></div>
        </div>
      </div>
      <div className="w-full h-[1px] border-t-2 border-dashed border-gray-300"></div>
      <div className="w-full flex flex-col gap-4">
        <div className="animate-pulse delay-75 w-2/3 text-3xl h-8 rounded-lg bg-white dark:bg-dark_primary_comp_hover text-center font-bold"></div>

        <div className="w-full flex flex-col gap-2">
          {Array(3)
            .fill(1)
            .map((_, i) => (
              <UserCardLoader key={i} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingCardLoader;
