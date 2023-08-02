import {createSlice} from "@reduxjs/toolkit";
import {Character} from "../../domain/models/Character";

interface CharacterSliceType {
  loading: boolean;
  character?: Character;
}

const initialState: CharacterSliceType = {
  loading: true,
  character: undefined,
};
export const characterSlice = createSlice({
  name: "characterSlice",
  initialState,
  reducers: {
    setCharacter: (currentSlice, action) => {
      currentSlice.loading = false;
      currentSlice.character = action.payload;
    }
  },
});

export const characterReducer = characterSlice.reducer;
export const { setCharacter } =
    characterSlice.actions;
