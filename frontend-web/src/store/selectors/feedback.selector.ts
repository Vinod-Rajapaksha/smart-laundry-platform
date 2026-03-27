import type { RootState } from "../store";

export const selectFeedbackState = (state: RootState) => state.feedback;

export const selectFeedbackItems = (state: RootState) => state.feedback.items;
export const selectFeedbackPagination = (state: RootState) => state.feedback.pagination;
export const selectFeedbackStats = (state: RootState) => state.feedback.stats;
export const selectFeedbackFilters = (state: RootState) => state.feedback.filters;
export const selectFeedbackLoadingList = (state: RootState) => state.feedback.loadingList;
export const selectFeedbackLoadingStats = (state: RootState) => state.feedback.loadingStats;
export const selectFeedbackLoadingDetails = (state: RootState) => state.feedback.loadingDetails;
export const selectFeedbackSelected = (state: RootState) => state.feedback.selectedFeedback;
export const selectFeedbackUpdatingStatusId = (state: RootState) => state.feedback.updatingStatusId;