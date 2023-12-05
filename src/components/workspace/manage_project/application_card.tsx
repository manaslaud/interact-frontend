import React, { useState } from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Application } from '@/types';
import getApplicationStatus from '@/utils/funcs/get_application_status';
import { initialAchievement } from '@/types/initials';
import { Check, Plus, X } from '@phosphor-icons/react';
import moment from 'moment';

interface Props {
  application: Application;
  index: number;
  clickedApplicationID: number;
  applications: Application[];
  setClickedOnApplication?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedApplicationID?: React.Dispatch<React.SetStateAction<number>>;
}

const ApplicationCard = ({
  application,
  index,
  applications,
  clickedApplicationID,
  setClickedOnApplication,
  setClickedApplicationID,
}: Props) => {
  const clickedApplication = applications[clickedApplicationID] || initialAchievement;
  return (
    <div
      onClick={() => {
        if (setClickedApplicationID) setClickedApplicationID(index);
        if (setClickedOnApplication) setClickedOnApplication(true);
      }}
      className={`w-full ${
        application.id == clickedApplication?.id ? 'bg-white' : 'hover:bg-gray-100'
      } relative font-primary dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-md flex items-center justify-between gap-4 flex-wrap p-6 transition-ease-300 cursor-pointer`}
    >
      {(() => {
        switch (application.status) {
          case -1:
            return (
              <div className="absolute top-0 right-2 -translate-y-1/2 flex gap-1 items-center px-2 py-1 rounded-xl text-xs bg-[#fbbebe] max-lg:fixed max-lg:top-navbar">
                Rejected
                <X weight="bold" size={16} />
              </div>
            );
          case 0:
            return (
              <div className="absolute top-0 right-2 -translate-y-1/2 flex gap-1 items-center px-2 py-1 rounded-xl text-xs bg-[#ffffff] max-lg:fixed max-lg:top-navbar">
                Submitted
              </div>
            );
          case 1:
            return (
              <div className="absolute top-0 right-2 -translate-y-1/2 flex gap-1 items-center px-2 py-1 rounded-xl text-xs bg-[#fbf9be] max-lg:fixed max-lg:top-navbar">
                Shortlisted
                <Plus weight="bold" size={16} />
              </div>
            );
          case 2:
            return (
              <div className="absolute top-0 right-2 -translate-y-1/2 flex gap-1 items-center px-2 py-1 rounded-xl text-xs bg-[#bffbbe] max-lg:fixed max-lg:top-navbar">
                Accepted
                <Check weight="bold" size={16} />
              </div>
            );
          default:
            return <></>;
        }
      })()}

      <div className="flex items-center justify-between gap-6">
        <Image
          crossOrigin="anonymous"
          width={10000}
          height={10000}
          alt={'User Pic'}
          src={`${USER_PROFILE_PIC_URL}/${application.user.profilePic}`}
          className={'rounded-full w-16 h-16'}
        />
        <div className="flex flex-col gap-1">
          <div className="text-xl font-semibold">{application.user.name}</div>
          <div className="font-medium">{application.user.tagline}</div>
        </div>
      </div>
      <div className="w-fit h-fit text-xs">{moment(application.createdAt).fromNow()}</div>
    </div>
  );
};

export default ApplicationCard;
