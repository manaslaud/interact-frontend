import React, { useState } from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Membership } from '@/types';
import Link from 'next/link';

interface Props {
  memberships: Membership[];
  workspace?: boolean;
}

const Collaborators = ({ memberships, workspace = false }: Props) => {
  const [showIndex, setShowIndex] = useState(-1);
  return (
    <>
      {memberships && memberships.length > 0 ? (
        <div className="w-full flex flex-col gap-2">
          <div className="text-lg font-semibold">Collaborators</div>
          <div className="flex flex-wrap gap-4">
            {memberships.map((membership, index) => {
              return (
                <Link
                  href={`/explore/user/${membership.user.username}`}
                  target="_blank"
                  onMouseEnter={() => setShowIndex(index)}
                  onMouseLeave={() => setShowIndex(-1)}
                  key={membership.id}
                  className="w-12 h-12 rounded-full relative"
                >
                  {showIndex == index ? (
                    <div className="w-36 max-md:hidden text-primary_black bg-primary_black bg-opacity-10 border-[1px] border-primary_black backdrop-blur-sm z-20 flex flex-col justify-center items-start gap-1 p-2 absolute left-14 dark:bg-dark_primary_comp rounded-2xl animate-fade_third">
                      <div className="font-bold text-base text-gradient line-clamp-1">{membership.user.name}</div>
                      <div className="text-xs font-medium line-clamp-1">{membership.title}</div>
                      {workspace ? (
                        <div className="text-xs font-semibold mt-2">{membership.role}</div>
                      ) : (
                        <div className="flex gap-1 text-xs">
                          <div className="font-bold">{membership.user.noFollowers}</div>
                          <div>Follower{membership.user.noFollowers != 1 ? 's' : ''}</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                  <Image
                    crossOrigin="anonymous"
                    width={10000}
                    height={10000}
                    alt={'User Pic'}
                    src={`${USER_PROFILE_PIC_URL}/${membership.user.profilePic}`}
                    className="w-12 h-12 rounded-full"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Collaborators;
