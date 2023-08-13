import { configureStore } from "@reduxjs/toolkit";
import {previewPjsReducer, PreviewPjsSliceType} from "./preview-pjs-slice";
import {rollsReducer, RollsSliceType} from "./rolls-slice";
import {CharacterSliceType, charactersReducer} from "./character-slice";

export const store = configureStore({
    reducer: {
        PREVIEW_PJS: previewPjsReducer,
        CHARACTERS: charactersReducer,
        ROLLS: rollsReducer,
    },
});

export interface RootState {
    PREVIEW_PJS: PreviewPjsSliceType;
    CHARACTERS: CharacterSliceType;
    ROLLS: RollsSliceType;
}