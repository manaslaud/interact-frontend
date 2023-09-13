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
import router from 'next/router';
import { GetServerSidePropsContext } from 'next/types';
import React, { useEffect, useState } from 'react';

interface Props {
  oid: string;
}

const Applications = ({ oid }: Props) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    const URL = `${OPENING_URL}/applications/${oid}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      setApplications(res.data.applications);
      setLoading(false);
    } else {
      if (res.data.message) Toaster.error(res.data.message);
      else Toaster.error(SERVER_ERROR);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [oid]);

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
          {loading ? <Loader /> : <></>}
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
