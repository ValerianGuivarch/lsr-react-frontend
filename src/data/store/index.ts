import { configureStore } from "@reduxjs/toolkit";
import { previewPjsReducer } from "./preview-pjs-slice";
import {characterReducer} from "./character-slice";
import {rollsReducer} from "./rolls-slice";
import {mjReducer} from "./mj-slice";

export const store = configureStore({
    reducer: {
        PREVIEW_PJS: previewPjsReducer,
        CHARACTER: characterReducer,
        ROLLS: rollsReducer,
        MJ: mjReducer,
    },
});