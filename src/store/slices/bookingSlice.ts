import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BookingState {
  serviceId: string | null;
  caregiverId: string | null;
  startDate: string | null;
  endDate: string | null;
  durationType: string | null;
  durationValue: number | null;
  division: string | null;
  district: string | null;
  city: string | null;
  area: string | null;
  address: string | null;
  specialInstructions: string | null;
  totalAmount: number | null;
}

const initialState: BookingState = {
  serviceId: null,
  caregiverId: null,
  startDate: null,
  endDate: null,
  durationType: null,
  durationValue: null,
  division: null,
  district: null,
  city: null,
  area: null,
  address: null,
  specialInstructions: null,
  totalAmount: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingData: (state, action: PayloadAction<Partial<BookingState>>) => {
      return { ...state, ...action.payload };
    },
    clearBookingData: () => initialState,
  },
});

export const { setBookingData, clearBookingData } = bookingSlice.actions;
export default bookingSlice.reducer;
