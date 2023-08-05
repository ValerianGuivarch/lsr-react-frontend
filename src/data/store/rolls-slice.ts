import {createSlice} from "@reduxjs/toolkit";
import {Roll} from "../../domain/models/Roll";

interface RollsSliceType {
  loading: boolean;
  rolls: Roll[];
}

const initialState: RollsSliceType = {
  loading: true,
  rolls: [],
};
export const rollsSlice = createSlice({
  name: "rollsSlice",
  initialState,
  reducers: {
    setRolls: (currentSlice, action) => {
      currentSlice.loading = false;
      currentSlice.rolls = action.payload;
    }
  },
});

export const rollsReducer = rollsSlice.reducer;
export const { setRolls } =
    rollsSlice.actions;
