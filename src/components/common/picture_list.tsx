import { User } from '@/types';
import React from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';

interface Props {
  users: User[];
}

const PictureList = ({ users }: Props) => {
  const variations = ['left-0', 'left-1', 'left-2', 'w-4', 'w-8', 'w-12'];
  return (
    <>
      {users.length > 0 ? (
        <div className="flex gap-1">
          <div
            className={`w-${
              4 *
              users.filter((m, index) => {
                return index >= 0 && index < 3;
              }).length
            } h-4 relative mr-1`}
          >
            {users
              .filter((u, index) => {
                return index >= 0 && index < 3;
              })
              .map((u, index) => {
                return (
                  <Image
                    key={index}
                    crossOrigin="anonymous"
                    width={50}
                    height={50}
                    alt={'User Pic'}
                    src={`${USER_PROFILE_PIC_URL}/${u.profilePic}`}
                    className={`w-4 h-4 rounded-full cursor-default absolute top-0 left-${index}`}
                  />
                );
              })}
          </div>
          {users.length > 3 ? (
            <>
              <div>+</div>
              <div>
                {users.length - 3} other{users.length - 3 != 1 ? 's' : ''}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PictureList;
