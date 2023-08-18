import { configureStore } from "@reduxjs/toolkit";
import {rollsReducer, RollsSliceType} from "./rolls-slice";
import {CharacterSliceType, charactersReducer} from "./character-slice";
import {
    CharacterSelectionSliceType,
    charactersSelectionReducer
} from "../../pages/CharacterSelection/CharacterSelectionSlice";

export const store = configureStore({
    reducer: {
        CHARACTERS: charactersReducer,
        ROLLS: rollsReducer,
        CHARACTER_SELECTION: charactersSelectionReducer,
    },
});

export interface RootState {
    CHARACTERS: CharacterSliceType;
    ROLLS: RollsSliceType;
    CHARACTER_SELECTION: CharacterSelectionSliceType;
}