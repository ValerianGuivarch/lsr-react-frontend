import axios from "axios";
import config from "../../config/config";
import { CharacterRaw } from "./CharacterRaw";
import { CharacterPreviewRaw } from "./CharacterPreviewRaw";
import { Character } from "../../domain/models/Character";
import { CharacterUpdateRequest } from "./CharacterUpdateRequest";
import { RollRaw } from "./RollRaw";
import { Roll } from "../../domain/models/Roll";
import { CharacterPreview } from "../../domain/models/CharacterPreview";
import { SkillRaw } from "./SkillRaw";

export class L7RApi {
  static async sendNewTurn(): Promise<void> {
    await axios.put(`${config.BASE_URL}/mj/newTurn`);
  }
  static async resetRolls(): Promise<void> {
    await axios.delete(`${config.BASE_URL}/rolls`);
  }
  static async getCharactersPreview(): Promise<CharacterPreviewRaw[]> {
    const response = await axios.get(`${config.BASE_URL}/characters`);
    return response.data;
  }

  static async updateRoll(p: {
    id: string;
    healPoint?: number;
    success?: number;
  }): Promise<void> {
    await axios.put(`${config.BASE_URL}/rolls/` + p.id, {
      healPoint: p.healPoint,
      success: p.success,
    });
  }
  static async getCharacterByName(
    characterName: string,
  ): Promise<CharacterRaw> {
    try {
      const response = await axios.get(
        `${config.BASE_URL}/characters/` + characterName,
      );
      return response.data;
    } catch (e: any) {
      console.log(e);
      throw e;
    }
  }

  static async updateCharacter(
    characterName: string,
    characterUpdateRequest: CharacterUpdateRequest,
  ): Promise<CharacterRaw> {
    console.log(characterName);
    console.log(characterUpdateRequest);
    const response = await axios.put(
      `${config.BASE_URL}/characters/` + characterName,
      characterUpdateRequest,
    );
    return response.data;
  }

  static async rest(characterName: string) {
    await axios.put(`${config.BASE_URL}/characters/` + characterName + "/rest");
  }

  static async getSessionCharacter(): Promise<CharacterPreviewRaw[]> {
    const response = await axios.get(
      `${config.BASE_URL}/characters/characters-session`,
    );
    return response.data;
  }

  static async getMjSessionCharacter(): Promise<CharacterRaw[]> {
    const response = await axios.get(
      `${config.BASE_URL}/mj/characters-session`,
    );
    return response.data;
  }

  static async getControlledCharacters(
    characterName: string,
  ): Promise<CharacterRaw[]> {
    const response = await axios.get(
      `${config.BASE_URL}/characters/` +
        characterName +
        `/characters-controller`,
    );
    return response.data;
  }

  static async getRolls(name: string): Promise<RollRaw[]> {
    const response = await axios.get(`${config.BASE_URL}/rolls/${name}`);
    return response.data as RollRaw[];
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
  }): Promise<void> {
    await axios.post(`${config.BASE_URL}/rolls`, {
      skillId: "" + p.skillId,
      rollerName: p.characterName,
      focus: p.focus,
      power: p.power,
      proficiency: p.proficiency,
      secret: p.secret,
      bonus: p.bonus,
      malus: p.malus,
      empiriqueRoll: p.empiriqueRoll,
      resistRoll: p.resistRoll ? "" + p.resistRoll : undefined,
    });
  }

  static async deleteCharacter(
    controllerName: string,
    characterToDeleteName: string,
  ) {
    await axios.delete(
      `${config.BASE_URL}/characters/` +
        controllerName +
        `/characters-controller/` +
        characterToDeleteName,
    );
  }

  static async updateCharacterSkillsAttribution(
    characterName: string,
    skillId: string,
    dailyUse: number,
    dailyUseMax: number | undefined,
    affected: boolean,
  ): Promise<void> {
    await axios.put(
      `${config.BASE_URL}/characters/` + characterName + `/skills`,
      {
        skillId: skillId,
        dailyUse: dailyUse,
        dailyUseMax: dailyUseMax,
        affected: affected,
      },
    );
  }

  static async getArcanePrimes(name: string): Promise<SkillRaw[]> {
    const response = await axios.get(
      `${config.BASE_URL}/characters/${name}/arcane-primes`,
    );
    return response.data;
  }
}
