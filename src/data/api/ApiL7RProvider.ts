import { Roll } from "../../domain/models/Roll";
import { L7RApi } from "./L7RApi";
import { RollRaw } from "./RollRaw";
import { CharacterPreviewRaw } from "./CharacterPreviewRaw";
import { CharacterPreview } from "../../domain/models/CharacterPreview";
import { Character } from "../../domain/models/Character";
import { CharacterUpdateRequest } from "./CharacterUpdateRequest";
import { CharacterRaw } from "./CharacterRaw";
import { Skill } from "../../domain/models/Skill";

export interface ApiResponse {
  error: boolean;
  message: string;
}
export class ApiL7RProvider {
  static async getCharactersByCategory(): Promise<{
    pnj: string[];
    pj: string[];
  }> {
    const response = await L7RApi.getCharactersPreview();
    const pj = response
      .filter((character) => {
        return character.playerName !== "";
      })
      .map((character) => {
        return character.name;
      });
    const pnj = response
      .filter((character) => {
        return character.playerName === "";
      })
      .map((character) => {
        return character.name;
      });
    return {
      pj: pj,
      pnj: pnj,
    };
  }

  static async sendNewTurn(): Promise<void> {
    await L7RApi.sendNewTurn();
  }
  static async resetRolls(): Promise<void> {
    await L7RApi.resetRolls();
  }
  static async sendRoll(p: {
    skillId: string;
    characterName: string;
    focus: boolean;
    power: boolean;
    proficiency: boolean;
    secret: boolean;
    bonus: number;
    malus: number;
    resistRoll?: string;
    empiriqueRoll?: string;
  }): Promise<ApiResponse> {
    try {
      await L7RApi.sendRoll(p);
      return {
        error: false,
        message: "Roll sent",
      };
    } catch (e: any) {
      return {
        error: true,
        message: e.response.data.message,
      };
    }
  }
  static async getRolls(name: string): Promise<Roll[]> {
    const response = await L7RApi.getRolls(name);
    return response.map((roll: RollRaw) => {
      return new Roll(roll);
    });
  }

  static async getCharactersPreview(): Promise<CharacterPreview[]> {
    const response = await L7RApi.getCharactersPreview();
    return response.map((characterPreview: CharacterPreviewRaw) => {
      return new CharacterPreview(characterPreview);
    });
  }

  static async getCharacterByName(characterName: string): Promise<Character> {
    const response = await L7RApi.getCharacterByName(characterName);
    return new Character(response);
  }

  static async updateCharacter(character: Character): Promise<Character> {
    const characterUpdateRequest = new CharacterUpdateRequest(character);
    const response = await L7RApi.updateCharacter(
      character.name,
      characterUpdateRequest,
    );
    return new Character(response);
  }

  static async updateRoll(p: {
    id: string;
    healPoint?: number;
    success?: number;
  }): Promise<void> {
    await L7RApi.updateRoll(p);
  }
  static async rest(characterName: string): Promise<void> {
    await L7RApi.rest(characterName);
  }

  static async getSessionCharacters(): Promise<CharacterPreview[]> {
    const response = await L7RApi.getSessionCharacter();
    return response.map((character: CharacterPreviewRaw) => {
      return new CharacterPreview(character);
    });
  }

  static async getMjSessionCharacter(): Promise<Character[]> {
    const response = await L7RApi.getMjSessionCharacter();
    return response.map((character: CharacterRaw) => {
      return new Character(character);
    });
  }

  static async getControlledCharacters(
    characterName: string,
  ): Promise<Character[]> {
    const response = await L7RApi.getControlledCharacters(characterName);
    return response.map((character: CharacterRaw) => {
      return new Character(character);
    });
  }

  static async deleteCharacter(
    controllerName: string,
    characterToDeleteName: string,
  ) {
    await L7RApi.deleteCharacter(controllerName, characterToDeleteName);
  }

  static async updateCharacterSkillsAttribution(
    characterName: string,
    skillName: string,
    dailyUse: number,
  ): Promise<void> {
    await L7RApi.updateCharacterSkillsAttribution(
      characterName,
      skillName,
      dailyUse,
    );
  }
}
