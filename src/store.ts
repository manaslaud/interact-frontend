import { combineReducers, configureStore } from '@reduxjs/toolkit';
import feedReducer from '@/slices/feedSlice';
import userReducer from '@/slices/userSlice';
import messagingReducer from '@/slices/messagingSlice';
import configReducer from './slices/configSlice';
import storage from 'redux-persist/lib/storage';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', 'config'],
};

const rootReducer = combineReducers({
  feed: feedReducer,
  user: userReducer,
  messaging: messagingReducer,
  config: configReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV == 'development',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
