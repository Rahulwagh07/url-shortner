import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reportGenerated: localStorage.getItem('reportGenerated') || false,
  reportGenerating: localStorage.getItem('reportGenerating') || false,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    setReportGenerated(state, action) {
      state.reportGenerated = action.payload;
    },
    setReportGenerating(state, action){
      state.reportGenerating = action.payload;
    }
  },
});

export const { setReportGenerated, setReportGenerating } = reportSlice.actions;

export default reportSlice.reducer;
