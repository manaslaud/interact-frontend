import { Resource } from '@/types';
import React from 'react';

interface Props {
  resource: Resource;
  index: number;
  clickedResourceID: number;
  clickedOnResource: boolean;
  setClickedOnResource?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedResourceID?: React.Dispatch<React.SetStateAction<number>>;
  setClickedResource?: React.Dispatch<React.SetStateAction<Resource | null>>;
}

const ResourceCard = ({
  resource,
  index,
  clickedResourceID,
  clickedOnResource,
  setClickedOnResource,
  setClickedResourceID,
  setClickedResource,
}: Props) => {
  return (
    <div
      onClick={() => {
        if (setClickedOnResource) setClickedOnResource(true);
        if (setClickedResourceID) setClickedResourceID(index);
        if (setClickedResource) setClickedResource(resource);
      }}
      className={`w-[32%] ${
        index == clickedResourceID ? 'bg-white' : 'hover:bg-gray-100 w-[32%]'
      } relative flex justify-between items-center gap-2 rounded-lg px-6 py-4 border-gray-800 border-dashed border-2 cursor-pointer transition-ease-300`}
    >
      <div className="grow flex flex-col gap-2">
        <div className="font-semibold text-xl">{resource.title}</div>
        <div className="text-sm text-gray-600">{resource.description}</div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-5xl max-md:text-2xl font-bold text-gradient">10</div>
        <div className="w-40 text-center">Files Available</div>
      </div>
    </div>
  );
};

export default ResourceCard;
