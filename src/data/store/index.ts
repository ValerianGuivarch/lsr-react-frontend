import { configureStore } from "@reduxjs/toolkit";
import { previewPjsReducer } from "./preview-pjs-slice";
import {characterReducer} from "./character-slice";

export const store = configureStore({
    reducer: {
        PREVIEW_PJS: previewPjsReducer,
        CHARACTER: characterReducer,
    },
});
