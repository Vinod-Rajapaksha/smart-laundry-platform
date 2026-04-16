import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import staffOrdersReducer from './slices/staff/staffOrders.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  staffOrders: staffOrdersReducer,
});

export default rootReducer;
