import {createSlice} from "@reduxjs/toolkit";
import {Character} from "../../domain/models/Character";
import {CharacterState} from "../../domain/models/CharacterState";

interface CharacterSliceType {
  loading: boolean;
  character?: Character;
  state: CharacterState;
}


const initialState: CharacterSliceType = {
  loading: true,
  character: undefined,
  state: new CharacterState(),
};
export const characterSlice = createSlice({
  name: "characterSlice",
  initialState,
  reducers: {
    setCharacter: (currentSlice, action) => {
      currentSlice.character = new Character(action.payload);
      currentSlice.loading = false;
    },
    setState: (currentSlice, action) => {
        currentSlice.state = new CharacterState(action.payload);
    }
  },
});

export const characterReducer = characterSlice.reducer;
export const { setCharacter, setState } =
    characterSlice.actions;
