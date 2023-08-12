import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { Post } from '@/types';

export interface FeedState {
  feed: Post[];
  unreadNotifications: number;
  unreadInvitations: number;
}

const initialState: FeedState = {
  feed: [],
  unreadNotifications: 0,
  unreadInvitations: 0,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setFeed: (state, action: PayloadAction<Post[]>) => {
      state.feed = action.payload;
    },
    setUnreadNotifications: (state, action: PayloadAction<number>) => {
      state.unreadNotifications = action.payload;
    },
    setUnreadInvitations: (state, action: PayloadAction<number>) => {
      state.unreadInvitations = action.payload;
    },
  },
});

export const { setFeed, setUnreadNotifications, setUnreadInvitations } = feedSlice.actions;

export default feedSlice.reducer;

export const feedSelector = (state: RootState) => state.feed.feed;
export const unreadNotificationsSelector = (state: RootState) => state.feed.unreadNotifications;
export const unreadInvitationsSelector = (state: RootState) => state.feed.unreadInvitations;
