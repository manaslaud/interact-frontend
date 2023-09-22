import React, { useState } from 'react';
import Image from 'next/image';
import { USER_PROFILE_PIC_URL } from '@/config/routes';
import { Application } from '@/types';
import getApplicationStatus from '@/utils/get_application_status';

interface Props {
  application: Application;
  clickedApplication?: Application;
  setClickedOnApplication?: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedApplication?: React.Dispatch<React.SetStateAction<Application>>;
}

const ApplicationCard = ({
  application,
  clickedApplication,
  setClickedOnApplication,
  setClickedApplication,
}: Props) => {
  return (
    <div
      onClick={() => {
        if (setClickedApplication) setClickedApplication(application);
        if (setClickedOnApplication) setClickedOnApplication(true);
      }}
      className={`w-full ${
        application.id == clickedApplication?.id ? 'bg-[#ffffff2b]' : ''
      } font-primary dark:text-white border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-md flex items-center justify-between p-6 transition-ease-300 cursor-pointer`}
    >
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
      <div className="w-fit h-fit font-medium">{getApplicationStatus(application.status)}</div>
    </div>
  );
};

export default ApplicationCard;
