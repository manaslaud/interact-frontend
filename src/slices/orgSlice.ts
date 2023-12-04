import { RootState } from '@/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface OrgState {
  currentOrgID: string;
  currentOrgUserAccID: string;
}

const initialState: OrgState = {
  currentOrgID: '',
  currentOrgUserAccID: '',
};

export const orgSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setCurrentOrgID: (state, action: PayloadAction<string>) => {
      state.currentOrgID = action.payload;
    },
    setCurrentOrgUserAccID: (state, action: PayloadAction<string>) => {
      state.currentOrgUserAccID = action.payload;
    },
  },
});

export const { setCurrentOrgID, setCurrentOrgUserAccID } = orgSlice.actions;

export default orgSlice.reducer;

export const currentOrgIDSelector = (state: RootState) => state.organization.currentOrgID;
export const currentOrgUserAccIDSelector = (state: RootState) => state.organization.currentOrgUserAccID;
