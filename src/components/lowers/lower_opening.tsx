import React, { useState } from 'react';
import { Opening } from '@/types';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
// import clickedOnSharePost from './clickedOnShare_project';
import Gear from '@phosphor-icons/react/dist/icons/Gear';
import Export from '@phosphor-icons/react/dist/icons/Export';
import ShareOpening from '@/sections/lowers/share_opening';
import OpeningBookmarkIcon from './opening_bookmark';

interface Props {
  opening: Opening;
}

const LowerOpening = ({ opening }: Props) => {
  const [clickedOnShare, setClickedOnShare] = useState(false);

  const user = useSelector(userSelector);

  const router = useRouter();

  return (
    <>
      {clickedOnShare ? <ShareOpening setShow={setClickedOnShare} opening={opening} /> : <></>}
      <div className="flex gap-4">
        {user.id == opening?.userID || user.editorProjects.includes(opening.projectID) ? (
          <Gear
            className="cursor-pointer max-md:w-[32px] max-md:h-[32px]"
            onClick={() => {
              router.push(`/workspace/manage/${opening.project.slug}?action=edit&oid=${opening.id}`);
            }}
            size={32}
            weight="light"
          />
        ) : (
          <></>
        )}
        <Export
          onClick={() => setClickedOnShare(true)}
          className="cursor-pointer max-md:w-[32px] max-md:h-[32px]"
          size={32}
          weight="duotone"
        />
        <OpeningBookmarkIcon opening={opening} />
      </div>
    </>
  );
};

export default LowerOpening;
