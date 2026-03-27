import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { feedbackApi } from "../../features/feedback/api/feedback.api";
import { FEEDBACK_STATUS, type FeedbackStatus } from "../../types/enums";
import type {
  FeedbackItem,
  FeedbackListQuery,
  FeedbackListResponse,
  FeedbackPagination,
  FeedbackState,
  FeedbackStats,
} from "../../features/feedback/types";

const initialPagination: FeedbackPagination = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
};

const initialState: FeedbackState = {
  items: [],
  pagination: initialPagination,
  stats: null,
  selectedFeedback: null,
  loadingList: false,
  loadingStats: false,
  loadingDetails: false,
  updatingStatusId: null,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    status: "",
    hasSuggestions: false,
  },
};

export const fetchFeedbacks = createAsyncThunk<
  FeedbackListResponse,
  FeedbackListQuery,
  { rejectValue: string }
>("feedback/fetchFeedbacks", async (params, { rejectWithValue }) => {
  try {
    return await feedbackApi.getFeedbacks(params);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to load feedbacks"
    );
  }
});

export const fetchFeedbackStats = createAsyncThunk<
  FeedbackStats,
  void,
  { rejectValue: string }
>("feedback/fetchFeedbackStats", async (_, { rejectWithValue }) => {
  try {
    return await feedbackApi.getFeedbackStats();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to load feedback stats"
    );
  }
});

export const fetchFeedbackById = createAsyncThunk<
  FeedbackItem,
  string,
  { rejectValue: string }
>("feedback/fetchFeedbackById", async (id, { rejectWithValue }) => {
  try {
    return await feedbackApi.getFeedbackById(id);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to load feedback details"
    );
  }
});

export const patchFeedbackStatus = createAsyncThunk<
  FeedbackItem,
  { id: string; status: FeedbackStatus },
  { rejectValue: string }
>("feedback/patchFeedbackStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await feedbackApi.updateFeedbackStatus(id, status);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to update feedback status"
    );
  }
});

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedbackPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    setFeedbackStatusFilter(state, action: PayloadAction<FeedbackStatus | "">) {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setFeedbackSuggestionsFilter(state, action: PayloadAction<boolean>) {
      state.filters.hasSuggestions = action.payload;
      state.filters.page = 1;
    },
    resetFeedbackFilters(state) {
      state.filters = {
        page: 1,
        limit: 10,
        status: "",
        hasSuggestions: false,
      };
    },
    clearSelectedFeedback(state) {
      state.selectedFeedback = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loadingList = false;
        state.items = action.payload.feedbacks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload ?? "Failed to load feedbacks";
      })

      .addCase(fetchFeedbackStats.pending, (state) => {
        state.loadingStats = true;
      })
      .addCase(fetchFeedbackStats.fulfilled, (state, action) => {
        state.loadingStats = false;
        state.stats = action.payload;
      })
      .addCase(fetchFeedbackStats.rejected, (state, action) => {
        state.loadingStats = false;
        state.error = action.payload ?? "Failed to load feedback stats";
      })

      .addCase(fetchFeedbackById.pending, (state) => {
        state.loadingDetails = true;
      })
      .addCase(fetchFeedbackById.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.selectedFeedback = action.payload;
      })
      .addCase(fetchFeedbackById.rejected, (state, action) => {
        state.loadingDetails = false;
        state.error = action.payload ?? "Failed to load feedback details";
        toast.error(action.payload ?? "Failed to load feedback details");
      })

      .addCase(patchFeedbackStatus.pending, (state, action) => {
        state.updatingStatusId = action.meta.arg.id;
      })
      .addCase(patchFeedbackStatus.fulfilled, (state, action) => {
        state.updatingStatusId = null;

        const updated = action.payload;

        state.items = state.items.map((item) =>
          item._id === updated._id ? updated : item
        );

        if (state.selectedFeedback?._id === updated._id) {
          state.selectedFeedback = updated;
        }

        toast.success("Feedback status updated successfully");
      })
      .addCase(patchFeedbackStatus.rejected, (state, action) => {
        state.updatingStatusId = null;
        toast.error(action.payload ?? "Failed to update feedback status");
      });
  },
});

export const {
  setFeedbackPage,
  setFeedbackStatusFilter,
  setFeedbackSuggestionsFilter,
  resetFeedbackFilters,
  clearSelectedFeedback,
} = feedbackSlice.actions;

export const feedbackReducer = feedbackSlice.reducer;

export const FEEDBACK_STATUS_OPTIONS: Array<{
  label: string;
  value: FeedbackStatus | "";
}> = [
  { label: "All Feedbacks", value: "" },
  { label: "Pending", value: FEEDBACK_STATUS.PENDING },
  { label: "Approved", value: FEEDBACK_STATUS.APPROVED },
  { label: "Rejected", value: FEEDBACK_STATUS.REJECTED },
];