import { createSlice } from "@reduxjs/toolkit";

import type { Company } from "./types";

interface CompanyState {
  selectedCompany: Company | null;
  companies: Company[];
}

const initialState: CompanyState = {
  selectedCompany: null,
  companies: [],
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
    clearSelectedCompany: (state) => {
      state.selectedCompany = null;
    },
    clearSelectedTrade: (state) => {
      return state;
    }
  },
});


export const { setSelectedCompany, clearSelectedCompany, clearSelectedTrade } = companySlice.actions;
export default companySlice.reducer;
