import { RootState } from '@/store';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface MessagingState {
  currentChatID: string;
}

const initialState: MessagingState = {
  currentChatID: '',
};

export const messagingSlice = createSlice({
  name: 'messaging',
  initialState,
  reducers: {
    setCurrentChatID: (state, action: PayloadAction<string>) => {
      state.currentChatID = action.payload;
    },
  },
});

export const { setCurrentChatID } = messagingSlice.actions;

export default messagingSlice.reducer;

export const currentChatIDSelector = (state: RootState) => state.messaging.currentChatID;
