import {
  BOOKMARK_URL,
  INVITATION_URL,
  MESSAGING_URL,
  NOTIFICATION_URL,
  USER_URL,
  WORKSPACE_URL,
} from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import {
  configSelector,
  setFetchedChats,
  setFetchedContributingProjects,
  setFetchedFollowing,
  setFetchedLikes,
  setFetchedPostBookmarks,
  setFetchedProjectBookmarks,
  setLastFetchedUnreadInvitations,
  setLastFetchedUnreadNotifications,
} from '@/slices/configSlice';
import {
  ChatSlice,
  setChats,
  setContributingProjects,
  setFollowing,
  setLikes,
  setPostBookmarks,
  setProjectBookmarks,
} from '@/slices/userSlice';
import { setUnreadInvitations, setUnreadNotifications } from '@/slices/feedSlice';
import { Chat, PostBookmark, Project, ProjectBookmark, User } from '@/types';
import Toaster from '@/utils/toaster';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { SERVER_ERROR } from '@/config/errors';
import moment from 'moment';

const useUserStateFetcher = () => {
  const dispatch = useDispatch();

  const config = useSelector(configSelector);

  const userID = Cookies.get('id');

  const fetchFollowing = () => {
    if (config.fetchedFollowing) return;
    const URL = `/following/${userID}`;
    getHandler(URL)
      .then(res => {
        const followingObjArr: User[] = res.data.following || [];
        const following: string[] = [];
        followingObjArr.forEach(el => {
          following.push(el.id);
        });
        dispatch(setFollowing(following));
        dispatch(setFetchedFollowing());
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR);
        console.log(err);
      });
  };

  const fetchLikes = () => {
    if (config.fetchedLikes) return;
    const URL = `${USER_URL}/me/likes`;
    getHandler(URL)
      .then(res => {
        const likesData: string[] = res.data.likes || [];
        dispatch(setLikes(likesData));
        dispatch(setFetchedLikes());
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR);
        console.log(err);
      });
  };

  const fetchBookmarks = () => {
    if (config.fetchedPostBookmarks && config.fetchedProjectBookmarks) return;
    const URL = `${BOOKMARK_URL}`;
    getHandler(URL)
      .then(res => {
        const postBookmarksData: PostBookmark[] = res.data.postBookmarks || [];
        const projectBookmarksData: ProjectBookmark[] = res.data.projectBookmarks || [];
        dispatch(setPostBookmarks(postBookmarksData));
        dispatch(setProjectBookmarks(projectBookmarksData));
        dispatch(setFetchedPostBookmarks());
        dispatch(setFetchedProjectBookmarks());
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR);
        console.log(err);
      });
  };

  const fetchChats = () => {
    if (config.fetchedChats) return;
    const URL = `${MESSAGING_URL}/me`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const chats: ChatSlice[] = [];
          res.data.chats?.forEach((chat: Chat) => {
            chats.push({ chatID: chat.id, userID: chat.acceptedByID == userID ? chat.createdByID : chat.acceptedByID });
          });
          dispatch(setChats(chats));
          dispatch(setFetchedChats());
        } else Toaster.error(res.data.message);
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR);
        console.log(err);
      });
  };

  const fetchContributingProjects = () => {
    if (config.fetchedContributingProjects) return;
    const URL = `${WORKSPACE_URL}/contributing`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const projects: string[] = [];
          res.data.projects?.forEach((project: Project) => {
            projects.push(project.id);
          });
          dispatch(setContributingProjects(projects));
          dispatch(setFetchedContributingProjects());
        } else Toaster.error(res.data.message);
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR);
        console.log(err);
      });
  };

  const fetchUnreadNotifications = () => {
    if (moment().utc().diff(config.lastFetchedUnreadNotifications, 'seconds') < 30) return;
    const URL = `${NOTIFICATION_URL}/unread`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const count: number = res.data.count;
          dispatch(setUnreadNotifications(count));
          dispatch(setLastFetchedUnreadNotifications(new Date().toUTCString()));
        } else Toaster.error(res.data.message);
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR);
        console.log(err);
      });
  };

  const fetchUnreadInvitations = () => {
    if (moment().utc().diff(config.lastFetchedUnreadInvitations, 'minute') < 2) return;
    const URL = `${INVITATION_URL}/unread`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const count: number = res.data.count;
          dispatch(setUnreadInvitations(count));
          dispatch(setLastFetchedUnreadInvitations(new Date().toUTCString()));
        } else Toaster.error(res.data.message);
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR);
        console.log(err);
      });
  };

  const fetchUserState = () => {
    fetchFollowing();
    fetchLikes();
    fetchBookmarks();
    fetchChats();
    fetchContributingProjects();
    fetchUnreadNotifications();
    fetchUnreadInvitations();
  };

  return fetchUserState;
};

export default useUserStateFetcher;
