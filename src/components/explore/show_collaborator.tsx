import React, { useState } from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Membership } from '@/types';

interface Props {
  memberships: Membership[];
}

const Collaborators = ({ memberships }: Props) => {
  const [showIndex, setShowIndex] = useState(-1);
  return (
    <>
      {memberships && memberships.length > 0 ? (
        <div className="w-full flex flex-col gap-2">
          <div className="text-lg font-medium">Collaborators</div>
          <div className="flex flex-wrap gap-4 z-50 relative">
            {memberships.map((membership, index) => {
              return (
                <div
                  onMouseEnter={() => setShowIndex(index)}
                  onMouseLeave={() => setShowIndex(-1)}
                  key={membership.id}
                  className="w-12 h-12 z-50 rounded-full"
                >
                  {showIndex == index ? (
                    <div className="w-4/5 z-20 flex items-start justify-center gap-4 py-2 px-4 absolute top-12 right-1/2 translate-x-1/2 bg-primary_comp rounded-md animate-fade_third">
                      <Image
                        crossOrigin="anonymous"
                        width={10000}
                        height={10000}
                        alt={'User Pic'}
                        src={`${USER_PROFILE_PIC_URL}/${membership.user.profilePic}`}
                        className={'w-12 h-12 rounded-full cursor-default mt-2'}
                      />
                      <div className="grow flex flex-col gap-4">
                        <div className="flex flex-col">
                          <div className="font-bold text-lg text-gradient">{membership.user.name}</div>
                          <div className="text-sm">{membership.title}</div>
                        </div>

                        <div className="w-full text-xs flex justify-start gap-4">
                          <div className="flex gap-1">
                            <div className="font-bold">{membership.user.noFollowers}</div>
                            <div>Follower{membership.user.noFollowers != 1 ? 's' : ''}</div>
                          </div>
                          <div className="flex gap-1">
                            <div className="font-bold">{membership.user.noFollowing}</div>
                            <div>Following</div>
                          </div>
                        </div>
                      </div>
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
                    className={'w-12 h-12 rounded-full cursor-pointer absolute top-0 left-0'}
                  />
                </div>
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
