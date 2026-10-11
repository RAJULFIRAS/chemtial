import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isPromoOpen: boolean;
  isVoucherOpen: boolean;
  isBrandOpen: boolean;
}

const initialState: UIState = {
  isPromoOpen: false,
  isVoucherOpen: false,
  isBrandOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openPromo: (state) => {
      state.isPromoOpen = true;
    },
    closePromo: (state) => {
      state.isPromoOpen = false;
    },
    openVoucher: (state) => {
      state.isVoucherOpen = true;
    },
    closeVoucher: (state) => {
      state.isVoucherOpen = false;
    },
    openBrand: (state) => {
      state.isBrandOpen = true;
    },
    closeBrand: (state) => {
      state.isBrandOpen = false;
    },
    togglePromo: (state) => {
      state.isPromoOpen = !state.isPromoOpen;
    },
    toggleVoucher: (state) => {
      state.isVoucherOpen = !state.isVoucherOpen;
    },
    toggleBrand: (state) => {
      state.isBrandOpen = !state.isBrandOpen;
    },
  },
});

export const {
  openPromo,
  closePromo,
  openVoucher,
  closeVoucher,
  openBrand,
  closeBrand,
  togglePromo,
  toggleVoucher,
  toggleBrand,
} = uiSlice.actions;

export default uiSlice.reducer;
