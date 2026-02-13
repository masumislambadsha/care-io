import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./slices/bookingSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    booking: bookingReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
