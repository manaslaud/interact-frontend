import { ResourceBucket } from '@/types';
import React from 'react';

interface Props {
  resource: ResourceBucket;
  setClickedOnResource?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedResource?: React.Dispatch<React.SetStateAction<ResourceBucket>>;
}

const ResourceCard = ({ resource, setClickedOnResource, setClickedResource }: Props) => {
  return (
    <div
      onClick={() => {
        if (setClickedOnResource) setClickedOnResource(true);
        if (setClickedResource) setClickedResource(resource);
      }}
      className="w-72 bg-white relative flex flex-col items-center gap-2 rounded-lg px-6 py-8 border-gray-400 border-[1px] hover:shadow-xl cursor-pointer transition-ease-300"
    >
      <div className="w-24 h-24 flex-center flex-col items-center gap-1 border-dark_primary_btn border-4 rounded-full">
        <div className="text-5xl max-md:text-2xl font-bold text-gradient">{resource.noFiles}</div>
        <div className="w-40 text-center">file{resource.noFiles != 1 ? 's' : ''}</div>
      </div>
      <div className="w-full flex flex-col items-center text-center gap-1">
        <div className="font-semibold text-3xl line-clamp-1">{resource.title}</div>
        <div className="text-sm text-gray-600 line-clamp-2">{resource.description}</div>
      </div>
    </div>
  );
};

export default ResourceCard;
