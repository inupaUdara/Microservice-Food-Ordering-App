import { combineReducers, configureStore } from '@reduxjs/toolkit';
import themeConfigSlice from './themeConfigSlice';
import userConfigSlice from './userConfigSlice';
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    themeConfig: themeConfigSlice,
    userConfig: userConfigSlice,
});
const persistConfig = {
    key: 'root',
    storage,
    version: 1,
  };

  const persistedReducer = persistReducer(persistConfig, rootReducer);
  export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  })

  export const persistor = persistStore(store);

export type IRootState = ReturnType<typeof persistedReducer>;
