import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { OPENING_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Application } from '@/types';
import Protect from '@/utils/protect';
import Toaster from '@/utils/toaster';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Sidebar from '@/components/common/sidebar';
import { ArrowArcLeft } from '@phosphor-icons/react';
import router, { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import React, { useEffect, useState } from 'react';
import { initialApplication } from '@/types/initials';
import ApplicationCard from '@/components/workspace/manage_project/application_card';
import ApplicationView from '@/sections/workspace/manage_project/application_view';

interface Props {
  oid: string;
}

const Applications = ({ oid }: Props) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const [clickedOnApplication, setClickedOnApplication] = useState(false);
  const [clickedApplication, setClickedApplication] = useState(initialApplication);

  const router = useRouter();

  const fetchApplications = async () => {
    const URL = `${OPENING_URL}/applications/${oid}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      const applicationData = res.data.applications || [];
      setApplications(applicationData);
      const aid = new URLSearchParams(window.location.search).get('aid');
      if (aid && aid != '') {
        applicationData.forEach((application: Application) => {
          if (aid == application.id) {
            setClickedApplication(application);
            setClickedOnApplication(true);
          }
        });
      }
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [oid]);

  useEffect(() => {
    if (clickedApplication.id != '')
      router.push({
        pathname: router.pathname,
        query: { ...router.query, aid: clickedApplication.id },
      });
  }, [clickedApplication]);

  return (
    <BaseWrapper>
      <Sidebar index={3} />
      <MainWrapper>
        <div className="w-full flex flex-col gap-4">
          <div className="flex gap-3 p-base_padding">
            <ArrowArcLeft
              onClick={() => router.back()}
              color="white"
              className="w-10 h-10 p-2 bg-primary_comp_hover rounded-full cursor-pointer"
              size={40}
            />
            <div className="text-4xl font-semibold text-white font-primary">Applications</div>
          </div>
          <div className="w-full flex flex-col gap-6 px-2 py-2">
            {loading ? (
              <Loader />
            ) : (
              <>
                {applications.length > 0 ? (
                  <div className="flex justify-evenly px-4">
                    <div
                      className={`${
                        clickedOnApplication ? 'w-[40%]' : 'w-[720px]'
                      } max-md:w-[720px] flex flex-col gap-4`}
                    >
                      {applications.map(application => {
                        return (
                          <ApplicationCard
                            key={application.id}
                            application={application}
                            clickedApplication={clickedApplication}
                            setClickedOnApplication={setClickedOnApplication}
                            setClickedApplication={setClickedApplication}
                          />
                        );
                      })}
                    </div>
                    {clickedOnApplication ? (
                      <ApplicationView application={clickedApplication} setShow={setClickedOnApplication} />
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <div>No Openings found</div>
                )}
              </>
            )}
          </div>
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default Protect(Applications);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { oid } = context.query;

  return {
    props: { oid },
  };
}
