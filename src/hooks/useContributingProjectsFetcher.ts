import { WORKSPACE_URL } from '@/config/routes';
import getHandler from '@/handlers/getHandler';
import { configSelector, setFetchedContributingProjects } from '@/slices/configSlice';
import { setContributingProjects } from '@/slices/userSlice';
import { projectType } from '@/types';
import Toaster from '@/helpers/toaster';
import { useDispatch, useSelector } from 'react-redux';

const useContributingProjectsFetcher = () => {
  const dispatch = useDispatch();

  const config = useSelector(configSelector);

  const fetchContributingProjects = () => {
    if (config.fetchedContributingProjects) return;
    const URL = `${WORKSPACE_URL}/contributing`;
    getHandler(URL, 1)
      .then(res => {
        if (res.statusCode === 200) {
          const projects: string[] = [];
          res.data.projects?.forEach((project: projectType) => {
            projects.push(project.id);
          });
          dispatch(setContributingProjects(projects));
          dispatch(setFetchedContributingProjects());
        } else Toaster.error(res.data.message);
      })
      .catch(err => {
        Toaster.error('Internal Server Error');
        console.log(err);
      });
  };

  return fetchContributingProjects;
};

export default useContributingProjectsFetcher;
