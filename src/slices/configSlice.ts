import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';

interface ConfigState {
  fetchingFollowing: boolean;
  fetchingLikes: boolean;
  fetchedFollowing: boolean;
  fetchedLikes: boolean;
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
  fetchingFollowing: false,
  fetchingLikes: false,
  fetchedFollowing: false,
  fetchedLikes: false,
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
    setFetchingFollowing: (state, action: PayloadAction<boolean>) => {
      state.fetchingFollowing = action.payload;
    },
    setFetchingLikes: (state, action: PayloadAction<boolean>) => {
      state.fetchingLikes = action.payload;
    },
    setConfig: state => {
      state.fetchedFollowing = true;
      state.fetchedLikes = true;
      state.fetchedPostBookmarks = true;
      state.fetchedProjectBookmarks = true;
      state.fetchedChats = true;
      state.fetchedContributingProjects = true;
      state.lastFetchedUnreadNotifications = new Date().toUTCString();
      state.lastFetchedUnreadInvitations = new Date().toUTCString();
    },
    setFetchedFollowing: state => {
      state.fetchedFollowing = true;
    },
    setFetchedLikes: state => {
      state.fetchedLikes = true;
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
  setFetchingFollowing,
  setFetchingLikes,
  setConfig,
  setFetchedChats,
  setFetchedFollowing,
  setFetchedLikes,
  setFetchedPostBookmarks,
  setFetchedProjectBookmarks,
  setFetchedContributingProjects,
  setLastFetchedUnreadNotifications,
  setLastFetchedUnreadInvitations,
} = configSlice.actions;

export default configSlice.reducer;

export const configSelector = (state: RootState) => state.config;
