import { combineReducers } from "@reduxjs/toolkit";

import auth from "./slices/auth.slice";
import { feedbackReducer } from "./slices/feedback.slice";

const rootReducer = combineReducers({
    auth,
    feedback: feedbackReducer,
});

export default rootReducer;
