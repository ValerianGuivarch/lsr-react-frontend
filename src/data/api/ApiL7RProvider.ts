import {Roll} from "../../domain/models/Roll";
import {L7RApi} from "./L7RApi";
import {RollRaw} from "./RollRaw";
import {CharacterPreviewRaw} from "./CharacterPreviewRaw";
import {CharacterPreview} from "../../domain/models/CharacterPreview";
import {Character} from "../../domain/models/Character";
import {CharacterUpdateRequest} from "./CharacterUpdateRequest";
import {CharacterRaw} from "./CharacterRaw";

export interface ApiResponse {
    error: boolean
    message: string
}
export class ApiL7RProvider {

    static async sendNewTurn(): Promise<void> {
        await L7RApi.sendNewTurn();
    }
    static async sendRoll(p:
        {
            skillName: string,
            characterName: string,
            focus: boolean,
            power: boolean,
            proficiency: boolean,
            secret: boolean,
            bonus: number,
            malus: number,
            empiriqueRoll?: string
        }
        ): Promise<ApiResponse> {
        try {
            await L7RApi.sendRoll(p);
            return {
                error: false,
                message: "Roll sent"
            }
        } catch (e: any) {
            return {
                error: true,
                message: e.response.data.message
            }
        }
    }
    static async getRolls(): Promise<Roll[]> {
        const response = await L7RApi.getRolls();
        return response.map((roll: RollRaw) => {
            return new Roll(roll);
        });
    }

    static async getPJs(): Promise<CharacterPreview[]> {
        const response = await L7RApi.getPJs();
        return response.map((characterPreview: CharacterPreviewRaw) => {
            return new CharacterPreview(characterPreview);
        });
    }

    static async getCharacterByName (characterName: string): Promise<Character> {
        const response = await L7RApi.getCharacterByName(characterName);
        return new Character(response);
    }

    static async updateCharacter(character: Character): Promise<Character> {
        const characterUpdateRequest = new CharacterUpdateRequest(character);
        const response = await L7RApi.updateCharacter(character.name, characterUpdateRequest);
        return new Character(response);
    }

    static async getSessionCharacters(): Promise<Character[]> {
        const response = await L7RApi.getSessionCharacter();
        return response.map((character: CharacterRaw) => {
            return new Character(character);
        })
    }

    static async getControlledCharacters(characterName: string): Promise<Character[]> {
        const response = await L7RApi.getControlledCharacters(characterName);
        return response.map((character: CharacterRaw) => {
            return new Character(character);
        })
    }
}