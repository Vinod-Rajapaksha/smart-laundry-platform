import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import reservationReducer from "./slices/customer/reservation.slice";
import notificationReducer from "./slices/customer/notification.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  reservation: reservationReducer,
  notifications: notificationReducer,
});

export default rootReducer;
