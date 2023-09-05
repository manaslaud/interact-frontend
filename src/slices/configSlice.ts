import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';

interface ConfigState {
  updatingFollowing: boolean;
  updatingLikes: boolean;
  lastFetchedFollowing: string;
  lastFetchedLikes: string;
  lastFetchedPostBookmarks: string;
  lastFetchedProjectBookmarks: string;
  lastFetchedOpeningBookmarks: string;
  lastFetchedChats: string;
  lastFetchedContributingProjects: string;
  lastFetchedUnreadNotifications: string;
  lastFetchedUnreadInvitations: string;
}

const getInitialDate = (): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 31); //+1 minutes
  return date.toUTCString();
};
const getInitialNotificationDate = (): string => {
  const date = new Date();
  date.setSeconds(date.getSeconds() - 31);
  return date.toUTCString();
};

const getInitialInvitationDate = (): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - 3);
  return date.toUTCString();
};

const initialState: ConfigState = {
  updatingFollowing: false,
  updatingLikes: false,
  lastFetchedFollowing: getInitialDate(),
  lastFetchedLikes: getInitialDate(),
  lastFetchedPostBookmarks: getInitialDate(),
  lastFetchedProjectBookmarks: getInitialDate(),
  lastFetchedOpeningBookmarks: getInitialDate(),
  lastFetchedChats: getInitialDate(),
  lastFetchedContributingProjects: getInitialDate(),
  lastFetchedUnreadNotifications: getInitialNotificationDate(),
  lastFetchedUnreadInvitations: getInitialInvitationDate(),
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    resetConfig: state => {
      state.updatingFollowing = false;
      state.updatingLikes = false;
      state.lastFetchedFollowing = getInitialDate();
      state.lastFetchedLikes = getInitialDate();
      state.lastFetchedPostBookmarks = getInitialDate();
      state.lastFetchedProjectBookmarks = getInitialDate();
      state.lastFetchedOpeningBookmarks = getInitialDate();
      state.lastFetchedChats = getInitialDate();
      state.lastFetchedContributingProjects = getInitialDate();
      state.lastFetchedUnreadNotifications = getInitialNotificationDate();
      state.lastFetchedUnreadInvitations = getInitialInvitationDate();
    },
    setUpdatingFollowing: (state, action: PayloadAction<boolean>) => {
      state.updatingFollowing = action.payload;
    },
    setUpdatingLikes: (state, action: PayloadAction<boolean>) => {
      state.updatingLikes = action.payload;
    },
    setConfig: state => {
      state.lastFetchedFollowing = new Date().toUTCString();
      state.lastFetchedLikes = new Date().toUTCString();
      state.lastFetchedPostBookmarks = new Date().toUTCString();
      state.lastFetchedProjectBookmarks = new Date().toUTCString();
      state.lastFetchedOpeningBookmarks = new Date().toUTCString();
      state.lastFetchedChats = new Date().toUTCString();
      state.lastFetchedContributingProjects = new Date().toUTCString();
      state.lastFetchedUnreadNotifications = new Date().toUTCString();
      state.lastFetchedUnreadInvitations = new Date().toUTCString();
    },
    setFetchedFollowing: (state, action: PayloadAction<string>) => {
      state.lastFetchedFollowing = action.payload;
    },
    setFetchedLikes: (state, action: PayloadAction<string>) => {
      state.lastFetchedLikes = action.payload;
    },
    setFetchedPostBookmarks: (state, action: PayloadAction<string>) => {
      state.lastFetchedPostBookmarks = action.payload;
    },
    setFetchedProjectBookmarks: (state, action: PayloadAction<string>) => {
      state.lastFetchedProjectBookmarks = action.payload;
    },
    setFetchedOpeningBookmarks: (state, action: PayloadAction<string>) => {
      state.lastFetchedOpeningBookmarks = action.payload;
    },
    setFetchedChats: (state, action: PayloadAction<string>) => {
      state.lastFetchedChats = action.payload;
    },
    setFetchedContributingProjects: (state, action: PayloadAction<string>) => {
      state.lastFetchedContributingProjects = action.payload;
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
  setUpdatingFollowing,
  setUpdatingLikes,
  setConfig,
  setFetchedChats,
  setFetchedFollowing,
  setFetchedLikes,
  setFetchedPostBookmarks,
  setFetchedProjectBookmarks,
  setFetchedOpeningBookmarks,
  setFetchedContributingProjects,
  setLastFetchedUnreadNotifications,
  setLastFetchedUnreadInvitations,
} = configSlice.actions;

export default configSlice.reducer;

export const configSelector = (state: RootState) => state.config;
