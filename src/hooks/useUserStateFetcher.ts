import { MESSAGING_URL, WORKSPACE_URL } from '@/config/routes';
import getHandler from '@/handlers/getHandler';
import {
  configSelector,
  setFetchedChats,
  setFetchedContributingProjects,
  setFetchedFollowing,
  setFetchedLikedComments,
  setFetchedLikedPosts,
  setFetchedLikedProjects,
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
  setLikedComments,
  setLikedPosts,
  setLikedProjects,
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

  const fetchLikedPosts = () => {
    if (config.fetchedLikedPosts) return;
    const URL = `/posts/me/likes`;
    getHandler(URL)
      .then(res => {
        const likedPostsData: string[] = res.data.posts || [];
        dispatch(setLikedPosts(likedPostsData));
        dispatch(setFetchedLikedPosts());
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR);
        console.log(err);
      });
  };

  const fetchLikedProjects = () => {
    if (config.fetchedLikedProjects) return;
    const URL = `/projects/me/likes`;
    getHandler(URL)
      .then(res => {
        const likedProjectsData: string[] = res.data.projects || [];
        dispatch(setLikedProjects(likedProjectsData));
        dispatch(setFetchedLikedProjects());
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR);
        console.log(err);
      });
  };

  const fetchLikedComments = () => {
    if (config.fetchedLikedComments) return;
    const URL = `/comments/me/likes`;
    getHandler(URL)
      .then(res => {
        const likedCommentsData: string[] = res.data.comments || [];
        dispatch(setLikedComments(likedCommentsData));
        dispatch(setFetchedLikedComments());
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR);
        console.log(err);
      });
  };

  const fetchBookmarks = () => {
    if (config.fetchedPostBookmarks && config.fetchedProjectBookmarks) return;
    const URL = `/bookmarks`;
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
    const URL = `/notifications/unread`;
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
    const URL = `/invitations/unread`;
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
    fetchLikedPosts();
    fetchLikedProjects();
    fetchLikedComments();
    fetchBookmarks();
    fetchChats();
    fetchContributingProjects();
    fetchUnreadNotifications();
    fetchUnreadInvitations();
  };

  return fetchUserState;
};

export default useUserStateFetcher;
