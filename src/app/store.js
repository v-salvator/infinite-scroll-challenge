import { configureStore } from "@reduxjs/toolkit";
import repoReducer from "./repoSlice";

export default configureStore({
  reducer: {
    repo: repoReducer,
  },
});
