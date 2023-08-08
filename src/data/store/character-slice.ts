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
      console.log('setCharacter 1')
      currentSlice.character = new Character(action.payload);
        console.log('setCharacter 2')
      currentSlice.loading = false;
    },
    setState: (currentSlice, action) => {
        currentSlice.state = new CharacterState(action.payload, currentSlice.character)
    }
  },
});

export const characterReducer = characterSlice.reducer;
export const { setCharacter, setState } =
    characterSlice.actions;
