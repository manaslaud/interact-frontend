import Loader from '@/components/common/loader';
import { PROJECT_PIC_URL, WORKSPACE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Application } from '@/types';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import getDisplayTime from '@/utils/get_display_time';
import moment from 'moment';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setExploreTab } from '@/slices/feedSlice';

const Applications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const getApplications = () => {
    const URL = `${WORKSPACE_URL}/applications`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setApplications(res.data.applications || []);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message);
          else {
            Toaster.error('Internal Server Error');
            console.log(res);
          }
        }
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  };

  useEffect(() => {
    getApplications();
  }, []);

  const getApplicationStatus = (status: number): string => {
    switch (status) {
      case -1:
        return 'Rejected';
      case 0:
        return 'Submitted';
      case 1:
        return 'Under Review';
      case 2:
        return 'Accepted';
      default:
        return '';
    }
  };

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          {applications.length > 0 ? (
            <div className="w-[50vw] max-md:w-screen max-md:px-6 mx-auto flex flex-col gap-4 py-2">
              {applications.map(application => {
                return (
                  <Link
                    href={`/explore?oid=${application.openingID}`}
                    onClick={() => dispatch(setExploreTab(1))}
                    key={application.id}
                    className={`w-full font-primary dark:text-white border-[1px] border-gray-400 bg-gray-100 dark:bg-transparent  dark:border-dark_primary_btn rounded-lg p-8 max-md:p-4 flex items-center gap-12 max-md:gap-4 dark:hover:bg-dark_primary_comp_hover transition-ease-300 cursor-pointer`}
                  >
                    <Image
                      crossOrigin="anonymous"
                      width={10000}
                      height={10000}
                      alt={'User Pic'}
                      src={`${PROJECT_PIC_URL}/${application.project.coverPic}`}
                      className={'w-[120px] h-[120px] max-md:w-[90px] max-md:h-[90px] rounded-lg object-cover'}
                    />

                    <div className="grow flex flex-col gap-4 max-md:gap-2">
                      <div className="flex items-center justify-between">
                        <div className="w-5/6 flex flex-col gap-1">
                          <div className="font-bold text-2xl max-md:text-lg text-gradient">
                            {application.opening.title}
                          </div>
                          <div className="text-lg font-medium max-md:text-sm">{application.project.title}</div>
                          <div className="text-sm opacity-60 max-md:text-xs">
                            {moment(application.createdAt).fromNow()}
                          </div>
                        </div>
                        <div className="max-md:text-xs">{getApplicationStatus(application.status)}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div>No applications found</div>
          )}
        </>
      )}
    </div>
  );
};

export default Applications;
