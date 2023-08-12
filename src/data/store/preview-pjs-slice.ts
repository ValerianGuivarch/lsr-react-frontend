import {createSlice} from "@reduxjs/toolkit";
import {CharacterPreviewRaw} from "../api/CharacterPreviewRaw";

interface PreviewPjsSliceType {
  previewPjsList: CharacterPreviewRaw[];
}

const initialState: PreviewPjsSliceType = {
  previewPjsList: [],
};
export const previewPjsSlice = createSlice({
  name: "previewPjsSlice",
  initialState,
  reducers: {
    setPreviewPjsList: (currentSlice, action) => {
      currentSlice.previewPjsList = action.payload;
    }
  },
});

export const previewPjsReducer = previewPjsSlice.reducer;
export const { setPreviewPjsList } =
    previewPjsSlice.actions;
