import TabMenu from '@/components/common/tab_menu';
import BaseWrapper from '@/wrappers/base';
import MainWrapper from '@/wrappers/main';
import Sidebar from '@/components/common/sidebar';
import React, { useEffect, useState } from 'react';
import { initialProject } from '@/types/initials';
import { PROJECT_URL } from '@/config/routes';
import { SERVER_ERROR } from '@/config/errors';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import { GetServerSidePropsContext } from 'next/types';
import { useSelector } from 'react-redux';
import { userSelector } from '@/slices/userSlice';
import { useRouter } from 'next/router';
import { ArrowArcLeft } from '@phosphor-icons/react';
import Openings from '@/screens/workspace/manage_project/openings';
import Loader from '@/components/common/loader';

interface Props {
  slug: string;
}

const ManageProject = ({ slug }: Props) => {
  const [active, setActive] = useState(0);
  const [project, setProject] = useState(initialProject);
  const [loading, setLoading] = useState(true);

  const user = useSelector(userSelector);

  const router = useRouter();

  const fetchProject = async () => {
    const URL = `${PROJECT_URL}/${slug}`;
    const res = await getHandler(URL);
    if (res.statusCode == 200) {
      if (res.data.project.userID != user.id && !user.managerProjects.includes(res.data.project.id)) router.back();
      setProject(res.data.project);
      setLoading(false);
    } else {
      if (res.status != -1) {
        if (res.data.message) Toaster.error(res.data.message);
        else Toaster.error(SERVER_ERROR);
      }
    }
  };

  useEffect(() => {
    fetchProject();
  }, [slug]);

  return (
    <BaseWrapper>
      <Sidebar index={3} />
      <MainWrapper>
        <div className="w-full flex flex-col gap-4 p-base_padding">
          <div className="flex gap-3">
            <ArrowArcLeft
              onClick={() => router.back()}
              color="white"
              className="w-10 h-10 p-2 bg-primary_comp_hover rounded-full cursor-pointer"
              size={40}
            />
            <div className="text-4xl font-semibold text-white font-primary">Manage Project</div>
          </div>
          <TabMenu items={['Openings', 'Collaborators', 'Chats']} active={active} setState={setActive} />
          {loading ? (
            <Loader />
          ) : (
            <>
              <div className={`${active === 0 ? 'block' : 'hidden'}`}>
                <Openings project={project} />
              </div>
              <div className={`${active === 1 ? 'block' : 'hidden'}`}></div>
              <div className={`${active === 2 ? 'block' : 'hidden'}`}></div>
            </>
          )}
        </div>
      </MainWrapper>
    </BaseWrapper>
  );
};

export default ManageProject;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { slug } = context.query;

  return {
    props: { slug },
  };
}
