import { Roll } from "../../domain/models/Roll";
import { L7RApi } from "./L7RApi";
import { RollRaw } from "./RollRaw";
import { CharacterPreviewRaw } from "./CharacterPreviewRaw";
import { CharacterPreview } from "../../domain/models/CharacterPreview";
import { Character } from "../../domain/models/Character";
import { CharacterUpdateRequest } from "./CharacterUpdateRequest";
import { CharacterRaw } from "./CharacterRaw";
import { Skill } from "../../domain/models/Skill";
import { SkillRaw } from "./SkillRaw";
import { Wizard } from "../../domain/models/Wizard";
import { Stat } from "../../domain/models/Stat";
import { WizardStat } from "../../domain/models/WizardStat";
import { WizardKnowledge } from "../../domain/models/WizardKnowledge";
import { Flip } from "../../domain/models/Flip";
import { Knowledge } from "../../domain/models/Knowledge";
import { Category } from "../../domain/models/Category";
import { SchoolCategory } from "../../domain/models/SchoolCategory";

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
      console.error("ERRORR");
      throw e.response.data.message;
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
    skillId: string,
    dailyUse: number | undefined,
    dailyUseMax: number | undefined,
    affected: boolean,
    arcaneDetteToDecrease?: number | undefined,
  ): Promise<void> {
    await L7RApi.updateCharacterSkillsAttribution(
      characterName,
      skillId,
      dailyUse,
      dailyUseMax,
      affected,
      arcaneDetteToDecrease,
    );
  }

  static async getArcanePrimes(name: string): Promise<Skill[]> {
    const response = await L7RApi.getArcanePrimes(name);
    return response.map((skill: SkillRaw) => {
      return new Skill(skill);
    });
  }

  static async getSpeaking() {
    return await L7RApi.getSpeaking();
  }

  static async putSpeaking(characterName: string) {
    await L7RApi.putSpeaking(characterName);
  }

  static async getWizardByName(name: string) {
    const wizardRaw = await L7RApi.getWizardByName(name);
    return new Wizard({
      id: wizardRaw.id,
      name: wizardRaw.name,
      category: wizardRaw.category,
      stats: wizardRaw.stats.map((stat) => new WizardStat(stat)),
      knowledges: wizardRaw.knowledges.map(
        (knowledge) =>
          new WizardKnowledge({
            knowledge: knowledge.knowledge,
            level: knowledge.level,
          }),
      ),
    });
  }

  static async getFlips() {
    return (await L7RApi.getFlips()).map((flip) => {
      return new Flip({
        id: flip.id,
        wizardName: flip.wizardName,
        text: flip.text,
        result: flip.result,
        base: flip.base,
        modif: flip.modif,
      });
    });
  }

  static async sendFlip(param: {
    knowledgeId: string | undefined;
    statId: string | undefined;
    wizardId: string;
  }) {
    await L7RApi.sendFlip(param);
  }

  static async updateWizard(newWizard: Wizard) {
    await L7RApi.updateWizard(newWizard);
  }

  static async getStats() {
    return (await L7RApi.getStats()).map((stat) => {
      return new Stat(stat);
    });
  }

  static async getKnowledges() {
    return (await L7RApi.getKnowledges()).map((knowledge) => {
      return new Knowledge(knowledge);
    });
  }

  static async createWizard(toCreate: {
    stats: { level: number; id: string }[];
    name: string;
    category: string;
    knowledges: { level: number; id: string }[];
  }) {
    await L7RApi.createWizard(toCreate);
  }
}
