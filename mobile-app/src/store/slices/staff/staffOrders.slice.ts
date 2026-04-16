import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as deliveryService from '../../../services/staff/deliveryService';

interface Order {
  _id: string;
  orderNo: string;
  status: string;
  pickupAddress: string | null;
  deliveryAddress: string | null;
  totalAmount: number;
  weightKg: number | null;
  notes: string | null;
  paymentMethod: string;
  paymentStatus: string;
  riderLatitude: number | null;
  riderLongitude: number | null;
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    telephone: string;
  };
}

interface StaffJob {
  _id: string;
  jobType: 'PICKUP' | 'DELIVERY';
  jobStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  orderId: Order;
  assignedStaffId: string;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

interface StaffOrdersState {
  availablePickups: Order[];
  availableDeliveries: Order[];
  myJobs: StaffJob[];
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: StaffOrdersState = {
  availablePickups: [],
  availableDeliveries: [],
  myJobs: [],
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const fetchAvailablePickups = createAsyncThunk(
  'staffOrders/fetchAvailablePickups',
  async (_: any, thunkAPI: any) => {
    try {
      console.log('fetching pickups...');
      const data = await deliveryService.getAvailablePickups();
      console.log('pickups result:', JSON.stringify(data));
      return data;
    } catch (err: unknown) {
      console.log('pickups error:', JSON.stringify(err));
      const message = err instanceof Error ? err.message : 'Failed to fetch available pickups';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchAvailableDeliveries = createAsyncThunk(
  'staffOrders/fetchAvailableDeliveries',
  async (_: any, thunkAPI: any) => {
    try {
      return await deliveryService.getAvailableDeliveries();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch available deliveries';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchMyJobs = createAsyncThunk(
  'staffOrders/fetchMyJobs',
  async (_: any, thunkAPI: any) => {
    try {
      return await deliveryService.getMyJobs();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch your jobs';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const assignJobThunk = createAsyncThunk(
  'staffOrders/assignJob',
  async (
    { orderId, jobType }: { orderId: string; jobType: 'PICKUP' | 'DELIVERY' },
    thunkAPI: any
  ) => {
    try {
      return await deliveryService.assignJob(orderId, jobType);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to assign job';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateJobStatusThunk = createAsyncThunk(
  'staffOrders/updateJobStatus',
  async (
    { orderId, status }: { orderId: string; status: string },
    thunkAPI: any
  ) => {
    try {
      return await deliveryService.updateJobStatus(orderId, status);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update status';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const staffOrdersSlice = createSlice({
  name: 'staffOrders',
  initialState,
  reducers: {
    clearStaffOrdersError: (state: StaffOrdersState) => {
      state.error = null;
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchAvailablePickups.pending, (state: StaffOrdersState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailablePickups.fulfilled, (state: StaffOrdersState, action: PayloadAction<Order[]>) => {
        state.isLoading = false;
        state.availablePickups = action.payload;
      })
      .addCase(fetchAvailablePickups.rejected, (state: StaffOrdersState, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAvailableDeliveries.pending, (state: StaffOrdersState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableDeliveries.fulfilled, (state: StaffOrdersState, action: PayloadAction<Order[]>) => {
        state.isLoading = false;
        state.availableDeliveries = action.payload;
      })
      .addCase(fetchAvailableDeliveries.rejected, (state: StaffOrdersState, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchMyJobs.pending, (state: StaffOrdersState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state: StaffOrdersState, action: PayloadAction<StaffJob[]>) => {
        state.isLoading = false;
        state.myJobs = action.payload;
      })
      .addCase(fetchMyJobs.rejected, (state: StaffOrdersState, action: PayloadAction<unknown>) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(assignJobThunk.pending, (state: StaffOrdersState) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(assignJobThunk.fulfilled, (state: StaffOrdersState) => {
        state.isUpdating = false;
      })
      .addCase(assignJobThunk.rejected, (state: StaffOrdersState, action: PayloadAction<unknown>) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      .addCase(updateJobStatusThunk.pending, (state: StaffOrdersState) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateJobStatusThunk.fulfilled, (state: StaffOrdersState) => {
        state.isUpdating = false;
      })
      .addCase(updateJobStatusThunk.rejected, (state: StaffOrdersState, action: PayloadAction<unknown>) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStaffOrdersError } = staffOrdersSlice.actions;
export default staffOrdersSlice.reducer;