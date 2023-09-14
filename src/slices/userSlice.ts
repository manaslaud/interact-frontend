import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { OpeningBookmark, PostBookmark, ProjectBookmark, User } from '@/types';

export interface ChatSlice {
  userID: string;
  chatID: string;
}
interface UserState {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNo: string;
  following: string[];
  likes: string[];
  postBookmarks: PostBookmark[];
  projectBookmarks: ProjectBookmark[];
  openingBookmarks: OpeningBookmark[];
  memberProjects: string[];
  editorProjects: string[];
  managerProjects: string[];
  applications: string[];
  chats: string[];
  personalChatSlices: ChatSlice[];
  profilePic: string;
  isLoggedIn: boolean;
  isVerified: boolean;
}

const initialState: UserState = {
  id: '',
  name: '',
  username: '',
  email: '',
  phoneNo: '',
  isLoggedIn: false,
  profilePic: '',
  following: [],
  likes: [],
  postBookmarks: [],
  projectBookmarks: [],
  openingBookmarks: [],
  chats: [],
  personalChatSlices: [],
  memberProjects: [],
  editorProjects: [],
  managerProjects: [],
  applications: [],
  isVerified: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.profilePic = action.payload.profilePic;
      state.isLoggedIn = true;
      state.phoneNo = action.payload.phoneNo;
      state.isVerified = action.payload.isVerified;
      state.chats = [];
      state.personalChatSlices = [];
      state.memberProjects = [];
      state.editorProjects = [];
      state.managerProjects = [];
      state.applications = [];
      state.following = [];
      state.likes = [];
      state.postBookmarks = [];
      state.projectBookmarks = [];
      state.openingBookmarks = [];
    },
    setReduxName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setProfilePic: (state, action: PayloadAction<string>) => {
      state.profilePic = action.payload;
    },
    setFollowing: (state, action: PayloadAction<string[]>) => {
      state.following = action.payload;
    },
    setLikes: (state, action: PayloadAction<string[]>) => {
      state.likes = action.payload;
    },
    setPostBookmarks: (state, action: PayloadAction<PostBookmark[]>) => {
      state.postBookmarks = action.payload;
    },
    setProjectBookmarks: (state, action: PayloadAction<ProjectBookmark[]>) => {
      state.projectBookmarks = action.payload;
    },
    setOpeningBookmarks: (state, action: PayloadAction<OpeningBookmark[]>) => {
      state.openingBookmarks = action.payload;
    },
    setChats: (state, action: PayloadAction<string[]>) => {
      state.chats = action.payload;
    },
    addToChats: (state, action: PayloadAction<string>) => {
      state.chats = [...state.chats, action.payload];
    },
    setPersonalChatSlices: (state, action: PayloadAction<ChatSlice[]>) => {
      state.personalChatSlices = action.payload;
    },
    setMemberProjects: (state, action: PayloadAction<string[]>) => {
      state.memberProjects = action.payload;
    },
    setEditorProjects: (state, action: PayloadAction<string[]>) => {
      state.editorProjects = action.payload;
    },
    setManagerProjects: (state, action: PayloadAction<string[]>) => {
      state.managerProjects = action.payload;
    },
    setApplications: (state, action: PayloadAction<string[]>) => {
      state.applications = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNo = action.payload;
    },
    setVerificationStatus: (state, action: PayloadAction<boolean>) => {
      state.isVerified = action.payload;
    },
  },
});

export const {
  setUser,
  setReduxName,
  setProfilePic,
  setFollowing,
  setLikes,
  setPostBookmarks,
  setProjectBookmarks,
  setOpeningBookmarks,
  setChats,
  addToChats,
  setPersonalChatSlices,
  setMemberProjects,
  setEditorProjects,
  setManagerProjects,
  setApplications,
  setEmail,
  setPhoneNumber,
  setVerificationStatus,
} = userSlice.actions;

export default userSlice.reducer;

export const userSelector = (state: RootState) => state.user;

export const userIDSelector = (state: RootState) => state.user.id;

export const profilePicSelector = (state: RootState) => state.user.profilePic;
