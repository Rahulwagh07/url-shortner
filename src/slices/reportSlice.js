import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reportGenerated: false,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportGenerated(state, action) {
      state.reportGenerated = action.payload;
    },
  },
});

export const { setReportGenerated } = reportSlice.actions;

export default reportSlice.reducer;
