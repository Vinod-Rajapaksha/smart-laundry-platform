import { combineReducers } from "@reduxjs/toolkit";

import auth from "./slices/auth.slice";

const rootReducer = combineReducers({
    auth,
});

export default rootReducer;
