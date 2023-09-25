import { Application } from '@/types';
import React, { useState } from 'react';
import { APPLICATION_RESUME_URL, APPLICATION_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import Image from 'next/image';
import getIcon from '@/utils/get_icon';
import Link from 'next/link';
import { ArrowArcLeft } from '@phosphor-icons/react';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import router from 'next/router';
import getDomainName from '@/utils/get_domain_name';
import socketService from '@/config/ws';
import { SERVER_ERROR } from '@/config/errors';

interface Props {
  application: Application;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setApplications?: React.Dispatch<React.SetStateAction<Application[]>>;
  setFilteredApplications?: React.Dispatch<React.SetStateAction<Application[]>>;
}

const ApplicationView = ({ application, setShow, setApplications, setFilteredApplications }: Props) => {
  const [mutex, setMutex] = useState(false);

  const handleAccept = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Accepting the Application...');
    const URL = `/${APPLICATION_URL}/accept/${application.id}`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      if (setApplications) {
        setApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: 2 };
            } else return a;
          })
        );
      }
      if (setFilteredApplications) {
        setFilteredApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: 2 };
            } else return a;
          })
        );
      }
      socketService.sendNotification(
        application.userID,
        `Your Application for ${application.project.title} got Selected!`
      );
      Toaster.stopLoad(toaster, 'Application accepted!', 1);
      router.back();
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }

    setMutex(false);
  };

  const handleReject = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Rejecting the Application...');
    const URL = `/${APPLICATION_URL}/reject/${application.id}`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      if (setApplications) {
        setApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: -1 };
            } else return a;
          })
        );
      }
      if (setFilteredApplications) {
        setFilteredApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: -1 };
            } else return a;
          })
        );
      }
      socketService.sendNotification(
        application.userID,
        `Your Application for ${application.project.title} got Rejected`
      );
      Toaster.stopLoad(toaster, 'Application rejected', 1);
      router.back();
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }

    setMutex(false);
  };

  const handleShortlist = async () => {
    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding/Removing from Shortlist...');
    const URL = `/${APPLICATION_URL}/review/${application.id}`;
    const res = await getHandler(URL);
    if (res.statusCode === 200) {
      if (setApplications) {
        setApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: application.status == 1 ? 0 : 1 };
            } else return a;
          })
        );
      }
      if (setFilteredApplications) {
        setFilteredApplications(prev =>
          prev.map(a => {
            if (a.id == application.id) {
              return { ...a, status: application.status == 1 ? 0 : 1 };
            } else return a;
          })
        );
      }
      Toaster.stopLoad(toaster, 'Application added/removed from Shortlist', 1);
      router.back();
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }

    setMutex(false);
  };

  return (
    <div className="sticky max-md:fixed top-[158px] max-md:top-navbar max-md:right-0 w-[55%] max-md:w-full max-h-[70vh] max-md:max-h-screen max-md:h-base max-md:z-50 max-md:backdrop-blur-2xl max-md:backdrop-brightness-90 overflow-y-auto flex flex-col justify-between gap-8 p-8 font-primary dark:text-white border-[1px] max-md:border-0 border-primary_btn  dark:border-dark_primary_btn rounded-lg max-md:rounded-none max-md:animate-fade_third z-10">
      <div className="w-full flex flex-col gap-10 max-md:gap-8">
        <ArrowArcLeft
          className="cursor-pointer md:hidden"
          size={24}
          onClick={() => {
            setShow(false);
          }}
        />
        <div className="w-full flex max-md:flex-col items-center gap-8">
          <Image
            crossOrigin="anonymous"
            width={10000}
            height={10000}
            alt={'User Pic'}
            src={`${USER_PROFILE_PIC_URL}/${application.user.profilePic}`}
            className={'rounded-full w-36 h-36'}
          />
          <div className="grow flex flex-col gap-1">
            <div className="w-full flex flex-wrap items-center justify-between">
              <Link
                target="_blank"
                href={`/explore/user/${application.user.username}`}
                className="text-2xl font-semibold"
              >
                {application.user.name}
              </Link>
              <div className="flex gap-4">
                {application.links?.map((link, index) => {
                  return (
                    <Link key={index} href={link} target="_blank">
                      {getIcon(getDomainName(link), 24)}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="font-medium">{application.user.tagline}</div>
            <div className="w-full flex justify-start max-md:justify-center max-md:mt-2 gap-6">
              <div className="flex gap-1">
                <div className="font-bold">{application.user.noFollowers}</div>
                <div>Follower{application.user.noFollowers != 1 ? 's' : ''}</div>
              </div>
              <div className="flex gap-1">
                <div className="font-bold">{application.user.noFollowing}</div>
                <div>Following</div>
              </div>
            </div>
            <div className="w-full flex flex-wrap items-center justify-start gap-2 mt-2">
              {application.user.tags &&
                application.user.tags.map(tag => {
                  return (
                    <div
                      className="flex-center text-xs px-2 py-1 border-[1px] border-primary_btn  dark:border-dark_primary_btn rounded-md"
                      key={tag}
                    >
                      {tag}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div>{application.content}</div>
        {application.resume ? (
          <Link
            href={`${APPLICATION_RESUME_URL}/${application.resume}`}
            target="_blank"
            className="w-64 mx-auto p-2 flex-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 cursor-pointer rounded-lg font-medium text-lg"
          >
            View Resume
          </Link>
        ) : (
          <></>
        )}
      </div>

      {application.status == 0 || application.status == 1 ? (
        <div className="w-full flex justify-center gap-12 max-md:gap-4">
          <div
            onClick={handleAccept}
            className="w-32 p-2 flex-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 cursor-pointer rounded-lg font-medium text-lg"
          >
            Accept
          </div>
          <div
            onClick={handleReject}
            className="w-32 p-2 flex-center dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 cursor-pointer rounded-lg font-medium text-lg"
          >
            Reject
          </div>
          <div
            onClick={handleShortlist}
            className={`w-32 p-2 flex-center ${
              application.status == 0
                ? 'dark:bg-dark_primary_comp'
                : 'bg-[#482e4636] border-[1px] border-primary_btn  dark:border-dark_primary_btn'
            } hover:dark:bg-dark_primary_comp dark:active:bg-dark_primary_comp_active transition-ease-300 cursor-pointer rounded-lg font-medium text-lg`}
          >
            {application.status == 0 ? 'Shortlist' : 'Shortlisted'}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ApplicationView;
