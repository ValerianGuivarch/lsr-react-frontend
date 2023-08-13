import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Character} from "../../domain/models/Character";
import {CharacterState} from "../../domain/models/CharacterState";
import {CharacterViewModel} from "../../domain/models/CharacterViewModel";

export interface CharacterSliceType {
  loading: boolean;
  characterViewModels: CharacterViewModel[];
}


const initialState: CharacterSliceType = {
  loading: true,
  characterViewModels: []
};
export const charactersSlice = createSlice({
  name: "characterSlice",
  initialState,
  reducers: {
    setCharacters: (currentSlice, action: PayloadAction<Character[]>) => {
      // Créez un objet pour un accès rapide par le nom
      const incomingCharactersMap = action.payload.reduce<{ [key: string]: Character }>((acc, char) => {
        acc[char.name] = char;
        return acc;
      }, {});

      // Mettez à jour ou ajoutez de nouveaux characters
      currentSlice.characterViewModels = currentSlice.characterViewModels.map(vm => {
        if (incomingCharactersMap[vm.character.name]) {
          return {
            ...vm,
            character: incomingCharactersMap[vm.character.name]
          };
        }
        return vm;
      });

      // Ajoutez de nouveaux characters qui n'existent pas encore dans la liste actuelle
      action.payload.forEach(newCharacter => {
        if (!currentSlice.characterViewModels.some(vm => vm.character.name === newCharacter.name)) {
          currentSlice.characterViewModels.push(new CharacterViewModel(newCharacter));
        }
      });

      // Supprimez les characters qui n'existent plus dans la liste entrante
      currentSlice.characterViewModels = currentSlice.characterViewModels.filter(vm => incomingCharactersMap[vm.character.name]);

      currentSlice.loading = false;
    },
    setCharacter: (currentSlice, action: PayloadAction<Character>) => {
      const characterIndex = currentSlice.characterViewModels.findIndex(vm => vm.character.name === action.payload.name);
      if (characterIndex !== -1) {
        // Clone and update the character
        currentSlice.characterViewModels[characterIndex] = {
          ...currentSlice.characterViewModels[characterIndex],
          character: action.payload,
          state: new CharacterState(currentSlice.characterViewModels[characterIndex].state, action.payload)
        };
      }
      currentSlice.loading = false;
    },
    setStateForCharacter: (currentSlice, action: PayloadAction<{ characterName: string, characterState: CharacterState }>) => {
      const characterIndex = currentSlice.characterViewModels.findIndex(vm => vm.character.name === action.payload.characterName);
      if (characterIndex !== -1) {
        // Clone and update the character state
        currentSlice.characterViewModels[characterIndex] = {
          ...currentSlice.characterViewModels[characterIndex],
          state: new CharacterState(action.payload.characterState, currentSlice.characterViewModels[characterIndex].character)
        };
      }
    },
  },
});

export const charactersReducer = charactersSlice.reducer;
export const { setCharacters, setCharacter, setStateForCharacter } = charactersSlice.actions;
