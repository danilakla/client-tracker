import { configureStore } from "@reduxjs/toolkit";
import { rootReducers } from "./reducers";

export const setupStore = () => {
    return configureStore({
        reducer: rootReducers,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware({
            serializableCheck: false,
          }),
      })
};


export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch'];