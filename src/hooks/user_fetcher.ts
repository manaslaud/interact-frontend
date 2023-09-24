import { PROJECT_EDITOR, PROJECT_MANAGER, PROJECT_MEMBER } from '@/config/constants';
import { SERVER_ERROR } from '@/config/errors';
import {
  BOOKMARK_URL,
  CONNECTION_URL,
  INVITATION_URL,
  MESSAGING_URL,
  NOTIFICATION_URL,
  USER_URL,
  WORKSPACE_URL,
} from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import {
  configSelector,
  setFetchedApplications,
  setFetchedChats,
  setFetchedContributingProjects,
  setFetchedFollowing,
  setFetchedLikes,
  setFetchedOpeningBookmarks,
  setFetchedPostBookmarks,
  setFetchedProjectBookmarks,
  setLastFetchedUnreadInvitations,
  setLastFetchedUnreadNotifications,
} from '@/slices/configSlice';
import { setUnreadInvitations, setUnreadNotifications } from '@/slices/feedSlice';
import {
  ChatSlice,
  setApplications,
  setChats,
  setEditorProjects,
  setFollowing,
  setLikes,
  setManagerProjects,
  setMemberProjects,
  setOpeningBookmarks,
  setPersonalChatSlices,
  setPostBookmarks,
  setProjectBookmarks,
} from '@/slices/userSlice';
import {
  Application,
  Chat,
  GroupChat,
  Membership,
  OpeningBookmark,
  PostBookmark,
  ProjectBookmark,
  User,
} from '@/types';
import Toaster from '@/utils/toaster';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

const useUserStateFetcher = () => {
  const dispatch = useDispatch();

  const config = useSelector(configSelector);

  const userID = Cookies.get('id');

  const fetchFollowing = () => {
    if (moment().utc().diff(config.lastFetchedFollowing, 'minute') < 30) return;
    const URL = `${CONNECTION_URL}/following/${userID}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode == 200) {
          const followingObjArr: User[] = res.data.users || [];
          const following: string[] = [];
          followingObjArr.forEach(el => {
            following.push(el.id);
          });
          dispatch(setFollowing(following));
          dispatch(setFetchedFollowing(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
        console.log(err);
      });
  };

  const fetchLikes = () => {
    if (moment().utc().diff(config.lastFetchedLikes, 'minute') < 30) return;
    const URL = `${USER_URL}/me/likes`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode == 200) {
          const likesData: string[] = res.data.likes || [];
          dispatch(setLikes(likesData));
          dispatch(setFetchedLikes(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
        console.log(err);
      });
  };

  const fetchBookmarks = () => {
    if (
      moment().utc().diff(config.lastFetchedPostBookmarks, 'minute') < 30 &&
      moment().utc().diff(config.lastFetchedProjectBookmarks, 'minute') < 30 &&
      moment().utc().diff(config.lastFetchedOpeningBookmarks, 'minute') < 30
    )
      return;

    const URL = `${BOOKMARK_URL}`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode == 200) {
          const postBookmarksData: PostBookmark[] = res.data.postBookmarks || [];
          const projectBookmarksData: ProjectBookmark[] = res.data.projectBookmarks || [];
          const openingBookmarksData: OpeningBookmark[] = res.data.openingBookmarks || [];
          dispatch(setPostBookmarks(postBookmarksData));
          dispatch(setProjectBookmarks(projectBookmarksData));
          dispatch(setOpeningBookmarks(openingBookmarksData));
          dispatch(setFetchedPostBookmarks(new Date().toUTCString()));
          dispatch(setFetchedProjectBookmarks(new Date().toUTCString()));
          dispatch(setFetchedOpeningBookmarks(new Date().toUTCString()));
        }
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
        console.log(err);
      });
  };

  const fetchChats = () => {
    if (moment().utc().diff(config.lastFetchedChats, 'minute') < 30) return;
    const URL = `${MESSAGING_URL}/me`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const personalChatSlices: ChatSlice[] = [];
          const chats: string[] = [];
          res.data.chats?.forEach((chat: Chat) => {
            chats.push(chat.id);
            personalChatSlices.push({
              chatID: chat.id,
              userID: chat.acceptedByID == userID ? chat.createdByID : chat.acceptedByID,
            });
          });
          res.data.groupChats?.forEach((chat: GroupChat) => {
            chats.push(chat.id);
          });
          dispatch(setPersonalChatSlices(personalChatSlices));
          dispatch(setChats(chats));
          dispatch(setFetchedChats(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
        console.log(err);
      });
  };

  const fetchContributingProjects = () => {
    if (moment().utc().diff(config.lastFetchedContributingProjects, 'minute') < 30) return;
    const URL = `${WORKSPACE_URL}/memberships`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const memberProjects: string[] = [];
          const editorProjects: string[] = [];
          const managerProjects: string[] = [];

          res.data.memberships?.forEach((membership: Membership) => {
            switch (membership.role) {
              case PROJECT_MANAGER:
                managerProjects.push(membership.projectID);
                editorProjects.push(membership.projectID);
                memberProjects.push(membership.projectID);
                break;
              case PROJECT_EDITOR:
                editorProjects.push(membership.projectID);
                memberProjects.push(membership.projectID);
                break;
              case PROJECT_MEMBER:
                memberProjects.push(membership.projectID);
                break;
            }
          });
          dispatch(setManagerProjects(managerProjects));
          dispatch(setEditorProjects(editorProjects));
          dispatch(setMemberProjects(memberProjects));
          dispatch(setFetchedContributingProjects(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
        console.log(err);
      });
  };

  const fetchApplications = () => {
    if (moment().utc().diff(config.lastFetchedApplications, 'minute') < 30) return;
    const URL = `${WORKSPACE_URL}/applications`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const applications: string[] = [];
          res.data.applications?.forEach((application: Application) => {
            applications.push(application.openingID);
          });
          dispatch(setApplications(applications));
          dispatch(setFetchedApplications(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
        console.log(err);
      });
  };

  const fetchUnreadNotifications = () => {
    if (moment().utc().diff(config.lastFetchedUnreadNotifications, 'seconds') < 30) return;
    const URL = `${NOTIFICATION_URL}/unread/count`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const count: number = res.data.count;
          dispatch(setUnreadNotifications(count));
          dispatch(setLastFetchedUnreadNotifications(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
        console.log(err);
      });
  };

  const fetchUnreadInvitations = () => {
    if (moment().utc().diff(config.lastFetchedUnreadInvitations, 'minute') < 2) return;
    const URL = `${INVITATION_URL}/unread/count`;
    getHandler(URL)
      .then(res => {
        if (res.statusCode === 200) {
          const count: number = res.data.count;
          dispatch(setUnreadInvitations(count));
          dispatch(setLastFetchedUnreadInvitations(new Date().toUTCString()));
        } else Toaster.error(res.data.message, 'error_toaster');
      })
      .catch(err => {
        Toaster.error(SERVER_ERROR, 'error_toaster');
        console.log(err);
      });
  };

  const fetchUserState = () => {
    fetchFollowing();
    fetchLikes();
    fetchBookmarks();
    fetchChats();
    fetchContributingProjects();
    fetchApplications();
    fetchUnreadNotifications();
    fetchUnreadInvitations();
  };

  return fetchUserState;
};

export default useUserStateFetcher;
