import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { store } from "./data/store";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CharacterSelection from "./pages/CharacterSelection/CharacterSelection";
import { CharacterSheet } from "./pages/CharacterSheet/CharacterSheet";
import { CharacterEdition } from "./pages/CharacterEdition/CharacterEdition";
import { MjSheet } from "./pages/MjSheet/MjSheet";
import { CharacterControllingSheet } from "./pages/CharacterPanelSheet/CharacterControllingSheet";
import { CharacterMunitionsSheet } from "./pages/CharacterSheet/CharacterMunitionsSheet";
import { CharacterCartouchesSheet } from "./pages/CharacterSheet/CharacterCartoucheSheet";
import { ArcanePrimesSheet } from "./pages/CharacterSheet/ArcanePrimesSheet";
import DateTool from "./pages/CharacterSelection/DateTool";
import Diary from "./components/Diary";

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<CharacterSelection />} />
          <Route path="/diary" element={<Diary />} />
          <Route
            path="/characters/:characterName"
            element={<CharacterSheet />}
          />
          <Route path="/date" element={<DateTool />} />
          <Route
            path="/characters/:characterName/invocation"
            element={<CharacterControllingSheet />}
          />
          <Route
            path="/characters/:characterName/arcane-primes"
            element={<ArcanePrimesSheet />}
          />
          <Route
            path="/characters/:characterName/munitions"
            element={<CharacterMunitionsSheet />}
          />
          <Route
            path="/characters/:characterName/cartouches"
            element={<CharacterCartouchesSheet />}
          />
          <Route path="/mj" element={<MjSheet />} />
          <Route
            path="/characters/:characterName/edit"
            element={<CharacterEdition />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
);
