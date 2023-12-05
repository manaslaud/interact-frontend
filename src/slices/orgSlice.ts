import { RootState } from '@/store';
import { Organization, OrganizationMembership } from '@/types';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

interface OrgSlice {
  id: string;
  userID: string;
  title: string;
  coverPic: string;
}

interface OrganizationMembershipSlice {
  id: string;
  organizationID: string;
  userID: string;
  role: string;
  title: string;
}

interface OrgState {
  currentOrgID: string;
  currentOrgUserAccID: string;
  currentOrg: OrgSlice;
  currentOrgMembership: OrganizationMembershipSlice;
}

const initialState: OrgState = {
  currentOrgID: '',
  currentOrgUserAccID: '',
  currentOrg: {
    id: '',
    userID: '',
    title: '',
    coverPic: '',
  },
  currentOrgMembership: {
    id: '',
    organizationID: '',
    userID: '',
    role: '',
    title: '',
  },
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
    setCurrentOrg: (state, action: PayloadAction<Organization>) => {
      state.currentOrg.id = action.payload.id;
      state.currentOrg.userID = action.payload.userID;
      state.currentOrg.title = action.payload.title;
      // state.currentOrg.coverPic = action.payload.user.profilePic;
    },
    setCurrentOrgMembership: (state, action: PayloadAction<OrganizationMembership>) => {
      state.currentOrgMembership.id = action.payload.id;
      state.currentOrgMembership.organizationID = action.payload.organizationID;
      state.currentOrgMembership.role = action.payload.role;
      state.currentOrgMembership.title = action.payload.title;
      state.currentOrgMembership.userID = action.payload.userID;
    },
    resetCurrentOrg: state => {
      state.currentOrg = {
        id: '',
        userID: '',
        title: '',
        coverPic: '',
      };
      (state.currentOrgMembership = {
        id: '',
        organizationID: '',
        userID: '',
        role: '',
        title: '',
      }),
        (state.currentOrgID = ''),
        (state.currentOrgUserAccID = '');
    },
  },
});

export const { setCurrentOrgID, setCurrentOrgUserAccID, setCurrentOrg, setCurrentOrgMembership, resetCurrentOrg } =
  orgSlice.actions;

export default orgSlice.reducer;

export const currentOrgIDSelector = (state: RootState) => state.organization.currentOrgID;
export const currentOrgUserAccIDSelector = (state: RootState) => state.organization.currentOrgUserAccID;
export const currentOrgSelector = (state: RootState) => state.organization.currentOrg;
export const currentOrgMembershipSelector = (state: RootState) => state.organization.currentOrgMembership;
