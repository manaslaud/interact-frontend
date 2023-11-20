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
  return (
    <>
      {memberships && memberships.length > 0 ? (
        <div className="w-full flex flex-col gap-2">
          <div className="text-lg font-semibold">Collaborators</div>
          <div className="grid grid-cols-5 gap-4">
            {memberships.map((membership, index) => {
              return (
                <Link
                  key={membership.id}
                  href={`/explore/user/${membership.user.username}`}
                  target="_blank"
                  className="w-12 h-12 rounded-full relative group"
                >
                  <div
                    className={`w-36 absolute -top-24 ${
                      index + (1 % 5) == 0 || index % 5 == 0 ? (index == 0 ? 'left-0' : 'right-0') : 'left-0'
                    } scale-0 px-3 rounded-lg border-2  border-gray-300 bg-white py-2 text-sm font-semibold shadow-2xl transition-ease-300 capitalize group-hover:scale-100`}
                  >
                    <div className="font-bold text-base text-gradient line-clamp-1">{membership.user.name}</div>
                    <div className="text-xs font-medium line-clamp-1">{membership.title}</div>
                    {workspace ? (
                      <div className="text-xs font-semibold mt-2">{membership.role}</div>
                    ) : (
                      <div className="flex gap-1 text-xs mt-2">
                        <div className="font-bold">{membership.user.noFollowers}</div>
                        <div>Follower{membership.user.noFollowers != 1 ? 's' : ''}</div>
                      </div>
                    )}
                  </div>
                  <div className="hover:scale-110 transition-ease-300">
                    <Image
                      crossOrigin="anonymous"
                      width={10000}
                      height={10000}
                      alt={'User Pic'}
                      src={`${USER_PROFILE_PIC_URL}/${membership.user.profilePic}`}
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
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
