import Loader from '@/components/common/loader';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL, PROJECT_PIC_URL, PROJECT_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import { Project } from '@/types';
import { initialProject } from '@/types/initials';
import Toaster from '@/utils/toaster';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import LowerProject from '@/components/lowers/lower_project';
import ProjectViewLoader from '@/components/loaders/explore_project_view';
import { useRouter } from 'next/router';
import Collaborators from '@/components/explore/show_collaborator';
import Openings from '@/components/explore/show_openings';
import Link from 'next/link';
import getIcon from '@/utils/get_icon';
import getDomainName from '@/utils/get_domain_name';
import Links from '@/components/explore/show_links';
import { useSwipeable } from 'react-swipeable';

interface Props {
  projectSlugs: string[];
  clickedProjectIndex: number;
  setClickedProjectIndex: React.Dispatch<React.SetStateAction<number>>;
  setClickedOnProject: React.Dispatch<React.SetStateAction<boolean>>;
  fadeIn: boolean;
  setFadeIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProjectView = ({
  projectSlugs,
  clickedProjectIndex,
  setClickedProjectIndex,
  setClickedOnProject,
  fadeIn,
  setFadeIn,
}: Props) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [loading, setLoading] = useState(true);

  const [clickedOnReadMore, setClickedOnReadMore] = useState(false);

  const router = useRouter();

  const fetchProject = async (abortController: AbortController) => {
    setLoading(true);
    let slug = '';
    try {
      slug = projectSlugs[clickedProjectIndex];
    } finally {
      const URL = `${EXPLORE_URL}/projects/${slug}`;
      const res = await getHandler(URL, abortController.signal);
      if (res.statusCode == 200) {
        setProject(res.data.project);
        setLoading(false);
      } else {
        if (res.status != -1) {
          if (res.data.message) Toaster.error(res.data.message);
          else Toaster.error(SERVER_ERROR);
        }
      }
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchProject(abortController);

    return () => {
      abortController.abort();
    };
  }, [clickedProjectIndex]);

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  const swipeHandler = useSwipeable({
    onSwipedRight: () => {
      if (clickedProjectIndex != 0) {
        setClickedProjectIndex(prev => prev - 1);
        setFadeIn(false);
      }
    },
    onSwipedLeft: () => {
      if (clickedProjectIndex != projectSlugs.length - 1) {
        setClickedProjectIndex(prev => prev + 1);
        setFadeIn(false);
      }
    },
  });

  return (
    <>
      {loading ? (
        <ProjectViewLoader fadeIn={fadeIn} setClickedOnProject={setClickedOnProject} />
      ) : (
        <div
          {...swipeHandler}
          className="w-screen h-screen text-white font-primary fixed top-0 left-0 z-50 flex bg-backdrop backdrop-blur-2xl"
        >
          <div className="w-16 h-screen flex flex-col items-center py-3 justify-between max-md:fixed max-md:top-0 max-md:left-0">
            <div className="w-10 h-10 relative">
              <Image
                crossOrigin="anonymous"
                width={10000}
                height={10000}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${project.user.profilePic}`}
                className={'w-10 h-10 rounded-full cursor-default absolute top-0 left-0 z-10'}
              />
              {/* <Image
                crossOrigin="anonymous"
                width={10000}
                height={10000}
                alt={'User Pic'}
                src={`${USER_PROFILE_PIC_URL}/${project.memberships[0].user.profilePic}`}
                className={'w-10 h-10 rounded-full cursor-default absolute top-0 left-2'}
              /> */}
            </div>
            {clickedProjectIndex != 0 ? (
              <div
                onClick={() => {
                  setClickedProjectIndex(prev => prev - 1);
                  setFadeIn(false);
                }}
                className="w-10 h-10 rounded-full flex-center bg-primary_comp_hover cursor-pointer shadow-xl"
              >
                <CaretLeft color="white" size={24} weight="bold" />
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="w-[calc(100vw-128px)] max-md:w-screen h-screen pt-3">
            <div className="w-full h-14 max-md:pl-[68px]">
              <div className="w-fit font-semibold cursor-default">{project.title}</div>
              <div // convert to link
                className="w-fit text-xs font-medium"
              >
                <span
                  onClick={() => router.push(`/explore/user/${project.user.username}`)}
                  className="cursor-pointer hover:underline hover:underline-offset-2"
                >
                  {project.user.name}{' '}
                </span>

                <span>{project.memberships.length > 0 ? `+${project.memberships.length}` : ''}</span>
              </div>
            </div>
            <div className="w-full h-[calc(100vh-56px)] max-md:overflow-y-auto flex max-md:flex-col">
              <Image
                crossOrigin="anonymous"
                className="w-3/4 max-md:w-full h-full max-md:h-96 rounded-tl-md max-md:rounded-none object-cover"
                src={`${PROJECT_PIC_URL}/${project.coverPic}`}
                alt="Project Cover"
                width={10000}
                height={10000}
              />

              <div className="w-1/4 max-md:w-full h-full max-md:h-fit max-md:min-h-[calc(100vh-65px-384px)] overflow-y-auto p-4 bg-primary_comp_hover flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="font-bold text-3xl text-gradient">{project.title}</div>
                  <div className="md:hidden w-fit">
                    <LowerProject project={project} />
                  </div>
                </div>

                <div className="text-sm">
                  {project.description.length > 200 ? (
                    <>
                      {clickedOnReadMore ? (
                        project.description
                      ) : (
                        <>
                          {project.description.substring(0, 200)}
                          <span
                            onClick={() => setClickedOnReadMore(true)}
                            className="text-xs italic opacity-60 cursor-pointer"
                          >
                            {' '}
                            Read More...
                          </span>
                        </>
                      )}
                    </>
                  ) : (
                    project.description
                  )}
                </div>
                <div className="w-full flex flex-wrap gap-2">
                  {project.tags &&
                    project.tags.map(tag => {
                      return (
                        <div
                          key={tag}
                          className="flex-center p-2 font-primary text-xs text-white border-[1px] border-primary_btn bg-[#20032c41] rounded-lg"
                        >
                          {tag}
                        </div>
                      );
                    })}
                </div>
                <Collaborators memberships={project.memberships} />
                <Openings openings={project.openings} slug={project.slug} />
                <Links links={project.links} />
              </div>
            </div>
          </div>

          <div className="w-16 h-screen flex flex-col items-center justify-between py-3 max-md:fixed max-md:top-0 max-md:right-0">
            <div
              onClick={() => setClickedOnProject(false)}
              className="w-10 h-10 rounded-full flex-center bg-primary_comp_hover cursor-pointer"
            >
              <X color="white" size={24} weight="bold" />
            </div>

            <div className="max-md:hidden">
              <LowerProject project={project} />
            </div>

            {clickedProjectIndex != projectSlugs.length - 1 ? (
              <div
                onClick={() => {
                  setClickedProjectIndex(prev => prev + 1);
                  setFadeIn(false);
                }}
                className="w-10 h-10 rounded-full flex-center bg-primary_comp_hover cursor-pointer shadow-xl"
              >
                <CaretRight color="white" size={24} weight="bold" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full"></div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectView;
