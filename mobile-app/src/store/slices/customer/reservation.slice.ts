import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReservationState, ReservationOption } from '../../../types/reservation.types';

const initialState: ReservationState = {
  serviceMode: null,
  serviceId: null,
  selectedOptions: [],
  scheduledDate: null,
  pickupAddress: null,
  deliveryAddress: null,
  pickupLat: null,
  pickupLng: null,
  deliveryLat: null,
  deliveryLng: null,
  weightKg: 0,
  notes: null,
  paymentMethod: 'COD',
  currentStep: 1,
  isSubmitting: false,
  error: null,
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setServiceMode: (state, action: PayloadAction<'PICKUP_DELIVERY' | 'SELF_SERVICE'>) => {
      state.serviceMode = action.payload;
    },
    setServiceId: (state, action: PayloadAction<string>) => {
      state.serviceId = action.payload;
    },
    toggleOption: (state, action: PayloadAction<ReservationOption>) => {
      const option = action.payload;
      const index = state.selectedOptions.findIndex(o => o.inventoryId === option.inventoryId);
      
      if (index !== -1) {
        state.selectedOptions.splice(index, 1);
      } else {
        // Multi-select for AddOns, single-select for others
        if (option.categoryName !== 'AddOns') {
          state.selectedOptions = state.selectedOptions.filter(o => o.categoryName !== option.categoryName);
        }
        state.selectedOptions.push(option);
      }
    },
    setSchedule: (state, action: PayloadAction<string>) => {
      state.scheduledDate = action.payload;
    },
    setAddress: (state, action: PayloadAction<{ 
      pickup?: string; 
      delivery?: string;
      pickupLat?: number | null;
      pickupLng?: number | null;
      deliveryLat?: number | null;
      deliveryLng?: number | null;
    }>) => {
      if (action.payload.pickup !== undefined) state.pickupAddress = action.payload.pickup;
      if (action.payload.delivery !== undefined) state.deliveryAddress = action.payload.delivery;
      if (action.payload.pickupLat !== undefined) state.pickupLat = action.payload.pickupLat;
      if (action.payload.pickupLng !== undefined) state.pickupLng = action.payload.pickupLng;
      if (action.payload.deliveryLat !== undefined) state.deliveryLat = action.payload.deliveryLat;
      if (action.payload.deliveryLng !== undefined) state.deliveryLng = action.payload.deliveryLng;
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<'COD' | 'CARD' | 'BANK_TRANSFER'>) => {
      state.paymentMethod = action.payload;
    },
    setWeightKg: (state, action: PayloadAction<number>) => {
      state.weightKg = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      state.currentStep = Math.max(1, state.currentStep - 1);
    },
    resetReservation: (state) => {
      return initialState;
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setServiceMode,
  setServiceId,
  toggleOption,
  setSchedule,
  setAddress,
  setNotes,
  setPaymentMethod,
  setWeightKg,
  nextStep,
  prevStep,
  resetReservation,
  setSubmitting,
  setError,
} = reservationSlice.actions;

export default reservationSlice.reducer;
