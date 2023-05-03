import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import { setDispatcher } from "./dispatcher";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

setDispatcher(store.dispatch);
