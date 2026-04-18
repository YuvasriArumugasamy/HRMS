import { createSlice } from "@reduxjs/toolkit";

interface MasterDataState {
  employees: any[];
  contactCategories: any[];
  loading: boolean;
}

const initialState: MasterDataState = {
  employees: [],
  contactCategories: [],
  loading: false,
};



const masterDataSlice = createSlice({
  name: "masterData",
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
  },
});

export const { setEmployees } = masterDataSlice.actions;
export const fetchMasterDataEmployees = () => async () => {
  // Placeholder fetch
};
export default masterDataSlice.reducer;
