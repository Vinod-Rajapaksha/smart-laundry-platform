import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import reservationReducer from "./slices/customer/reservation.slice";

const rootReducer = combineReducers({
  auth: authReducer,
  reservation: reservationReducer,
});

export default rootReducer;
