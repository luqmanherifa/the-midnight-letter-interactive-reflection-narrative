import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storyReducer from "./storySlice";

const persistConfig = {
  key: "midnight-letter",
  storage,
  whitelist: [
    "currentId",
    "personaKey",
    "shadowKey",
    "visitedScreens",
    "language",
    "theme",
  ],
};

const persistedReducer = persistReducer(persistConfig, storyReducer);

export const store = configureStore({
  reducer: {
    story: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
