import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import { store } from "./data/store";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CharacterSelection from "./pages/CharacterSelection/CharacterSelection";
import {CharacterSheet} from "./pages/CharacterSheet/CharacterSheet";

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/" element={<CharacterSelection />} />
                    <Route path="/characters/:characterName" element={<CharacterSheet />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);
