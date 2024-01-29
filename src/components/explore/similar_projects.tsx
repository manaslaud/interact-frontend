import React, { useEffect, useState } from 'react';
import { Opening, Project } from '@/types';
import Link from 'next/link';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import ProjectCard from './project_card';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from '../common/loader';
import { signal } from '@preact/signals-react';

interface Props {
  slug: string;
}

const SimilarProjects = ({ slug }: Props) => {
  const projects = signal<Project[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const checkSet = new Set();
  const fetchProjects = () => {
    const URL = `${EXPLORE_URL}/projects/similar/${slug}?page=${page}&limit=${6}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const addedProjects = Array.from(new Set([...projects.value, ...(res.data.projects || [])]));
          if (addedProjects.length === projects.value.length) setHasMore(false);
          projects.value = addedProjects;
          setPage(prev => prev + 1);
          setLoading(false);
        } else {
          if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
          else {
            Toaster.error(SERVER_ERROR, 'error_toaster');
          }
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      });
  };

  useEffect(() => {
    setPage(1);
    projects.value = [];
    fetchProjects();
  }, [slug]);

  return (
    <>
      {projects.value.length > 0 ? (
        <div className="w-full flex flex-col gap-2 border-t-[1px] border-black border-dashed mt-4 py-4">
          <div className="text-lg font-semibold">Similar Projects</div>
          <InfiniteScroll
            className={`w-full flex flex-wrap ${
              projects.value.length == 1 ? 'justify-start' : 'justify-evenly'
            } max-md:justify-center gap-3`}
            dataLength={projects.value.length}
            next={() => fetchProjects()}
            hasMore={hasMore}
            loader={<Loader />}
          >
            {projects.value.map((project, index) => {
              if (checkSet.has(project.id)) {
                return;
              } else {
                checkSet.add(project.id);
                return (
                  <Link key={project.id} href={`/explore?pid=${project.slug}`} target="_blank">
                    <ProjectCard index={index} project={project} size={64} />
                  </Link>
                );
              }
            })}
          </InfiniteScroll>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SimilarProjects;
