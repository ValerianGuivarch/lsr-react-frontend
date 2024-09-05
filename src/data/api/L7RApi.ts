import axios from "axios";
import config from "../../config/config";
import { CharacterRaw } from "./CharacterRaw";
import { CharacterPreviewRaw } from "./CharacterPreviewRaw";
import { CharacterUpdateRequest } from "./CharacterUpdateRequest";
import { RollRaw } from "./RollRaw";
import { SkillRaw } from "./SkillRaw";
import { WizardRaw } from "./WizardRaw";
import { FlipRaw } from "./FlipRaw";
import { Wizard } from "../../domain/models/Wizard";
import { WizardStatRaw } from "./WizardStatRaw";
import { StatRaw } from "./StatRaw";
import { KnowledgeRaw } from "./KnowledgeRaw";
import { Category } from "../../domain/models/Category";
import { SchoolCategory } from "../../domain/models/SchoolCategory";
import { SpellRaw } from "./SpellRaw";
import { Difficulty } from "../../domain/models/Difficulty";

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
    dailyUse: number | undefined,
    dailyUseMax: number | undefined,
    affected: boolean,
    arcaneDetteToDecrease: number | undefined,
  ): Promise<void> {
    await axios.put(
      `${config.BASE_URL}/characters/` + characterName + `/skills`,
      {
        skillId: skillId,
        dailyUse: dailyUse,
        dailyUseMax: dailyUseMax,
        affected: affected,
        arcaneDetteToDecrease: arcaneDetteToDecrease,
      },
    );
  }

  static async getArcanePrimes(name: string): Promise<SkillRaw[]> {
    const response = await axios.get(
      `${config.BASE_URL}/characters/${name}/arcane-primes`,
    );
    return response.data;
  }

  static async getSpeaking(): Promise<string> {
    const response = await axios.get(`${config.BASE_URL}/characters/speaking`);
    return response.data;
  }

  static async putSpeaking(characterName: string): Promise<string> {
    const response = await axios.put(
      `${config.BASE_URL}/mj/speaking/${characterName}`,
    );
    return response.data;
  }

  static async getWizardByName(name: string): Promise<WizardRaw> {
    const response = await axios.get(
      `${config.BASE_URL}/hp/wizards/name/${name}`,
    );
    return response.data;
  }

  static async getFlips(): Promise<FlipRaw[]> {
    const response = await axios.get(`${config.BASE_URL}/hp/flips`);
    return response.data;
  }

  static async sendFlip(param: {
    knowledgeId: string | undefined;
    statId: string | undefined;
    wizardId: string;
  }) {
    await axios.post(`${config.BASE_URL}/hp/flips`, {
      wizardId: param.wizardId,
      knowledgeId: param.knowledgeId,
      statId: param.statId,
    });
  }

  static async updateWizard(newWizard: Wizard) {
    await axios.put(`${config.BASE_URL}/hp/wizards`, newWizard);
  }

  static async getStats(): Promise<StatRaw[]> {
    const response = await axios.get(`${config.BASE_URL}/hp/stats`);
    return response.data;
  }

  static async getKnowledges(): Promise<KnowledgeRaw[]> {
    const response = await axios.get(`${config.BASE_URL}/hp/knowledges`);
    return response.data;
  }

  static async createWizard(toCreate: {
    stats: { level: number; id: string }[];
    name: string;
    category: string;
    knowledges: { level: number; id: string }[];
    spells: { difficulty: Difficulty; id: string }[];
  }) {
    await axios.post(`${config.BASE_URL}/hp/wizards`, toCreate);
  }

  static async getSpells(): Promise<SpellRaw[]> {
    const response = await axios.get(`${config.BASE_URL}/hp/spells`);
    return response.data;
  }
}
