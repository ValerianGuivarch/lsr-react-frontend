import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {App} from './App';
import { store } from "./data/store";
import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CharacterSelection from "./pages/CharacterSelection/CharacterSelection";
import {CharacterSheet} from "./pages/CharacterSheet/CharacterSheet";
import {CharacterEdition} from "./pages/CharacterEdition/CharacterEdition";
import {MjSheet} from "./pages/MjSheet/MjSheet";
import {CharacterControllingSheet} from "./pages/CharacterSheet/CharacterControllingSheet";

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />}>
                    <Route path="/" element={<CharacterSelection />} />
                    <Route path="/characters/:characterName" element={<CharacterSheet />} />
                    <Route path="/characters/:characterName/invocation" element={<CharacterControllingSheet />} />
                    <Route path="/mj" element={<MjSheet/>} />
                    <Route path="/characters/:characterName/edit" element={<CharacterEdition />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </Provider>
);
