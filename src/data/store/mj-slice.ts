import {createSlice} from "@reduxjs/toolkit";
import {Character} from "../../domain/models/Character";
import {MjState} from "../../domain/models/MjState";
import {CharacterViewModel} from "../../domain/models/CharacterViewModel";

interface MjSliceType {
  loading: boolean;
  session: CharacterViewModel[];
  state: MjState;
}


const initialState: MjSliceType = {
  loading: true,
  session: [],
  state: new MjState()
};

export const mjSlice = createSlice({
  name: "mjSlice",
  initialState,
  reducers: {
    setCharacters: (currentSlice, action) => {
        currentSlice.session = action.payload.map((character: Character) => new CharacterViewModel(character));
      currentSlice.loading = false;
    },
    setState: (currentSlice, action) => {
        currentSlice.state = new MjState(currentSlice.state, action.payload)
    }
  },
});

export const mjReducer = mjSlice.reducer;
export const { setCharacters, setState } =
    mjSlice.actions;
