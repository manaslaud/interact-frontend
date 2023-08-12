import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';

interface ConfigState {
  fetchedFollowing: boolean;
  fetchedLikedPosts: boolean;
  fetchedLikedProjects: boolean;
  fetchedLikedPostComments: boolean;
  fetchedLikedProjectComments: boolean;
  fetchedPostBookmarks: boolean;
  fetchedProjectBookmarks: boolean;
  fetchedChats: boolean;
  fetchedContributingProjects: boolean;
  lastFetchedUnreadNotifications: string;
  lastFetchedUnreadInvitations: string;
}

const getInitialNotificationDate = (): string => {
  const date = new Date();
  date.setSeconds(date.getSeconds() - 30);
  return date.toUTCString();
};

const getInitialInvitationDate = (): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 2);
  return date.toUTCString();
};

const initialState: ConfigState = {
  fetchedFollowing: false,
  fetchedLikedPosts: false,
  fetchedLikedProjects: false,
  fetchedLikedPostComments: false,
  fetchedLikedProjectComments: false,
  fetchedPostBookmarks: false,
  fetchedProjectBookmarks: false,
  fetchedChats: false,
  fetchedContributingProjects: false,
  lastFetchedUnreadNotifications: getInitialNotificationDate(),
  lastFetchedUnreadInvitations: getInitialInvitationDate(),
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    resetConfig: state => {
      state = initialState;
    },
    setFetchedFollowing: state => {
      state.fetchedFollowing = true;
    },
    setFetchedLikedPosts: state => {
      state.fetchedLikedPosts = true;
    },
    setFetchedLikedProjects: state => {
      state.fetchedLikedProjects = true;
    },
    setFetchedLikedPostComments: state => {
      state.fetchedLikedPostComments = true;
    },
    setFetchedLikedProjectComments: state => {
      state.fetchedLikedProjectComments = true;
    },
    setFetchedPostBookmarks: state => {
      state.fetchedPostBookmarks = true;
    },
    setFetchedProjectBookmarks: state => {
      state.fetchedProjectBookmarks = true;
    },
    setFetchedChats: state => {
      state.fetchedChats = true;
    },
    setFetchedContributingProjects: state => {
      state.fetchedContributingProjects = true;
    },
    setLastFetchedUnreadNotifications: (state, action: PayloadAction<string>) => {
      state.lastFetchedUnreadNotifications = action.payload;
    },
    setLastFetchedUnreadInvitations: (state, action: PayloadAction<string>) => {
      state.lastFetchedUnreadInvitations = action.payload;
    },
  },
});

export const {
  resetConfig,
  setFetchedChats,
  setFetchedFollowing,
  setFetchedLikedPostComments,
  setFetchedLikedPosts,
  setFetchedLikedProjectComments,
  setFetchedLikedProjects,
  setFetchedPostBookmarks,
  setFetchedProjectBookmarks,
  setFetchedContributingProjects,
  setLastFetchedUnreadNotifications,
  setLastFetchedUnreadInvitations,
} = configSlice.actions;

export default configSlice.reducer;

export const configSelector = (state: RootState) => state.config;
