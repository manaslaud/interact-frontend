import { RootState } from '@/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface OrgState {
  currentOrgID: string;
}

const initialState: OrgState = {
  currentOrgID: '',
};

export const orgSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setCurrentOrgID: (state, action: PayloadAction<string>) => {
      state.currentOrgID = action.payload;
    },
  },
});

export const { setCurrentOrgID } = orgSlice.actions;

export default orgSlice.reducer;

export const currentOrgIDSelector = (state: RootState) => state.organization.currentOrgID;
