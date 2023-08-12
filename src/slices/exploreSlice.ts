import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export interface ExploreState {
  activeTab: number;
}

const initialState = {
  activeTab: 0,
  workTab: 0,
};

export const exploreSlice = createSlice({
  name: 'explore',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setWorkTab: (state, action) => {
      state.workTab = action.payload;
    },
  },
});

export const { setActiveTab, setWorkTab } = exploreSlice.actions;

export default exploreSlice.reducer;

export const activeTabSelector = (state: RootState) => state.explore.activeTab;

export const workTabSelector = (state: RootState) => state.explore.workTab;
