import React, { useEffect, useState } from 'react';
import { Opening, Project } from '@/types';
import Link from 'next/link';
import { SERVER_ERROR } from '@/config/errors';
import { EXPLORE_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import Toaster from '@/utils/toaster';
import ProjectCard from './project_card';

interface Props {
  slug: string;
}

const SimilarProjects = ({ slug }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = () => {
    const URL = `${EXPLORE_URL}/projects/similar/${slug}?limit=10`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          setProjects(res.data.projects || []);
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
    fetchProjects();
  }, [slug]);

  return (
    <>
      {projects.length > 0 ? (
        <div className="w-full flex flex-col gap-2 border-t-[1px] border-black border-dashed mt-4 py-4">
          <div className="text-lg font-medium">Similar Projects</div>
          <div className="w-full flex flex-wrap justify-evenly gap-3">
            {projects.map((project, index) => {
              return (
                <Link key={project.id} href={`/explore?pid=${project.slug}`} target="_blank">
                  <ProjectCard index={index} project={project} size={64} />
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default SimilarProjects;
