import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';

interface ConfigState {
  lastFetchingFollowing: string;
  lastFetchingLikes: string;
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
  date.setMinutes(date.getMinutes() - 30);
  return date.toUTCString();
};
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
  lastFetchingFollowing: getInitialDate(),
  lastFetchingLikes: getInitialDate(),
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
      state = initialState;
    },
    setFetchingFollowing: (state, action: PayloadAction<string>) => {
      state.lastFetchingFollowing = action.payload;
    },
    setFetchingLikes: (state, action: PayloadAction<string>) => {
      state.lastFetchingLikes = action.payload;
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
  setFetchingFollowing,
  setFetchingLikes,
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
