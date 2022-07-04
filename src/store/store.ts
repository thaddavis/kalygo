import { configureStore } from "@reduxjs/toolkit";

import counterReducer from "./counters/counterSlice";
import settingsReducer from "./settings/settingsSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingsReducer,
    // comments: commentsReducer,
    // users: usersReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
