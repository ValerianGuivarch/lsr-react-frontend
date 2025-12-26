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
import { SpeakingSheet } from "./pages/CharacterSheet/SpeakingSheet";
import { WizardSheet } from "./pages/Hp/WizardSheet";
import { WizardFormCreate } from "./pages/Hp/WizardFormCreate";
import { WizardFormUpdate } from "./pages/Hp/WizardFormUpdate";
import { SpellForm } from "./pages/Hp/SpellForm";
import StoreControl from "./components/Store";
import WeddingP from "./wedding-photos/WeddingP";
import WeddingWallSlideshow from "./wedding-photos/WeddingWallSlideshow";

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<CharacterSelection />} />
          <Route path="/p" element={<WeddingP />} />
          <Route path="/wall" element={<WeddingWallSlideshow />} />
          <Route path="/hp/:wizardName" element={<WizardSheet />} />
          <Route path="/hp/create" element={<WizardFormCreate />} />
          <Route path="/hp/spell" element={<SpellForm />} />
          <Route path="/hp/update/:wizardName" element={<WizardFormUpdate />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/stores" element={<StoreControl />} />
          <Route
            path="/characters/:characterName"
            element={<CharacterSheet />}
          />
          <Route path="/speaking" element={<SpeakingSheet />} />
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
