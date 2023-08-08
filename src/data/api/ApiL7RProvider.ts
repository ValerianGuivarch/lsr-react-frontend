import {Roll} from "../../domain/models/Roll";
import {L7RApi} from "./L7RApi";
import {RollRaw} from "../RollRaw";
import {CharacterPreviewRaw} from "../CharacterPreviewRaw";
import {CharacterPreview} from "../../domain/models/CharacterPreview";
import {Character} from "../../domain/models/Character";
import {CharacterUpdateRequest} from "../CharacterUpdateRequest";

export class ApiL7RProvider {

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
        ) {
        try {
            await L7RApi.sendRoll(p);
        } catch (e: any) {
            alert(e.response.data.message);
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
        const response = await L7RApi.updateCharacter(characterUpdateRequest);
        return new Character(response);
    }
}